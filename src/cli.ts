import { z } from 'zod';
import { isWrite } from './annotations.js';
import { SECTION_NAMES } from './catalog.js';
import { MetrikaHttpError } from './http.js';
import { loadSpec, type Method, type Spec } from './spec.js';
import {
  buildInputSchema,
  DEFAULT_MAX_OUTPUT_CHARS,
  executeMethod,
  inputSlots,
  serializeCapped,
} from './tools.js';

/**
 * Тот же сервер, вызываемый из терминала.
 *
 * Зачем он есть. У сервера два класса потребителей. Первый ставит MCP и получает
 * инструменты в клиенте. Второй MCP не ставит — ему нужен скилл, то есть текстовая
 * инструкция агенту «набери такую-то команду». Второму классу нужен ровно тот же
 * набор гарантий: фильтр роботов в отчётах, потолок ответа с распиской об урезании,
 * вычистка секретов из показываемого URL, повтор по статусу.
 *
 * Отсюда конструкция: CLI не делает НИ ОДНОГО собственного запроса. Он разбирает
 * аргументы и зовёт `executeMethod` — ту же функцию, что и MCP-инструменты. Разойтись
 * им негде, потому что расходиться нечему: код один.
 *
 * Чем CLI сознательно отличается от MCP:
 *  • профиль не действует. Профиль существует, чтобы не платить контекстом за
 *    описания невызванных инструментов; у команды в терминале такой цены нет,
 *    поэтому доступны все методы спеки.
 *  • запись гейтится ТАК ЖЕ. Это не про контекст, а про то, что удалённую цель
 *    нечем восстановить, — послабление здесь было бы дырой в обход сервера.
 */

const USAGE = `yandex-metrika-mcp — сервер Яндекс Метрики. Без аргументов запускается как MCP-сервер по stdio.

Команды:
  call <метод> [--параметр значение ...]   вызвать метод API
  describe <метод>                          параметры метода
  catalog [--search <подстрока>]            какие методы есть
  help                                      эта справка

Примеры:
  yandex-metrika-mcp catalog --search goal
  yandex-metrika-mcp describe metrika_stat_data
  yandex-metrika-mcp call metrika_counter_list
  yandex-metrika-mcp call metrika_stat_data \\
    --ids <ID счётчика> --dimensions ym:s:trafficSource \\
    --metrics ym:s:visits,ym:s:users --date1 7daysAgo --date2 today

Окружение:
  YANDEX_API_KEY          OAuth-токен. Нужен для call, не нужен для catalog/describe.
  METRIKA_ALLOW_WRITES=1  разрешить методы, меняющие данные. Без него они отказывают.
  METRIKA_TRAFFIC_FILTER  своё условие отсева роботов вместо умолчания.
  METRIKA_MAX_OUTPUT_CHARS потолок длины ответа (по умолчанию ${DEFAULT_MAX_OUTPUT_CHARS}).

Ответ — JSON. Поле _meta говорит, что сервер добавил от себя и что урезал:
без него урезанная выдача читается как полная.`;

export const CLI_COMMANDS: ReadonlySet<string> = new Set([
  'call',
  'describe',
  'catalog',
  'help',
  '--help',
  '-h',
]);

/** Пишущая часть вынесена, чтобы тест мог перехватить вывод, а не разбирать stdout процесса. */
export interface CliIo {
  out: (text: string) => void;
  err: (text: string) => void;
}

const defaultIo: CliIo = {
  out: (t) => process.stdout.write(`${t}\n`),
  err: (t) => process.stderr.write(`${t}\n`),
};

/**
 * Имя метода приводим к каноническому виду: агент нередко пишет `stat.data` или
 * `stat_data` вместо `metrika_stat_data`. Это не догадка о намерении — это одно
 * и то же имя в другой записи, и отказывать по такому поводу значит тратить круг
 * диалога впустую.
 */
function normalizeToolName(raw: string): string {
  const s = raw.trim().toLowerCase().replace(/[.\-\s]+/g, '_');
  return s.startsWith('metrika_') ? s : `metrika_${s}`;
}

/** Похожие имена для сообщения об ошибке: неизвестный метод — самый частый промах. */
function suggest(spec: Spec, wanted: string): string[] {
  const needle = wanted.replace(/^metrika_/, '');
  const parts = needle.split('_').filter(Boolean);
  return spec.methods
    .map((m) => m.tool)
    .filter((tool) => parts.some((p) => p.length > 2 && tool.includes(p)))
    .slice(0, 8);
}

