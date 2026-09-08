/**
 * Тесты сервера: схемы инструментов и сборка запроса.
 *
 * Проверяется контракт, ради которого сервер переписан, — что запрос уходит
 * тем, каким его собрал вызывающий, и что всё добавленное сервером видно.
 * Работают против собранного build/, поэтому требуют `npx tsc` перед запуском.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadSpec, pathPlaceholders } from '../build/spec.js'
import { buildInputSchema, inputSlots, HUMAN_TRAFFIC_FILTER } from '../build/tools.js'

const spec = loadSpec()
const byTool = new Map(spec.methods.map((m) => [m.tool, m]))

test('сервер поднимает ровно столько инструментов, сколько методов в спеке', () => {
  assert.equal(spec.methods.length, 108)
  assert.equal(spec.problems.length, 0)
})

test('у каждого инструмента строится схема ввода без падений', () => {
  for (const m of spec.methods) {
    const shape = buildInputSchema(m)
    assert.ok(shape && typeof shape === 'object', `${m.tool}: схема не построилась`)
  }
})

test('все плейсхолдеры URL присутствуют в схеме ввода — иначе путь не собрать', () => {
  for (const m of spec.methods) {
    const slots = inputSlots(m)
    const pathNames = new Set([...slots.values()].filter((s) => s.where === 'path').map((s) => s.param.name))
    for (const ph of pathPlaceholders(m.url)) {
      assert.ok(pathNames.has(ph), `${m.tool}: плейсхолдер {${ph}} не описан во вводе`)
    }
  }
})

test('обязательные параметры документации остаются обязательными в схеме', () => {
  const data = byTool.get('metrika_stat_data')
  const shape = buildInputSchema(data, spec.entities)
  assert.equal(shape.ids.isOptional(), false, 'ids обязателен по документации')
  assert.equal(shape.metrics.isOptional(), false, 'metrics обязателен по документации')
  assert.equal(shape.dimensions.isOptional(), true, 'dimensions необязателен')

  // Проверка одного метода эту дыру не ловила: обязательность терялась только
  // у параметров-комбинаторов (goal, grant), которых у stat/data нет.
  const lost = []
  for (const m of spec.methods) {
    const built = buildInputSchema(m, spec.entities)
    for (const where of ['path', 'query', 'body']) {
      for (const p of m.params[where]) {
        if (p.required && built[p.name] && built[p.name].isOptional()) lost.push(`${m.tool}.${p.name}`)
      }
    }
  }
  assert.deepEqual(lost, [], `обязательность потеряна: ${lost.join(', ')}`)
})

test('фильтр «только люди» объявлен в схеме отчётов Stat и отсутствует в остальных', () => {
  for (const m of spec.methods) {
    const shape = buildInputSchema(m)
    const declared = 'human_traffic_only' in shape
    assert.equal(declared, m.api === 'stat', `${m.tool}: неверное наличие human_traffic_only`)
  }
})

test('описание фильтра называет само условие, а не прячет его', () => {
  const shape = buildInputSchema(byTool.get('metrika_stat_data'))
  const text = shape.human_traffic_only.description
  assert.ok(text.includes(HUMAN_TRAFFIC_FILTER), 'условие фильтра должно быть видно в описании инструмента')
})

test('Stat API: у comparison нет обычных дат, а у остальных есть', () => {
  const dates = (tool) => new Set(Object.keys(buildInputSchema(byTool.get(tool))))
  assert.ok(dates('metrika_stat_data').has('date1'))
  assert.ok(!dates('metrika_stat_comparison').has('date1'), 'у comparison дат date1/date2 быть не должно')
  assert.ok(dates('metrika_stat_comparison').has('date1_a'))
  assert.ok(dates('metrika_stat_comparison').has('date1_b'))
})

test('Logs API покрыт целиком и жизненный цикл виден по именам', () => {
  const logs = spec.methods.filter((m) => m.api === 'logs').map((m) => m.tool).sort()
  assert.deepEqual(logs, [
    'metrika_logs_cancel',
    'metrika_logs_clean',
    'metrika_logs_create',
    'metrika_logs_download',
    'metrika_logs_evaluate',
    'metrika_logs_get',
    'metrika_logs_list',
  ])
})

test('Management API покрыт целиком: 95 методов и 21 ресурс', () => {
  const mgmt = spec.methods.filter((m) => m.api === 'management')
  assert.equal(mgmt.length, 95)
  assert.equal(new Set(mgmt.map((m) => m.resource)).size, 21)
})

test('появились методы записи, которых в прежнем сервере не было вовсе', () => {
  for (const tool of ['metrika_goal_create', 'metrika_counter_create', 'metrika_segment_create', 'metrika_filter_delete']) {
    assert.ok(byTool.has(tool), `нет инструмента ${tool}`)
  }
})

test('счётчик больше не нужно знать заранее — есть список счётчиков', () => {
  const list = byTool.get('metrika_counter_list')
  assert.equal(list.http, 'GET')
  assert.equal(list.url, 'https://api-metrika.yandex.net/management/v1/counters')
})
