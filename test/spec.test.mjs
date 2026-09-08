/**
 * Тесты спеки API Метрики.
 *
 * Каждый тест ниже ловит конкретный отказ, который уже наблюдался при разборе
 * страниц, — а не «проверяет, что код работает». Ловушки разметки перечислены
 * в INFRA-1066; здесь они закрыты негативными контролями.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { methodUrls } from '../tools/fetch-docs.mjs'
import { parsePage, parseType, assignToolNames, splitSlug, EXPECTED_GENERATOR } from '../tools/parse-spec.mjs'

/** Страницы-образцы лежат в репозитории: регрессии на ловушки разметки обязаны
 *  идти на свежем клоне, без сети и без прогретого кеша. */
const FIXTURES = fileURLToPath(new URL('./fixtures/', import.meta.url))
const spec = JSON.parse(await readFile(new URL('../spec/metrika-api.json', import.meta.url), 'utf8'))

const allParams = (m) => [...m.params.path, ...m.params.query, ...m.params.body]

/** Индекс берём живым: тест на дрейф без сети ничего не сторожит. */
async function fetchIndex() {
  try {
    const res = await fetch('https://yandex.ru/dev/metrika/ru/llms.txt', {
      headers: { 'User-Agent': 'yandex-metrika-mcp drift check' },
      signal: AbortSignal.timeout(20_000),
    })
    if (res.ok) return await res.text()
  } catch {
    /* сеть недоступна — ниже */
  }
  return null
}

// --- покрытие и дрейф ---------------------------------------------------------

test('дрейф: спека покрывает ровно те методы, что перечислены в llms.txt', async (t) => {
  const llms = await fetchIndex()
  if (!llms) {
    // Пропуск здесь честнее зелёного: тест на дрейф не может ничего утверждать
    // без обращения к источнику, а молчаливый зелёный читался бы как «сверено».
    t.skip('индекс недоступен по сети — дрейф не проверен')
    return
  }
  const indexed = methodUrls(llms).map((m) => m.url).sort()
  const covered = spec.methods.map((m) => m.docUrl).sort()

  const missing = indexed.filter((u) => !covered.includes(u))
  const extra = covered.filter((u) => !indexed.includes(u))

  assert.deepEqual(missing, [], 'в индексе есть методы, которых нет в спеке — Яндекс добавил метод')
  assert.deepEqual(extra, [], 'в спеке есть методы, которых нет в индексе — Яндекс удалил метод')
})

test('разбор не потерял ни одного метода', () => {
  assert.equal(spec.counts.parsed, spec.counts.indexed)
  assert.equal(spec.problems.length, 0, `проблемы разбора: ${spec.problems.join('; ')}`)
})

