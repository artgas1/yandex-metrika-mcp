---
metadata:
  - name: generator
    content: Diplodoc Platform v5.57.3
alternate:
  - https://yandex.ru/dev/metrika/en/management/openapi/chats/findAll_chats.md
  - https://yandex.ru/dev/metrika/ru/management/openapi/chats/findAll_chats.md
  - href: ru/management/openapi/chats/findAll_chats.md
    type: text/markdown
    title: Markdown version
  - href: ../../../llms.txt
    type: text/markdown
    title: llms.txt
---
> **Documentation Index:** Fetch the complete configuration index at https://yandex.ru/dev/metrika/ru/llms.txt

# Список загрузок информации о чатах

Возвращает список загрузок офлайн-конверсий для счетчика, включая чаты. Записи содержат ID загрузки, время, число строк, тип используемого идентификатора и статус обработки.

## Request {#request}

```
GET https://api-metrika.yandex.net/management/v1/counter/{counterId}/offline_conversions/uploadings/{uploadingId}
```

### Path parameters {#path-parameters}

#|
||**Name** | **Description**||
|| counterId[*](*star) | **Type:** `integer<int32>`

Идентификатор счетчика, для которого вы хотите получить список загрузок офлайн-конверсий, включая чаты.

Example: `2215573` ||
|#

### Query parameters {#query-parameters}

#|
||**Name** | **Description**||
|| limit | **Type:** `integer<int32>`

Default: `10000`||
|| offset | **Type:** `integer<int32>`

Default: `0`||
|#

## Responses {#responses}

## 200 OK {#200ok}

OK

### Body {#body}

{% cut "application/json" %}

```json
{
    "uploadings": [
        {
            "id": 0,
            "create_time": "2022-12-29T18:02:01Z",
            "source_quantity": 0,
            "line_quantity": 0,
            "comment": "string",
            "type": "string",
            "client_id_type": "USER_ID",
            "status": "string"
        }
    ]
}
```

{% endcut %}

#|
||**Name** | **Description**||
|| uploadings | **Type:** [OfflineConversionUploading](#OfflineConversionUploading)[]

Информация о загрузке офлайн-конверсий. ||
|#

### OfflineConversionUploading {#OfflineConversionUploading}

Информация о загрузке офлайн-конверсий.

#|
||**Name** | **Description**||
|| client_id_type | **Type:** string

Тип идентификаторов посетителей. Возможные значения:

- `USER_ID` — идентификатор посетителя сайта, назначенный владельцем сайта.

- `CLIENT_ID` — идентификатор посетителя сайта, назначенный Яндекс Метрикой.

- `YCLID` — идентификатор клика по рекламному объявлению Яндекс Директа, назначенный Яндекс Директом.

Example: `USER_ID`||

|| comment | **Type:** string

Произвольный комментарий. Количество символов не должно превышать 255.

Min length: `0`

Max length: `255`||
|| create_time | **Type:** `string<date-time>`

Время загрузки.||
|| id | **Type:** integer<int64>

Идентификатор загрузки.||
|| line_quantity | **Type:** `integer<int32>`

Количество строк, прошедших валидацию при загрузке.||
|| source_quantity | **Type:** `integer<int32>`

Количество строк в исходном файле.||
|| status | **Type:** string

Статус загрузки:

- `PREPARED` — загрузка подготовлена.

- `UPLOADED` — загрузка завершена.

- `EXPORTED` — загрузка экспортирована.

- `MATCHED` — произведено сопоставление идентификаторов событий.

- `PROCESSED` — загрузка успешно обработана.

- `LINKAGE_FAILURE` — не удалось сопоставить ни один идентификатор посетителя. Если передана информация о статических звонках, они не будут привязаны к визитам в Яндекс Метрике, но будут доступны в отчетах по звонкам.||
|| string | **Type:** string ||
|#

[*star]: обязательный параметр
