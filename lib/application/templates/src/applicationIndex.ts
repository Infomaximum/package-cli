import { MANIFEST_JSON_FILE_NAME } from "../../../const.js";
import { APPLICATION_SDK_LIB_NAME } from "../../const.js";

export const APPLICATION_INDEX_TEMPLATE = `\
import { Root, createRoot } from "react-dom/client";
import {
  type IApplication,
  type IApplicationProps,
} from "${APPLICATION_SDK_LIB_NAME}";
import packageManifest from "../package/${MANIFEST_JSON_FILE_NAME}";
import App from "./App";

class Application implements IApplication {
  public root: Root | null = null;

  public initialize(container: HTMLElement) {
    this.root = createRoot(container);
  }

  public mount(container: HTMLElement, props: IApplicationProps) {
    this.render(props);
  }

  public update(container: HTMLElement, props: IApplicationProps) {
    this.render(props);
  }

  public unmount() {
    this.root?.unmount();
  }

  private render(props: IApplicationProps) {
    this.root?.render(<App {...props} />);
  }
}

window.im.defineApplication(packageManifest.guid, Application);
`;
