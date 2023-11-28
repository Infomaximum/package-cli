import path from "node:path";
import nodePlop from "node-plop";
import { getInitWidgetGenerator } from "./generators.js";

const runInitWidget = async (initPath: string) => {
  const createPath = path.resolve(process.cwd(), initPath);

  const plop = await nodePlop(undefined, {
    destBasePath: createPath,
    force: false,
  });

  const initGenerator = getInitWidgetGenerator(createPath, plop);

  initGenerator
    .runPrompts()
    .then((answers) => {
      return initGenerator.runActions(answers);
    })
    .then((result) => {
      console.warn(result);
    });
};

export { runInitWidget };
