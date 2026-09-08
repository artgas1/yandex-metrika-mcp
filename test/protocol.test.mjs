/**
 * Проверка сервера как MCP-сервера: по stdio, через JSON-RPC, тем же способом,
 * каким с ним говорит клиент. Всё остальное в этом репозитории проверяет
 * внутренние функции — а сервер может собираться, проходить те тесты и при этом
 * не отвечать на initialize.
 *
 * Сеть не нужна: METRIKA_API_BASE уводит запросы на заглушку, поднятую здесь же.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { startServer } from '../tools/mcp-client.mjs';

const SPEC = JSON.parse(
  await import('node:fs').then((fs) =>
    fs.readFileSync(new URL('../spec/metrika-api.json', import.meta.url), 'utf8'),
  ),
);
const EXPECTED_TOOLS = SPEC.methods.length;

const STAT_ROWS = [
  { dimensions: [{ name: 'Прямые заходы' }], metrics: [42] },
  { dimensions: [{ name: 'Поиск' }], metrics: [17] },
];

/** Заглушка API: отдаёт отчёт, а на заведомо плохую метрику — 400, как Метрика. */
async function withStub(run) {
  const seen = [];
  const stub = createServer((req, res) => {
    seen.push({ url: req.url, method: req.method, auth: req.headers.authorization });
    if (req.url.includes('ym%3As%3Anonsense') || req.url.includes('ym:s:nonsense')) {
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ errors: [{ error_type: 'invalid_parameter', message: 'metric is unknown' }] }));
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ query: {}, data: STAT_ROWS, total_rows: 250, sampled: false }));
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
 * Каталожные проверки ниже говорят про ВСЕ методы спеки, поэтому им нужен полный
 * профиль. По умолчанию сервер объявляет `core` — это отдельный контракт, и он
 * проверяется в test/surface.test.mjs.
 */
async function connected(env, run) {
  const client = startServer({
    YANDEX_API_KEY: 'stub-token',
    METRIKA_PROFILE: 'all',
    METRIKA_ALLOW_WRITES: '1',
    ...env,
  });
  try {
    const info = await client.initialize();
    return await run(client, info);
  } finally {
    client.close();
  }
}

test('сервер отвечает на initialize и представляется', async () => {
  await connected({}, async (_client, info) => {
    assert.equal(info.serverInfo.name, 'yandex-metrika-mcp-server');
    assert.match(info.serverInfo.version, /^\d+\.\d+\.\d+$/);
    assert.ok(info.capabilities.tools, 'сервер обязан объявить capability tools');
  });
});

test('tools/list отдаёт все методы спеки, с описанием и схемой', async () => {
  await connected({}, async (client) => {
    const tools = await client.listAllTools();
    assert.equal(tools.length, EXPECTED_TOOLS, `ожидали ${EXPECTED_TOOLS} инструментов`);

    const names = new Set(tools.map((t) => t.name));
    assert.equal(names.size, tools.length, 'имена инструментов обязаны быть уникальны');
    for (const legacy of ['get_visits', 'sources_summary', 'get_account_info']) {
      assert.ok(!names.has(legacy), `пресет ${legacy} должен был исчезнуть вместе с lib/`);
    }
    for (const t of tools) {
      assert.ok(t.description && t.description.length > 20, `${t.name}: пустое описание`);
      assert.equal(t.inputSchema.type, 'object', `${t.name}: схема не объект`);
      assert.ok(t.description.includes('https://yandex.ru/dev/metrika/'), `${t.name}: нет ссылки на документацию`);
    }
  });
});

