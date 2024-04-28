### declare 关键字
> declare关键字用于向 TypeScript 编译器提供类型信息，告诉编辑器，某个类型是存在的，可以在当前文件中使用，故而编译后也不会有任何的declare语句

我们在使用某些没有类型的库的时候可以使用 `declare`关键字定义类型，某些全局变量，也可以使用`declare`定义类型
`declare` 不用给出具体实现，只需要描述类型，也只能描述已经存在的变量和数据结构，不能用来声明新的类型和数据结构，
`declare`可以描述 变量`(const、let、var`)、`type`、`class`、`enum`、`函数`、`模块`、`命名空间`

#### declare variable，描述变量
当前脚本使用了其它脚本定义的全局变量存在类型错误时，我们可以使用declare进行描述
```
declare var x1: string;
declare let x2: string
x1.includes('1') // 可以使用string类型的方法不报错
x1 = '123' //正常赋值或者使用

declare let x3: number = 1; // 报错
```
declare关键字只能给出类型描述，不能涉及值
#### declare function
单独的函数类型声明只能放在declare命令后面,TS不支持单独的函数类型声明
```
declare function sayHello(name: string): void;
sayHello('张三');
```
#### declare class
```
declare class Animal {
    public a: number;
    private b: number;
    constructor(name: string);
    eat(): void;
    sleep(): void;
}
```
#### declare module & declare namespace
```
declare namespace AnimalLib {
    class Animal2 {
        constructor(name: string);
        eat(): void;
        sleep(): void;
    }

    type Animals2 = 'Fish' | 'Dog';
}
// 或者
declare module AnimalLib2 {
    class Animal3 {
        constructor(name: string);
        eat(): void;
        sleep(): void;
    }
    type Animals3 = 'Fish' | 'Dog';
}
```

#### declare global
为原生JS对象添加属性和方法，可以使用declare global{} 语法
declare global必须用在模块中，可以在代码中添加`export {}`,这样文件会成为模块，效果全局有效


给String添加toSmallString方法
```
export { };
declare global {
    interface String {
        toSmallString(): string;
    }
}
String.prototype.toSmallString = (): string => {
    // 具体实现
    return '';
};
```
给window添加属性myAppConfig
```
export { };
declare global {
    interface Window {
        myAppConfig: object;
    }
}
const config = window.myAppConfig;
```

#### declare enum
```
declare enum E1 {
    A,
    B,
}
declare enum E2 {
    A = 0,
    B = 1,
}
declare const enum E3 {
    A,
    B,
}
declare const enum E4 {
    A = 0,
    B = 1,
}
```

### d.ts类型声明文件
我们可以将单独使用的模块其中的类型抽离出来，单独组成一个类型声明文件，便于模块使用者了解接口
类型声明文件只有类型代码，不加具体的实现代码，文件名一般为`[模块名].d.ts`，其中d可理解为declaration(声明)

```
// types.d.ts
export interface Character {
    catchphrase?: string;
    name: string;
}
// index.ts
import { Character } from "./types";
export const character: Character = {
    catchphrase: "Yee-haw!",
    name: "Sandy Cheeks",
};
```

#### 类型声明文件来源
1、TS编译器自动生成
2、TS内置类型文件
3、外部模块类型声明文件通过npm包安装

##### 自动生成
可以打开declaration选项，编译自动生成类型声明文件
```
{
    "compilerOptions": {
        "declaration": true
    }
}
```
##### TS内置声明文件
TS内置的声明文件主要是内置的全局对象的类型声明，在安装TS时自动安装
在TS页面随便写一个全局变量，例如`document`，`ctrl+左键`即可点击进去，查看对应的目录，主要在`TypeScript`的`lib`目录下
主要有`lib.d.ts`、`lib.dom.d.ts`、`lib.es2015.d.ts`、`lib.es5.d.ts`等
TS会根据编译目标target值，加载对应的内置生命文件，无需特别配置

##### 外部类型声明文件
当项目中使用了外部的第三方库，就需要这个库的声明文件，但是又分三种情况
1. 库源码自带类型声明文件，这是我们就不需要处理
2. 库没有自带，可以在社区中找到，例如`jQuery`，通常有名的第三方库，要么自带，要么可以在[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)这个库找到
这些声明文件通常发布到`npm`的`@types`命名空间下，`jQuery`的类型声明库为`@types/jquery`
TS会自动加载`node_modules/@types`目录下的模块，一般无需额外处理，不过我们也可以通过编译选项`typeRoots`更改，
3. 找不到类型声明文件，自己写~

#### d.ts中的declare关键字
因为`declare`只能声明类型，所以很适合在`d.ts`中使用，
在`d.ts`文件中，变量类型描述需要使用`declare`描述，而`interface`本身就是类型代码，可加也可不加`declare`

#### 模块发布
当前模块包含自己的类型声明文件，可以再`package.json`中添加`types`或者`typings`字段
```
{
    "name": "awesome",
    "author": "Vandelay Industries",
    "version": "1.0.0",
    "main": "./lib/main.js",
    "types": "./lib/main.d.ts"
}
```
类型声明文件为`index.d.ts`，可以不需要`再package.json`中注明，会自动加载

#### 三斜杠命令
当存在类型声明文件内容很多需要拆分时，可以在入口文件使用三斜杠命令，加载拆分后的文件

在`main.d.ts`加载拆分的`interface.d.ts`和`function.d.ts`文件
```
/// <reference path="./interfaces.d.ts" />
/// <reference path="./functions.d.ts" />
```
三斜杠只能用在文件头部，三斜杠处了拆分类型声明文件，还可以用于普通脚本加载类型声明文件
其主要有三个参数，path，type，lib

##### /// <reference path="" />
最常见的三斜杠命令，常用来声明当前脚本依赖的类型文件
```
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("https://www.typescriptlang.org");
```
编辑器在预处理阶段找出所有的三斜杠引用文件添加到编译列表一块编译，path可以是相对路径，也可以是库中的类型声明文件

##### /// <reference types="" />
`types` 参数用来告诉编译器当前脚本依赖某个 `DefinitelyTyped` 类型库，通常安装在`node_modules/@types`目录
```
/// <reference types="node" />
```
如上表示编译时添加node.js的类型库，node_modules目录里面的@types/node/index.d.ts
上面的命令应该只用在自己手写的类型声明文件中，普通TS脚本可以在tsconfig.json中的types指定依赖的库类型

##### /// <reference lib="" />
允许脚本文件显式包含内置 `lib `库，等同于在`tsconfig.json`文件里面使用`lib`属性指定 `lib` 库。
```
/// <reference lib="es2017.string" />
// 对应库为lib.es2017.string.d.ts
```

















