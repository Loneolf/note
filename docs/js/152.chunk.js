"use strict";(self.webpackChunksource_map=self.webpackChunksource_map||[]).push([[152],{86152:(n,e,o)=>{o.r(e),o.d(e,{default:()=>r});const r="### any&unknown&never\n\n#### any\nany类型表示无任何限制，可以赋予任意类型值\n```\nlet x:any; // 可以赋值任意值\nx = 1; // 正确\nx = 'foo'; // 正确\nx = true; // 正确\n\n// 一旦设置为any，相当于关闭了该变量的类型检查，只要语法正确，就不会报错\nlet y:any = 'hello';\ny(1) // 不报错\ny.foo = 100; // 不报错\n\nfunction add(x, y) {\n    return x + y;\n}\nadd(1, [1, 2, 3]) // 不报错\n\n// any的污染问题，因为可以任意赋值，会污染正常的变量\nlet a:any = 'hello';\nlet b:number;\nb = a; // 不报错\nb * 123 // 不报错\nb.toFixed() // 不报错\n\n```\nany类型适用场景\n1. 某些变量需要关闭类型检查\n2. 适配老的JS项目，快速迁移到TS\n\n#### unknown\nunknown也可以将所有类型的值都分配给unknown值，\n但是unknown类型变量不能赋值给已知类型的变量，可以解决any类型污染，\n而且不能调用unknown类型的变量和方法，\n切unknown只能进行有限的运算，如下\n```\n// unknown也可以赋值任意值\nlet s:unknown;\n\ns = true; // 正确\ns = 42; // 正确\ns = 'Hello World'; // 正确\n\n// 但是不能将unknown赋值给正常类型的变量\nlet v:unknown = 123;\nlet v1:boolean = v; // 报错\nlet v2:number = v; // 报错\n\n// 不能直接调用unknown的属性和方法\nlet v4:unknown = { foo: 123 };\nv4.foo  // 报错\nlet v5:unknown = 'hello';\nv5.trim() // 报错\nlet v6:unknown = (n = 0) => n + 1;\nv6() // 报错\n\n// unknown类型的变量，只能进行比较(==,===,!=,!==,||,&&,?)、取反(!)、typeof和instanceof运算\nlet e:unknown = 1;\ne + 1 // 报错\ne === 1 // 正确\n\n// 类型缩小后可以正常运算\nlet h:unknown = 1;\nif (typeof h === 'number') {\n  let r = h + 10; // 正确\n}\nlet i:unknown = 'hello';\nif (typeof i === 'string') {\n  i.length; // 正确\n}\n```\n\n#### never\n空类型，不存在的类型，可用于错误处理，联合类型运算的完整性等\n```\nfunction handleError(error: Error): never {\n    throw error;\n}\n\ntype UnionType = string | number | boolean;\nfunction handleUnionType(value: UnionType): UnionType {\n  if (typeof value === 'string') {\n    return value.toUpperCase();\n  } else if (typeof value === 'number') {\n    return value * 2;\n  } else if (typeof value === 'boolean') {\n    return!value;\n  } else {\n    throw new Error('无效的联合类型值');\n  }\n}\n```\n\n### 常用的基本类型\n#### boolean\nboolean类型只包含true和false两个布尔值\n```\nconst x:boolean = true;\nconst y:boolean = false;\n```\n#### number\n```\nconst c:number = 123;\nconst d:number = 3.14;\nconst e:Number = 0xffff;\n```\n#### string\n```\nconst a:string = 'hello';\nconst b:string = `${a} world`;\n\nconst s1:String = 'hello'; // 正确\nconst s2:String = new String('hello'); // 正确\n\nconst s3:string = 'hello'; // 正确\nconst s4:string = new String('hello'); // 报错\n```\n大写类型同时包含字面量和包装对象类型，小写类型只包含字面量，故大写类型不能赋值给小写类型，Boolean和Number同理\n\n通常小写的字面量类型足够项目使用，无需再使用包装对象类型\n#### object&Object\n```\nconst f:object = { foo: 123 };\nconst h:object = [1, 2, 3];\nconst i:object = (n:number) => n + 1;\n\nlet obj:Object;\nobj = true;\nobj = 'hi';\nobj = 1;\nobj = { foo: 123 };\nobj = [1, 2];\nobj = (a:number) => a + 1;\n```\nobject类型包含对象，数组，函数，不包含原始类型的值\nObject是JS中的广义对象，所有可转化为对象的值都是Object，包含了几乎所有的值，除了undefind 和 null这两个不能转化为对象的类型\n\n#### undefind & null\nnoImplicitAny和strictNullChecks 开启这两个选项，undefined 和 null不能互相赋值\n关闭会被类型推断为any, 可以相互赋值\n```\nlet j:undefined = undefined;\nj = null\nconst k:null = null;\n```\nundefind和null即为类型也为值\n\n#### 值类型\n```\nlet m: 'hello'\nm = 'hello'; // 正确\nm = 'world'; // 报错\n```\n值类型只能赋值对应的值，const声明的非对象变量，默认都是值类型，对象因为属性可变，不会被推断为值类型\n\n#### 联合类型\n多个类型组成的新类型 使用`|`或\n```\nlet n:string | number;\nn = 123; // 正确\nn = 'abc'; // 正\n\nlet name:string|null;\nname = 'John';\nname = null;\n// 一个变量如果有多个类型，如果需要使用某个类型的方法，可以先进行类型缩小\nfunction printId( id:number|string ) {\n    if (typeof id === 'string') {\n        console.log(id.toUpperCase());\n    } else {\n        console.log(id);\n    }\n}\n```\n#### 交叉类型\n交叉类型，多个类型组合成一个类型，用`&`标识\n```\nlet o:number & string // 类型推断为never，不存在number和string的类型\n\nlet p: { foo: string } & { bar: string };\np = {  foo: 'hello', bar: 'world' };\n\ntype q = { foo: number };\ntype l = q & { bar: number }; // l为交叉类型，在q的基础上添加属性bar\n```\n交叉类型可用于对象的合成，和为对象添加新属性\n#### type\ntype可以定义类型别名\n```\ntype Age = number\nlet age: Age = 18\n```\n\n#### typeof\n在JS中typeof为一元运算符，返回类型`string|number|bigint|boolean|symbol|undefined|object|function`\n```\nlet foo = typeof 'foo' // string\n```\n在TS中，typeof两种作用，一元运算符和TS类型，类型运算编译后会被删除\n```\nconst r = { x: 0 };\ntype T0 = typeof a;   // { x: number }\ntype T1 = typeof r.x; // number\n\n// 参数只能是标识符不能是运算表达式\ntype T = typeof Date(); // 报错\n```\n\n#### 数组\n1. 数组成员类型相同，数量不固定，可以为空数组\n```\nlet arr: number[] = [1,2,3,65,45,5]\nlet arr2:(number|string)[] = [345,56,7,78,8, '2']; // 成员可以是number，可以是string\n\n// 数组的泛型写法\nlet arr3:Array<number> = [1, 2, 3];\nlet arr4:Array<number|string>;\n\n// TS允许使用方括号读取数组成员类型\ntype Names = string[];\ntype Name = Names[0]; // string Number[0]返回类型为string\ntype Name2 = Names[number]; // string 索引值都是number \n```\n2. 数组的类型推断\n```\nconst arr5 = []; // 推断为 any[]\narr5.push(123); // 推断类型为 number[]\narr5.push('abc'); // 推断类型为 (string|number)[]\n// 当数组为空时，数组的类型推断会根据赋值自动更新，\n// 初始化不为空数组，类型推断不会自动更新\nconst arr6 = [123];\narr6.push('abc'); // 报错\n```\n3. 只读数组: const断言， 无法增删改，没有数组的增删改属性\n```\nconst arr7:readonly number[] = [0, 1];\narr7[1] = 2; // 报错\narr7.push(3); // 报错\ndelete arr7[0]; // 报错\n// 泛型只读写法\nconst a1:ReadonlyArray<number> = [0, 1];\nconst a2:Readonly<number[]> = [0, 1];\n// const 断言只读\nconst arr8 = [0, 1] as const;\n```\n4. 二维数组：`T[][]`表示\n```\nlet multi:number[][] = [[1,2,3], [23,24,25]];\n```\n5. 元组: 成员类型可以自由设置的数组，元组必须有类型声明，否则会被推断为数组\n```\nconst mArr:[string, string, boolean] = ['a', 'b', true]; // 每个类型都单独写，限制数量\nlet mArr2:[number, number?] = [1];  // 可选成员元组\n// 不限长度的元组\ntype t1 = [string, number, ...boolean[]];\ntype t2 = [string, ...boolean[], number];\ntype t3 = [...boolean[], string, number];\n// 只读元组\ntype t4 = readonly [number, string]\ntype t5 = Readonly<[number, string]>\n\n// Symbol 值通过Symbol()函数生成。在 TypeScript 里面，Symbol 的类型使用symbol表示\nlet sy1:symbol = Symbol();\nlet sy2:symbol = Symbol();\nsy1 === sy2 // false, symbol值都不相等\n```\n\n#### Enum\n枚举，TS新增的数据类型，可看作是一类值的集合，既是类型，也是值\n```\nenum Color {\n    Red,     // 0\n    Green,   // 1\n    Blue     // 2\n}\n编译后\nvar Color;\n(function (Color) {\n    Color[Color[\"Red\"] = 0] = \"Red\";\n    Color[Color[\"Green\"] = 1] = \"Green\";\n    Color[Color[\"Blue\"] = 2] = \"Blue\"; // 2\n})(Color || (Color = {}));\n```\n如果不指定值，默认从0开始赋值，编译后生成属性和值正反赋值的对象，所以枚举值可以通过成员值获得成员名，\n正反映射只有在值为数字才会发生，当值手动指定为字符串时不会反向映射\n枚举编译后会留在代码中\n\n枚举值使用时和对象调用属性一致，可以通过点运算符和方括号运算符\n```\nlet c: Color = Color.Green; // 1\n// 等同于\nlet c2: number = Color['Green']; // 1\n```\nEnum结构本身就是类型，变量即可以写成`Color`也可以写成`number`，`Color`更具有语义化\n\nEnum结构适合的场景是注重名字不注重值，成员名更重要，如下\n```\nenum Operator {\n    ADD,\n    DIV,\n    MUL,\n    SUB\n}\nfunction compute(op: Operator, a: number, b: number) {\n    switch (op) {\n        case Operator.ADD:\n            return a + b;\n        case Operator.DIV:\n            return a / b;\n        case Operator.MUL:\n            return a * b;\n        case Operator.SUB:\n            return a - b;\n        default:\n            throw new Error('wrong operator');\n    }\n}\ncompute(Operator.ADD, 1, 3) // 4\n```\n\n##### Enum 成员的值\nEnum默认不用赋值，会默认从零递增，也可以赋值具体的数字或者字符串，但是不能为Bigint\n```\nenum Color2 {\n    Red,\n    Green,\n    Blue\n}\nColor2.Red = 4 // 报错\n```\n值设置之后不能再更改，值是只读的，所以`Enum` 可以被 对象的`as const`断言取代\n\n```\nenum Color3 {\n    Red = 1,\n    Green = 2,\n    Blue = 3\n}\nenum Direction {\n    Up = 'UP',\n    Down = 'DOWN',\n    Left = 'LEFT',\n    Right = 'RIGHT',\n}\n```\n多个同名Enum结构会自动合并，合并时只能首个成员忽略初始值\n```\nenum Foo {\n    A,\n}\nenum Foo {\n    B = 1,\n}\nenum Foo {\n    C = 2,\n}\n// 等同于\nenum Foo {\n    A,\n    B = 1，\n    C = 2\n}\n```\n##### keyof运算符\n可以使用keyof运算符取出Enum结构的所有成员，作为联合类型返回\n```\nenum MyEnum {\n    A = 'a',\n    B = 'b'\n}\n// 'A'|'B'\ntype Foo2 = keyof typeof MyEnum;\n// 可以使用in运算符取出Enum的成员值\nenum MyEnum3 {\n    A = 'a',\n    B = 'b'\n  }\n// { a: any, b: any }\ntype Foo3 = { [key in MyEnum]: any };\n```\n\n\n\n"}}]);
//# sourceMappingURL=152.chunk.js.map