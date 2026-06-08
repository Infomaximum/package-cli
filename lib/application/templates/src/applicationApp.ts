import { APPLICATION_SDK_LIB_NAME } from "../../const.js";

/**
 * Шаблон src/App.tsx — точка настройки для пользователя.
 * Здесь описываются маршруты приложения, навигация уже настроена через PlatformRouter.
 */
export const APPLICATION_APP_TEMPLATE = `\
import type { FC } from "react";
import { Route, Routes } from "react-router";
import type { IApplicationProps } from "${APPLICATION_SDK_LIB_NAME}";
import { PlatformRouter } from "./PlatformRouter";
import HomePage from "./pages/HomePage";

const App: FC<IApplicationProps> = ({ appRouter }) => (
  <PlatformRouter appRouter={appRouter}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Добавляйте свои маршруты здесь */}
    </Routes>
  </PlatformRouter>
);

export default App;
`;
