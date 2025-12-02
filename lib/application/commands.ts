import type { Command } from "commander";
import { registerApplicationInitCommand } from "./commands/init.js";
import { registerApplicationBuildCommand } from "./commands/build.js";

export const registerApplicationCommands = (cli: Command) => {
  const applicationCommand = cli.command("application");

  registerApplicationInitCommand(applicationCommand);

  registerApplicationBuildCommand(applicationCommand);
};
