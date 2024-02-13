export const WIDGET_PANEL_TEMPLATE = `\
import {
  type IPanelDescriptionCreator,
  type IGroupSettings,
} from "@infomaximum/custom-widget";
import type { WidgetSettings } from "definition/settings";

export const createPanelDescription: IPanelDescriptionCreator<
  WidgetSettings,
  IGroupSettings
> = () => ({});
`;
