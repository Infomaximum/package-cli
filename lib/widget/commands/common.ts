import chalk from "chalk";
import { assertSimple } from "@infomaximum/assert";
import { DEFAULT_BUILD_DIR_NAME } from "../../const.js";
import type { WidgetRCConfig } from "../configs/file.js";
import type { Command } from "commander";

export type InputCommonOptions = {
  entry: string;
  "widget-manifest"?: string;
  "package-manifest"?: string;
  "package-dir"?: string;
  "assets-dir"?: string;
};

export type MergedCommonOptions = ReturnType<
  typeof configMergeWithOptionsCommon
>;

export function registerCommonOption(command: Command) {
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

export function configMergeWithOptionsCommon(
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
