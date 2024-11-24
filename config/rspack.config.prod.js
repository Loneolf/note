const path = require("path");
const rspack = require("@rspack/core");

module.exports = {
	output: {
		path: path.resolve(__dirname, "../docs"),
		clean: true,
		filename: "js/[name]_[contenthash:10].js",
		chunkFilename: (pathData) => {
			if (!pathData.chunk.name) {
				return "js/md/[id].js";
			}
			return "js/[name].chunk.js";
		},
		assetModuleFilename: "asset/[name]_[contenthash:10][ext]", // images/test.png
	},
	mode: "production", // development | production
	devtool: "source-map",
	plugins: [
		new rspack.CssExtractRspackPlugin({
			// 默认生成main.css
			filename: "style/[name]_[contenthash:6].css", // 生成的文件放在dest/style目录下，文件名为hash值
		}),
		new rspack.CopyRspackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "../public"),
					to: path.resolve(__dirname, "../docs"),
					globOptions: {
						// 忽略index.html文件
						ignore: ["**/index.html"],
					},
				},
			],
		}),
	],
	module: {
		rules: [
			{
				test: /\.(css|scss|sass)$/,
				type: 'javascript/auto',
				use: [
					rspack.CssExtractRspackPlugin.loader,
					{
						loader: "css-loader",
					},
					{
						loader: "postcss-loader",
					},
					{
						loader: "sass-loader",
						options: {
							// 同时使用 `modern-compiler` 和 `sass-embedded` 可以显著提升构建性能
							// 需要 `sass-loader >= 14.2.1`
							api: "modern-compiler",
							implementation: require.resolve("sass-embedded"),
						},
					},
				],
			},
		],
	},
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin({
				minimizerOptions: {
					format: {
						comments: false,
					},
				},
			}),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: {
					errorRecovery: false,
				},
			}),
		],
	},
};
