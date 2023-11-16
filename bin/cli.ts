#!/usr/bin/env node

import commander from "commander";
import { registerCommands } from "../lib/arguments";

const cli = new commander.Command();

process.title = "im-package-cli";

registerCommands(cli);

cli.parse(process.argv);
