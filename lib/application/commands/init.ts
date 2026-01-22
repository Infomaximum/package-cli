import type { Command } from "commander";
import { runInitEntityScript } from "../../plopHelpers.js";
import { runInitFromTemplateSource } from "../../templatePacks/runInitFromTemplateSource.js";
import { resolveTemplateOption } from "../../templatePacks/resolveTemplateOption.js";
import { getInitApplicationActions } from "../scripts/init.js";

export const registerApplicationInitCommand = (applicationCommand: Command) => {
  const applicationInitCommand = applicationCommand.command(
    "init <project-directory>"
  );

  applicationInitCommand
    .description("Инициализация проекта приложения")
    .option("--template <spec>", "Template pack (npm spec or local path)")
    .action(async (dirName: string, command: Command) => {
      const template = (command.opts() as { template?: string }).template;

      if (template) {
        await runInitFromTemplateSource({
          dirName,
          template: await resolveTemplateOption(template),
        });
        return;
      }

      await runInitEntityScript({
        dirName,
        entity: "application",
        actions: await getInitApplicationActions(),
      });
    });
};
