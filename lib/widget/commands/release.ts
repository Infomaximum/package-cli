import type { Command } from "commander";
import { runReleaseWidget } from "../scripts/release.js";

export type InputReleaseOptions = {
  first: boolean;
  changelog: boolean;
};

export const registerWidgetReleaseCommand = (widgetCommand: Command) => {
  const widgetReleaseCommand = widgetCommand.command("release");

  widgetReleaseCommand
    .description("Создание релиза виджета")
    .option("--first", "Первый релиз", false)
    .option("-c, --changelog", "Генерация changelog", false)
    .action((options: InputReleaseOptions) => {
      runReleaseWidget(options);
    });
};
