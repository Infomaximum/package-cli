import path from "node:path";
import nodePlop from "node-plop";
import type { Actions, NodePlopAPI } from "node-plop";
import { capitalizeFirstLetter, spawnCommand } from "./utils.js";
import { prompts, type Answers } from "./package/scripts/prompts.js";
import type { PackageType } from "./types.js";

const capitalizeHelperName = "capitalize";

/** Добавляет кастомный хелпер, у стандартного проблемы с кириллицей */
const addCommonHelpers = (plop: NodePlopAPI) => {
  plop.setHelper(capitalizeHelperName, capitalizeFirstLetter);
};

export { capitalizeHelperName, addCommonHelpers };

type InitEntityScriptParams = {
  entity: PackageType;
  dirName: string;
  actions: Actions;
};

export const runInitEntityScript = async ({
  entity,
  dirName,
  actions,
}: InitEntityScriptParams) => {
  const createPath = path.join(process.cwd(), dirName);

  const plop = await nodePlop(undefined, {
    destBasePath: createPath,
    force: false,
  });

  addCommonHelpers(plop);

  const generateEntityGeneratorName = `${entity}-generate`;

  plop.setGenerator(generateEntityGeneratorName, {
    prompts,
    actions,
  });

  const initGenerator = plop.getGenerator(generateEntityGeneratorName);

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
