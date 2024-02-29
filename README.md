# @infomaximum/package-cli

@infomaximum/package-cli - предоставляет разработчикам набор команд и функций для сборки пакетов, запуска пакетов в режиме разработки и создания шаблонного кода для виджетов и приложений.

<a href="https://www.npmjs.com/package/@infomaximum/package-cli">
    <img alt="npm" src="https://img.shields.io/npm/v/@infomaximum/package-cli?style=for-the-badge">
</a>

## Разработка виджета

### Инициализация проекта

Для создания нового пакета с виджетом необходимо выполнить следующую команду:

`npx @infomaximum/package-cli widget init my_widget`

После выполнения данной команды будет создан шаблонный проект **my_widget** и инициализирован git репозиторий.

### Разработка виджета

Для разработки виджета нужно выполнить команду:

`yarn im-package-cli widget build --dev`

Данная команда выполняет сборку пакета для разработки. Далее, пакет (собранный архив из папки build) необходимо загрузить в систему. Для этого добавляем пакет в маркетплейс либо в пространство, а так же добавляем разрабатываемый виджет на холст (дашбординг).

Затем необходимо запустить сервер разработки следующей командой:

`yarn im-package-cli widget start`

В результате будет запущен сервер отслеживающий изменения проекта и выполняющий горячую перезагрузку разрабатываемого компонента.

### Сборка пакета

Для того чтобы пользователи имели возможность использовать разработанный вами виджет, необходимо выполнить сборку пакета, для этого выполняем команду:

`yarn im-package-cli widget build`

Полученный в результате выполнения данной команды пакет можно загрузить в систему.

### Файл конфигурации виджета

#### **`widgetrc.json`**

```json
{
  "$schema": "node_modules/@infomaximum/package-cli/schemas/widgetConfigSchema.json",
  "entry": "src/index.tsx",
  "widgetManifest": "manifest.json",
  "packageManifest": "package/manifest.json",
  "packageDir": "package",
  "assetsDir": "_resources",
  "buildDir": "build",
  "port": 5555,
  "host": "localhost"
}
```

- `entry`: Путь к точке входа вашего приложения
- `widgetManifest`: Путь к файлу манифеста виджета

- `packageManifest`: Путь к файлу манифеста пакета

- `packageDir`: Путь к каталогу пакета

- `assetsDir`: Путь к каталогу ресурсов

- `buildDir`: Путь к каталогу сборки

- `port`: Порт, на котором будет запущен сервер разработки

- `host`: Хост, на котором будет запущен сервер разработки

Этот файл должен называться `widgetrc.json`, но также может иметь расширение `.js`, `.yaml`. Кроме того, конфигурацию можно добавить в `package.json` в поле `widget`. Примерно так:

#### **`package.json`**

```json
{
  "name": "my_widget",
  "version": "1.0.0",
  "dependencies": {
    ...
  },
  "widget": {
    "entry": "src/index.tsx",
    "widgetManifest": "manifest.json",
    "packageManifest": "package/manifest.json",
    "packageDir": "package",
    "assetsDir": "_resources",
    "buildDir": "build",
    "port": 5555,
    "host": "localhost"
  }
}
```

Эта конфигурация определяет, как будут собираться и запускаться ваш пакет или виджет с использованием `@infomaximum/package-cli`.

## Вывод всех доступных команд

Вы можете использовать флаг `-h`, чтобы просмотреть список всех доступных команд и их описаний:

```bash
yarn im-package-cli -h
```
