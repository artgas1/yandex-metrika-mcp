#!/usr/bin/env node
/**
 * Сборка MCPB-бандла — упаковки сервера для установки в один клик.
 *
 * Зачем это здесь, а не руками. Бандл — самостоятельная копия сервера: манифест
 * с именем, версией и списком инструментов плюс сам код с зависимостями. Копия,
 * которую правят руками, расходится с оригиналом молча: версия в манифесте
 * отстаёт от package.json, список инструментов — от спеки, и заметить это
 * можно только на чужой машине. Поэтому манифест ГЕНЕРИРУЕТСЯ из тех же
 * источников, из которых работает сам сервер.
 *
 * Один бандл открывает два канала: каталог коннекторов Anthropic (ветка
 * «desktop extensions» — отдельная форма, без портала и организации) и
 * Smithery, которой для stdio нужен ровно он же.
 *
 * Запуск: node tools/build-mcpb.mjs [--pack]
 *   без --pack   — только собрать staging-каталог и манифест (быстро, для CI-проверки)
 *   с   --pack   — дополнительно позвать `mcpb pack` и получить .mcpb-файл
 */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const stage = join(root, '.mcpb-build');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const spec = JSON.parse(readFileSync(join(root, 'spec/metrika-api.json'), 'utf8'));

// Список инструментов профиля по умолчанию берём из самого профиля, а не из
// копии: разойтись им тогда физически негде.
const { CORE_TOOLS } = await import(join(root, 'build/profiles.js'));
const byTool = new Map(spec.methods.map((m) => [m.tool, m]));

const missing = CORE_TOOLS.filter((t) => !byTool.has(t));
if (missing.length) {
  console.error(`В спеке нет инструментов профиля core: ${missing.join(', ')}`);
  process.exit(1);
}

const REPO = 'https://github.com/artgas1/yandex-metrika-mcp';

const manifest = {
  manifest_version: '0.3',
  name: pkg.name,
  display_name: 'Яндекс Метрика',
  version: pkg.version,
  description: pkg.description,
  long_description:
    'MCP-сервер к API Яндекс Метрики. Покрыты все 108 методов — Stat, Management и Logs, — ' +
    'но по умолчанию объявляются десять: те, которыми считают. Полный каталог включается ' +
    'переменной METRIKA_PROFILE.\n\n' +
    'Определения инструментов порождены из документации Яндекса, а не написаны руками: сборка ' +
    'разбирает страницы методов в машиночитаемую спеку, которая лежит в репозитории, а ежедневная ' +
    'сверка открывает PR, когда API меняется.\n\n' +
    'Два обещания. Никакой молчаливой подмены: что попросили — то и уходит в API, сервер не ' +
    'досочиняет ни измерений, ни периода, ни фильтров, а всё, что добавил от себя, объявляет в ' +
    'ответе. И узкая поверхность: десять инструментов по умолчанию вместо ста восьми — это ' +
    '31 КБ описаний в контексте вместо 158 КБ на каждом ходу.\n\n' +
    'Инструменты, меняющие данные в Метрике, в этом бандле не объявляются вовсе. Цена ошибочного ' +
    'вызова — удалённый счётчик или цель без возможности восстановить историю, и щёлкать таким ' +
    'переключателем в окне установки нечего. Нужна запись — ставьте пакет с npm и включайте ' +
    'её осознанно, переменной окружения.',
  author: {
    name: 'Artem Gasparyan',
    url: 'https://github.com/artgas1',
  },
  repository: { type: 'git', url: `${REPO}.git` },
  homepage: REPO,
  documentation: `${REPO}#readme`,
  support: `${REPO}/issues`,
  license: pkg.license,
  keywords: pkg.keywords,
  // Обрабатывает данные не этот пакет, а Яндекс как оператор Метрики — поэтому
  // здесь две ссылки: своя политика и его.
  privacy_policies: [`${REPO}/blob/main/PRIVACY.md`, 'https://yandex.ru/legal/confidential/'],
  server: {
    type: 'node',
    entry_point: 'build/index.js',
    mcp_config: {
      command: 'node',
      args: ['${__dirname}/build/index.js'],
      env: {
        YANDEX_API_KEY: '${user_config.api_key}',
        METRIKA_PROFILE: '${user_config.profile}',
        METRIKA_TRAFFIC_FILTER: '${user_config.traffic_filter}',
      },
    },
  },
  tools: CORE_TOOLS.map((tool) => ({
    name: tool,
    description: byTool.get(tool).title ?? byTool.get(tool).indexTitle ?? tool,
  })),
  // Набор зависит от профиля, выбранного при установке, — объявляем это честно.
  tools_generated: true,
  user_config: {
    api_key: {
      type: 'string',
      title: 'OAuth-токен Яндекса',
      description:
        'Токен с доступом к Метрике. Выпускается на oauth.yandex.ru, права — «Получение статистики». ' +
        'Хранится клиентом, сервер его никуда не пишет.',
      sensitive: true,
      required: true,
    },
    profile: {
      type: 'string',
      title: 'Набор инструментов',
      description:
        'core — десять инструментов под задачу «посчитать по счётчику» (по умолчанию). ' +
        'read — все 51 читающих, включая управление и Logs API. ' +
        'Меняющие данные инструменты в бандле недоступны ни в одном профиле.',
      default: 'core',
      required: false,
    },
    traffic_filter: {
      type: 'string',
      title: 'Фильтр трафика в отчётах Stat',
      description:
        'Условие сегментации, которое добавляется к каждому отчёту Stat. По умолчанию режет только ' +
        "роботов по флагу самой Метрики: ym:s:isRobot=='no'. Задаётся целиком, вместе с isRobot.",
      default: "ym:s:isRobot=='no'",
      required: false,
    },
  },
  compatibility: {
    platforms: ['darwin', 'win32', 'linux'],
    runtimes: { node: '>=20.0.0' },
  },
};

// Staging собирается с нуля: остатки прошлой сборки — самый простой способ
// положить в бандл файл, которого в репозитории уже нет.
rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });

for (const entry of ['build', 'spec', 'README.md', 'README.en.md', 'PRIVACY.md', 'SECURITY.md', 'LICENSE']) {
  const from = join(root, entry);
  if (!existsSync(from)) {
    console.error(`нет ${entry} — бандл собирать не из чего`);
    process.exit(1);
  }
  cpSync(from, join(stage, entry), { recursive: true });
}

// package.json внутри бандла — только то, что нужно рантайму. devDependencies
// в установленный клиентом бандл попадать незачем.
writeFileSync(
  join(stage, 'package.json'),
  `${JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      type: pkg.type,
      license: pkg.license,
      dependencies: pkg.dependencies,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(join(stage, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

// Зависимости ставятся в staging, а не копируются из корня: в корне лежат и
// dev-пакеты, и они утроят размер бандла.
execFileSync('npm', ['install', '--omit=dev', '--no-audit', '--no-fund', '--silent'], {
  cwd: stage,
  stdio: 'inherit',
});

console.log(`манифест: ${manifest.name} ${manifest.version}, инструментов объявлено ${manifest.tools.length}`);

if (process.argv.includes('--pack')) {
  execFileSync('npx', ['--yes', '@anthropic-ai/mcpb@2', 'pack', stage, join(root, `${pkg.name}-${pkg.version}.mcpb`)], {
    cwd: root,
    stdio: 'inherit',
  });
  const out = join(root, `${pkg.name}-${pkg.version}.mcpb`);
  console.log(`бандл: ${out} (${(statSync(out).size / 1048576).toFixed(1)} МБ)`);
}
