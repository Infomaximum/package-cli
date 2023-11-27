import path from "node:path";
import nodePlop from "node-plop";
import { addCustomActions } from "./actions.js";
import { addCustomGenerators } from "./generators.js";

export const runInit = async (initPath: string) => {
  const createPath = path.resolve(process.cwd(), initPath);

  const plop = await nodePlop(undefined, {
    destBasePath: createPath,
    force: false,
  });

  addCustomActions(createPath, plop);
  addCustomGenerators(createPath, plop);

  plop.getGeneratorList().forEach(({ name }) => {
    const generator = plop.getGenerator(name);

    generator
      .runPrompts()
      .then((answers) => {
        return generator.runActions(answers);
      })
      .then((result) => {
        console.warn(result);
      });
  });
};
