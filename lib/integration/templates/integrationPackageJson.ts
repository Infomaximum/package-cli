import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import { INTEGRATION_SDK_LIB_NAME } from "../const.js";

export const INTEGRATION_PACKAGE_JSON_TEMPLATE = `\
{
  "name": "template_integration",
  "version": "1.0.0",
  "main": "src/index.ts",
  "scripts": {
    "build": "im-package-cli integration build",
    "build:script": "im-package-cli integration build --type=script",
    "dev": "im-package-cli integration build --watch",
    "lint": "tsc --noEmit && eslint src/ --ext .ts,.tsx --quiet",
    "test": "vitest --run",
    "test:coverage": "vitest --run --coverage",
    "test:ui": "vitest --ui"
  },
  "devDependencies": {
    "@babel/core": "^7.26.9",
    "@babel/preset-env": "^7.26.9",
    "@babel/preset-typescript": "^7.26.0",
    "@eslint/js": "^9.19.0",
    "${INTEGRATION_SDK_LIB_NAME}": "^{{integrationSdkVersion}}",
    "${CUSTOM_PACKAGE_CLI_LIB_NAME}": "^{{packageCliVersion}}",
    "eslint": "^9.19.0",
    "globals": "^15.14.0",
    "typescript": "^5.7.2",
    "typescript-eslint": "^8.22.0",
    "vitest": "^3.0.4",
    "@vitest/coverage-v8": "3.0.7",
    "@vitest/ui": "3.0.7",
  }
}
`;
