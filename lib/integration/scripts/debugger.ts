import { IntegrationExecutor } from "@infomaximum/integration-debugger";
import type { InputDebugIntegrationOptions } from "../commands/debug.js";
import type { IntegrationRCConfig } from "../configs/file.js";
import { generateCommonIntegrationPaths } from "../integrationPaths.js";
import { assertSimple } from "@infomaximum/assert";
import {
  INTEGRATION_CONFIG_RC_EXT,
  INTEGRATION_CONFIG_RC_FILE_NAME,
} from "../const.js";
import { systemRequire } from "../../utils.js";

const runDebug = (
  options: InputDebugIntegrationOptions,
  rcConfig: IntegrationRCConfig | undefined
) => {
  const { entityKey, series, isGenerateSchema } = options;

  const debuggingConfig = rcConfig?.debugging;

  assertSimple(
    !!debuggingConfig,
    `Не задана конфигурация для отладки в файле: ${INTEGRATION_CONFIG_RC_FILE_NAME}${INTEGRATION_CONFIG_RC_EXT}`
  );

  const executor = new IntegrationExecutor(globalThis.integration, {
    entityKey,
    debuggingConfig,
    series,
    isGenerateSchema,
  });

  try {
    executor?.execute();
  } catch (error) {
    console.error("Integration execution failed:", error);
  }
};

export const runDebugIntegration = async (
  options: InputDebugIntegrationOptions,
  rcConfig: IntegrationRCConfig | undefined
) => {
  const { entry } = options;

  const INTEGRATION_PATHS = generateCommonIntegrationPaths({
    entry,
  });

  globalThis.integration = globalThis.integration || {};

  systemRequire(INTEGRATION_PATHS.moduleIndex);

  runDebug(options, rcConfig);
};
