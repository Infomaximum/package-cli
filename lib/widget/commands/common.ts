import chalk from "chalk";
import { assertSimple } from "@infomaximum/assert";
import { DEFAULT_BUILD_DIR_NAME } from "../../const.js";
import type { WidgetRCConfig } from "../configs/file.js";
import type { Command } from "commander";
import {
  registerPackageOptions,
  type InputPackageOptions,
} from "../../package/commands.js";

export type InputCommonOptions = {
  entry: string;
  widgetManifest?: string;
  assetsDir?: string;
} & InputPackageOptions;

export type MergedCommonOptions = ReturnType<
  typeof configMergeWithOptionsCommon
>;

export function registerCommonOption(command: Command) {
  registerPackageOptions(command);

  command
    .option("--entry <path>", "путь до entrypoint")
    .option(
      "--assets-dir <assetsDirPath>",
      "путь до директории с ресурсами виджета, которые будут перенесены в архив с виджетом"
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
  const assetsDir = options?.assetsDir || config?.assetsDir;
  const packageDir = options?.packageDir || config?.packageDir;
  const buildDir = config?.buildDir || DEFAULT_BUILD_DIR_NAME;
  const packageManifest = options?.packageManifest || config?.packageManifest;
  const widgetManifest = options?.widgetManifest || config?.widgetManifest;

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
