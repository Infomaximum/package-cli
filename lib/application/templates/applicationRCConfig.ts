import {
  CUSTOM_PACKAGE_CLI_LIB_NAME,
  DEFAULT_BUILD_DIR_NAME,
  MANIFEST_JSON_FILE_NAME,
} from "../../const.js";
import {
  APPLICATION_DEFAULT_HOST,
  APPLICATION_DEFAULT_PORT,
} from "../const.js";

export const APPLICATION_RC_CONFIG = `\
{
  "$schema": "node_modules/${CUSTOM_PACKAGE_CLI_LIB_NAME}/schemas/applicationConfigSchema.json",
  "entry": "src/index.tsx",
  "applicationManifest": "${MANIFEST_JSON_FILE_NAME}",
  "packageDir": "package",
  "packageManifest": "package/${MANIFEST_JSON_FILE_NAME}",
  "buildDir": "${DEFAULT_BUILD_DIR_NAME}",
  "port": ${+APPLICATION_DEFAULT_PORT},
  "host": "${APPLICATION_DEFAULT_HOST}"
}
`;
