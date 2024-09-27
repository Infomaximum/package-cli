import type { Command } from "commander";
import { runReleaseWidget } from "../scripts/release/release.js";
import {
  configMergeWithWidgetManifestOptions,
  registerWidgetManifestOption,
  type InputWidgetManifestOption,
} from "./common.js";
import { getConfigFromFile } from "../configs/file.js";

export type InputReleaseOptions = {
  first: boolean;
  changelog: boolean;
} & InputWidgetManifestOption;

export type MergedReleaseOptions = ReturnType<
  typeof configMergeWithWidgetManifestOptions<InputReleaseOptions>
>;

export const registerWidgetReleaseCommand = (widgetCommand: Command) => {
  const widgetReleaseCommand = widgetCommand.command("release");
  const config = getConfigFromFile();

  registerWidgetManifestOption(widgetReleaseCommand);

  widgetReleaseCommand
    .description("Создание релиза виджета")
    .option(
      "--first",
      "Первый релиз без повышения версии в package.json",
      false
    )
    .option("-c, --changelog", "Генерация changelog", false)
    .action((options: InputReleaseOptions) => {
      runReleaseWidget(configMergeWithWidgetManifestOptions(config, options));
    });
};
