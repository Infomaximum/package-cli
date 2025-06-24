#!/usr/bin/env node

import { registerCommands } from "./arguments.js";
import * as commander from "commander";

const cli = new commander.Command();

process.title = "im-package-cli";

registerCommands(cli);

cli.parse(process.argv);

export type {
  IntegrationRCConfig,
  IntegrationFetcherReturnType,
  IntegrationFetcher,
} from "./integration/configs/file.js";

export type { WidgetRCConfig } from "./widget/configs/file.js";
