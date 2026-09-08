---
metadata:
  - name: generator
    content: Diplodoc Platform v5.57.3
alternate:
  - https://yandex.ru/dev/metrika/en/management/openapi/goal/addGoal.md
  - https://yandex.ru/dev/metrika/ru/management/openapi/goal/addGoal.md
  - href: ru/management/openapi/goal/addGoal.md
    type: text/markdown
    title: Markdown version
  - href: ../../../llms.txt
    type: text/markdown
    title: llms.txt
---
> **Documentation Index:** Fetch the complete configuration index at https://yandex.ru/dev/metrika/ru/llms.txt

<!-- source: ru/management-src/Upravlenie-celyami/addGoal_1.md -->
<div class="openapi">

# Создание цели

<!-- markdownlint-disable-file -->

Создает цель счетчика.

## Request

<div class="openapi__requests">

<div class="openapi__request__wrapper" style="--method: var(--dc-openapi-methods-post);margin-bottom: 12px">

<div class="openapi__request">

POST {.openapi__method}
```text translate=no
https://api-metrika.yandex.net/management/v1/counter/{counterId}/goals
```

</div>

</div>

</div>

### Path parameters

#|
|| **Name** | **Description** ||
||

_counterId_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
**Type**: integer

Идентификатор счетчика, для которого вы хотите создать цель.
{.table-cell}
||
|#{.json-schema-properties}

<div class="openapi-entity">

### Body

{% cut "application/json" %}

```json translate=no
{
  "goal": {
    "id": 0,
    "name": "example",
    "type": "example",
    "default_price": 0.5,
    "is_favorite": true,
    "status": "example",
    "conditions": [
      {}
    ]
  }
}
```

{% endcut %}

#|
|| **Name** | **Description** ||
||

_goal_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
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
    "is_favorite": true,
    "status": "example",
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
  "is_favorite": true,
  "status": "example",
  "duration": 1
}
```

{% endcut %}

</div>

## Responses

<div class="openapi__response__code__200">

## 200 OK

OK

<div class="openapi-entity">

### Body

{% cut "application/json" %}

```json translate=no
{
  "goal": {
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
}
```

{% endcut %}

#|
|| **Name** | **Description** ||
||

_goal_{.json-schema-reset .json-schema-property .json-schema-required}
{.table-cell}|
{% cut "**One of 13 types**" %}{.json-schema-combinators data-marker=or}

- **Type**: [ActionGoal](#entity-ActionGoal1)

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

- **Type**: [ChatGoal](#entity-ChatGoal1)

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

- **Type**: [CompositeGoal](#entity-CompositeGoal1)

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

- **Type**: [DepthGoal](#entity-DepthGoal1)

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

- **Type**: [EmailGoal](#entity-EmailGoal1)

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

- **Type**: [FileGoal](#entity-FileGoal1)

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

- **Type**: [MessengerGoal](#entity-MessengerGoal1)

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

- **Type**: [PaymentSystemGoal](#entity-PaymentSystemGoal1)

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

- **Type**: [PhoneGoal](#entity-PhoneGoal1)

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

- **Type**: [SiteSearchGoal](#entity-SiteSearchGoal1)

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

- **Type**: [SocialNetworkGoal](#entity-SocialNetworkGoal1)

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

- **Type**: [UrlGoal](#entity-UrlGoal1)

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

- **Type**: [VisitDurationGoal](#entity-VisitDurationGoal1)

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
{.table-cell}
||
|#{.json-schema-properties}

</div>

<div class="openapi-entity">

### GoalE {#entity-GoalE1}

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

### ActionGoal {#entity-ActionGoal1}

Целевое событие.

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### ChatGoal {#entity-ChatGoal1}

Нажатие на чат.

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### CompositeGoal {#entity-CompositeGoal1}

Составная цель.
Нужна для группировки и задания порядка обычных целей.
В качестве шагов может содержать цели типа "Посещение страниц" и "JavaScript-событие".
Шаг считается достигнутым, если были достигнуты все предыдущие шаги, и после этого были выполнены все условия текущего шага.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

  - **Type**: [ActionGoal](#entity-ActionGoal1)

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

  - **Type**: [ChatGoal](#entity-ChatGoal1)

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

  - **Type**: [CompositeGoal](#entity-CompositeGoal1)

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

  - **Type**: [DepthGoal](#entity-DepthGoal1)

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

  - **Type**: [EmailGoal](#entity-EmailGoal1)

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

  - **Type**: [FileGoal](#entity-FileGoal1)

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

  - **Type**: [MessengerGoal](#entity-MessengerGoal1)

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

  - **Type**: [PaymentSystemGoal](#entity-PaymentSystemGoal1)

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

  - **Type**: [PhoneGoal](#entity-PhoneGoal1)

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

  - **Type**: [SiteSearchGoal](#entity-SiteSearchGoal1)

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

  - **Type**: [SocialNetworkGoal](#entity-SocialNetworkGoal1)

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

  - **Type**: [UrlGoal](#entity-UrlGoal1)

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

  - **Type**: [VisitDurationGoal](#entity-VisitDurationGoal1)

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

### DepthGoal {#entity-DepthGoal1}

Количество просмотров.
Цель считается достигнутой, если посетитель просмотрел заданное количество страниц сайта.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### EmailGoal {#entity-EmailGoal1}

Нажатие на email.

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### FileGoal {#entity-FileGoal1}

Скачивание файлов.
Цель считается достигнутой, если посетитель скачал любой файл или определенный файл.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### MessengerGoal {#entity-MessengerGoal1}

Переход в мессенджер.
Цель будет достигнута при клике пользователем на ссылку, которая ведет в мессенджер.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### PaymentSystemGoal {#entity-PaymentSystemGoal1}

Платежные системы.
Цель считается достигнутой, если посетитель совершил оплату через платежную систему.


{% cut "**All of 1 type**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### PhoneGoal {#entity-PhoneGoal1}

Нажатие на номер телефона.

{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### SiteSearchGoal {#entity-SiteSearchGoal1}

Поиск по сайту.
Цель будет достигнута при поиске на сайте, если в урле в get-параметрах есть хотя бы одно совпадение.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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
  **Type**: [SiteSearchGoalCondition](#entity-MessengerGoalCondition)[]

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

### SocialNetworkGoal {#entity-SocialNetworkGoal1}

Переход в социальную сеть.
Цель будет достигнута при клике пользователем на ссылку, которая ведет в социальную сеть.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### UrlGoal {#entity-UrlGoal1}

Посещение страниц.
Достигается, когда выполняется хотя бы одно из условий.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

### VisitDurationGoal {#entity-VisitDurationGoal1}

Продолжительность визита.
Цель будет достигнута при времени визита больше заданного.


{% cut "**All of 2 types**" %}{.json-schema-combinators data-marker=and}

- **Type**: [GoalE](#entity-GoalE1)

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

</div>

</div>
<!-- endsource: ru/management-src/Upravlenie-celyami/addGoal_1.md -->


[*Deprecated]: No longer supported, please use an alternative and newer version.