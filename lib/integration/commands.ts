import type { Command } from "commander";
import { registerIntegrationInitCommand } from "./commands/init.js";
import { registerIntegrationBuildCommand } from "./commands/build.js";
import { registerIntegrationDebugCommand } from "./commands/debug.js";

export const registerIntegrationCommands = (cli: Command) => {
  const integrationCommand = cli.command("integration");

  registerIntegrationInitCommand(integrationCommand);
  registerIntegrationBuildCommand(integrationCommand);
  registerIntegrationDebugCommand(integrationCommand);
};
