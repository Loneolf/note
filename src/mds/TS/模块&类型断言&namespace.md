### 模块
>文件中只要包含了export或者import，该文件就是一个模块，文件中不包含这些东西就是全局的脚本文件

模块本身就是一个作用域，不属于全局作用域，必须用`export`才能将内部的变量，函数，类暴露出去，别的文件使用的话需要用`import`引入

本次做测试的TS变量名，不同文件起同样的名字会导致重命名问题，在开头加上`export {}`解决该问题，相当于是把当前文件当做模块处理，所有的代码都变成了内部代码

TS支持所有ES模块语法，并且加上了输入和输出类型
```
export type Bool = true | false;
// 等同于
type Bool2 = true | false;
export { Bool2 };
// 将上面文件看做a.ts，那么b.ts文件引入的可以使用import输入该类型
import { Bool } from './a';
let aoo: Bool = true;
// 使用TS编译可以同时编译也可以单独编译b.ts，tsc会自动编译依赖的所有脚步
// tsc a.ts b.ts
// tsc b.ts
```
#### import type
import 可以在一条语句中同时输入类型和正常接口
```
// a.ts
export interface A {
    foo: string;
}
export let a = 123;
// b.ts
import { A, a } from './a';
// 作为区分，我们可以使用type关键字或者import type来输入类型和接口
import { type A, a } from './a'; // 正确
import type { A } from './a'; // 正确
import type { a } from './a'; // 报错
// 输入默认类型
import type DefaultType from 'moduleA';
// 输入所有类型
import type * as TypeNS from 'moduleA';
```
和import 对应的，export也可以单独输出类型
```
type A = 'a';
type B = 'b';
// 方法一
export { type A, type B };
// 方法二
export type { A, B };
```
#### importsNotUsedAsValues 编译预设
预设编译是用来处理TS特有的输入类型(type)的`import`，将其编译成JS，可以通过设置`importsNotUsedAsValues`的值，有以下三个值
1. remove，自动删除输入类型的import语句
2. preserve，保留输入类型的import语句
3. error，和preserve一样，但是必须写成 import Type形式，否则报错
```
import { TypeA } from './a';
```
`remove`会将改句删除，`preserve`会将起改为`import './a'`;，保留`a.js`的副作用， `error`编译结果和`preserve`相同，但是必须改为`import type { TypeA } from './a';`，否则报错

#### CommonJS
CommonJS是node.js模块专用，与ES模块不兼容
TS使用`import =`和`export =` 输入和输出，具体如下
```
import fs = require('fs');
// 等同于
import * as fs from 'fs';
const code = fs.readFileSync('hello.ts', 'utf8');

let obj = { foo: 123 };
export = obj;
```
在node环境的TS文件中，兼容JS的导入导出，但是使用`export =`输出的对象，只能使用 `import =`加载

#### 模块定位
模块定位是用来确定`import`和`export`里模块文件位置的算法。

编译参数`moduleResolution`可以指定算法，和编译参数`module`有关，`module`值为`common.js`，值默认为`node`
其余为`classic`，`classic`就是相对模块的定位算法，`node`为`Node.js`模块加载方法，也就是`require()`实现，会根据导入进行相对模块和非相对模块的模块加载

相对模块，以路径 `/`、 `./`、 `../` 开头的模块，根据脚本当前的位置进行计算
```
import { TypeA } from './a';
```
非相对模块，不带有路径信息，由baseURL和模块映射确定，通常加载外部模块
```
import * as $ from "jquery";
```

#### 路径映射
在`tsconfig.json`文件里，我们可以手动指定脚本模块的路径
`baseUrl`: 基准模块，基准目录为`tsconfig.js`所在目录，`paths`: 非相对路径的模块与实际脚本的映射

```
{
    "compilerOptions": {
        "baseUrl": ".",
            "paths": {
            "jquery": ["node_modules/jquery/dist/jquery"]
        }
    }
}
// 在项目开发中，我们可以配置这两个属性完成路径别名映射
{
    "baseUrl": "./",
        "paths": {
        "@/*": ["src/*"],
            "@s/*": ["src/store/*"]
    }
}
```



### 类型断言
TS默认会进行类型推断，但类型推断部分时候不是想要的结构，这时可以通过类型断言达到我们想要的结果
一旦进行了类型断言，TS就不再进行类型推断
```
type T = 'a' | 'b' | 'c';
let foo = 'a'; // foo会推断为string
let bar: T = foo; // 报错

let foo2 = 'a' as T
let bar2: T = foo2 // 正确

let foo3 = 'a'
let bar3: T = <T>foo3 // 正确
```
上面我们可以通过`as`将`foo2`断言为类型`T`，这样就不报错了
我们可以通过`<类型>值`:`<Type>value`，和`值 as 类型`: `value as Type`进行断言，通常用`as`多一些

案例
```
const p: { x: number } = { x: 0, y: 0 }; // 报错
const p0: { x: number } = { x: 0, y: 0 } as { x: number }; // 正确
const p1: { x: number } = { x: 0, y: 0 } as { x: number; y: number }; // 结构类型，子类型可以赋值给父类型

const username = document.getElementById('username');
if (username) {
    (username as HTMLInputElement).value; // 正确
}
```
类型断言的应该谨慎使用，因为改变了TS的类型检查，所以存在安全隐患

