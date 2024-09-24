import type { Command } from "commander";
import { runReleaseWidget } from "../scripts/release.js";

export const registerWidgetReleaseCommand = (widgetCommand: Command) => {
  const widgetReleaseCommand = widgetCommand.command("release");

  widgetReleaseCommand
    .description("Создание релиза виджета")
    .option("--first", "Первый релиз", false)
    .action(() => {
      runReleaseWidget();
    });
};
