import { WIDGET_SDK_LIB_NAME } from "../../../../widget/const.js";

export const WIDGET_DEFINITION_TEMPLATE = `\
import type {
  IDefinition,
  IFillSettings,
  IGroupSettings,
  IPanelDescriptionCreator,
} from "${WIDGET_SDK_LIB_NAME}";
import { fillSettings, type WidgetSettings } from "./settings";
import { createPanelDescription } from "./panel";

export class Definition implements IDefinition<WidgetSettings, IGroupSettings> {
  public createPanelDescription: IPanelDescriptionCreator<
    WidgetSettings,
    IGroupSettings
  > = createPanelDescription;

  public fillSettings: IFillSettings<WidgetSettings> = fillSettings;

  public getLocalMigrateVersions(): string[] {
    return [];
  }
}
`;
