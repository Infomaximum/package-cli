import { WIDGET_SDK_LIB_NAME } from "../../../../const.js";

export const WIDGET_PANEL_TEMPLATE = `\
import {
  type IPanelDescriptionCreator,
  type IGroupSettings,
} from "${WIDGET_SDK_LIB_NAME}";
import type { WidgetSettings } from "definition/settings";

export const createPanelDescription: IPanelDescriptionCreator<
  WidgetSettings,
  IGroupSettings
> = () => ({});
`;
