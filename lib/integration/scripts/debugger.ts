import { IntegrationExecutor } from "@infomaximum/integration-debugger";
import type { InputDebugIntegrationOptions } from "../commands/debug.js";
import type { IntegrationRCConfig } from "../configs/file.js";
import { generateCommonIntegrationPaths } from "../integrationPaths.js";
import { assertSimple } from "@infomaximum/assert";
import {
  INTEGRATION_CONFIG_RC_EXT,
  INTEGRATION_CONFIG_RC_FILE_NAME,
} from "../const.js";

const runDebug = (
  options: InputDebugIntegrationOptions,
  rcConfig: IntegrationRCConfig | undefined
) => {
  const { debugType, entityKey } = options;

  if (!debugType) {
    return;
  }

  const debuggingConfig = rcConfig?.debugging;

  assertSimple(
    !!debuggingConfig,
    `Не задана конфигурация для отладки в файле: ${INTEGRATION_CONFIG_RC_FILE_NAME}${INTEGRATION_CONFIG_RC_EXT}`
  );

  let executor: IntegrationExecutor | undefined;

  if (debugType === "integration") {
    executor = new IntegrationExecutor(globalThis.integration, {
      type: debugType,
      debuggingConfig,
    });
  } else if (debugType === "entity") {
    if (!entityKey) {
      throw new Error("Не передан entityKey");
    }

    executor = new IntegrationExecutor(globalThis.integration, {
      type: debugType,
      entityKey,
      debuggingConfig,
    });
  }

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

  import(INTEGRATION_PATHS.moduleIndex).then(() => {
    runDebug(options, rcConfig);
  });
};
