const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");

const { NODE_ENV } = process.env;
const PREFIX = NODE_ENV === "production" ? "/otus--hw36-router" : "/";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: resolve(__dirname, "./src/index.ts"),
  output: {
    filename: "bundle.js",
    path: resolve(`${__dirname}/dist`),
    publicPath: PREFIX,
    clean: true,
    environment: {
      arrowFunction: false,
    },
  },
  devtool: NODE_ENV === "production" ? "hidden-source-map" : "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(jpeg)$/i,
        type: "asset/resource",
        generator: {
          filename: "./image/[contenthash][ext]",
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  mode: NODE_ENV === "production" ? "production" : "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "index.html"),
    }),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "index.html"),
      filename: "404.html",
    }),
    new MiniCssExtractPlugin(),
  ],
  devServer: {
    client: {
      logging: "info",
    },
    compress: true,
    historyApiFallback: true,
    port: 9000,
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
};
