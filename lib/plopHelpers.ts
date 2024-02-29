import type { NodePlopAPI } from "node-plop";
import { capitalizeFirstLetter } from "./utils.js";

const capitalizeHelperName = "capitalize";

/** Добавляет кастомный хелпер, у стандартного проблемы с кириллицей */
const addCommonHelpers = (plop: NodePlopAPI) => {
  plop.setHelper(capitalizeHelperName, capitalizeFirstLetter);
};

export { capitalizeHelperName, addCommonHelpers };
