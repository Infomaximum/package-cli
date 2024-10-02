import type { Command } from "commander";
import { runReleaseWidget } from "../scripts/release/release.js";

export type InputReleaseOptions = {
  first: boolean;
  dryRun: boolean;
  skipTag: boolean;
  skipChangelog: boolean;
  skipBump: boolean;
  skipCommit: boolean;
};

export const registerWidgetReleaseCommand = (widgetCommand: Command) => {
  const widgetReleaseCommand = widgetCommand.command("release");

  widgetReleaseCommand
    .description("Создание релиза виджета")
    .option(
      "--first",
      "Первый релиз без повышения версии в package.json",
      false
    )
    .option("--skip-tag", "Не создавать тег", false)
    .option("--skip-changelog", "Не создавать changelog", false)
    .option("--skip-commit", "Не создавать commit", false)
    .option("--skip-bump", "Не увеличивать версию", false)
    .option("--dry-run", "Посмотреть что будет сделано при релизе", false)
    .action((options: InputReleaseOptions) => {
      runReleaseWidget(options);
    });
};
