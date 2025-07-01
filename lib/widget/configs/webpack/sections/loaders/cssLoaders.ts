import path from "path";
import { fileURLToPath } from "url";
import type { Mode } from "../../../../../paths.js";
import { systemRequire } from "../../../../../utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type StyleLoadersParams = {
  mode: Mode;
  uuidWidget?: string;
};

const getCSSLoaders = (uuidWidget: string | undefined) => [
  {
    loader: systemRequire.resolve("style-loader"),
    options: {
      attributes: {
        uuid: uuidWidget || "",
      },
      injectType: "singletonStyleTag",
      insert: uuidWidget
        ? systemRequire.resolve(path.resolve(__dirname, "insertFunction.js"))
        : "head",
    },
  },

  systemRequire.resolve("css-loader"),
  {
    loader: systemRequire.resolve("postcss-loader"),
    options: {
      postcssOptions: {
        plugins: [
          systemRequire.resolve("postcss-preset-env"),
          systemRequire.resolve("autoprefixer"),
        ],
      },
    },
  },
];

export const getStyleLoaders = ({ mode, uuidWidget }: StyleLoadersParams) => {
  const isDevelopment = mode === "development";

  const cssLoaders = getCSSLoaders(uuidWidget);

  return {
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: cssLoaders,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            ...cssLoaders,
            {
              loader: systemRequire.resolve("sass-loader"),
              options: {
                implementation: systemRequire("sass"),
                sassOptions: {
                  fiber: false,
                },
              },
            },
          ],
        },
        {
          test: /\.less$/i,
          use: [
            ...cssLoaders,
            {
              loader: systemRequire.resolve("less-loader"),
              options: {
                sourceMap: isDevelopment,
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
  };
};
