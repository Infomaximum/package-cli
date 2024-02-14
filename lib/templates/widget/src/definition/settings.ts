export const WIDGET_SETTINGS_TEMPLATE = `\
import type {
  IBaseWidgetSettings,
  IFillSettings,
} from "@infomaximum/custom-widget";

export interface WidgetSettings extends IBaseWidgetSettings {}

export const fillSettings: IFillSettings<WidgetSettings> = (settings) => {};  
`;
