import { z } from 'zod';
import { isWrite } from './annotations.js';
import type { Method, Spec } from './spec.js';

/**
 * Инструмент, который рассказывает про самого себя.
 *
 * Зачем он нужен. Сервер объявляет по умолчанию десять инструментов из ста
 * восьми — и это невидимо для человека. Модель узнаёт из `instructions`, а
 * человек, поставивший пакет одной строкой, не узнаёт ниоткуда, кроме README:
 * в интерфейс клиента `instructions` не показываются, а стартовую строку в
 * stderr в обычной работе никто не открывает.
 *
 * Отсюда правило: если сервер что-то СКРЫЛ, он обязан уметь сказать, что
 * именно и как это включить. Спросить словами — «а что ещё умеешь?» — дешевле,
 * чем идти читать документацию, и происходит ровно в тот момент, когда нужно.
 *
 * Почему инструмент, а не строка в `instructions`: те резидентны на каждом
 * ходу, и список из ста восьми имён стоил бы там сотни токенов постоянно.
 * Схема этого инструмента пустая, а вес ответа платится только при вызове.
 */

/** Пустая схема, объявленная явно: пустая форма даёт схему без запрета лишних ключей. */
const NO_PARAMS = z.object({}).strict();

const SECTION_NAMES: Record<Method['api'], string> = {
  stat: 'Stat API — отчёты',
  management: 'Management API — счётчики, цели, сегменты, доступы',
  logs: 'Logs API — выгрузка сырых визитов и хитов',
};

interface CatalogRegistrar {
  registerTool(
    name: string,
    config: Record<string, unknown>,
    handler: () => Promise<{ content: Array<{ type: 'text'; text: string }> }>,
  ): unknown;
}

export interface CatalogOptions {
  /** Человекочитаемый источник отбора: METRIKA_PROFILE=core и т. п. */
  label: string;
  /** Тот же предикат, по которому регистрировались инструменты. */
  include: (method: Method) => boolean;
  allowWrites: boolean;
}

export const CATALOG_TOOL = 'metrika_catalog_list';

function group(methods: Method[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const m of methods) (out[SECTION_NAMES[m.api]] ??= []).push(m.tool);
  for (const k of Object.keys(out)) out[k].sort();
  return out;
}

export function buildCatalog(spec: Spec, options: CatalogOptions): Record<string, unknown> {
  const shown = spec.methods.filter((m) => options.include(m));
  const hidden = spec.methods.filter((m) => !options.include(m));
  const hiddenWrites = hidden.filter(isWrite);

  const widen: string[] = [];
  if (hidden.length > hiddenWrites.length) {
    widen.push('METRIKA_PROFILE=read — все читающие методы, включая Management и Logs API.');
  }
  if (hiddenWrites.length) {
    widen.push(
      'METRIKA_PROFILE=all вместе с METRIKA_ALLOW_WRITES=1 — включая инструменты, меняющие данные. ' +
        'Цена ошибочного вызова здесь — удалённый счётчик или цель без возможности восстановить историю.',
    );
  }
  widen.push('Переменные задаются в env-секции записи сервера в конфигурации клиента; после правки клиента нужно переподключить.');

  // Имена полей говорят про методы API, а не про длину tools/list: сам этот
  // инструмент — не метод Метрики, и путать его со счётом покрытия не нужно.
  return {
    profile: options.label,
    api_methods_total: spec.methods.length,
    api_methods_declared: shown.length,
    api_methods_hidden: hidden.length,
    writes_enabled: options.allowWrites,
    declared_tools: group(shown),
    hidden_tools: hidden.length ? group(hidden) : undefined,
    how_to_widen: hidden.length ? widen : ['Объявлено всё, что умеет сервер.'],
    docs: 'https://github.com/artgas1/yandex-metrika-mcp#readme',
  };
}

export function registerCatalog(server: CatalogRegistrar, spec: Spec, options: CatalogOptions): void {
  server.registerTool(
    CATALOG_TOOL,
    {
      title: 'Что этот сервер умеет и что скрыто',
      description:
        'Список инструментов Яндекс Метрики: какие объявлены сейчас, какие скрыты профилем и как их включить. ' +
        'Зови, когда нужного инструмента Метрики не видно в списке или пользователь спрашивает, что ещё умеет сервер. ' +
        'Не обращается к API Метрики и не требует токена.',
      inputSchema: NO_PARAMS,
      annotations: {
        title: 'Что этот сервер умеет и что скрыто',
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        // Наружу не ходит вовсе: отвечает из спеки, лежащей в пакете.
        openWorldHint: false,
      },
    },
    async () => ({
      content: [{ type: 'text' as const, text: JSON.stringify(buildCatalog(spec, options)) }],
    }),
  );
}
