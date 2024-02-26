import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";
import { DEV_POSTFIX } from "../../../../const.js";
import { removeServiceFieldsForDevelopment } from "../../../../utils.js";

type Params = {
  port: string;
  host: string;
};

export const getModifyManifestWidgetPlugin = ({ host, port }: Params) => {
  return new JsonModifyWebpackPlugin({
    matchers: [
      {
        matcher: /^manifest.json$/,
        action: (currentJsonContent) => {
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

          removeServiceFieldsForDevelopment(currentJsonContent);

          return currentJsonContent;
        },
      },
    ],
  });
};