```
const data: object = {
    a: 1,
    b: 2,
    c: 3
};
data.length; // 报错
(data as Array<string>).length; // 正确

```

类型断言可以定`unknown`类型为具体类型
```
const value: unknown = 'Hello World';
const s1: string = value; // 报错
const s2: string = value as string; // 正确
```

#### 类型断言的条件
类型断言是不能将某个值断言为任意类型
```
const n = 1;
const m: string = n as string; // 报错 无法将number类型断言为string类型
```
类型断言的使用前提是值的实际类型与断言类型必须满足的一个条件是值和断言的类型是子类型关系
```
expr as T
```
我们将`expr`看做值，`T`看做类型断言，要么需要`expr`是`T`的子类型，要么`T`是`expr`的子类型
所以类型断言必须是存在类型兼容，而不能断言为无关类型

 因为`unknown`和`any`是所有类型的父类型，所以可以使用这两个类型当成中介类型进行无关类型断言
```
<T><unknown>expr
expr as unknown as T

const n1 = 1;
const m1: string = n1 as unknown as string; // 正确
```
#### as const 断言
`as const`断言，可以将变量的类型推断为只读的常量
```
let s = 'JavaScript'; // 类型推断为基本类型 string
type Lang = 'JavaScript' | 'TypeScript' | 'Python';
function setLang(language: Lang) {
    /* ... */
}
setLang(s); // 报错
```
使用`const`定义`s`，或者使`用as const`断言可以解决该问题
```
let ss = 'JavaScript' as const;
setLang(ss);  // 正确
const sn = 'JavaScript' // 类型推断为字符串 “JavaScript”
setLang(sn);  // 正确
```
`as const`断言只能用于字面量，不能用于变量或表达式
```
let s4 = 'JavaScript';
setLang(s4 as const); // 报错
let s5 = s4 as const; // 报错
let s6 = ('Java' + 'Script') as const; // 报错
```

as const用于数组可以将数组变为只读元组，用于对象会将对象变为只读对象
```
function add(x: number, y: number) {
    return x + y;
}
const nums = [1, 2];
const total = add(...nums); // 报错
const nums2 = [1, 2] as const;
const total2 = add(...nums2); // 正确

const v2 = {
    x: 1 as const,
    y: 2,
}; // 类型是 {readonly x: 1; y: number; }
const v3 = {
    x: 1,
    y: 2,
} as const; // 类型是 { readonly x: 1; readonly y: 2; }
```
#### 非空断言
对于可能为空的变量`(undefined|null)`，TS提供了非空断言，保证变量不为空，写法是在变量名后面加上`!`
```
function f(x?: number | null) {
    validateNumber(x); // 自定义函数，确保 x 是数值
    console.log(x!.toFixed());
}
function validateNumber(e?: number | null) {
    if (typeof e !== 'number')
        throw new Error('Not a number');
}
```
经过`validateNumber`函数，`x`肯定不为空，但是直接调用`x.toFixed`会报错，这时可以使用非空断言

非空断言可以省去一些额外的判断，在确保安全的情况下可以使用
```
const root = document.getElementById('root');
// 报错
root.addEventListener('click', e => { });
// 使用非空断言可以直接增加监听函数
const root2 = document.getElementById('root')!;
root2.addEventListener('click', e => { });
// 使用非空断言进行赋值断言
class Point {
    x: number; // 报错
    y: number; // 报错
    x2!: number; // 正确
    y2!: number; // 正确
    constructor(x: number, y: number, x2: number, y2: number) {
        // ...
    }
}
```
#### 断言函数
断言函数是用于函数参数符合某种类型的殊函数，如果达不到要求，会抛出错误，中断程序执行，达到要求就会正常进行，不进行任何操作
```
function isString(value: unknown): asserts value is string {
    // asserts value is string，该函数用来断言value的类型是string，达不到要求就会中断
    if (typeof value !== 'string')
        throw new Error('Not a string');
}
function toUpper(x: string | number) {
    isString(x);
    return x.toUpperCase(); // 不报错
}
```
如上，通过断言函数，再调用`x.toUpperCase`就不报错了
断言函数的参数实际检查，需要开发者进行实现
断言函数`asserts`语句等同于`void`, 不能有具体的返回值

 断言参数非空，可以使用工具类型`NonNullable<T>`
```
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`${value} is not defined`)
    }
}
```
当断言参数是否为真是，还可以使用简写
```
function assert(x: unknown): asserts x {
    if (!x) {
        throw new Error(`${x} should be a truthy value.`);
    }
}
```
断言函数不等于类型保护函数，类型保护函数是返回一个布尔值
```
function isString2(value: unknown): value is string {
    return typeof value === 'string';
}
```
### namespace 命名空间
TS自己的模块格式，有ES模块后，官方已不推荐使用，本次只做简单介绍
`namespace` 用来建立一个容器，内部的所有变量和函数，都必须在这个容器里面使用。
外部使用内部成员可以用`export` 前缀，表示输出该成员
```
namespace Utils {
    function isString(value: any) {
        return typeof value === 'string';
    }
    export function log(msg: string) {
        console.log(msg);
    }
    export function error(msg: string) {
        console.error(msg);
    }
    // 正确
    isString('yes');
}

Utils.isString('no'); // 报错
Utils.log('Call me'); // 正确
Utils.error('maybe!'); // 正确
```





