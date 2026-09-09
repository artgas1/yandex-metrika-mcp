/**
 * Контракт скилла.
 *
 * Скилл — это текст, который читает агент, и у текста нет компилятора. Отказы
 * здесь тихие: скилл называет метод, которого нет, или показывает команду,
 * которой не существует, — и агент получает невнятную ошибку, из которой не
 * следует, что виноват скилл.
 *
 * Отдельно — справочник методов. У всех существующих скиллов по Метрике он
 * написан руками и протухает молча. У нас он производная от спеки, и вот это
 * свойство и проверяется: закоммиченный файл обязан совпадать с тем, что
 * сгенерировалось бы сейчас.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { buildReference, loadSpecFile } from '../tools/build-skill-reference.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const skillDir = join(root, 'skills', 'yandex-metrika');
const read = (rel) => readFileSync(join(skillDir, rel), 'utf8');

const spec = loadSpecFile();
const TOOLS = new Set(spec.methods.map((m) => m.tool));
const SERVICE_TOOLS = new Set(['metrika_catalog_list']);

/** Разбор frontmatter: только то, что нужно, — без зависимости на парсер YAML. */
function frontmatter(text) {
  assert.ok(text.startsWith('---\n'), 'SKILL.md обязан начинаться с frontmatter');
  const end = text.indexOf('\n---', 4);
  assert.ok(end > 0, 'frontmatter не закрыт');
  const out = {};
  for (const line of text.slice(4, end).split('\n')) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return { fields: out, body: text.slice(end + 4) };
}

test('справочник методов совпадает со спекой — иначе он тихо устарел', () => {
  const committed = read('references/methods.md');
  assert.equal(
    committed,
    buildReference(spec),
    'skills/yandex-metrika/references/methods.md разошёлся со спекой. Пересобрать: npm run skill:build',
  );
});

test('в справочнике перечислены ВСЕ методы спеки, без потерянных разделов', () => {
  const text = read('references/methods.md');
  const missing = [...TOOLS].filter((t) => !text.includes(`\`${t}\``));
  assert.deepEqual(missing, [], `методов нет в справочнике: ${missing.join(', ')}`);
});

test('frontmatter скилла заполнен и однострочный', () => {
  const { fields } = frontmatter(read('SKILL.md'));
  assert.ok(fields.name, 'нет поля name');
  assert.ok(fields.description, 'нет поля description');
  assert.equal(fields.name, 'yandex-metrika', 'имя скилла должно совпадать с каталогом');
  assert.ok(
    fields.description.length >= 80,
    `description ${fields.description.length} символов — по нему модель решает, брать ли скилл вообще; ` +
      'слишком короткое описание не срабатывает',
  );
  assert.ok(fields.description.length <= 1024, 'description длиннее 1024 символов режется клиентами');
});

test('описание ловит запрос и по-русски, и по-английски', () => {
  // Пользователи пишут «яндекс метрика», а не yandex metrika. Описание —
  // единственное, что модель видит до загрузки скилла: нет слова — нет срабатывания.
  const { fields } = frontmatter(read('SKILL.md'));
  const d = fields.description.toLowerCase();
  for (const word of ['метрик', 'metrika', 'ym:s:']) {
    assert.ok(d.includes(word), `в description нет «${word}» — скилл не сработает на такой запрос`);
  }
});

test('каждое имя метода, названное в скилле, есть в спеке', () => {
  const files = readdirSync(skillDir, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.md'))
    .map((d) => join(d.parentPath ?? d.path, d.name));
  assert.ok(files.length >= 2, 'ожидались хотя бы SKILL.md и справочник');

  const unknown = new Set();
  for (const file of files) {
    for (const m of readFileSync(file, 'utf8').matchAll(/\bmetrika_[a-z0-9_]+\b/g)) {
      if (!TOOLS.has(m[0]) && !SERVICE_TOOLS.has(m[0])) unknown.add(`${file.replace(root, '')}: ${m[0]}`);
    }
  }
  assert.deepEqual([...unknown], [], 'скилл называет методы, которых нет в спеке');
});

test('команда в скилле совпадает с настоящим именем пакета', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const text = read('SKILL.md');
  assert.ok(
    text.includes(`npx -y ${pkg.name}`),
    `в SKILL.md нет вызова через npx -y ${pkg.name} — читатель не сможет ничего запустить`,
  );
  // Имя bin отличается от имени пакета; перепутать их — рабочая ошибка.
  const bin = Object.keys(pkg.bin)[0];
  assert.ok(!new RegExp(`npx -y ${bin}(?![\\w-])`).test(text), `npx ставит ПАКЕТ (${pkg.name}), а не bin (${bin})`);
});

test('ссылки внутрь скилла ведут в существующие файлы', () => {
  // Скилл — это текст, и битая ссылка в нём тихая: агент пойдёт читать
  // references/dimensions.md, не найдёт, и продолжит по памяти, не сказав об этом.
  const text = read('SKILL.md');
  const broken = [];
  for (const m of text.matchAll(/\]\((?!https?:)([^)#]+)\)/g)) {
    if (!existsSync(join(skillDir, m[1]))) broken.push(m[1]);
  }
  assert.deepEqual(broken, [], `SKILL.md ссылается на несуществующие файлы: ${broken.join(', ')}`);
});

test('скилл лежит там, где его найдёт установщик', () => {
  // `npx skills add owner/repo` обходит каталог skills/ — если переименовать
  // его или уронить SKILL.md уровнем глубже, установка молча ничего не найдёт.
  assert.ok(existsSync(join(root, 'skills')), 'нет каталога skills/');
  assert.ok(existsSync(join(skillDir, 'SKILL.md')), 'нет skills/yandex-metrika/SKILL.md');
});
