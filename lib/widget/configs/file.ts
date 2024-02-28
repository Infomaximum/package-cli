import { rcFile } from "rc-config-loader";
import { WIDGET_CONFIG_FILE_NAME, WIDGET_CONFIG_FIELD_NAME } from "../const.js";

export type WidgetRCConfig = {
  entry: string;
  widgetManifest: string;
  packageManifest: string;
  packageDir: string;
  assetsDir: string;
  buildDir: string;
  port: number;
  host: string;
};

export const getConfigFromFile = () => {
  const config = rcFile<WidgetRCConfig>(WIDGET_CONFIG_FILE_NAME, {
    cwd: process.cwd(),
    packageJSON: { fieldName: WIDGET_CONFIG_FIELD_NAME },
    configFileName: WIDGET_CONFIG_FILE_NAME,
  })?.config;

  return config;
};