test('у каждого инструмента проставлены аннотации, и они совпадают с глаголом', async () => {
  await connected({}, async (client) => {
    const tools = await client.listAllTools();
    const byName = new Map(tools.map((t) => [t.name, t]));

    for (const t of tools) {
      assert.ok(t.annotations, `${t.name}: аннотаций нет — клиент не отличит чтение от удаления`);
      for (const key of ['readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint']) {
        assert.equal(typeof t.annotations[key], 'boolean', `${t.name}: нет ${key}`);
      }
    }

    // Ни один GET не помечен разрушающим, ни один DELETE — читающим.
    for (const m of SPEC.methods) {
      const a = byName.get(m.tool).annotations;
      if (m.http === 'GET') {
        assert.equal(a.readOnlyHint, true, `${m.tool}: GET, но не readOnly`);
        assert.equal(a.destructiveHint, false, `${m.tool}: GET, но destructive`);
      } else {
        assert.equal(a.readOnlyHint, false, `${m.tool}: ${m.http}, но readOnly`);
      }
      if (m.http === 'DELETE') assert.equal(a.destructiveHint, true, `${m.tool}: DELETE не помечен destructive`);
    }

    // Удаление под глаголом POST — пять ручек, которые по глаголу не отличить.
    for (const tool of [
      'metrika_measurement_delete',
      'metrika_expense_create_remove_body',
      'metrika_expense_create_remove_single_line',
      'metrika_logs_clean',
      'metrika_logs_cancel',
    ]) {
      assert.equal(byName.get(tool).annotations.destructiveHint, true, `${tool}: удаление под POST не помечено`);
    }

    const readOnly = tools.filter((t) => t.annotations.readOnlyHint).length;
    assert.equal(readOnly, SPEC.methods.filter((m) => m.http === 'GET').length);
  });
});

test('tools/call доходит до API и возвращает данные с _meta', async () => {
  await withStub(async (base, seen) => {
    await connected({ METRIKA_API_BASE: base }, async (client) => {
      const res = await client.callTool('metrika_stat_data', {
        ids: '1',
        metrics: 'ym:s:visits',
        dimensions: 'ym:s:trafficSource',
      });
      assert.notEqual(res.isError, true, `неожиданный отказ: ${res.content?.[0]?.text}`);
      const payload = JSON.parse(res.content[0].text);
      assert.equal(payload.data.data.length, 2);
      assert.equal(payload._meta.tool, 'metrika_stat_data');
      assert.equal(payload._meta.rows_total, 250);
      assert.equal(payload._meta.truncated, true, 'выдача урезана Метрикой — это должно быть видно');
      assert.ok(
        payload._meta.applied_by_server.some((s) => s.includes('isRobot')),
        'фильтр «только люди» обязан быть объявлен в ответе',
      );

      // Запрос действительно ушёл, с OAuth-заголовком и нашим фильтром.
      const call = seen.at(-1);
      assert.equal(call.auth, 'OAuth stub-token');
      assert.ok(decodeURIComponent(call.url).includes("ym:s:isRobot=='no'"));
    });
  });
});

test('ошибка API возвращается как isError, а не как успешный текст', async () => {
  await withStub(async (base) => {
    await connected({ METRIKA_API_BASE: base }, async (client) => {
      const res = await client.callTool('metrika_stat_data', { ids: '1', metrics: 'ym:s:nonsense' });
      assert.equal(res.isError, true, 'отказ API обязан приезжать как isError');
      const payload = JSON.parse(res.content[0].text);
      assert.equal(payload.error.status, 400);
      assert.match(JSON.stringify(payload.error.body), /invalid_parameter/);
    });
  });
});

test('меняющие данные инструменты не объявлены, пока запись выключена', async () => {
  await withStub(async (base, seen) => {
    await connected({ METRIKA_API_BASE: base, METRIKA_ALLOW_WRITES: '' }, async (client) => {
      const before = seen.length;
      const names = (await client.listAllTools()).map((t) => t.name);
      assert.ok(
        !names.includes('metrika_counter_delete'),
        'удаляющий инструмент не должен попадать в tools/list без METRIKA_ALLOW_WRITES',
      );
      // Объявлять и отказывать на вызове — худший вариант: контекст платится
      // полностью, а позвать нельзя. Проверяем именно отсутствие в манифесте,
      // а следом — что вызов отбивается самим протоколом.
      const res = await client.callTool('metrika_counter_delete', { counterId: '1' });
      assert.equal(res.isError, true);
      assert.match(res.content[0].text, /not found/);
      assert.equal(seen.length, before, 'до API запрос дойти был не должен');
    });
  });
});

