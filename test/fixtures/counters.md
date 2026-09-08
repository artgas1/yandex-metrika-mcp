---
metadata:
  - name: generator
    content: Diplodoc Platform v5.57.3
alternate:
  - https://yandex.ru/dev/metrika/en/management/openapi/counter/counters.md
  - https://yandex.ru/dev/metrika/ru/management/openapi/counter/counters.md
  - href: ru/management/openapi/counter/counters.md
    type: text/markdown
    title: Markdown version
  - href: ../../../llms.txt
    type: text/markdown
    title: llms.txt
---
> **Documentation Index:** Fetch the complete configuration index at https://yandex.ru/dev/metrika/ru/llms.txt

<!-- source: ru/management-src/Upravlenie-schetchikami/counters.md -->
<div class="openapi">

# Список доступных счетчиков

<!-- markdownlint-disable-file -->

Возвращает список существующих счетчиков, доступных пользователю.

## Request

<div class="openapi__requests">

<div class="openapi__request__wrapper" style="--method: var(--dc-openapi-methods-get);margin-bottom: 12px">

<div class="openapi__request">

GET {.openapi__method}
```text translate=no
https://api-metrika.yandex.net/management/v1/counters
```

</div>

</div>

</div>

### Query parameters

#|
|| **Name** | **Description** ||
||

_callback_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Функция обратного вызова, которая обрабатывает ответ API.

_Example:_{.json-schema-reset .json-schema-example} ``
{.table-cell}
||
||

_counter_ids_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer[]

Список идентификаторов счетчиков, которые вы хотите получить.

_Example:_{.json-schema-reset .json-schema-example} ``
{.table-cell}
||
||

_favorite_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Фильтр по счетчикам, которые были добавлены в **Избранные**.

_Default:_{.json-schema-reset .json-schema-value} `false`
{.table-cell}
||
||

_field_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Один или несколько дополнительных параметров возвращаемого объекта. Названия дополнительных параметров указываются в любом порядке через запятую, без пробелов. Например: `field=goals,mirrors,grants,filters,operations,counter_flags,measurement_tokens`.

_Example:_{.json-schema-reset .json-schema-example} ``
{.table-cell}
||
||

_label_id_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Фильтр по метке.
{.table-cell}
||
||

_offset_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Порядковый номер счетчика, с которого начнется выдача списка счетчиков. Первый счетчик имеет номер 1. Максимальный номер — 100 000, поскольку пользователь не может иметь более 100 000 счётчиков.

_Default:_{.json-schema-reset .json-schema-value} `1`
{.table-cell}
||
||

_per_page_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Количество счетчиков, которые вы хотите получить. Максимум за один запрос — 10 000 счётчиков.

_Default:_{.json-schema-reset .json-schema-value} `1000`
{.table-cell}
||
||

_permission_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Фильтр по уровню доступа к счетчику. Параметр может содержать несколько значений, разделенных запятой:
- `own` ― счетчик, принадлежащий пользователю.
- `view` ― гостевой счетчик с уровнем доступа **только просмотр**.
- `edit` ― гостевой счетчик с уровнем доступа **полный доступ**.

_Example:_{.json-schema-reset .json-schema-example} ``
{.table-cell}
||
||

_reverse_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Выдать счетчики в обратном или прямом порядке сортировки.

_Default:_{.json-schema-reset .json-schema-value} `true`
{.table-cell}
||
||

_robots_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Учитывать ли роботов.

_Default:_{.json-schema-reset .json-schema-value} `true`
{.table-cell}
||
||

_search_string_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Фильтр по строке. Можно указать:
- идентификатор счетчика;
- название счетчика;
- адрес сайта, на котором установлен счетчик;
- дополнительный адрес.

Будут показаны счетчики, имя, сайт или зеркала которых содержат заданную подстроку.
При фильтрации по идентификатору укажите его полностью.

_Example:_{.json-schema-reset .json-schema-example} ``
{.table-cell}
||
||

_sort_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Сортировка:
- None — без сортировки;
- Default – по умолчанию;
- Visits – количество визитов;
- Hits – количество хитов;
- Uniques – количество посетителей;
- Name – название счетчика.


_Default:_{.json-schema-reset .json-schema-value} `Default`

_Example:_{.json-schema-reset .json-schema-example} ``
{.table-cell}
||
||

_status_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Фильтр по статусу счетчика. По умолчанию включен.
Статус счетчика. возможные значения:
- `Active` — счетчик активен.
- `Deleted` — счетчик удален.


_Default:_{.json-schema-reset .json-schema-value} `Active`

_Example:_{.json-schema-reset .json-schema-example} ``
{.table-cell}
||
||

_type_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Фильтр по типу счетчика.
Тип счетчика. Возможные значения:
  - `simple` — счетчик создан пользователем в Яндекс Метрике.
  - `partner` — счетчик импортирован из РСЯ.


_Example:_{.json-schema-reset .json-schema-example} ``
{.table-cell}
||
|#{.json-schema-properties}

## Responses

<div class="openapi__response__code__200">

## 200 OK

OK

<div class="openapi-entity">

### Body

{% cut "application/json" %}

```json translate=no
{
  "rows": 0,
  "counters": [
    {
      "id": 0,
      "status": "example",
      "owner_login": "example",
      "activity_status": "example",
      "name": "example",
      "type": "example",
      "favorite": true,
      "permission": "example",
      "goals": [
        null
      ],
      "filters": [
        {
          "id": 0,
          "attr": "example",
          "type": "example",
          "value": "example",
          "action": "example",
          "status": "example",
          "start_ip": "example",
          "end_ip": "example",
          "with_subdomains": true
        }
      ],
      "operations": [
        {
          "id": 0,
          "action": "example",
          "attr": "example",
          "value": "example",
          "status": "example"
        }
      ],
      "grants": [
        {}
      ],
      "labels": [
        {
          "id": 0,
          "name": "example"
        }
      ],
      "webvisor": {
        "urls": "example",
        "arch_enabled": true,
        "arch_type": "example",
        "load_player_type": "example",
        "wv_version": 0,
        "wv_forms": true
      },
      "code_options": {
        "async": true,
        "informer": {
          "enabled": true,
          "type": "example",
          "size": 1,
          "indicator": "example",
          "color_start": "FFFFFFFF.",
          "color_end": "EFEFEFFF",
          "color_text": 0,
          "color_arrow": 0
        },
        "visor": true,
        "track_hash": true,
        "xml_site": true,
        "clickmap": true,
        "in_one_line": true,
        "ecommerce": true,
        "alternative_cdn": true,
        "ytm": true
      },
      "create_time": "2025-01-01T00:00:00Z",
      "time_zone_name": "example",
      "time_zone_offset": 0,
      "partner_id": 0,
      "source": "example",
      "site2": {
        "site": "example"
      },
      "gdpr_agreement_accepted": true,
      "mirrors2": [
        null
      ]
    }
  ]
}
```

