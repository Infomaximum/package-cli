import type { Actions } from "node-plop";
import { getLatestVersionOfLibrary, packageJson } from "../../../utils.js";
import { PACKAGE_MANIFEST_TEMPLATE } from "../../../package/templates/packageManifest.js";
import { PACKAGE_ICON_TEMPLATE } from "../../../package/templates/packageIcon.js";
import type { Answers } from "../../../package/scripts/prompts.js";
import { MANIFEST_JSON_FILE_NAME } from "../../../const.js";
import {
  GET_CHANGELOG_MD,
  GET_DOC_MD,
} from "../../../package/templates/additionalFiles.js";
import { WIDGET_MANIFEST_TEMPLATE } from "../../templates/widgetManifest.js";
import { WIDGET_INDEX_TEMPLATE } from "../../templates/src/widgetIndex.js";
import { APP_D_TS_TEMPLATE } from "../../templates/src/widgetAppDTs.js";
import { WIDGET_INDEX_CSS_TEMPLATE } from "../../templates/src/widgetIndexCSS.js";
import { WIDGET_DEFINITION_TEMPLATE } from "../../templates/src/definition/definition.js";
import { WIDGET_SETTINGS_TEMPLATE } from "../../templates/src/definition/settings.js";
import { WIDGET_PANEL_TEMPLATE } from "../../templates/src/definition/panel.js";
import {
  WIDGET_BABEL_CONFIG,
  WIDGET_ESLINTIGNORE,
  WIDGET_ESLINTRC,
  WIDGET_GITIGNORE,
  WIDGET_JEST_CONFIG,
  WIDGET_TSCONFIG_JSON,
} from "../../templates/widgetConfigs.js";
import { WIDGET_PACKAGE_JSON_TEMPLATE } from "../../templates/widgetPackageJson.js";
import { WIDGET_SDK_LIB_NAME } from "../../const.js";
import { WIDGET_RC_CONFIG } from "../../templates/widgetRCConfig.js";

type ActionData = Answers & {
  packageCliVersion: string;
  widgetSDKVersion: string;
};

const actions = ({ widgetSDKVersion, packageCliVersion }: ActionData) => {
  const packageIconName = "Widget";

  return [
    //---------------------------------------PACKAGE------------------------------------
    {
      type: "add",
      path: `package/${MANIFEST_JSON_FILE_NAME}`,
      template: PACKAGE_MANIFEST_TEMPLATE,
      data: {
        packageIconName,
        packageType: "widget",
      },
    },
    {
      type: "add",
      path: `package/resources/${packageIconName}.svg`,
      template: PACKAGE_ICON_TEMPLATE,
    },
    ...(["ru", "en"] as const).flatMap((language) => [
      {
        type: "add",
        path: `package/${language}/doc.md`,
        template: GET_DOC_MD(language),
      },
      {
        type: "add",
        path: `package/${language}/changelog.md`,
        template: GET_CHANGELOG_MD(language),
      },
    ]),

    //---------------------------------------WIDGET------------------------------------
    {
      type: "add",
      path: MANIFEST_JSON_FILE_NAME,
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
      path: "src/definition/definition.ts",
      template: WIDGET_DEFINITION_TEMPLATE,
    },
    {
      type: "add",
      path: "src/definition/settings.ts",
      template: WIDGET_SETTINGS_TEMPLATE,
    },
    {
      type: "add",
      path: "src/definition/panel.ts",
      template: WIDGET_PANEL_TEMPLATE,
    },

    {
      type: "add",
      path: "widgetrc.js",
      template: WIDGET_RC_CONFIG,
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
      data: { widgetSDKVersion, packageCliVersion },
    },
  ] satisfies Actions;
};

const getInitWidgetActions = async () => {
  const [widgetSDKVersion] = await Promise.all([
    getLatestVersionOfLibrary(WIDGET_SDK_LIB_NAME),
  ]);

  return (data: Answers) =>
    actions({
      ...data,
      widgetSDKVersion,
      packageCliVersion: packageJson.version,
    });
};

export { getInitWidgetActions };