export interface ParsedArgs {
  values: Record<string, string[]>;
  positional: string[];
}

/**
 * Разбор аргументов. Поддержаны `--имя значение`, `--имя=значение` и `--no-имя`.
 * Повтор флага копит массив: у Метрики есть параметры, принимающие несколько
 * значений, и тихо оставлять последнее — значит терять переданное.
 */
export function parseArgv(argv: readonly string[]): ParsedArgs {
  const values: Record<string, string[]> = {};
  const positional: string[] = [];
  const push = (name: string, value: string) => {
    const key = name.replace(/-/g, '_');
    (values[key] ??= []).push(value);
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      positional.push(token);
      continue;
    }
    const body = token.slice(2);
    const eq = body.indexOf('=');
    if (eq !== -1) {
      push(body.slice(0, eq), body.slice(eq + 1));
      continue;
    }
    if (body.startsWith('no-') || body.startsWith('no_')) {
      push(body.slice(3), 'false');
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      push(body, 'true'); // флаг без значения — булев признак
      continue;
    }
    push(body, next);
    i++;
  }
  return { values, positional };
}

/**
 * Значение из командной строки всегда строка. В строку запроса так и уедет, а вот
 * в теле запроса строка вместо объекта или числа — это уже другой тип, и Метрика
 * ответит 400. Поэтому телу значение разбираем как JSON, а пути и строке запроса
 * оставляем как есть: там схема сама делает послабление.
 */
function coerce(raw: string[], where: 'path' | 'query' | 'body'): unknown {
  const one = (v: string): unknown => {
    if (where !== 'body') return v;
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  };
  return raw.length === 1 ? one(raw[0]) : raw.map(one);
}

function findMethod(spec: Spec, raw: string): Method | null {
  const wanted = normalizeToolName(raw);
  return spec.methods.find((m) => m.tool === wanted) ?? null;
}

function describeMethod(method: Method): Record<string, unknown> {
  const params: Array<Record<string, unknown>> = [];
  for (const [key, slot] of inputSlots(method)) {
    params.push({
      name: key,
      where: slot.where,
      required: slot.param.required,
      description: slot.param.description ?? undefined,
      example: slot.param.example ?? undefined,
    });
  }
  return {
    tool: method.tool,
    http: method.http,
    url: method.url,
    title: method.title,
    description: method.description,
    doc: method.docUrl,
    writes: isWrite(method),
    params,
  };
}

/**
 * Окружение читается из `process.env` — и параметром оно намеренно НЕ передаётся.
 *
 * Слои ниже (`apiOrigin`, `trafficFilter`) читают `process.env` сами, поэтому
 * аргумент `env` покрывал бы только часть переменных. Такой аргумент хуже, чем
 * его отсутствие: он выглядит как полная подмена окружения, а на деле часть
 * значений всё равно приходит из процесса. Первая редакция тестов на этом и
 * попалась — подменённый METRIKA_API_BASE транспорт не увидел, и запрос ушёл
 * в живой API Яндекса вместо заглушки.
 */
function allowWrites(): boolean {
  return /^(1|true|yes)$/i.test(process.env.METRIKA_ALLOW_WRITES ?? '');
}

