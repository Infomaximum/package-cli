import path from "node:path";
import nodePlop from "node-plop";
import { getInitWidgetGenerator } from "./generators.js";
import { spawnCommand } from "../../../utils.js";
import type { Answers } from "./prompts.js";

const runInitWidget = async (dirName: string) => {
  const createPath = path.join(process.cwd(), dirName);

  const plop = await nodePlop(undefined, {
    destBasePath: createPath,
    force: false,
  });

  const initGenerator = await getInitWidgetGenerator(createPath, plop);

  const answers = (await initGenerator.runPrompts()) as Answers;

  await initGenerator.runActions(answers);

  const packageManager = answers.packageManager;

  try {
    await spawnCommand(packageManager, ["install"], {
      cwd: createPath,
    });
  } catch (error) {
    console.error(error);
  }

  try {
    await spawnCommand("git", ["init", "-b", "develop"], {
      cwd: createPath,
    });
  } catch (error) {
    console.error(error);
  }
};

export { runInitWidget };
