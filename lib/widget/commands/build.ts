import type { Command } from "commander";
import { getConfigFromFile } from "../configs/file.js";
import {
  configMergeWithOptionsCommon,
  registerCommonOption,
  type InputCommonOptions,
} from "./common.js";
import { runBuild } from "../scripts/build.js";

export type InputBuildOptions = {
  dev: boolean;
  port?: string | number;
  host?: string;
  "build-dir"?: string;
} & InputCommonOptions;

export type MergedBuildOptions = ReturnType<typeof configMergeWithOptionsBuild>;

function configMergeWithOptionsBuild(options: InputBuildOptions) {
  const config = getConfigFromFile();

  return {
    host: options.host || config?.host,
    port: options.port || config?.port,
    dev: options.dev,
    ...configMergeWithOptionsCommon(config, options),
  };
}

export const registerWidgetBuildCommand = (widgetCommand: Command) => {
  const widgetBuildCommand = widgetCommand.command("build");

  registerCommonOption(widgetBuildCommand);

  widgetBuildCommand
    .description("Выполняет сборку пакета")
    .option(
      "--build-dir <buildDirPath>",
      "путь до директории в которую будет собран пакет",
    )
    .option("--dev", "собрать пакет для разработки", false)
    .option("--host <host>", "хост который будет указан в манифесте виджета")
    .option("--port <port>", "порт который будет указан в манифесте виджета")
    .action((options: InputBuildOptions) =>
      runBuild(configMergeWithOptionsBuild(options)),
    );
};