test('у каждого метода есть HTTP-метод и URL', () => {
  for (const m of spec.methods) {
    assert.ok(m.http, `${m.resource}/${m.slug}: нет HTTP-метода`)
    assert.match(m.url, /^https:\/\/api-metrika\.yandex\.net\//, `${m.resource}/${m.slug}: подозрительный URL`)
  }
})

test('ни один параметр не остался без типа или комбинатора', () => {
  const untyped = spec.methods.flatMap((m) =>
    allParams(m).filter((p) => !p.type && !p.combinator).map((p) => `${m.tool}.${p.name}`),
  )
  assert.deepEqual(untyped, [], 'параметр без типа означает дыру в сканере, а не необязательное поле')
})

test('имена инструментов уникальны', () => {
  const names = spec.methods.map((m) => m.tool)
  assert.equal(new Set(names).size, names.length)
})

test('имена инструментов состоят только из безопасных символов', () => {
  for (const m of spec.methods) assert.match(m.tool, /^metrika_[a-z0-9_]+$/)
})

// --- ловушки разметки: негативные контроли ------------------------------------

test('ловушка: имена свойств с подчёркиваниями не теряются', () => {
  // Имя обёрнуто в _курсив_, но само содержит подчёркивания. Нежадный матч
  // теряет ровно эти поля, и потеря невидима: параметр просто отсутствует.
  const names = new Set(spec.methods.flatMap((m) => allParams(m).map((p) => p.name)))
  for (const probe of ['counter_ids', 'per_page', 'label_id', 'date1_a']) {
    assert.ok(names.has(probe), `параметр ${probe} потерян сканером`)
  }
})

test('ловушка: строки-ассертации не попадают в спеку как параметры', () => {
  // `_Example:_{...}` имеет ту же форму, что строка свойства, и различается
  // только вторым CSS-классом.
  const names = new Set(spec.methods.flatMap((m) => allParams(m).map((p) => p.name)))
  for (const bad of ['Example:', 'Default:', 'Min length:', 'Max value:', 'Pattern:']) {
    assert.ok(!names.has(bad), `${bad} распознан как параметр`)
  }
})

test('ловушка: сущности с одинаковым именем и разными якорями не схлопываются', () => {
  // GoalE и GoalE1 — разные схемы: у ответной версии состав полей другой.
  assert.ok(spec.entities.GoalE, 'нет сущности GoalE')
  assert.ok(spec.entities.GoalE1, 'нет сущности GoalE1 — схлопнута с GoalE')
})

test('ловушка: тип приходит HTML-экранированным и разэкранируется', () => {
  assert.deepEqual(parseType('string&lt;date-time&gt;'), {
    kind: 'primitive',
    type: 'string',
    format: 'date-time',
  })
})

test('ловушка: комбинаторы размечены cut-заголовком, а не ключевым словом', async () => {
  const page = parsePage(await readFile(`${FIXTURES}addGoal.md`, 'utf8'), {
    api: 'management',
    resource: 'goal',
    slug: 'addGoal',
  })
  const goal = page.params.body.find((p) => p.name === 'goal')
  assert.ok(goal?.combinator, 'комбинатор One of 13 types не распознан')
  assert.equal(goal.combinator.marker, 'or')
  assert.equal(goal.combinator.quantity, 13)
  assert.equal(goal.combinator.branches.length, 13, 'потеряны ветви комбинатора')
})

test('ловушка: страницы с упрощённой разметкой метода тоже разбираются', async () => {
  // Ресурс chats размечен без класса .openapi__method — метод и URL одной строкой.
  const page = parsePage(await readFile(`${FIXTURES}findAll_chats.md`, 'utf8'), {
    api: 'management',
    resource: 'chats',
    slug: 'findAll_chats',
  })
  assert.equal(page.http, 'GET')
  assert.match(page.url, /^https:\/\/api-metrika\.yandex\.net\//)
})

test('guard: версия генератора зафиксирована', () => {
  assert.equal(spec.source.generator, EXPECTED_GENERATOR)
})

// --- разбор типов -------------------------------------------------------------

test('parseType разбирает примитивы, массивы и ссылки на сущности', () => {
  assert.deepEqual(parseType('string'), { kind: 'primitive', type: 'string' })
  assert.deepEqual(parseType('integer[]'), { kind: 'array', items: { kind: 'primitive', type: 'integer' } })
  assert.deepEqual(parseType('[CounterBrief](#entity-CounterBrief)'), {
    kind: 'ref',
    ref: 'CounterBrief',
    name: 'CounterBrief',
  })
  assert.deepEqual(parseType('[GoalE](#entity-GoalE1)[]'), {
    kind: 'array',
    items: { kind: 'ref', ref: 'GoalE1', name: 'GoalE' },
  })
})

// --- именование ---------------------------------------------------------------

test('слаг без глагола становится именем действия целиком', () => {
  assert.deepEqual(splitSlug({ resource: 'stat', slug: 'data_1', http: 'GET' }), { verb: 'get', qualifier: 'data' })
})

test('множественное число слага читается как список', () => {
  assert.equal(splitSlug({ resource: 'counter', slug: 'counters', http: 'GET' }).verb, 'list')
  assert.equal(splitSlug({ resource: 'counter', slug: 'counter', http: 'GET' }).verb, 'get')
  assert.equal(splitSlug({ resource: 'segment', slug: 'getSegmentsForCounter', http: 'GET' }).verb, 'list')
})

test('столкнувшиеся короткие имена разводятся уточнением, а не обрезаются', () => {
  const methods = [
    { resource: 'grant', slug: 'addGrant', http: 'POST' },
    { resource: 'grant', slug: 'addPublicGrant', http: 'POST' },
  ]
  assert.deepEqual(assignToolNames(methods), ['metrika_grant_create', 'metrika_grant_create_public'])
})

test('ключевые методы названы предсказуемо', () => {
  const byTool = new Map(spec.methods.map((m) => [m.tool, m]))
  for (const [tool, slug] of [
    ['metrika_stat_data', 'data_1'],
    ['metrika_stat_bytime', 'bytime'],
    ['metrika_counter_list', 'counters'],
    ['metrika_goal_create', 'addGoal'],
    ['metrika_logs_create', 'createLogRequest_1'],
  ]) {
    assert.equal(byTool.get(tool)?.slug, slug, `${tool} не соответствует ожидаемому методу`)
  }
})
