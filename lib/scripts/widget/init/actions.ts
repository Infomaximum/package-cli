import type { NodePlopAPI } from "node-plop";
import path from "node:path";
import { capitalizeFirstLetter, writeFile } from "../../../utils.js";
import { PACKAGE_MANIFEST_TEMPLATE } from "../../../templates/packageManifest.js";
import { WIDGET_ICON_TEMPLATE } from "../../../templates/widgetIcon.js";
import type { Answers } from "./prompts.js";
import { WIDGET_MANIFEST_TEMPLATE } from "../../../templates/widgetManifest.js";

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

const actions = (data: Answers) => {
  const { packageName, author, widgetName } = data;

  const capitalizePackageName = capitalizeFirstLetter(packageName || "test");
  const capitalizeWidgetName = capitalizeFirstLetter(widgetName || "test");

  return [
    {
      type: "add",
      path: "package/manifest.json",
      template: PACKAGE_MANIFEST_TEMPLATE,
      data: {
        capitalizePackageName,
        author,
      },
    },
    {
      type: addIconActionName,
      path: "package/resources/Widget.png",
      template: WIDGET_ICON_TEMPLATE,
    },
    {
      type: "add",
      path: "manifest.json",
      template: WIDGET_MANIFEST_TEMPLATE,
      data: {
        capitalizeWidgetName,
      },
    },
  ];
};

const getInitWidgetActions = (basePath: string, plop: NodePlopAPI) => {
  addInitActions(basePath, plop);

  return actions;
};

export { getInitWidgetActions };
