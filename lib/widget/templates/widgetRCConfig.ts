import {
  CUSTOM_PACKAGE_CLI_LIB_NAME,
  DEFAULT_BUILD_DIR_NAME,
  MANIFEST_JSON_FILE_NAME,
} from "../../const.js";
import { WIDGET_DEFAULT_HOST, WIDGET_DEFAULT_PORT } from "../const.js";

export const WIDGET_RC_CONFIG = `\
{
  "$schema": "node_modules/${CUSTOM_PACKAGE_CLI_LIB_NAME}/schemas/widgetConfigSchema.json",
  "entry": "src/index.tsx",
  "widgetManifest": "${MANIFEST_JSON_FILE_NAME}",
  "packageDir": "package",
  "packageManifest": "package/${MANIFEST_JSON_FILE_NAME}",
  "assetsDir": "_resources",
  "buildDir": "${DEFAULT_BUILD_DIR_NAME}",
  "port": ${+WIDGET_DEFAULT_PORT},
  "host": "${WIDGET_DEFAULT_HOST}"
}
`;
