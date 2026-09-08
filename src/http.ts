/**
 * Транспорт к API Яндекс Метрики.
 *
 * Контракт, ради которого он переписан:
 *  • отказ остаётся отказом — он не превращается в успешный ответ с текстом;
 *  • повтор делается по СТАТУСУ, а не по подстроке «500» в теле, и всегда виден
 *    вызывающему в счётчике retries;
 *  • запрос уходит ровно тот, что собрали, — транспорт ничего не дописывает;
 *  • URL, который показывается вызывающему, не содержит секретов из строки
 *    запроса: у Метрики есть ручка с параметром `token`, и без вычистки его
 *    значение уехало бы в ответ.
 */

export const API_BASE = 'https://api-metrika.yandex.net';

/**
 * Подмена адреса API. Нужна двум потребителям: тесту протокола, который поднимает
 * заглушку и проверяет весь путь вызова без сети, и оператору, у которого API
 * закрыт корпоративным прокси. Значение задаёт тот же человек, что и токен, —
 * доверие то же самое; факт подмены печатается в stderr при старте.
 */
export function apiOrigin(): string | null {
  const raw = process.env.METRIKA_API_BASE;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

/**
 * Имена параметров строки запроса, значения которых нельзя показывать.
 * Сверено с составом спеки: сегодня из этого списка в API встречается только
 * `token` (management/measurement/deleteToken), остальные — на вырост.
 */
const SECRET_QUERY_PARAMS = new Set(['token', 'oauth_token', 'access_token', 'password', 'secret']);

export const REDACTED = 'REDACTED';

/** Возвращает URL, пригодный для показа: секретные значения заменены. */
export function redactUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  let touched = false;
  for (const key of [...parsed.searchParams.keys()]) {
    if (SECRET_QUERY_PARAMS.has(key.toLowerCase())) {
      parsed.searchParams.set(key, REDACTED);
      touched = true;
    }
  }
  return touched ? parsed.toString() : url;
}

export interface ApiResponse {
  ok: boolean;
  status: number;
  data: unknown;
  retries: number;
  /** Итоговый URL с вычищенными секретами — для показа вызывающему. */
  requestUrl: string;
}

export class MetrikaHttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
    readonly requestUrl: string,
    readonly retries: number,
  ) {
    super(`Yandex Metrika API вернул ${status}`);
    this.name = 'MetrikaHttpError';
  }
}

/**
 * Повторяем только то, что осмысленно повторять: сеть, 5xx и 429.
 * Прочие 4xx — ответ по существу, повтор его не изменит.
 */
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

/** Потолок паузы, чтобы Retry-After в минутах не подвесил вызов насмерть. */
const MAX_BACKOFF_MS = 30_000;

export interface CallOptions {
  method: string;
  url: string;
  query?: Record<string, string | undefined>;
  body?: unknown;
  token: string;
  timeoutMs?: number;
  retries?: number;
}

function backoffMs(attempt: number, retryAfter: string | null): number {
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, MAX_BACKOFF_MS);
    const at = Date.parse(retryAfter);
    if (!Number.isNaN(at)) return Math.min(Math.max(at - Date.now(), 0), MAX_BACKOFF_MS);
  }
  return Math.min(1000 * attempt, MAX_BACKOFF_MS);
}

export async function callApi({
  method,
  url,
  query = {},
  body,
  token,
  timeoutMs = 30_000,
  retries = 2,
}: CallOptions): Promise<ApiResponse> {
  const target = new URL(url);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== '') target.searchParams.set(k, v);
  }
  const origin = apiOrigin();
  if (origin) {
    const replaced = new URL(target.pathname + target.search, origin);
    target.protocol = replaced.protocol;
    target.host = replaced.host;
  }
  const realUrl = target.toString();
  const shownUrl = redactUrl(realUrl);

  let attempt = 0;
  let lastError: unknown = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(realUrl, {
        method,
        headers: {
          Authorization: `OAuth ${token}`,
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });

      const text = await res.text();
      let data: unknown;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text; // не-JSON тело отдаём как есть, а не превращаем в ошибку разбора
      }

      if (!res.ok) {
        if (RETRYABLE_STATUS.has(res.status) && attempt < retries) {
          const pause = backoffMs(attempt + 1, res.headers.get('retry-after'));
          attempt++;
          await sleep(pause);
          continue;
        }
        throw new MetrikaHttpError(res.status, data, shownUrl, attempt);
      }

      return { ok: true, status: res.status, data, retries: attempt, requestUrl: shownUrl };
    } catch (e) {
      if (e instanceof MetrikaHttpError) throw e;
      lastError = e;
      if (attempt < retries) {
        attempt++;
        await sleep(backoffMs(attempt, null));
        continue;
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError ?? new Error('запрос не выполнен');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
