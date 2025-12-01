import type { Command } from "commander";
import { packageJson } from "./utils.js";
import { registerWidgetCommands } from "./widget/index.js";
import { registerIntegrationCommands } from "./integration/index.js";
import { registerApplicationCommands } from "./application/index.js";

export const registerCommands = (cli: Command) => {
  cli.helpOption("-h", "отображает помощь по командам");
  cli.name("im-package-cli");
  cli.version(
    packageJson.version,
    "-v, --version",
    "текущая версия библиотеки"
  );

  registerWidgetCommands(cli);

  registerIntegrationCommands(cli);

  registerApplicationCommands(cli);
};
