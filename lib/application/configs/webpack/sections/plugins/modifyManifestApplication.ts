import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";
import { DEV_POSTFIX } from "../../../../../const.js";
import { removeServiceFieldsForDevelopment } from "../../../../../utils.js";
import type { ApplicationPaths } from "../../../../applicationPaths.js";
import {
  APPLICATION_OUTPUT_FILE_NAME,
  APPLICATION_OUTPUT_FULL_FILE_NAME,
} from "../../../../const.js";

type Params = {
  port?: string | number;
  host?: string;
  isBuildDevMode: boolean;
  APPLICATION_PATHS: ApplicationPaths;
};

export const getModifyManifestApplicationPlugin = ({
  host,
  port,
  isBuildDevMode,
  APPLICATION_PATHS,
}: Params) => {
  return new JsonModifyWebpackPlugin({
    matchers: [
      {
        matcher: /^manifest.json$/,
        action: (currentJsonContent, assetNames) => {
          const manifestEntry = currentJsonContent.entry;

          if (isBuildDevMode && host && port) {
            currentJsonContent.entry = `http://${host}:${port}/${
              manifestEntry ?? APPLICATION_OUTPUT_FULL_FILE_NAME
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
              asset.startsWith(`${APPLICATION_OUTPUT_FILE_NAME}.`)
            );

            if (entryName) {
              currentJsonContent.entry = entryName;
            }
          }

          removeServiceFieldsForDevelopment(currentJsonContent);

          return currentJsonContent;
        },
      },
    ],
  });
};
