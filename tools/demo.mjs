#!/usr/bin/env node
/**
 * Живое демо: поднимает сервер и говорит с ним по настоящему JSON-RPC.
 *
 * Отличие от нарисованной картинки принципиальное. Всё, что печатается ниже,
 * взято ИЗ ОТВЕТА сервера — версия из `initialize`, число инструментов из
 * `tools/list`, строка добавленного фильтра из `_meta.applied_by_server`,
 * строки отчёта из тела ответа. Ничего не вписано в макет руками, поэтому
 * демо не может разойтись с поведением: разойдётся — увидим на записи.
 *
 * Токен и сеть не нужны: запросы уводятся на локальную заглушку через
 * METRIKA_API_BASE. Числа поэтому заглушечные, и демо об этом говорит само.
 *
 * Запуск: node tools/demo.mjs   (через npm run demo)
 * Запись: vhs demo.tape
 */
import { createServer } from 'node:http';
import { startServer } from './mcp-client.mjs';

const C = {
  dim: '[38;5;245m',
  ink: '[38;5;252m',
  ya: '[38;5;203m',
  ok: '[38;5;114m',
  off: '[0m',
};

const ROWS = [
  { dimensions: [{ name: 'Поиск' }], metrics: [3552, 3278] },
  { dimensions: [{ name: 'Реклама' }], metrics: [287, 274] },
  { dimensions: [{ name: 'Прямые заходы' }], metrics: [243, 194] },
];

const pad = (s, n) => s + ' '.repeat(Math.max(0, n - [...s].length));
const say = (k, v) => console.log(`  ${C.dim}${pad(k, 26)}${C.off}${v}`);

const stub = createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ query: {}, data: ROWS, total_rows: ROWS.length, sampled: false }));
});
await new Promise((r) => stub.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${stub.address().port}`;

const client = startServer({ YANDEX_API_KEY: 'demo', METRIKA_API_BASE: base });
try {
  const info = await client.initialize('demo');
  await client.listAllTools();

  console.log();
  // Счёт берём у самого сервера: 11 в tools/list — это 10 методов API плюс
  // служебный каталог, и смешивать их в одной цифре значит соврать в мелочи.
  const cat = JSON.parse((await client.callTool('metrika_catalog_list', {})).content[0].text);

  say('сервер', `${C.ink}${info.serverInfo.name} ${info.serverInfo.version}${C.off}`);
  say('методов объявлено', `${C.ink}${cat.api_methods_declared}${C.off} ${C.dim}из ${cat.api_methods_total}${C.off}`);

  const res = await client.callTool('metrika_stat_data', {
    ids: [12345678],
    metrics: 'ym:s:visits,ym:s:users',
    dimensions: 'ym:s:trafficSource',
    date1: '7daysAgo',
    date2: 'today',
  });
  const payload = JSON.parse(res.content[0].text);

  say('вызов', `${C.ya}metrika_stat_data${C.off}`);
  console.log();

  // Ровно то, что сервер объявил о своей собственной добавке. Не пересказ.
  for (const line of payload._meta.applied_by_server ?? []) {
    console.log(`  ${C.ya}+${C.off} ${C.dim}${line}${C.off}`);
  }
  console.log();

  for (const row of payload.data.data) {
    const [visits, users] = row.metrics;
    console.log(
      `  ${C.ink}${pad(row.dimensions[0].name, 20)}${C.off}` +
        `${C.ok}${String(visits).padStart(6)}${C.off}${C.dim}  визитов, ${users} человек${C.off}`,
    );
  }
  console.log(`\n  ${C.dim}данные из локальной заглушки — ни токена, ни сети${C.off}\n`);
} finally {
  client.close();
  stub.close();
}
