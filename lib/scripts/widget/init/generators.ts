import type { NodePlopAPI } from "node-plop";
import { getInitWidgetActions } from "./actions.js";
import { prompts } from "./prompts.js";

const generateWidgetGeneratorName = "widget-generate";

const getInitWidgetGenerator = async (basePath: string, plop: NodePlopAPI) => {
  const actions = await getInitWidgetActions(basePath, plop);

  plop.setGenerator(generateWidgetGeneratorName, {
    prompts,
    actions,
  });

  return plop.getGenerator(generateWidgetGeneratorName);
};

export { getInitWidgetGenerator };
