export const WIDGET_TSCONFIG_JSON = `\
{
  "compilerOptions": {
    "target": "ES2015",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "incremental": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
`;

export const WIDGET_BABEL_CONFIG = `\
module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
};
`;

export const WIDGET_GITIGNORE = `\
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
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
`;

export const WIDGET_ESLINTIGNORE = `\
node_modules
build
`;

export const WIDGET_ESLINTRC = `\
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react-hooks"],
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    "react/jsx-uses-react": "off", // React 17+
    "react/react-in-jsx-scope": "off", // React 17+
    "react/prop-types": "off",
    "react/no-unknown-property": ["error", { "ignore": ["css"] }],
    "@typescript-eslint/no-explicit-any": "off"
  }
}
`;
export const WIDGET_JEST_CONFIG = `\
/**
 * @type {import("jest").Config}
 */
module.exports = {
  setupFilesAfterEnv: ["jest-canvas-mock"],
  testEnvironment: "jest-environment-jsdom-global",
  moduleDirectories: ["node_modules", "src"],
};
`;
