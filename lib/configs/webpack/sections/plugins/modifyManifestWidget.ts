import { JsonModifyWebpackPlugin } from "@infomaximum/json-modify-webpack-plugin";

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

          return currentJsonContent;
        },
      },
    ],
  });
};
