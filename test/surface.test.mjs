/**
 * Контракт поверхности: сколько инструментов сервер объявляет и сколько это
 * стоит клиенту.
 *
 * Зачем отдельный файл. Описания всех объявленных инструментов лежат в контексте
 * модели на КАЖДОМ ходу — вызываешь ты их или нет. Это единственная цена сервера,
 * которую платят всегда, и она растёт молча: новый метод в документации Яндекса
 * приезжает ночной синхронизацией, тесты остаются зелёными, а манифест тяжелеет.
 * Счётчик инструментов этого не ловит — вес одного инструмента здесь гуляет от
 * 544 до 6313 байт. Поэтому порог стоит на БАЙТАХ, а не на числе инструментов.
 *
 * Порог намеренно близок к текущему замеру: он обязан краснеть на заметном
 * приросте, а не через год. Вырос осознанно — подвинь число и напиши в
 * CHANGELOG, почему поверхность подорожала.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from '../tools/mcp-client.mjs';
import { CORE_TOOLS } from '../build/profiles.js';

/** Замер 08.09.2026: core 31 511 Б. Потолок — с запасом в ~10%. */
const CORE_BYTES_MAX = 35_000;
/** Замер 08.09.2026: полный каталог с записью 157 631 Б. */
const ALL_BYTES_MAX = 175_000;
/** Ориентир вендоров: набор по умолчанию — единицы инструментов, не десятки. */
const CORE_TOOLS_MAX = 15;

async function surface(env) {
  const client = startServer({ YANDEX_API_KEY: 'stub-token', ...env });
  try {
    const info = await client.initialize('surface');
    const tools = await client.listAllTools();
    return { tools, bytes: JSON.stringify({ tools }).length, info };
  } finally {
    client.close();
  }
}

test('набор по умолчанию — core, и он умещается в бюджет контекста', async () => {
  const { tools, bytes } = await surface({});
  assert.deepEqual(
    tools.map((t) => t.name).sort(),
    [...CORE_TOOLS].sort(),
    'умолчание разошлось со списком CORE_TOOLS',
  );
  assert.ok(tools.length <= CORE_TOOLS_MAX, `по умолчанию объявлено ${tools.length} инструментов`);
  assert.ok(bytes <= CORE_BYTES_MAX, `tools/list по умолчанию весит ${bytes} Б при потолке ${CORE_BYTES_MAX}`);
});

test('полный каталог тоже под порогом — иначе прирост уедет незамеченным', async () => {
  const { tools, bytes } = await surface({ METRIKA_PROFILE: 'all', METRIKA_ALLOW_WRITES: '1' });
  assert.ok(tools.length > CORE_TOOLS_MAX, 'профиль all обязан быть шире core, иначе тест ничего не проверяет');
  assert.ok(bytes <= ALL_BYTES_MAX, `tools/list профиля all весит ${bytes} Б при потолке ${ALL_BYTES_MAX}`);
});

test('профиль read не содержит ни одного меняющего данные инструмента', async () => {
  const { tools } = await surface({ METRIKA_PROFILE: 'read' });
  const writers = tools.filter((t) => t.annotations?.readOnlyHint !== true).map((t) => t.name);
  assert.deepEqual(writers, [], 'в read-профиль просочились инструменты с записью');
  assert.ok(tools.length > CORE_TOOLS.length, 'read обязан быть шире core');
});

test('неизвестный профиль роняет старт с внятным сообщением, а не молча даёт пустой набор', async () => {
  const client = startServer({ YANDEX_API_KEY: 'stub-token', METRIKA_PROFILE: 'полный' });
  await assert.rejects(() => client.initialize('bad-profile'));
  assert.match(client.stderr, /неизвестный профиль/);
  client.close();
});

test('у каждого объявленного инструмента заполнены аннотации и схема закрыта', async () => {
  const { tools } = await surface({ METRIKA_PROFILE: 'all', METRIKA_ALLOW_WRITES: '1' });
  const noAnnotations = tools.filter((t) => !t.annotations).map((t) => t.name);
  const noTitle = tools.filter((t) => !(t.title || t.annotations?.title)).map((t) => t.name);
  const openSchema = tools.filter((t) => t.inputSchema?.additionalProperties !== false).map((t) => t.name);
  // Умолчания спеки враждебны молчащему серверу: отсутствующий хинт читается
  // как самое строгое значение, а открытая схема — это приглашение модели
  // придумать параметр.
  assert.deepEqual(noAnnotations, [], 'инструменты без annotations');
  assert.deepEqual(noTitle, [], 'инструменты без title');
  assert.deepEqual(openSchema, [], 'схемы без additionalProperties:false');
});

test('порядок tools/list детерминирован — иначе промах кэша у каждого клиента', async () => {
  const a = await surface({});
  const b = await surface({});
  assert.deepEqual(a.tools.map((t) => t.name), b.tools.map((t) => t.name));
});

test('instructions умещаются в 2 КБ — клиенты режут молча', async () => {
  const { info } = await surface({});
  const text = info?.instructions ?? '';
  assert.ok(text.length > 0, 'instructions пусты: клиент не узнает, что видит не весь каталог');
  assert.ok(text.length <= 2048, `instructions ${text.length} Б — клиент обрежет`);
  assert.match(text, /METRIKA_PROFILE=all/, 'не сказано, как расширить поверхность');
});
