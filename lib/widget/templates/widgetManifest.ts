import { randomUUID } from "node:crypto";
import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import { capitalizeHelperName } from "../../plopHelpers.js";

export const WIDGET_MANIFEST_TEMPLATE = `\
{
  "$schema": "node_modules/${CUSTOM_PACKAGE_CLI_LIB_NAME}/schemas/widgetManifestSchema.json",
  "uuid": "${randomUUID()}",
  "api_version": 1,
  "name": {
    "en": "{{${capitalizeHelperName} packageName}}",
    "ru": "{{${capitalizeHelperName} packageName}}"
  },
  "is_beta": false,
  "default_size": {
    "min_width": 120,
    "min_height": 120
  }
}
`;
