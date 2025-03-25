import { Option, type Command } from "commander";
import { runDebugIntegration } from "../scripts/debugger.js";
import { getConfigIntegrationFromFile } from "../configs/file.js";
import {
  mergeConfigIntegrationWithOptionsCommon,
  registerCommonIntegrationOptions,
  type CommonIntegrationOptions,
} from "./common.js";

export type DebugType = "integration" | "entity";

export type InputDebugIntegrationOptions = {
  entityKey?: string;
  debugType: DebugType;
} & CommonIntegrationOptions;

export const registerIntegrationDebugCommand = (
  integrationCommand: Command
) => {
  const widgetDebugCommand = integrationCommand.command("debug");

  registerCommonIntegrationOptions(widgetDebugCommand);

  widgetDebugCommand
    .description("Отладка проекта интеграции")
    .option(
      "--entityKey <key>",
      "Ключ сущности для которой запускается отладка"
    )
    .addOption(
      new Option("--debugType <type>", "тип отладки").choices([
        "integration",
        "entity",
      ])
    )
    .action((options: InputDebugIntegrationOptions) => {
      const config = getConfigIntegrationFromFile();

      const mergedOptions = mergeConfigIntegrationWithOptionsCommon(
        config,
        options
      );

      runDebugIntegration({ ...options, ...mergedOptions }, config);
    });
};
