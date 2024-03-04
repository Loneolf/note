### 概念
> webpack 是前端资源构建工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(dependency graph)，然后将你项目中所需的每一个模块组合成一个或多个 bundles。
在 Webpack 看来，前端的所有资源文件 ( js / json / css / img / less / … ) 都会作为模块处理，它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源 ( bundles )。
[代码地址](https://bgithub.xyz/Loneolf/practice/tree/master/webpack)
### webpack基本使用
##### 安装webpack
```
npm i webpack webpack -cli --global // 全局安装
npm install webpack webpack-cli --save-dev //本地安装webpack及webpack-cli
webpack -v // 使用该指令验证版本，正常显示版本即安装成功
```
##### webpack命令行运行
webpack可以使用命令行编译文件，如下
```
npx webpack --entry ./index.js --mode production 
// 该指令会寻找当前目录下index.js，自动编译，并在当前目录生成dist文件夹，编译后的文件为main.js
// 通过指令使用webpack不方便也不利于配置，通常使用配置文件
```
##### webpack基本配置
> webpack运行在node中，所以需要commentJS导入导出，配置文件名必须为webpack.config.js，webpack自动读取

entry: 入口文件
output: 打包文件
mode: 模式 // development:开发模式，production:生产模式
devtool: 'inline-source-map' // 异常时精准定位到错误的行
plugins: 插件配置集合
devServer: 开启本地服务器，使用指令 npx webpack-dev-server启动，在本地启动8080的服务端口，热更新
```
// 文件名必须为webpack.config.js，webpack自动读取
// 在node.js中运行，所以必须用commentJS导入导出
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bounder.js',
        path: path.resolve(__dirname, './dist'),
        // __dirname相当于找到当前文件夹的绝对路径， './dist'从当前文件夹的绝对路径找到相对路径dist
        clean: true, 
        // 生成的文件目录清除冗余的文件，不清除plugins生成的文件
        // 不使用箭头函数和const
		environment: {
			arrowFunction: false,
			const: false,
		},
    },
    mode: 'development', 
    // development:开发模式
    devtool: 'inline-source-map',
    // 异常时， 显示源文件代码具体位置，而非打包后文件异常位置
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html', // 以该文件为模板生成HTML
            filename: 'app.html', // 生成的文件名称
            inject: 'body', // script标签放在哪个标签里面，默认放在head标签中
        })
    ],
    devServer: {
        static: './dist'
        // 使用指令 npx webpack-dev-server启动，在本地启动8080的服务端口
        // 本质是将输出后的bounder.js文件放在内存中，删除本地的bounder.js文件并不会影响开发调试
    }
}
// 使用npx webpack 增加--watch去编译文件，实时检测文件改动
```
上面案例中的HTMLWebpackPlugin插件，需要本地安装后才可使用`npm install webpack-dev-server -D`

### 资源模块 asset module
> 资源模块 是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader，

##### 在JS通过import进行导入或者css中引入的文件会被资源模块自动加载处理

```
// ./src/index.js 
import img1 from '../img/1.png'
import img2 from '../img/safe.svg'
import img3 from '../img/2.jpg'
import tc from './text.txt'
const text = document.createElement('div')
text.textContent = tc
text.classList.add('textContent')
text.style.cssText = 'width: 200px;height:200px;background: #ccc;'
app.appendChild(text)
document.body.classList.add('body')

const imgdom = document.createElement('img')
imgdom.src = img1
app.appendChild(imgdom)

const imgdom2 = document.createElement('img')
imgdom2.src = img2
app.appendChild(imgdom2)

const imgdom3 = document.createElement('img')
imgdom3.src = img3
app.appendChild(imgdom3)

console.log('aaa2333', img3)
```

##### 资源模块类型
asset/resource：发送一个单独的文件并导出 URL
asset/inline：导出的资源为 Data URL base64格式，不在dist文件夹
asset/source：导出资源的源代码
asset：自动根据文件大小生成资源或者base64的url，默认值为8K 4*1024，即大于8K为resource效果，小于8k为inline效果，该值可使用parser自定义maxSize

assetModuleFilename: 指定输出路径和文件名称
```
module.exports = {
    output: {
       ...
        assetModuleFilename: 'images/[name]_[contenthash][ext]' // images/test.png
        // 可以指定输出路径和文件名称，
        // name:文件本身的名称，contenthash:生成的hash值, ext:文件原本的类型
    },
  ...
  module: {
    rules: [
        {
            test: /\.png$/, // 用正则匹配以png为结尾的资源
            type: 'asset/resource', // 打包资源文件，输出对应文件
            generator: {
                filename: 'images/[name]_[contenthash][ext]'
            }
            // generator优先级高于output中的assetModuleFilename
        },
        {
            test: /\.svg$/, // 用正则匹配以svg为结尾的资源
            type: 'asset/inline',
            // asset/inline, 将资源打包成data URL base64格式的数据
        },
        {
            test: /\.txt$/, // 用正则匹配以txt为结尾的资源
            type: 'asset/source',
            // asset/source, 打包出资源的源代码
        },
        {
            test: /\.jpg$/, // 用正则匹配以jpg为结尾的资源
            type: 'asset',
            // asset 自动根据文件大小生成资源或者base64的url，默认值为8K 4*1024
            parser:{
                dataUrlCondition:{
                    maxSize: 4 * 1024 * 1024
                }
            }
        },
    ]
  }
}
```

### 资源处理

##### webpack-loader
项目中我们import的css\scss\less,或者images图像，fonts字体，以及生成怎样的html，这些资源的处理及生成我们需要用webpack-loader机制。
简而言之，webpack可以解析js,json文件，但是其它类型的文件，css,html,sass,images,字体等，需要对应的loader去处理转化为有效的模块

#### HTML资源
插件: `html-webpack-plugin`, 下载`npm i html-webpack-plugin - D`

在上面的基本配置中我们使用了该插件，使用如下
```
// 引入插件
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html', // 以该文件为模板生成HTML
            filename: 'app.html', // 生成的文件名称
            inject: 'body', // script标签放在哪个标签里面，默认放在head标签中
        })
    ],
}
```
我们可以自定义输出内容，文件模板，生成的JS注入到哪个标签(默认放在head中)

#### css资源相关
> 处理css相关资源，用Test正则匹配文件，使用use加载对应的loader去处理匹配到的文件
use 支持链式调用，如果是数组，从后往前执行，依次将产物给前一个loader去执行

```
import './css/style.css'
import './css/style.less'
import './css/style.scss'
```
如果我们在js中引入上面的文件，需要配置相应的loader才能让css样式生效

##### js中`import './css/style.css'`
使用`css-loader`处理引入的css，但是这一步并不会生效，因为样式没有生成到style中或者css文件中
所以需要`style-loader`，将css生成到head中的style标签中
或者`MiniCssExtractPlugin.loader`,抽离css生成文件，并生成link标签在head标签中
在plugins初始化`MiniCssExtractPlugin`插件，可以自定义文件名，文件生成目录

##### less文件或者sass文件
需要先通过`less-loader`或者`sass-loader`将less文件、sass文件转化为css文件，后面的链式处理等同于处理css文件

##### css文件压缩
`MiniCssExtractPlugin`生成的css文件并非压缩文件，我们需要在优化中压缩css文件，下面配置中的`optimization`为优化配置
需要注意的是该配置生效必须在生产模式下
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 该loader仅在webpack5下可使用
const CssMinimizerWebpakPlugin = require('css-minimizer-webpack-plugin')
module.exports = {
  ...
  mode: 'production', // 生产模式，在该模式下代码压缩才生效
  plugins: [
        // 生成css文件，并生成link标签链接生成的文件
        new MiniCssExtractPlugin({ // 默认生成main.css
            filename: 'style/[contenthash].css' // 生成的文件放在dist/style目录下，文件名为hash值
        }),
    ],
  module: {
    rules: [
        {
           test: /\.(css|scss)$/, // /\.(css|less)$/
           // use: ['style-loader', 'css-loader'], // 处理css文件的loader
            // use: ['style-loader', 'css-loader', 'less-loader'], // 编译less文件的loader
            // use: ['style-loader', 'css-loader', 'sass-loader'], // 编译sass文件的loader
            // use 支持链式调用，如果是数组，从后往前执行，依次将产物给前一个loader去执行
            less-loader和sass-loader将less、scss文件编译为css，css-loader处理js文件引入，style-loader将css生成到head中的style标签里
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            // MiniCssExtractPlugin.loader，与style-loader不同的是抽离css并生成css文件，通过link标签使css生效
        ]
      }
    ]
  },
  optimization: {
        minimizer:[
            new CssMinimizerWebpakPlugin() // css优化，压缩css文件
            // 仅在production模式下生效
        ]
    }
}
```
以上需要安装的插件如下
```
css-loader
style-loader
less
less-loader
node-sass
sass-loader
css-minimizer-webpack-plugin
mini-css-extract-plugin
```

#### 加载字体资源 @font-face
> 加载字体`webpack`自带的`asset/resource`即可

```
@font-face {
    font-family: 'qingIcon';
    src:url('fonts/icomoon.eot'); /* IE9*/
    src:url('fonts/icomoon.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('fonts/icomoon.svg#icomoon') format('svg'), /* iOS 4.1- */
    url('fonts/icomoon.woff2') format('woff2'),
    url('fonts/icomoon.woff') format('woff'), /* chrome、firefox */
    url('fonts/icomoon.ttf') format('truetype'); /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
    font-weight: 400;
    font-style: normal;
}
.icon {
	font-family: "qingIcon";
	font-size: 40px;
	color: yellowgreen;
}
// js中使用
const spanDom = document.createElement('span')
spanDom.classList.add('icon')
spanDom.innerHTML='&#x7231;'
```
webpack配置
```
...
module: {
        rules: [
           ...
            {
                test: /\.(woff|woff2|ttf|otf|eot)$/,
                type: 'asset/resource'
            }
        ]
    },
```
#### 数据资源 CSV、TSV、XML、json、yml、toml
加载数据资源需要使用对应的loader来进行加载，最终生成json数据来进行使用，对应依赖和配置如下
```
npm i csv-loader xml-loader json toml yaml -D
```
webpack配置
```
...
module: {
        rules: [
           ...
            {
                test: /\.(csv|tsv)$/,
                use: "csv-loader",
            },
            {
                test: /\.xml$/,
                use: "xml-loader",
            },
            {
                test: /\.toml$/,
                type: "json",
                parser: {
                  parse: toml.parse,
                },
            },
            {
                test: /\.yaml$/,
                type: "json",
                parser: {
                  parse: yaml.parse,
                },
            },
            {
                test: /\.json$/,
                type: "json",
                parser: {
                  parse: json.parse,
                },
            },
        ]
    },
```

#### JS编译
webpack并不会对ES6代码进行编译，打包后依然是ES6代码，如果项目需要兼容低版本浏览器，需要相关的loader将ES6编译成ES5
```
npm install babel-loader @babel/core @babel/preset-env @babel/runtime @babel/plugin-transform-runtime -D
```

- babel-loader: 在Webpack里应用babel解析ES6的桥梁
- @babel/core: babel核心模块
- babel/preset-env: babel预设，一组babel插件的集合
- babel/runtime: 运行在运行时，被引入的模块会被打包到最终产物里
- @babel/plugin-transform-runtime: 转译代码，转译后的代码可能引入`babel/runtime`中的模块，运行在编译时，该插件是转译babel不转译的新API
    - 自动polyfill es5不支持的特性，这些polyfill包在babel-runtime包中（core-js 、regenerator等）

```
...
module: {
        rules: [
           ...
           {
				test: /\.js$/,
				exclude: /node_modules/, // 排除node_modules中的库
				use: {
					loader: "babel-loader", // 加载loader
					options: {
						presets: ["@babel/preset-env"], // 配置预设
						plugins: [["@babel/plugin-transform-runtime"]],
						// 全自动的，不会污染全局 API。
					},
				},
			},
        ]
    },
```
bable相关的配置还可以抽离到 .babelrc文件中或者babel.config.js
#### JS 压缩
同CSS生产环境需要压缩一样，JS代码生产环境压缩同样需要JS压缩插件
```
npm install terser-webpack-plugin -D
// config中配置在optimization的minimizer中，只需要再生产环境配置即可
const Terser = require("terser-webpack-plugin");
optimization: {
      minimizer: [
        new TerserPlugin()
    ],
},
```

小结：通过webpack Loader机制，我们可以让webpack处理js、json以外的资源文件，从而转化为有效的资源模块

### 代码分离
当项目大到一定程度，或者某些依赖库不希望跳转个页面就重复的完全加载，我们就需要进行代码分离，或者配置按需加载、懒加载、预加载等优化点

webpack可以将代码分离到不同的文件中，然后将文件按需加载或者并行加载，同时获取代码加载优先级等

常用代码分离通常如下
- 多入口配置：使用entry配置，手动地分离代码。
- 公共代码分离提取：在入口使用entry dependencies或者SplitChunkPlugin去重和分离代码。
- 动态导入：通过模块的内联函数import调用来分离代码

#### 多入口配置

多入口配置需要同时更改入口和输出，输出可使用[name]自动输出对应的文件，并使用[contenthas]生成hash值

多入口配置的缺点是不同的文件引入同一个包也会重复的打包进对应的文件，造成重复加载，所以需要进行公共代码提取
```
entry: {
	// // 多入口文件
	index: "./src/index.js",
	lodashDeepLog: "./src/lodashLog.js",
}
output: {
	// [name] 文件本身名称, [contenthash] hash值
	filename: "[name]_[contenthash]_bounder.js",
}
```
#### 公共代码分离提取
提取公共代码有两种方案，一种是多入口配置时使用`Entry dependencies` 防止重复，手动指出重复插件
还有就是使用`split-chunks-plugin` webpack本身有的插件

##### Entry dependencies
```
// 使用Entry dependencies 防止重复，手动指出重复插件
entry: {
	index: {
		import: "./src/index.js",
		dependOn: "shared",
	},
	otherlodashDeepLog: {
		import: "./src/lodashLog.js",
		dependOn: "shared",
	},
	shared: "lodash",
}
该配置会把两个文件都导入用的lodash单独生成一个文件并各自引入
```
##### splitChunks
```
entry: {
	// // 多入口文件
	index: "./src/index.js",
	lodashDeepLog: "./src/lodashLog.js",
},
...
optimization: {
	splitChunks: {
		chunks: 'all'
	},
}
自动识别公共的模块依赖并抽离成单独的chunk
```

####  动态导入
使用import方法加载模块
```
export function logStr() {
    // import 功能返回promise，可用then处理加载的数据
	return import("lodash").then(({ default: _ }) => {
		return _.join(["Hello", "webpack", "import()"], ' ')
	});
}
logStr().then((str) => {
    console.log(str)
});

```
动态导入可以应用到懒加载、预加载等
##### 懒加载
页面有些功能可能用不并不一定使用到，我们可以使用import懒加载模块，当事件触发或条件满足后才进行加载

```
const button = document.createElement('button')
button.innerHTML = '点击加法'
app.appendChild(button)
button.addEventListener('click', ()=> {
    // /* webpackChunkName: 'math' */ 魔法注释，自定义打包文件名字
    import(/* webpackChunkName: 'math' */'./math').then(({add}) => {
        console.log(add(33,44))
    })
})
// 只有当点击按钮才会加载math文件，并使用math文件中的add方法
```

##### 预获取和预加载
- webpackPrefetch：将来某些导航下可能需要的资源
    - 在head中增加一个link标签，对应src会在首页面加载完毕，网络空闲的时候再去加载打包好的math.bundle.js。在需要动态导入资源时，会再次加载 
- webpackPreload：动态导入时加载，和懒加载相似

```
// 预获取和预加载都是使用魔法注释来进行配置， 将webpackPrefetch改为webpackPreload即为预加载
import(/* webpackChunkName: 'math', webpackPrefetch:true */'./math').then(({add}) => {
    console.log(add(33,44))
})
```

#### 缓存
缓存主要分三部分，
- 将JS文件都放到一个文件夹中，
- 项目文件输出加hash值
    - 防止浏览器缓存不使用最新的版本文件
- 第三方库缓存：第三方库因为不更新，文件名不需要hash值更新，使用固定值即可

```
output: {
	// js相关文件统一放到js文件夹中
	// [name] 文件本身名称, [contenthash] hash值，文件内容更改时hash值才会更改，
	filename: "js/[name]_[contenthash]_bounder.js",
}
...
optimization: {
	splitChunks: {
		cacheGroups: {
			vendor: {
				test: /[\\/]node_modules[\\/]/,
				// 将node_modules中的文件打包到verdors文件中，包中依赖不变的话生成的包名字不变
				name: "dependOn",
				chunks: "all",
			},
		},
	},
}
```

#### 开发环境与生产环境配置
> 开发环境与生产环境通常所要求的配置不同，例如生产环境代码压缩，文件名增加hash等，本小节进行开发环境与生产环境的公共配置提取及npm指令

##### 公共路径
目前生成的文件引用都是通过相对路径引用
```
<script defer src="js/dependOn_bounder.js"></script>
<script defer src="js/index_bounder.js"></script>
<script defer src="js/lodashDeepLog_bounder.js"></script>
```
但是生产环境，我们可能需要将打包产物放在CDN或者公司服务器上，可以通过公共路径进行`publicPath`进行绝对路径的引用
```
module.exports = {
    ...
    output: {
		publicPath: "http://localhost:5501/webpack/multiple-env/dist/",
		...
	}
	...
}

配置后引用
<script defer="defer" src="http://localhost:5501/webpack/multiple-env/dist/js/dependOn_bounder.js"></script>
<script defer="defer" src="http://localhost:5501/webpack/multiple-env/dist/js/index_bounder.js"></script>
<script defer="defer" src="http://localhost:5501/webpack/multiple-env/dist/js/lodashDeepLog_bounder.js">
```
通过配置公共路径，打包后的产物可以直接引用CDN或者公司服务器上的资源

##### 环境变量 Environment variable
通过环境变量，区分开发环境和生成环境，从而加载不同的配置
```
# 命令行可以增加指定环境的参数
npx webpack --env production

module.exports = (env) => {
    return {
        mode: env.production ? "production" : "development",
    }
}
```
##### 配置文件拆分
将不同的环境的配置文件拆分，并通过指令加载对应的配置文件
```
# -c 指定配置文件 
npx webpack serve -c ./config/webpack.config.dev.js // 开发环境的配置
npx webpack -c ./config/webpack.config.pro.js // 生成环境的配置
```
##### 提取公共配置
将不同配置中公共的配置提取出单独的一个文件，不同环境只需要保留对应环境的配置即可，
通过webpack-merge插件进行配置之间的合并
```
// 安装插件
npm install webpack-merge -D

// webpack.config.js
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.config.common");
const productionConfig = require("./webpack.config.prod");
const developmentConfig = require("./webpack.config.dev");

module.exports = (env) => {
  switch (true) {
    case env.development:
      return merge(commonConfig, developmentConfig);
    case env.production:
      return merge(commonConfig, productionConfig);

    default:
      return new Error("No match configuration was found");
  }
};
```
这样只需要`npx webpack -c ./config/webpack.config.js --env production/development`,可通过env变量加载对应的配置文件
##### npm脚本
通过配置npm脚本，简化命令行输入
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "npx webpack serve -c ./config/webpack.config.js --env development",
    "build": "npx webpack -c ./config/webpack.config.js --env production"
},

//执行
npm run start/build
```

小结：本章通过`webpack`的基本使用，资源模块，JS编译，代码分离，缓存，开发环境与生产环境配置几个小块，讲述了webpage的基础使用及基本概念