test('METRIKA_ALLOW_WRITES=1 снимает запрет', async () => {
  await withStub(async (base, seen) => {
    await connected({ METRIKA_API_BASE: base, METRIKA_ALLOW_WRITES: '1' }, async (client) => {
      const before = seen.length;
      const res = await client.callTool('metrika_counter_delete', { counterId: '1' });
      assert.notEqual(res.isError, true, `неожиданный отказ: ${res.content?.[0]?.text}`);
      assert.equal(seen.length, before + 1, 'запрос обязан был уйти');
      assert.equal(seen.at(-1).method, 'DELETE');
    });
  });
});

test('секрет из строки запроса не попадает в ответ', async () => {
  await withStub(async (base) => {
    await connected({ METRIKA_API_BASE: base, METRIKA_ALLOW_WRITES: '1' }, async (client) => {
      const res = await client.callTool('metrika_measurement_delete', {
        counterId: '1',
        token: 'СЕКРЕТНОЕ-ЗНАЧЕНИЕ',
      });
      const text = res.content[0].text;
      assert.ok(!text.includes('СЕКРЕТНОЕ-ЗНАЧЕНИЕ'), 'значение token уехало в ответ');
      assert.match(text, /token=REDACTED/);
    });
  });
});

test('METRIKA_TOOLS сужает набор, не ломая сервер', async () => {
  await connected({ METRIKA_TOOLS: 'stat,logs' }, async (client) => {
    const tools = await client.listAllTools();
    const expected = SPEC.methods.filter((m) => m.api === 'stat' || m.api === 'logs').length;
    assert.equal(tools.length, expected);
    assert.ok(tools.every((t) => t.name.startsWith('metrika_')));
  });
});

test('в stdout не попадает ничего, кроме JSON-RPC', async () => {
  await connected({ METRIKA_PROFILE: 'core', METRIKA_ALLOW_WRITES: '' }, async (client) => {
    await client.listAllTools();
    // Стартовая сводка и предупреждения обязаны идти в stderr: один print в
    // stdout ломает stdio-транспорт целиком.
    assert.match(client.stderr, /yandex-metrika-mcp \d+\.\d+\.\d+: METRIKA_PROFILE=core, инструментов/);
    assert.match(client.stderr, /не объявлены/);
  });
});

test('обязательные параметры спеки попадают в required схемы', async () => {
  await connected({}, async (client) => {
    const byName = new Map((await client.listAllTools()).map((t) => [t.name, t]));
    const lost = [];
    for (const m of SPEC.methods) {
      const required = new Set(byName.get(m.tool).inputSchema.required ?? []);
      for (const where of ['path', 'query', 'body']) {
        for (const p of m.params[where]) {
          if (p.required && !required.has(p.name)) lost.push(`${m.tool}.${p.name}`);
        }
      }
    }
    // Негативный контроль: пока комбинаторы собирались как z.unknown(), сюда
    // попадали goal у создания и правки цели и grant у выдачи доступа — zod
    // считает unknown необязательным, и обязательность терялась молча.
    assert.deepEqual(lost, [], `обязательность потеряна: ${lost.join(', ')}`);
  });
});

test('примеры и ограничения из документации доезжают до схемы', async () => {
  await connected({}, async (client) => {
    const tools = await client.listAllTools();
    const dump = JSON.stringify(tools);
    // Ассертации размечены отдельной строкой, значение стоит ПОСЛЕ закрывающей
    // скобки класса. Пока распознаватель этого не умел, не доезжало ни одного
    // примера, ни одного значения по умолчанию и ни одной границы.
    const withExample = tools.filter((t) => /Пример: /.test(JSON.stringify(t.inputSchema))).length;
    assert.ok(withExample >= 20, `инструментов с примерами всего ${withExample}`);
    assert.match(dump, /"maxLength":/);
    assert.match(dump, /"minimum":/);
    assert.match(dump, /По умолчанию: /);
  });
});

test('список через запятую принимается там, где документация его и описывает', async () => {
  await withStub(async (base, seen) => {
    await connected({ METRIKA_API_BASE: base }, async (client) => {
      const res = await client.callTool('metrika_stat_data', { ids: '11,22', metrics: 'ym:s:visits' });
      assert.notEqual(res.isError, true, `неожиданный отказ: ${res.content?.[0]?.text}`);
      assert.match(decodeURIComponent(seen.at(-1).url), /ids=11,22/);
    });
  });
});

