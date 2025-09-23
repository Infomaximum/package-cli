import type { Actions } from "node-plop";
import type { Answers } from "../../package/scripts/prompts.js";
import {
  INTEGRATION_BABEL_CONFIG,
  INTEGRATION_COMMITLINT_CONFIG,
  INTEGRATION_ENV_EXAMPLE_CONFIG,
  INTEGRATION_ESLINTRC,
  INTEGRATION_GITIGNORE,
  INTEGRATION_HUSKY_COMMITMSG,
  INTEGRATION_HUSKY_PRECOMMIT,
  INTEGRATION_RC_CONFIG,
  INTEGRATION_TSCONFIG_JSON,
  INTEGRATION_VITEST_CONFIG,
  INTEGRATION_VSCODE_EXTENSIONS,
  INTEGRATION_VSCODE_LAUNCH,
  INTEGRATION_VSCODE_SETTINGS,
} from "../templates/integrationConfigs.js";

import { getPackageActions } from "../../package/scripts/actions.js";
import { INTEGRATION_INDEX_TEMPLATE } from "../templates/integrationIndex.js";
import { INTEGRATION_PACKAGE_JSON_TEMPLATE } from "../templates/integrationPackageJson.js";
import { getLatestVersionOfLibrary, packageJson } from "../../utils.js";
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
      path: "src/types/common.d.ts",
      template: "",
    },
    {
      type: "add",
      path: "src/utils/index.ts",
      template: "",
    },
    {
      type: "add",
      path: "src/modules/template.ts",
      template: "",
    },
    {
      type: "add",
      path: "src/connections/base.ts",
      template: "",
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
    {
      type: "add",
      path: ".commitlintrc.json",
      template: INTEGRATION_COMMITLINT_CONFIG,
    },
    {
      type: "add",
      path: ".vscode/launch.json",
      template: INTEGRATION_VSCODE_LAUNCH,
    },
    {
      type: "add",
      path: ".vscode/settings.json",
      template: INTEGRATION_VSCODE_SETTINGS,
    },
    {
      type: "add",
      path: ".vscode/extensions.json",
      template: INTEGRATION_VSCODE_EXTENSIONS,
    },
    {
      type: "add",
      path: ".husky/commit-msg",
      template: INTEGRATION_HUSKY_COMMITMSG,
    },
    {
      type: "add",
      path: ".husky/pre-commit",
      template: INTEGRATION_HUSKY_PRECOMMIT,
    },
  ] satisfies Actions;
};

const getInitIntegrationActions = async () => {
  const [integrationSdkVersion] = await Promise.all([
    getLatestVersionOfLibrary(INTEGRATION_SDK_LIB_NAME),
  ]);

  return (data: Answers) =>
    actions({
      ...data,
      packageCliVersion: packageJson.version,
      integrationSdkVersion,
    });
};

export { getInitIntegrationActions };
