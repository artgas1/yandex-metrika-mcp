#!/usr/bin/env node
/**
 * Разбирает страницы документации API Яндекс Метрики в машиночитаемую спеку.
 *
 * Почему сканер по строкам и CSS-классам, а не markdown-парсер: страницы
 * сгенерированы Diplodoc из OpenAPI, и вся семантика (тип, required, комбинатор,
 * ассертация) лежит именно в классах вида {.json-schema-property}, а не в
 * структуре markdown. Дерево markdown про эту семантику не знает ничего.
 */
import { readFile, readdir, writeFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { methodUrls, classify } from './fetch-docs.mjs'

export const CACHE_DIR = fileURLToPath(new URL('../.cache/docs/', import.meta.url))
export const SPEC_PATH = fileURLToPath(new URL('../spec/metrika-api.json', import.meta.url))

/** Версия генератора, на которой проверена разметка. Расхождение — повод остановиться. */
export const EXPECTED_GENERATOR = 'Diplodoc Platform v5.57.3'

// --- строковые распознаватели -------------------------------------------------

/**
 * Строка свойства: `_имя_{.json-schema-reset .json-schema-property ...}`.
 * Матч по имени ЖАДНЫЙ: имена сами содержат подчёркивания (counter_ids, per_page),
 * и нежадный `[^_]+` теряет ровно те поля, которые нужнее всего.
 */
const PROPERTY_RE = /^(\s*)_(.+)_\{\.json-schema-reset\s+([^}]*)\}\s*$/

/**
 * Ассертация: `_Example:_{.json-schema-reset .json-schema-example} \`значение\``.
 * Отдельный распознаватель нужен потому, что значение стоит ПОСЛЕ закрывающей
 * скобки, а PROPERTY_RE заякорен на конец строки и такие строки не матчит вовсе.
 * Пока этого распознавателя не было, 915 примеров, 97 значений по умолчанию и
 * 448 ограничений из документации не доезжали до спеки молча: часть падала в
 * описание соседнего поля, остальное терялось.
 */
const ASSERTION_RE = /^\s*_([A-Za-z][A-Za-z ]*:)_\{\.json-schema-reset\s+([^}]*)\}\s*(.*)$/

/** `**Type**: string` | `string[]` | `[Entity](#entity-Entity)` | `[Entity](#entity-E)[]` */
const TYPE_RE = /^\s*(?:-\s+)?\*\*Type\*\*:\s*(.+?)\s*$/

/** `{% cut "**One of 13 types**" %}{.json-schema-combinators data-marker=or}` */
const COMBINATOR_RE = /\{%\s*cut\s+"\*\*(One|All|Any) of (\d+) types?\*\*"\s*%\}\{\.json-schema-combinators\s+data-marker=(\w+)\}/

/** `### GoalE {#entity-GoalE1}` — якорь отличает разные схемы под одним именем. */
const ENTITY_RE = /^###\s+(.+?)\s*\{#entity-([A-Za-z0-9_]+)\}\s*$/

const HTTP_RE = /^(GET|POST|PUT|PATCH|DELETE)\s*\{\.openapi__method\}\s*$/
/** Часть страниц (ресурс chats) размечена проще: метод и URL одной строкой, без класса. */
const HTTP_INLINE_RE = /^(GET|POST|PUT|PATCH|DELETE)\s+(https:\/\/\S+)\s*$/
const RESPONSE_CODE_RE = /openapi__response__code__(\d{3})/

const unescapeHtml = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"')

