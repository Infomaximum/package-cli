/**
 * Шаблон src/README.md — короткая инструкция по роутингу для разработчика.
 */
export const APPLICATION_SRC_README_TEMPLATE = `\
# src

Роутинг настроен «из коробки». Подробные правила и ограничения — в \`AGENT.md\` в
корне проекта.

## Добавить страницу

1. Создай файл в \`src/pages/\`, например \`src/pages/OrdersPage.tsx\`.
2. Добавь маршрут в \`src/App.tsx\`:
   \`<Route path="/orders" element={<OrdersPage />} />\`

## Навигация

- В JSX — \`<Link to="/orders">\` из \`react-router-dom\`.
- Программно — \`const navigate = useNavigate()\` из \`react-router\`, затем
  \`navigate("/orders/42")\` или \`navigate("/orders/42", { replace: true })\`.
- Параметры — \`useParams<{ id: string }>()\`, query — \`useSearchParams()\`.

## Нельзя

\`BrowserRouter\`, \`HashRouter\`, \`createBrowserRouter\`, \`window.history\`,
\`window.location\`, \`window.top.*\`, \`pushState\`/\`replaceState\` и любые ручные
обращения к URL — это сломает интеграцию с платформой. Вся навигация только через
\`appRouter.navigateApp\` (его уже использует \`PlatformRouter\`).
`;
