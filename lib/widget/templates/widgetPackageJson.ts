import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import { WIDGET_SDK_LIB_NAME } from "../const.js";

export const WIDGET_PACKAGE_JSON_TEMPLATE = `\
{
  "name": "template_widget",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.tsx",
  "scripts": {
    "build": "im-package-cli widget build",
    "build:dev": "im-package-cli widget build --dev",
    "start": "im-package-cli widget start",
    "lint": "tsc --noEmit && eslint src/ --ext .ts,.tsx --quiet",
    "test": "jest --passWithNoTests"
  },
  "dependencies": {
    "${WIDGET_SDK_LIB_NAME}": "{{widgetSDKVersion}}",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@babel/core": "7.25.2",
    "@babel/preset-env": "7.25.4",
    "@babel/preset-react": "7.24.7",
    "@babel/preset-typescript": "7.24.7",
    "${CUSTOM_PACKAGE_CLI_LIB_NAME}": "^{{packageCliVersion}}",
    "@types/jest": "29.5.11",
    "@types/react": "18.3.4",
    "@types/react-dom": "18.3.0",
    "@typescript-eslint/eslint-plugin": "8.3.0",
    "@typescript-eslint/parser": "8.3.0",
    "eslint": "8.57.0",
    "eslint-plugin-react": "7.35.0",
    "eslint-plugin-react-hooks": "4.6.2",
    "jest": "29.7.0",
    "jest-canvas-mock": "2.5.2",
    "jest-environment-jsdom": "29.7.0",
    "jest-environment-jsdom-global": "4.0.0",
    "prettier": "3.1.1",
    "typescript": "5.5.4"
  },
  "browserslist": [
    "defaults and supports es6-module"
  ]
}
`;
