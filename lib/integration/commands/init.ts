import type { Command } from "commander";
import { runInitEntityScript } from "../../plopHelpers.js";
import { runInitFromTemplateSource } from "../../templatePacks/runInitFromTemplateSource.js";
import { resolveTemplateOption } from "../../templatePacks/resolveTemplateOption.js";
import { getInitIntegrationActions } from "../scripts/init.js";

export const registerIntegrationInitCommand = (integrationCommand: Command) => {
  const widgetInitCommand = integrationCommand.command(
    "init <project-directory>"
  );

  widgetInitCommand
    .description("Инициализация проекта интеграции")
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
        entity: "integration",
        actions: await getInitIntegrationActions(),
      });
    });
};
