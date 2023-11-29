import { randomUUID } from "node:crypto";
import { capitalizeHelperName } from "../../scripts/widget/init/helpers.js";

export const PACKAGE_MANIFEST_TEMPLATE = `\
{
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
  }
  
`;
