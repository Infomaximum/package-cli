import { Option, type Command } from "commander";
import type { Debugging } from "@infomaximum/integration-sdk";
import { runDebugIntegration } from "../scripts/debugger.js";
import { getConfigIntegrationFromFile } from "../configs/file.js";
import {
  mergeConfigIntegrationWithOptionsCommon,
  registerCommonIntegrationOptions,
  type CommonIntegrationOptions,
} from "./common.js";

export type DebugType = "integration" | "entity";

export type InputDebugIntegrationOptions = Debugging.DebugIntegrationOptions &
  CommonIntegrationOptions;

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
    .option("--series", "Выполняет серию запусков отладки сущности", false)
    .action((options: InputDebugIntegrationOptions) => {
      const config = getConfigIntegrationFromFile();

      const mergedOptions = mergeConfigIntegrationWithOptionsCommon(
        config,
        options
      );

      runDebugIntegration({ ...options, ...mergedOptions }, config);
    });
};
