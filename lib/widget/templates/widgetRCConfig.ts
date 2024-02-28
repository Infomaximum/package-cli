export const WIDGET_RC_CONFIG = `\
{
  "$schema": "node_modules/@infomaximum/package-cli/schemas/widgetConfigSchema.json",
  "entry": "src/index.tsx",
  "widgetManifest": "manifest.json",
  "packageManifest": "package/manifest.json",
  "packageDir": "package",
  "assetsDir": "_resources",
  "buildDir": "build",
  "port": 5555,
  "host": "localhost"
}
`;
