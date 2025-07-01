/// <reference types="@infomaximum/widget-sdk" />

type Window = {
  im: Infomaximum;
};

function insert(element: HTMLStyleElement) {
  //@ts-expect-error
  const w = window as Window;

  var injectStyleToTarget =
    //@ts-expect-error
    w && w.im && w.im.widget && w.im.widget.injectStyleToTarget;

  if (typeof injectStyleToTarget === "function") {
    injectStyleToTarget(element);
  } else {
    //@ts-expect-error
    document.head.appendChild(el);
  }
}

export default insert;