{% endcut %}

#|
|| **Name** | **Description** ||
||

_counters_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: [CounterBrief](#entity-CounterBrief)[]

Список счетчиков.

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
[
  {
    "id": 0,
    "status": "example",
    "owner_login": "example",
    "activity_status": "example",
    "name": "example",
    "type": "example",
    "favorite": true,
    "permission": "example",
    "goals": [
      null
    ],
    "filters": [
      {
        "id": 0,
        "attr": "example",
        "type": "example",
        "value": "example",
        "action": "example",
        "status": "example",
        "start_ip": "example",
        "end_ip": "example",
        "with_subdomains": true
      }
    ],
    "operations": [
      {
        "id": 0,
        "action": "example",
        "attr": "example",
        "value": "example",
        "status": "example"
      }
    ],
    "grants": [
      {
        "user_login": "example",
        "perm": "example",
        "created_at": "2025-01-01T00:00:00Z",
        "comment": "example",
        "partner_data_access": true
      }
    ],
    "labels": [
      {
        "id": 0,
        "name": "example"
      }
    ],
    "webvisor": {
      "urls": "example",
      "arch_enabled": true,
      "arch_type": "example",
      "load_player_type": "example",
      "wv_version": 0,
      "wv_forms": true
    },
    "code_options": {
      "async": true,
      "informer": {
        "enabled": true,
        "type": "example",
        "size": 1,
        "indicator": "example",
        "color_start": "FFFFFFFF.",
        "color_end": "EFEFEFFF",
        "color_text": 0,
        "color_arrow": 0
      },
      "visor": true,
      "track_hash": true,
      "xml_site": true,
      "clickmap": true,
      "in_one_line": true,
      "ecommerce": true,
      "alternative_cdn": true,
      "ytm": true
    },
    "create_time": "2025-01-01T00:00:00Z",
    "time_zone_name": "example",
    "time_zone_offset": 0,
    "partner_id": 0,
    "source": "example",
    "site2": {
      "site": "example"
    },
    "gdpr_agreement_accepted": true,
    "mirrors2": [
      null
    ]
  }
]
```

{% endcut %}
{.table-cell}
||
||

_rows_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Количество счетчиков, удовлетворяющих запросу, без учета параметров `offset` и `per_page`.
{.table-cell}
||
|#{.json-schema-properties}

</div>

<div class="openapi-entity">

### GoalE {#entity-GoalE}

Информация о цели.

#|
|| **Name** | **Description** ||
||

_type_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Тип цели:
- `action` — JavaScript-событие.
- `chat` — клик по чату.
- `email` — клик по email.
- `file` — скачивание файлов.
- `messenger` — переход в мессенджер.
- `number` — количество просмотров.
- `payment_system` — платежная система.
- `phone` — клик по номеру телефона.
- `search` — поиск по сайту.
- `social` — переход в соцсети.
- `step` — составная цель.
- `url` — посещение страниц.
- `visit_duration` — продолжительность визита.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_default_price_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: number

Цена цели по умолчанию.
{.table-cell}
||
||

_goal_source_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Признак того, как создана цель:
- `user` — цель создана пользователем Метрики.
- `auto` — цель создана автоматически. К таким целям относятся т. н. [автоматические цели](https://yandex.ru/support/metrica/general/auto-goals.html?lang=ru), цель **Звонок** (создается при [передаче данных о звонках](https://yandex.ru/dev/metrika/ru/management/calls.md)).


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_id_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Идентификатор цели. Укажите данный параметр при изменении и удалении цели счетчика.
{.table-cell}
||
||

_is_favorite_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Является ли цель избранной:
- 0 ― не является (по умолчанию).
- 1 ― является.

{.table-cell}
||
||

_name_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Наименование цели.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `255`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_status_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### ActionGoalCondition {#entity-ActionGoalCondition}

Список структур с условиями цели.

#|
|| **Name** | **Description** ||
||

_type_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Тип условия. Возможные значения:
- `contain` — содержит.
- `exact` — совпадает.
- `start` — начинается с.
- `regexp` — удовлетворяет регулярному выражению.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_url_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Значение.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `16384`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example",
  "url": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### ActionGoal {#entity-ActionGoal}

Целевое событие.

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _conditions_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: [ActionGoalCondition](#entity-ActionGoalCondition)[]

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "type": "example",
      "url": "example"
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "conditions": [
    {
      "type": "example",
      "url": "example"
    }
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### ChatGoalCondition {#entity-ChatGoalCondition}

Список структур с условиями цели.

#|
|| **Name** | **Description** ||
||

_field_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

К чему применять цель:
- `chat_answered` — статус ответа в чате.
- `chat_platform` — платформа чата.
- `chat_tag` — тег чата.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "field": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### ChatGoalConditionAnswered {#entity-ChatGoalConditionAnswered}

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [ChatGoalCondition](#entity-ChatGoalCondition)

  Список структур с условиями цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "field": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _answered_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: boolean

  Статус ответа в чате.
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "answered": true
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "field": "example",
  "answered": true
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### ChatGoalConditionPlatform {#entity-ChatGoalConditionPlatform}

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [ChatGoalCondition](#entity-ChatGoalCondition)

  Список структур с условиями цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "field": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _platform_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: string

  Платформа чата.
  Возможные значения:
  - `telegram`;
  - `viber`;
  - `whatsApp`.


  _Example:_{.json-schema-reset .json-schema-example} `telegram`
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "platform": "telegram"
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "field": "example",
  "platform": "telegram"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### ChatGoalConditionTag {#entity-ChatGoalConditionTag}

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [ChatGoalCondition](#entity-ChatGoalCondition)

  Список структур с условиями цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "field": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _operator_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: string

  Тип условия. Возможные значения:
  - `contain` — содержит.
  - `exact` — совпадает.
  - `start` — начинается с.
  - `regexp` — удовлетворяет регулярному выражению.


  _Example:_{.json-schema-reset .json-schema-example} `example`
  {.table-cell}
  ||
  ||

  _value_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: string

  _Min length:_{.json-schema-reset .json-schema-assertion} `0`

  _Max length:_{.json-schema-reset .json-schema-assertion} `1024`

  _Example:_{.json-schema-reset .json-schema-example} `example`
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "operator": "example",
    "value": "example"
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "field": "example",
  "operator": "example",
  "value": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### ChatGoal {#entity-ChatGoal}

Нажатие на чат.

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _conditions_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  {% cut "**Type**: array" %}

  {% cut "**One of 3 types**" %}{.json-schema-combinators data-marker=or}

  - **Type**: [ChatGoalConditionAnswered](#entity-ChatGoalConditionAnswered)

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "field": "example",
      "answered": true
    }
    ```

    {% endcut %}

  - **Type**: [ChatGoalConditionPlatform](#entity-ChatGoalConditionPlatform)

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "field": "example",
      "platform": "telegram"
    }
    ```

    {% endcut %}

  - **Type**: [ChatGoalConditionTag](#entity-ChatGoalConditionTag)

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "field": "example",
      "operator": "example",
      "value": "example"
    }
    ```

    {% endcut %}

  {% endcut %}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "field": "example",
      "answered": true
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "conditions": [
      {
        "field": "example",
        "answered": true
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "conditions": [
    null
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### CompositeGoal {#entity-CompositeGoal}

Составная цель.
Нужна для группировки и задания порядка обычных целей.
В качестве шагов может содержать цели типа "Посещение страниц" и "JavaScript-событие".
Шаг считается достигнутым, если были достигнуты все предыдущие шаги, и после этого были выполнены все условия текущего шага.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _steps_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  {% cut "**Type**: array" %}

  {% cut "**One of 13 types**" %}{.json-schema-combinators data-marker=or}

  - **Type**: [ActionGoal](#entity-ActionGoal)

    Целевое событие.

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        {
          "type": "example",
          "url": "example"
        }
      ]
    }
    ```

    {% endcut %}

  - **Type**: [ChatGoal](#entity-ChatGoal)

    Нажатие на чат.

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        null
      ]
    }
    ```

    {% endcut %}

  - **Type**: [CompositeGoal](#entity-CompositeGoal)

    Составная цель.
    Нужна для группировки и задания порядка обычных целей.
    В качестве шагов может содержать цели типа "Посещение страниц" и "JavaScript-событие".
    Шаг считается достигнутым, если были достигнуты все предыдущие шаги, и после этого были выполнены все условия текущего шага.


    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "steps": [
        null
      ]
    }
    ```

    {% endcut %}

  - **Type**: [DepthGoal](#entity-DepthGoal)

    Количество просмотров.
    Цель считается достигнутой, если посетитель просмотрел заданное количество страниц сайта.


    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "depth": 2
    }
    ```

    {% endcut %}

  - **Type**: [EmailGoal](#entity-EmailGoal)

    Нажатие на email.

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        {
          "type": "example",
          "url": "example"
        }
      ]
    }
    ```

    {% endcut %}

  - **Type**: [FileGoal](#entity-FileGoal)

    Скачивание файлов.
    Цель считается достигнутой, если посетитель скачал любой файл или определенный файл.


    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        null
      ]
    }
    ```

    {% endcut %}

  - **Type**: [MessengerGoal](#entity-MessengerGoal)

    Переход в мессенджер.
    Цель будет достигнута при клике пользователем на ссылку, которая ведет в мессенджер.


    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        {
          "type": "example",
          "url": "example"
        }
      ]
    }
    ```

    {% endcut %}

  - **Type**: [PaymentSystemGoal](#entity-PaymentSystemGoal)

    Платежные системы.
    Цель считается достигнутой, если посетитель совершил оплату через платежную систему.


    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example"
    }
    ```

    {% endcut %}

  - **Type**: [PhoneGoal](#entity-PhoneGoal)

    Нажатие на номер телефона.

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        {
          "type": "example",
          "url": "example"
        }
      ],
      "hide_phone_number": true
    }
    ```

    {% endcut %}

  - **Type**: [SiteSearchGoal](#entity-SiteSearchGoal)

    Поиск по сайту.
    Цель будет достигнута при поиске на сайте, если в урле в get-параметрах есть хотя бы одно совпадение.


    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        {
          "type": "example",
          "url": "example"
        }
      ]
    }
    ```

    {% endcut %}

  - **Type**: [SocialNetworkGoal](#entity-SocialNetworkGoal)

    Переход в социальную сеть.
    Цель будет достигнута при клике пользователем на ссылку, которая ведет в социальную сеть.


    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        null
      ]
    }
    ```

    {% endcut %}

  - **Type**: [UrlGoal](#entity-UrlGoal)

    Посещение страниц.
    Достигается, когда выполняется хотя бы одно из условий.


    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        {
          "type": "example",
          "url": "example"
        }
      ]
    }
    ```

    {% endcut %}

  - **Type**: [VisitDurationGoal](#entity-VisitDurationGoal)

    Продолжительность визита.
    Цель будет достигнута при времени визита больше заданного.


    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "duration": 1
    }
    ```

    {% endcut %}

  {% endcut %}

  _Min items:_{.json-schema-reset .json-schema-assertion} `0`

  _Max items:_{.json-schema-reset .json-schema-assertion} `5`

  {% endcut %}

  _Min items:_{.json-schema-reset .json-schema-assertion} `0`

  _Max items:_{.json-schema-reset .json-schema-assertion} `5`

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        {}
      ]
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "steps": [
      {
        "id": 0,
        "name": "example",
        "type": "example",
        "default_price": 0.5,
        "goal_source": "example",
        "is_favorite": true,
        "status": "example",
        "conditions": [
          null
        ]
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "steps": [
    null
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### DepthGoal {#entity-DepthGoal}

Количество просмотров.
Цель считается достигнутой, если посетитель просмотрел заданное количество страниц сайта.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _depth_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: integer

  Количество просмотренных пользователем страниц.

  _Min value:_{.json-schema-reset .json-schema-assertion} `2`
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "depth": 2
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "depth": 2
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### EmailGoalCondition {#entity-EmailGoalCondition}

Список структур с условиями цели.

#|
|| **Name** | **Description** ||
||

_url_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Значение.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `1024`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_type_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example",
  "url": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### EmailGoal {#entity-EmailGoal}

Нажатие на email.

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _conditions_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: [EmailGoalCondition](#entity-EmailGoalCondition)[]

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "type": "example",
      "url": "example"
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "conditions": [
    {
      "type": "example",
      "url": "example"
    }
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### FileGoalCondition {#entity-FileGoalCondition}

Список структур с условиями цели.

#|
|| **Name** | **Description** ||
||

_type_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Тип условия. Возможные значения:
- `all_files`
- `file`


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### FileGoalConditionAllFiles {#entity-FileGoalConditionAllFiles}

{% cut "**All of 1 type**" %}{.json-schema-combinators data-marker=and}

- **Type**: [FileGoalCondition](#entity-FileGoalCondition)

  Список структур с условиями цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "type": "example"
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### FileGoalConditionFile {#entity-FileGoalConditionFile}

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [FileGoalCondition](#entity-FileGoalCondition)

  Список структур с условиями цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "type": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _url_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: string

  Значение.

  _Min length:_{.json-schema-reset .json-schema-assertion} `0`

  _Max length:_{.json-schema-reset .json-schema-assertion} `16384`

  _Example:_{.json-schema-reset .json-schema-example} `example`
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "url": "example"
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example",
  "url": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### FileGoal {#entity-FileGoal}

Скачивание файлов.
Цель считается достигнутой, если посетитель скачал любой файл или определенный файл.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _conditions_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  {% cut "**Type**: array" %}

  {% cut "**One of 2 types**" %}{.json-schema-combinators data-marker=or}

  - **Type**: [FileGoalConditionAllFiles](#entity-FileGoalConditionAllFiles)

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "type": "example"
    }
    ```

    {% endcut %}

  - **Type**: [FileGoalConditionFile](#entity-FileGoalConditionFile)

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "type": "example",
      "url": "example"
    }
    ```

    {% endcut %}

  {% endcut %}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "type": "example"
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "conditions": [
      {
        "type": "example"
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "conditions": [
    null
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### MessengerGoalCondition {#entity-MessengerGoalCondition}

Список структур с условиями цели.

#|
|| **Name** | **Description** ||
||

_url_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Значение.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `16384`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_type_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example",
  "url": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### MessengerGoal {#entity-MessengerGoal}

Переход в мессенджер.
Цель будет достигнута при клике пользователем на ссылку, которая ведет в мессенджер.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _conditions_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: [MessengerGoalCondition](#entity-MessengerGoalCondition)[]

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "type": "example",
      "url": "example"
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "conditions": [
    {
      "type": "example",
      "url": "example"
    }
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### PaymentSystemGoal {#entity-PaymentSystemGoal}

Платежные системы.
Цель считается достигнутой, если посетитель совершил оплату через платежную систему.


{% cut "**All of 1 type**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### PhoneGoalCondition {#entity-PhoneGoalCondition}

Список структур с условиями цели.

#|
|| **Name** | **Description** ||
||

_url_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Значение.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `25`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_type_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example",
  "url": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### PhoneGoal {#entity-PhoneGoal}

Нажатие на номер телефона.

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _conditions_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: [PhoneGoalCondition](#entity-PhoneGoalCondition)[]

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "type": "example",
      "url": "example"
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  ||

  _hide_phone_number_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: boolean

  Скрывать номер телефона на десктопах.
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ],
    "hide_phone_number": true
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "conditions": [
    {
      "type": "example",
      "url": "example"
    }
  ],
  "hide_phone_number": true
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### SiteSearchGoal {#entity-SiteSearchGoal}

Поиск по сайту.
Цель будет достигнута при поиске на сайте, если в урле в get-параметрах есть хотя бы одно совпадение.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _conditions_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: [SiteSearchGoalCondition](#entity-SiteSearchGoalCondition)[]

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "type": "example",
      "url": "example"
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "conditions": [
    {
      "type": "example",
      "url": "example"
    }
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### SocialNetworkGoalCondition {#entity-SocialNetworkGoalCondition}

Список структур с условиями цели.

#|
|| **Name** | **Description** ||
||

_type_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Тип условия. Возможные значения:
- `all_social`
- `social`


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### SocialNetworkGoalConditionAllSocial {#entity-SocialNetworkGoalConditionAllSocial}

{% cut "**All of 1 type**" %}{.json-schema-combinators data-marker=and}

- **Type**: [SocialNetworkGoalCondition](#entity-SocialNetworkGoalCondition)

  Список структур с условиями цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "type": "example"
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### SocialNetworkGoalConditionSocial {#entity-SocialNetworkGoalConditionSocial}

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [SocialNetworkGoalCondition](#entity-SocialNetworkGoalCondition)

  Список структур с условиями цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "type": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _url_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: string

  Значение.

  _Min length:_{.json-schema-reset .json-schema-assertion} `0`

  _Max length:_{.json-schema-reset .json-schema-assertion} `16384`

  _Example:_{.json-schema-reset .json-schema-example} `example`
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "url": "example"
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example",
  "url": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### SocialNetworkGoal {#entity-SocialNetworkGoal}

Переход в социальную сеть.
Цель будет достигнута при клике пользователем на ссылку, которая ведет в социальную сеть.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _conditions_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  {% cut "**Type**: array" %}

  {% cut "**One of 2 types**" %}{.json-schema-combinators data-marker=or}

  - **Type**: [SocialNetworkGoalConditionAllSocial](#entity-SocialNetworkGoalConditionAllSocial)

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "type": "example"
    }
    ```

    {% endcut %}

  - **Type**: [SocialNetworkGoalConditionSocial](#entity-SocialNetworkGoalConditionSocial)

    {% cut "**Example**" %}{.json-schema-example}

    ```json translate=no
    {
      "type": "example",
      "url": "example"
    }
    ```

    {% endcut %}

  {% endcut %}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "type": "example"
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "conditions": [
      {
        "type": "example"
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "conditions": [
    null
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### UrlGoalCondition {#entity-UrlGoalCondition}

Список структур с условиями цели.

#|
|| **Name** | **Description** ||
||

_type_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Тип условия. Возможные значения:
- `contain` — содержит.
- `exact` — совпадает.
- `start` — начинается с.
- `regexp` — удовлетворяет регулярному выражению.
- `action` — используется в составных целях.
- `regexp_action` — используется в составных целях.
- `contain_action` — используется в составных целях.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_url_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Значение.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `16384`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "type": "example",
  "url": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### UrlGoal {#entity-UrlGoal}

Посещение страниц.
Достигается, когда выполняется хотя бы одно из условий.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _conditions_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: [UrlGoalCondition](#entity-UrlGoalCondition)[]

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "type": "example",
      "url": "example"
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "conditions": [
    {
      "type": "example",
      "url": "example"
    }
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### VisitDurationGoal {#entity-VisitDurationGoal}

Продолжительность визита.
Цель будет достигнута при времени визита больше заданного.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE)

  Информация о цели.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _duration_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: integer

  Продолжительность визита в секундах.

  _Min value:_{.json-schema-reset .json-schema-assertion} `1`
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "duration": 1
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example",
  "type": "example",
  "default_price": 0.5,
  "goal_source": "example",
  "is_favorite": true,
  "status": "example",
  "duration": 1
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### FilterE {#entity-FilterE}

Фильтр.

#|
|| **Name** | **Description** ||
||

_action_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Тип фильтра:
- `exclude` — исключить трафик.
- `include` — оставить только трафик.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_attr_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Тип данных, к которым применяется фильтр:
- `title` — заголовок страницы.
- `client_ip` — IP-адрес.
- `url` — URL страницы.
- `referer` — реферер.
- `uniq_id` — специальный атрибут для фильтра **не учитывать мои визиты**.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_status_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Статус фильтра:
- `active` — фильтр используется.
- `disabled` — фильтр отключен (без удаления).


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_type_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Отношение или действие для фильтра:
- `equal` — равно.
- `start` — начинается с.
- `contain` — содержит.
- `interval` — в интервале, используется только с типом данных «IP-адрес» (`attr = client_ip`).
- `me` — мои посещения, используется только с типом данных `attr = uniq_id`.
- `only_mirrors` — только сайт и зеркала, используется только для типа данных «URL страницы» (`attr = url`) и типа фильтра **оставить только трафик** (`action = include`), а также при условии, что для счетчика заданы зеркала.
- `regexp` — регулярное выражение.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_end_ip_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Последний IP-адрес диапазона.

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_id_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Идентификатор фильтра. Укажите данный параметр при изменении фильтра счетчика.
{.table-cell}
||
||

_start_ip_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Первый IP-адрес диапазона.

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_value_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Значение фильтра.

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_with_subdomains_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Фильтровать по поддоменам:
- 0 — не фильтровать по поддоменам (по умолчанию);
- 1 — фильтровать по поддоменам.

{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "attr": "example",
  "type": "example",
  "value": "example",
  "action": "example",
  "status": "example",
  "start_ip": "example",
  "end_ip": "example",
  "with_subdomains": true
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### OperationE {#entity-OperationE}

Операция.

#|
|| **Name** | **Description** ||
||

_action_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Тип операции:
- `cut_fragment` — вырезать якорь из URL.
- `cut_parameter` — вырезать определенный параметр из URL.
- `cut_all_parameters` — вырезать все параметры из URL.
- `merge_https_and_http` — заменить https:// на http://.
- `to_lower` — привести к нижнему регистру.
- `replace_domain` — заменить домен.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_attr_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Поле для фильтрации:
- `referer` — реферер.
- `url` — URL страницы.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_status_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Статус операции:
- `active` — операция используется.
- `disabled` — операция отключена (без удаления).


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_id_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Идентификатор операции (требуется указывать при изменении операции счетчика).
{.table-cell}
||
||

_value_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Значение для замены.

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "action": "example",
  "attr": "example",
  "value": "example",
  "status": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### CounterGrantE {#entity-CounterGrantE}

Разрешения на управление счетчиком и просмотр статистики.

#|
|| **Name** | **Description** ||
||

_perm_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Уровень доступа:
- `public_stat` — публичный доступ к статистике.
- `view` — только просмотр.
- `edit` — полный доступ.
- `analyst` — аналитик.
- `analyst_access_filter` — аналитик данных через фильтр.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_comment_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Произвольный комментарий. Количество символов не должно превышать 255.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `255`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_created_at_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string&lt;date-time&gt;

Дата предоставления доступа в формате YYYY-MM-DD'T'hh:mm:ssZ.

_Example:_{.json-schema-reset .json-schema-example} `2025-01-01T00:00:00Z`
{.table-cell}
||
||

_partner_data_access_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Доступ к группе отчетов «Монетизация». Пользователь сможет просматривать отчеты, добавлять группировки и метрики из группы «Монетизация» в другие отчеты.
Если у пользователя есть доступ на редактирование, то ему уже доступны отчеты группы «Монетизация».
Возможные значения:
- `true` — доступ разрешен;
- `false` — доступ не разрешен.
{.table-cell}
||
||

_user_login_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Логин пользователя, которому выдано разрешение на управление счетчиком. Параметр содержит пустую строку, если к статистике счетчика предоставлен публичный доступ (`perm = public_stat`).

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "user_login": "example",
  "perm": "example",
  "created_at": "2025-01-01T00:00:00Z",
  "comment": "example",
  "partner_data_access": true
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### AccessFiltersShortE {#entity-AccessFiltersShortE}

Список фильтров доступа, к которым выдано разрешение.

#|
|| **Name** | **Description** ||
||

_id_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

id фильтра доступа.
{.table-cell}
||
||

_name_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Название фильтра доступа.

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### AccessFiltersGrantE {#entity-AccessFiltersGrantE}

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [CounterGrantE](#entity-CounterGrantE)

  Разрешения на управление счетчиком и просмотр статистики.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "user_login": "example",
    "perm": "example",
    "created_at": "2025-01-01T00:00:00Z",
    "comment": "example",
    "partner_data_access": true
  }
  ```

  {% endcut %}

- {% cut "**Type**: object" %}

  #|
  ||

  _access_filters_{.json-schema-reset .json-schema-property}
  {.table-cell}|
  **Type**: [AccessFiltersShortE](#entity-AccessFiltersShortE)[]

  _Min items:_{.json-schema-reset .json-schema-assertion} `1`

  _Max items:_{.json-schema-reset .json-schema-assertion} `1`

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  [
    {
      "id": 0,
      "name": "example"
    }
  ]
  ```

  {% endcut %}
  {.table-cell}
  ||
  |#{.json-schema-properties}

  {% endcut %}

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "access_filters": [
      {
        "id": 0,
        "name": "example"
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "user_login": "example",
  "perm": "example",
  "created_at": "2025-01-01T00:00:00Z",
  "comment": "example",
  "partner_data_access": true,
  "access_filters": [
    {
      "id": 0,
      "name": "example"
    }
  ]
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### Label {#entity-Label}

Метка.

#|
|| **Name** | **Description** ||
||

_id_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Идентификатор метки.
{.table-cell}
||
||

_name_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Имя метки.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `255`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "name": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### WebvisorOptions {#entity-WebvisorOptions}

#|
|| **Name** | **Description** ||
||

_arch_enabled_{.json-schema-reset .json-schema-property .json-schema-deprecated}_[ ](*Deprecated)_{.openapi-deprecated .openapi-deprecated-compact}
{.table-cell}|
**Type**: boolean

Сохранение страниц сайта:
- 0 ― отключено (по умолчанию).
- 1 ― включено.

Поле устаревшее и не используется, его надо игнорировать.

{.table-cell}
||
||

_arch_type_{.json-schema-reset .json-schema-property .json-schema-deprecated}_[ ](*Deprecated)_{.openapi-deprecated .openapi-deprecated-compact}
{.table-cell}|
**Type**: string

Запись содержимого страниц:
- `none` — выключено.
- `load` — загружать с сайта.
- `html` — из браузера.

Поле устаревшее и не используется, его надо игнорировать.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_load_player_type_{.json-schema-reset .json-schema-property .json-schema-deprecated}_[ ](*Deprecated)_{.openapi-deprecated .openapi-deprecated-compact}
{.table-cell}|
**Type**: string

Загрузка страниц в плеер:
- `proxy` — от имени анонимного пользователя.
- `on_your_behalf` — от вашего имени.

Поле устаревшее и не используется, его надо игнорировать.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_urls_{.json-schema-reset .json-schema-property .json-schema-deprecated}_[ ](*Deprecated)_{.openapi-deprecated .openapi-deprecated-compact}
{.table-cell}|
**Type**: string

Список страниц для сохранения. Поле устаревшее и не используется, его надо игнорировать.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `2000`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_wv_forms_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Запись содержимого полей и форм (аналитика форм):
- 0 — не записывать содержимое полей и форм за исключением тех из них, которые помечены css-классом -metrika-recordkeys.
- 1 — записывать содержимое полей и форм за исключением тех из них, которые помечены css-классом -metrika-nokeys (по умолчанию).

Включена ли аналитика форм.

{.table-cell}
||
||

_wv_version_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Версия вебвизора.
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "urls": "example",
  "arch_enabled": true,
  "arch_type": "example",
  "load_player_type": "example",
  "wv_version": 0,
  "wv_forms": true
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### InformerOptionsE {#entity-InformerOptionsE}

Настройки информера.

#|
|| **Name** | **Description** ||
||

_color_arrow_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Цвет стрелки на информере:
- 0 ― черный;
- 1 ― фиолетовый (по умолчанию).


_Min value:_{.json-schema-reset .json-schema-assertion} `0`

_Max value:_{.json-schema-reset .json-schema-assertion} `1`
{.table-cell}
||
||

_color_end_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Конечный (нижний) цвет информера в формате RRGGBBAA. Параметр предназначен для создания градиента фона. Насыщенность и прозрачность цвета задаются аналогично параметру color_start.

_Default:_{.json-schema-reset .json-schema-value} `EFEFEFFF`

_Pattern:_{.json-schema-reset .json-schema-assertion} `[0-9A-F]{8}`
{.table-cell}
||
||

_color_start_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Начальный (верхний) цвет информера в формате RRGGBBAA. RR, GG, BB ― насыщенность красного, зеленого и синего цвета. Насыщенность каждого цвета задается значениями в диапазоне от 00 до FF. AA ― прозрачность от 00 (прозрачный) до FF (непрозрачный).

_Default:_{.json-schema-reset .json-schema-value} `FFFFFFFF.`

_Pattern:_{.json-schema-reset .json-schema-assertion} `[0-9A-F]{8}`
{.table-cell}
||
||

_color_text_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Цвет текста на информере:
- 0 ― черный (по умолчанию);
- 1 ― белый.


_Min value:_{.json-schema-reset .json-schema-assertion} `0`

_Max value:_{.json-schema-reset .json-schema-assertion} `1`
{.table-cell}
||
||

_enabled_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Разрешение отображения информера:
- 0 ― информер не отображается (по умолчанию).
- 1 ― информер отображается.

{.table-cell}
||
||

_indicator_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Показатель, который будет отображаться на информере:
- `pageviews` — просмотры (по умолчанию).
- `visits` — визиты.
- `uniques` — посетители.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_size_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Размер информера:
- 1 — размер 80х15;
- 2 — размер 80х31;
- 3 — размер 88х31 (по умолчанию). На вид информера этого типа не влияет значение поля `indicator`.


_Min value:_{.json-schema-reset .json-schema-assertion} `1`

_Max value:_{.json-schema-reset .json-schema-assertion} `3`
{.table-cell}
||
||

_type_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Тип информера:
- `simple` — простой.
- `ext` — расширенный (по умолчанию).


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "enabled": true,
  "type": "example",
  "size": 1,
  "indicator": "example",
  "color_start": "FFFFFFFF.",
  "color_end": "EFEFEFFF",
  "color_text": 0,
  "color_arrow": 0
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### CodeOptionsE {#entity-CodeOptionsE}

#|
|| **Name** | **Description** ||
||

_alternative_cdn_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Позволяет корректно учитывать посещения из регионов, в которых ограничен доступ к ресурсам Яндекса. Использование этой опции может снизить скорость загрузки кода счётчика:
- 0 ― отключено (по умолчанию).
- 1 ― включено.

{.table-cell}
||
||

_async_{.json-schema-reset .json-schema-property .json-schema-deprecated}_[ ](*Deprecated)_{.openapi-deprecated .openapi-deprecated-compact}
{.table-cell}|
**Type**: boolean

Асинхронный код счетчика:
- 0 ― отключено.
- 1 ― включено (по умолчанию).

Поле устаревшее и не используется, его надо игнорировать.

{.table-cell}
||
||

_clickmap_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Сбор статистики для работы отчета Карта кликов:
- 0 ― отключено (по умолчанию).
- 1 ― включено.

{.table-cell}
||
||

_ecommerce_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Сбор данных по электронной коммерции:
- 0 ― отключено (по умолчанию).
- 1 ― включено.

{.table-cell}
||
||

_in_one_line_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Выводить код счетчика в одну строку:
- 0 ― отключено (по умолчанию).
- 1 ― включено.

{.table-cell}
||
||

_informer_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: [InformerOptionsE](#entity-InformerOptionsE)

Настройки информера.

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "enabled": true,
  "type": "example",
  "size": 1,
  "indicator": "example",
  "color_start": "FFFFFFFF.",
  "color_end": "EFEFEFFF",
  "color_text": 0,
  "color_arrow": 0
}
```

{% endcut %}
{.table-cell}
||
||

_track_hash_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Отслеживание хеша в адресной строке браузера. Опция применима для AJAX-сайтов:
- 0 ― отключено (по умолчанию).
- 1 ― включено.

{.table-cell}
||
||

_visor_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Запись и анализ поведения посетителей сайта (WebVisor):
- 0 ― отключено (по умолчанию).
- 1 ― включено.

Это параметр, который указывает на включение или отключение WebVisor (ВВ) для счетчика.

{.table-cell}
||
||

_xml_site_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Для XML-сайтов. Элемент noscript не должен использоваться в XML документах:
- 0 ― отключено (по умолчанию).
- 1 ― включено.

{.table-cell}
||
||

_ytm_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Использование системы управления тегами. Возможные значения:
- 0 ― не используется.
- 1 — используется.

{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "async": true,
  "informer": {
    "enabled": true,
    "type": "example",
    "size": 1,
    "indicator": "example",
    "color_start": "FFFFFFFF.",
    "color_end": "EFEFEFFF",
    "color_text": 0,
    "color_arrow": 0
  },
  "visor": true,
  "track_hash": true,
  "xml_site": true,
  "clickmap": true,
  "in_one_line": true,
  "ecommerce": true,
  "alternative_cdn": true,
  "ytm": true
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### CounterMirrorE {#entity-CounterMirrorE}

Список зеркал (доменов) сайта.

#|
|| **Name** | **Description** ||
||

_site_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: string

Полный домен сайта.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `255`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "site": "example"
}
```

{% endcut %}

</div>

<div class="openapi-entity">

### CounterBrief {#entity-CounterBrief}

#|
|| **Name** | **Description** ||
||

_activity_status_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Посещаемость счетчика. Возможные значения:
- `low` — низкая посещаемость.
- `high` — высокая посещаемость.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_code_options_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: [CodeOptionsE](#entity-CodeOptionsE)

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "async": true,
  "informer": {
    "enabled": true,
    "type": "example",
    "size": 1,
    "indicator": "example",
    "color_start": "FFFFFFFF.",
    "color_end": "EFEFEFFF",
    "color_text": 0,
    "color_arrow": 0
  },
  "visor": true,
  "track_hash": true,
  "xml_site": true,
  "clickmap": true,
  "in_one_line": true,
  "ecommerce": true,
  "alternative_cdn": true,
  "ytm": true
}
```

{% endcut %}
{.table-cell}
||
||

_create_time_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string&lt;date-time&gt;

Дата и время создания счетчика.

_Example:_{.json-schema-reset .json-schema-example} `2025-01-01T00:00:00Z`
{.table-cell}
||
||

_favorite_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Добавлен ли счетчик в избранное:
- 0 ― не добавлен (по умолчанию);
- 1 ― добавлен.

{.table-cell}
||
||

_filters_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: [FilterE](#entity-FilterE)[]

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
[
  {
    "id": 0,
    "attr": "example",
    "type": "example",
    "value": "example",
    "action": "example",
    "status": "example",
    "start_ip": "example",
    "end_ip": "example",
    "with_subdomains": true
  }
]
```

{% endcut %}
{.table-cell}
||
||

_gdpr_agreement_accepted_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: boolean

Согласие с [Договором об обработке данных в сервисе Яндекс Метрика](https://yandex.ru/legal/metrica_agreement/).
- 0 — договор не принят (по умолчанию).
- 1 — договор принят.

{.table-cell}
||
||

_goals_{.json-schema-reset .json-schema-property}
{.table-cell}|
{% cut "**Type**: array" %}

{% cut "**One of 13 types**" %}{.json-schema-combinators data-marker=or}

- **Type**: [ActionGoal](#entity-ActionGoal)

  Целевое событие.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

- **Type**: [ChatGoal](#entity-ChatGoal)

  Нажатие на чат.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      null
    ]
  }
  ```

  {% endcut %}

- **Type**: [CompositeGoal](#entity-CompositeGoal)

  Составная цель.
  Нужна для группировки и задания порядка обычных целей.
  В качестве шагов может содержать цели типа "Посещение страниц" и "JavaScript-событие".
  Шаг считается достигнутым, если были достигнуты все предыдущие шаги, и после этого были выполнены все условия текущего шага.


  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "steps": [
      null
    ]
  }
  ```

  {% endcut %}

- **Type**: [DepthGoal](#entity-DepthGoal)

  Количество просмотров.
  Цель считается достигнутой, если посетитель просмотрел заданное количество страниц сайта.


  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "depth": 2
  }
  ```

  {% endcut %}

- **Type**: [EmailGoal](#entity-EmailGoal)

  Нажатие на email.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

- **Type**: [FileGoal](#entity-FileGoal)

  Скачивание файлов.
  Цель считается достигнутой, если посетитель скачал любой файл или определенный файл.


  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      null
    ]
  }
  ```

  {% endcut %}

- **Type**: [MessengerGoal](#entity-MessengerGoal)

  Переход в мессенджер.
  Цель будет достигнута при клике пользователем на ссылку, которая ведет в мессенджер.


  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

- **Type**: [PaymentSystemGoal](#entity-PaymentSystemGoal)

  Платежные системы.
  Цель считается достигнутой, если посетитель совершил оплату через платежную систему.


  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example"
  }
  ```

  {% endcut %}

- **Type**: [PhoneGoal](#entity-PhoneGoal)

  Нажатие на номер телефона.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ],
    "hide_phone_number": true
  }
  ```

  {% endcut %}

- **Type**: [SiteSearchGoal](#entity-SiteSearchGoal)

  Поиск по сайту.
  Цель будет достигнута при поиске на сайте, если в урле в get-параметрах есть хотя бы одно совпадение.


  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

- **Type**: [SocialNetworkGoal](#entity-SocialNetworkGoal)

  Переход в социальную сеть.
  Цель будет достигнута при клике пользователем на ссылку, которая ведет в социальную сеть.


  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      null
    ]
  }
  ```

  {% endcut %}

- **Type**: [UrlGoal](#entity-UrlGoal)

  Посещение страниц.
  Достигается, когда выполняется хотя бы одно из условий.


  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      {
        "type": "example",
        "url": "example"
      }
    ]
  }
  ```

  {% endcut %}

- **Type**: [VisitDurationGoal](#entity-VisitDurationGoal)

  Продолжительность визита.
  Цель будет достигнута при времени визита больше заданного.


  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "duration": 1
  }
  ```

  {% endcut %}

{% endcut %}

{% endcut %}

Список структур с информацией о целях счетчика.

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
[
  {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "goal_source": "example",
    "is_favorite": true,
    "status": "example",
    "conditions": [
      {}
    ]
  }
]
```

{% endcut %}
{.table-cell}
||
||

_grants_{.json-schema-reset .json-schema-property}
{.table-cell}|
{% cut "**Type**: array" %}

{% cut "**One of 2 types**" %}{.json-schema-combinators data-marker=or}

- **Type**: [CounterGrantE](#entity-CounterGrantE)

  Разрешения на управление счетчиком и просмотр статистики.

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "user_login": "example",
    "perm": "example",
    "created_at": "2025-01-01T00:00:00Z",
    "comment": "example",
    "partner_data_access": true
  }
  ```

  {% endcut %}

- **Type**: [AccessFiltersGrantE](#entity-AccessFiltersGrantE)

  {% cut "**Example**" %}{.json-schema-example}

  ```json translate=no
  {
    "user_login": "example",
    "perm": "example",
    "created_at": "2025-01-01T00:00:00Z",
    "comment": "example",
    "partner_data_access": true,
    "access_filters": [
      {
        "id": 0,
        "name": "example"
      }
    ]
  }
  ```

  {% endcut %}

{% endcut %}

{% endcut %}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
[
  {
    "user_login": "example",
    "perm": "example",
    "created_at": "2025-01-01T00:00:00Z",
    "comment": "example",
    "partner_data_access": true
  }
]
```

{% endcut %}
{.table-cell}
||
||

_id_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Идентификатор счетчика.
{.table-cell}
||
||

_labels_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: [Label](#entity-Label)[]

Список структур с информацией о метках.

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
[
  {
    "id": 0,
    "name": "example"
  }
]
```

{% endcut %}
{.table-cell}
||
||

_mirrors2_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: [CounterMirrorE](#entity-CounterMirrorE)[]

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
[
  {
    "site": "example"
  }
]
```

{% endcut %}
{.table-cell}
||
||

_name_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Наименование счетчика.

_Min length:_{.json-schema-reset .json-schema-assertion} `0`

_Max length:_{.json-schema-reset .json-schema-assertion} `255`

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_operations_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: [OperationE](#entity-OperationE)[]

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
[
  {
    "id": 0,
    "action": "example",
    "attr": "example",
    "value": "example",
    "status": "example"
  }
]
```

{% endcut %}
{.table-cell}
||
||

_owner_login_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Логин владельца счетчика.

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_partner_id_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Номер площадки РСЯ, если это партнерский счетчик.
{.table-cell}
||
||

_permission_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Уровень доступа к счетчику:
- `own` — счетчик, принадлежащий пользователю.
- `view` — гостевой счетчик с уровнем доступа **только просмотр**.
- `edit` — гостевой счетчик с уровнем доступа **полный доступ**.
- `analyst` — гостевой счетчик с уровнем доступа **аналитика**.
- `view_access_filter` — гостевой счетчик с уровнем доступа **только просмотр через фильтр доступа**.
- `analyst_access_filter` — гостевой счетчик с уровнем доступа **аналитика данных через фильтр доступа**.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_site2_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: [CounterMirrorE](#entity-CounterMirrorE)

Список зеркал (доменов) сайта.

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "site": "example"
}
```

{% endcut %}
{.table-cell}
||
||

_source_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Тип счетчика. Возможные значения:
- `turbodirect` — Турбо Директ.
- `marketplace_direct` — Маркетплейсы Директ.
- `sprav` — Бизнес.
- `partner` — РСЯ.
- `system` — Системный.
- `market` — Маркет.
- `eda` — Еда.
- `dzen` — Дзен.
- `geoadv` — Кабинет рекламодателя.
- `games` — Игры.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_status_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Статус счетчика. возможные значения:
- `Active` — счетчик активен.
- `Deleted` — счетчик удален.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_time_zone_name_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

[Часовой пояс](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) для расчета статистики.

_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_time_zone_offset_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: integer

Текущее смещение часового пояса от Гринвича, минуты.
{.table-cell}
||
||

_type_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: string

Тип счетчика. Возможные значения:
  - `simple` — счетчик создан пользователем в Яндекс Метрике.
  - `partner` — счетчик импортирован из РСЯ.


_Example:_{.json-schema-reset .json-schema-example} `example`
{.table-cell}
||
||

_webvisor_{.json-schema-reset .json-schema-property}
{.table-cell}|
**Type**: [WebvisorOptions](#entity-WebvisorOptions)

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "urls": "example",
  "arch_enabled": true,
  "arch_type": "example",
  "load_player_type": "example",
  "wv_version": 0,
  "wv_forms": true
}
```

{% endcut %}
{.table-cell}
||
|#{.json-schema-properties}

{% cut "**Example**" %}{.json-schema-example}

```json translate=no
{
  "id": 0,
  "status": "example",
  "owner_login": "example",
  "activity_status": "example",
  "name": "example",
  "type": "example",
  "favorite": true,
  "permission": "example",
  "goals": [
    {
      "id": 0,
      "name": "example",
      "type": "example",
      "default_price": 0.5,
      "goal_source": "example",
      "is_favorite": true,
      "status": "example",
      "conditions": [
        null
      ]
    }
  ],
  "filters": [
    {
      "id": 0,
      "attr": "example",
      "type": "example",
      "value": "example",
      "action": "example",
      "status": "example",
      "start_ip": "example",
      "end_ip": "example",
      "with_subdomains": true
    }
  ],
  "operations": [
    {
      "id": 0,
      "action": "example",
      "attr": "example",
      "value": "example",
      "status": "example"
    }
  ],
  "grants": [
    {
      "user_login": "example",
      "perm": "example",
      "created_at": "2025-01-01T00:00:00Z",
      "comment": "example",
      "partner_data_access": true
    }
  ],
  "labels": [
    {
      "id": 0,
      "name": "example"
    }
  ],
  "webvisor": {
    "urls": "example",
    "arch_enabled": true,
    "arch_type": "example",
    "load_player_type": "example",
    "wv_version": 0,
    "wv_forms": true
  },
  "code_options": {
    "async": true,
    "informer": {
      "enabled": true,
      "type": "example",
      "size": 1,
      "indicator": "example",
      "color_start": "FFFFFFFF.",
      "color_end": "EFEFEFFF",
      "color_text": 0,
      "color_arrow": 0
    },
    "visor": true,
    "track_hash": true,
    "xml_site": true,
    "clickmap": true,
    "in_one_line": true,
    "ecommerce": true,
    "alternative_cdn": true,
    "ytm": true
  },
  "create_time": "2025-01-01T00:00:00Z",
  "time_zone_name": "example",
  "time_zone_offset": 0,
  "partner_id": 0,
  "source": "example",
  "site2": {
    "site": "example"
  },
  "gdpr_agreement_accepted": true,
  "mirrors2": [
    null
  ]
}
```

{% endcut %}

</div>

</div>

</div>
<!-- endsource: ru/management-src/Upravlenie-schetchikami/counters.md -->

[*Deprecated]: No longer supported, please use an alternative and newer version.