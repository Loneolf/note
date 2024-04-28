const path = require("path");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');


module.exports = {
	output: {
		path: path.resolve(__dirname, "../dist"),
		clean: true,
		filename: "js/[name].js",
		chunkFilename: "js/[name].chunk.js",
		assetModuleFilename: "[name].[ext]", // images/test.png
	},
	mode: "development",
	devtool: "cheap-module-source-map",
	plugins: [
		new ReactRefreshWebpackPlugin({
			overlay: false
		})
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
				test: /\.(css|scss)$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						// options: {
						// 	modules: {
						// 		localIdentName:
						// 			"[name]_[local]_[hash:base64:6]",
						// 	},
						// 	importLoaders: 2,
						// },
					},
					{
						loader: "postcss-loader",
					},
					"sass-loader",
				],
			},
			// {
			// 	test: /\.jsx?$/,
			// 	// exclude: /node_modules/, // 排除node_modules中的库
			// 	include: path.resolve(__dirname, "../src"),
			// 	loader: "babel-loader",
			// 	options: {
			// 		cacheDirectory: true,
			// 		cacheCompression: false,
			// 		plugins: [
			// 			"react-refresh/babel", // 激活js的HMR
			// 		],
			// 	},
			// },
		],
	},
};
