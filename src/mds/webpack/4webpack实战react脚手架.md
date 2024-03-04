实战是检验学习效果的一种方式，通过自己用webpack搭建项目，可以更深的理解webpack，本篇用webpack搭建react开发环境，并在后面加上升级版的TS环境，也会将遇到的问题贴上

搭建react开发环境有一些需要注意点，资源处理，jsx文件编译，css编译，引入antd UI库，react Router处理，状态管理，根据环境加载不同的config文件等，根据之前学习的只是，搭建如下配置

[代码地址](https://github.com/Loneolf/practice/tree/master/webpack/myReactApp)

通用配置`webpack.config.common.js`
```
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");


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
			cacheLocation: path.resolve(__dirname,"../node_modules/.cache/.eslintcache"),
		}),
	],
	module: {
		rules: [
			{
				oneOf: [
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
						test: /\.jsx?$/,
						// exclude: /node_modules/, // 排除node_modules中的库
						include: path.resolve(__dirname, "../src"),
						loader: "babel-loader",
						options: {
							cacheDirectory: true,
							cacheCompression: false,
						},
					},
				]
			}
		],
	},
	resolve: {
		extensions: [".jsx", ".js", ".json"], // 自动补全文件扩展名，让jsx可以使用
		alias: {
			'@': path.resolve(__dirname, '../src'),
			'@s': path.resolve(__dirname, '../src/store')
		},
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				 // react相关的一起打包成一个js文件
				 react: {
					test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
					name: "chunk-react",
					priority: 40,
				  },
				  // antd 单独打包
				  antd: {
					test: /[\\/]node_modules[\\/]antd[\\/]/,
					name: "chunk-antd",
					priority: 30,
				  },
				  // 剩下node_modules单独打包
				  libs: {
					test: /[\\/]node_modules[\\/]/,
					name: "chunk-libs",
					priority: 20,
				  },
			},
		},
		runtimeChunk: {
			name: (entrypoint) => `runtime~${entrypoint.name}`,
		},
	},
};

```

开发环境配置
```
const path = require("path");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
	entry: "./src/main.js",
	output: {
		path: undefined,
		clean: true,
		filename: "js/[name].js",
		chunkFilename: "js/[name].chunk.js",
		assetModuleFilename: "[name].[ext]", // images/test.png
	},
	mode: "development",
	devtool: "cheap-module-source-map",
	plugins: [
		new ReactRefreshWebpackPlugin()
	],
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
		proxy: { // 配置代理
			// "/api": "http://localhost:9000", // 直接代理
			"/api": { // 使用对象，可以重写路径
				target: "http://localhost:9000",
                // 重写路径
                pathRewrite: {
                    "^/api":"/test",
                },
                // 确保请求主机名是target中的主机名
                changeOrigin: true
			}
		},
	},
	module: {
		rules: [
			{
				test: /\.(css|scss|sass)$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: {
								localIdentName:
									"[name]_[local]_[hash:base64:6]",
							},
							importLoaders: 2,
						},
					},
					{
						loader: "postcss-loader",
					},
					"sass-loader",
				],
			},
			{
				test: /\.jsx?$/,
				// exclude: /node_modules/, // 排除node_modules中的库
				include: path.resolve(__dirname, "../src"),
				loader: "babel-loader",
				options: {
					cacheDirectory: true,
					cacheCompression: false,
					plugins: [
						"react-refresh/babel", // 激活js的HMR
					],
				},
			},
		],
	},
};

```

生产环境配置, `webpack.config.prod.js`
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
	devtool: "source-map",
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
				test: /\.(css|scss|sass)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							modules: {
								localIdentName:
									"[name]_[local]_[hash:base64:6]",
							},
							importLoaders: 2,
						},
					},
					{
						loader: "postcss-loader",
					},
					"sass-loader",
				],
			},
			{
				test: /\.jsx?$/,
				include: path.resolve(__dirname, "../src"),
				loader: "babel-loader",
			},
		],
	},
	optimization: {
		minimizer: [new CssMinimizerWebpakPlugin(), new TerserPlugin()],
	},
};

```
环境区分，配置merge  `webpack.config.js`
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
用到的依赖包和指令
```
{
  "name": "source-map",
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
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.11",
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
    "eslint-webpack-plugin": "^4.0.1",
    "husky": "^8.0.3",
    "mini-css-extract-plugin": "^2.7.6",
    "node-sass": "^9.0.0",
    "postcss-loader": "^7.3.3",
    "postcss-preset-env": "^9.1.3",
    "react-refresh": "^0.14.0",
    "sass-loader": "^13.3.2",
    "style-loader": "^3.3.3",
    "terser-webpack-plugin": "^5.3.9",
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
    "@reduxjs/toolkit": "^1.9.7",
    "antd": "^5.10.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.1.3",
    "react-router-dom": "^6.17.0"
  }
}

```

其它配置`.eslintrc.json`，使用了`react-app`做ESlint规则校验
```
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "react-app",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": 0,
        "import/no-import-module-exports": 0,
        "import/extensions": 0,
        "import/no-extraneous-dependencies": 0,
        "no-console": 0
        // "no-sparse-arrays": 0
    }
}

```
babel.config.js
```
module.exports = {
    presets: ["react-app"]
}
```
具体代码内容可在git上面下载查看，配置过程中有些需要注意的点

1、通过`splitChunks`的`cacheGroups`将依赖分类打包
2、使用`react-refresh/babel`激活JS文件中的HMR，但是如果文件引入了antd模块，则会失效
3、使用`copy-webpack-plugin`插件复制不需要打包的资源
4、开发环境使用`historyApiFallback: true`，确保刷新正常显示页面

#### 项目升级TS需要注意的点
1、下载对应的依赖包
```
ts-loader typescript @types/node @types/react @types/react-dom
```
2、将文件名后缀改为`.ts、.tsx`，并使用`ts-loader`编译对应文件
3、使用`tsc --int`生成`tsconfig.json`配置文件，文件内容可以copy`npx create-react-app my-react-app --template typescript`中的`tsconfig.json`
配置如下
```
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "noEmitOnError": true,
    "jsx": "react-jsx",
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@s/*":["src/store/*"]
    },
  },
  "include": [
    "src",
    "typed-css.d.ts"//配置的.d.ts文件"
  ]
}

```
`noEmit`和`noEmitOnError`是为了解决报错`Error: TypeScript emitted no output for Api.ts`
4、路径别名需要再`tsconfig.json`中使用`baseUrl`和`paths`同样配置，否则报错
5、因为在项目中使用了样式模块化，所以还需要加上样式的配置文件按，否则导入报错
```
// typed-css.d.ts文件
declare module "*.css" {
	const classes: { readonly [key: string]: string };
	export default classes;
}

declare module "*.sass" {
	const classes: { readonly [key: string]: string };
	export default classes;
}

declare module "*.scss" {
	const classes: { readonly [key: string]: string };
	export default classes;
}

```

解决完上面的问题，项目的TS环境也基本搭建完成