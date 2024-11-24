const { merge } = require("webpack-merge");
const commonConfig = require("./rspack.config.common");
const productionConfig = require("./rspack.config.prod");
const developmentConfig = require("./rspack.config.dev");
const fs = require("fs");
const path = require("path");

// 透传变量给浏览器端
const envConfig = {
  nodeEnv: process.env.NODE_ENV,
  buildType: process.env.buildType
}
fs.writeFile(path.resolve(__dirname, "../src/config/envConfig.js"), `export const envConfig = ${JSON.stringify(envConfig)}`,
  (error) => {
    if (error) {
      console.log("写入环境变量错误", error);
    } else {
      console.log("写入环境变量成功");
    }
  }
);

module.exports = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return merge(commonConfig, developmentConfig);
    case "production":
      return merge(commonConfig, productionConfig);
    default:
      return new Error("No match configuration was found");
  }
};