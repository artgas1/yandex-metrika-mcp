#!/usr/bin/env node
/**
 * Живой прогон: что уходит в сервер и что он отвечает.
 *
 * Показывается ровно пара «запрос → ответ». Версия сервера, число объявленных
 * инструментов и прочая внутренняя кухня отсюда убраны намеренно: читателю от
 * них ничего не прибавляется, а место они занимают. Первая версия этого демо
 * состояла из них почти целиком и была нечитаемой.
 *
 * Всё, что печатается, взято ИЗ ОТВЕТА сервера — строка добавленного фильтра
 * из `_meta.applied_by_server`, строки отчёта из тела. Ничего не вписано
 * руками, поэтому демо не может разойтись с поведением молча.
 *
 * Токен и сеть не нужны: запросы уводятся на локальную заглушку через
 * METRIKA_API_BASE, поэтому прогон воспроизводится где угодно, включая CI.
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

/** Аргументы вызова — они же то, что показывается как «запрос». */
const ARGS = {
  ids: [1],
  dimensions: 'ym:s:trafficSource',
  metrics: 'ym:s:visits,ym:s:users',
  date1: '7daysAgo',
  date2: 'today',
};

const pad = (s, n) => s + ' '.repeat(Math.max(0, n - [...s].length));

const stub = createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ query: {}, data: ROWS, total_rows: ROWS.length, sampled: false }));
});
await new Promise((r) => stub.listen(0, '127.0.0.1', r));

const client = startServer({
  YANDEX_API_KEY: 'demo',
  METRIKA_API_BASE: `http://127.0.0.1:${stub.address().port}`,
});

try {
  await client.initialize('demo');

  console.log(`\n  ${C.dim}запрос${C.off}   ${C.ya}metrika_stat_data${C.off}`);
  for (const [k, v] of Object.entries(ARGS)) {
    if (k === 'ids') continue; // идентификатор счётчика читателю ничего не говорит
    console.log(`           ${C.dim}${pad(k, 11)}${C.off}${C.ink}${v}${C.off}`);
  }

  const res = await client.callTool('metrika_stat_data', ARGS);
  const payload = JSON.parse(res.content[0].text);

  console.log(`\n  ${C.dim}ответ${C.off}`);
  // То, что сервер объявил о собственной добавке. Не пересказ — его слова.
  for (const line of payload._meta.applied_by_server ?? []) {
    console.log(`           ${C.ya}+${C.off} ${C.dim}${line}${C.off}`);
  }
  console.log();
  for (const row of payload.data.data) {
    const [visits, users] = row.metrics;
    console.log(
      `           ${C.ink}${pad(row.dimensions[0].name, 16)}${C.off}` +
        `${C.ok}${String(visits).padStart(5)}${C.off}${C.dim} визитов, ${users} человек${C.off}`,
    );
  }
  console.log();
} finally {
  client.close();
  stub.close();
}
