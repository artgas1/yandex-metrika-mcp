/**
 * Контракт командной строки.
 *
 * Смысл CLI в том, что он НЕ своя реализация: скилл получает те же гарантии, что
 * и MCP, потому что зовёт тот же код. Значит и проверять надо не «команда что-то
 * напечатала», а именно совпадение гарантий. Каждый тест ниже назван по отказу,
 * который он ловит.
 *
 * Самый дорогой из них — первый. Если фильтр роботов из CLI не уедет, отчёт
 * придёт нормальный: те же поля, правдоподобные числа, ошибки нет. Просто числа
 * будут завышены, и заметить это по ответу нельзя.
 *
 * Сеть не нужна: METRIKA_API_BASE уводит запросы на заглушку, поднятую здесь же.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { parseArgv, runCli } from '../build/cli.js';
import { tokenProblem } from '../build/http.js';

const ROWS = [
  { dimensions: [{ name: 'Поиск' }], metrics: [12480, 386] },
  { dimensions: [{ name: 'Прямые заходы' }], metrics: [1905, 44] },
];

/** Поднимает заглушку API и отдаёт список увиденных ею запросов. */
async function withStub(run) {
  const seen = [];
  const stub = createServer((req, res) => {
    seen.push({ url: req.url, method: req.method, auth: req.headers.authorization });
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ query: {}, data: ROWS, total_rows: 2, sampled: false }));
  });
  await new Promise((r) => stub.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${stub.address().port}`;
  try {
    return await run(base, seen);
  } finally {
    await new Promise((r) => stub.close(r));
  }
}

/**
 * Запускает CLI, перехватывая вывод, — вместо разбора stdout отдельного процесса.
 *
 * Окружение подменяется в самом `process.env` и возвращается обратно. Иначе
 * никак: транспорт и фильтр трафика читают процесс напрямую, и подмена «сбоку»
 * до них не доходит — на этом первая редакция теста и уехала в живой API.
 */
async function cli(argv, env = {}) {
  const keys = ['YANDEX_API_KEY', 'METRIKA_API_BASE', 'METRIKA_ALLOW_WRITES', 'METRIKA_PROFILE', 'METRIKA_MAX_OUTPUT_CHARS', 'METRIKA_TRAFFIC_FILTER'];
  const saved = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  for (const k of keys) delete process.env[k];
  Object.assign(process.env, env);

  const lines = [];
  let code;
  try {
    code = await runCli(argv, { out: (t) => lines.push(t), err: () => {} });
  } finally {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
  const text = lines.join('\n');
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* help печатает не JSON — это нормально */
  }
  return { code, text, json };
}

const STAT_ARGS = [
  'call',
  'metrika_stat_data',
  '--ids',
  '1',
  '--metrics',
  'ym:s:visits',
  '--dimensions',
  'ym:s:trafficSource',
];

test('фильтр роботов уезжает в запрос — иначе отчёт молча считает ботов людьми', async () => {
  await withStub(async (base, seen) => {
    const { code, json } = await cli(STAT_ARGS, {
      YANDEX_API_KEY: 'x',
      METRIKA_API_BASE: base,
    });
    assert.equal(code, 0);
    assert.equal(seen.length, 1, 'ожидался ровно один запрос к API');
    const query = decodeURIComponent(seen[0].url);
    assert.match(query, /isRobot/, `в запросе нет отсева роботов: ${query}`);
    assert.ok(
      json._meta.applied_by_server.some((s) => s.includes('isRobot')),
      'сервер добавил фильтр, но не сказал об этом в _meta.applied_by_server',
    );
  });
});

test('отказ от фильтра слышен: --no-human-traffic-only убирает его и объявляет это', async () => {
  await withStub(async (base, seen) => {
    const { code, json } = await cli([...STAT_ARGS, '--no-human-traffic-only'], {
      YANDEX_API_KEY: 'x',
      METRIKA_API_BASE: base,
    });
    assert.equal(code, 0);
    assert.doesNotMatch(decodeURIComponent(seen[0].url), /isRobot/);
    assert.ok(
      json._meta.notes.some((n) => n.includes('роботов отключён')),
      'фильтр выключен, а в notes про это ни слова',
    );
  });
});

test('токен уходит заголовком OAuth и не появляется в показанном URL', async () => {
  // Значение намеренно ASCII: заголовок с кириллицей отвергает сам fetch, и тест
  // стал бы проверять не то. Отдельная находка, записанная в CHANGELOG.
  const TOKEN = 'y0_SECRET-TOKEN-VALUE';
  await withStub(async (base, seen) => {
    const { json } = await cli(STAT_ARGS, { YANDEX_API_KEY: TOKEN, METRIKA_API_BASE: base });
    assert.equal(seen[0].auth, `OAuth ${TOKEN}`);
    assert.doesNotMatch(json._meta.request_url, new RegExp(TOKEN));
  });
});

test('меняющий данные метод отказывает без METRIKA_ALLOW_WRITES и до сети не доходит', async () => {
  await withStub(async (base, seen) => {
    const { code, json } = await cli(['call', 'metrika_goal_delete', '--counterId', '1', '--goalId', '2'], {
      YANDEX_API_KEY: 'x',
      METRIKA_API_BASE: base,
    });
    assert.equal(code, 3);
    assert.equal(json.error, true);
    assert.match(json.hint, /METRIKA_ALLOW_WRITES/);
    assert.equal(seen.length, 0, 'запрос ушёл, хотя запись выключена');
  });
});

test('профиль в терминале не действует — доступны все методы спеки', async () => {
  // Сознательное отличие от MCP: профиль экономит контекст, которого у команды
  // нет. Тест фиксирует, что это решение, а не недосмотр: если кто-то однажды
  // прикрутит профиль к CLI, он увидит здесь красное и прочитает почему.
  const { code, json } = await cli(['describe', 'metrika_logs_evaluate'], { METRIKA_PROFILE: 'core' });
  assert.equal(code, 0);
  assert.equal(json.tool, 'metrika_logs_evaluate');
});

test('catalog не выдаёт несовпавшие с поиском методы за скрытые', async () => {
  const { json } = await cli(['catalog', '--search', 'segment'], {});
  assert.equal(json.api_methods_total, 108);
  assert.ok(json.matched > 0 && json.matched < 108);
  assert.equal(json.search, 'segment');
  // Слов про профиль тут быть не должно: в CLI его нет, и совет включить
  // им «скрытое» отправил бы читателя чинить то, что не сломано.
  assert.doesNotMatch(JSON.stringify(json), /METRIKA_PROFILE/);
});

test('опечатка в имени параметра — отказ с подсказкой, а не молча выброшенный параметр', async () => {
  await withStub(async (base, seen) => {
    const { code, json } = await cli(
      ['call', 'metrika_stat_data', '--ids', '1', '--metrics', 'ym:s:visits', '--dimensons', 'ym:s:date'],
      { YANDEX_API_KEY: 'x', METRIKA_API_BASE: base },
    );
    assert.equal(code, 2);
    assert.match(json.message, /dimensons/);
    assert.equal(seen.length, 0, 'запрос с потерянным параметром всё-таки ушёл');
  });
});

test('нехватка обязательного параметра ловится схемой метода, а не ответом Метрики', async () => {
  await withStub(async (base, seen) => {
    const { code, json } = await cli(['call', 'metrika_stat_data', '--ids', '1'], {
      YANDEX_API_KEY: 'x',
      METRIKA_API_BASE: base,
    });
    assert.equal(code, 2);
    assert.ok(json.issues.some((i) => i.startsWith('metrics')), `в issues нет metrics: ${JSON.stringify(json.issues)}`);
    assert.equal(seen.length, 0);
  });
});

test('урезание ответа объявляется, а не происходит молча', async () => {
  await withStub(async (base) => {
    const { code, json } = await cli(STAT_ARGS, {
      YANDEX_API_KEY: 'x',
      METRIKA_API_BASE: base,
      METRIKA_MAX_OUTPUT_CHARS: '400',
    });
    assert.equal(code, 0);
    assert.ok(json._meta.truncated_by_server, 'ответ обрезан, а расписки об этом нет');
  });
});

test('без токена call не идёт в сеть и говорит, где его взять', async () => {
  await withStub(async (base, seen) => {
    const { code, json } = await cli(STAT_ARGS, { METRIKA_API_BASE: base });
    assert.equal(code, 4);
    assert.match(json.hint, /oauth\.yandex\.ru/);
    assert.equal(seen.length, 0);
  });
});

test('токен с не-ASCII отвергается до сети, а не тремя повторами', async () => {
  // Заголовок Authorization с таким токеном не собирается вовсе: fetch роняет
  // TypeError, повтор считает это сетевым сбоем и ждёт три секунды, а итоговое
  // сообщение не упоминает ни токен, ни заголовок. На русской раскладке «с»
  // неотличима от латинской, так что промах рабочий, а не выдуманный.
  const cyrillicEs = String.fromCharCode(0x0441);
  await withStub(async (base, seen) => {
    const started = Date.now();
    const { code, json } = await cli(STAT_ARGS, {
      YANDEX_API_KEY: `y0_Ac${cyrillicEs}AAA`,
      METRIKA_API_BASE: base,
    });
    assert.equal(code, 4);
    assert.match(json.message, /непригоден/);
    assert.match(json.message, /U\+0441/, 'сообщение обязано называть символ, иначе его не найти глазами');
    assert.equal(seen.length, 0, 'запрос ушёл, хотя заголовок с таким токеном не собирается');
    assert.ok(Date.now() - started < 1000, 'отказ занял больше секунды — похоже, вернулись повторы');
  });
});

test('пробел и перевод строки по краям токена НЕ отвергаются', async () => {
  // Замерено: undici срезает их сам, запрос проходит. Сторож, который начнёт
  // на них ругаться, сломает обычное `export YANDEX_API_KEY=$(cat file)`.
  assert.equal(tokenProblem('y0_AcAAA\n'), null);
  assert.equal(tokenProblem('y0_AcAAA '), null);
  assert.equal(tokenProblem('y0_AcAAA'), null);
});

test('tokenProblem называет позицию символа, а не только факт', () => {
  const msg = tokenProblem('abc\u2014def');
  assert.ok(msg, 'длинное тире должно отвергаться');
  assert.match(msg, /U\+2014/);
  assert.match(msg, /позиции 4/);
});

test('имя метода принимается и в короткой записи', async () => {
  for (const name of ['metrika_stat_data', 'stat_data', 'stat.data', 'STAT.DATA']) {
    const { code, json } = await cli(['describe', name], {});
    assert.equal(code, 0, `не разобрано имя ${name}`);
    assert.equal(json.tool, 'metrika_stat_data');
  }
});

test('неизвестный метод возвращает похожие имена, а не пустой отказ', async () => {
  const { code, json } = await cli(['describe', 'metrika_stat_datta'], {});
  assert.equal(code, 2);
  assert.ok(json.did_you_mean.includes('metrika_stat_data'));
});

test('разбор аргументов: повтор флага копится, --no- даёт false, = разделяет', () => {
  const { values, positional } = parseArgv([
    'metrika_stat_data',
    '--ids',
    '1',
    '--ids',
    '2',
    '--date1=7daysAgo',
    '--no-human-traffic-only',
    '--pretty',
  ]);
  assert.deepEqual(positional, ['metrika_stat_data']);
  assert.deepEqual(values.ids, ['1', '2'], 'повтор флага потерял значение');
  assert.deepEqual(values.date1, ['7daysAgo']);
  assert.deepEqual(values.human_traffic_only, ['false']);
  assert.deepEqual(values.pretty, ['true'], 'флаг без значения должен читаться как признак');
});
