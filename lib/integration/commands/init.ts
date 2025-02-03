import type { Command } from "commander";
import { runInitEntityScript } from "../../plopHelpers.js";
import { getInitIntegrationActions } from "../scripts/actions.js";

export const registerIntegrationInitCommand = (integrationCommand: Command) => {
  const widgetInitCommand = integrationCommand.command(
    "init <project-directory>"
  );

  widgetInitCommand
    .description("Инициализация проекта интеграции")
    .action(async (dirName: string) => {
      runInitEntityScript({
        dirName,
        entity: "integration",
        actions: await getInitIntegrationActions(),
      });
    });
};
