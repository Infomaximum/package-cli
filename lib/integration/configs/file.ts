import { rcFile } from "rc-config-loader";
import {
  INTEGRATION_CONFIG_RC_EXT,
  INTEGRATION_CONFIG_RC_FILE_NAME,
} from "../const.js";

export type IntegrationFetcher = (
  integrationCode: string
) => IntegrationFetcherReturnType;

export type IntegrationFetcherReturnType = {
  graphqlUrl: string;
  apiKey: string;
  query: string;
  headers?: Record<string, any>;
  variables: Record<string, any>;
};

export type IntegrationRCConfig = {
  entry: string;
  fetcher?: IntegrationFetcher;
};

export const getConfigIntegrationFromFile = () => {
  const config = rcFile<IntegrationRCConfig>(INTEGRATION_CONFIG_RC_FILE_NAME, {
    cwd: process.cwd(),
    packageJSON: false,
    configFileName: INTEGRATION_CONFIG_RC_FILE_NAME,
    defaultExtension: INTEGRATION_CONFIG_RC_EXT,
  })?.config;

  return config;
};
