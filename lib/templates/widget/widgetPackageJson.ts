import {
  CUSTOM_PACKAGE_CLI_LIB_NAME,
  WIDGET_SDK_LIB_NAME,
} from "../../const.js";

export const WIDGET_PACKAGE_JSON_TEMPLATE = `\
{
  "name": "template_widget",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.tsx",
  "scripts": {
    "build": "im-package-cli widget build --entry ./src/index.tsx",
    "build:dev": "im-package-cli widget build --port 5555 --host localhost --entry ./src/index.tsx",
    "start": "im-package-cli widget start --port 5555 --host localhost --entry ./src/index.tsx",
    "lint": "tsc --noEmit && eslint src/ --ext .ts,.tsx --quiet",
    "test": "jest --passWithNoTests"
  },
  "dependencies": {
    "${WIDGET_SDK_LIB_NAME}": "{{widgetSDKVersion}}",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@babel/core": "7.23.6",
    "@babel/preset-env": "7.23.6",
    "@babel/preset-react": "7.23.3",
    "@babel/preset-typescript": "7.23.3",
    "${CUSTOM_PACKAGE_CLI_LIB_NAME}": "^{{packageCliVersion}}",
    "@types/jest": "29.5.11",
    "@types/react": "18.2.43",
    "@types/react-dom": "18.2.17",
    "@typescript-eslint/eslint-plugin": "6.14.0",
    "@typescript-eslint/parser": "6.14.0",
    "eslint": "8.55.0",
    "eslint-plugin-react": "7.33.2",
    "eslint-plugin-react-hooks": "4.6.0",
    "jest": "29.7.0",
    "jest-canvas-mock": "2.5.2",
    "jest-environment-jsdom": "29.7.0",
    "jest-environment-jsdom-global": "4.0.0",
    "prettier": "3.1.1",
    "typescript": "~5.3.3"
  },
  "browserslist": [
    "defaults and supports es6-module"
  ]
}
`;
