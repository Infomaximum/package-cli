export const WIDGET_PACKAGE_JSON_TEMPLATE = `\
{
  "name": "template_widget",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.tsx",
  "scripts": {
    "build": "im-package-cli widget build --entry ./src/index.tsx",
    "start": "im-package-cli widget start --entry ./src/index.tsx",
    "lint": "tsc --noEmit && eslint src/ --ext .ts,.tsx --quiet",
    "test": "jest --passWithNoTests"
  },
  "dependencies": {
    "@infomaximum/custom-widget": "^{{customWidgetVersion}}",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "@babel/core": "7.23.3",
    "@babel/preset-env": "7.23.3",
    "@babel/preset-react": "7.23.3",
    "@babel/preset-typescript": "7.23.3",
    "@infomaximum/package-cli": "^{{packageCliVersion}}",
    "@types/jest": "29.5.10",
    "@types/react": "18.2.39",
    "@types/react-dom": "18.2.17",
    "@typescript-eslint/eslint-plugin": "6.13.0",
    "@typescript-eslint/parser": "6.13.0",
    "eslint": "8.54.0",
    "eslint-plugin-react": "7.33.2",
    "eslint-plugin-react-hooks": "4.6.0",
    "jest": "29.7.0",
    "jest-canvas-mock": "2.5.2",
    "jest-environment-jsdom": "29.7.0",
    "jest-environment-jsdom-global": "4.0.0",
    "prettier": "3.1.0",
    "typescript": "~5.3.2"
  },
  "browserslist": [
    "defaults and supports es6-module"
  ]
}
`;