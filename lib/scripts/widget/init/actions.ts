import type { Actions, CustomActionConfig, NodePlopAPI } from "node-plop";
import path from "node:path";
import { getLatestVersionOfLibrary, writeFile } from "../../../utils.js";
import { PACKAGE_MANIFEST_TEMPLATE } from "../../../templates/package/packageManifest.js";
import { PACKAGE_ICON_TEMPLATE } from "../../../templates/package/packageIcon.js";
import type { Answers } from "./prompts.js";
import { WIDGET_MANIFEST_TEMPLATE } from "../../../templates/widget/widgetManifest.js";
import {
  WIDGET_BABEL_CONFIG,
  WIDGET_ESLINTIGNORE,
  WIDGET_ESLINTRC,
  WIDGET_GITIGNORE,
  WIDGET_JEST_CONFIG,
  WIDGET_TSCONFIG_JSON,
} from "../../../templates/widget/widgetConfigs.js";
import { WIDGET_INDEX_TEMPLATE } from "../../../templates/widget/src/widgetIndex.js";
import { APP_D_TS_TEMPLATE } from "../../../templates/widget/src/widgetAppDTs.js";
import { WIDGET_INDEX_CSS_TEMPLATE } from "../../../templates/widget/src/widgetIndexCSS.js";
import { WIDGET_PACKAGE_JSON_TEMPLATE } from "../../../templates/widget/widgetPackageJson.js";

type ActionData = Answers & {
  packageCliVersion: string;
  customWidgetVersion: string;
};

const addIconActionName = "addIcon";

const addInitActions = (basePath: string, plop: NodePlopAPI) => {
  plop.setActionType(addIconActionName, async function (answers, config, plop) {
    try {
      await writeFile(path.resolve(basePath, config.path), config.template, {
        encoding: "base64",
      });

      return config.path;
    } catch (error) {
      throw error;
    }
  });
};

const actions = ({ customWidgetVersion, packageCliVersion }: ActionData) => {
  const packageIconName = "Widget";

  return [
    {
      type: "add",
      path: "package/manifest.json",
      template: PACKAGE_MANIFEST_TEMPLATE,
      data: {
        packageIconName,
        packageType: "widget",
      },
    },
    {
      type: addIconActionName,
      path: `package/resources/${packageIconName}.png`,
      template: PACKAGE_ICON_TEMPLATE,
    } as CustomActionConfig<typeof addIconActionName>,
    {
      type: "add",
      path: "manifest.json",
      template: WIDGET_MANIFEST_TEMPLATE,
    },
    {
      type: "add",
      path: "src/index.tsx",
      template: WIDGET_INDEX_TEMPLATE,
    },
    {
      type: "add",
      path: "src/app.d.ts",
      template: APP_D_TS_TEMPLATE,
    },
    {
      type: "add",
      path: "src/index.css",
      template: WIDGET_INDEX_CSS_TEMPLATE,
    },
    {
      type: "add",
      path: "tsconfig.json",
      template: WIDGET_TSCONFIG_JSON,
    },
    {
      type: "add",
      path: "babel.config.js",
      template: WIDGET_BABEL_CONFIG,
    },
    {
      type: "add",
      path: ".gitignore",
      template: WIDGET_GITIGNORE,
    },
    {
      type: "add",
      path: ".eslintignore",
      template: WIDGET_ESLINTIGNORE,
    },
    {
      type: "add",
      path: ".eslintrc",
      template: WIDGET_ESLINTRC,
    },
    {
      type: "add",
      path: "jest.config.js",
      template: WIDGET_JEST_CONFIG,
    },
    {
      type: "add",
      path: "package.json",
      template: WIDGET_PACKAGE_JSON_TEMPLATE,
      data: { customWidgetVersion, packageCliVersion },
    },
  ] satisfies Actions;
};

const getInitWidgetActions = async (basePath: string, plop: NodePlopAPI) => {
  addInitActions(basePath, plop);

  const [packageCliVersion, customWidgetVersion] = await Promise.all([
    getLatestVersionOfLibrary("@infomaximum/package-cli"),
    getLatestVersionOfLibrary("@infomaximum/custom-widget"),
  ]);

  return (data: Answers) =>
    actions({
      ...data,
      packageCliVersion,
      customWidgetVersion,
    });
};

export { getInitWidgetActions };
