import type { Command } from "commander";
import { registerWidgetBuildCommand } from "./commands/build.js";
import { registerWidgetStartCommand } from "./commands/start.js";
import { registerWidgetInitCommand } from "./commands/init.js";
import { registerWidgetReleaseCommand } from "./commands/release.js";

export const registerWidgetCommands = (cli: Command) => {
  const widgetCommand = cli.command("widget");

  registerWidgetBuildCommand(widgetCommand);

  registerWidgetStartCommand(widgetCommand);

  registerWidgetInitCommand(widgetCommand);

  registerWidgetReleaseCommand(widgetCommand);
};
