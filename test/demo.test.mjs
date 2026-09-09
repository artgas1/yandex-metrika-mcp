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

test('демо показывает ЗАПРОС, а не только ответ ниоткуда', () => {
  // Первая версия печатала лишь ответ — читатель не видел, что спросили,
  // и картинка получалась неинформативной.
  assert.match(plain, /запрос\s+metrika_stat_data/);
  assert.match(plain, /dimensions\s+ym:s:trafficSource/);
  assert.match(plain, /metrics\s+ym:s:visits/);
});

test('демо показывает объявленный фильтр — обещание, ради которого сервер и сделан', () => {
  assert.match(plain, /ym:s:isRobot=='no'/);
});

test('в демо нет внутренней кухни — версии, счётчиков инструментов, оправданий', () => {
  // Они занимали место и ничего не давали читателю. Условие удержания:
  // вернутся — тест покраснеет, а не «когда-нибудь заметим глазами».
  for (const noise of [/методов объявлено/, /yandex-metrika-mcp-server \d/, /заглушк/i]) {
    assert.ok(!noise.test(plain), `в демо вернулась внутренняя кухня: ${noise}`);
  }
});

test('в выводе демо нет токена', () => {
  assert.ok(!/YANDEX_API_KEY=|Bearer /.test(plain), 'в выводе демо мелькнул токен');
});
