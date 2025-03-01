import { MANIFEST_JSON_FILE_NAME } from "../../../const.js";
import { capitalizeHelperName } from "../../../plopHelpers.js";
import { WIDGET_SDK_LIB_NAME } from "../../const.js";

export const WIDGET_INDEX_TEMPLATE = `\
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  type IWidget,
  type ICustomWidgetProps,
} from "${WIDGET_SDK_LIB_NAME}";
import manifest from "../${MANIFEST_JSON_FILE_NAME}";
import { type WidgetSettings } from "./definition/settings";
import { Definition } from "./definition/definition";

class CustomWidget implements IWidget<WidgetSettings> {
  public static definition = new Definition();

  private root: ReactDOM.Root | null = null;

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
  }

  private render(props: ICustomWidgetProps<WidgetSettings>) {
    this.root?.render(
      <React.StrictMode>
        <div>{{ ${capitalizeHelperName} packageName}}</div>
      </React.StrictMode>
    );
  }
}

window.im.widget.defineWidget(manifest.uuid, CustomWidget);
`;
