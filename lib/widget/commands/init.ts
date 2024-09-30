import type { Command } from "commander";
import { runInitWidget } from "../scripts/init/init.js";

export const registerWidgetInitCommand = (widgetCommand: Command) => {
  const widgetInitCommand = widgetCommand.command("init <project-directory>");

  widgetInitCommand
    .description("Инициализация проекта виджета")
    .action((dirName: string) => {
      runInitWidget(dirName);
    });
};
