"use strict";(self.webpackChunksource_map=self.webpackChunksource_map||[]).push([[252],{47252:(n,t,e)=>{e.r(t),e.d(t,{default:()=>r});const r='#### 简介\n对象是JS除原始类型外最基本的数据结构\n对象类型声明，使用大括号，内部声明属性和方法\n```\nconst obj: {\n\tx: number;\n\ty: number;\n\tadd(x: number, y: number): number;\n\t// 或者写成\n\t// add: (x:number, y:number) => number;\n} = {\n\tx: 1,\n\ty: 1,\n\tadd(x, y) {\n\t\treturn x + y;\n\t},\n};\n```\n读取对象类型可以使用. 或者中括号 `obj.x`、`obj[\'y\']`\n\n属性类型可以用分号或者逗号结尾\n对象类型定义可以用type，也可以用interface\n```\ntype MyObj = {\n\tx: number;\n\ty: number;\n};\ntype MyObj2 = {\n\tx: number;\n\ty: number;\n};\n```\nTS不区分对象自身属性和继承属性，一律视为对象属性\n```\ninterface MyInterface {\n\ttoString(): string; // 继承的属性\n\tprop: number; // 自身的属性\n}\nconst obj2: MyInterface = {\n\t// 正确\n\tprop: 123,\n};\n```\n上面的obj2不写`toString`属性也可以正常运行，因为可以继承原型上的`toString()`方法\n\n#### 可选择属性\n当某个属性是可忽略的，加个?即可\n```\nconst obj3: {\n\tx: number;\n\ty?: number;\n} = { x: 1 };\n```\n等同于下面案例，可选属性等同于`undefined`，可以为y赋值`undefined`，不过没有意义\n但是如果编译时打开了`ExactOptionalPropertyTypes`和`strictNullChecks` ，可选属性就不能设置成`undefined`\n\n```\nconst obj4: {\n\tx: number;\n\ty?: number | undefined;\n} = { x: 1 };\nobj4.y.toFixed(); // 报错，可选属性调用方法需要确认，可以使用如下调用\nobj4.y?.toFixed(); // 正确\n```\n\n#### 只读属性\n和别的只读属性一样，属性前面加上 readonly关键字， 该属性就成了只读属性\n只读属性只能在对象初始化期间赋值，此后就不能修改该属性\n```\nconst person: {\n\treadonly age: number;\n\theight: number;\n} = { age: 20, height: 180 };\n\nperson.height = 183; // 正常\nperson.age = 21; // 报错\n```\nreadonly 如果修饰的属性值是对象，那么该对象的属性可以修改，该对象禁止完全替换\n```\ninterface Home {\n\treadonly resident: {\n\t\tname: string;\n\t\tage: number;\n\t};\n}\nconst h2: Home = {\n\tresident: {\n\t\tname: "Vicky",\n\t\tage: 42,\n\t},\n};\nh2.resident.age = 32; // 正确\nh2.resident = {\n\tname: "Kate",\n\tage: 23,\n}; // 报错\n```\n对象只读 可以使用只读断言 as const\n```\nconst myUser = {\n\tname: "Sabrina",\n} as const;\nmyUser.name = "Cynthia"; // 报错\n```\nas const 属于TS的类型推断，如果对象明确的声明了类型， TS会以声明为准\n\n当两个变量对应同一个对象时，一个可写，一个不可写，从可写的变量修改属性，会影响到只读变量\n```\ninterface Person2 {\n\tname: string;\n\tage: number;\n}\ninterface ReadonlyPerson {\n\treadonly name: string;\n\treadonly age: number;\n}\nlet w: Person2 = {\n\tname: "Vicky",\n\tage: 42,\n};\nlet r: ReadonlyPerson = w;\nw.age += 1;\nr.age; // 43\n```\n#### 属性名的索引类型\n当对象的类型很多，一个一个的声明类型比较麻烦，或者无法事前知道对象具体有多少个属性，这时我们可以使用属性名表达式来描述类型\n\n```\ntype MyObj5 = {\n\t[property: string]: string;\n};\nconst obj5: MyObj5 = {\n\tfoo: "a",\n\tbar: "b",\n\tbaz: "c",\n};\n```\nproperty表示属性名，可以随便起名字，表示属性名是string类型，只要属性名为string，值也是string，就符合上面的类型声明\n\n除string类型的属性名，还有number和symbol\n```\ntype T1 = {\n\t[property: number]: number;\n};\nconst arr1: T1 = [1, 2, 3];\narr1.length; // 报错\narr1.push(); // 报错\n// 使用了属性名数值索引的数组，不能正常使用length属性和数组的方法，应谨慎使用\n// 或者\nconst arr2: T1 = {\n\t0: 1,\n\t1: 2,\n\t2: 3,\n};\n\ntype T2 = {\n\t[property: symbol]: string;\n};\n```\n当同时声明了属性名索引，也声明了单个属性名，单个属性名需要符合属性名索引的类型\n```\ntype MyType = {\n\tfoo: boolean; // 报错 foo符合属性名的字符串索引，类型必须得是string才行\n\t[x: string]: string;\n};\n```\n属性名的声明较为宽泛，约束较少，应谨慎使用\n#### 解构赋值\n解构赋值可以从对象中直接提取属性\n```\nconst {\n\tid,\n\tname2,\n\tprice,\n}: {\n\tid: string;\n\tname2: string;\n\tprice: number;\n} = product; //从product对象中解构id,name2,price属性\n```\n解构赋值的属性重命名\n需要注意解构对象中，冒号后面跟的是属性对应的新的变量名，不是类型\n```\nlet obj6 = { x: "123", y: 123 };\nlet { x: foo, y: bar }: { x: string; y: number } = obj6;\n// 等同于\nlet foo = obj6.x;\nlet bar = obj6.y;\n```\n#### 结构类型\n只要对象 B 满足 对象 A 的结构特征，TypeScript 就认为对象 B 兼容对象 A 的类型，这称为“结构类型”原则（structural typing）\n```\ntype TypeA = {\n\tx: number;\n};\ntype TypeB = {\n\tx: number;\n\ty: number;\n};\nconst B: TypeB = {\n\tx: 1,\n\ty: 1,\n};\nconst A: TypeA = B; // 正确\n```\n上面类型中，B兼容A的属性，B可以赋值给A，如此设计原因是为了兼容JS， JS不关心对象的严格相似，最有有所要求的属性，即可正常运行\n类型B可以赋值给类型A，类型B就可以称为类型A的子类型，子类型兼容父类型\n\n下面的错误就是因为结构类型，obj[n]被推断出any类型\n```\ntype myObj = {\n\tx: number;\n\ty: number;\n};\nfunction getSum(obj: myObj) {\n\tlet sum = 0;\n\tfor (const n of Object.keys(obj)) {\n\t\tconst v = obj[n]; // 报错\n\t\tsum += Math.abs(v);\n\t}\n\treturn sum;\n}\nconst test = { x: 3, y: 4, z: "5" };\ngetSum(test); // 类型 test 属于类型myObj的子集，传进去后无法保证obj[n]值为number，被推断为了any\n```\n#### 严格字面量检查\n对象使用字面量表示，会触发TS的严格检查，如果字面量结构和类型定义不一样，会报错\n```\nconst point: {\n\tx: number;\n\ty: number;\n} = {\n\tx: 1,\n\ty: 1,\n\tz: 1, // 报错 \n};\n```\n根据结构类型原则，可以使用变量绕过该错误\n不过我们应该少使用这种写法，会让参数与类型无法完全匹配\n```\nconst myPoint = {\n    x: 1,\n    y: 1,\n    z: 1\n  };\n  \n  const point2:{\n    x:number;\n    y:number;\n  } = myPoint; // 正确\n```\n多余属性检查配置：suppressExcessPropertyErrors，关闭该选项就不会检查多余类型\n#### 空对象\n空对象是TS特殊的一种值和类型，无法动态添加属性和方法\n```\nconst obj7 = {};\nobj7.prop = 123; // 报错\n// 空对象可以使用继承的属性和方法\nobj7.toString()\n// 因为TS不允许动态添加属性，所以对象需要在声明的时候确认类型\n```\n空对象作为类型，是Object类型的简写，可以赋值除了null和undefined的各种类型，与Object相同。\n空对象赋值时可以有多余的属性，但是不能读取，读取会报错\n```\nlet data:{};\n// 等同于\n// let data:Object;\n\ndata = {};\ndata = { x: 1 };\ndata.x  // 报错\ndata = \'hello\';\ndata = 2;\n```\n强制使用没有任何属性的对象,使用nerve\n```\ninterface WithoutProperties {\n    [key: string]: never;\n  }\n  // 报错\nconst bb:WithoutProperties = { prop: 1 };\n```\n\n\n\n\n\n\n'}}]);
//# sourceMappingURL=252.chunk.js.map