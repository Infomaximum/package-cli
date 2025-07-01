import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

export const getReactRefresh = () => {
  return new ReactRefreshWebpackPlugin({ overlay: false });
};
