"use strict";(self.webpackChunksource_map=self.webpackChunksource_map||[]).push([[282],{49282:(n,e,t)=>{t.r(e),t.d(e,{default:()=>o});const o="### 模块\n>文件中只要包含了export或者import，该文件就是一个模块，文件中不包含这些东西就是全局的脚本文件\n\n模块本身就是一个作用域，不属于全局作用域，必须用`export`才能将内部的变量，函数，类暴露出去，别的文件使用的话需要用`import`引入\n\n本次做测试的TS变量名，不同文件起同样的名字会导致重命名问题，在开头加上`export {}`解决该问题，相当于是把当前文件当做模块处理，所有的代码都变成了内部代码\n\nTS支持所有ES模块语法，并且加上了输入和输出类型\n```\nexport type Bool = true | false;\n// 等同于\ntype Bool2 = true | false;\nexport { Bool2 };\n// 将上面文件看做a.ts，那么b.ts文件引入的可以使用import输入该类型\nimport { Bool } from './a';\nlet aoo: Bool = true;\n// 使用TS编译可以同时编译也可以单独编译b.ts，tsc会自动编译依赖的所有脚步\n// tsc a.ts b.ts\n// tsc b.ts\n```\n#### import type\nimport 可以在一条语句中同时输入类型和正常接口\n```\n// a.ts\nexport interface A {\n    foo: string;\n}\nexport let a = 123;\n// b.ts\nimport { A, a } from './a';\n// 作为区分，我们可以使用type关键字或者import type来输入类型和接口\nimport { type A, a } from './a'; // 正确\nimport type { A } from './a'; // 正确\nimport type { a } from './a'; // 报错\n// 输入默认类型\nimport type DefaultType from 'moduleA';\n// 输入所有类型\nimport type * as TypeNS from 'moduleA';\n```\n和import 对应的，export也可以单独输出类型\n```\ntype A = 'a';\ntype B = 'b';\n// 方法一\nexport { type A, type B };\n// 方法二\nexport type { A, B };\n```\n#### importsNotUsedAsValues 编译预设\n预设编译是用来处理TS特有的输入类型(type)的`import`，将其编译成JS，可以通过设置`importsNotUsedAsValues`的值，有以下三个值\n1. remove，自动删除输入类型的import语句\n2. preserve，保留输入类型的import语句\n3. error，和preserve一样，但是必须写成 import Type形式，否则报错\n```\nimport { TypeA } from './a';\n```\n`remove`会将改句删除，`preserve`会将起改为`import './a'`;，保留`a.js`的副作用， `error`编译结果和`preserve`相同，但是必须改为`import type { TypeA } from './a';`，否则报错\n\n#### CommonJS\nCommonJS是node.js模块专用，与ES模块不兼容\nTS使用`import =`和`export =` 输入和输出，具体如下\n```\nimport fs = require('fs');\n// 等同于\nimport * as fs from 'fs';\nconst code = fs.readFileSync('hello.ts', 'utf8');\n\nlet obj = { foo: 123 };\nexport = obj;\n```\n在node环境的TS文件中，兼容JS的导入导出，但是使用`export =`输出的对象，只能使用 `import =`加载\n\n#### 模块定位\n模块定位是用来确定`import`和`export`里模块文件位置的算法。\n\n编译参数`moduleResolution`可以指定算法，和编译参数`module`有关，`module`值为`common.js`，值默认为`node`\n其余为`classic`，`classic`就是相对模块的定位算法，`node`为`Node.js`模块加载方法，也就是`require()`实现，会根据导入进行相对模块和非相对模块的模块加载\n\n相对模块，以路径 `/`、 `./`、 `../` 开头的模块，根据脚本当前的位置进行计算\n```\nimport { TypeA } from './a';\n```\n非相对模块，不带有路径信息，由baseURL和模块映射确定，通常加载外部模块\n```\nimport * as $ from \"jquery\";\n```\n\n#### 路径映射\n在`tsconfig.json`文件里，我们可以手动指定脚本模块的路径\n`baseUrl`: 基准模块，基准目录为`tsconfig.js`所在目录，`paths`: 非相对路径的模块与实际脚本的映射\n\n```\n{\n    \"compilerOptions\": {\n        \"baseUrl\": \".\",\n            \"paths\": {\n            \"jquery\": [\"node_modules/jquery/dist/jquery\"]\n        }\n    }\n}\n// 在项目开发中，我们可以配置这两个属性完成路径别名映射\n{\n    \"baseUrl\": \"./\",\n        \"paths\": {\n        \"@/*\": [\"src/*\"],\n            \"@s/*\": [\"src/store/*\"]\n    }\n}\n```\n\n\n\n### 类型断言\nTS默认会进行类型推断，但类型推断部分时候不是想要的结构，这时可以通过类型断言达到我们想要的结果\n一旦进行了类型断言，TS就不再进行类型推断\n```\ntype T = 'a' | 'b' | 'c';\nlet foo = 'a'; // foo会推断为string\nlet bar: T = foo; // 报错\n\nlet foo2 = 'a' as T\nlet bar2: T = foo2 // 正确\n\nlet foo3 = 'a'\nlet bar3: T = <T>foo3 // 正确\n```\n上面我们可以通过`as`将`foo2`断言为类型`T`，这样就不报错了\n我们可以通过`<类型>值`:`<Type>value`，和`值 as 类型`: `value as Type`进行断言，通常用`as`多一些\n\n案例\n```\nconst p: { x: number } = { x: 0, y: 0 }; // 报错\nconst p0: { x: number } = { x: 0, y: 0 } as { x: number }; // 正确\nconst p1: { x: number } = { x: 0, y: 0 } as { x: number; y: number }; // 结构类型，子类型可以赋值给父类型\n\nconst username = document.getElementById('username');\nif (username) {\n    (username as HTMLInputElement).value; // 正确\n}\n```\n类型断言的应该谨慎使用，因为改变了TS的类型检查，所以存在安全隐患\n\n```\nconst data: object = {\n    a: 1,\n    b: 2,\n    c: 3\n};\ndata.length; // 报错\n(data as Array<string>).length; // 正确\n\n```\n\n类型断言可以定`unknown`类型为具体类型\n```\nconst value: unknown = 'Hello World';\nconst s1: string = value; // 报错\nconst s2: string = value as string; // 正确\n```\n\n#### 类型断言的条件\n类型断言是不能将某个值断言为任意类型\n```\nconst n = 1;\nconst m: string = n as string; // 报错 无法将number类型断言为string类型\n```\n类型断言的使用前提是值的实际类型与断言类型必须满足的一个条件是值和断言的类型是子类型关系\n```\nexpr as T\n```\n我们将`expr`看做值，`T`看做类型断言，要么需要`expr`是`T`的子类型，要么`T`是`expr`的子类型\n所以类型断言必须是存在类型兼容，而不能断言为无关类型\n\n 因为`unknown`和`any`是所有类型的父类型，所以可以使用这两个类型当成中介类型进行无关类型断言\n```\n<T><unknown>expr\nexpr as unknown as T\n\nconst n1 = 1;\nconst m1: string = n1 as unknown as string; // 正确\n```\n#### as const 断言\n`as const`断言，可以将变量的类型推断为只读的常量\n```\nlet s = 'JavaScript'; // 类型推断为基本类型 string\ntype Lang = 'JavaScript' | 'TypeScript' | 'Python';\nfunction setLang(language: Lang) {\n    /* ... */\n}\nsetLang(s); // 报错\n```\n使用`const`定义`s`，或者使`用as const`断言可以解决该问题\n```\nlet ss = 'JavaScript' as const;\nsetLang(ss);  // 正确\nconst sn = 'JavaScript' // 类型推断为字符串 “JavaScript”\nsetLang(sn);  // 正确\n```\n`as const`断言只能用于字面量，不能用于变量或表达式\n```\nlet s4 = 'JavaScript';\nsetLang(s4 as const); // 报错\nlet s5 = s4 as const; // 报错\nlet s6 = ('Java' + 'Script') as const; // 报错\n```\n\nas const用于数组可以将数组变为只读元组，用于对象会将对象变为只读对象\n```\nfunction add(x: number, y: number) {\n    return x + y;\n}\nconst nums = [1, 2];\nconst total = add(...nums); // 报错\nconst nums2 = [1, 2] as const;\nconst total2 = add(...nums2); // 正确\n\nconst v2 = {\n    x: 1 as const,\n    y: 2,\n}; // 类型是 {readonly x: 1; y: number; }\nconst v3 = {\n    x: 1,\n    y: 2,\n} as const; // 类型是 { readonly x: 1; readonly y: 2; }\n```\n#### 非空断言\n对于可能为空的变量`(undefined|null)`，TS提供了非空断言，保证变量不为空，写法是在变量名后面加上`!`\n```\nfunction f(x?: number | null) {\n    validateNumber(x); // 自定义函数，确保 x 是数值\n    console.log(x!.toFixed());\n}\nfunction validateNumber(e?: number | null) {\n    if (typeof e !== 'number')\n        throw new Error('Not a number');\n}\n```\n经过`validateNumber`函数，`x`肯定不为空，但是直接调用`x.toFixed`会报错，这时可以使用非空断言\n\n非空断言可以省去一些额外的判断，在确保安全的情况下可以使用\n```\nconst root = document.getElementById('root');\n// 报错\nroot.addEventListener('click', e => { });\n// 使用非空断言可以直接增加监听函数\nconst root2 = document.getElementById('root')!;\nroot2.addEventListener('click', e => { });\n// 使用非空断言进行赋值断言\nclass Point {\n    x: number; // 报错\n    y: number; // 报错\n    x2!: number; // 正确\n    y2!: number; // 正确\n    constructor(x: number, y: number, x2: number, y2: number) {\n        // ...\n    }\n}\n```\n#### 断言函数\n断言函数是用于函数参数符合某种类型的殊函数，如果达不到要求，会抛出错误，中断程序执行，达到要求就会正常进行，不进行任何操作\n```\nfunction isString(value: unknown): asserts value is string {\n    // asserts value is string，该函数用来断言value的类型是string，达不到要求就会中断\n    if (typeof value !== 'string')\n        throw new Error('Not a string');\n}\nfunction toUpper(x: string | number) {\n    isString(x);\n    return x.toUpperCase(); // 不报错\n}\n```\n如上，通过断言函数，再调用`x.toUpperCase`就不报错了\n断言函数的参数实际检查，需要开发者进行实现\n断言函数`asserts`语句等同于`void`, 不能有具体的返回值\n\n 断言参数非空，可以使用工具类型`NonNullable<T>`\n```\nfunction assertIsDefined<T>(value: T): asserts value is NonNullable<T> {\n    if (value === undefined || value === null) {\n        throw new Error(`${value} is not defined`)\n    }\n}\n```\n当断言参数是否为真是，还可以使用简写\n```\nfunction assert(x: unknown): asserts x {\n    if (!x) {\n        throw new Error(`${x} should be a truthy value.`);\n    }\n}\n```\n断言函数不等于类型保护函数，类型保护函数是返回一个布尔值\n```\nfunction isString2(value: unknown): value is string {\n    return typeof value === 'string';\n}\n```\n### namespace 命名空间\nTS自己的模块格式，有ES模块后，官方已不推荐使用，本次只做简单介绍\n`namespace` 用来建立一个容器，内部的所有变量和函数，都必须在这个容器里面使用。\n外部使用内部成员可以用`export` 前缀，表示输出该成员\n```\nnamespace Utils {\n    function isString(value: any) {\n        return typeof value === 'string';\n    }\n    export function log(msg: string) {\n        console.log(msg);\n    }\n    export function error(msg: string) {\n        console.error(msg);\n    }\n    // 正确\n    isString('yes');\n}\n\nUtils.isString('no'); // 报错\nUtils.log('Call me'); // 正确\nUtils.error('maybe!'); // 正确\n```\n\n\n\n\n\n"}}]);
//# sourceMappingURL=282.chunk.js.map