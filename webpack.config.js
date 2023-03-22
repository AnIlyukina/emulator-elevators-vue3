const path = require('path')
const webpack = require("webpack");

const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src", "main.js"),
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    compress: true,
    port: 8081,
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "./dist/",
    filename: "main.js",
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      {
        test: /\.(scss|css)$/,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader",
        options: {
          name: "/public/icons/[name].[ext]",
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      // Drop Options API from bundle
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: true,
    }),
  ],
};
