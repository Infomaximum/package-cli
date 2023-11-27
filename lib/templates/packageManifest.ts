import { randomUUID } from "node:crypto";

export const PACKAGE_MANIFEST_TEMPLATE = `\
{
    "manifest_version": "1",
    "author": "{{author}}",
    "guid": "${randomUUID()}",
    "type": "widget",
    "name": "{{capitalizePackageName}}",
    "systems": [
      {
        "name": "Widget"
      }
    ],
    "description": {
      "ru": "{{packageDescription}}",
      "en": "{{packageDescription}}"
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
