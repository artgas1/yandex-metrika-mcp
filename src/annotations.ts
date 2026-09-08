import type { Method } from './spec.js';

/**
 * Подсказки клиенту о характере инструмента (спека MCP 2025-11-25, ToolAnnotations).
 * Claude Desktop / Cursor / Claude Code читают их, чтобы решить, что можно
 * подтверждать автоматически, а что показывать человеку. Без них все 108
 * инструментов выглядят для клиента одинаково — включая четырнадцать DELETE.
 */
export interface Annotations {
  readOnlyHint: boolean;
  destructiveHint: boolean;
  idempotentHint: boolean;
  openWorldHint: boolean;
}

/**
 * Удаление, приезжающее под глаголом POST. У Метрики так оформлены пять ручек,
 * и по глаголу их не отличить от создания.
 */
const DESTRUCTIVE_POST_PATH = /\/(delete|delete_single|clean|cancel)(\?|$)/;

export const isWrite = (method: Method): boolean => method.http !== 'GET';

export function annotationsFor(method: Method): Annotations {
  const readOnly = method.http === 'GET';
  const destructivePost = DESTRUCTIVE_POST_PATH.test(method.url);
  return {
    readOnlyHint: readOnly,
    // PUT заменяет существующую сущность целиком — это тоже разрушающее действие.
    destructiveHint: !readOnly && (method.http === 'DELETE' || method.http === 'PUT' || destructivePost),
    // Повторный POST создаёт вторую сущность; повторный GET/PUT/DELETE — нет.
    idempotentHint: method.http !== 'POST' || destructivePost,
    // Ответы Метрики содержат строки, которые пишут посетители сайта: поисковые
    // фразы, заголовки страниц, реферера, значения UTM. Их содержимое нам
    // неподконтрольно, поэтому мир открытый.
    openWorldHint: true,
  };
}
