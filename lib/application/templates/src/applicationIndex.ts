import { MANIFEST_JSON_FILE_NAME } from "../../../const.js";
import { APPLICATION_SDK_LIB_NAME } from "../../const.js";

export const APPLICATION_INDEX_TEMPLATE = `\
import { Root, createRoot } from "react-dom/client";
import Content from "./App";
import { IApplication } from "${APPLICATION_SDK_LIB_NAME}";
import manifest from "../${MANIFEST_JSON_FILE_NAME}";

class Application implements IApplication {
  public root: Root | null = null;

  public initialize(container: HTMLElement) {
    this.root = createRoot(container);
  }

  public mount(container: HTMLElement, props: Record<string, any>) {
    this.render(props);
  }

  public update(container: HTMLElement, props: Record<string, any>) {
    this.render(props);
  }

  public unmount() {
    this.root?.unmount();
  }

  private render(props: Record<string, any>) {
    this.root?.render(<Content {...props} />);
  }
}

window.im.defineApplication(manifest.uuid, Application);
`;
