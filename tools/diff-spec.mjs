#!/usr/bin/env node
/**
 * Человекочитаемая разница двух спек.
 *
 * `git diff` на этом файле бесполезен: 460 КБ JSON, где перенос одного поля
 * выглядит как сотня изменённых строк. Решение «поменялось ли что-то важное»
 * принимают по этому отчёту, поэтому он называет вещи так, как их назвал бы
 * человек: «Яндекс добавил метод», «параметр стал обязательным».
 *
 * Запуск: node tools/diff-spec.mjs <старая.json> <новая.json>
 */
import { readFileSync } from 'node:fs'

/** Списки в отчёте ограничены: PR с тысячей строк никто не прочитает. */
const CAP = 30

const load = (p) => JSON.parse(readFileSync(p, 'utf8'))

const byTool = (spec) => new Map(spec.methods.map((m) => [m.tool, m]))

const allParams = (m) => [
  ...m.params.path.map((p) => ({ ...p, where: 'path' })),
  ...m.params.query.map((p) => ({ ...p, where: 'query' })),
  ...m.params.body.map((p) => ({ ...p, where: 'body' })),
]

/** Тип в одну строку — чтобы сравнивать и печатать без развесистого JSON. */
function typeStr(t) {
  if (!t) return 'нет'
  switch (t.kind) {
    case 'primitive':
      return t.format ? `${t.type}<${t.format}>` : t.type
    case 'array':
      return `${typeStr(t.items)}[]`
    case 'ref':
      return t.ref
    default:
      return t.raw ?? 'неизвестно'
  }
}

function capped(lines) {
  if (lines.length <= CAP) return lines
  return [...lines.slice(0, CAP), `- …и ещё ${lines.length - CAP}`]
}

export function diffSpecs(oldSpec, newSpec) {
  const out = []
  // Принимает несколько строк: `add(...capped(lines))` иначе теряет все, кроме первой.
  const add = (...lines) => out.push(...lines)

  // Смена генератора важнее любых цифр: разбор привязан к его разметке,
  // и при расхождении спеке нельзя доверять целиком.
  const g1 = oldSpec.source?.generator
  const g2 = newSpec.source?.generator
  if (g1 !== g2) {
    add(`## ⚠️ Сменился генератор документации\n`)
    add(`\`${g1}\` → \`${g2}\`\n`)
    add('Разбор привязан к разметке этой версии. Спеку нельзя принимать, пока')
    add('распознаватели не сверены с новой разметкой вручную.\n')
  }

  const c1 = oldSpec.counts
  const c2 = newSpec.counts
  if (JSON.stringify(c1) !== JSON.stringify(c2)) {
    add('## Счётчики\n')
    add('| | было | стало |')
    add('| --- | ---: | ---: |')
    add(`| методов в индексе | ${c1.indexed} | ${c2.indexed} |`)
    add(`| методов разобрано | ${c1.parsed} | ${c2.parsed} |`)
    add(`| сущностей | ${c1.entities} | ${c2.entities} |`)
    add('')
  }

  const o = byTool(oldSpec)
  const n = byTool(newSpec)

  const added = [...n.keys()].filter((k) => !o.has(k))
  const removed = [...o.keys()].filter((k) => !n.has(k))

  if (added.length) {
    add(`## Яндекс добавил методов: ${added.length}\n`)
    add(...capped(added.map((k) => {
      const m = n.get(k)
      return `- \`${k}\` — ${m.title ?? m.indexTitle} [${m.http} ${m.url}](${m.docUrl})`
    })))
    add('')
    add('Каждый новый метод становится новым инструментом сервера.\n')
  }

  if (removed.length) {
    add(`## Яндекс убрал методов: ${removed.length}\n`)
    add(...capped(removed.map((k) => `- \`${k}\` — ${o.get(k).title ?? o.get(k).indexTitle}`)))
    add('')
    add('Инструмент исчезнет. Если им пользовались — это ломающее изменение.\n')
  }

  // --- изменения внутри общих методов ---------------------------------------
  const paramLines = []
  for (const tool of [...n.keys()].filter((k) => o.has(k))) {
    const a = new Map(allParams(o.get(tool)).map((p) => [`${p.where}.${p.name}`, p]))
    const b = new Map(allParams(n.get(tool)).map((p) => [`${p.where}.${p.name}`, p]))

    for (const [key, p] of b) {
      if (!a.has(key)) {
        paramLines.push(`- \`${tool}\`: **добавлен** ${key}${p.required ? ' — **обязательный**' : ''}`)
        continue
      }
      const was = a.get(key)
      if (was.required !== p.required) {
        paramLines.push(
          `- \`${tool}\`: ${key} — ${p.required ? '**стал обязательным**' : 'стал необязательным'}`,
        )
      }
      const t1 = typeStr(was.type)
      const t2 = typeStr(p.type)
      if (t1 !== t2) paramLines.push(`- \`${tool}\`: ${key} — тип \`${t1}\` → \`${t2}\``)
      if (was.deprecated !== p.deprecated) {
        paramLines.push(`- \`${tool}\`: ${key} — ${p.deprecated ? 'помечен УСТАРЕВШИМ' : 'снята пометка «устарел»'}`)
      }
    }
    for (const key of a.keys()) {
      if (!b.has(key)) paramLines.push(`- \`${tool}\`: **убран** ${key}`)
    }

    const h1 = o.get(tool)
    const h2 = n.get(tool)
    if (h1.http !== h2.http) paramLines.push(`- \`${tool}\`: глагол ${h1.http} → ${h2.http}`)
    if (h1.url !== h2.url) paramLines.push(`- \`${tool}\`: адрес ${h1.url} → ${h2.url}`)
  }

  if (paramLines.length) {
    add(`## Изменения внутри существующих методов: ${paramLines.length}\n`)
    add(...capped(paramLines))
    add('')
  }

  // --- сущности --------------------------------------------------------------
  const e1 = new Set(Object.keys(oldSpec.entities ?? {}))
  const e2 = new Set(Object.keys(newSpec.entities ?? {}))
  const eAdded = [...e2].filter((k) => !e1.has(k))
  const eRemoved = [...e1].filter((k) => !e2.has(k))
  if (eAdded.length || eRemoved.length) {
    add('## Сущности\n')
    if (eAdded.length) add(...capped(eAdded.map((k) => `- добавлена \`${k}\``)))
    if (eRemoved.length) add(...capped(eRemoved.map((k) => `- убрана \`${k}\``)))
    add('')
  }

  const summary = {
    changed: out.length > 0,
    generatorChanged: g1 !== g2,
    methodsAdded: added.length,
    methodsRemoved: removed.length,
    methodChanges: paramLines.length,
    entitiesAdded: eAdded.length,
    entitiesRemoved: eRemoved.length,
  }
  if (!out.length) return { text: 'Изменений в спеке нет.', ...summary }
  return { text: out.join('\n'), ...summary }
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  const [, , oldPath, newPath] = process.argv
  if (!oldPath || !newPath) {
    console.error('запуск: node tools/diff-spec.mjs <старая.json> <новая.json>')
    process.exit(2)
  }
  const result = diffSpecs(load(oldPath), load(newPath))
  // --json — для тех, кто принимает решение машинно (какой разряд версии
  // поднимать, открывать ли PR). Разбирать прозу отчёта для этого нельзя.
  if (process.argv.includes('--json')) {
    const { text, ...summary } = result
    console.log(JSON.stringify(summary))
  } else {
    console.log(result.text)
  }
}
