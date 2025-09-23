import { CUSTOM_PACKAGE_CLI_LIB_NAME } from "../../const.js";
import { INTEGRATION_SDK_LIB_NAME } from "../const.js";

export const INTEGRATION_TSCONFIG_JSON = `\
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["ES2024","DOM"],
    "types": ["${INTEGRATION_SDK_LIB_NAME}"],
    "module": "Preserve",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": false
  },
  "include": ["src"]
}
`;

export const INTEGRATION_GITIGNORE = `\
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/dist

#documentation
/docs


# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*

/build
.ultra.cache.json
*.tsbuildinfo
.node-xmlhttprequest-content-*
.node-xmlhttprequest-sync-*
`;

export const INTEGRATION_BABEL_CONFIG = `\
module.exports = {
  sourceType: "unambiguous",
  presets: [],
  plugins: ["@babel/plugin-transform-block-scoping"],
};
`;

export const INTEGRATION_ESLINTRC = `\
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import fp from "eslint-plugin-fp";
import sonarPlugin from "eslint-plugin-sonarjs";
export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,

  [
    {
      ignores: [
        "**/dist/**",
        "**/build/**",
        "**/node_modules/**",
        "**/*.config.js",
        "**/*.config.cjs",
        "**/*.config.mjs",
      ],
      files: ["**/*.ts", "**/*.tsx"],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: {
          project: "./tsconfig.json",
        },
      },
      plugins: {
        "@typescript-eslint": tseslint.plugin,
        fp,
        sonarjs: sonarPlugin,
      },
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/consistent-type-definitions": [
          "error",
          "interface",
        ],
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: ["variable", "function"],
            format: ["camelCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "forbid",
          },

          {
            selector: ["typeLike", "class"],
            format: ["PascalCase"],
          },
          {
            selector: "interface",
            format: ["PascalCase"],
            custom: {
              regex: "^I[A-Z]",
              match: true,
            },
          },
          {
            selector: "typeAlias",
            format: ["PascalCase"],
            custom: {
              regex: "^T[A-Z]",
              match: true,
            },
          },
          {
            selector: "enum",
            format: ["PascalCase"],
            custom: {
              regex: "^E[A-Z]",
              match: true,
            },
          },
          {
            selector: "enumMember",
            format: ["PascalCase"],
          },
          {
            selector: "method",
            format: ["camelCase"],
          },
          {
            selector: "parameter",
            format: ["camelCase"],
            leadingUnderscore: "allow",
          },
        ],
        "@typescript-eslint/prefer-for-of": "error",
        "prefer-const": "error",
        "no-var": "error",
        "prefer-arrow-callback": "error",

        eqeqeq: ["error", "always"],
        yoda: "error",
        "no-lonely-if": "error",
        curly: "error",
        // Ограчичение на количество строк в функции, чтобы поощрять более мелкие, более управляемые функции.
        "max-lines-per-function": [
          "error",
          { max: 100, skipComments: true, skipBlankLines: true },
        ],
        "max-depth": ["error", { max: 3 }],

        "no-param-reassign": ["error", { props: true }],
        //sonarjs правила
        "sonarjs/cognitive-complexity": ["error", 10],
        "sonarjs/no-identical-expressions": "error",
        "sonarjs/no-ignored-return": "error",
        "sonarjs/no-redundant-boolean": "error",
      },
    },
  ]
);
`;

export const INTEGRATION_VITEST_CONFIG = `\
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
        provider:'v8',
      exclude: [
        '**/*.config.*',
        'src/index.ts',
      ],
    },
  },
});
`;

export const INTEGRATION_RC_CONFIG = `\
//@ts-check

require("dotenv").config();

const query = \`
mutation UpdateIntegration($id: Long!, $js_code: String) {
    automation {
        integration {
          update(id: $id, js_code: $js_code) {
              id
          }
        }
    }
}\`;

/**
 *  @type {import("${CUSTOM_PACKAGE_CLI_LIB_NAME}").IntegrationRCConfig}
 */
const config = {
  entry: "src/index.ts",
  fetcher: (integrationCode) => {
    return {
      graphqlUrl: process.env.GRAPHQL_URL,
      apiKey: process.env.API_KEY,
      query,
      variables: {
        id: process.env.INTEGRATION_ID,
        js_code: integrationCode,
      },
    };
  },

  debugging: {
    seriesIterations: 3,
    commonAuthData: {
      BASE_URL: process.env.WEBHOOK_URL
    },
    blocks: {},
    connections: {},
  },
};

module.exports = config;
`;

export const INTEGRATION_ENV_EXAMPLE_CONFIG = `\
INTEGRATION_ID=0
GRAPHQL_URL=https://example.com/graphql
API_KEY=123456789qwertyuiop
WEBHOOK_URL=https://example.com/webhook
`;

const splitLibName = CUSTOM_PACKAGE_CLI_LIB_NAME.split("/");

export const INTEGRATION_VSCODE_LAUNCH = `\
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Integration",
      "skipFiles": ["<node_internals>/**"],
 
      "runtimeArgs": ["--preserve-symlinks", "--import", "tsx"],
      "program": "\${workspaceFolder}\${pathSeparator}node_modules\${pathSeparator}${splitLibName.at(0)}\${pathSeparator}${splitLibName.at(1)}\${pathSeparator}dist\${pathSeparator}index.js",
      "args": ["integration", "debug"],
      "sourceMaps": true,
      "resolveSourceMapLocations": [
        "\${workspaceFolder}/**",
        "!**/node_modules/**"
      ],
      "smartStep": true,
      "internalConsoleOptions": "openOnSessionStart"
    }
  ]
}
`;

export const INTEGRATION_VSCODE_SETTINGS = `\
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "integration-debugger.isEnabled": true,
  "integration-debugger.debugConfigurationName": "Debug Integration",
  "integration-debugger.functionNames": {
      "single": ["executePagination", "execute"],
      "series": ["executePagination"]
    }
}
`;

export const INTEGRATION_VSCODE_EXTENSIONS = `\
{
  "recommendations": ["Jokerok.integration-debugger"]
}
`;

export const INTEGRATION_HUSKY_PRECOMMIT = `\
yarn lint
`;

export const INTEGRATION_HUSKY_COMMITMSG = `\
yarn commitlint --edit $1
`;

export const INTEGRATION_COMMITLINT_CONFIG = `\
{
  "extends": ["@commitlint/config-conventional"]
}
`;
