import type { Command } from "commander";
import { runInitEntityScript } from "../../plopHelpers.js";
import { getInitApplicationActions } from "../scripts/init.js";

export const registerApplicationInitCommand = (applicationCommand: Command) => {
  const applicationInitCommand = applicationCommand.command(
    "init <project-directory>"
  );

  applicationInitCommand
    .description("Инициализация проекта приложения")
    .action(async (dirName: string) => {
      runInitEntityScript({
        dirName,
        entity: "application",
        actions: await getInitApplicationActions(),
      });
    });
};
