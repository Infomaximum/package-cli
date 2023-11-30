import type { NodePlopAPI } from "node-plop";
import { capitalizeFirstLetter } from "../../../utils.js";

const capitalizeHelperName = "capitalize";

const addHelpers = (plop: NodePlopAPI) => {
  plop.setHelper(capitalizeHelperName, capitalizeFirstLetter);
};

export { capitalizeHelperName, addHelpers };
