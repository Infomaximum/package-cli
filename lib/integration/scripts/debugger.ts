import { IntegrationExecutor } from "@infomaximum/integration-debugger";
import type { InputDebugIntegrationOptions } from "../commands/debug.js";
import type { IntegrationRCConfig } from "../configs/file.js";
import { generateCommonIntegrationPaths } from "../integrationPaths.js";

const runDebug = (
  options: InputDebugIntegrationOptions,
  rcConfig: IntegrationRCConfig | undefined
) => {
  const { debugType, blockId } = options;

  if (!debugType) {
    return;
  }

  let executor: IntegrationExecutor | undefined;

  if (debugType === "integration") {
    executor = new IntegrationExecutor(globalThis.integration, {
      type: debugType,
    });
  } else if (debugType === "block") {
    if (!blockId) {
      throw new Error("Не передан blockId");
    }

    executor = new IntegrationExecutor(globalThis.integration, {
      type: debugType,
      blockId,
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