/** Разбирает правую часть `**Type**:` в структурный вид. */
export function parseType(raw) {
  const text = unescapeHtml(raw).trim()
  const refArray = text.match(/^\[([^\]]+)\]\(#entity-([A-Za-z0-9_]+)\)\[\]$/)
  if (refArray) return { kind: 'array', items: { kind: 'ref', ref: refArray[2], name: refArray[1] } }
  const ref = text.match(/^\[([^\]]+)\]\(#entity-([A-Za-z0-9_]+)\)$/)
  if (ref) return { kind: 'ref', ref: ref[2], name: ref[1] }
  const withFormat = text.match(/^(\w+)<([^>]+)>$/)
  if (withFormat) return { kind: 'primitive', type: withFormat[1], format: withFormat[2] }
  const arr = text.match(/^(\w+)\[\]$/)
  if (arr) return { kind: 'array', items: { kind: 'primitive', type: arr[1] } }
  if (/^\w+$/.test(text)) return { kind: 'primitive', type: text }
  return { kind: 'unknown', raw: text }
}

/** Классы после `.json-schema-reset` — они и несут смысл строки. */
function classesOf(chunk) {
  return chunk
    .split(/\s+/)
    .map((c) => c.replace(/^\./, ''))
    .filter(Boolean)
}

const ASSERTION_LABELS = {
  'Default:': 'default',
  'Example:': 'example',
  'Min length:': 'minLength',
  'Max length:': 'maxLength',
  'Min value:': 'minimum',
  'Max value:': 'maximum',
  'Pattern:': 'pattern',
  'Min items:': 'minItems',
  'Max items:': 'maxItems',
  'Unique items:': 'uniqueItems',
}

/**
 * Разбирает одну страницу метода.
 * Секции опциональны и встречаются в разном составе: у одних страниц есть
 * Query parameters и нет Body, у других наоборот.
 */
export function parsePage(text, meta) {
  const lines = text.split('\n')

  const generator = (text.match(/content:\s*(Diplodoc Platform v[\d.]+)/) || [])[1] || null

  const page = {
    ...meta,
    title: null,
    description: null,
    generator,
    http: null,
    url: null,
    params: { path: [], query: [], header: [], body: [] },
    responses: [],
    entities: [],
  }

  // Куда складывать свойства: до `## Responses` — в запрос, после — в ответ.
  let inResponses = false
  let section = null // 'path' | 'query' | 'header' | 'body'
  let entity = null // текущая сущность, если мы внутри неё
  let current = null // текущее свойство, к которому липнут Type/Default/Example
  let pendingCombinator = null

  const target = () => {
    if (entity) return entity.properties
    if (inResponses) return null // тело ответа держим отдельно от параметров запроса
    return section ? page.params[section] : null
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!page.title) {
      const h1 = line.match(/^#\s+(.+?)\s*$/)
      if (h1) {
        page.title = h1[1].trim()
        // описание — первый непустой абзац после H1, до первого H2
        for (let j = i + 1; j < lines.length; j++) {
          const l = lines[j].trim()
          if (!l || l.startsWith('<!--') || l.startsWith('<div')) continue
          if (l.startsWith('#')) break
          page.description = l
          break
        }
        continue
      }
    }

    const http = line.match(HTTP_RE)
    if (http) {
      page.http = http[1]
      // URL лежит в следующем блоке ```text
      for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
        if (lines[j].startsWith('```')) continue
        if (lines[j].trim().startsWith('https://')) {
          page.url = lines[j].trim()
          break
        }
      }
      continue
    }

    const httpInline = line.match(HTTP_INLINE_RE)
    if (httpInline && !page.http) {
      page.http = httpInline[1]
      page.url = httpInline[2]
      continue
    }

    const code = line.match(RESPONSE_CODE_RE)
    if (code) {
      if (!page.responses.includes(code[1])) page.responses.push(code[1])
      continue
    }

    if (/^##\s+Responses\s*$/.test(line)) {
      inResponses = true
      section = null
      entity = null
      current = null
      continue
    }

    const entityHeading = line.match(ENTITY_RE)
    if (entityHeading) {
      entity = { name: entityHeading[1], anchor: entityHeading[2], properties: [] }
      page.entities.push(entity)
      current = null
      continue
    }

    const h3 = line.match(/^###\s+(.+?)\s*$/)
    if (h3 && !entityHeading) {
      const name = h3[1].toLowerCase()
      entity = null
      current = null
      if (name.startsWith('path parameter')) section = 'path'
      else if (name.startsWith('query parameter')) section = 'query'
      else if (name.startsWith('header')) section = 'header'
      else if (name === 'body') section = inResponses ? null : 'body'
      else section = null
      continue
    }

    const comb = line.match(COMBINATOR_RE)
    if (comb) {
      pendingCombinator = { marker: comb[3], quantity: Number(comb[2]), branches: [] }
      if (current) current.combinator = pendingCombinator
      continue
    }

    const assertion = line.match(ASSERTION_RE)
    if (assertion && !classesOf(assertion[2]).includes('json-schema-property')) {
      const key = ASSERTION_LABELS[assertion[1].replace(/\\/g, '')]
      const value = assertion[3].trim().replace(/^`+|`+$/g, '')
      // пустые бэктики — заглушка генератора, а не «пример равен пустой строке»
      if (key && current && value !== '') current[key] = unescapeHtml(value)
      if (key) continue
    }

    const prop = line.match(PROPERTY_RE)
    if (prop) {
      const classes = classesOf(prop[3])
      const label = prop[2]

      // Ассертации и примеры имеют ТУ ЖЕ форму, что свойства.
      // Различаем только по второму классу — иначе `Example:` попадёт в спеку как поле.
      if (!classes.includes('json-schema-property') && !classes.includes('json-schema-additional-property')) {
        const key = ASSERTION_LABELS[label.replace(/\\/g, '')]
        if (key && current) {
          const value = (line.split('}')[1] || '').trim().replace(/^`+|`+$/g, '')
          // пустые бэктики — заглушка генератора, а не «пример равен пустой строке»
          if (value !== '') current[key] = unescapeHtml(value)
        }
        continue
      }

      const list = target()
      current = {
        name: label,
        required: classes.includes('json-schema-required'),
        deprecated: classes.includes('json-schema-deprecated'),
        additional: classes.includes('json-schema-additional-property'),
        type: null,
        description: null,
      }
      pendingCombinator = null
      if (list) list.push(current)
      continue
    }

    const type = line.match(TYPE_RE)
    if (type && current) {
      const parsed = parseType(type[1])
      if (pendingCombinator && current.combinator === pendingCombinator) {
        pendingCombinator.branches.push(parsed)
      } else if (!current.type) {
        current.type = parsed
      }
      continue
    }

    // Тип ветви allOf спрятан в заголовок cut-блока: `- {% cut "**Type**: object" %}`
    const cutType = line.match(/\{%\s*cut\s+"\*\*Type\*\*:\s*([^"]+)"\s*%\}/)
    if (cutType && pendingCombinator) {
      pendingCombinator.branches.push(parseType(cutType[1]))
      continue
    }

    if (current && !current.description) {
      const t = line.trim()
      // Строка без единой буквы — это разметка (открывающая скобка списка,
      // разделитель таблицы), а не описание. Раньше такие `[` становились
      // описанием 64 полей.
      const hasLetters = /[A-Za-zА-Яа-яЁё]/.test(t)
      if (hasLetters && !t.startsWith('{') && !t.startsWith('<') && !t.startsWith('```') && !t.startsWith('|') && !t.startsWith('#')) {
        current.description = unescapeHtml(t)
      }
    }
  }

  return page
}

// --- имена инструментов -------------------------------------------------------

const VERBS = [
  [/^(undelete|restore)/i, 'restore'],
  [/^(findAll|list)/i, 'list'],
  [/^(get|find|read|show)/i, 'get'],
  [/^(add|create|new|upload)/i, 'create'],
  [/^(edit|update|set|change|map)/i, 'update'],
  [/^(delete|remove|unset|clean|cancel)/i, 'delete'],
]

export const snakeCase = (s) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()

/**
 * Раскладывает слаг на действие и уточнение.
 *
 * Действие берётся из глагола в начале слага; если глагола нет — слаг целиком
 * становится уточнением (так `stat/data` даёт `metrika_stat_data`, а не
 * `metrika_stat_get_data`). Имя ресурса из уточнения вычитается: `getLabel`
 * в ресурсе `label` — это просто `get`, повторять существительное незачем.
 */
export function splitSlug({ resource, slug, http }) {
  const clean = slug.replace(/_\d+$/, '') // хвосты update_1, findAll_3, data_1 — от генератора
  let verb = null
  let rest = clean
  for (const [re, v] of VERBS) {
    const m = clean.match(re)
    if (m) {
      verb = v
      rest = clean.slice(m[0].length)
      break
    }
  }

  const resWords = snakeCase(resource).split('_').filter(Boolean)
  let qualifier = snakeCase(rest)
    .split('_')
    .filter(Boolean)
    // вычитаем слова ресурса, в том числе во множественном числе
    .filter((w) => !resWords.includes(w) && !resWords.includes(w.replace(/s$/, '')))
    .join('_')

  // Слаг без глагола, совпавший с именем ресурса: `counters` в ресурсе `counter`.
  // Множественное число — это список, единственное — чтение одного объекта.
  if (!verb && !qualifier) verb = /s$/i.test(clean) ? 'list' : 'get'

  // `getSegmentsForCounter` — глагол get, но существительное во множественном: это список.
  if (verb === 'get' && /s(_for_.*)?$/i.test(snakeCase(rest)) && !/status$/i.test(rest)) verb = 'list'

  if (!verb) verb = http === 'POST' ? 'create' : http === 'DELETE' ? 'delete' : 'get'

  return { verb, qualifier }
}

/**
 * metrika_<ресурс>_<действие>[_<уточнение>]. Ресурс берётся из URL самого API
 * без переименований, поэтому имя однозначно отображается в страницу документации.
 */
export function toolName(method, { withQualifier = false } = {}) {
  const res = snakeCase(method.resource)
  const { verb, qualifier } = splitSlug(method)
  // слаг без глагола — уточнение само по себе имя действия: metrika_stat_data
  const head = qualifier && !hasVerb(method) ? qualifier : verb
  const tail = withQualifier && qualifier && head !== qualifier ? `_${qualifier}` : ''
  return `metrika_${res}_${head}${tail}`.replace(/_+/g, '_')
}

const hasVerb = ({ slug }) => VERBS.some(([re]) => re.test(slug.replace(/_\d+$/, '')))

/** Полное имя из слага — длиннее, зато уникально в пределах ресурса по построению. */
export const fullToolName = ({ resource, slug }) =>
  `metrika_${snakeCase(resource)}_${snakeCase(slug.replace(/_\d+$/, ''))}`.replace(/_+/g, '_')

/**
 * Раздаёт имена в три прохода: короткое → с уточнением → полное из слага.
 * Короткое имя, схлопывающее два разных метода, хуже длинного: 108 инструментов
 * различаются только именем, и совпадение здесь означает потерю метода.
 */
export function assignToolNames(methods) {
  const tally = (names) => {
    const c = new Map()
    for (const n of names) c.set(n, (c.get(n) || 0) + 1)
    return c
  }
  const short = methods.map((m) => toolName(m))
  const shortCount = tally(short)

  const second = methods.map((m, i) => (shortCount.get(short[i]) === 1 ? short[i] : toolName(m, { withQualifier: true })))
  const secondCount = tally(second)

  return methods.map((m, i) => (secondCount.get(second[i]) === 1 ? second[i] : fullToolName(m)))
}

// --- сборка спеки -------------------------------------------------------------

async function walk(dir) {
  const out = []
  for (const name of await readdir(dir)) {
    const p = join(dir, name)
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

export async function buildSpec() {
  const llms = await readFile(join(CACHE_DIR, 'llms.txt'), 'utf8')
  const index = methodUrls(llms)
  const files = await walk(CACHE_DIR)

  const byKey = new Map()
  for (const { url, title } of index) byKey.set(Object.values(classify(url)).join('/'), { url, title })

  const methods = []
  const entities = {}
  const problems = []

  for (const file of files.sort()) {
    const rel = relative(CACHE_DIR, file).replace(/\.md$/, '')
    const [api, resource, slug] = rel.split('/')
    const known = byKey.get(`${api}/${resource}/${slug}`)
    if (!known) {
      problems.push(`страница вне индекса: ${rel}`)
      continue
    }
    const page = parsePage(await readFile(file, 'utf8'), { api, resource, slug, docUrl: known.url })
    if (page.generator !== EXPECTED_GENERATOR) {
      problems.push(`${rel}: генератор ${page.generator}, ожидался ${EXPECTED_GENERATOR}`)
    }
    if (!page.http || !page.url) problems.push(`${rel}: не найден HTTP-метод или URL`)

    // Сущности дедуплицируются по якорю: GoalE и GoalE1 — разные схемы.
    for (const e of page.entities) {
      if (!entities[e.anchor]) entities[e.anchor] = { name: e.name, properties: e.properties }
    }
    delete page.entities

    page.indexTitle = known.title
    methods.push(page)
  }

  const names = assignToolNames(methods)
  methods.forEach((m, i) => {
    m.tool = names[i]
  })

  // Имя инструмента обязано быть уникальным — иначе два метода схлопнутся в один.
  const seen = new Map()
  for (const m of methods) {
    if (seen.has(m.tool)) problems.push(`имя инструмента не уникально: ${m.tool} (${seen.get(m.tool)} и ${m.api}/${m.resource}/${m.slug})`)
    seen.set(m.tool, `${m.api}/${m.resource}/${m.slug}`)
  }

  return {
    source: { llms: 'https://yandex.ru/dev/metrika/ru/llms.txt', generator: EXPECTED_GENERATOR },
    counts: { indexed: index.length, parsed: methods.length, entities: Object.keys(entities).length },
    methods,
    entities,
    problems,
  }
}

async function main() {
  const spec = await buildSpec()
  await writeFile(SPEC_PATH, JSON.stringify(spec, null, 2) + '\n')
  console.log(`методов в индексе: ${spec.counts.indexed}`)
  console.log(`методов разобрано: ${spec.counts.parsed}`)
  console.log(`сущностей: ${spec.counts.entities}`)
  const params = spec.methods.reduce(
    (n, m) => n + m.params.path.length + m.params.query.length + m.params.body.length,
    0,
  )
  const untyped = spec.methods.reduce(
    (n, m) =>
      n +
      [...m.params.path, ...m.params.query, ...m.params.body].filter((p) => !p.type && !p.combinator).length,
    0,
  )
  console.log(`параметров: ${params}, из них без типа и комбинатора: ${untyped}`)
  console.log(`проблем: ${spec.problems.length}`)
  for (const p of spec.problems.slice(0, 20)) console.log('  •', p)
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) await main()
