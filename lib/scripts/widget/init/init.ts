import path from "node:path";
import nodePlop from "node-plop";
import { getInitWidgetGenerator } from "./generators.js";
import { spawnCommand } from "../../../utils.js";

const runInitWidget = async (dirName: string) => {
  const createPath = path.join(process.cwd(), dirName);

  const plop = await nodePlop(undefined, {
    destBasePath: createPath,
    force: false,
  });

  const initGenerator = await getInitWidgetGenerator(createPath, plop);

  const answers = await initGenerator.runPrompts();

  await initGenerator.runActions(answers);

  try {
    await spawnCommand("npm", ["install"], {
      cwd: createPath,
    });
  } catch (error) {
    console.error(error);
  }

  try {
    await spawnCommand("git", ["init"], {
      cwd: createPath,
    });
  } catch (error) {
    console.error(error);
  }
};

export { runInitWidget };
