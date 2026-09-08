#!/usr/bin/env node
/**
 * Заглавная графика репозитория: 108 имён инструментов, из которых 98 вычёркиваются.
 *
 * Почему картинка именно такая. Предмет разговора здесь — сам манифест: описания
 * всех объявленных инструментов лежат в контексте модели, и это единственная
 * цена сервера, которую платят за факт подключения. Показать её честнее всего
 * самим списком: масса вычеркнутого читается раньше, чем читатель дойдёт до цифр.
 *
 * Имена берутся из спеки, а не переписаны в макет: разойтись с реальностью им
 * негде, и после ночной синхронизации картинка пересобирается той же командой.
 *
 * Два выхода, потому что площадки разные:
 *   assets/surface.svg — анимированный, для README на GitHub (там SVG живёт);
 *   assets/surface.gif — для Telegram и прочих мест, где SVG не показывают.
 *
 * Кадры GIF рендерит rsvg-convert из статических SVG с посчитанным прогрессом.
 * Скриншоты браузера для этого не нужны: у каждого кадра детерминированный вход.
 *
 * Запуск: node tools/build-graphic.mjs [--gif]
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const spec = JSON.parse(readFileSync(join(root, 'spec/metrika-api.json'), 'utf8'));
const { CORE_TOOLS } = await import(join(root, 'build/profiles.js'));

const core = new Set(CORE_TOOLS);
const kept = spec.methods.map((m) => m.tool).filter((t) => core.has(t));
const cut = spec.methods.map((m) => m.tool).filter((t) => !core.has(t));
const names = [...kept, ...cut];

// Палитра держит обе темы GitHub одним способом: у картинки собственный фон.
// Медиазапросы внутри <img>-SVG работают не везде, а подложка — везде.
const C = {
  paper: '#eceef0',
  panel: '#e3e6ea',
  ink: '#16191d',
  soft: '#4c545e',
  muted: '#98a1ab',
  pen: '#c8362a',
  blue: '#2a4a7f',
  keep: '#cfdcea',
  rule: '#d2d7dd',
};

const W = 1200;
const H = 630;
const COLS = 4;
const COL_W = 272;
const X0 = 48;
const Y0 = 150;
const LH = 13.4;
const ROWS = Math.ceil(names.length / COLS);

/** Колонка за колонкой: глаз читает сверху вниз, и оставленные держатся вместе. */
const place = (i) => ({
  x: X0 + Math.floor(i / ROWS) * COL_W,
  y: Y0 + (i % ROWS) * LH,
});

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** Ширина зачёркивания: моноширинный, поэтому считается по числу знаков. */
const strikeW = (name) => name.length * 5.42 + 3;

