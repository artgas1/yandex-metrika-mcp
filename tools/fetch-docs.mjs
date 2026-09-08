#!/usr/bin/env node
/**
 * Скачивает индекс llms.txt и все страницы методов API Яндекс Метрики в .cache/docs/.
 *
 * Страницы отдаются как text/markdown напрямую — HTML рендерить не нужно.
 * Кеш не коммитится: источник истины — сам Яндекс, в репозитории живёт разобранная спека.
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const LLMS_URL = 'https://yandex.ru/dev/metrika/ru/llms.txt'
export const CACHE_DIR = fileURLToPath(new URL('../.cache/docs/', import.meta.url))

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36'

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

/** Ссылки на страницы методов из llms.txt — те, где в пути есть /openapi/. */
export function methodUrls(llms) {
  const links = [...llms.matchAll(/\[([^\]]+)\]\((https:\/\/yandex\.ru\/dev\/metrika\/ru\/[^)]+)\)/g)]
  return links.map(([, title, url]) => ({ title, url })).filter(({ url }) => url.includes('/openapi/'))
}

/**
 * api / resource / slug из URL страницы метода.
 * У stat и logs собственного ресурса нет — страницы лежат прямо в openapi/,
 * поэтому ресурсом становится имя api. Так имя инструмента остаётся выводимым из URL.
 */
export function classify(url) {
  const path = url.split('/dev/metrika/ru/')[1].replace(/\.md$/, '')
  const parts = path.split('/')
  const api = parts[0]
  const rest = parts.slice(parts.indexOf('openapi') + 1)
  return { api, resource: rest.length > 1 ? rest[0] : api, slug: rest[rest.length - 1] }
}

export const cachePath = (api, resource, slug) => join(CACHE_DIR, api, resource, `${slug}.md`)

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true })
  const llms = await get(LLMS_URL)
  await writeFile(join(CACHE_DIR, 'llms.txt'), llms)

  const urls = methodUrls(llms)
  console.log(`методов в индексе: ${urls.length}`)

  let fetched = 0
  let cached = 0
  const failed = []
  const queue = [...urls]

  const worker = async () => {
    while (queue.length) {
      const { url } = queue.shift()
      const { api, resource, slug } = classify(url)
      const out = cachePath(api, resource, slug)
      if (await exists(out)) {
        cached++
        continue
      }
      try {
        const body = await get(url)
        await mkdir(dirname(out), { recursive: true })
        await writeFile(out, body)
        fetched++
      } catch (e) {
        failed.push(`${url}: ${e.message}`)
      }
    }
  }

  await Promise.all(Array.from({ length: 6 }, worker))
  console.log(`скачано ${fetched}, из кеша ${cached}, ошибок ${failed.length}`)
  for (const f of failed) console.log('  ОШИБКА', f)
  if (failed.length) process.exitCode = 1
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) await main()
