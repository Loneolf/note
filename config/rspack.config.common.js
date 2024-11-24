const path = require("path");
const rspack = require("@rspack/core");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
	entry: "./src/main.tsx",
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: path.resolve(__dirname, "../public/index.html"), // 以该文件为模板生成HTML
			inject: "body",
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
	],
	module: {
		rules: [
			{
				test: /\.(jp?eg|png|svg|webp|gif)$/, // 用正则匹配以jpg为结尾的资源
				type: "asset",
			},
			{
				test: /\.(woff|woff2|ttf|otf|eot|txt)$/,
				type: "asset/resource",
			},
			{
				test: /\.ts?x$/,
				use: {
					loader: "builtin:swc-loader",
					options: {
						jsc: {
							parser: {
								syntax: "typescript",
								tsx: true,
							},
						},
					},
				},
				type: "javascript/auto",
			},
			{
				test: /\.ts$/,
				exclude: [/node_modules/],
				loader: "builtin:swc-loader",
				options: {
					jsc: {
						parser: {
							syntax: "typescript",
						},
					},
				},
				type: "javascript/auto",
			},
			{
				test: /\.md$/,
				use: ["raw-loader"],
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: require.resolve("html-loader"),
						options: {
							minimize: true, // 对HTML文件进行压缩
						},
					},
				],
			},
		],
		parser: {
			asset: {
				// asset 自动根据文件大小生成资源或者base64的url，默认值为8K 8*1024
				dataUrlCondition: {
					maxSize: 8 * 1024,
				},
			},
		},
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js", ".json"], // 自动补全文件扩展名，让tsx可以使用
		alias: {
			"@": path.resolve(__dirname, "../src"),
			"@a": path.resolve(__dirname, "../src/assets"),
			"@ac": path.resolve(__dirname, "../src/assets/css"),
			"@ai": path.resolve(__dirname, "../src/assets/img"),
			"@s": path.resolve(__dirname, "../src/store"),
			"@m": path.resolve(__dirname, "../src/mds"),
			"@u": path.resolve(__dirname, "../src/util"),
			"@c": path.resolve(__dirname, "../src/componet"),
			"@cf": path.resolve(__dirname, "../src/config"),
			"@cl": path.resolve(__dirname, "../src/case/local"),
		},
	},
	optimization: {
		splitChunks: {
			chunks: "all",
			// cacheGroups: {
			// 	 // react相关的一起打包成一个js文件
			// 	 react: {
			// 		test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
			// 		name: "chunk-react",
			// 		priority: 40,
			// 	  },
			// 	  // antd 单独打包
			// 	  antd: {
			// 		test: /[\\/]node_modules[\\/]antd[\\/]/,
			// 		name: "chunk-antd",
			// 		priority: 30,
			// 	  },
			// 	  // 剩下node_modules单独打包
			// 	  libs: {
			// 		test: /[\\/]node_modules[\\/]/,
			// 		name: "chunk-libs",
			// 		priority: 20,
			// 	  },
			// },
		},
		runtimeChunk: {
			name: (entrypoint) => `runtime~${entrypoint.name}`,
		},
	},
	stats: {
		errorDetails: true,
	},
};