test('слишком длинный ответ урезается с объявлением', async () => {
  const rows = Array.from({ length: 4000 }, (_, i) => ({
    dimensions: [{ name: `строка ${i} с достаточно длинным названием, чтобы ответ вырос` }],
    metrics: [i],
  }));
  const stub = createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ data: rows, total_rows: rows.length }));
  });
  await new Promise((r) => stub.listen(0, '127.0.0.1', r));
  try {
    const base = `http://127.0.0.1:${stub.address().port}`;
    await connected({ METRIKA_API_BASE: base, METRIKA_MAX_OUTPUT_CHARS: '20000' }, async (client) => {
      const res = await client.callTool('metrika_stat_data', { ids: '1', metrics: 'ym:s:visits' });
      const text = res.content[0].text;
      assert.ok(text.length <= 20_000, `ответ ${text.length} символов при потолке 20000`);
      const payload = JSON.parse(text);
      const cut = payload._meta.truncated_by_server;
      assert.ok(cut, 'урезание обязано быть объявлено, иначе выдача читается как полная');
      assert.ok(cut.rows_dropped > 0);
      assert.equal(cut.rows_kept + cut.rows_dropped, rows.length);
    });
  } finally {
    await new Promise((r) => stub.close(r));
  }
});

test('дефолтный фильтр режет только роботов и ничего сверх того', async () => {
  await withStub(async (base, seen) => {
    await connected({ METRIKA_API_BASE: base }, async (client) => {
      const tools = await client.listAllTools();
      const stat = tools.find((t) => t.name === 'metrika_stat_data');
      const desc = stat.inputSchema.properties.human_traffic_only.description;

      // Негативный контроль на возврат нашей эвристики в общий пакет: у чужого
      // счётчика из Сингапура прежний дефолт молча вырезал бы живой трафик.
      assert.ok(!desc.includes('Singapore'), 'страна попала в дефолтный фильтр');
      assert.ok(!desc.includes('HeadlessChrome'), 'браузер попал в дефолтный фильтр');
      assert.match(desc, /ym:s:isRobot=='no'/);

      await client.callTool('metrika_stat_data', { ids: '1', metrics: 'ym:s:visits' });
      const sent = decodeURIComponent(seen.at(-1).url);
      assert.match(sent, /ym:s:isRobot=='no'/);
      assert.ok(!sent.includes('Singapore'), 'страна уехала в запрос');
    });
  });
});

test('METRIKA_TRAFFIC_FILTER заменяет условие целиком и объявлен в ответе', async () => {
  const custom = "ym:s:isRobot=='no' AND ym:s:regionCountryName!='Singapore'";
  await withStub(async (base, seen) => {
    await connected({ METRIKA_API_BASE: base, METRIKA_TRAFFIC_FILTER: custom }, async (client) => {
      const tools = await client.listAllTools();
      const desc = tools.find((t) => t.name === 'metrika_stat_data').inputSchema.properties
        .human_traffic_only.description;
      assert.ok(desc.includes('Singapore'), 'своё условие обязано быть видно в схеме');

      const res = await client.callTool('metrika_stat_data', { ids: '1', metrics: 'ym:s:visits' });
      const payload = JSON.parse(res.content[0].text);
      assert.ok(
        payload._meta.applied_by_server.some((x) => x.includes('Singapore')),
        'своё условие обязано быть объявлено в ответе',
      );
      assert.match(decodeURIComponent(seen.at(-1).url), /Singapore/);
      assert.match(client.stderr, /METRIKA_TRAFFIC_FILTER задан/);
    });
  });
});

test('своё условие складывается с условием вызывающего, а не затирает его', async () => {
  await withStub(async (base, seen) => {
    await connected({ METRIKA_API_BASE: base }, async (client) => {
      const res = await client.callTool('metrika_stat_data', {
        ids: '1',
        metrics: 'ym:s:visits',
        filters: "ym:s:trafficSource=='ad'",
      });
      const payload = JSON.parse(res.content[0].text);
      const sent = decodeURIComponent(seen.at(-1).url);
      assert.match(sent, /trafficSource=='ad'/);
      assert.match(sent, /isRobot=='no'/);
      assert.ok(
        payload._meta.applied_by_server.some((x) => x.includes('исходное условие')),
        'исходное условие вызывающего обязано быть названо',
      );
    });
  });
});

