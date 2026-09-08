# Yandex Metrika MCP Server

An MCP server for the Yandex Metrika API. All 108 methods are covered; **ten** are exposed by
default — the ones people actually count with. The rest is one variable away.

mcp-name: io.github.artgas1/yandex-metrika-mcp-server

[![npm](https://img.shields.io/npm/v/yandex-metrika-mcp-server)](https://www.npmjs.com/package/yandex-metrika-mcp-server)
[![CI](https://github.com/artgas1/yandex-metrika-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/artgas1/yandex-metrika-mcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

*[Русская версия](./README.md) — the fuller one; this page is a faithful summary.*

```bash
npx -y yandex-metrika-mcp-server
```

A fork of [atomkraft/yandex-metrika-mcp](https://github.com/atomkraft/yandex-metrika-mcp)
(upstream by Vadim Bezymianyi, MIT). Since 2.0.0 the tools are no longer hand-written: they
are generated from a specification parsed out of Yandex's own documentation.

## Coverage

| API | methods | example tools |
| --- | ---: | --- |
| Management | 95 (21 resources) | `metrika_counter_list`, `metrika_goal_create`, `metrika_segment_update` |
| Logs | 7 | `metrika_logs_create`, `metrika_logs_get`, `metrika_logs_download` |
| Stat | 6 | `metrika_stat_data`, `metrika_stat_bytime`, `metrika_stat_pivot` |

Tool names follow `metrika_<resource>_<action>`, where the resource comes from the API URL
itself without renaming. So `metrika_goal_list` maps unambiguously onto
`GET /management/v1/counter/{id}/goals` and onto its own documentation page.

## Contract

The server was rewritten because of two observed failures: it returned something other than
what was asked for, and it silently injected a filter. Hence five rules, each covered by a test.

1. **No silent substitution.** What you ask for is what goes to the API. The server invents
   no dimensions, no period, no filters.
2. **Anything the server added is visible in the response.** Responses arrive as
   `{"_meta": {...}, "data": {...}}`, where `_meta.applied_by_server` lists what was added and
   `_meta.notes` lists decisions taken on your behalf.
3. **A failure stays a failure.** API errors come back with `isError: true` and Metrika's own
   response body. Retries happen by status (429/500/502/503/504 and network faults), never by
   substring matching; `Retry-After` is honoured with a 30 s ceiling. The retry count is always
   in `_meta.retries`.
4. **Truncation is visible.** `_meta` carries `rows_returned`, `rows_total` and `truncated` —
   Metrika caps results by default. If the server itself truncated the response against a size
   ceiling, that is declared separately in `_meta.truncated_by_server` with the number of
   dropped rows or characters.
5. **Secrets do not leak into responses.** `metrika_measurement_delete` takes a parameter
   literally named `token`; its value is replaced with `REDACTED` in the `_meta.request_url`
   shown back to you. The OAuth token itself only ever travels as a header.

### Robot filter

Stat API reports apply Metrika's own robot flag by default, and nothing beyond it:

```
ym:s:isRobot=='no'
```

It is **declared**: visible in the tool schema, switched off with `human_traffic_only: false`,
and always listed in `_meta.applied_by_server`. When a request contains `ym:ad:` or `ym:ev:`
metrics the filter is skipped (Metrika answers 400 to that combination) — and that lands in
`_meta.notes` rather than staying a silent exception.

Set your own condition with `METRIKA_TRAFFIC_FILTER` — **in full**, including `isRobot` if you
want it. The server names a non-default filter on stderr at startup, because it changes the
numbers in every report.

### Period comparison: an answer that looks valid

`metrika_stat_comparison` and `metrika_stat_comparison_drilldown` treat the period dates as
**optional**, and Metrika does not complain when they are missing. It substitutes its own
window (the last week) into **both** sets and returns a comparison of a period with itself:

```
metrika_stat_comparison(ids, metrics)  →  totals a == b
                                          query  date1_a == date1_b
```

The server will not refuse — the request went out exactly as assembled. But such a response
carries a note in `_meta.notes`, both when the dates are absent and when the two periods
turn out identical.

## How the specification is built

Yandex publishes no `openapi.json` for Metrika, but every method page is generated from
OpenAPI by the Diplodoc engine and served as `text/markdown`. The semantics (type, `required`,
combinator, assertion) live in CSS classes such as `{.json-schema-property}`, so the spec is
assembled by a line scanner over those classes rather than a markdown parser.

```bash
npm run spec:fetch   # download llms.txt and 108 method pages into .cache/docs/
npm run spec:build   # parse them into spec/metrika-api.json
npm test             # 67 tests: spec, schemas, MCP protocol, tool surface and its budget
npm run protocol     # protocol tests only
npm run smoke        # live calls against the API (needs YANDEX_API_KEY)
```

`spec/metrika-api.json` is committed — it is the shape of the API at build time. A drift test
compares it against the live `llms.txt`: if Yandex adds or removes a method, the test goes red.

Parsing is pinned to a generator version (`Diplodoc Platform v5.57.3`): all the semantics hang
off its classes, so a version mismatch stops the spec build instead of quietly corrupting it.

### What the tests do NOT cover

**Tool-selection evals.** This is the one check neither a schema snapshot nor a protocol test
can stand in for: descriptions can be syntactically flawless and the model still reaches for
the wrong tool. Tests cannot see it by construction — they call a tool by name, so the choice
has already been made for the model.

The omission here is deliberate, not forgotten. The default profile is ten tools, six of which
are Stat reports that differ in response shape rather than subject, so there is little for a
model to confuse. An eval becomes necessary when the default surface widens, or when tools
with overlapping descriptions enter it — and then it must be written **before** the widening,
not after.

## Setup

```json
{
  "mcpServers": {
    "yandex-metrika-mcp": {
      "command": "npx",
      "args": ["-y", "yandex-metrika-mcp-server@3"],
      "env": { "YANDEX_API_KEY": "..." }
    }
  }
}
```

The token is a Yandex OAuth token — the same kind used for Yandex Direct and Webmaster.

### Environment variables

| Variable | Default | What it does |
| --- | --- | --- |
| `YANDEX_API_KEY` | — | OAuth token. The server refuses to start without it. |
| `METRIKA_PROFILE` | `core` | How much of the catalogue is exposed: `core` (10 tools), `read` (all 51 read-only), `all` (all 108). An unknown value aborts startup. |
| `METRIKA_ALLOW_WRITES` | unset | `1` both permits and **exposes** the 57 data-changing tools. Left unset, they are absent from `tools/list` entirely. |
| `METRIKA_TOOLS` | empty | Your own selection, comma-separated: an API section (`stat`, `logs`, `management`), a tool-name prefix (`metrika_goal`), or an exact name. Set, it overrides the profile. |
| `METRIKA_TRAFFIC_FILTER` | `ym:s:isRobot=='no'` | Segmentation expression added to Stat reports. Given in full. |
| `METRIKA_MAX_OUTPUT_CHARS` | `120000` | Per-call response size ceiling. A Logs API export usually does not fit — a day of visits runs to hundreds of thousands of characters; the truncation is declared in `_meta.truncated_by_server`. |
| `METRIKA_API_BASE` | empty | Override the API address (proxy, or a stub in tests). The override is announced on stderr. |

### Why not everything by default

The descriptions of every exposed tool sit in the model's context on **every** turn, whether
you call them or not. It is the one cost of a server that is always paid. Measured
`tools/list` size (2026-09-08, JSON bytes):

| Profile | Tools | `tools/list` | ≈ tokens |
| --- | ---: | ---: | ---: |
| `core` (default) | 10 | 31,511 B | ~7.9k |
| `read` | 51 | 67,404 B | ~16.9k |
| `all` + `METRIKA_ALLOW_WRITES=1` | 108 | 157,631 B | ~39.4k |

The `core` set was derived from measured real usage, not taste: the six Stat reports plus the
lookups a report cannot be built without (`metrika_counter_list`, `metrika_counter_get`,
`metrika_goal_list`, `metrika_segment_list`). The size ceiling is asserted by a test, so the
manifest cannot get more expensive silently.

## Security

- **Writes are off by default.** Fourteen `DELETE` methods and five deleting `POST` methods
  (`.../measurement/delete`, `.../expense/delete`, `.../logrequest/{id}/clean` and so on). The
  cost of a mistaken call is a deleted counter or goal with no way to restore the history, so
  writing is enabled by a deliberate operator decision.
- **Annotations are set on every tool** (`readOnlyHint`, `destructiveHint`, `idempotentHint`,
  `openWorldHint`). Clients use them to tell reading from deleting: deletion arriving under the
  `POST` verb is marked destructive, and so is `PUT`, because it replaces an entity wholesale.
- **Metrika responses are untrusted data.** Reports contain search phrases, page titles,
  referrers and UTM values — strings written by site visitors. Anyone can visit the site
  through a link with text inside it and see that text in a report. Every tool carries
  `openWorldHint: true`, and reports and exports carry a reminder in `_meta.notes` that this is
  data, not instructions.
- **stdio transport only.** The token is passed as an environment variable; the server opens
  no network listener.

## Verification

Protocol tests spawn the server as a subprocess and talk to it over JSON-RPC — the same way a
client does. No network is needed: `METRIKA_API_BASE` points the requests at a stub. They check
things that are invisible from the inside: that nothing but JSON-RPC reaches stdout, that an
API failure arrives as `isError` rather than as successful text, and that writes really are
blocked.

## License

MIT. See [LICENSE](./LICENSE) — the original copyright of the upstream project is preserved.
