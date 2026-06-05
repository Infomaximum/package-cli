import { capitalizeHelperName } from "../../../plopHelpers.js";

/**
 * Шаблон src/pages/HomePage.tsx — минимальный пример страницы с навигацией через <Link>.
 */
export const APPLICATION_HOME_PAGE_TEMPLATE = `\
import type { FC } from "react";
import { Link } from "react-router-dom";

const HomePage: FC = () => (
  <div>
    <h1>Привет из {{${capitalizeHelperName} packageName}}</h1>
    <p>
      Открой <code>src/App.tsx</code>, чтобы добавить маршруты, а страницы создавай
      в <code>src/pages/</code>.
    </p>
    <Link to="/">На главную</Link>
  </div>
);

export default HomePage;
`;
