import { isWrite } from './annotations.js';
import type { Method } from './spec.js';

/**
 * Поверхность сервера — это то, за что клиент платит на КАЖДОМ ходу: описания
 * всех объявленных инструментов лежат в контексте модели постоянно, вызываешь ты
 * их или нет. Замер этого пакета: 108 инструментов = 161 876 байт `tools/list`,
 * это ~40 тысяч токенов. Профиль `core` — 10 инструментов и ~7,9 тысячи.
 *
 * Отсюда правило: по умолчанию объявляется не всё, что умеет API, а то, чем
 * пользуются. Остальное включается явно и осознанно.
 */
export type ProfileName = 'core' | 'read' | 'all';

export const PROFILE_NAMES: readonly ProfileName[] = ['core', 'read', 'all'];

export const DEFAULT_PROFILE: ProfileName = 'core';

/**
 * Состав `core` выведен из замера реального использования, а не из вкуса: это
 * те инструменты, которые встречались в конфигурации сессий и в правилах
 * рабочего пространства. Логика набора — «посчитать по счётчику»: шесть отчётов
 * Stat плюс ровно те справочники, без которых отчёт не собрать (какой счётчик,
 * какие цели, какие сегменты).
 *
 * Всё, что управляет сущностями Метрики, в `core` не входит: это другая задача,
 * она случается на порядок реже, и её цена — не 40 тысяч токенов в каждом ходу.
 */
export const CORE_TOOLS: readonly string[] = [
  'metrika_stat_data',
  'metrika_stat_bytime',
  'metrika_stat_drilldown',
  'metrika_stat_pivot',
  'metrika_stat_comparison',
  'metrika_stat_comparison_drilldown',
  'metrika_counter_list',
  'metrika_counter_get',
  'metrika_goal_list',
  'metrika_segment_list',
];

export function isProfileName(value: string): value is ProfileName {
  return (PROFILE_NAMES as readonly string[]).includes(value);
}

export interface SurfaceOptions {
  /** Значение METRIKA_PROFILE. Пусто — берём умолчание. */
  profile?: string;
  /** Значение METRIKA_TOOLS: явный список побеждает профиль. */
  tools?: string;
  /** Разрешена ли запись. Меняющие инструменты не объявляются, пока нет. */
  allowWrites: boolean;
}

export interface Surface {
  include: (method: Method) => boolean;
  /** Человекочитаемый источник отбора — уходит в stderr при старте. */
  label: string;
  /** Подсказка «как расширить», если сейчас видно не всё. */
  widenHint?: string;
}

/**
 * Меняющие данные инструменты не объявляются, пока запись выключена.
 *
 * Прежде они объявлялись и отказывали на вызове. Это худший из двух вариантов:
 * контекст за них платится полностью, а позвать их всё равно нельзя — 57 из 108
 * инструментов были чистой стоимостью без единого возможного применения.
 * Как включить запись, сервер пишет в stderr и в собственных `instructions`,
 * и это стоит десятки байт вместо десятков килобайт.
 */
function writable(method: Method, allowWrites: boolean): boolean {
  return allowWrites || !isWrite(method);
}

export function resolveSurface(options: SurfaceOptions): Surface {
  const explicit = (options.tools ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (explicit.length) {
    return {
      include: (m) =>
        writable(m, options.allowWrites) &&
        explicit.some((f) => f === m.api || m.tool === f || m.tool.startsWith(`${f}_`) || m.tool.startsWith(f)),
      label: `METRIKA_TOOLS=${explicit.join(',')}`,
    };
  }

  const raw = (options.profile ?? '').trim();
  if (raw && !isProfileName(raw)) {
    throw new Error(`METRIKA_PROFILE=${raw} — неизвестный профиль. Допустимы: ${PROFILE_NAMES.join(', ')}.`);
  }
  const profile: ProfileName = isProfileName(raw) ? raw : DEFAULT_PROFILE;

  if (profile === 'core') {
    return {
      include: (m) => writable(m, options.allowWrites) && CORE_TOOLS.includes(m.tool),
      label: 'METRIKA_PROFILE=core',
      widenHint: 'Управление счётчиками, целями, доступами и Logs API: METRIKA_PROFILE=all.',
    };
  }

  if (profile === 'read') {
    return {
      include: (m) => !isWrite(m),
      label: 'METRIKA_PROFILE=read',
      widenHint: 'Меняющие данные инструменты: METRIKA_PROFILE=all и METRIKA_ALLOW_WRITES=1.',
    };
  }

  return {
    include: (m) => writable(m, options.allowWrites),
    label: 'METRIKA_PROFILE=all',
    widenHint: options.allowWrites
      ? undefined
      : 'Меняющие данные инструменты скрыты, пока не задан METRIKA_ALLOW_WRITES=1.',
  };
}
