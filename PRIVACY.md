# Политика приватности

*[English below](#privacy-policy)*

Действует с 08.09.2026. Относится к пакету `yandex-metrika-mcp-server` и к бандлу
MCPB, собранному из него.

## Коротко

Сервер не собирает, не хранит и никуда не передаёт данные о вас. Он выполняет
запросы к API Яндекс Метрики от вашего имени и возвращает ответ вызывающему
клиенту. Ни телеметрии, ни аналитики, ни обращений к серверам автора нет —
их не существует в природе, автор не держит никакой инфраструктуры для этого
пакета.

## Что сервер получает

- **OAuth-токен Яндекса** — из переменной окружения `YANDEX_API_KEY`, которую
  задаёте вы. Читается в память процесса при старте.
- **Аргументы вызовов инструментов** — от вашего MCP-клиента.
- **Ответы API Яндекс Метрики** — статистика по счётчикам, к которым даёт доступ
  ваш токен.

## Что сервер делает с этим

Подставляет токен в заголовок `Authorization` запроса к
`https://api-metrika.yandex.net` и отдаёт ответ клиенту, который вызвал
инструмент. Всё.

- Токен **никуда не пишется**: ни в файл, ни в stdout, ни в тело ответа.
  Значения параметров с именами `token`, `oauth_token`, `access_token`,
  `password`, `secret` вырезаются из адреса запроса в любом ответе и в тексте
  ошибки.
- Данные отчётов **не кэшируются на диск** и не переживают процесс.
- Логи идут только в stderr вашего же процесса и содержат стартовую сводку и
  предупреждения — не содержимое отчётов.

## Куда уходит трафик

Единственный адресат — `https://api-metrika.yandex.net`. Он может быть заменён
переменной `METRIKA_API_BASE` (для прокси или тестовой заглушки); факт замены
сервер печатает в stderr, потому что вместе с запросом туда уедет и токен.

Других сетевых адресатов нет: ни телеметрии, ни проверки обновлений, ни
обращений к сторонним сервисам.

## Третья сторона

Данные, которые вы запрашиваете, обрабатывает **Яндекс** — как оператор Метрики.
На эту обработку распространяется его политика:
<https://yandex.ru/legal/confidential/>. Автор пакета к ней отношения не имеет и
на неё не влияет.

## Ваш MCP-клиент

Ответы инструментов уходят в клиент, который их вызвал (Claude Desktop, Claude
Code и т. п.), и дальше на них распространяется политика этого клиента, а не
эта. Сервер не контролирует, что клиент делает с полученными данными.

## Хранение и удаление

Сервер ничего не хранит, поэтому удалять нечего. Чтобы прекратить любой доступ,
отзовите OAuth-токен в настройках Яндекса и удалите пакет.

## Изменения

Существенные изменения этого документа отмечаются в
[`CHANGELOG.md`](./CHANGELOG.md) вместе с версией, в которой они появились.

## Контакт

Вопросы и сообщения об уязвимостях —
[GitHub Issues](https://github.com/artgas1/yandex-metrika-mcp/issues) и
[Security Advisories](https://github.com/artgas1/yandex-metrika-mcp/security/advisories/new),
см. [`SECURITY.md`](./SECURITY.md).

---

# Privacy Policy

Effective 2026-09-08. Applies to the `yandex-metrika-mcp-server` package and to
the MCPB bundle built from it.

## In short

The server collects nothing about you, stores nothing, and transmits nothing
anywhere. It performs requests against the Yandex Metrika API on your behalf and
returns the response to the calling client. There is no telemetry, no analytics
and no call-home: the author operates no infrastructure for this package at all.

## What the server receives

- **A Yandex OAuth token** from the `YANDEX_API_KEY` environment variable that
  you set. It is read into process memory at startup.
- **Tool-call arguments** from your MCP client.
- **Yandex Metrika API responses** — statistics for the counters your token
  grants access to.

## What it does with them

Puts the token in the `Authorization` header of a request to
`https://api-metrika.yandex.net` and hands the response back to the client that
called the tool. That is all.

- The token is **never written anywhere**: not to a file, not to stdout, not
  into a response body. Query-parameter values named `token`, `oauth_token`,
  `access_token`, `password` or `secret` are redacted from the request URL in
  every response and error message.
- Report data is **never cached to disk** and does not outlive the process.
- Logs go to your own process's stderr and carry the startup summary and
  warnings — not report contents.

## Where traffic goes

The only destination is `https://api-metrika.yandex.net`. It can be overridden
with `METRIKA_API_BASE` (for a proxy or a test stub); the server announces the
override on stderr, because the token travels with the request.

There are no other network destinations: no telemetry, no update checks, no
third-party services.

## Third party

The data you request is processed by **Yandex** as the operator of Metrika, and
that processing is governed by their policy:
<https://yandex.com/legal/confidential/>. The package author is not a party to
it and has no influence over it.

## Your MCP client

Tool responses go to the client that called them (Claude Desktop, Claude Code
and so on), and from that point their policy applies rather than this one. The
server does not control what a client does with the data it receives.

## Retention and deletion

The server stores nothing, so there is nothing to delete. To end all access,
revoke the OAuth token in your Yandex settings and uninstall the package.

## Changes

Material changes to this document are noted in
[`CHANGELOG.md`](./CHANGELOG.md) alongside the version that introduced them.

## Contact

Questions and vulnerability reports —
[GitHub Issues](https://github.com/artgas1/yandex-metrika-mcp/issues) and
[Security Advisories](https://github.com/artgas1/yandex-metrika-mcp/security/advisories/new),
see [`SECURITY.md`](./SECURITY.md).
