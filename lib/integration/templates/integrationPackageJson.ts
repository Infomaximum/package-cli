import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import { INTEGRATION_SDK_LIB_NAME } from "../const.js";

export const INTEGRATION_PACKAGE_JSON_TEMPLATE = `\
{
  "name": "template_integration",
  "version": "1.0.0",
  "main": "src/index.ts",
  "scripts": {
    "build": "im-package-cli integration build",
    "build:script": "im-package-cli integration build --type=script --beautify",
    "dev": "im-package-cli integration build --watch --beautify",
    "serve": "im-package-cli integration build --watch --fetchToServer --beautify",
    "lint": "tsc --noEmit && eslint src/ --ext .ts,.tsx --quiet",
    "test": "vitest --run",
    "test:coverage": "vitest --run --coverage",
    "test:ui": "vitest --ui",
    "debug": "node --import tsx ./node_modules/.bin/im-package-cli integration debug"
  },
  "devDependencies": {
    "@babel/plugin-transform-block-scoping": "^7.25.9",
    "@eslint/js": "^9.23.0",
    "${INTEGRATION_SDK_LIB_NAME}": "^{{integrationSdkVersion}}",
    "${CUSTOM_PACKAGE_CLI_LIB_NAME}": "^{{packageCliVersion}}",
    "@types/node": "^0",
    "dotenv": "^16.4.7",
    "eslint": "^9.23.0",
    "globals": "^15.14.0",
    "tsx": "^4.19.3",
    "typescript": "^5.8.2",
    "typescript-eslint": "^8.29.0",
    "vitest": "^3.0.4",
    "@vitest/coverage-v8": "3.0.7",
    "@vitest/ui": "3.0.7"
  }
}
`;
