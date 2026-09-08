import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Тип параметра в том виде, в каком его отдаёт разбор документации. */
export type ParamType =
  | { kind: 'primitive'; type: string; format?: string }
  | { kind: 'array'; items: ParamType }
  | { kind: 'ref'; ref: string; name: string }
  | { kind: 'unknown'; raw: string };

export interface Combinator {
  marker: string;
  quantity: number;
  branches: ParamType[];
}

export interface Param {
  name: string;
  required: boolean;
  deprecated: boolean;
  additional: boolean;
  type: ParamType | null;
  description: string | null;
  combinator?: Combinator;
  default?: string;
  example?: string;
  [assertion: string]: unknown;
}

export interface Method {
  api: 'management' | 'stat' | 'logs';
  resource: string;
  slug: string;
  docUrl: string;
  tool: string;
  title: string | null;
  indexTitle: string;
  description: string | null;
  generator: string | null;
  http: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  params: { path: Param[]; query: Param[]; header: Param[]; body: Param[] };
  responses: string[];
}

export interface Spec {
  source: { llms: string; generator: string };
  counts: { indexed: number; parsed: number; entities: number };
  methods: Method[];
  entities: Record<string, { name: string; properties: Param[] }>;
  problems: string[];
}

/**
 * Спека лежит рядом со сборкой и является единственным источником состава API.
 * Ни один метод в коде не описан руками — если Яндекс добавит метод, он приедет
 * сюда прогоном tools/parse-spec.mjs, а тест на дрейф покраснеет до того.
 */
export function loadSpec(): Spec {
  const path = fileURLToPath(new URL('../spec/metrika-api.json', import.meta.url));
  return JSON.parse(readFileSync(path, 'utf8')) as Spec;
}

/** Плейсхолдеры пути: https://…/counter/{counterId}/goals → ['counterId'] */
export function pathPlaceholders(url: string): string[] {
  return [...url.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}
