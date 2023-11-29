import { randomUUID } from "node:crypto";
import { capitalizeHelperName } from "../../scripts/widget/init/helpers.js";

export const WIDGET_MANIFEST_TEMPLATE = `\
{
  "uuid": "${randomUUID()}",
  "entry": "index.js",
  "api_version": 1,
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
