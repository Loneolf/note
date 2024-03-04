#### 构建性能优化
随着项目越来越大， 功能和业务代码越来越多，`webpack`构建优化越来越有必要，通常优化配置如下
##### 通用环境
1. 更新到最新版本，webpack，nodejs，npm等，较新版本更高效的构建模块树以及提高解析速度
2. 优化`loader`配置: 在使用`loader`时，可以通过配置`include`、`exclude`、`test`属性来匹配文件，使用`include`、`exclude`规定哪些匹配应用loader
3. 解析
    - 减少`resolve.modules`，`resolve.extensions`，`resolve.mainFiles`，`resolvedescriptionFiles`中条目数量，它们会增加文件系统的调用次数
    - 如果不适用symlinks（如npm link或yarn link），可以设置resolve.symlinks:false
    - 如果使用自定义resolve plugin规则，并且没有指定context上下文，可以设置resolve。cacheWithContext: false
4. 保持编译结果的整体大小，让chunk体积小
    - 使用数量更少/体积更小的`library`
    - 在SPA中使用`SplitChunksPlugin`，并开启`saync`模式
    - 移除未使用代码
    - 只编译当前正在开发的代码

5. 使用`resolve.alias`, 路径别名，通过配置alias减少查找过程

6. 使用缓存
    - 在性能开销较大的`loader`之前添加`cashe-loader`,将结果缓存到磁盘中，提升二次构建速度`use: ['cache-loader', ...loaders],`
    - webpack中配置`cache`， `module.exports = { cache: {type: "memory"}}`
7. 移除`process plugin`，可以看到构建过程，但是不会为快速构建提供太多价值
8. dll 动态链接库
> 使用DllPlugin 为更改不频繁的代码单独生产编译结果，提高应用程序的编译速度，通常是一些依赖包，使用dll编译一次，之后就不需要为这些依赖包再编译

配置步骤
- 单独配置一个配置文件打包不会发生变化的第三方库webpack.config.dll.js：
- 通过插件将打包好的库引入到界面上,add-asset-html-webpack-plugin
- 生成动态库的映射关系（清单），方便webpack能够从中找到对应的库,DllPlugin
- 告诉webpack去哪里查找动态库

webpack.config.dll.js文件如下
```
const path = require("path");
const webpack = require("webpack");
module.exports = {
  mode: "production",
  // 配置的是node_modules里安装的第三方的包
  entry: {
    // 示例，将lodash和jquery单独打包，这样正常启动就不用为这两个包编译了
    vendor: ["lodash", "jquery"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dll"),
    library: "[name]_[hash]",
  },
  plugins: [
    new webpack.DllPlugin({
      // 映射关系文件名
      name: "[name]_[hash]",
      // 映射关系表，manifest.json文件
      path: path.resolve(__dirname, "dll/manifest.json"),
    }),
  ],
};

// package.json添加编译指令
"scripts": {
    ...
    "dll": "npx webpack --config ./webpack.dll.config.js"
}
```
在webpack中需要通过`webpack.DllReferencePlugin`插件告知webpack哪些依赖不需要编译打包，通过插件`add-asset-html-webpack-plugin`插件将链接动态注入到生成的`html`中

配置如下
```
plugins: [
	new webpack.DllReferencePlugin({
		manifest: path.resolve(__dirname, "./dll/manifest.json"),
	}),
	new AddAssetHtmlPlugin({
		filepath: path.resolve(__dirname, "./dll/vendor.js"),
		publicPath: "./",
	}),
],
```


9. worker pool 多线程打包
可以通过`thread-loader`插件，将比较耗资源的loader单独分流给worker pool，相当于另开一个线程处理耗资源的loader

示例配置如下，处理ES6
```
module.exports={
	...
	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:/node_modules/,
				use:[
					{
						loader:'babel-loader',
						options:{
							presets:['@babel/preset-env']
						}
					},
                    {
                        loader:'thread-loader',
                        options:{
                            workers:2 // 调用CPU核心数
                        }
                    }
				]
			}
		]
	}
}
```


##### 开发环境
1. 增量编译
使用webpack的watch mode（监听模式），而不使用其他工具来watch文件和调用webpack。内置的watch mode会记录时间戳并将此信息传递给compilation以使缓存失效。
某些配置环境中，watch mode会回退到poll mode（轮询模式）。监听许多文件会导致CPU大量负载。在这些情况下，可以使用watchOptions.poll 来增加轮询的间隔时间。

2. 在内存中编译
下面几个工具通过咋内存中（而不是写入磁盘）编译和serve资源来提高性能
    - webpack-dev-server
    - webpack-hot-middleware
    - webpack-dev-middleware

3. devtool
需要注意的是不同的devtool设置，会导致性能差异。
    - eval：性能最好，但不能转译代码
    - cheap-source-map：较差一点的map质量
    - eval-source-map：增量编译
    在大多数情况下，最佳选择是eval-cheap-module-source-map

4. 避免在生产环境才用到的工具
某些utility, plugin和loader都只用于生产环境。例如，在开发环境下使用TerserPlugin 来 minify(压缩)和mangle(混淆破坏)代码。通常在开发环境下，应该排除以下这些工具∶
    - TerserPlugin
    - [fullhash]/[chunkhash]/[contenthash].
    - AggressiveSplittingPlugin
    - .AggressiveMergingPlugin
    - ModuleConcatenationPlugin

5. 最小化entry chunk
Webpack只会在文件系统中输出已经更新的chunk。某些配置选项（HMR，output.chunkFilename 的[name]/[chunkhash]/[contenthash]，[fullhash]）来说，除了对已经更新的 chunk无效之外，对于entry chunk 也不会生效。
确保在生成entry chunk时，尽量减少其体积以提高性能。以下配置为运行时代码创建了一个额外的chunk，所以生成代价较低:
```
module.exports = {
    optimization:{
        runtimeChunk: true,
    }
}
```
6. 避免额外的优化步骤
Webpack通过执行额外的算法任务，来优化输出结果的体积和加载性能。这些优化适用于小型代码库，但是在大型代码库中却非常耗费性能
```
modules.exports = {
    optimizations: {
        remoAvailabelModules: false,
        remoEmptyChunks: false,
        splitChunks: false,
    }
}
```

7. 输出结果不携带路径信息
Webpack 会在输出的bundle 中生成路径信息。然而，在打包数干个模块的项目中，这会导致造成垃圾回收性能压力。
```
module.exports = {
    output: {
        pathinfo: false,
    }
}
```
8. typescript loader
可以为loader传入transpileOnly选项，以缩短使用ts-loader时的构建时间。使用此选项，会关闭类型检查。如果要再次开启类型检查，使用ForkTsCheckerWebpackPlugin。使用此插件会将检查过程移至单独的进程，可以加快TypeScript 的类型检查和 ESLint插入的速度。
```
{
    test: /\.tsx$/,
    use: [
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
```