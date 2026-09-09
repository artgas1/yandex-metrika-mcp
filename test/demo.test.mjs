/**
 * Демо обязано оставаться живым.
 *
 * Отказ, который ловится: демо разошлось с поведением сервера и стало
 * нарисованной картинкой. Оно ценно ровно тем, что печатает НАСТОЯЩИЙ ответ —
 * версию из `initialize`, счёт из каталога, строку добавленного фильтра из
 * `_meta.applied_by_server`. Если сервер перестанет их отдавать, запись начнёт
 * врать молча, а заметить это можно только пересняв её и посмотрев глазами.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = execFileSync('node', ['tools/demo.mjs'], { cwd: root, encoding: 'utf8', timeout: 30000 });
// Управляющий символ записан escape-последовательностью, а не собой:
// литерал ESC невидим в диффе и ломает поиск по файлу.
const plain = out.replace(/\u001b\[[0-9;]*m/g, '');

test('демо печатает версию сервера, а не вписанную строку', () => {
  assert.match(plain, /yandex-metrika-mcp-server \d+\.\d+\.\d+/);
});

test('демо показывает объявленный фильтр — обещание, ради которого сервер и сделан', () => {
  assert.match(plain, /ym:s:isRobot=='no'/);
});

test('счёт методов взят у сервера и не смешан со служебным каталогом', () => {
  // Десять методов API из 108. Одиннадцатый инструмент — каталог, и в этот
  // счёт он попадать не должен: смешать их значит соврать в мелочи.
  assert.match(plain, /методов объявлено\s+10\s+из 108/);
});

test('демо обходится без токена и без сети — иначе его не пересобрать в CI', () => {
  assert.match(plain, /ни токена, ни сети/);
  assert.ok(!/YANDEX_API_KEY=|Bearer /.test(plain), 'в выводе демо мелькнул токен');
});
