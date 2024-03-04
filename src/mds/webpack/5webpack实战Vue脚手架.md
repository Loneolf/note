Vue开发环境搭建和react基本类似，不过有些点需要单独处理，处理`.vue`文件需要使用`vue-loader`插件，开发环境处理样式需要使用`vue-style-loader`插件，具体配置如下

[项目地址](https://bgithub.xyz/Loneolf/practice/tree/master/webpack/myVueApp)

common
```
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = {
	entry: "./src/main.js",
	plugins: [
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, "../public/index.html"), // 以该文件为模板生成HTML
		}),
		new ESLintPlugin({
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules",
			cache: true,
			cacheLocation: path.resolve(
				__dirname,
				"../node_modules/.cache/.eslintcache"
			),
		}),
		new VueLoaderPlugin(),
		// cross-env定义的环境变量给打包工具使用
		// DefinePlugin定义环境变量给源代码使用，从而解决vue3页面警告的问题
		new DefinePlugin({
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false,
		}),
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	module: {
		rules: [
			{
				test: /\.(jp?eg|png|svg|webp|gif)$/, // 用正则匹配以jpg为结尾的资源
				type: "asset",
				// asset 自动根据文件大小生成资源或者base64的url，默认值为8K 4*1024
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, //
					},
				},
			},
			{
				test: /\.(woff|woff2|ttf|otf|eot|txt)$/,
				type: "asset/resource",
			},
			{
				test: /\.js$/,
				include: path.resolve(__dirname, "../src"),
				loader: "babel-loader",
				options: {
					cacheDirectory: true,
					cacheCompression: false,
				},
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					// 开启缓存
					cacheDirectory: path.resolve(
						__dirname,
						"../node_modules/.cache/vue-loader"
					),
				},
			},
		],
	},
	resolve: {
		extensions: [".vue", ".js", ".json"], // 自动补全文件扩展名，让jsx可以使用
		// 路径别名
		alias: {
			"@": path.resolve(__dirname, "../src"),
		},
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				vue: {
					test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
					name: "vue-chunk",
					priority: 40,
				},
				elementPlus: {
					test: /[\\/]node_modules[\\/]element-plus[\\/]/,
					name: "elementPlus-chunk",
					priority: 30,
				},
				libs: {
					test: /[\\/]node_modules[\\/]/,
					name: "libs-chunk",
					priority: 20,
				},
			},
		},
		runtimeChunk: {
			name: (entrypoint) => `runtime~${entrypoint.name}.js`,
		},
	},
};

```

dev配置
```
// const path = require("path");


module.exports = {
	entry: "./src/main.js",
	output: {
		path: undefined,
		filename: "js/[name].js",
		chunkFilename: "js/[name].chunk.js",
		assetModuleFilename: "[name]_[hash:10].[ext]", // images/test.png
	},
	mode: "development",
	devtool: "cheap-module-source-map",
	plugins: [
		
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					"vue-style-loader",
					"css-loader",
					"postcss-loader"
				],
			},
		]
	},
	devServer: {
		client: {
			overlay: false,
		},
		compress: true,
		// 自定义端口号
		port: 3000,
		open: true,
		hot: true,
		historyApiFallback: true,
		// proxy: { // 配置代理
		// 	// "/api": "http://localhost:9000", // 直接代理
		// 	"/api": { // 使用对象，可以重写路径
		// 		target: "http://localhost:9000",
        //         // 重写路径
        //         pathRewrite: {
        //             "^/api":"/test",
        //         },
        //         // 确保请求主机名是target中的主机名
        //         changeOrigin: true
		// 	}
		// },
	},
};

```
prod配置
```
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpakPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	output: {
		path: path.resolve(__dirname, "../dist"),
		clean: true,
		filename: "js/[name]_[contenthash:10].js",
		chunkFilename: "js/[name].chunk.js",
		assetModuleFilename: "asset/[name]_[contenthash:10][ext]", // images/test.png
	},
	mode: "production", // development | production
	// devtool: "source-map",
	devtool: false,
	plugins: [
		new MiniCssExtractPlugin({
			// 默认生成main.css
			filename: "style/[name]_[contenthash].css", // 生成的文件放在dest/style目录下，文件名为hash值
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "../public"),
					to: path.resolve(__dirname, "../dist"),
					globOptions: {
						// 忽略index.html文件
						ignore: ["**/index.html"],
					},
				}
			],
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader"
				],
			},
		]
	},
	optimization: {
		minimizer: [new CssMinimizerWebpakPlugin(), new TerserPlugin()],
	},
};

```

webpack.config.js
```
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.config.common");
const productionConfig = require("./webpack.config.prod");
const developmentConfig = require("./webpack.config.dev");

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
```
如果项目中引入了vant或者element这些UI库，按需加载或者自定义主体需要额外处理，按照文档增加相应配置即可

依赖包及指令
```
{
  "name": "my-vue",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "npm run dev",
    "dev": "cross-env NODE_ENV=development webpack serve --config ./config/webpack.config.js",
    "build": "cross-env NODE_ENV=production webpack --config ./config/webpack.config.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.23.2",
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11",
    "@vue/cli-plugin-babel": "^5.0.8",
    "autoprefixer": "^7.2.6",
    "babel-loader": "^9.1.3",
    "babel-preset-react-app": "^10.0.1",
    "copy-webpack-plugin": "^11.0.0",
    "cross-env": "^7.0.3",
    "css-loader": "^6.8.1",
    "css-minimizer-webpack-plugin": "^5.0.1",
    "customize-cra": "^1.0.0",
    "eslint": "^8.49.0",
    "eslint-config-react-app": "^7.0.1",
    "eslint-plugin-import": "^2.28.1",
    "eslint-plugin-vue": "^9.18.1",
    "eslint-webpack-plugin": "^4.0.1",
    "husky": "^8.0.3",
    "less-loader": "^11.1.3",
    "mini-css-extract-plugin": "^2.7.6",
    "node-sass": "^9.0.0",
    "postcss-loader": "^7.3.3",
    "postcss-preset-env": "^9.1.3",
    "react-refresh": "^0.14.0",
    "sass-loader": "^13.3.2",
    "terser-webpack-plugin": "^5.3.9",
    "unplugin-auto-import": "^0.16.7",
    "unplugin-vue-components": "^0.25.2",
    "vue-loader": "^17.3.1",
    "vue-template-compiler": "^2.7.15",
    "webpack": "^5.88.1",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1",
    "webpack-merge": "^5.10.0"
  },
  "broeserslist": [
    "> 1%",
    "last 2 versions"
  ],
  "dependencies": {
    "element-plus": "^2.4.2",
    "vue": "^3.3.8",
    "vue-router": "^4.2.5"
  }
}

```

其它配置`.eslintrc.js`，使用了官方提供的lint插件
```
module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
	parserOptions: {
		parser: "@babel/eslint-parser",
	},
	rules: {
		"vue/multi-word-component-names": 0
	}
};

```
babel.config.js
```
module.exports = {
	presets: ["@vue/cli-plugin-babel/preset"],
};

```