import type { NodePlopAPI } from "node-plop";
import { actions } from "./actions.js";
import { prompts } from "./prompts.js";

export const generateWidgetGeneratorName = "widget-generate";

export const addCustomGenerators = (basePath: string, plop: NodePlopAPI) => {
  plop.setGenerator(generateWidgetGeneratorName, {
    prompts,
    actions,
  });
};
