#!/usr/bin/env node
/**
 * Собирает справочник методов для скилла из спеки.
 *
 * Зачем генератор, а не файл, написанный руками. Все существующие скиллы по
 * Метрике держат такой список прозой, и он протухает молча: Яндекс добавляет
 * метод, скилл про него не знает, а читатель не может отличить «метода нет» от
 * «скилл устарел». У нас спека синкается ежедневно (api-sync.yml) и покрыта
 * тестом на дрейф — значит справочник обязан быть её производной, а не копией.
 *
 * Запускается в связке `npm run spec:build`, то есть при каждой пересборке спеки.
 * Тест test/skill.test.mjs сверяет, что закоммиченный файл равен тому, что
 * сгенерировалось бы сейчас: расхождение — это забытая пересборка, а не мнение.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SPEC_PATH = new URL('../spec/metrika-api.json', import.meta.url);
const OUT_PATH = new URL('../skills/yandex-metrika/references/methods.md', import.meta.url);

const SECTIONS = [
  ['stat', 'Stat API — отчёты', 'Агрегированные отчёты: таблица, динамика, детализация, сравнение.'],
  [
    'management',
    'Management API — счётчики, цели, сегменты, доступы',
    'Всё, что описывает счётчик: сам счётчик, цели, сегменты, фильтры, доступы, импорт данных.',
  ],
  [
    'logs',
    'Logs API — сырые визиты и хиты',
    'Выгрузка необработанных данных. Порядок обязателен: evaluate → create → опрос статуса → download → clean.',
  ],
];

/** Обязательные входы метода: части пути плюс обязательные параметры запроса и тела. */
function requiredNames(method) {
  const names = [];
  for (const p of method.params.path) names.push(p.name);
  for (const p of [...method.params.query, ...method.params.body]) {
    if (p.required) names.push(p.name);
  }
  // Плейсхолдер пути, не описанный в таблице параметров, всё равно обязателен.
  for (const m of method.url.matchAll(/\{(\w+)\}/g)) {
    if (!names.includes(m[1])) names.push(m[1]);
  }
  return [...new Set(names)];
}

/** Одна строка заголовка метода: имя, глагол, назначение, обязательные входы. */
function line(method) {
  const title = (method.title ?? method.indexTitle ?? '').replace(/\s+/g, ' ').trim();
  const req = requiredNames(method);
  const reqText = req.length ? ` Обязательно: ${req.map((n) => `\`${n}\``).join(', ')}.` : ' Без обязательных параметров.';
  const write = method.http === 'GET' ? '' : ' **меняет данные**';
  return `- \`${method.tool}\` · ${method.http}${write} — ${title}.${reqText} [док](${method.docUrl})`;
}

export function buildReference(spec) {
  const out = [];
  out.push('# Методы API Яндекс Метрики');
  out.push('');
  out.push(
    'Файл собран из `spec/metrika-api.json` скриптом `tools/build-skill-reference.mjs`. ' +
      'Руками не правится: спека обновляется из документации Яндекса ежедневно, и правка потерялась бы ' +
      'при первой же пересборке.',
  );
  out.push('');
  out.push(
    `Всего методов: **${spec.methods.length}**. ` +
      'Вызов: `npx -y yandex-metrika-mcp-server call <имя> --параметр значение`. ' +
      'Полный список параметров одного метода: `... describe <имя>`.',
  );
  out.push('');
  out.push(
    'Помеченные «меняет данные» требуют `METRIKA_ALLOW_WRITES=1`. Без неё они отказывают, ' +
      'не обращаясь к API: удалённую цель или счётчик восстановить нечем.',
  );
  out.push('');

  for (const [api, heading, blurb] of SECTIONS) {
    const methods = spec.methods.filter((m) => m.api === api).sort((a, b) => a.tool.localeCompare(b.tool));
    if (!methods.length) continue;
    out.push(`## ${heading}`);
    out.push('');
    out.push(blurb);
    out.push('');
    for (const m of methods) out.push(line(m));
    out.push('');
  }

  // Разделы спеки, не попавшие в список выше, потерялись бы молча.
  const known = new Set(SECTIONS.map(([api]) => api));
  const rest = spec.methods.filter((m) => !known.has(m.api));
  if (rest.length) {
    out.push('## Прочее');
    out.push('');
    out.push('Разделы, появившиеся в спеке после последней правки генератора.');
    out.push('');
    for (const m of rest.sort((a, b) => a.tool.localeCompare(b.tool))) out.push(line(m));
    out.push('');
  }

  return `${out.join('\n').trimEnd()}\n`;
}

export function loadSpecFile() {
  return JSON.parse(readFileSync(SPEC_PATH, 'utf8'));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const spec = loadSpecFile();
  const text = buildReference(spec);
  writeFileSync(fileURLToPath(OUT_PATH), text, 'utf8');
  const lines = text.split('\n').length;
  process.stderr.write(`справочник собран: ${spec.methods.length} методов, ${lines} строк, ${Buffer.byteLength(text)} Б\n`);
}
