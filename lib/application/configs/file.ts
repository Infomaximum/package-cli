import { rcFile } from "rc-config-loader";
import {
  APPLICATION_CONFIG_FIELD_NAME,
  APPLICATION_CONFIG_FILE_NAME,
} from "../const.js";

export type ApplicationRCConfig = {
  entry: string;
  applicationManifest: string;
  packageManifest: string;
  packageDir: string;
  buildDir: string;
  port: number;
  host: string;
};

export const getApplicationConfigFromFile = () => {
  const config = rcFile<ApplicationRCConfig>(APPLICATION_CONFIG_FILE_NAME, {
    cwd: process.cwd(),
    packageJSON: { fieldName: APPLICATION_CONFIG_FIELD_NAME },
    configFileName: APPLICATION_CONFIG_FILE_NAME,
  })?.config;

  return config;
};
