import { APPLICATION_SDK_LIB_NAME } from "../../const.js";

/**
 * Шаблон src/PlatformRouter.tsx — мост между роутером платформы и react-router v6.
 * Генерируется как есть, пользователь его не правит.
 */
export const APPLICATION_PLATFORM_ROUTER_TEMPLATE = `\
import { useMemo, type ReactNode } from "react";
import { NavigationType, Router } from "react-router";
import type { Navigator, To } from "react-router";
import type { IApplicationRouteApi } from "${APPLICATION_SDK_LIB_NAME}";

const toPath = (to: To): string =>
  typeof to === "string"
    ? to
    : \`\${to.pathname ?? "/"}\${to.search ?? ""}\${to.hash ?? ""}\`;

const createPlatformNavigator = (
  navigateApp: IApplicationRouteApi["navigateApp"]
): Navigator => ({
  createHref: (to) => toPath(to),
  push: (to) => navigateApp(toPath(to)),
  replace: (to) => navigateApp(toPath(to), { replace: true }),
  go: (delta) => window.parent.history.go(delta),
});

export interface IPlatformRouterProps {
  appRouter: IApplicationRouteApi;
  children: ReactNode;
}

export const PlatformRouter = ({
  appRouter,
  children,
}: IPlatformRouterProps) => {
  const navigator = useMemo(
    () => createPlatformNavigator(appRouter.navigateApp),
    [appRouter.navigateApp]
  );

  const location = useMemo(
    () => ({
      pathname: appRouter.route || "/",
      search: "",
      hash: "",
      state: null,
      key: "default",
    }),
    [appRouter.route]
  );

  return (
    <Router
      location={location}
      navigator={navigator}
      navigationType={NavigationType.Push}
    >
      {children}
    </Router>
  );
};
`;
