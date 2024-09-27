import { randomUUID } from "node:crypto";
import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import { capitalizeHelperName } from "../../plopHelpers.js";
import { MIN_SYSTEM_VERSION_MANIFEST_FIELD_NAME } from "../scripts/release/const.js";

export const WIDGET_MANIFEST_TEMPLATE = `\
{
  "$schema": "node_modules/${CUSTOM_PACKAGE_CLI_LIB_NAME}/schemas/widgetManifestSchema.json",
  "uuid": "${randomUUID()}",
  "api_version": 1,
  "${MIN_SYSTEM_VERSION_MANIFEST_FIELD_NAME}": "2408",
  "name": {
    "en": "{{${capitalizeHelperName} packageName}}",
    "ru": "{{${capitalizeHelperName} packageName}}"
  },
  "default_size_percentage": {
    "width": 60,
    "height": 20,
    "min_width": 8,
    "min_height": 4
  }
}
`;
