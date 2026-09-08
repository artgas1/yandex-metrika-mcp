#!/usr/bin/env node
/**
 * Кейс использования одной картинкой: слева — цепочка кликов в интерфейсе
 * Метрики, справа — та же задача одной фразой в чате.
 *
 * Почему картинка именно такая. Ценность сервера — не покрытие API, а работы,
 * которые он у человека забирает. Их видно только рядом: семь шагов, которые
 * надо помнить, против одного вопроса обычными словами. Список инструментов
 * этого не показывает вовсе.
 *
 * ⚠️ Числа в примере ИЛЛЮСТРАТИВНЫЕ. Реальный трафик сайта в README —
 * решение владельца, а не сборщика картинки. Подменяются в CASE ниже.
 *
 * Запуск: node tools/build-case.mjs [--gif]
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));

const C = {
  paper: '#eceef0',
  card: '#f7f8f9',
  panel: '#e3e6ea',
  ink: '#16191d',
  soft: '#4c545e',
  muted: '#98a1ab',
  pen: '#c8362a',
  blue: '#2a4a7f',
  green: '#2f7d5b',
  rule: '#d2d7dd',
};

const CASE = {
  // Перенос задан вручную: резать по счётчику символов — значит однажды
  // разорвать слово пополам, что и случилось на первой сборке.
  question: ['Откуда приходили люди за неделю', 'и сколько дошло до цели?'],
  tool: 'metrika_stat_data',
  columns: ['источник', 'визиты', 'цели', 'конверсия'],
  rows: [
    ['Поиск', '12 480', '386', '3,1%'],
    ['Реклама', '2 140', '118', '5,5%'],
    ['Прямые заходы', '1 905', '44', '2,3%'],
    ['Переходы по ссылкам', '640', '12', '1,9%'],
  ],
  declared: "сервер добавил от себя: ym:s:isRobot=='no' — и объявил это в ответе",
  steps: [
    'открыть Метрику, выбрать счётчик',
    'найти отчёт «Источники → Сводка»',
    'поставить группировку по источнику',
    'выставить период',
    'применить сегмент «цель достигнута»',
    'вспомнить, как режутся роботы',
    'выгрузить и посчитать доли',
  ],
};

const W = 1200;
const H = 630;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function svg(animate) {
  const anim = animate
    ? `  .row { animation: rowin 9s linear infinite; }
  @keyframes rowin { 0%, 18% { opacity: 0; } 26%, 93% { opacity: 1; } 98%, 100% { opacity: 0; } }
  .note { animation: notein 9s linear infinite; }
  @keyframes notein { 0%, 46% { opacity: 0; } 53%, 93% { opacity: 1; } 98%, 100% { opacity: 0; } }
  .chip { animation: chipin 9s linear infinite; }
  @keyframes chipin { 0%, 10% { opacity: 0; } 16%, 93% { opacity: 1; } 98%, 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .row, .note, .chip { animation: none; opacity: 1; } }`
    : '';

  // Левая колонка: то, что человек делает руками сегодня.
  const steps = CASE.steps
    .map((s, i) => {
      const y = 214 + i * 34;
      return `<circle cx="60" cy="${y - 4}" r="8.5" fill="none" stroke="${C.muted}" stroke-width="1"/>
<text class="sans stepn" x="60" y="${y - 0.5}" text-anchor="middle">${i + 1}</text>
<text class="sans step" x="80" y="${y}">${esc(s)}</text>`;
    })
    .join('\n');

  // Правая колонка: тот же результат одной фразой.
  const colX = [640, 940, 1030, 1130];
  const headRow = CASE.columns
    .map((c, i) => `<text class="sans th" x="${colX[i]}" y="330" ${i ? 'text-anchor="end"' : ''}>${esc(c)}</text>`)
    .join('\n');

  const rows = CASE.rows
    .map((r, i) => {
      const y = 362 + i * 32;
      const delay = animate ? ` style="animation-delay:${(1.6 + i * 0.22).toFixed(2)}s"` : '';
      const cells = r
        .map((v, j) => {
          const cls = j === 0 ? 'sans td' : j === 3 ? 'sans td num cr' : 'sans td num';
          const anchor = j ? ' text-anchor="end"' : '';
          return `<text class="${cls}" x="${colX[j]}" y="${y}"${anchor}>${esc(v)}</text>`;
        })
        .join('');
      return `<g class="row"${delay}>${cells}<line x1="640" y1="${y + 11}" x2="1152" y2="${y + 11}" stroke="${C.rule}" stroke-width="1"/></g>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Слева семь шагов в интерфейсе Яндекс Метрики, справа тот же результат одним вопросом в чате: таблица источников с визитами, целями и конверсией">
<style>
  .sans { font-family: "Golos Text", -apple-system, "Segoe UI", system-ui, sans-serif; }
  .mono { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; }
  .eyebrow { font-size: 11.5px; letter-spacing: 1.6px; fill: ${C.muted}; font-weight: 600; }
  .h1 { font-size: 40px; font-weight: 800; fill: ${C.ink}; letter-spacing: -.8px; }
  .lede { font-size: 15px; fill: ${C.soft}; }
  .colhead { font-size: 11.5px; letter-spacing: 1.4px; font-weight: 600; }
  .step { font-size: 14px; fill: ${C.soft}; }
  .stepn { font-size: 10px; fill: ${C.muted}; font-weight: 600; }
  .cost { font-size: 13px; fill: ${C.muted}; }
  .q { font-size: 18.5px; fill: ${C.ink}; font-weight: 600; }
  .chiptext { font-size: 11.5px; fill: ${C.blue}; }
  .th { font-size: 11px; letter-spacing: 1.1px; fill: ${C.muted}; font-weight: 600; }
  .td { font-size: 15px; fill: ${C.ink}; }
  .num { font-variant-numeric: tabular-nums; font-weight: 600; }
  .cr { fill: ${C.green}; }
  .notetext { font-size: 12.5px; fill: ${C.soft}; }
${anim}
</style>
<rect width="${W}" height="${H}" fill="${C.paper}"/>
<text class="sans eyebrow" x="48" y="46">ЯНДЕКС МЕТРИКА · MCP · ПРИМЕР ОТВЕТА</text>
<text class="sans h1" x="48" y="90">Спросить словами</text>
<text class="sans lede" x="48" y="114">Сервер не открывает интерфейс. Он забирает семь шагов, которые надо было помнить.</text>

<line x1="48" y1="140" x2="1152" y2="140" stroke="${C.rule}"/>

<text class="sans colhead eyebrow" x="48" y="172">БЫЛО · РУКАМИ В ИНТЕРФЕЙСЕ</text>
${steps}
<text class="sans cost" x="48" y="474">семь шагов, и это надо помнить каждый раз</text>

<line x1="560" y1="152" x2="560" y2="500" stroke="${C.rule}"/>

<text class="sans colhead eyebrow" x="640" y="172">СТАЛО · ОДНОЙ ФРАЗОЙ</text>
<rect x="618" y="192" width="534" height="72" rx="3" fill="${C.card}" stroke="${C.rule}"/>
<text class="sans q" x="640" y="222">${esc(CASE.question[0])}</text>
<text class="sans q" x="640" y="247">${esc(CASE.question[1])}</text>

<g class="chip">
  <rect x="618" y="282" width="${CASE.tool.length * 7.1 + 22}" height="21" rx="10.5" fill="none" stroke="${C.blue}" stroke-opacity=".45"/>
  <text class="mono chiptext" x="629" y="296">${esc(CASE.tool)}</text>
</g>

${headRow}
<line x1="640" y1="340" x2="1152" y2="340" stroke="${C.ink}" stroke-width="1.4"/>
${rows}

<g class="note"${animate ? ' style="animation-delay:0s"' : ''}>
  <rect x="618" y="506" width="534" height="34" rx="3" fill="${C.panel}"/>
  <circle cx="638" cy="523" r="3.5" fill="${C.pen}"/>
  <text class="sans notetext" x="652" y="527">${esc(CASE.declared)}</text>
</g>

<text class="sans cost" x="48" y="580">Числа в примере иллюстративные.</text>
<text class="mono cost" x="1152" y="580" text-anchor="end">npx -y yandex-metrika-mcp-server@3</text>
</svg>
`;
}

mkdirSync(join(root, 'assets'), { recursive: true });
const animated = svg(true);
writeFileSync(join(root, 'assets/case.svg'), animated);
console.log(`assets/case.svg — ${(animated.length / 1024).toFixed(1)} КБ`);

if (process.argv.includes('--gif')) {
  const tmp = join(root, '.case-frames');
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const still = svg(false);
  // Кадры отличаются тем, сколько строк ответа уже проявилось: вход
  // детерминированный, браузер для рендера не нужен.
  const FRAMES = 8;
  for (let f = 0; f < FRAMES; f += 1) {
    let frame = still;
    const shown = Math.max(0, Math.min(CASE.rows.length, f - 1));
    if (f < 1) frame = frame.replace(/<g class="chip">/, '<g class="chip" opacity="0">');
    frame = frame.replace(/<g class="row">/g, (() => {
      let k = 0;
      return () => (k++ < shown ? '<g class="row">' : '<g class="row" opacity="0">');
    })());
    if (f < FRAMES - 2) frame = frame.replace('<g class="note">', '<g class="note" opacity="0">');
    const n = String(f).padStart(2, '0');
    writeFileSync(join(tmp, `f${n}.svg`), frame);
    execFileSync('rsvg-convert', ['-w', '900', '-o', join(tmp, `f${n}.png`), join(tmp, `f${n}.svg`)]);
  }
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-framerate', '2.4', '-i', join(tmp, 'f%02d.png'),
    '-filter_complex',
    'tpad=stop_mode=clone:stop_duration=3.2,split[a][b];[a]palettegen=max_colors=48[p];[b][p]paletteuse=dither=none',
    '-loop', '0',
    join(root, 'assets/case.gif'),
  ]);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`assets/case.gif — ${(readFileSync(join(root, 'assets/case.gif')).length / 1024).toFixed(0)} КБ`);
}
