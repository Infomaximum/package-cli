# Package-cli

Package-cli - предоставляет разработчикам набор команд и функций для сборки пакетов, запуска пакетов в режиме разработки и создания шаблонного кода для виджетов и приложений.

<a href="https://www.npmjs.com/package/@infomaximum/package-cli">
    <img alt="npm" src="https://img.shields.io/npm/v/@infomaximum/package-cli?style=for-the-badge">
</a>

## Установка

```bash
yarn add -D @infomaximum/package-cli
```

## Примеры использования

Сборка пакета с виджетом:

```bash
yarn im-package-cli widget build --entry ./src/index.tsx
```

Создание нового пакета с виджетом:

```bash
npx @infomaximum/package-cli widget init project_name
```

## Вывод всех доступных команд

Вы можете использовать флаг `-h`, чтобы просмотреть список всех доступных команд и их описаний:

```bash
yarn im-package-cli -h
```
