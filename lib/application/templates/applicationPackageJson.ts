import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import {
  APPLICATION_SDK_LIB_NAME,
  APPLICATION_SDK_LIB_VERSION,
} from "../const.js";

export const APPLICATION_PACKAGE_JSON_TEMPLATE = `\
{
  "name": "template_application",
  "version": "1.0.0",
  "main": "src/index.tsx",
  "scripts": {
    "build": "im-package-cli application build",
    "build:dev": "im-package-cli widget build --dev",
    "start": "im-package-cli widget start"
  },
   "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "${APPLICATION_SDK_LIB_NAME}": "${APPLICATION_SDK_LIB_VERSION}",
    "${CUSTOM_PACKAGE_CLI_LIB_NAME}": "^{{packageCliVersion}}",
    "@types/react": "18.2.55",
    "@types/react-dom": "18.2.19",
    "prettier": "3.7.3",
    "typescript": "5.9.3"
  },
  "browserslist": [
    "defaults and supports es6-module"
  ]
}
`;
