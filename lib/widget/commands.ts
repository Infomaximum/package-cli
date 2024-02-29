import type { Command } from "commander";
import { runBuild } from "./scripts/build.js";
import { runDevServer } from "./scripts/start.js";
import { runInitWidget } from "./scripts/init/init.js";
import { getConfigFromFile, type WidgetRCConfig } from "./configs/file.js";
import { assertSilent, assertSimple } from "@infomaximum/assert";
import chalk from "chalk";
import { WIDGET_DEFAULT_HOST, WIDGET_DEFAULT_PORT } from "./const.js";
import { DEFAULT_BUILD_DIR_NAME } from "../const.js";

type InputCommonOptions = {
  entry: string;
  "widget-manifest"?: string;
  "package-manifest"?: string;
  "package-dir"?: string;
  "assets-dir"?: string;
};

type InputBuildOptions = {
  dev: boolean;
  port?: string | number;
  host?: string;
  "build-dir"?: string;
} & InputCommonOptions;

type InputStartOptions = {
  port: string | number;
  host: string;
} & InputCommonOptions;

export type MergedCommonOptions = ReturnType<
  typeof configMergeWithOptionsCommon
>;

export type MergedStartOptions = ReturnType<typeof configMergeWithOptionsStart>;

export type MergedBuildOptions = ReturnType<typeof configMergeWithOptionsBuild>;

function configMergeWithOptionsCommon(
  config: WidgetRCConfig | undefined,
  options: InputCommonOptions
) {
  const entry = options.entry || config?.entry;
  const assetsDir = options["assets-dir"] || config?.assetsDir;
  const packageDir = options["package-dir"] || config?.packageDir;
  const buildDir = config?.buildDir || DEFAULT_BUILD_DIR_NAME;
  const packageManifest =
    options["package-manifest"] || config?.packageManifest;
  const widgetManifest = options["widget-manifest"] || config?.widgetManifest;

  assertSimple(!!entry, chalk.red("В конфигурации не задан entry"));
  assertSimple(!!packageDir, chalk.red("В конфигурации не задан packageDir"));
  assertSimple(
    !!packageManifest,
    chalk.red("В конфигурации не задан packageManifest")
  );
  assertSimple(
    !!widgetManifest,
    chalk.red("В конфигурации не задан widgetManifest")
  );

  return {
    entry,
    assetsDir,
    packageDir,
    packageManifest,
    widgetManifest,
    buildDir,
  };
}

function configMergeWithOptionsStart(options: InputStartOptions) {
  const config = getConfigFromFile();

  const host = options.host || config?.host;
  const port = options.port || config?.port;

  assertSilent(
    !!host,
    chalk.yellow(
      `В конфигурациях не найден host, используется host по умолчанию "${WIDGET_DEFAULT_HOST}"`
    )
  );

  assertSilent(
    !!port,
    chalk.yellow(
      `В конфигурациях не найден port, используется port по умолчанию "${WIDGET_DEFAULT_PORT}"`
    )
  );

  return {
    host: host || WIDGET_DEFAULT_HOST,
    port: port || WIDGET_DEFAULT_PORT,
    ...configMergeWithOptionsCommon(config, options),
  };
}

function configMergeWithOptionsBuild(options: InputBuildOptions) {
  const config = getConfigFromFile();

  return {
    host: options.host || config?.host,
    port: options.port || config?.port,
    dev: options.dev,
    ...configMergeWithOptionsCommon(config, options),
  };
}

function registerCommonOption(command: Command) {
  command
    .option("--entry <path>", "путь до entrypoint")
    .option(
      "--assets-dir <assetsDirPath>",
      "путь до директории с ресурсами виджета, которые будут перенесены в архив с виджетом"
    )
    .option(
      "--package-manifest <manifestPath>",
      "путь до файла манифеста пакета"
    )
    .option(
      "--package-dir <packageDirPath>",
      "путь до директории с файлами пакета"
    )
    .option(
      "--widget-manifest <manifestPath>",
      "путь до файла манифеста виджета"
    );
}

export const registerWidgetCommands = (cli: Command) => {
  const widgetCommand = cli.command("widget");

  const widgetBuildCommand = widgetCommand.command("build");

  registerCommonOption(widgetBuildCommand);

  widgetBuildCommand
    .description("Выполняет сборку пакета")
    .option(
      "--build-dir <buildDirPath>",
      "путь до директории в которую будет собран пакет"
    )
    .option("--dev", "собрать пакет для разработки", false)
    .option("--host <host>", "хост который будет указан в манифесте виджета")
    .option("--port <port>", "порт который будет указан в манифесте виджета")
    .action((options: InputBuildOptions) =>
      runBuild(configMergeWithOptionsBuild(options))
    );

  const widgetStartCommand = widgetCommand.command("start");

  registerCommonOption(widgetStartCommand);

  widgetStartCommand
    .description("Выполняет запуск проекта для разработки")
    .option("--port <port>", "порт на котором будет доступен виджет")
    .option("--host <host>", "host на котором будет доступен виджет")
    .action((options: InputStartOptions) =>
      runDevServer(configMergeWithOptionsStart(options))
    );

  const widgetInitCommand = widgetCommand.command("init <project-directory>");

  widgetInitCommand
    .description("Инициализация проекта виджета")
    .action((dirName: string) => {
      runInitWidget(dirName);
    });
};
