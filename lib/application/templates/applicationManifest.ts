import { randomUUID } from "node:crypto";
import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import { capitalizeHelperName } from "../../plopHelpers.js";

export const APPLICATION_MANIFEST_TEMPLATE = `\
{
  "$schema": "node_modules/${CUSTOM_PACKAGE_CLI_LIB_NAME}/schemas/applicationManifestSchema.json",
  "uuid": "${randomUUID()}",
  "name": {
    "en": "{{${capitalizeHelperName} packageName}}",
    "ru": "{{${capitalizeHelperName} packageName}}"
  }
}
`;