function head(extraStyle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="tools/list: 108 инструментов Яндекс Метрики, 98 вычеркнуты, по умолчанию объявляются 10">
<style>
  .mono { font-family: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace; }
  .sans { font-family: "Golos Text", -apple-system, "Segoe UI", system-ui, sans-serif; }
  .name { font-size: 9px; fill: ${C.muted}; }
  .name.keep { fill: ${C.ink}; font-weight: 600; }
  .eyebrow { font-size: 11.5px; letter-spacing: 1.6px; fill: ${C.muted}; font-weight: 600; }
  .h1 { font-size: 41px; font-weight: 800; fill: ${C.ink}; letter-spacing: -.8px; }
  .lede { font-size: 15px; fill: ${C.soft}; }
  .fignum { font-size: 27px; font-weight: 800; fill: ${C.ink}; letter-spacing: -.4px; }
  .figkey { font-size: 11.5px; fill: ${C.soft}; }
  .arrow { font-size: 20px; fill: ${C.pen}; font-weight: 700; }
  .strike { stroke: ${C.pen}; stroke-width: 1.05; }
${extraStyle}
</style>
<rect width="${W}" height="${H}" fill="${C.paper}"/>
<rect x="28" y="118" width="${W - 56}" height="416" fill="${C.panel}" stroke="${C.rule}"/>
<text class="sans eyebrow" x="48" y="46">TOOLS/LIST · ЯНДЕКС МЕТРИКА · MCP</text>
<text class="sans h1" x="48" y="86">Вычеркнуть 98 инструментов</text>
<text class="sans lede" x="48" y="108">Покрыты все 108 методов API. По умолчанию объявляются десять — те, которыми считают.</text>`;
}

/** Подсветка десяти оставленных: рисуется под текстом, поэтому отдельным слоем. */
function keepBoxes(opacity) {
  return kept
    .map((n, i) => {
      const { x, y } = place(i);
      return `<rect x="${(x - 3).toFixed(1)}" y="${(y - 8.4).toFixed(1)}" width="${(strikeW(n) + 4).toFixed(1)}" height="11.6" fill="${C.keep}" opacity="${opacity}"/>`;
    })
    .join('\n');
}

function labels() {
  return names
    .map((n, i) => {
      const { x, y } = place(i);
      const cls = core.has(n) ? 'mono name keep' : 'mono name';
      return `<text class="${cls}" x="${x}" y="${y.toFixed(1)}">${esc(n)}</text>`;
    })
    .join('\n');
}

/** Итоговые цифры. Разряды — узкий неразрывный пробел, иначе не читаются. */
function figures(opacity) {
  const y = 588;
  return `<g opacity="${opacity}">
<text class="sans fignum" x="48" y="${y}" text-decoration="line-through" fill="${C.muted}">158 301 Б</text>
<text class="sans arrow" x="205" y="${y - 1}">→</text>
<text class="sans fignum" x="238" y="${y}">32 181 Б</text>
<text class="sans figkey" x="48" y="${y + 20}">манифест по умолчанию · замер сериализацией ответа tools/list</text>
<text class="sans figkey" x="${W - 48}" y="${y + 20}" text-anchor="end">npx -y yandex-metrika-mcp-server@3</text>
</g>`;
}

// --- анимированный SVG ---------------------------------------------------

const CUT_START = 1.1;
const CUT_SPAN = 2.6;
const LOOP = 11;

// Задержка на каждой линии — штатным animation-delay, а не переменной в
// keyframes: последнее поддерживается неровно, а картинка идёт в чужие README.
const animStyle = `  .s { transform-origin: left center; animation: cut ${LOOP}s linear infinite; }
  @keyframes cut { 0% { transform: scaleX(0); } 3% { transform: scaleX(1); } 92% { transform: scaleX(1); } 96%, 100% { transform: scaleX(0); } }
  .fadein { animation: fadein ${LOOP}s linear infinite; }
  @keyframes fadein { 0%, 34% { opacity: 0; } 40%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
  .keepbox { animation: keepin ${LOOP}s linear infinite; }
  @keyframes keepin { 0%, 30% { opacity: 0; } 36%, 92% { opacity: 1; } 97%, 100% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .s, .fadein, .keepbox { animation: none; }
    .s { transform: scaleX(1); }
    .fadein, .keepbox { opacity: 1; }
  }`;

const animated = `${head(animStyle)}
<g class="keepbox">${keepBoxes(1)}</g>
${labels()}
<g>${cut
  .map((n, k) => {
    const i = kept.length + k;
    const { x, y } = place(i);
    const delay = (CUT_START + (k / cut.length) * CUT_SPAN).toFixed(2);
    return `<line class="strike s" x1="${(x - 1.5).toFixed(1)}" y1="${(y - 3).toFixed(1)}" x2="${(x - 1.5 + strikeW(n)).toFixed(1)}" y2="${(y - 3).toFixed(1)}" style="animation-delay:${delay}s"/>`;
  })
  .join('\n')}</g>
<g class="fadein">${figures(1)}</g>
</svg>
`;

mkdirSync(join(root, 'assets'), { recursive: true });
writeFileSync(join(root, 'assets/surface.svg'), animated);
console.log(`assets/surface.svg — ${(animated.length / 1024).toFixed(1)} КБ, ${names.length} имён, вычеркнуто ${cut.length}`);

// --- кадры и GIF ---------------------------------------------------------

if (process.argv.includes('--gif')) {
  const tmp = join(root, '.gif-frames');
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });

  const FRAMES = 26;
  for (let f = 0; f < FRAMES; f += 1) {
    // Прогресс вычёркивания: первые кадры — пауза, дальше линейно до конца.
    const t = f / (FRAMES - 1);
    const p = Math.max(0, Math.min(1, (t - 0.08) / 0.62));
    const shown = Math.round(p * cut.length);
    const lines = cut
      .slice(0, shown)
      .map((n, k) => {
        const i = kept.length + k;
        const { x, y } = place(i);
        return `<line class="strike" x1="${(x - 1.5).toFixed(1)}" y1="${(y - 3).toFixed(1)}" x2="${(x - 1.5 + strikeW(n)).toFixed(1)}" y2="${(y - 3).toFixed(1)}"/>`;
      })
      .join('\n');
    const svg = `${head('')}
${keepBoxes(p > 0.02 ? 1 : 0)}
${labels()}
${lines}
${figures(p >= 1 ? 1 : 0)}
</svg>
`;
    writeFileSync(join(tmp, `f${String(f).padStart(3, '0')}.svg`), svg);
    execFileSync('rsvg-convert', ['-w', '900', '-o', join(tmp, `f${String(f).padStart(3, '0')}.png`), join(tmp, `f${String(f).padStart(3, '0')}.svg`)]);
  }

  // Последний кадр держится: без паузы читатель не успевает увидеть итог.
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-framerate', '9', '-i', join(tmp, 'f%03d.png'),
    '-filter_complex', 'tpad=stop_mode=clone:stop_duration=2.6,split[a][b];[a]palettegen=max_colors=64[p];[b][p]paletteuse=dither=bayer:bayer_scale=3',
    '-loop', '0',
    join(root, 'assets/surface.gif'),
  ]);
  rmSync(tmp, { recursive: true, force: true });
  const size = readFileSync(join(root, 'assets/surface.gif')).length;
  console.log(`assets/surface.gif — ${(size / 1024).toFixed(0)} КБ, ${FRAMES} кадров + пауза`);
}
