import type { Actions } from "node-plop";
import { getPackageActions } from "../../package/scripts/actions.js";
import {
  APPLICATION_BABEL_CONFIG,
  APPLICATION_GITIGNORE,
  APPLICATION_TSCONFIG_JSON,
} from "../templates/applicationConfigs.js";
import { packageJson } from "../../utils.js";
import type { Answers } from "../../package/scripts/prompts.js";
import { APPLICATION_INDEX_TEMPLATE } from "../templates/src/applicationIndex.js";
import { APPLICATION_CONTENT_TEMPLATE } from "../templates/src/applicationContent.js";
import { APPLICATION_PACKAGE_JSON_TEMPLATE } from "../templates/applicationPackageJson.js";

type ActionData = Answers & {
  packageCliVersion: string;
};

const actions = ({ packageCliVersion }: ActionData) => {
  return [
    ...getPackageActions({ packageType: "application" }),

    //---------------------------------------APPLICATION------------------------------------

    {
      type: "add",
      path: "src/index.tsx",
      template: APPLICATION_INDEX_TEMPLATE,
    },
    {
      type: "add",
      path: "src/Content.tsx",
      template: APPLICATION_CONTENT_TEMPLATE,
    },

    {
      type: "add",
      path: "tsconfig.json",
      template: APPLICATION_TSCONFIG_JSON,
    },
    {
      type: "add",
      path: ".gitignore",
      template: APPLICATION_GITIGNORE,
    },
    {
      type: "add",
      path: "babel.config.js",
      template: APPLICATION_BABEL_CONFIG,
    },
    {
      type: "add",
      path: "package.json",
      template: APPLICATION_PACKAGE_JSON_TEMPLATE,
      data: { packageCliVersion },
    },
  ] satisfies Actions;
};

const getInitApplicationActions = async () => {
  return (data: Answers) =>
    actions({
      ...data,
      packageCliVersion: packageJson.version,
    });
};

export { getInitApplicationActions };
