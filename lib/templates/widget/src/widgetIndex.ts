import { MANIFEST_JSON_FILE_NAME } from "../../../const.js";
import { capitalizeHelperName } from "../../../scripts/widget/init/helpers.js";

export const WIDGET_INDEX_TEMPLATE = `\
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  type IWidget,
  type IPanelDescription,
  type IBaseWidgetSettings,
  type ICustomWidgetProps,
} from "@infomaximum/custom-widget";
import manifest from "../${MANIFEST_JSON_FILE_NAME}";

interface Settings extends IBaseWidgetSettings {}

class CustomWidget implements IWidget<Settings> {
  root: ReactDOM.Root | null = null;

  public initialize(container: HTMLElement) {
    this.root = ReactDOM.createRoot(container);
  }

  public update(container: HTMLElement, props: ICustomWidgetProps<Settings>) {
    this.render(props);
  }

  public mount(container: HTMLElement, props: ICustomWidgetProps<Settings>) {
    this.render(props);
  }

  public unmount() {
    this.root?.unmount();

    this.root = null;
  }

  public render(props: ICustomWidgetProps<Settings>) {
    this.root?.render(
      <React.StrictMode>
        <div>{{ ${capitalizeHelperName} packageName}}</div>
      </React.StrictMode>
    );
  }

  public static createPanelDescription(): IPanelDescription<Settings> {
    return {
      displayRecords: [],
    };
  }

  public static fillSettings() {}

  public static getDimensions() {
    return [];
  }
}

window.im.defineWidget(manifest.uuid, CustomWidget);
`;
