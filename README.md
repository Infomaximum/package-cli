# im-package-cli

`im-package-cli` — CLI-инструмент для генерации и сборки проектов (пакетов) Infomaximum трёх типов:

- `widget` — виджеты
- `application` — приложения
- `integration` — интеграции

## Требования

- Node.js `>= 16`
- npm или yarn

## Установка

### Глобально

```bash
npm i -g @infomaximum/package-cli
im-package-cli --help
```

### Через npx

```bash
npx @infomaximum/package-cli --help
```

### Локальная разработка CLI (из исходников)

```bash
yarn install
yarn build
node dist/index.js --help
```

## Быстрый старт: создать проект

```bash
im-package-cli widget init my-widget
im-package-cli application init my-application
im-package-cli integration init my-integration
```

Команда `init`:

- создаёт проект в указанной папке
- задаёт вопросы (имя пакета, описание, автор, пакетный менеджер)
- устанавливает зависимости (`npm install` / `yarn install`)
- выполняет `git init -b develop`

## Команды

CLI организован по группам: `widget`, `application`, `integration`.

### Общие параметры упаковки (для widget/application/integration build)

Эти параметры доступны там, где выполняется сборка “пакета”:

- `--package-dir <packageDirPath>` — директория с содержимым пакета (по умолчанию `package`)
- `--package-manifest <manifestPath>` — путь до манифеста пакета (по умолчанию `package/manifest.json`)

Содержимое `package/` обычно включает:

- `manifest.json` (манифест пакета)
- локализованные описания `package/ru/doc.md`, `package/en/doc.md` (и т. п.)
- ресурсы `package/resources/…`

### widget

#### `im-package-cli widget init <project-directory>`

Инициализация проекта виджета (scaffold).

#### `im-package-cli widget start`

Запуск проекта виджета в режиме разработки (webpack-dev-server).

Параметры:

- `--entry <path>` — путь до entrypoint (обязателен, если не задан в конфиге)
- `--widget-manifest <manifestPath>` — путь до `manifest.json` виджета (обязателен, если не задан в конфиге)
- `--assets-dir <assetsDirPath>` — директория ресурсов виджета для упаковки в архив (опционально)
- `--host <host>` — host, на котором будет доступен dev-сервер и который попадёт в manifest
- `--port <port>` — порт dev-сервера и который попадёт в manifest
- `--package-dir <packageDirPath>`
- `--package-manifest <manifestPath>`

Если `host`/`port` не заданы ни в параметрах, ни в конфиге, используются значения по умолчанию:

- host: `localhost`
- port: `5555`

#### `im-package-cli widget build`

Сборка пакета виджета.

Параметры:

- `--build-dir <buildDirPath>` — путь до директории сборки (на текущий момент фактически берётся из `buildDir` в конфиге)
- `--dev` — сборка “для разработки”; в этом режиме сборка может ограничиться подготовкой манифеста
- `--host <host>` — host, который будет указан в манифесте виджета
- `--port <port>` — порт, который будет указан в манифесте виджета
- `--entry <path>`
- `--widget-manifest <manifestPath>`
- `--assets-dir <assetsDirPath>`
- `--package-dir <packageDirPath>`
- `--package-manifest <manifestPath>`

Что происходит при сборке:

- webpack собирает артефакт виджета и архивирует его (zip)
- затем собирается “пакет” (manifest + архив виджета и содержимое `package/`)

#### `im-package-cli widget release`

Создание релиза виджета (через `standard-version`).

Параметры:

- `--first` — первый релиз без повышения версии в `package.json`
- `--skip-tag` — не создавать git-тег
- `--skip-changelog` — не генерировать CHANGELOG
- `--skip-commit` — не создавать релизный commit
- `--skip-bump` — не увеличивать версию
- `--dry-run` — показать план действий, не выполняя релиз

### application

#### `im-package-cli application init <project-directory>`

Инициализация проекта приложения (scaffold).

#### `im-package-cli application start`

Запуск проекта приложения в режиме разработки (webpack-dev-server).

Параметры:

- `--entry <path>` — путь до entrypoint (обязателен, если не задан в конфиге)
- `--application-manifest <manifestPath>` — путь до `manifest.json` приложения (обязателен, если не задан в конфиге)
- `--host <host>` — host dev-сервера и который попадёт в manifest
- `--port <port>` — порт dev-сервера и который попадёт в manifest
- `--package-dir <packageDirPath>`
- `--package-manifest <manifestPath>`

Если `host`/`port` не заданы ни в параметрах, ни в конфиге, используются значения по умолчанию:

- host: `localhost`
- port: `5566`

#### `im-package-cli application build`

Сборка пакета приложения.

Параметры:

- `--build-dir <buildDirPath>` — путь до директории сборки (на текущий момент фактически берётся из `buildDir` в конфиге)
- `--dev` — сборка “для разработки”; в этом режиме сборка может ограничиться подготовкой манифеста
- `--host <host>` — host, который будет указан в манифесте приложения
- `--port <port>` — порт, который будет указан в манифесте приложения
- `--entry <path>`
- `--application-manifest <manifestPath>`
- `--package-dir <packageDirPath>`
- `--package-manifest <manifestPath>`

### integration

#### `im-package-cli integration init <project-directory>`

