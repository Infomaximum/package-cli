import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";
import { DEV_POSTFIX } from "../../../../../const.js";
import { removeServiceFieldsForDevelopment } from "../../../../../utils.js";
import type { WidgetPaths } from "../../../../widgetPaths.js";
import { WIDGET_SDK_VERSION_FIELD_NAME } from "../../../../const.js";
import { getSDKVersionFromPackageJSON } from "../../../../utils.js";

type Params = {
  port?: string | number;
  host?: string;
  isBuildDevMode: boolean;
  WIDGET_PATHS: WidgetPaths;
};

export const getModifyManifestWidgetPlugin = ({
  host,
  port,
  isBuildDevMode,
  WIDGET_PATHS,
}: Params) => {
  return new JsonModifyWebpackPlugin({
    matchers: [
      {
        matcher: /^manifest.json$/,
        action: (currentJsonContent) => {
          if (isBuildDevMode && host && port) {
            currentJsonContent.entry = `http://${host}:${port}/${currentJsonContent.entry}`;

            if (
              currentJsonContent?.name &&
              typeof currentJsonContent.name === "object"
            ) {
              Object.keys(currentJsonContent.name).forEach((lang) => {
                Object.assign(currentJsonContent.name, {
                  [lang]: currentJsonContent.name[lang] + DEV_POSTFIX,
                });
              });
            }
          }

          currentJsonContent[WIDGET_SDK_VERSION_FIELD_NAME] =
            getSDKVersionFromPackageJSON(WIDGET_PATHS.appPackageJson);

          removeServiceFieldsForDevelopment(currentJsonContent);

          return currentJsonContent;
        },
      },
    ],
  });
};
