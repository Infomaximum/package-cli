import { WIDGET_SDK_LIB_NAME } from "../../../const.js";

export const WIDGET_SETTINGS_TEMPLATE = `\
import type {
  IBaseWidgetSettings,
  IFillSettings,
} from "${WIDGET_SDK_LIB_NAME}";

export interface WidgetSettings extends IBaseWidgetSettings {}

export const fillSettings: IFillSettings<WidgetSettings> = (settings) => {};  
`;
