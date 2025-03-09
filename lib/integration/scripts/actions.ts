import type { Actions } from "node-plop";
import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import type { Answers } from "../../package/scripts/prompts.js";
import {
  INTEGRATION_BABEL_CONFIG,
  INTEGRATION_ENV_EXAMPLE_CONFIG,
  INTEGRATION_ESLINTRC,
  INTEGRATION_GITIGNORE,
  INTEGRATION_RC_CONFIG,
  INTEGRATION_TSCONFIG_JSON,
  INTEGRATION_VITEST_CONFIG,
} from "../templates/integrationConfigs.js";

import { getPackageActions } from "../../package/scripts/actions.js";
import { INTEGRATION_INDEX_TEMPLATE } from "../templates/integrationIndex.js";
import { INTEGRATION_PACKAGE_JSON_TEMPLATE } from "../templates/integrationPackageJson.js";
import { getLatestVersionOfLibrary } from "../../utils.js";
import {
  INTEGRATION_CONFIG_RC_FILE_NAME,
  INTEGRATION_CONFIG_RC_EXT,
  INTEGRATION_SDK_LIB_NAME,
} from "../const.js";

type ActionData = Answers & {
  packageCliVersion: string;
  integrationSdkVersion: string;
};

const actions = ({ packageCliVersion, integrationSdkVersion }: ActionData) => {
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
      path: "babel.config.js",
      template: INTEGRATION_BABEL_CONFIG,
    },
    {
      type: "add",
      path: "vitest.config.js",
      template: INTEGRATION_VITEST_CONFIG,
    },
    {
      type: "add",
      path: `${INTEGRATION_CONFIG_RC_FILE_NAME}${INTEGRATION_CONFIG_RC_EXT}`,
      template: INTEGRATION_RC_CONFIG,
    },
    {
      type: "add",
      path: `.env_example`,
      template: INTEGRATION_ENV_EXAMPLE_CONFIG,
    },
    {
      type: "add",
      path: "package.json",
      template: INTEGRATION_PACKAGE_JSON_TEMPLATE,
      data: { packageCliVersion, integrationSdkVersion },
    },
  ] satisfies Actions;
};

const getInitIntegrationActions = async () => {
  const [packageCliVersion, integrationSdkVersion] = await Promise.all([
    getLatestVersionOfLibrary(CUSTOM_PACKAGE_CLI_LIB_NAME),
    getLatestVersionOfLibrary(INTEGRATION_SDK_LIB_NAME),
  ]);

  return (data: Answers) =>
    actions({
      ...data,
      packageCliVersion,
      integrationSdkVersion,
    });
};

export { getInitIntegrationActions };
