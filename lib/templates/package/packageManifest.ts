import { randomUUID } from "node:crypto";

export const PACKAGE_MANIFEST_TEMPLATE = `\
{
    "manifest_version": "1",
    "author": "{{author}}",
    "guid": "${randomUUID()}",
    "type": "widget",
    "name": "{{sentenceCase packageName}}",
    "systems": [
      {
        "name": "Widget"
      }
    ],
    "description": {
      "ru": "{{sentenceCase packageDescription}}",
      "en": "{{sentenceCase packageDescription}}"
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
