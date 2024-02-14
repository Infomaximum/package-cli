export const WIDGET_DEFINITION_TEMPLATE = `\
import type {
  IDefinition,
  IFillSettings,
  IGroupSettings,
  IPanelDescriptionCreator,
  IWidgetDimension,
  IWidgetDimensionHierarchy,
  IWidgetMeasure,
} from "@infomaximum/custom-widget";
import { fillSettings, type WidgetSettings } from "definition/settings";
import { createPanelDescription } from "definition/panel";

export class Definition implements IDefinition<WidgetSettings, IGroupSettings> {
  public createPanelDescription: IPanelDescriptionCreator<
    WidgetSettings,
    IGroupSettings
  > = createPanelDescription;

  public fillSettings: IFillSettings<WidgetSettings> = fillSettings;

  public getDimensions(
    settings: WidgetSettings
  ): (IWidgetDimension | IWidgetDimensionHierarchy)[] {
    return [];
  }

  public getMeasures(settings: WidgetSettings): IWidgetMeasure[] {
    return [];
  }
}
`;
