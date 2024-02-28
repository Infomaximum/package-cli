import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";

export const getMinimizer = () => {
  return {
    optimization: {
      minimize: true,
      splitChunks: false,
      minimizer: [
        new TerserWebpackPlugin({
          minify: TerserWebpackPlugin.terserMinify,
          parallel: true,
        }),
        new CssMinimizerPlugin(),
      ],
    },
  };
};
