import { randomUUID } from "node:crypto";
import { capitalizeHelperName } from "../../widget/scripts/init/helpers.js";
import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";

export const PACKAGE_MANIFEST_TEMPLATE = `\
{
  "$schema": "../node_modules/${CUSTOM_PACKAGE_CLI_LIB_NAME}/schemas/packageManifestSchema.json",
  "manifest_version": "1",
  "author": "{{author}}",
  "guid": "${randomUUID()}",
  "type": "{{packageType}}",
  "name": "{{${capitalizeHelperName} packageName}}",
  "systems": [
    {
      "name": "{{packageIconName}}"
    }
  ],
  "description": {
    "ru": "{{${capitalizeHelperName} packageDescription}}",
    "en": "{{${capitalizeHelperName} packageDescription}}"
  },
  "categories": {
    "ru": [
      {
        "name": "Сторонние"
      }
    ],
    "en": [
      {
        "name": "Other"
      }
    ]
  }
}`;
