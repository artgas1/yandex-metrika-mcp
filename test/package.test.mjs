/**
 * Что уезжает в npm — уезжает навсегда: версию нельзя переиздать, можно только
 * выпустить следующую. Поэтому состав пакета проверяется тестом, а не глазами
 * перед публикацией.
 *
 * Ловится два класса: следы конкретного проекта в общем пакете (идентификаторы
 * счётчиков, домены, числа из чужих отчётов) и попадание в архив лишнего.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

/** Список файлов архива — спрашиваем у самого npm, а не угадываем по `files`. */
function packedFiles() {
  const out = execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: root, encoding: 'utf8' });
  return JSON.parse(out)[0].files.map((f) => f.path);
}

test('в архив не попадает ничего лишнего', () => {
  const files = packedFiles();
  for (const f of files) {
    assert.ok(
      /^(build\/|spec\/|README|CHANGELOG|LICENSE|package\.json)/.test(f),
      `в пакет уехал посторонний файл: ${f}`,
    );
  }
  // Тесты, инструменты сборки и кеш документации в пакете не нужны никому.
  for (const forbidden of ['test/', 'tools/', '.cache/', 'node_modules/', 'src/']) {
    assert.ok(!files.some((f) => f.startsWith(forbidden)), `${forbidden} уехал в пакет`);
  }
  assert.ok(files.includes('build/index.js') && files.includes('spec/metrika-api.json'));
});

test('в пакете нет следов конкретного проекта', () => {
  const files = packedFiles().filter((f) => /\.(js|md|json)$/.test(f) && !f.startsWith('spec/'));
  const problems = [];

  for (const f of files) {
    const text = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    // Идентификатор счётчика Метрики — 8-9 цифр подряд. В spec/ такие числа
    // приходят из примеров самого Яндекса, поэтому он исключён выше.
    for (const m of text.matchAll(/\b\d{8,9}\b/g)) problems.push(`${f}: счётчик ${m[0]}`);
    // «наш» в публичном пакете читателю ничего не сообщает — у него другой сайт.
    for (const m of text.matchAll(/\b(наш|наши|наше|нашего|нашей|наших|нашем)\b/gi)) {
      problems.push(`${f}: «${m[0]}» — чей?`);
    }
  }
  assert.deepEqual(problems, [], `следы проекта в пакете:\n  ${problems.join('\n  ')}`);
});

test('в исходниках репозитория тоже нет следов конкретного проекта', (t) => {
  // Пакет чист (проверено выше), но репозиторий публичный: идентификатор
  // счётчика и числа чужих отчётов в комментариях и фикстурах читаются так же.
  let files;
  try {
    files = execFileSync('git', ['ls-files', 'src', 'test', 'tools', '*.md'], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).split('\n').filter(Boolean);
  } catch {
    // Распакованный архив — не checkout. Пропуск честнее зелёного: проверка
    // не выполнилась, и молчать об этом нельзя.
    t.skip('не git-репозиторий — исходники не проверены');
    return;
  }

  const problems = [];
  for (const f of files) {
    const text = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    for (const m of text.matchAll(/\b\d{8,9}\b/g)) problems.push(`${f}: похоже на счётчик — ${m[0]}`);
    for (const m of text.matchAll(/\b(наш|наши|наше|нашего|нашей|наших|нашем)\b/gi)) {
      problems.push(`${f}: «${m[0]}» — чей?`);
    }
  }
  assert.deepEqual(problems, [], `следы проекта в исходниках:\n  ${problems.join('\n  ')}`);
});

test('обещанное в README имя пакета совпадает с настоящим', () => {
  for (const readme of ['README.md', 'README.en.md']) {
    const text = readFileSync(new URL(`../${readme}`, import.meta.url), 'utf8');
    assert.ok(text.includes(`npx -y ${pkg.name}`), `${readme}: команда установки называет не тот пакет`);
    // Реестр MCP проверяет владение по mcpName; маркер в README — для PyPI,
    // но пусть оба говорят одно и то же, иначе расхождение всплывёт при выпуске.
    assert.ok(text.includes(`mcp-name: ${pkg.mcpName}`), `${readme}: маркер mcp-name разошёлся с package.json`);
  }
});
