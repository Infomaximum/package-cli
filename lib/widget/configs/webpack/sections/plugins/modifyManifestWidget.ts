import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";
import { DEV_POSTFIX } from "../../../../../const.js";
import { removeServiceFieldsForDevelopment } from "../../../../../utils.js";
import type { WidgetPaths } from "../../../../widgetPaths.js";
import {
  WIDGET_OUTPUT_FILE_NAME,
  WIDGET_OUTPUT_FULL_FILE_NAME,
  WIDGET_SDK_VERSION_FIELD_NAME,
} from "../../../../const.js";
import { getSdkVersionFromPackageJson } from "../../../../utils.js";

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
        action: (currentJsonContent, assetNames) => {
          const manifestEntry = currentJsonContent.entry;

          if (isBuildDevMode && host && port) {
            currentJsonContent.entry = `http://${host}:${port}/${
              manifestEntry ?? WIDGET_OUTPUT_FULL_FILE_NAME
            }`;

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
          } else if (!manifestEntry) {
            const entryName = assetNames.find((asset) =>
              asset.startsWith(`${WIDGET_OUTPUT_FILE_NAME}.`),
            );

            if (entryName) {
              currentJsonContent.entry = entryName;
            }
          }

          const sdkVersion = getSdkVersionFromPackageJson(
            WIDGET_PATHS.appPackageJson,
          );

          currentJsonContent[WIDGET_SDK_VERSION_FIELD_NAME] = sdkVersion;

          /** @deprecated удалить после 04.06.2024 */
          currentJsonContent["api_version"] = sdkVersion;

          removeServiceFieldsForDevelopment(currentJsonContent);

          return currentJsonContent;
        },
      },
    ],
  });
};
