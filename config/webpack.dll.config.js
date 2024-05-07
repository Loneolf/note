const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  mode: "production",
  // 配置的是node_modules里安装的第三方的包
  entry: {
    // 示例，将lodash和jquery单独打包，这样正常启动就不用为这两个包编译了
    vendor: [
      "antd", 
      "react", 
      "qrcode", 
      "react-router-dom",
      "react-dom",
      "react-fast-marquee",
      "react-markdown",
      "react-redux",
      "react-syntax-highlighter",
      "rehype-raw",
      "remark-gfm",
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../public/dll"),
    library: "[name]_[hash]",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      // 映射关系文件名
      name: "[name]_[hash]",
      // 映射关系表，manifest.json文件
      path: path.resolve(__dirname, "../public/dll/manifest.json"),
      context: process.cwd(),
    }),
  ],
};