type DevServerParams = {
  port: string;
  host: string;
};

export const getDevServerConfig = ({ host, port }: DevServerParams) => {
  return {
    open: false,
    hot: true,
    port,
    host,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    devMiddleware: {
      writeToDisk: false,
    },
  };
};