function maxOutputChars(): number {
  const raw = Number(process.env.METRIKA_MAX_OUTPUT_CHARS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MAX_OUTPUT_CHARS;
}

/**
 * Отказ печатается в stdout тем же JSON, что и успех: читатель у CLI — агент,
 * и разбирать ему приходится один поток, а не два. Код возврата при этом
 * ненулевой, чтобы отказ оставался отказом для оболочки.
 */
function fail(io: CliIo, code: number, payload: Record<string, unknown>): number {
  io.out(JSON.stringify({ error: true, ...payload }));
  return code;
}

export async function runCli(argv: readonly string[], io: CliIo = defaultIo): Promise<number> {
  const [command, ...rest] = argv;

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    io.out(USAGE);
    return 0;
  }

  const spec = loadSpec();
  const { values, positional } = parseArgv(rest);

  if (command === 'catalog') {
    /**
     * Своя выдача, а не `buildCatalog`. Тот отвечает на вопрос MCP-сервера
     * «что я объявил, а что спрятал профилем», и в терминале его слова становятся
     * ложью: несовпавшие с поиском методы он назвал бы скрытыми и посоветовал бы
     * включить их профилем, которого здесь нет. Профиля в CLI нет — доступна вся
     * спека, и единственное ограничение здесь одно: запись.
     */
    const search = values.search?.[0]?.toLowerCase();
    const matched = search
      ? spec.methods.filter(
          (m) =>
            m.tool.toLowerCase().includes(search) ||
            (m.title ?? '').toLowerCase().includes(search) ||
            (m.description ?? '').toLowerCase().includes(search),
        )
      : spec.methods;

    const grouped: Record<string, string[]> = {};
    for (const m of matched) (grouped[SECTION_NAMES[m.api]] ??= []).push(m.tool);
    for (const k of Object.keys(grouped)) grouped[k].sort();

    io.out(
      JSON.stringify({
        api_methods_total: spec.methods.length,
        matched: matched.length,
        search: search ?? null,
        writes_enabled: allowWrites(),
        writes_note: allowWrites()
          ? 'Запись разрешена: методы, меняющие данные, вызовутся.'
          : 'Методы, меняющие данные, откажут: включаются METRIKA_ALLOW_WRITES=1.',
        methods: grouped,
        hint: 'параметры метода: describe <имя>',
        docs: 'https://github.com/artgas1/yandex-metrika-mcp#readme',
      }),
    );
    return 0;
  }

  const rawName = positional[0];
  if (!rawName) return fail(io, 2, { message: `команде ${command} нужно имя метода. Список: catalog` });

  const method = findMethod(spec, rawName);
  if (!method) {
    return fail(io, 2, {
      message: `метод ${normalizeToolName(rawName)} не найден среди ${spec.methods.length} методов спеки`,
      did_you_mean: suggest(spec, normalizeToolName(rawName)),
      hint: 'полный список: catalog, поиск по подстроке: catalog --search <часть имени>',
    });
  }

  if (command === 'describe') {
    io.out(JSON.stringify(describeMethod(method)));
    return 0;
  }

  if (command !== 'call') {
    io.out(USAGE);
    return fail(io, 2, { message: `неизвестная команда: ${command}` });
  }

  if (isWrite(method) && !allowWrites()) {
    return fail(io, 3, {
      message: `${method.tool} меняет данные, а запись выключена`,
      hint: 'METRIKA_ALLOW_WRITES=1 включает её. Цена ошибки здесь — удалённый счётчик или цель без возможности восстановить историю.',
    });
  }

  const token = process.env.YANDEX_API_KEY;
  if (!token) {
    return fail(io, 4, {
      message: 'не задан YANDEX_API_KEY — OAuth-токен Яндекс Метрики',
      hint: 'токен выпускается на oauth.yandex.ru, нужен доступ metrika:read (для записи — metrika:write)',
    });
  }

  const slots = inputSlots(method);
  const args: Record<string, unknown> = {};
  const unknown: string[] = [];
  for (const [key, raw] of Object.entries(values)) {
    const slot = slots.get(key);
    if (slot) {
      args[key] = coerce(raw, slot.where);
      continue;
    }
    if (key === 'human_traffic_only') {
      args[key] = raw[raw.length - 1] !== 'false';
      continue;
    }
    unknown.push(key);
  }

  if (unknown.length) {
    return fail(io, 2, {
      message: `метод ${method.tool} не принимает: ${unknown.join(', ')}`,
      hint: `параметры метода: describe ${method.tool}`,
    });
  }

  const parsed = z.object(buildInputSchema(method, spec.entities)).safeParse(args);
  if (!parsed.success) {
    return fail(io, 2, {
      message: `аргументы не прошли проверку метода ${method.tool}`,
      issues: parsed.error.issues.map((i) => `${i.path.join('.') || '(корень)'}: ${i.message}`),
      hint: `параметры метода: describe ${method.tool}`,
    });
  }

  try {
    const { meta, data } = await executeMethod(method, parsed.data as Record<string, unknown>, token);
    io.out(serializeCapped(meta, data, maxOutputChars()));
    return 0;
  } catch (e) {
    if (e instanceof MetrikaHttpError) {
      return fail(io, 1, {
        message: `Яндекс Метрика ответила ${e.status}`,
        status: e.status,
        request_url: e.requestUrl,
        retries: e.retries,
        body: e.body,
      });
    }
    return fail(io, 1, { message: e instanceof Error ? e.message : String(e) });
  }
}
