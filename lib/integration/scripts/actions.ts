import type { Actions, NodePlopAPI } from "node-plop";
import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import type { Answers } from "../../package/scripts/prompts.js";
import {
  INTEGRATION_ESLINTRC,
  INTEGRATION_GITIGNORE,
  INTEGRATION_TSCONFIG_JSON,
} from "../templates/integrationConfigs.js";

import { getPackageActions } from "../../package/scripts/actions.js";
import { INTEGRATION_INDEX_TEMPLATE } from "../templates/integrationIndex.js";
import { INTEGRATION_PACKAGE_JSON_TEMPLATE } from "../templates/integrationPackageJson.js";
import { getLatestVersionOfLibrary } from "../../utils.js";

type ActionData = Answers & {
  packageCliVersion: string;
};

const actions = ({ packageCliVersion }: ActionData) => {
  return [
    ...getPackageActions({ packageType: "integration" }),

    //---------------------------------------INTEGRATION------------------------------------

    {
      type: "add",
      path: "src/index.ts",
      template: INTEGRATION_INDEX_TEMPLATE,
    },

    {
      type: "add",
      path: "tsconfig.json",
      template: INTEGRATION_TSCONFIG_JSON,
    },
    {
      type: "add",
      path: ".gitignore",
      template: INTEGRATION_GITIGNORE,
    },
    {
      type: "add",
      path: "eslint.config.js",
      template: INTEGRATION_ESLINTRC,
    },
    {
      type: "add",
      path: "package.json",
      template: INTEGRATION_PACKAGE_JSON_TEMPLATE,
      data: { packageCliVersion },
    },
  ] satisfies Actions;
};

const getInitIntegrationActions = async () => {
  const [packageCliVersion] = await Promise.all([
    getLatestVersionOfLibrary(CUSTOM_PACKAGE_CLI_LIB_NAME),
  ]);

  return (data: Answers) =>
    actions({
      ...data,
      packageCliVersion,
    });
};

export { getInitIntegrationActions };
