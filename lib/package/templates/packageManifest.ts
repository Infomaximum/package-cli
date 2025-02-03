import { randomUUID } from "node:crypto";
import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import { capitalizeHelperName } from "../../plopHelpers.js";

export const PACKAGE_MANIFEST_TEMPLATE = `\
{
  "$schema": "../node_modules/${CUSTOM_PACKAGE_CLI_LIB_NAME}/schemas/packageManifestSchema.json",
  "manifest_version": "2",
  "min_version_platform": "1.0.0.x",
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
