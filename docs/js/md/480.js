"use strict";(self.webpackChunksource_map=self.webpackChunksource_map||[]).push([[480],{59480:(n,t,e)=>{e.r(t),e.d(t,{default:()=>r});const r='#### interface 简介\n> interface 对象的模板，类型约定，使用了某个模板的对象，就拥有了指定的类型结构\n\n```\ninterface Person {\n\tfirstName: string;\n\tlastName: string;\n\tage: number;\n}\nconst p: Person = {\n\tfirstName: "John",\n\tlastName: "Smith",\n\tage: 25,\n};\n// 接口Person及符合Person接口的对象p, p必须拥有Person所定义的所有属性才符合规定\n```\n可以通过方括号取出interface的某个属性, 对于type 定义的模板，也是同样可以用方括号获取属性定义\n```\ntype Age = Person["age"]; // number\ntype Person2 = {\n\tfirstName: string;\n\tlastName: string;\n\tage: number;\n};\ntype Age2 = Person2["age"]; // number\n```\n\n接口表示对象成员的五种形式: 对象属性、对象的属性索引、对象方法、函数、构造函数\n- 对象属性\n可选属性就加上问号，只读属性加上readonly\n```\ninterface Point {\n\tx: number;\n\ty?: number;\n\treadonly a: string;\n}\n```\n- 对象属性索引\n属性索引有string、number、symbol三种类型，一个接口，只能定义一个字符串索引\n```\ninterface A {\n\t[prop: string]: number;\n}\n// 数值索引就是数组类型\ninterface A2 {\n\t[prop: number]: string;\n}\nconst obj: A2 = ["a", "b", "c"];\n// 若一个接口同时定义数值和字符串索引，则数值索引需要服从于字符串索引\ninterface A3 {\n\t[prop: string]: number;\n\t[prop: number]: string; // 报错\n}\ninterface BB {\n\t[prop: string]: number;\n\t[prop: number]: number; // 正确\n}\n```\n- 对象方法\n```\n// 写法一\ninterface A4 {\n\tf(x: boolean): string;\n}\n// 写法二\ninterface B2 {\n\tf: (x: boolean) => string;\n}\n// 写法三\ninterface C {\n\tf: { (x: boolean): string };\n}\n// 属性名表达式写法\nconst f = "f";\ninterface A5 {\n\t[f](x: boolean): string;\n}\n// 接口定义重载，\n// 函数的实现需要在接口外在实现，重载方法可以使用泛型或者类型运算符等实现，尽量少使用\ninterface A6 {\n\tf(): number;\n\tf(x: boolean): boolean;\n\tf(x: string, y: string): string;\n}\n```\n- 函数\n```\ninterface Add {\n\t(x: number, y: number): number;\n}\nconst myAdd: Add = (x, y) => x + y;\n```\n- 构造函数\n\n```\ninterface ErrorConstructor {\n\tnew (message?: string): Error;\n}\n```\n\n#### interface 继承\ninterface 继承 interface，使用关键字extends\n```\ninterface Style {\n\tcolor: string;\n}\ninterface Shape {\n\tname: string;\n}\ninterface Circle extends Style {\n\tradius: number;\n}\n// 可以多重继承\ninterface Circle2 extends Style, Shape {\n\tradius: number;\n}\n```\n\n继承时，如果有同名属性，子接口属性会覆盖父接口属性，以自己的属性为准，\n前提是类型必须兼容，不兼容会报错，多重继承同属性名类型也必须相同，否则会报错\n```\ninterface Foo {\n\tid: string;\n}\ninterface Bar extends Foo {\n\tid: number; // 报错\n}\n```\n\ninterface 继承 type。 定义的对象，同样使用关键字 extends\n```\ntype Country = {\n\tname: string;\n\tcapital: string;\n};\ninterface CountryWithPop extends Country {\n\tpopulation: number;\n}\n```\n\ninterface继承类class，会继承类的所有成员，含有私有成员和保护成员的类被继承将无法实例化\n```\nclass CL {\n\tx: string = "";\n\n\ty(): boolean {\n\t\treturn true;\n\t}\n}\n\ninterface B extends CL {\n\tz: number;\n}\nconst b: B = {\n\tx: "",\n\ty: function () {\n\t\treturn true;\n\t},\n\tz: 123,\n};\n```\n\n#### 接口合并\n> 多个同名接口会合并成一个接口\n\n同名接口合并，如果有相同的属性，同样不能有类型冲突，否则会报错\n方法名同名但是不同的类型声明，会发生函数重载\n```\ninterface Box {\n\theight: number;\n\twidth: number;\n}\ninterface Box {\n\tlength: number;\n}\nconst box: Box = {\n\theight: 10,\n\twidth: 20,\n\tlength: 30,\n};\n```\n\n#### interface 与 type 异同\ninterface和type命令都可以表示对象类型，很多对象类型两者皆可定义，几乎所有的interface都可以使用type命令\n```\ntype Country1 = {\n\tname: string;\n\tcapital: string;\n};\ninterface Country2 {\n\tname: string;\n\tcapital: string;\n}\n```\n\n但是interface和type还是有不同点，具体如下\n1、type可以表示非对象类型，interface只能表示对象类型(数组，对象)\n2、interface可以继承其他类型，type不支持继承\ntype定义的对象添加属性，只能使用&运算符重新定义类型\n```\ntype Animal = {\n\tname: string;\n};\ntype Bear = Animal & {\n\thoney: boolean;\n};\n// interface可以使用extends继承type，type也可以用&扩展新的类型\n```\n3、同名interface会自动合并，同名type会报错\n```\ntype A1 = { foo: number }; // 报错\ntype A1 = { bar: number }; // 报错\ninterface A2 {\n\tfoo: number;\n}\ninterface A2 {\n\tbar: number;\n}\nconst obj2: A2 = {\n\tfoo: 1,\n\tbar: 1,\n};\n```\n4、interface不能包含属性映射，type可以\n```\ninterface Point2 {\n\tx: number;\n\ty: number;\n}\n// 正确\ntype PointCopy1 = {\n\t[Key in keyof Point2]: Point2[Key];\n};\n// 报错\ninterface PointCopy2 {\n\t[Key in keyof Point2]: Point2[Key];\n};\n```\n5、type可以扩展原始数据类型（扩充后赋值难进行，无意义），interface不行\n```\n// 正确\ntype MyStr = string & {\n\ttype: "new";\n};\n// 报错\ninterface MyStr2 extends string {\n\ttype: "new";\n}\n```\n6、interface无法表达某些复杂类型（联合类型和交叉类型）\n```\ntype A7 = {\n\t/* ... */\n};\ntype B7 = {\n\t/* ... */\n};\n\ntype AorB = A7 | B7;\ntype AorBwithName = AorB & {\n\tname: string;\n};\n```\n7、this关键字只能作用于interface\n```\ninterface Foo2 {\n\tadd(num: number): this;\n}\nclass Calculator implements Foo2 {\n\tresult = 0;\n\tadd(num: number) {\n\t\tthis.result += num;\n\t\treturn this;\n\t}\n}\n// 报错\ntype Foo = {\n\tadd(num: number): this;\n};\n```\n\n相对来说，interface使用起来灵活性更高，便于扩充类型或者自动合并，但是涉及到复杂类型运算，type更方便\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'}}]);
//# sourceMappingURL=480.js.map