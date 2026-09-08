/**
 * Отчёт о дрейфе — это то, по чему принимают решение «принимать спеку или нет».
 * Молча пропущенное изменение здесь хуже отсутствия отчёта: PR выглядит
 * безобидным, а в спеке появился обязательный параметр или исчез метод.
 *
 * Поэтому каждый класс изменения проверяется тем, что отчёт его НАЗЫВАЕТ,
 * и отдельно — что на одинаковых спеках он молчит.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { diffSpecs } from '../tools/diff-spec.mjs'

const method = (over = {}) => ({
  api: 'management',
  resource: 'goal',
  slug: 'goals',
  docUrl: 'https://yandex.ru/dev/metrika/ru/management/openapi/goal/goals.md',
  tool: 'metrika_goal_list',
  title: 'Список целей',
  indexTitle: 'Список целей',
  description: null,
  generator: 'Diplodoc Platform v5.57.3',
  http: 'GET',
  url: 'https://api-metrika.yandex.net/management/v1/counter/{counterId}/goals',
  params: { path: [], query: [], header: [], body: [] },
  responses: [],
  ...over,
})

const spec = (methods, over = {}) => ({
  source: { llms: 'x', generator: 'Diplodoc Platform v5.57.3' },
  counts: { indexed: methods.length, parsed: methods.length, entities: 0 },
  methods,
  entities: {},
  problems: [],
  ...over,
})

const param = (over = {}) => ({
  name: 'counterId', required: false, deprecated: false, additional: false,
  type: { kind: 'primitive', type: 'integer' }, description: null, ...over,
})

test('одинаковые спеки — отчёт молчит', () => {
  const s = spec([method()])
  const { text, changed } = diffSpecs(s, structuredClone(s))
  assert.equal(changed, false)
  assert.match(text, /Изменений в спеке нет/)
})

test('добавленный метод назван', () => {
  const before = spec([method()])
  const after = spec([method(), method({ tool: 'metrika_goal_get', slug: 'goal', title: 'Информация о цели' })])
  const { text, changed } = diffSpecs(before, after)
  assert.equal(changed, true)
  assert.match(text, /добавил методов: 1/)
  assert.match(text, /metrika_goal_get/)
})

test('убранный метод назван и помечен ломающим', () => {
  const { text } = diffSpecs(spec([method()]), spec([]))
  assert.match(text, /убрал методов: 1/)
  assert.match(text, /ломающее изменение/)
})

test('параметр, ставший обязательным, назван отдельно от просто добавленного', () => {
  const before = spec([method({ params: { path: [], query: [param()], header: [], body: [] } })])
  const after = spec([method({ params: { path: [], query: [param({ required: true })], header: [], body: [] } })])
  const { text } = diffSpecs(before, after)
  assert.match(text, /стал обязательным/)
  assert.ok(!/добавлен query\.counterId/.test(text), 'существующий параметр не должен читаться как новый')
})

test('смена типа названа обеими сторонами', () => {
  const before = spec([method({ params: { path: [], query: [param()], header: [], body: [] } })])
  const after = spec([method({
    params: { path: [], query: [param({ type: { kind: 'array', items: { kind: 'primitive', type: 'integer' } } })], header: [], body: [] },
  })])
  assert.match(diffSpecs(before, after).text, /тип `integer` → `integer\[\]`/)
})

test('смена генератора выносится наверх как стоп-сигнал', () => {
  const before = spec([method()])
  const after = spec([method()], { source: { llms: 'x', generator: 'Diplodoc Platform v6.0.0' } })
  const { text } = diffSpecs(before, after)
  assert.match(text.split('\n')[0], /Сменился генератор/)
  assert.match(text, /нельзя принимать/)
})

test('длинные списки урезаются с явным остатком', () => {
  const many = Array.from({ length: 50 }, (_, i) => method({ tool: `metrika_x_${i}`, slug: `s${i}` }))
  const { text } = diffSpecs(spec([]), spec(many))
  assert.match(text, /добавил методов: 50/)
  assert.match(text, /и ещё 20/)
})

test('машинная сводка называет разряды изменений отдельно', () => {
  const before = spec([method()])
  const after = spec([method(), method({ tool: 'metrika_goal_get', slug: 'goal' })])
  const r = diffSpecs(before, after)
  assert.equal(r.changed, true)
  assert.equal(r.methodsAdded, 1)
  assert.equal(r.methodsRemoved, 0)
  assert.equal(r.generatorChanged, false)

  // На одинаковых спеках все разряды нулевые — иначе версия поднималась бы впустую.
  const same = diffSpecs(spec([method()]), spec([method()]))
  assert.deepEqual(
    { c: same.changed, a: same.methodsAdded, r: same.methodsRemoved, m: same.methodChanges },
    { c: false, a: 0, r: 0, m: 0 },
  )
})
