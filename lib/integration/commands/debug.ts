import { Option, type Command } from "commander";
import { runDebugIntegration } from "../scripts/debugger.js";
import { getConfigIntegrationFromFile } from "../configs/file.js";
import {
  mergeConfigIntegrationWithOptionsCommon,
  registerCommonIntegrationOptions,
  type CommonIntegrationOptions,
} from "./common.js";

export type DebugType = "integration" | "block";

export type InputDebugIntegrationOptions = {
  blockId?: string;
  debugType: DebugType;
} & CommonIntegrationOptions;

export const registerIntegrationDebugCommand = (
  integrationCommand: Command
) => {
  const widgetDebugCommand = integrationCommand.command("debug");

  registerCommonIntegrationOptions(widgetDebugCommand);

  widgetDebugCommand
    .description("Отладка проекта интеграции")
    .option("--blockId <key>", "Ключ блока для которого запускается отладка")
    .addOption(
      new Option("--debugType <type>", "тип отладки").choices([
        "integration",
        "block",
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
