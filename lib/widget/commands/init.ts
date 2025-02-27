import type { Command } from "commander";
import { runInitEntityScript } from "../../plopHelpers.js";
import { getInitWidgetActions } from "../scripts/init/actions.js";

export const registerWidgetInitCommand = (widgetCommand: Command) => {
  const widgetInitCommand = widgetCommand.command("init <project-directory>");

  widgetInitCommand
    .description("Инициализация проекта виджета")
    .action(async (dirName: string) => {
      runInitEntityScript({
        dirName,
        entity: "widget",
        actions: await getInitWidgetActions(),
      });
    });
};
