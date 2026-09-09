#!/usr/bin/env node
/**
 * Кейс использования: вопрос обычными словами — и ответ цифрами из Метрики.
 *
 * Правило этой картинки: показывать, а не объяснять. Заголовка, лида и
 * колонки «было» здесь нет намеренно — они рассказывали про ценность вместо
 * того, чтобы её показать. Осталось одно объясняющее предложение внизу;
 * всё остальное несёт сам обмен репликами.
 *
 * Цифры в таблице снабжены полосами: так строка читается как график, а не
 * как список чисел, и графика набирается без единого лишнего слова.
 *
 * ⚠️ Числа ИЛЛЮСТРАТИВНЫЕ. Реальный трафик сайта в README — решение
 * владельца, а не сборщика картинки. Меняются в CASE ниже.
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
  ink: '#16191d',
  soft: '#4c545e',
  muted: '#98a1ab',
  // Фирменный красный Яндекса — только акцентом: метка, чип, точка сноски.
  // Заливать им площади нельзя, это чужой знак, а не наша палитра.
  ya: '#fc3f1d',
  blue: '#2a4a7f',
  bar: '#b9c6d6',
  green: '#2f7d5b',
  rule: '#d2d7dd',
};

const CASE = {
  // Перенос задан вручную: резать по счётчику символов — значит однажды
  // разорвать слово пополам, что и случилось на первой сборке.
  question: ['Откуда приходили люди за неделю', 'и сколько дошло до цели?'],
  tool: 'metrika_stat_data',
  // Идентификаторы настоящие: для того, кто ставит этот сервер, строка
  // ym:s:visits говорит «Метрика» однозначнее любого логотипа.
  //
  // Номера счётчика здесь намеренно нет. Он ничего не добавляет к узнаванию —
  // это делает префикс ym: — зато попадает под гвард на восьмизначные числа,
  // который не умеет отличить выдуманный идентификатор от настоящего. Ослаблять
  // гвард ради украшения нельзя.
  measures: 'ym:s:visits, ym:s:goal12345reaches',
  rows: [
    ['Поиск', 12480, 386, '3,1%'],
    ['Реклама', 2140, 118, '5,5%'],
    ['Прямые заходы', 1905, 44, '2,3%'],
    ['Переходы по ссылкам', 640, 12, '1,9%'],
  ],
  footer: 'Семь шагов в интерфейсе Метрики — одним вопросом.',
};

const W = 1200;
const H = 630;
const BAR_MAX = 300;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const top = Math.max(...CASE.rows.map((r) => r[1]));

/**
 * Кадры отличаются только тем, сколько уже проявилось. Вход детерминированный,
 * браузер для рендера не нужен — кадры собирает rsvg-convert.
 *
 * @param {number|null} step  null — анимированный SVG; число — кадр GIF.
 */
