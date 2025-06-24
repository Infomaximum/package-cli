import { rcFile } from "rc-config-loader";
import { WIDGET_CONFIG_FILE_NAME, WIDGET_CONFIG_FIELD_NAME } from "../const.js";
import type { SystemWidgetExternals } from "@infomaximum/widget-sdk";

export type WidgetRCConfig = {
  entry: string;
  widgetManifest: string;
  packageManifest: string;
  packageDir: string;
  assetsDir: string;
  buildDir: string;
  port: number;
  host: string;
  /**
   * исключает указанные зависимости из сборки, предполагая их наличие в окружении.
   * Не работает в режиме сборки пакета
   * @link (https://webpack.js.org/configuration/externals/)
   */
  externalsLib?: Partial<SystemWidgetExternals>;
};

export const getConfigFromFile = () => {
  const config = rcFile<WidgetRCConfig>(WIDGET_CONFIG_FILE_NAME, {
    cwd: process.cwd(),
    packageJSON: { fieldName: WIDGET_CONFIG_FIELD_NAME },
    configFileName: WIDGET_CONFIG_FILE_NAME,
  })?.config;

  return config;
};
