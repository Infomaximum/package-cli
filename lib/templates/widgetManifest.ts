import { randomUUID } from "node:crypto";

export const WIDGET_MANIFEST_TEMPLATE = `\
{
    "uuid": "${randomUUID()}",
    "entry": "index.js",
    "api_version": 1,
    "name": {
      "en": "{{capitalizeWidgetName}}",
      "ru": "{{capitalizeWidgetName}}"
    },
    "default_size_percentage": {
      "width": 60,
      "height": 20,
      "min_width": 8,
      "min_height": 4
    }
  }
`;
