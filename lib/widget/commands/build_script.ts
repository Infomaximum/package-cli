import type { Command } from "commander";
import { getConfigFromFile } from "../configs/file.js";
import {
  configMergeWithOptionsCommon,
  registerCommonOption,
  type InputCommonOptions,
} from "./common.js";
import { runBuildScript } from "../scripts/build_script.js";

export type InputBuildScriptOptions = {
  buildDir?: string;
} & InputCommonOptions;

export type MergedBuildScriptOptions = ReturnType<
  typeof configMergeWithOptionsCommon
>;

export const registerWidgetBuildScriptCommand = (widgetCommand: Command) => {
  const widgetBuildCommand = widgetCommand.command("build-script");

  const config = getConfigFromFile();

  registerCommonOption(widgetBuildCommand);

  widgetBuildCommand
    .description("Выполняет сборку скрипта")
    .option(
      "--build-dir <buildDirPath>",
      "путь до директории в которую будет собран пакет"
    )
    .action((options: InputBuildScriptOptions) =>
      runBuildScript(configMergeWithOptionsCommon(config, options))
    );
};
