const path = require("path");



module.exports = {
	output: {
		path: path.resolve(__dirname, "../dist"),
		clean: true,
		filename: "js/[name].js",
		chunkFilename: "js/[name].chunk.js",
		assetModuleFilename: "[name].[ext]", // images/test.png
	},
	cache: true,
	mode: "development",
	// devtool: "cheap-module-source-map",
	devtool: "source-map",
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
		proxy: [
			{ // 配置代理
				// Rspack 2 / @rspack/dev-server 2 使用 http-proxy-middleware v4，
				// 需通过 pathFilter 指定要代理的路径
				pathFilter: "/api",
				target: "http://localhost:9000",
				// 重写路径
				pathRewrite: {
					"^/api": "/test",
				},
				// 确保请求主机名是target中的主机名
				changeOrigin: true,
			},
		],
	},
	module: {
		rules: [
			{
				test: /\.(css|scss|sass)$/,
				type: 'javascript/auto',
				use: [
					"style-loader",
					{
						loader: "css-loader",
					},
					{
						loader: "postcss-loader",
					},
					{
						loader: 'sass-loader',
						options: {
							// 同时使用 `modern-compiler` 和 `sass-embedded` 可以显著提升构建性能
							// 需要 `sass-loader >= 14.2.1`
							api: 'modern-compiler',
							implementation: require.resolve('sass-embedded'),
						},
					}
				],
			},
		],
	},
};
