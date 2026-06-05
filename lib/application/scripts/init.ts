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
import { APPLICATION_APP_TEMPLATE } from "../templates/src/applicationApp.js";
import { APPLICATION_PLATFORM_ROUTER_TEMPLATE } from "../templates/src/applicationPlatformRouter.js";
import { APPLICATION_HOME_PAGE_TEMPLATE } from "../templates/src/applicationHomePage.js";
import { APPLICATION_SRC_README_TEMPLATE } from "../templates/src/applicationSrcReadme.js";
import { APPLICATION_PACKAGE_JSON_TEMPLATE } from "../templates/applicationPackageJson.js";
import { APPLICATION_MANIFEST_TEMPLATE } from "../templates/applicationManifest.js";
import { APPLICATION_AGENT_MD_TEMPLATE } from "../templates/applicationAgentMd.js";
import { APPLICATION_RC_CONFIG } from "../templates/applicationRCConfig.js";
import { APPLICATION_CONFIG_FILE_NAME } from "../const.js";

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
      path: "src/App.tsx",
      template: APPLICATION_APP_TEMPLATE,
    },
    {
      type: "add",
      path: "src/PlatformRouter.tsx",
      template: APPLICATION_PLATFORM_ROUTER_TEMPLATE,
    },
    {
      type: "add",
      path: "src/pages/HomePage.tsx",
      template: APPLICATION_HOME_PAGE_TEMPLATE,
    },
    {
      type: "add",
      path: "src/README.md",
      template: APPLICATION_SRC_README_TEMPLATE,
    },
    {
      type: "add",
      path: "AGENT.md",
      template: APPLICATION_AGENT_MD_TEMPLATE,
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
    {
      type: "add",
      path: "manifest.json",
      template: APPLICATION_MANIFEST_TEMPLATE,
    },
    {
      type: "add",
      path: `${APPLICATION_CONFIG_FILE_NAME}.json`,
      template: APPLICATION_RC_CONFIG,
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
