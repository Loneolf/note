### 开发效率与开发规范

#### source-map

[参考文章1](https://juejin.cn/post/7209648356530962489)，[参考文章2](https://juejin.cn/post/7136049758837145630)

开发环境我们可以通过source-map帮助我们将错误信息映射到对应的源码位置，webpack内置了该功能，通过配置`devtool`就可以开启或者关闭该功能
```
    module.exports = {
        ...
    	devtool: 'source-map'
    	...
    }
```
source-map简而言之就是一个以.map为后缀的文件，该文件以json的格式存储了源代码打包后的位置信息
```
    {
        "version": 3,  // sourcemap版本号
        "file": "index_bounder.js", // 打包构建后的文件名，该map文件与之对应，只是多了.map后缀
        "mappings": ";;;;;AAAA", // 源代码位置与构建产物之间的映射
        "sources": [ // 指该bundle对应的源码文件，一个bundle文件可能存在多个源码文件内容
            "webpack://source-map/./index.js"
        ],
        "sourcesContent": [ // 源码文件对应的内容字符
            "console.log('aaa2333,hello呀,树哥')"
        ],
        "names": [], // 指在代码在经历混淆压缩之前的变量名，这个变量名包含导入模块名、常用方法名
        "sourceRoot": "" //源码目录
    }
```
##### devtool 选项配置，值类型包含以下类型组合

*   eval
    *   每个module会封装到eval里包裹起来执行，并且会在末尾追加注释，可以定位到JS Babel编译后代码
    *   不用生成`.map`文件，包含映射信息相对较少
*   source-map: 生成一个SourceMap文件，可以定位到JS编译前的代码（源代码文件），提供详细的信息
*   cheap: 生成一个没有列信息（column-mappings）的`SourceMaps`文件，可以定位到编译后的代码
*   module: 生成的sourcemap包含和loader相关的sourcemap信息，可以定位到源码
*   inline: 将原本生成的`.map`文件的内容作为`DataURL（base64 形式）`嵌入`bundle`文件中，不单独生成 .map 文件
*   hidden: 和source-map一样，但不会在bundle末尾追加注释，无法定位源代码和JS编译后代码位置
*   nosources: 在能够保证文件路径可以准确建立映射的情况下，把`sourceContent`的内容给去除掉，使得`.map`文件体积能够更小一些

| devtool                                 | 构建速度：build(初次构建)<br> rebuild(重新构建)     | 效果                                                                                  |
| --------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| false                                   | build: fastest <br /> rebuild: fastest | 不开启source-map                                                                       |
| eval                                    | build: fast <br /> rebuild: fastest    | 每个module会封装到eval里包裹起来执行，并且会在末尾追加注释，<br>可以定位到JS Babel编译后代码                           |
| source-map                              | build: slowest <br /> rebuild: slowest | 生成一个SourceMap文件，<br>可以定位到JS编译前的代码（源代码文件）                                            |
| hidden-source-map                       | build: slowest <br /> rebuild: slowest | 和source-map一样，但不会在bundle末尾追加注释，<br>无法定位源代码和JS编译后代码位置                                |
| inline-source-map                       | build: slowest <br /> rebuild: slowest | 生成一个DataUrl形式的SourceMap文件，不会单独打包一个map文件，<br>可以定位到源代码                                |
| eval-source-map                         | build: slowest <br /> rebuild: ok      | 每个module会通过eval（）来执行，并生成一个DataUrl形式的SourceMap，<br>可以定位到源代码                          |
| cheap-source-map                        | build: ok <br /> rebuild: slow         | 生成一个没有列信息（column-mappings）的SourceMaps文件，<br>可以定位到JS Babel编译后代码                      |
| cheap-module-source-map <br> （推荐开发过程使用） | build: slow <br /> rebuild: slow       | 生成一个没有列信息（column-mappings）的SourceMaps文件，<br>同时loader的sourcemap也被简化为只包含对应行的。可以定位到源代码 |

上述表格列举了7个devtool值及其效果
`sourcemap`除了映射规则，还需要解析工具才能将源代码和sourcemap规则真正进行映射，
浏览器默认开启该功能，一般在设置-> 首选项-> 启用`JavaScript`源映射
还可以通过异常监控系统（如：sentry）或者手动映射

#### devServer

[参考文档](https://juejin.cn/post/7147636643099312136)

> 原理：devServer可以启动一个http服务，在webpack构建的时候，监听文件，如果文件发生变化，将会启动webpack的自动编译

devServe是webpack中重要的功能， 它可以让我们以`http`服务形式加载文件，更加贴合`生产环境`,提供`sourceMap`,开发时协助我们自动编译、自动刷新浏览器界面，从而提高我们的开发效率
常用配置如下
```
    devServer: {
    	static: path.resolve(__dirname, "./dist"),
    	// 设置是否在服务器端进行代码压缩，以减少传输过程中的数据大小
    	// Accept-Encoding: gzip，说明服务器到客户端传输的过程中，文件是被压缩的,浏览器默认有解压缩功能，该功能现在默认开启
    	compress: true,
    	// 自定义端口号
    	port: 3000,
    	// 添加响应头
    	headers: {
    		"X-Access-Token": "adfasdfa",
    	},
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
    	// 改动不仅在内存，也写到硬盘上
        devMiddleware: {
          writeToDisk: true,
        },
        // 存在异常时，错误页面不在页面的最上层
        client: {
          overlay: false,
        },
    	https: true, // 是否开启https
    	http2: true,  // 开启http2，可以使用https访问
    	// historyApiFallback: true // 异常时，回到历史中正确的页面，可以使用rewrites自定义页面
    	historyApiFallback: {
            rewrites: [
                {from: /.*/, to: '/error.html'}
            ]
        },
    	host: '0.0.0.0' //开启服务器主机，同局域网内的同事也能访问
    }

    //package.json，
    "scripts": {
        "dev": "npx webpack", // 无serve打包，每次更改都需要执行
        "serve": "npx webpack serve", // 使用serve实现自动局部更新
        "serveOpen": "npx webpack serve --open" // --open，自动打开浏览器
    },
```
常用的功能是port端口号和proxy代理，代理的配置可以直接写路径，也可以用对象重写路径等

##### 模块热替换与热加载 HMR

devServer中热替换与热加载默认是开启的

热替换: 开发过程中，只替换、添加、删除页面的某个模块，不影响其它模块，也无需重新加载整个页面
```
    devServer: {
        // 默认开启，不需要设置，关闭改为false即可
        hot: true, // 热替换(局部替换)
    	liveReload: false, // 热加载(页面刷新，关闭的话需要关闭hot)
    },
```
css通常不用处理，因为`style-loader`实现了`module.hot.accept`,自动实现热替换
JS文件如果想要实现热替换，在JS引入的文件中加上以下代码，使用框架时框架已帮我们处理好了热替换，不需要加下面的代码
```
    if (module.hot) {
        // 接受一个文件，当它变化时热替换，回调函数在热替换时执行
        module.hot.accept("./input.js",() => {
          ...
        });
    }

    // 热替换浏览器的输出
    [webpack-dev-server] App updated. Recompiling...
    [webpack-dev-server] App hot update...
    [HMR] Checking for updates on the server...
    [webpack-dev-server] App hot update...
    [HMR] Updated modules:
    [HMR]  - ./input.js
    [HMR] App is up to date.
```
#### ESLint

团队开发中，ESLint是代码规范必不可少的工具，Eslint可以和VSCode插件搭配使用，也可以和webpack中配置提示

本地安装ESLint
```
    npm install eslint  @eslint/create-config -D
```
和`webpack`需要`webpack.config.js`配置一样， ESLint也需要配置配置文件`.ellintrc`(.json.js等)，该文件可以使用指令生成

```
npx eslint --init

// 生成后的文件如下，rules中的非生成，是后续我加的
{
    "env": { // 指定脚本的运行环境
        "browser": true, 
        "es2021": true
    },
    "extends": "airbnb-base",  // 扩展，使用了airbnb-base的ESLint扩展，比较严格
    "parserOptions": { // 支持的JS语言选项
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": { // 规则，0为关闭
        "linebreak-style": 0,
        "import/no-import-module-exports": 0,
        "import/extensions": 0,
        "import/no-extraneous-dependencies": 0,
        "no-console": 0
    }
}

```

该文件生成后，VScode插件`Eslint`等会自动读取该文件并对项目中的文件做检测，也可以用`npx eslint 文件夹\文件名`指令进行检测

配合webpack可以实现检测到的异常在控制台或者页面显示

    npm i eslint-webpack-plugin -D

    const HtmlWebpackPlugin = require("html-webpack-plugin");
    const ESLintPlugin = require("eslint-webpack-plugin");

    module.exports = {
      mode: "development",
      entry: "./src/app.js",
      devServer: {
        client: { // 该配置可以使异常不在document最上层弹出，只在控制台输出即可看到异常完成正常的调试
          overlay: false,
      },
      plugin: [new HtmlWebpackPlugin(), new ESLintPlugin()],
    };

#### Git-hooks & husky

> Git hook 是一种在 Git 版本控制系统中自动执行的脚本或命令。它们可以在特定的 Git 操作（例如提交代码、推送更改等）之前或之后执行，以实现一些自动化任务。

Git hook 分为三种类型：

*   提交钩子（Commit hooks）：在提交代码之前或之后执行。
*   推送钩子（Push hooks）：在推送代码到远程仓库之前或之后执行。
*   签出钩子（Checkout hooks）：在签出代码之前或之后执行。

在 Git 仓库的 .git/hooks 目录中找到默认的 Git hook 文件。可以直接编辑这些文件来添加自己的脚本或命令执行代码检查或者代码格式化。
通常使用GitHooks进行commit检查，检查是否符合对应的格式化要求，本篇章主要讲解husky，进行代码提交时的eslint校验
[husky说明文档](https://www.npmjs.com/package/husky)
按照说明文档依次执行如下
```
    // 安装
    npm install husky --save-dev
    // 使用npm指令进行初始化
    npm pkg set scripts.prepare="husky install"
    npm run prepare
    // 添加提交前的ESlint检测
    npx husky add .husky/pre-commit "npx eslint ./src"
    git add .husky/pre-commit

    后面进行commit就会校验是否符合ESLint规范了，不符合就commit不成功
```
关于Windows系统的异常`LF will be replaced by CRLF in **`
`LF`和`CRLF`其实都是换行符，但是不同的是，LF是linux和Unix系统的换行符，CRLF是window 系统的换行符。git为了解决这个问题，提供了一个”换行符自动转换“的功能，并且这个功能是默认处于”自动模式“即开启状态的。
这个换行符自动转换会把自动把你代码里 与你当前操作系统不相同的换行的方式 转换成当前系统的换行方式（即LF和CRLF 之间的转换），这样一来，当你提交代码的时候，即使你没有修改过某个文件，也被git认为你修改过了，从而提示"LF will be replaced by CRLF in \*\*\*\*\*"

解决办法就是关掉自动转换功能即可
```
    git config core.autocrlf false 
    git config --global core.autocrlf false  // 全局生效

    // warning级别的警告可忽略，改配置在公司项目中需要谨慎修改
```
### webpack模块与解析原理

#### 模块解析(resolve)

webpack通过Resolvers实现了模块之间的依赖和引用。举个例子:
```
    import _ from'lodash';
    // 或者
    const add = require('./utils/math');
```
所引用的模块可以是来自应用程序的代码，也可以是第三方库。`resolver` 帮助 `webpack` 从每个`require/import` 语句中，找到需要引入到`bundle`中的模块代码。当打包模块时，webpack 使用`enhanced-resolve`来解析文件路径(webpack基于此进行treeshaking)。

##### webpack中的模块路径解析规则

通过内置的`enhanced-resolve`， `webpack`能解析三种文件路径:

*   绝对路径
```
    import '/home/me/file';
    import 'c:\\Users\\mellfile';
```
由于已经获得文件的绝对路径，因此不需要再做进一步解析

*   相对路径
```
    import '../utils/regFetch';
    import './styles .css';
```
这种情况下，使用 impot 或 require 的资源文件所处的目录，被认为是上下文目录。在`import/require`中给定的相对路径，`enhanced-resolve`会拼接此上下文路径，来生成模块的绝对路径`(path.resolve(_dirname, RelativePath)`

*   模块路径
```
    import 'module;'
    import 'module/lib/file'
```
node\_modules路径，在node\_modules中寻找

无论使用绝对路径还是相对路径，当代码过多，层级过多，都不方便引用某些非同级文件，此时我们可以使用`webpack`配置路径别名来实现文件的引用
```
    resolve: {
        // 路径别名，@代表'./src'，引入'./src/util/math',可以简化为'@/util/math'
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        // 同名文件，配置加载顺序
        extensions: [".json", ".js"],
    },
```
`webpack`会自动帮我们处理文件后缀，所以引入文件不需要加`.js\.json`,但出现同名文件，会有加载顺序的问题，
我们可以使用`extensions`配置同名文件的加载顺序

#### 外部扩展

有些时候当我们为了减少`bundle`体积，把一些不变的第三方库用`cdn`的方式引入文档，可以用`webpack`的`externals`配置属性，实现外部扩展模块
可以分别用手动引入和`wbpack`自动引入两种方式

手动引入外部依赖，需要在模板`html`中引入`cdn`文件，使用的时候用`webpack`中配置的暴露出去的名字即可
```
    externals: {
        // key: 与引用的包名一致
        // value: script标签加载的对象所暴露出来的值
        lodash: "_",
    },

    // app.js
    import lodash from "lodash";
    console.log($);

    // index.html head中引入
     <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
```
webpack配置自动引入，这种方式不需要html模板，webpack自动打包到生成的html中去
```
    // 定义外部资源引入的形式
    externalsType: "script",
    externals: {
        lodash: [
          // 数组第一项为cdn引用地址
          "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js",
          // 数组第二项为暴露的对象名
          "_",
        ],
    },
```
#### 依赖图

> 每当一个文件依赖另一个文件时，`webpack`会直接将文件视为依赖关系。这使得`webpack`可以获取非代码资源，如`images，fonts`等，并会它们作为依赖提供给应用程序。当`webpack`开始工作时，它会根据配置，从入口`entry`开始，`webpack`会递归地构建一个依赖关系图。这个依赖图包含着应用程序的每个模块，然后将所有模块打包为bundle（也就是output的配置项）

我们可以用`webpack-bundle-analyzer`来分析`bundle`，将打包产物的依赖可视化和简单交互
配置如下，使用`npm i`安装即可使用,
```
    const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
    plugins: [
        new HTMLWebpackPlugin(),
        new BundleAnalyzerPlugin(),
    ],
```
启动项目后会自动在本地启动8888的端口号展示依赖关系

#### PostCSS与CSS模块

部分样式存在浏览器兼容问题，需要根据不同的浏览器添加不同的前缀，这时我们可以用PostCSS

`PostCSS` 是一个用 `JavaScript` 工具和插件转换 `CSS` 代码的工具。比如可以使用 `Autoprefixer` 插件自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮我们自动的为`CSS`规则添加前缀，将最新的 `CSS` 语法转换成大多数浏览器都能理解的语法
`Css` 模块可以实现给类名增加base64的hash值，解决命名冲突

具体配置如下
```
    // 安装对应的包
    npm i style-loader css-loader postcss-loader autoprefixer -D

    // 新增postcss.config.js配置文件，配置内容如下
    module.exports = {
        plugins: [require('autoprefixer')]
    };
    // package.json增加浏览器信息
    "broeserslist": [ 
      "> 1%", // 份额大于 1% 的浏览器
     "last 2 versions"
    ]

    // webpack配置
    module: {
        rules: [
          {
            test: /\.(css|scss)$/,
            use: [
              'style-loader', 
              {
                // css模块化
                loader: 'css-loader',
                options: { 
                  modules: {
                   // [path]:相对于webpack.config.js的绝对路径， [name]:文件名字，[local]:class类名， [hash]: base64随机值，可以设置位数
                   // 通常只需要[local]_[hash:base64:6]即可满足需求
                    localIdentName: '[path]_[name]_[local]_[hash:base64:6]',
                  }, 
                  // css-loader前面有几个loader, 如果只有postcss-loader,值为1，如果还有sass-loader,值为2，依次类推
                  importLoaders: 2 
                },
              },
              {
                loader: 'postcss-loader',
              },
              'sass-loader',
            ],
          },
        ],
      },
      需要注意点的点：rule中{ loader: 'postcss-loader',},写法和'postcss-loader'作用等效，前者可以扩展更多的内容
```
当css为module，我们就可以以对象的方式使用css，如下
```
    import css from './index.css';

    let div = document.createElement('div')
    div.className=css.item
    document.body.appendChild(div)

    如果一些全局样式不想被css modules模式加载，可以使用:global，这样样式就不会被编译
    :global(.item3){
        width: 200px;
        height: 200px;
        background-color: blue;
        display: flex;
    }
```
#### web Works

[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)  [参考文章](https://zhuanlan.zhihu.com/p/117615638)

> web works提供了后台处理线程的API，可以用来完成复杂耗时的工作，把它后台处理，让js线程不阻塞UI线程的渲染，避免浏览器被阻塞。\*\*webpack5内置了打包work.js的功能，会打包出“src\_work\_js.js"的文件

web works简单使用
```
    // app.js 创建worker线程
    const worker = new Worker(new URL("./work.js", import.meta.url));
    post("hello world");
    // 通过postMessage发送事件，数据是可以结构化克隆的数据，在work线程结构化克隆数据副本拿到数据
    function post(text) {
    	worker.postMessage({ text });
    }
    // 接受work线程发回的数据
    worker.onmessage = (message) => {
    	console.log(message.data.answer);
    	// 终止线程，线程终止后再发送事件将得不到相应
    	worker.terminate();
    };
    // 监听异常
    worker.onerror = (err) => {
        worker.terminate();
    	console.log(err.filename, err.lineno, err.message); // 发生错误的文件名、行号、错误内容
    }

    // work.js
    // 接受主线程发送的信息并发送信息
    self.onmessage = (message) => {
    	self.postMessage({
    		answer: message.data.text,
    	});
    };
```
虽然使用worker线程不会占用主线程，但是启动worker会比较耗费资源

主线程中使用XMLHttpRequest在请求过程中浏览器另开了一个异步http请求线程，但是交互过程中还是要消耗主线程资源

#### TypeScript

在前端生态里，TS扮演着越来越重要的角色。本小节简单介绍webpack工程环境集成TS，TS详细内容会分几个篇章具体介绍

和其它的类型`loader`一样，`TS`配置对应的`loader`即可解析成浏览器能识别的`JS`文件
```
    // 安装
    npm install --save-dev typescript ts-loader
    // webpack配置
    module: {
    	rules: [
    		{
    			test: /\.ts$/,
    			use: "ts-loader",
    			exclude: /node_modules/, // 排除node_modules文件
    		},
    	],
    },
    resolve: {
    	// 自定义解析顺序，优先解析ts
    	extensions: [".ts", ".js"],
    },
```
TS需要在项目根目录下有配置文件才能是webpack配置生效
```
    // 使用ts自带的工具生成tsconfig.json
    npx tsc --init
    // 生成的配置中打开以下几项即可
    {
    	"compilerOptions": {
    		"target": "es5" ,
    		"module": "es6",
    		"rootDir": "./src",                            
    		"jsx": "react",    
    		"sourceMap": true,
    		"outDir": "./dist" ,
    	}
    }
```
TS项目需要注意的是项目中安装的依赖包都需要对应的声明文件，例如安装了`lodash`，也需要安装`@types/lodash`,
npmjs网站中搜索依赖包前面加上type基本就能找到对应的TS声明依赖包

tsconfig.json常用配置及说明
```
{
  "compilerOptions": {
    "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
    "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
    "diagnostics": true, // 打印诊断信息 
    "target": "ES5", // 目标语言的版本
    "module": "CommonJS", // 生成代码的模板标准
    "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
    "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
    "allowJS": true, // 允许编译器编译JS，JSX文件
    "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
    "outDir": "./dist", // 指定输出目录
    "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
    "declaration": true, // 生成声明文件，开启后会自动生成声明文件
    "declarationDir": "./file", // 指定生成声明文件存放目录
    "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
    "sourceMap": true, // 生成目标文件的sourceMap文件
    "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
    "declarationMap": true, // 为声明文件生成sourceMap
    "typeRoots": [], // 声明文件目录，默认时node_modules/@types
    "types": [], // 加载的声明文件包
    "removeComments":true, // 删除注释 
    "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
    "noEmitOnError": true, // 发送错误时不输出任何文件
    "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
    "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
    "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
    "strict": true, // 开启所有严格的类型检查
    "alwaysStrict": true, // 在代码中注入'use strict'
    "noImplicitAny": true, // 不允许隐式的any类型
    "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
    "strictFunctionTypes": true, // 不允许函数参数双向协变
    "strictPropertyInitialization": true, // 类的实例属性必须初始化
    "strictBindCallApply": true, // 严格的bind/call/apply检查
    "noImplicitThis": true, // 不允许this有隐式的any类型
    "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
    "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
    "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
    "noImplicitReturns": true, //每个分支都会有返回值
    "esModuleInterop": true, // 允许export=导出，由import from 导入
    "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
    "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": { // 路径映射，相对于baseUrl
      // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
      "jquery": ["node_modules/jquery/dist/jquery.min.js"]
    },
    "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
    "listEmittedFiles": true, // 打印输出文件
    "listFiles": true// 打印编译的文件(包括引用的声明文件)
  }
}
```

#### 多页面环境搭建

部分情况为了网站更好的SEO，我们需要搭建多页面应用，

多页面应用需要注意点有几个点，多入口(共同依赖声明)、自定义html模板、公共chunk抽离与引用等，基本配置如下
```
    module.exports = {
      entry: {
        // 使用对象的方式定义入口，而不是'./src/index.js'这样的字符串，可配置更多内容
        main: {
          // 将多个文件打包合成一个文件
          import: ['./src/app1.js', './src/common.js'],
          // 声明依赖
          dependOn: 'lodash',
          // 输出到page1文件夹下
          filename: 'page1/[name].js'
        },
        main2: {
          import: ['./src/app2.js', './src/common.js'],
          dependOn: 'lodash',
          filename: 'page2/[name].js'
        },
        // 第三方库依赖
        lodash: {
          import: 'lodash',
          filename: 'common/[name].js'
        },
      },
      plugins: [
        new HTMLWebpackPlugin({
          template: './index.html', // html模板
          // title: 页面的title，在html模板中可以使用 <title><%= htmlWebpackPlugin.options.title %></title> ejs语法可以接收到title的值
          title: '页面1', 
          inject: 'body', // 生成的JS标签注入到body标签里
          // 注入chunk main和lodash这两个, entry入口的key值
          chunks: [ 'main', 'lodash' ],
          // 生成的文件为index.html, 在page1文件夹下
          filename: 'page1/index.html'
        }),
        new HTMLWebpackPlugin({
          template: './index.html',
          title: '页面2',
          inject: 'body',
          chunks: [ 'main2', 'lodash'],
          filename: 'page2/index.html'
        })
      ],
      output: {
        // chunk输出文件夹
        path: path.resolve(__dirname, './dist'),
        clean: true,
        // chuank输出文件名，在入口配置fileName后该配置就不生效了
        filename: '[name]_bounder.js',
      },
      devtool: 'cheap-module-source-map',
      mode: 'development', // development / production
      devServer: {
        client: {
          overlay: false,
        },
        static: path.resolve(__dirname, './dist'),
        compress: true,
        // 自定义端口号
        port: 3000,
      },
    };
```
入口文件可以使用对象的方式，每个`chunk`都可以加载多个文件，每个`html`又可以自定义加载多个`chunk`
使用`dependOn`还可以声明公共依赖的的库，还可以使用`splitChunks`自动识别功能模块抽离单独`chunk`，在基础篇有详细介绍

可以使用一个`html`模板生成不同的`html`文件，一些变量可以用`ejs`语法承接，例如`title`可以使用
`<title><%= htmlWebpackPlugin.options.title %></title>`来承接`webpack`配置中的`title`

#### Tree Shaking [官方文档](https://www.webpackjs.com/guides/tree-shaking/) [参考文档](https://juejin.cn/post/7105022295474700295)

> `tree shaking`用于描述移除`JavaScript`上下文中的未引用代码(dead-code)。它依赖于`ES2015`模块语法的`静态结构`特性，例如`import`和`export`

在`Webpack5`中，`Tree Shaking`在生产环境下默认启动(mode: production)。如果想在开发环境启动`Tree Shaking`，配置如下
```
    // webpack.config.js，配置文件
    optimization: {
        usedExports: true
    }
```
使用`Tree Shaking`前提是基于`ES6`编写的程序，基于`CommonJS、AMD、CDM`等模块化方案，因为导入导出是动态难以预测，只要引入无论用还是不用，都不会被删除，可以搭配插件`babel-plugin-import`引入模块实现类似的功能

我们编写`util`文件，暴露出`add`和`minu`两个方法，在`app.js`引入，并使用`add`方法，实际打包后如下，
```
    "use strict";
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   add: () => (/* binding */ add)
    /* harmony export */ });
    /* unused harmony export minu */
    const add = (a, b) => {
    	return a + b;
    };

    const minu = (a, b) => {
    	return a - b;
    };
```
`webpack`会在编译过程启动标记功能，未使用的标记为unused\`，在生成产物时，被标记的变量及对应的代码块被删除

##### sideEffects

因为webpack默认生产开启`Tree Shaking`,所以如果`import **.css`就会被摇掉，为此我们可以搭配`sideEffects`告知那些文件忽略副作用
```
    "sideEffects": true，所有的代码都是有副作用的
    "sideEffects": false，所有的代码都是没有副作用的
    "sideEffects": []，自定义哪些文件是有副作用的

    // package.json配置
    "sideEffects": ["*.css", "*.global.js"],
```
#### PWA(渐进式网页应用)

本篇只做简短介绍，详细介绍在PWA章节中

需要用到插件workbox-webpack-plugin，webpack配置如下

```
const WorkboxPlugin = require("workbox-webpack-plugin");
plugins: [
    new WorkboxPlugin.GenerateSW({
      // 快速启动 ServiceWorkers
      clientsClaim: true,
      // 不允许遗留旧的ServiceWorkers
      skipWaiting: true,
    }),
]

```

该插件的作用创建`work box`，打包生成`service-worker.js`和`workbox.哈希值.js`文件，前者是主文件，后者是被引用的文件。在浏览器注册`service worker`后即可使用

在`app.js`注册
```
    // 判断是否支持service worker
    if ("serviceWorker" in navigator) {
    	console.log("enter");
    	window.addEventListener("load", () => {
    		// 返回的是个注册成功的promise对象
    		navigator.serviceWorker
    			.register("/service-worker.js")
    			// 引用打包后生成的文件
    			.then((registration) => {
    				console.log("注册成功", registration);
    			})
    			.catch((registrationError) => {
    				console.log(registrationError);
    			});
    	});
    }
```
注册`service-worker`成功后，关闭服务，页面也能正常访问
可以在chrome://serviceworker-internals/ 这个页面看到注册的线程，取消掉就不能离线访问了

#### Shimming 预置依赖 [官方文档](https://webpack.docschina.org/guides/shimming/)

当一些第三方库引入全局依赖，例如`jQuery中的$`, `lodash中的_`,这些不符合规范的模块，可以使用`shimming`配置全局使用
注：webpack理念是模块化， 正常情况不推荐使用全局变量

shimming另一个作用配置polyfill的按需加载

##### 使用Provide插件配置全局变量
```
    const webpack = require("webpack");
    plugins: [
        new webpack.ProvidePlugin({
        	// 不用引入就可以全局使用_ 从而使用lodash的方法
        	_: "lodash",
        	// 全局使用lodash的join方法
        	join: ["lodash", "join"],
        }),
    ]
    // 在全局可以不用引入lodash就使用"_"
```
##### 细粒度shimming 配置全局window [配置参考](https://webpack.docschina.org/loaders/imports-loader/)

一些遗留模块依赖的`this`指向的是`window`对象，模块运行在`commonJS`上下文，`this`指向`module.exports`,可通过`imports-loader`覆盖this指向
```
    rules: [
    	{
    		// 将this 指向window
    		// test: require.resolve("./src/app.js"), // Node.js 函数, 文件的绝对路径
    		// use: ["imports-loader?wrapper=window"],
    		test: /\.js$/,  // 使用正则匹配所以JS文件
    		use: [{
    			loader: 'imports-loader',
    			options: {
    				type: 'commonjs', // module|commonjs
    				wrapper: 'window'
    			},
    		}]
    	},
    ]
```
##### 全局exports [配置参考](https://webpack.docschina.org/loaders/expose-loader/)

某个文件创建但是未导出的方法、变量，可使用该方法配置从而可以引用
```
    rules: [
        {
        	// global.js未导出方法，可以使用改配置导出globals中的方法，可以用于一些第三方未导出的依赖包
        	test: require.resolve("./src/globals.js"),
        	// 使用字符串到处global.js 中的file变量，helper对象的parse方法
        	// use: "exports-loader?type=commonjs&exports=file,multiple|helpers.parse|parse",
        	// 使用对象方式配置导出变量与方法
        	use: [{
        		loader: 'exports-loader',
        		options: {
        			type: 'commonjs', // module|commonjs
        			exports: [
        				'file', 
        				'multiple helpers.parse parse',
        			]
        		},
        	}]
        },
    ]

    // 使用，正常导入模块使用
    const { file, parse } = require('./globals.js');
```
##### polyfill 垫片

当需要兼容低版本浏览器，代码中使用的`ES6`及以上的新语法，就得使用`polyfill`将新语法兼容成低版本浏览器可以识别的方法
1、简易使用 （不建议）
```
    // @babel/polyfill 最近一次更新已是三年前，不建议使用，简易使用 core.js
    npm install @babel/polyfill -D
    // 可以直接在主文件引入，会打包到主bundle中，这样就能兼容低版本浏览器了,
    import '@babel/polyfill'

    // 会引入整个polyfill包，体积大切污染全局环境
```
2、core.js
可以配置按需加载，可以设置`browserlist`转译主流浏览器不支持的特性
webpack配置如下
```
    npm install core-js@3 babel-loader @babel/core @babel/preset-env -D

    rules: [
    	{
    		test: /\.js$/,
    		exclude: /node_modules/,
    		use: {
    			loader: "babel-loader",
    			options: {
    				presets: [
    					[
    						"@babel/preset-env",
    						{
    							targets: ["last 1 version", "> 1%"],
    							useBuiltIns: "usage",
    							corejs: 3,
    						},
    					],
    				],
    			},
    		},
    	},
    ],
```
#### library npm包

我们通过`npm`所安装的依赖，可以通过`webpack`进行打包，使用`npm`发布，这样别人也可以安装我们的`npm`包

只需要在`output`设置`library`即可, 配置如下
```
    const path = require("path");
    module.exports = {
    	entry: {
    		app: "./src/app.js",
    	},
    	// library type为module时，及ES6，需要设置experiments属性
    	// experiments: {
    	// 	outputModule: true
    	// },
    	output: {
    		path: path.resolve(__dirname, "./dist"),
    		filename: "qing_util.js",
    		clean: true,
    		library: {
    			name: "qing_util",
    			// type取值
    			// window: 导出的方法挂载在window上，qing_util是全局的
    			// commonjs: 编译后在node环境下使用
    			// module: 可以使用ES6方式导入，实验性的属性，需要配置experiments，并设置outputModule为true
    			// umd: 支持commonJS 与 JS标签引入，对ES module支持不完善
    			type: "umd",
    		},
    		globalObject: "globalThis", // 解决commonJS环境 self问题
    	},
    	mode: "production", // development / production
    	externals: {
    	    // 第三方依赖不打包进boundle中
    		lodash: {
    			commonjs: "lodash",
    			commonjs2: "lodash",
    			amd: "lodash",
    			root: "_", 
    		},
    	},
    };
```
需要注意的是，当我们有一些第三方包不想打包进`boundle`中，并告知宿主自己需要安装，这时我们可以将依赖放到`package`中的`peerDependencies`
这样别人在下载我们的包的时候，也会把`peerDependencies`中的包下载，就像`antd`组件库，默认你是有`react`相关的包，不需要打包近组件库中

打完包需要发布有以下步骤，前置条件时需要在npmjs上注册账号
```
    npm config get registry
    // npm 源地址需要是npmjs，可通过nrm 更换
    npm config set registry http://registry.npmjs.org 
    // 设置账号
    npm adduser
    // 将package中的main入口改为打包后的入口文件
    {
      "main": "dist/qing_util.js",
    }
    // 发布
    npm publish
```
#### module federation 模块联邦

> 每个构建都充当一个容器，也可将其他构建作为容器。通过这种方式，每个构建都能够通过从对应容器中加载模块来访问其他容器暴露出来的模块。

模块联邦就是可以使用别的应用暴露出来的模块，不同于NPM依赖包，每次更改都要升级，模块联邦可以加载最新的暴露出来的模块，只需要加载的模块地址不变即可

一个应用既可以引用别的模块暴露出来的模块，也可以暴露出去模块，所使用的是`webpack`自带的插件`ModuleFederationPlugin`

引用模块: `remotes`，key为模块name，值为name+访问地址，即定义的fileName
暴露模块: `exposes`, 向外暴露模块， key为访问路径，值为模块路径

具体案例如下 [源码地址](https://github.com/Loneolf/practice/tree/master/webpack/moduleFederation)
```
    // 引入模块邦联模块
    const { ModuleFederationPlugin } = require('webpack').container

    plugins: [
        new ModuleFederationPlugin({
          // 导出的Name
          name: 'home',
          文件名称
          filename: 'remoteHome.js',
          exposes: {
            // 导出的模块
            './List': './src/List.js'
          },
          remotes: {
            // 引入别的模块
            nav: 'nav@http://localhost:3003/remoteNav.js'
          },
          shared: {},
        })
    ]

    // search项目导入home模块如下
    new ModuleFederationPlugin({
      name: 'search',
      filename: 'remoteSearch.js',
      exposes: {},
      remotes: {
        // 引入home模块，name + 线上的文件名， key为home模块的name
        home: 'home@http://localhost:3002/remoteHome.js'
      },
      shared: {},
    })
    使用如下
    import('nav/Header').then(...)

```