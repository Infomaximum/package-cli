import type { Command } from "commander";
import { runInitEntityScript } from "../../plopHelpers.js";
import { runInitFromTemplateSource } from "../../templatePacks/runInitFromTemplateSource.js";
import { resolveTemplateOption } from "../../templatePacks/resolveTemplateOption.js";
import { getInitWidgetActions } from "../scripts/init/actions.js";

export const registerWidgetInitCommand = (widgetCommand: Command) => {
  const widgetInitCommand = widgetCommand.command("init <project-directory>");

  widgetInitCommand
    .description("Инициализация проекта виджета")
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
        entity: "widget",
        actions: await getInitWidgetActions(),
      });
    });
};
