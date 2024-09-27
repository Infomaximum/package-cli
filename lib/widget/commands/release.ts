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
  dryRun: boolean;
  tag: boolean;
  changelog: boolean;
  bump: boolean;
  commit: boolean;
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
    .option("--no-tag", "Не создавать тег", false)
    .option("--no-changelog", "Не создавать changelog", false)
    .option("--no-commit", "Не создавать commit", false)
    .option("--no-bump", "Не увеличивать версию", false)
    .option("--dry-run", "Посмотреть что будет сделано при релизе", false)
    .action((options: InputReleaseOptions) => {
      runReleaseWidget(configMergeWithWidgetManifestOptions(config, options));
    });
};
