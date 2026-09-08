#!/usr/bin/env node
/**
 * Живая проверка против настоящего API — то, что нельзя доказать тестами на спеке.
 * Запуск: YANDEX_API_KEY=… node tools/smoke.mjs
 */
import { loadSpec } from '../build/spec.js'
import { executeMethod } from '../build/tools.js'

const token = process.env.YANDEX_API_KEY
if (!token) {
  console.error('нужен YANDEX_API_KEY')
  process.exit(1)
}

const spec = loadSpec()
const byTool = new Map(spec.methods.map((m) => [m.tool, m]))
const COUNTER = process.env.SMOKE_COUNTER_ID
if (!COUNTER) {
  console.error('нужен SMOKE_COUNTER_ID — идентификатор счётчика, на котором гонять проверки')
  process.exit(1)
}

let failed = 0
const check = async (name, tool, args, assertFn) => {
  try {
    const out = await executeMethod(byTool.get(tool), args, token)
    const verdict = assertFn(out)
    console.log(`  ${verdict === true ? '✔' : '✖'} ${name}${verdict === true ? '' : ` — ${verdict}`}`)
    if (verdict !== true) failed++
    return out
  } catch (e) {
    console.log(`  ✖ ${name} — ${e.name}: ${e.message}${e.body ? ' ' + JSON.stringify(e.body).slice(0, 200) : ''}`)
    failed++
    return null
  }
}

console.log('Management — чтение:')
await check('metrika_counter_list отдаёт счётчики', 'metrika_counter_list', {}, (o) =>
  Array.isArray(o.data?.counters) ? true : 'нет массива counters',
)
await check('metrika_goal_list отдаёт цели счётчика', 'metrika_goal_list', { counterId: COUNTER }, (o) =>
  Array.isArray(o.data?.goals) ? true : 'нет массива goals',
)

console.log('\nStat — отчёты:')
const statArgs = { ids: COUNTER, metrics: 'ym:s:visits', date1: '2026-09-01', date2: '2026-09-07' }
const stat = await check('metrika_stat_data считает визиты', 'metrika_stat_data', statArgs, (o) =>
  typeof o.data?.totals?.[0] === 'number' ? true : 'нет totals',
)
if (stat) {
  console.log(`      применено сервером: ${JSON.stringify(stat.meta.applied_by_server)}`)
  console.log(`      строк ${stat.meta.rows_returned}/${stat.meta.rows_total}, обрезано: ${stat.meta.truncated}`)
}

await check(
  'фильтр «только люди» отключается и это видно',
  'metrika_stat_data',
  { ...statArgs, human_traffic_only: false },
  // Проверяем содержание, а не число заметок: в notes едет ещё и напоминание,
  // что строки отчёта пишут посетители сайта.
  (o) =>
    o.meta.applied_by_server.length === 0 && o.meta.notes.some((n) => n.includes('отключён вызывающим'))
      ? true
      : 'фильтр не отключился или не отмечен',
)

await check('metrika_stat_bytime отдаёт ряд по дням', 'metrika_stat_bytime', { ...statArgs, group: 'day' }, (o) =>
  Array.isArray(o.data?.data) ? true : 'нет data',
)

console.log('\nОткрытый вопрос INFRA-1067 — приоритет дат у comparison/drilldown:')
const cmp = await check(
  'comparison_drilldown принимает оба набора дат',
  'metrika_stat_comparison_drilldown',
  {
    ids: COUNTER,
    metrics: 'ym:s:visits',
    date1_a: '2026-09-01',
    date2_a: '2026-09-03',
    date1_b: '2026-09-04',
    date2_b: '2026-09-06',
  },
  (o) => (o.data ? true : 'пустой ответ'),
)
if (cmp) console.log(`      query: ${cmp.meta.request_url.split('?')[1]?.slice(0, 160)}`)

console.log('\nОтказ остаётся отказом:')
try {
  await executeMethod(byTool.get('metrika_stat_data'), { ids: COUNTER, metrics: 'ym:s:НЕТ_ТАКОЙ_МЕТРИКИ' }, token)
  console.log('  ✖ неверная метрика прошла как успех')
  failed++
} catch (e) {
  const ok = e.name === 'MetrikaHttpError' && e.status >= 400
  console.log(`  ${ok ? '✔' : '✖'} неверная метрика → ${e.name} ${e.status ?? ''}`)
  if (!ok) failed++
}

console.log(`\nитог: ${failed === 0 ? 'все проверки пройдены' : `провалено ${failed}`}`)
process.exitCode = failed ? 1 : 0
