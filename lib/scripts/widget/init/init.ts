import path from "node:path";
import nodePlop from "node-plop";
import { getInitWidgetGenerator } from "./generators.js";

const runInitWidget = async (initPath: string) => {
  const createPath = path.resolve(process.cwd(), initPath);

  const plop = await nodePlop(undefined, {
    destBasePath: createPath,
    force: false,
  });

  const initGenerator = await getInitWidgetGenerator(createPath, plop);

  const answers = await initGenerator.runPrompts();

  const result = await initGenerator.runActions(answers);

  console.warn(result);
};

export { runInitWidget };
