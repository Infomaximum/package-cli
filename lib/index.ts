#!/usr/bin/env node

import { registerCommands } from "./arguments.js";
import * as commander from "commander";

const cli = new commander.Command();

process.title = "im-package-cli";

registerCommands(cli);

cli.parse(process.argv);