function svg(step) {
  const animate = step === null;
  const qLines = animate ? 2 : Math.min(2, Math.max(0, step));
  const chipOn = animate || step >= 3;
  const rowsOn = animate ? CASE.rows.length : Math.max(0, Math.min(CASE.rows.length, step - 3));
  const footOn = animate || step >= 8;

  // Анимация проигрывается ОДИН раз и замирает — не зацикливается.
  //
  // WCAG 2.2, SC 2.2.2 «Pause, Stop, Hide» (уровень A): автоматически
  // запущенное движение дольше 5 секунд рядом с другим контентом обязано иметь
  // механизм паузы. В README такого механизма нет и быть не может, поэтому
  // ломаем другое условие — длительность. Всё укладывается в 4 секунды и
  // останавливается (техника W3C G152).
  //
  // ⚠️ prefers-reduced-motion этого требования НЕ закрывает: он отражает
  // настройку ОС и относится к AAA-критерию 2.3.3, а 2.2.2 — уровень A и
  // требует механизма на самой странице. Уважаем оба, но по разным причинам.
  //
  // fill-mode both: во время задержки применяется кадр 0%, поэтому элемент
  // скрыт до своего момента. Рендерер, который CSS-анимации игнорирует вовсе,
  // берёт базовый стиль — то есть конечное состояние. Верно в обе стороны.
  const anim = animate
    ? `  .q1 { animation: fade .45s ease-out both; animation-delay: .1s; }
  .q2 { animation: fade .45s ease-out both; animation-delay: .5s; }
  .chip { animation: fade .45s ease-out both; animation-delay: 1s; }
  .row { animation: fade .4s ease-out both; }
  .bar { animation: grow .5s cubic-bezier(.2,.7,.3,1) both; transform-origin: left center; }
  .foot { animation: fade .45s ease-out both; animation-delay: 3.2s; }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @media (prefers-reduced-motion: reduce) {
    .q1, .q2, .chip, .row, .foot, .bar { animation: none; }
  }`
    : '';

  const rows = CASE.rows
    .map((r, i) => {
      const [name, visits, goals, cr] = r;
      const y = 372 + i * 44;
      const w = (visits / top) * BAR_MAX;
      const on = animate || i < rowsOn;
      const d = animate ? ` style="animation-delay:${(1.5 + i * 0.34).toFixed(2)}s"` : '';
      const db = animate ? ` style="animation-delay:${(1.6 + i * 0.34).toFixed(2)}s"` : '';
      return `<g class="row"${d}${on ? '' : ' opacity="0"'}>
  <text class="sans td" x="80" y="${y}">${esc(name)}</text>
  <rect class="bar" x="420" y="${y - 12}" width="${w.toFixed(1)}" height="15" rx="1.5" fill="${C.bar}"${db}/>
  <text class="sans num" x="${(420 + w + 12).toFixed(1)}" y="${y}">${fmt(visits)}</text>
  <text class="sans num" x="1010" y="${y}" text-anchor="end">${fmt(goals)}</text>
  <text class="sans num cr" x="1120" y="${y}" text-anchor="end">${cr}</text>
</g>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Вопрос обычными словами «Откуда приходили люди за неделю и сколько дошло до цели» и ответ таблицей: источники трафика с визитами, достигнутыми целями и конверсией">
<style>
  .sans { font-family: "Golos Text", -apple-system, "Segoe UI", system-ui, sans-serif; }
  .mono { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; }
  .tag { font-size: 12px; fill: ${C.muted}; letter-spacing: .4px; }
  .q { font-size: 34px; font-weight: 700; fill: ${C.ink}; letter-spacing: -.5px; }
  .brand { font-size: 14px; fill: ${C.ink}; font-weight: 600; }
  .chiptext { font-size: 13px; fill: ${C.ya}; }
  .meas { font-size: 12px; fill: ${C.muted}; }
  .disc { font-size: 12px; fill: ${C.muted}; }
  .th { font-size: 11px; letter-spacing: 1.2px; fill: ${C.muted}; font-weight: 600; }
  .td { font-size: 17px; fill: ${C.ink}; }
  .num { font-size: 17px; fill: ${C.ink}; font-weight: 600; font-variant-numeric: tabular-nums; }
  .cr { fill: ${C.green}; }
  .foottext { font-size: 15px; fill: ${C.soft}; }
${anim}
</style>
<rect width="${W}" height="${H}" fill="${C.paper}"/>

<rect x="80" y="52" width="11" height="11" rx="1.5" fill="${C.ya}"/>
<text class="sans brand" x="99" y="62">Яндекс Метрика</text>
<text class="sans tag" x="228" y="62">· API v1</text>
<text class="mono tag" x="1120" y="62" text-anchor="end">yandex-metrika-mcp</text>

<g class="q1"${qLines >= 1 ? '' : ' opacity="0"'}>
  <text class="sans q" x="80" y="168">${esc(CASE.question[0])}</text>
</g>
<g class="q2"${qLines >= 2 ? '' : ' opacity="0"'}>
  <text class="sans q" x="80" y="214">${esc(CASE.question[1])}</text>
</g>

<g class="chip"${chipOn ? '' : ' opacity="0"'}>
  <rect x="80" y="248" width="${CASE.tool.length * 7.9 + 26}" height="26" rx="13" fill="${C.card}" stroke="${C.ya}" stroke-opacity=".5"/>
  <text class="mono chiptext" x="93" y="266">${esc(CASE.tool)}</text>
  <text class="mono meas" x="${(80 + CASE.tool.length * 7.9 + 40).toFixed(0)}" y="266">${esc(CASE.measures)}</text>
</g>

<text class="sans th" x="80" y="330">ИСТОЧНИК</text>
<text class="sans th" x="420" y="330">ВИЗИТЫ</text>
<text class="sans th" x="1010" y="330" text-anchor="end">ЦЕЛИ</text>
<text class="sans th" x="1120" y="330" text-anchor="end">КОНВЕРСИЯ</text>
<line x1="80" y1="342" x2="1120" y2="342" stroke="${C.ink}" stroke-width="1.4"/>
${rows}

<g class="foot"${footOn ? '' : ' opacity="0"'}>
  <line x1="80" y1="546" x2="1120" y2="546" stroke="${C.rule}"/>
  <circle cx="86" cy="578" r="3.5" fill="${C.ya}"/>
  <text class="sans foottext" x="100" y="583">${esc(CASE.footer)}</text>
  <text class="mono tag" x="1120" y="583" text-anchor="end">npx -y yandex-metrika-mcp-server@3</text>
  <text class="sans disc" x="100" y="606">Неофициальный клиент API. Яндекс Метрика — сервис Яндекса.</text>
</g>
</svg>
`;
}

mkdirSync(join(root, 'assets'), { recursive: true });
const animated = svg(null);
writeFileSync(join(root, 'assets/case.svg'), animated);
console.log(`assets/case.svg — ${(animated.length / 1024).toFixed(1)} КБ`);

if (process.argv.includes('--gif')) {
  const tmp = join(root, '.case-frames');
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const FRAMES = 10;
  for (let f = 0; f < FRAMES; f += 1) {
    // Со сдвига на шаг: первый кадр — превью в чатах, пока гифку не проиграли,
    // и пустой холст там читается как сломанная картинка.
    const n = String(f).padStart(2, '0');
    writeFileSync(join(tmp, `f${n}.svg`), svg(f + 1));
    execFileSync('rsvg-convert', ['-w', '960', '-o', join(tmp, `f${n}.png`), join(tmp, `f${n}.svg`)]);
  }
  // -loop -1 — проиграть один раз и остановиться на последнем кадре.
  // Дефолт ffmpeg (-loop 0) — бесконечно, и именно он нарушает SC 2.2.2.
  // Паузы в конце (tpad) больше не нужно: остановившаяся гифка и так стоит
  // на финальном кадре, а раньше эта пауза просто съедала лимит длительности.
  const FPS = 2.6; // 10 кадров ≈ 3,8 с — с запасом под пятисекундный порог
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-framerate', String(FPS), '-i', join(tmp, 'f%02d.png'),
    '-filter_complex', 'split[a][b];[a]palettegen=max_colors=48[p];[b][p]paletteuse=dither=none',
    '-loop', '-1',
    join(root, 'assets/case.gif'),
  ]);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`assets/case.gif — ${(readFileSync(join(root, 'assets/case.gif')).length / 1024).toFixed(0)} КБ`);
}
