import { MANIFEST_JSON_FILE_NAME } from "../../../const.js";
import { capitalizeHelperName } from "../../../scripts/widget/init/helpers.js";

export const WIDGET_INDEX_TEMPLATE = `\
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  type IWidget,
  type IPanelDescription,
  type ICustomWidgetProps,
  type IWidgetsContext,
  type IWidgetMeasure,
  type IWidgetDimension,
  type IWidgetDimensionHierarchy,
} from "@infomaximum/custom-widget";
import manifest from "../${MANIFEST_JSON_FILE_NAME}";
import { fillSettings, type WidgetSettings } from "settings";
import { createPanelDescription } from "panel";

class CustomWidget implements IWidget<WidgetSettings> {
  root: ReactDOM.Root | null = null;

  public initialize(container: HTMLElement) {
    this.root = ReactDOM.createRoot(container);
  }

  public update(
    container: HTMLElement,
    props: ICustomWidgetProps<WidgetSettings>
  ) {
    this.render(props);
  }

  public mount(
    container: HTMLElement,
    props: ICustomWidgetProps<WidgetSettings>
  ) {
    this.render(props);
  }

  public unmount() {
    this.root?.unmount();

    this.root = null;
  }

  public render(props: ICustomWidgetProps<WidgetSettings>) {
    this.root?.render(
      <React.StrictMode>
      <div>{{ ${capitalizeHelperName} packageName}}</div>
      </React.StrictMode>
    );
  }

  public static createPanelDescription(
    context: IWidgetsContext,
    settings: WidgetSettings
  ): IPanelDescription<WidgetSettings> {
    return createPanelDescription(context, settings);
  }

  public static fillSettings(
    settings: WidgetSettings,
    context: IWidgetsContext
  ) {
    return fillSettings(settings, context);
  }

  public static getDimensions(
    settings: WidgetSettings
  ): (IWidgetDimension | IWidgetDimensionHierarchy)[] {
    return [];
  }

  public static getMeasures(settings: WidgetSettings): IWidgetMeasure[] {
    return [];
  }
}

window.im.defineWidget(manifest.uuid, CustomWidget);
`;