test('сравнение периода с самим собой объявлено, а не выдано за сравнение', async () => {
  // Метрика на отсутствие дат НЕ ругается: подставляет своё окно в оба набора
  // и возвращает совершенно валидный на вид ответ — оба набора метрик равны,
  // а в query видно date1_a == date1_b.
  const stub = createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const a1 = url.searchParams.get('date1_a') ?? '2026-09-02';
    const a2 = url.searchParams.get('date2_a') ?? '2026-09-08';
    const b1 = url.searchParams.get('date1_b') ?? '2026-09-02';
    const b2 = url.searchParams.get('date2_b') ?? '2026-09-08';
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        query: { date1_a: a1, date2_a: a2, date1_b: b1, date2_b: b2 },
        data: [],
        totals: { a: [1000], b: [1000] },
      }),
    );
  });
  await new Promise((r) => stub.listen(0, '127.0.0.1', r));
  try {
    const base = `http://127.0.0.1:${stub.address().port}`;
    await connected({ METRIKA_API_BASE: base }, async (client) => {
      const bare = JSON.parse(
        (await client.callTool('metrika_stat_comparison', { ids: '1', metrics: 'ym:s:visits' })).content[0].text,
      );
      assert.ok(
        bare._meta.notes.some((n) => n.includes('не заданы')),
        'вызов без периодов обязан быть отмечен — иначе это сравнение с самим собой под видом сравнения',
      );

      const same = JSON.parse(
        (
          await client.callTool('metrika_stat_comparison', {
            ids: '1', metrics: 'ym:s:visits',
            date1_a: '2026-09-01', date2_a: '2026-09-03',
            date1_b: '2026-09-01', date2_b: '2026-09-03',
          })
        ).content[0].text,
      );
      assert.ok(same._meta.notes.some((n) => n.includes('совпали')));

      const proper = JSON.parse(
        (
          await client.callTool('metrika_stat_comparison', {
            ids: '1', metrics: 'ym:s:visits',
            date1_a: '2026-09-01', date2_a: '2026-09-03',
            date1_b: '2026-08-01', date2_b: '2026-08-03',
          })
        ).content[0].text,
      );
      assert.ok(
        !proper._meta.notes.some((n) => n.includes('совпали') || n.includes('не заданы')),
        'нормальное сравнение не должно получать предупреждение — иначе оно обесценится',
      );
    });
  } finally {
    await new Promise((r) => stub.close(r));
  }
});

test('сырая выгрузка Logs режется ровно по потолку, а не примерно', async () => {
  // Сутки визитов — сотни тысяч символов TSV, то есть штатный download упирается
  // в потолок практически всегда. Прежняя оценка служебной части «на глаз минус
  // 200» давала перелёт: при потолке 5000 ответ выходил 5052.
  const tsv = 'ym:s:visitID\tym:s:dateTime\tym:s:startURL\n' + '123\t2026-09-05 10:00:00\thttps://example.com/\n'.repeat(9000);
  const stub = createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'text/tab-separated-values' });
    res.end(tsv);
  });
  await new Promise((r) => stub.listen(0, '127.0.0.1', r));
  try {
    const base = `http://127.0.0.1:${stub.address().port}`;
    for (const cap of ['800', '5000', '40000']) {
      await connected({ METRIKA_API_BASE: base, METRIKA_MAX_OUTPUT_CHARS: cap }, async (client) => {
        const res = await client.callTool('metrika_logs_download', {
          counterId: 1, requestId: 1, partNumber: 0,
        });
        const text = res.content[0].text;
        assert.ok(text.length <= Number(cap), `потолок ${cap}, а ответ ${text.length} символов`);
        const cut = JSON.parse(text)._meta.truncated_by_server;
        assert.ok(cut, 'урезание обязано быть объявлено');
        assert.equal(cut.chars_total, tsv.length);
        assert.ok(cut.chars_kept < cut.chars_total);
      });
    }
  } finally {
    await new Promise((r) => stub.close(r));
  }
});
