/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require("webpack-shell-plugin");

const nodeEnv = process.env.NODE_ENV;

module.exports = {
  devtool: "inline-source-map",
  performance: {
    hints: false,
  },
  mode: nodeEnv || "production",
  entry: path.resolve(path.join(__dirname, "./src/server.ts")),
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "server.bundle.js",
  },
  target: "node",
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".js"],
  },
  watch: nodeEnv === "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
      },
    ],
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ["npm run run:dev"],
    }),
  ],
};
