/**
 * Контракт инструмента, который рассказывает про скрытое.
 *
 * Отказ, который он ловит: каталог разошёлся с реальным набором. Такой отказ
 * хуже отсутствия каталога — человек получает уверенный ответ «этого сервер не
 * умеет» про инструмент, который объявлен, или наоборот идёт включать профиль,
 * который ничего не добавит. Поэтому проверяется не «инструмент отвечает», а
 * совпадение его ответа с тем, что реально лежит в tools/list.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from '../tools/mcp-client.mjs';

const SPEC = JSON.parse(
  await import('node:fs').then((fs) => fs.readFileSync(new URL('../spec/metrika-api.json', import.meta.url), 'utf8')),
);

async function ask(env) {
  const client = startServer({ YANDEX_API_KEY: 'stub-token', ...env });
  try {
    await client.initialize('catalog');
    const tools = await client.listAllTools();
    const res = await client.callTool('metrika_catalog_list', {});
    return { tools, res, catalog: JSON.parse(res.content[0].text) };
  } finally {
    client.close();
  }
}

test('каталог объявлен в любом профиле — иначе спросить будет нечем', async () => {
  for (const env of [{}, { METRIKA_PROFILE: 'read' }, { METRIKA_PROFILE: 'all', METRIKA_ALLOW_WRITES: '1' }]) {
    const { tools } = await ask(env);
    assert.ok(
      tools.some((t) => t.name === 'metrika_catalog_list'),
      `нет каталога при ${JSON.stringify(env)}`,
    );
  }
});

test('перечисленное каталогом совпадает с tools/list, а не живёт своей жизнью', async () => {
  const { tools, catalog } = await ask({});
  const declared = Object.values(catalog.declared_tools).flat().sort();
  const actual = tools
    .map((t) => t.name)
    .filter((n) => n !== 'metrika_catalog_list')
    .sort();
  assert.deepEqual(declared, actual, 'каталог разошёлся с реальным набором');
  assert.equal(catalog.api_methods_declared, actual.length);
});

test('скрытое и объявленное вместе дают всю спеку — ничто не потеряно между ними', async () => {
  const { catalog } = await ask({});
  const declared = Object.values(catalog.declared_tools).flat();
  const hidden = Object.values(catalog.hidden_tools).flat();
  assert.equal(declared.length + hidden.length, SPEC.methods.length);
  assert.equal(catalog.api_methods_total, SPEC.methods.length);
  assert.equal(new Set([...declared, ...hidden]).size, SPEC.methods.length, 'пересечение или дубли');
});

test('в скрытом лежат ровно те имена, которых нет в tools/list', async () => {
  const { tools, catalog } = await ask({});
  const live = new Set(tools.map((t) => t.name));
  const wrongly = Object.values(catalog.hidden_tools)
    .flat()
    .filter((n) => live.has(n));
  assert.deepEqual(wrongly, [], 'каталог считает скрытым то, что объявлено');
});

test('сказано, как включить, и названы обе переменные', async () => {
  const { catalog } = await ask({});
  const text = JSON.stringify(catalog.how_to_widen);
  assert.match(text, /METRIKA_PROFILE=read/);
  assert.match(text, /METRIKA_ALLOW_WRITES=1/);
  assert.equal(catalog.writes_enabled, false);
});

test('когда скрывать нечего — каталог так и говорит, а не молчит', async () => {
  const { catalog } = await ask({ METRIKA_PROFILE: 'all', METRIKA_ALLOW_WRITES: '1' });
  assert.equal(catalog.api_methods_hidden, 0);
  assert.equal(catalog.hidden_tools, undefined);
  assert.equal(catalog.writes_enabled, true);
  assert.match(JSON.stringify(catalog.how_to_widen), /Объявлено всё/);
});

test('каталог не ходит в API и работает без сети', async () => {
  // METRIKA_API_BASE уводит на заведомо мёртвый адрес: если бы инструмент
  // обращался к Метрике, вызов бы упал. Он обязан отвечать из спеки в пакете.
  const { res, catalog } = await ask({ METRIKA_API_BASE: 'http://127.0.0.1:1' });
  assert.notEqual(res.isError, true);
  assert.equal(catalog.api_methods_total, SPEC.methods.length);
});

test('аннотации честные: чтение, не разрушает, наружу не ходит', async () => {
  const { tools } = await ask({});
  const t = tools.find((x) => x.name === 'metrika_catalog_list');
  assert.equal(t.annotations.readOnlyHint, true);
  assert.equal(t.annotations.destructiveHint, false);
  // Единственный инструмент сервера, у которого это false: остальные зовут API.
  assert.equal(t.annotations.openWorldHint, false);
  assert.equal(t.inputSchema.additionalProperties, false);
});
