#!/usr/bin/env node
/**
 * Убирает из GIF блок бесконечного зацикливания — файл проигрывается один раз
 * и замирает на последнем кадре.
 *
 * Зачем. WCAG 2.2, SC 2.2.2 «Pause, Stop, Hide» (уровень A): автоматически
 * запущенное движение дольше пяти секунд рядом с другим контентом обязано
 * иметь механизм паузы. В README такого механизма нет, поэтому единственный
 * доступный путь — чтобы анимация закончилась и остановилась (техника W3C
 * G152). VHS и большинство конвертеров пишут бесконечный цикл по умолчанию.
 *
 * Почему правка байтовая, а не перекодировка. Пережать GIF через ffmpeg —
 * значит заново квантовать палитру и потерять качество там, где менять надо
 * ровно один управляющий блок. Здесь вырезается Application Extension
 * NETSCAPE2.0 целиком: без него плеер играет один проход.
 *
 * Запуск: node tools/gif-play-once.mjs <файл.gif>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('нужен путь к .gif');
  process.exit(1);
}

const buf = readFileSync(file);
const at = buf.indexOf(Buffer.from('NETSCAPE2.0', 'ascii'));

if (at < 0) {
  console.log(`${file}: блока зацикливания нет — уже один проход`);
  process.exit(0);
}

// Структура: 21 FF 0B "NETSCAPE2.0" 03 01 <две байта счётчика> 00
// Начало — на два байта левее сигнатуры (0x21 0xFF), плюс байт длины блока.
const start = at - 3;
if (buf[start] !== 0x21 || buf[start + 1] !== 0xff || buf[start + 2] !== 0x0b) {
  console.error(`${file}: сигнатура блока не на месте — не трогаю файл`);
  process.exit(1);
}
// Дальше идут суб-блоки: длина, данные, ... и нулевой байт-терминатор.
let p = at + 11;
while (buf[p] !== 0x00) p += buf[p] + 1;
const end = p + 1;

const out = Buffer.concat([buf.subarray(0, start), buf.subarray(end)]);
writeFileSync(file, out);
console.log(`${file}: зацикливание снято, ${buf.length} → ${out.length} байт`);