Инициализация проекта интеграции (scaffold).

#### `im-package-cli integration build`

Сборка интеграции.

Параметры:

- `--build-dir <buildDirPath>` — директория вывода (по умолчанию `build`)
- `--type <buildType>` — `package` (архив пакета) или `script` (js-файл), по умолчанию `package`
- `--watch` — пересборка при изменениях
- `--copy` — копировать итоговый скрипт интеграции в буфер обмена
- `--fetchToServer` — отправлять собранный код на сервер (требуется настроенный `integrationrc.js` с `fetcher`)
- `--beautify` — отформатировать код после сборки
- `--entry <path>` — путь до entrypoint (обязателен, если не задан в конфиге)
- `--package-dir <packageDirPath>`
- `--package-manifest <manifestPath>`

#### `im-package-cli integration debug`

Отладка интеграции через `@infomaximum/integration-debugger`.

Параметры:

- `--entityKey <key>` — ключ сущности, для которой запускается отладка
- `--isGenerateSchema` — сгенерировать `output_variables` по `output`
- `--series` — серия запусков отладки сущности
- `--entry <path>` — путь до entrypoint (обязателен, если не задан в конфиге)

## Конфигурация проектов (rc-файлы)

Идея одинаковая для всех типов: параметры можно задавать либо в rc-файле в корне проекта, либо через CLI-опции (опции имеют приоритет).

### widget: `widgetrc` / `widgetrc.json` или поле `widget` в `package.json`

Минимальный пример `widgetrc.json`:

```json
{
  "$schema": "node_modules/@infomaximum/package-cli/schemas/widgetConfigSchema.json",
  "entry": "src/index.tsx",
  "widgetManifest": "manifest.json",
  "packageDir": "package",
  "packageManifest": "package/manifest.json",
  "assetsDir": "_resources",
  "buildDir": "build",
  "port": 5555,
  "host": "localhost"
}
```

### application: `applicationrc` / `applicationrc.json` или поле `application` в `package.json`

Минимальный пример `applicationrc.json`:

```json
{
  "$schema": "node_modules/@infomaximum/package-cli/schemas/applicationConfigSchema.json",
  "entry": "src/index.tsx",
  "applicationManifest": "manifest.json",
  "packageDir": "package",
  "packageManifest": "package/manifest.json",
  "buildDir": "build",
  "port": 5566,
  "host": "localhost"
}
```

### integration: `integrationrc.js`

Для интеграции конфигурация задаётся JS-файлом, чтобы можно было определить функцию `fetcher` (например, использовать переменные окружения).

Минимальный пример `integrationrc.js`:

```js
//@ts-check

require("dotenv").config();

/**
 * @type {import("@infomaximum/package-cli").IntegrationRCConfig}
 */
const config = {
  entry: "src/index.ts",
  fetcher: (integrationCode) => ({
    graphqlUrl: process.env.GRAPHQL_URL,
    apiKey: process.env.API_KEY,
    query:
      "mutation UpdateIntegration($id: Long!, $js_code: String) { automation { integration { update(id: $id, js_code: $js_code) { id } } } }",
    variables: {
      id: process.env.INTEGRATION_ID,
      js_code: integrationCode,
    },
  }),
  debugging: {
    seriesIterations: 3,
    commonAuthData: {
      BASE_URL: process.env.WEBHOOK_URL,
    },
    blocks: {},
    connections: {},
  },
};

module.exports = config;
```

Пример `.env` (шаблон создаётся при `integration init` как `.env_example`):

```dotenv
INTEGRATION_ID=0
GRAPHQL_URL=https://example.com/graphql
API_KEY=123456789qwertyuiop
WEBHOOK_URL=https://example.com/webhook
```

Важно: не коммитьте реальные ключи и URL в репозиторий — храните их в `.env` (он добавлен в `.gitignore`).

## Схемы (JSON Schema)

Схемы лежат в папке `schemas/` и помогают валидировать/подсказывать поля в IDE:

- `schemas/widgetConfigSchema.json`
- `schemas/applicationConfigSchema.json`
- `schemas/packageManifestSchema.json`
- `schemas/widgetManifestSchema.json`
- `schemas/applicationManifestSchema.json`

Рекомендуемый способ — указывать `$schema` прямо в JSON-файле конфигурации/манифеста (пример показан выше).

## Разработка этого репозитория

Проект написан на TypeScript и собирается в `dist/` через `tsc` (ESM-модули).

Основные команды:

```bash
yarn dev       # компиляция TypeScript
yarn dev:w     # компиляция TypeScript в watch-режиме
yarn build     # очистка dist/ и сборка
yarn lint      # typecheck (tsc --noEmit)
yarn release   # standard-version + build (релиз самого CLI-пакета)
```

## Архитектура (коротко)

- Entrypoint CLI: `lib/index.ts` → регистрирует команды и парсит аргументы.
- Группы команд: `lib/widget`, `lib/application`, `lib/integration`.
- `init` использует `node-plop` + шаблоны, затем делает install и `git init`.
- `build/start` для widget/application используют webpack-конфиги и плагины для модификации манифестов/упаковки в zip.
- `integration build/debug` используют webpack + `@infomaximum/integration-debugger` (для debug).

## Лицензия

Apache-2.0 (см. LICENSE).
