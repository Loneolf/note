"use strict";(self.webpackChunksource_map=self.webpackChunksource_map||[]).push([[145],{2145:(n,t,e)=>{e.r(t),e.d(t,{default:()=>s});const s='#### 简介\n类封装了属性和方法，是面向对象编程的基本构件\n##### 属性的类型\n类的属性可以在顶层声明，也可以在构造方法内部声明\n```\nclass Point {\n\t// 声明number类型的x,y\n\tx: number;\n\ty: number;\n\t// 不设置初值提示报错，可以关掉strictPropertyInitialization(默认打开)，或者使用非空断言\n\tx2!: number;\n\ty2!: number;\n\t// 声明时给出值的会自动推断类型，如下x,y会被推断为number类型\n\tx3 = 3;\n\ty3 = 4;\n\t// 如果只是声明变量不赋值，默认推断为any\n\tx4;\n\ty4;\n}\n```\n##### readonly修饰符\n增加了readonly修饰符的属性，只可读不可修改，实例对象也不能修改\n```\nclass A {\n\treadonly id = "foo";\n}\nconst a = new A();\na.id = "bar"; // 报错\n```\n可以使用构造方法修改只读属性的值\n```\nclass A2 {\n\treadonly id: string = "foo";\n\tconstructor() {\n\t\tthis.id = "bar"; // 正确\n\t}\n}\nconst a2 = new A2();\na2.id = "bar2"; // 错误\n```\n##### 方法的类型\n类的方法就是普通函数，和普通函数类型声明，重载，参数默认值等都是一致，也会进行正常的类型推断\n```\nclass Point2 {\n\tx: number;\n\ty: number;\n\tconstructor(x: number = 0, y: number = 0) {\n\t\tthis.x = x;\n\t\tthis.y = y;\n\t}\n\tadd(point: Point2) {\n\t\treturn new Point2(this.x + point.x, this.y + point.y);\n\t}\n}\n```\n需要注意的是构造方法不能声明返回值类型，因为构造方法会返回实例对象\n\n##### 存取器方法\n存取器是指包含取值器getter和存值器setter特殊的类方法\n```\nclass C {\n\t_name = "";\n\tget name(): string {\n\t\treturn this._name;\n\t}\n\tset name(value: string) {\n\t\tthis._name = value;\n\t}\n}\n```\nget ，取值方法，用于取值，set，存值方法，用于设置值，如果只有get，则会自动转为readonly属性\nset方法设置的值必须和get返回值类型保持一致，可访问性也必须一致\n存取器方法作用可以是数据劫持，在取值或者设置值的时候做一些事情\n\n##### 属性索引\n类可以定义属性索引，定义了之后所有的属性或者方法都必须和属性索引保持一致\n```\nclass MyClass {\n\t[s: string]: boolean | ((s: string) => boolean);\n\tx = true; // 正常\n\tx = 12; // 报错\n\tget(s: string) {\n\t\treturn this[s] as boolean;\n\t}\n\tmyx(s: string) {\n\t\t// 报错\n\t\treturn 2134;\n\t}\n}\n```\n\n#### interface接口\n##### implements 关键字\ninterface或者type可以用对象的形式,为class指定一组检查条件,也就是我们可以使用接口约束类,通过implement关键字\n```\ninterface Country {\n\tname: string;\n\tcapital: string;\n\tget(name: string): boolean;\n}\n或者\ntype Country = {\n   name:string;\n   capital:string;\n}\nclass MyCountry implements Country {\n\tname = "";\n\tcapital = "";\n\tx = 10; // 正确\n\tget(s) {\n\t\t// s 的类型是 any\n\t\treturn true;\n\t}\n\tmyF() {\n\t\tconsole.log("hello");\n\t}\n}\n```\ninterface只能检查条件,不能替代class本身的类型声明，类可以定义接口没有声明的方法和属性，不同于普通的对象约束\n\nimplements关键字后面可以是个类，此时后面的类会被当做为接口\n```\nclass Car {\n\tid: number = 1;\n\tmove(): void { }\n}\n\nclass MyCar implements Car {\n\tid = 2; // 不可省略\n\tmove(): void { } // 不可省略\n}\n```\n##### 实现多接口\n类可以实现多个接口，也就是受多个接口的限制，每个接口之间用逗号分割\n```\ninterface MotorVehicle {\n\t// ...\n}\ninterface Flyable {\n\t// ...\n}\ninterface Swimmable {\n\t// ...\n}\nclass Car2 implements MotorVehicle, Flyable, Swimmable {\n\t// 必须满足MotorVehicle, Flyable, Swimmable这三个接口的方法和属性才行\n\t// ...\n}\n```\n也可以通过接口继承实现继承多接口\n```\ninterface SuperCar extends MotorVehicle, Flyable, Swimmable {\n\t// ...\n}\nclass SecretCar implements SuperCar {\n\t// ...\n}\n```\n##### 类与接口的合并\nTS不允许同名类，当有接口与类同名，接口会被合并到类中\n```\nclass A3 {\n\tx: number = 1;\n}\ninterface A3 {\n\ty: number;\n}\nlet a3 = new A3();\na3.y = 10; // 不赋值的话y的值为undefined\na3.x; // 1\na3.y; // 10\n```\n#### class 类型\n##### 实例类型\nTS中类本身可以代表该类的实例类型\n```\ninterface ColorBase {\n\tbaseColor: string;\n}\n\nclass Color implements ColorBase {\n\tname: string;\n\tbaseColor = "block";\n\tconstructor(name: string) {\n\t\tthis.name = name;\n\t}\n}\nconst green: Color = new Color("green");\nconst red: ColorBase = new Color("red");\n```\n##### 类的自身类型\n无法用类名表示类的自身类型，但是可以用typeof 运算符\n```\nclass Point4 {\n\tx: number;\n\ty: number;\n\n\tconstructor(x: number, y: number) {\n\t\tthis.x = x;\n\t\tthis.y = y;\n\t}\n}\n\nfunction createPoint(PointClass: typeof Point4, x: number, y: number): Point4 {\n\treturn new PointClass(x, y);\n}\n```\n类本身是构造函数的语法糖，我们可以用构造函数对类进行类型声明\n```\ninterface PointConstructor {\n\tnew(x: number, y: number): Point4;\n}\nfunction createPoint2(\n\tPointClass: PointConstructor,\n\tx: number,\n\ty: number\n): Point4 {\n\treturn new PointClass(x, y);\n}\n```\n##### 结构类型\nclass 遵循 结构类型原则，只要一个对象满足class的实例类型，就和该class属于同类型\n\n```\nclass Foo {\n\tid!: number;\n\tstatic height: number;\n\tconstructor(x?: number) { }\n}\nclass FooPro {\n\tid!: number;\n\tname!: string;\n\tconstructor(y?: string) { }\n}\nfunction fn(arg: Foo) {\n\t// ...\n}\nconst bar = {\n\tid: 10,\n\tamount: 100,\n};\nfn(bar); // 正确\nfn(new FooPro()); // 正确\nconst foopro: Foo = new FooPro(); // 正确\n```\n类或者对象，只要和类的实例结构相同，TS会认为两者类型相同\n两个类的兼容关系，只检查实例成员，不考虑静态方法和构造方法\n存在私有成员和保护成员时，只有继承关系的类才能兼容类型\n\n结构类型原则， 如果类是空类，那么类型为空类的地方可以传任意值，与空对象相似\n```\nclass Empty { }\nfunction emfn(x: Empty) {\n\t// ...\n}\nemfn({});\nemfn(window);\nemfn(emfn);\n```\n#### 类的继承 extends\n子类可以使用extends关键字继承基类的所有属性和方法，extends关键字后面不仅可以是类，只要其类型为构造函数均可以\n```\nclass A4 {\n\tgreet() {\n\t\tconsole.log("Hello, world!");\n\t}\n}\nclass B extends A4 { }\nconst b = new B();\nb.greet(); // "Hello, world!"\n// 继承的类遵循结构类型原则\nconst a4: A4 = b;\na4.greet();\n```\n子类可以覆盖基类的同名方法，但是类型定义必须和基类保持一致\n```\nclass B2 extends A4 {\n\tgreet(name?: string) {\n\t\tif (name === undefined) {\n\t\t\tsuper.greet();\n\t\t} else {\n\t\t\tconsole.log(`Hello, ${name}`);\n\t\t}\n\t}\n}\nclass B3 extends A4 {\n\t// 报错\n\tgreet(name: string) {\n\t\tconsole.log(`Hello, ${name}`);\n\t}\n}\n```\n当基类中存在受保护的成员protected，子类可以将该成员可访问属性改为public或者protected，但是不能改成private\n```\nclass A5 {\n\tprotected x: string = "";\n\tprotected y: string = "";\n\tprotected z: string = "";\n}\nclass B6 extends A5 {\n\tpublic x: string = ""; // 正确\n\tprotected y: string = ""; // 正确\n\tprivate z: string = ""; // 报错\n}\n```\n#### 可访问性修饰符\n类内部成员是否可以在外部访问，由修饰符public，private和protected控制\n##### public\n默认修饰符，默认类的属性和方法都是可以外部访问的，可以忽略不写\n```\nclass Greeter {\n\tpublic greet() {\n\t\tconsole.log("hi!");\n\t}\n}\nconst g = new Greeter();\ng.greet();\n```\n##### private\n私有成员，只能在当前类访问，外部和子类都不能访问\n```\nclass A7 {\n\tprivate x: number = 0;\n\t#y: number = 2;\n\t// 内部方法可以访问修改私有成员\n\tgetX() {\n\t\tconsole.log(this.x);\n\t}\n\tsetX(num: number) {\n\t\tthis.x = num;\n\t}\n}\nconst a7 = new A7();\na7.x; // 报错\na7["x"]; // 成功\nif ("x" in a7) {\n\t// 成功\n}\na7["y"]; // 报错\nclass B7 extends A7 {\n\t// 子类他同样不能定义同名的父类得私有成员\n\tx = 1; // 报错\n\tshowX() {\n\t\tconsole.log(this.x); // 报错\n\t}\n}\n```\nprivate被编译后关键字会被剥离，外部成员此时就能访问，故TS没有严格限制private，可以使用方括号或者 in运算符 访问使用private定义的私有成员\nES2022可以使用前面加 # 从而实现真正意义上的私有属性\n\n我们也可以将构造方法私有，禁止new命令生成实例，强制通过内部的工厂函数生成实例\n```\nclass Singleton {\n\tprivate static instance?: Singleton;\n\tprivate constructor() { }\n\tstatic getInstance() {\n\t\tif (!Singleton.instance) {\n\t\t\tSingleton.instance = new Singleton();\n\t\t}\n\t\treturn Singleton.instance;\n\t}\n}\nconst s = Singleton.getInstance();\n```\n##### protected\nprotected只能在内部和子类中使用，无法在实例中使用\n```\nclass A8 {\n\tprotected x = 1;\n\tprotected y = 1;\n\tgetX() {\n\t\t// 内部可以正常的获取，设置成员\n\t\treturn this.x;\n\t}\n}\nclass B8 extends A8 {\n\ty = 2; // 子类可以定义同名成员\n\tgetX() {\n\t\treturn this.x;\n\t}\n}\nconst a8 = new A8();\nconst b8 = new B8();\n\na8.x; // 报错\na8.getX();\nb8.getX(); // 1\nb8.y; // 2\n```\n##### 实例属性的简写形式\n很多实例属性是通过构造方法传入\n```\nclass Point7 {\n\tx: number;\n\ty: number;\n\tconstructor(x: number, y: number) {\n\t\tthis.x = x;\n\t\tthis.y = y;\n\t}\n}\n```\n可以简写成如下形式\n```\nclass Point8 {\n\tconstructor(public x: number, public y: number) { }\n}\nconst p = new Point8(10, 10);\np.x; // 10\np.y; // 10\n```\n在构造函数中，参数前面加上public修饰符，TS就会自动声明对应的公开属性，同时设置参数值，不必在构造函数中再赋值\n除，public，private，protected，readonly修饰符有同样的作用，readonly还可以和前面三个共同使用\n```\nclass Aa {\n\tconstructor(\n\t\tpublic a: number,\n\t\tprotected b: number,\n\t\tprivate c: number,\n\t\treadonly d: number\n\t) { }\n}\n\n// 编译结果\nclass Aa {\n\ta;\n\tb;\n\tc;\n\td;\n\tconstructor(a, b, c, d) {\n\t\tthis.a = a;\n\t\tthis.b = b;\n\t\tthis.c = c;\n\t\tthis.d = d;\n\t}\n}\n\nclass Ab {\n\tconstructor(\n\t\tpublic readonly x: number,\n\t\tprotected readonly y: number,\n\t\tprivate readonly z: number\n\t) { }\n}\n```\n#### 静态成员\n可以在类的内部通过static关键字定义类的静态成员，静态成员只能通过类本身调用，不能通过实例对象调用\n```\nclass MyClass2 {\n\tstatic x = 0;\n\tpublic static printX() {\n\t\tconsole.log(MyClass2.x);\n\t}\n\tprivate static y = 2; // 只能在内部访问y\n\tstatic #z = 3; // 私有属性的ES6写法\n\tstatic getY() {\n\t\treturn MyClass2.y;\n\t}\n}\nMyClass2.x; // 0\nMyClass2.printX(); // 0\nMyClass2.y; // 报错\nMyClass2.getY();\n\nconst myclass2 = new MyClass2();\nmyclass2.x; // 报错\n```\nstatic 关键字前面依然可以使用public\n\npublic 与 protected的静态成员可以被继承\n```\nclass A9 {\n\tpublic static x = 1;\n\tprotected static y = 1;\n}\nclass B9 extends A9 {\n\tstatic getY() {\n\t\treturn B9.y;\n\t}\n}\nB9.x; // 1\nB9.getY(); // 1\n```\n#### 泛型类\n类可以写成泛型，使用类型参数\n```\nclass Box<Type> {\n\tcontents: Type;\n\tconstructor(value: Type) {\n\t\tthis.contents = value;\n\t}\n}\nconst box: Box<string> = new Box("hello!");\nconst box2 = new Box("hello!"); // 不加类型也会自动类型推断为 Box<string>\n```\n#### 抽象类，抽象成员\n在类定义前面加上关键字abstract，该类就成了抽象类，不能被实例，只能作为其它类的模板，\n抽象类的成员加上abstract关键字，就成了抽象成员，也是只能定义，不能在类里面实现，抽象成员必须在子类中实现对应的方法和属性，否则会报错\n抽象类可以被抽象类继承\n```\nabstract class A10 {\n\tabstract name: string;\n\tabstract execute(): string;\n\tid = 1;\n\ttest() { }\n}\nclass B10 extends A10 {\n\tname = "b10";\n\tamount = 100;\n\texecute() {\n\t\treturn "hello";\n\t}\n}\nabstract class AB extends A {\n\tbar!: string;\n}\nconst b10 = new B10();\nb10.id; // 1\nb10.amount; // 100\n```\n抽象类的作用是相关子类拥有和基类相同接口，可以看做是模板，其中抽象成员必须子类实现，非抽象成员子类会继承\n抽象成员也只能在抽象类中，不能再普通类中，不能有具体的实现代码，抽象成员也不能有`private`修饰符，否则子类无法实现\n一个类只能继承一个抽象类\n抽象类的实现可以用`extends`(需要在子类的`constructor`使用`super`)，也可以用`implement`\n#### 类的this\n类的方法中如果存在this关键字，它指向该方法当前所在的对象\nthis是运行时的状态，谁调用指向谁，\n箭头函数中的this指向当前上下文\n```\nclass A11 {\n\tname = "A11";\n\tgetName() {\n\t\treturn this.name;\n\t}\n\tgetName2 = () => {\n\t\treturn this.name;\n\t};\n\tgetName3(this: A11) {\n\t\treturn this.name\n\t}\n\t// this本身可以当做类型适用，表示当前类的实例对象\n\tsetName(value: string): this {\n\t\tthis.name = value\n\t\treturn this\n\t}\n\tstatic aa: this //报错，this无法用于静态成员\n}\n\nconst a11 = new A11();\na11.getName(); // \'A11\'\na11.getName2(); // \'A11\'\nconst b11 = {\n\tname: "b",\n\tgetName: a11.getName,\n\tgetName2: a11.getName2,\n\tgetName3: a11.getName3,\n};\nb11.getName(); // \'b\'\nb11.getName2(); // \'A11\'\nb11.getName3(); // \'b\'\n\nconst b12 = a11.getName3\nb12() // 报错\n```\nts允许函数的第一个参数名为this，用来声明函数内部的this类型，会在编译后去除该参数\n\n\nnoImplicitThis设置: 默认为打开，当this的值推断为any类型，会报错\n```\nclass Rectangle {\n\tconstructor(\n\t\tpublic width: number,\n\t\tpublic height: number\n\t) { }\n\n\tgetAreaFunction() {\n\t\treturn function () {\n\t\t\treturn this.width * this.height; // 报错\n\t\t};\n\t}\n}\n```\n\n\n\n\n\n\n\n\n\n\n'}}]);
//# sourceMappingURL=145.js.map