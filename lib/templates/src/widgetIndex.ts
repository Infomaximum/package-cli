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
import manifest from "../manifest.json";

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
        <div>Custom Component</div>
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