#### interface 简介
> interface 对象的模板，类型约定，使用了某个模板的对象，就拥有了指定的类型结构

```
interface Person {
	firstName: string;
	lastName: string;
	age: number;
}
const p: Person = {
	firstName: "John",
	lastName: "Smith",
	age: 25,
};
// 接口Person及符合Person接口的对象p, p必须拥有Person所定义的所有属性才符合规定
```
可以通过方括号取出interface的某个属性, 对于type 定义的模板，也是同样可以用方括号获取属性定义
```
type Age = Person["age"]; // number
type Person2 = {
	firstName: string;
	lastName: string;
	age: number;
};
type Age2 = Person2["age"]; // number
```

接口表示对象成员的五种形式: 对象属性、对象的属性索引、对象方法、函数、构造函数
- 对象属性
可选属性就加上问号，只读属性加上readonly
```
interface Point {
	x: number;
	y?: number;
	readonly a: string;
}
```
- 对象属性索引
属性索引有string、number、symbol三种类型，一个接口，只能定义一个字符串索引
```
interface A {
	[prop: string]: number;
}
// 数值索引就是数组类型
interface A2 {
	[prop: number]: string;
}
const obj: A2 = ["a", "b", "c"];
// 若一个接口同时定义数值和字符串索引，则数值索引需要服从于字符串索引
interface A3 {
	[prop: string]: number;
	[prop: number]: string; // 报错
}
interface BB {
	[prop: string]: number;
	[prop: number]: number; // 正确
}
```
- 对象方法
```
// 写法一
interface A4 {
	f(x: boolean): string;
}
// 写法二
interface B2 {
	f: (x: boolean) => string;
}
// 写法三
interface C {
	f: { (x: boolean): string };
}
// 属性名表达式写法
const f = "f";
interface A5 {
	[f](x: boolean): string;
}
// 接口定义重载，
// 函数的实现需要在接口外在实现，重载方法可以使用泛型或者类型运算符等实现，尽量少使用
interface A6 {
	f(): number;
	f(x: boolean): boolean;
	f(x: string, y: string): string;
}
```
- 函数
```
interface Add {
	(x: number, y: number): number;
}
const myAdd: Add = (x, y) => x + y;
```
- 构造函数

```
interface ErrorConstructor {
	new (message?: string): Error;
}
```

#### interface 继承
interface 继承 interface，使用关键字extends
```
interface Style {
	color: string;
}
interface Shape {
	name: string;
}
interface Circle extends Style {
	radius: number;
}
// 可以多重继承
interface Circle2 extends Style, Shape {
	radius: number;
}
```

继承时，如果有同名属性，子接口属性会覆盖父接口属性，以自己的属性为准，
前提是类型必须兼容，不兼容会报错，多重继承同属性名类型也必须相同，否则会报错
```
interface Foo {
	id: string;
}
interface Bar extends Foo {
	id: number; // 报错
}
```

interface 继承 type。 定义的对象，同样使用关键字 extends
```
type Country = {
	name: string;
	capital: string;
};
interface CountryWithPop extends Country {
	population: number;
}
```

interface继承类class，会继承类的所有成员，含有私有成员和保护成员的类被继承将无法实例化
```
class CL {
	x: string = "";

	y(): boolean {
		return true;
	}
}

interface B extends CL {
	z: number;
}
const b: B = {
	x: "",
	y: function () {
		return true;
	},
	z: 123,
};
```

#### 接口合并
> 多个同名接口会合并成一个接口

同名接口合并，如果有相同的属性，同样不能有类型冲突，否则会报错
方法名同名但是不同的类型声明，会发生函数重载
```
interface Box {
	height: number;
	width: number;
}
interface Box {
	length: number;
}
const box: Box = {
	height: 10,
	width: 20,
	length: 30,
};
```

#### interface 与 type 异同
interface和type命令都可以表示对象类型，很多对象类型两者皆可定义，几乎所有的interface都可以使用type命令
```
type Country1 = {
	name: string;
	capital: string;
};
interface Country2 {
	name: string;
	capital: string;
}
```

但是interface和type还是有不同点，具体如下
1、type可以表示非对象类型，interface只能表示对象类型(数组，对象)
2、interface可以继承其他类型，type不支持继承
type定义的对象添加属性，只能使用&运算符重新定义类型
```
type Animal = {
	name: string;
};
type Bear = Animal & {
	honey: boolean;
};
// interface可以使用extends继承type，type也可以用&扩展新的类型
```
3、同名interface会自动合并，同名type会报错
```
type A1 = { foo: number }; // 报错
type A1 = { bar: number }; // 报错
interface A2 {
	foo: number;
}
interface A2 {
	bar: number;
}
const obj2: A2 = {
	foo: 1,
	bar: 1,
};
```
4、interface不能包含属性映射，type可以
```
interface Point2 {
	x: number;
	y: number;
}
// 正确
type PointCopy1 = {
	[Key in keyof Point2]: Point2[Key];
};
// 报错
interface PointCopy2 {
	[Key in keyof Point2]: Point2[Key];
};
```
5、type可以扩展原始数据类型（扩充后赋值难进行，无意义），interface不行
```
// 正确
type MyStr = string & {
	type: "new";
};
// 报错
interface MyStr2 extends string {
	type: "new";
}
```
6、interface无法表达某些复杂类型（联合类型和交叉类型）
```
type A7 = {
	/* ... */
};
type B7 = {
	/* ... */
};

type AorB = A7 | B7;
type AorBwithName = AorB & {
	name: string;
};
```
7、this关键字只能作用于interface
```
interface Foo2 {
	add(num: number): this;
}
class Calculator implements Foo2 {
	result = 0;
	add(num: number) {
		this.result += num;
		return this;
	}
}
// 报错
type Foo = {
	add(num: number): this;
};
```

相对来说，interface使用起来灵活性更高，便于扩充类型或者自动合并，但是涉及到复杂类型运算，type更方便

















