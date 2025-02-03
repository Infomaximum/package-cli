import type { Command } from "commander";
import { registerIntegrationInitCommand } from "./commands/init.js";

export const registerIntegrationCommands = (cli: Command) => {
  const integrationCommand = cli.command("integration");

  registerIntegrationInitCommand(integrationCommand);
};
