#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { loadSpec, type Method } from './spec.js';
import { isWrite } from './annotations.js';
import { apiOrigin } from './http.js';
import { DEFAULT_MAX_OUTPUT_CHARS, DEFAULT_TRAFFIC_FILTER, registerAll, trafficFilter } from './tools.js';

/**
 * Версия берётся из package.json, а не переписывается здесь руками: разошедшийся
 * serverInfo.version — это то, чего никто не замечает, пока не понадобится
 * понять, какая сборка отвечает.
 */
const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8'),
) as { version: string };

const token = process.env.YANDEX_API_KEY;
if (!token) {
  console.error(
    'Не задан YANDEX_API_KEY — OAuth-токен Яндекс Метрики. ' +
      'Задайте его в env-секции записи сервера в .mcp.json и перезапустите клиента.',
  );
  process.exit(1);
}

const spec = loadSpec();

if (spec.problems.length) {
  // Спека с проблемами — это спека, которой нельзя доверять: часть методов
  // могла разобраться неполно. Лучше отказаться, чем отдавать инструменты,
  // тихо потерявшие параметры.
  console.error(`В спеке ${spec.problems.length} проблем разбора. Перегенерируйте: node tools/parse-spec.mjs`);
  for (const p of spec.problems.slice(0, 10)) console.error('  •', p);
  process.exit(1);
}

/**
 * Запись выключена по умолчанию. Среди 108 методов четырнадцать DELETE и
 * пять удаляющих POST: цена ошибочного вызова — удалённый счётчик или цель,
 * а восстановить историю нечем. Включается осознанно, переменной окружения.
 */
const allowWrites = /^(1|true|yes)$/i.test(process.env.METRIKA_ALLOW_WRITES ?? '');

/**
 * Отбор инструментов. Пусто — все 108. Иначе список через запятую: имена
 * разделов API (management, stat, logs), префикс имени инструмента
 * (metrika_goal) или точное имя. Нужен там, где контекст дороже покрытия.
 */
const filter = (process.env.METRIKA_TOOLS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const include = filter.length
  ? (m: Method) => filter.some((f) => f === m.api || m.tool === f || m.tool.startsWith(`${f}_`) || m.tool.startsWith(f))
  : undefined;

const maxOutputChars = Number(process.env.METRIKA_MAX_OUTPUT_CHARS ?? DEFAULT_MAX_OUTPUT_CHARS);

const server = new McpServer({
  name: 'yandex-metrika-mcp-server',
  version: pkg.version,
  title: 'Яндекс Метрика',
  description:
    'Полное покрытие API Яндекс Метрики: Stat, Management и Logs. ' +
    'Инструменты порождены из спеки, собранной по официальной документации.',
  websiteUrl: 'https://github.com/artgas1/yandex-metrika-mcp',
});

const count = registerAll(server, spec, token, { allowWrites, maxOutputChars, include });

if (count === 0) {
  console.error(`METRIKA_TOOLS=${process.env.METRIKA_TOOLS} не выбрал ни одного инструмента.`);
  process.exit(1);
}

const overriddenOrigin = apiOrigin();
if (overriddenOrigin) {
  // Подмена адреса означает, что OAuth-токен уедет не на api-metrika.yandex.net.
  // Молчать об этом нельзя.
  console.error(`ВНИМАНИЕ: METRIKA_API_BASE переопределён — запросы и токен уходят на ${overriddenOrigin}.`);
}

const transport = new StdioServerTransport();
await server.connect(transport);

const shown = spec.methods.filter((m) => !include || include(m));
const writes = shown.filter(isWrite).length;

console.error(
  `yandex-metrika-mcp ${pkg.version}: инструментов ${count} из ${spec.methods.length} ` +
    `(management ${shown.filter((m) => m.api === 'management').length}, ` +
    `stat ${shown.filter((m) => m.api === 'stat').length}, ` +
    `logs ${shown.filter((m) => m.api === 'logs').length}); ` +
    `меняющих данные ${writes} — ${allowWrites ? 'РАЗРЕШЕНЫ (METRIKA_ALLOW_WRITES)' : 'заблокированы'}.`,
);

const activeFilter = trafficFilter();
if (activeFilter !== DEFAULT_TRAFFIC_FILTER) {
  // Своё условие меняет ЧИСЛА в каждом отчёте. Молча этого делать нельзя.
  console.error(`yandex-metrika-mcp: METRIKA_TRAFFIC_FILTER задан — отчёты Stat режутся условием ${activeFilter}`);
}

const shutdown = (signal: string) => {
  console.error(`yandex-metrika-mcp: ${signal}, закрываю транспорт.`);
  void server.close().finally(() => process.exit(0));
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
