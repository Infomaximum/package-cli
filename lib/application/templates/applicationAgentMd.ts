/**
 * Шаблон AGENT.md в корне сгенерированного приложения.
 * Содержит правила работы с роутингом для ИИ-агентов и разработчиков.
 */
export const APPLICATION_AGENT_MD_TEMPLATE = `\
# AGENT.md

Руководство для агентов и разработчиков по этому приложению Infomaximum. Прочитай
его **перед** тем, как трогать роутинг или жизненный цикл приложения.

## Как это работает

Приложение рендерится в iframe внутри платформы. **URL-адресом управляет платформа**, а
не приложение. Платформа передаёт текущий путь в \`props.appRouter.route\` и при
каждой смене URL (deep-link, back/forward, программная навигация) заново вызывает
\`update(container, props)\`. Приложение просто заново рендерит своё React-дерево с
новыми пропсами — react-router сам подберёт подходящий маршрут. React-root **не**
пересоздаётся.

Источник истины по URL — платформа. Запись в URL идёт **только** через
\`appRouter.navigateApp\`.

### Контракт платформы (\`@infomaximum/application-types\`)

\`\`\`ts
interface IApplicationRouteApi {
  basePath: string;   // корень приложения в URL платформы
  route: string;      // внутренний путь относительно basePath, c ведущим "/"
  navigateApp: (subPath: string, options?: { replace?: boolean }) => void;
}
\`\`\`

## Структура

- \`src/index.tsx\` — bootstrap. \`createRoot\` ровно один раз в \`initialize\`;
  \`mount\` и \`update\` оба вызывают \`render(props)\` (без пересоздания). **Не трогать.**
- \`src/PlatformRouter.tsx\` — мост между \`appRouter\` и react-router v6. **Не трогать.**
- \`src/App.tsx\` — таблица маршрутов. Точка настройки.
- \`src/pages/\` — страницы.

## Как добавить страницу

1. Создай \`src/pages/MyPage.tsx\` с экспортом компонента по умолчанию.
2. Добавь одну строку в \`src/App.tsx\`:
   \`<Route path="/my-page" element={<MyPage />} />\`

## Навигация

- В JSX — \`<Link to="/orders/42">\` из \`react-router-dom\`.
- Программно — \`const navigate = useNavigate()\` из \`react-router\`, затем
  \`navigate("/orders/42")\` или \`navigate("/orders/42", { replace: true })\`.
- Параметры пути — \`useParams<{ id: string }>()\`; query — \`useSearchParams()\`.

## ❌ Категорически нельзя

Это сломает интеграцию с платформой:

- \`BrowserRouter\`, \`HashRouter\`, \`createBrowserRouter\` и любой другой роутер
  кроме \`PlatformRouter\`.
- \`window.history\`, \`history.pushState\` / \`replaceState\`.
- \`window.location\`, \`window.top.*\`, чтение/запись hash или query своего iframe.
- Свой \`useState\`/\`useEffect\` поверх \`window.location\`.
- Прокидывать \`route\`/\`navigateApp\` через свой React Context — это уже делает
  \`<Router>\` внутри \`PlatformRouter\`.
- Пересоздание React-root при смене URL.

Единственное допустимое обращение к window вне приложения — это
\`window.parent.history.go(delta)\` внутри \`PlatformRouter.tsx\` (часть контракта
back/forward). Больше нигде.

## Версии

react-router — **v6** (\`^6.30.0\`), **не v7**. В v6 \`Link\` импортируется из
\`react-router-dom\`, а хуки (\`useNavigate\`, \`useParams\`, \`Route\`, \`Routes\`) —
из \`react-router\`.
`;
