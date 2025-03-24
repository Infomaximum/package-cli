import type { Command } from "commander";
import type { IntegrationRCConfig } from "../configs/file.js";
import chalk from "chalk";
import { assertSimple } from "@infomaximum/assert";

export type CommonIntegrationOptions = {
  entry: string;
};

export const registerCommonIntegrationOptions = (command: Command) => {
  command.option("--entry <path>", "путь до entrypoint");
};

export function mergeConfigIntegrationWithOptionsCommon(
  config: IntegrationRCConfig | undefined,
  options: CommonIntegrationOptions
) {
  const entry = options.entry || config?.entry;

  assertSimple(!!entry, chalk.red("В конфигурации не задан entry"));

  return {
    entry,
  };
}
