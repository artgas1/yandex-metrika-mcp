/**
 * Контракт переменных окружения: что сервер читает, то и обещано снаружи.
 *
 * Отказ, который здесь ловится, случился по-настоящему. В 3.0.0 поверхность
 * стала профильной, а `smithery.yaml` остался с прошлой картиной мира: он не
 * знал про `METRIKA_PROFILE` вовсе и уверял, что меняющие инструменты «остаются
 * видимыми и отказывают на вызове» — то есть описывал сервер, которого уже нет.
 * Заметить это можно было только глазами: ни типизация, ни тесты установочный
 * манифест не читают, а страница каталога — единственное, что видит человек,
 * ставящий сервер в один клик.
 *
 * Поэтому сверяются три списка имён: то, что читает код, то, что объявлено
 * в `smithery.yaml`, и то, что описано таблицей в обоих README. Расхождение в
 * любую сторону — переменную добавили, убрали или переименовали, а установочная
 * поверхность осталась прежней.
 *
 * Проверяются ИМЕНА, не текст описаний: смысл словами тест не поймает, а вот
 * молчаливое исчезновение переменной из документации — поймает.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));

/** Имена, которые сервер действительно читает из окружения. */
function readByCode() {
  const names = new Set();
  for (const file of readdirSync(join(root, 'src'))) {
    if (!file.endsWith('.ts')) continue;
    const text = readFileSync(join(root, 'src', file), 'utf8');
    for (const m of text.matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)) names.add(m[1]);
  }
  return names;
}

/** Имена, объявленные в configSchema установочного манифеста Smithery. */
function declaredBySmithery() {
  const text = readFileSync(join(root, 'smithery.yaml'), 'utf8');
  const schema = text.slice(text.indexOf('properties:'));
  return new Set([...schema.matchAll(/^ {6}([A-Z][A-Z0-9_]*):$/gm)].map((m) => m[1]));
}

/** Имена из таблицы переменных в README — первый столбец, в обратных кавычках. */
function documentedBy(readme) {
  const text = readFileSync(join(root, readme), 'utf8');
  return new Set([...text.matchAll(/^\| `([A-Z][A-Z0-9_]*)` \|/gm)].map((m) => m[1]));
}

const code = readByCode();

test('сервер вообще читает окружение — иначе проверять нечего', () => {
  assert.ok(code.size >= 5, `в src найдено ${code.size} переменных, ожидалось не меньше пяти`);
  assert.ok(code.has('YANDEX_API_KEY'), 'обязательный токен не читается — сломан сам замер');
});

test('smithery.yaml объявляет ровно то, что читает сервер', () => {
  const declared = declaredBySmithery();
  const missing = [...code].filter((n) => !declared.has(n)).sort();
  const extra = [...declared].filter((n) => !code.has(n)).sort();
  assert.deepEqual(
    { missing, extra },
    { missing: [], extra: [] },
    `smithery.yaml разошёлся с кодом: не объявлено ${JSON.stringify(missing)}, ` +
      `объявлено лишнее ${JSON.stringify(extra)}`,
  );
});

for (const readme of ['README.md', 'README.en.md']) {
  test(`${readme} описывает ровно то, что читает сервер`, () => {
    const documented = documentedBy(readme);
    const missing = [...code].filter((n) => !documented.has(n)).sort();
    const extra = [...documented].filter((n) => !code.has(n)).sort();
    assert.deepEqual(
      { missing, extra },
      { missing: [], extra: [] },
      `${readme} разошёлся с кодом: не описано ${JSON.stringify(missing)}, ` +
        `описано лишнее ${JSON.stringify(extra)}`,
    );
  });
}
