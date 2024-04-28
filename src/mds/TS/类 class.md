#### 简介
类封装了属性和方法，是面向对象编程的基本构件
##### 属性的类型
类的属性可以在顶层声明，也可以在构造方法内部声明
```
class Point {
	// 声明number类型的x,y
	x: number;
	y: number;
	// 不设置初值提示报错，可以关掉strictPropertyInitialization(默认打开)，或者使用非空断言
	x2!: number;
	y2!: number;
	// 声明时给出值的会自动推断类型，如下x,y会被推断为number类型
	x3 = 3;
	y3 = 4;
	// 如果只是声明变量不赋值，默认推断为any
	x4;
	y4;
}
```
##### readonly修饰符
增加了readonly修饰符的属性，只可读不可修改，实例对象也不能修改
```
class A {
	readonly id = "foo";
}
const a = new A();
a.id = "bar"; // 报错
```
可以使用构造方法修改只读属性的值
```
class A2 {
	readonly id: string = "foo";
	constructor() {
		this.id = "bar"; // 正确
	}
}
const a2 = new A2();
a2.id = "bar2"; // 错误
```
##### 方法的类型
类的方法就是普通函数，和普通函数类型声明，重载，参数默认值等都是一致，也会进行正常的类型推断
```
class Point2 {
	x: number;
	y: number;
	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}
	add(point: Point2) {
		return new Point2(this.x + point.x, this.y + point.y);
	}
}
```
需要注意的是构造方法不能声明返回值类型，因为构造方法会返回实例对象

##### 存取器方法
存取器是指包含取值器getter和存值器setter特殊的类方法
```
class C {
	_name = "";
	get name(): string {
		return this._name;
	}
	set name(value: string) {
		this._name = value;
	}
}
```
get ，取值方法，用于取值，set，存值方法，用于设置值，如果只有get，则会自动转为readonly属性
set方法设置的值必须和get返回值类型保持一致，可访问性也必须一致
存取器方法作用可以是数据劫持，在取值或者设置值的时候做一些事情

##### 属性索引
类可以定义属性索引，定义了之后所有的属性或者方法都必须和属性索引保持一致
```
class MyClass {
	[s: string]: boolean | ((s: string) => boolean);
	x = true; // 正常
	x = 12; // 报错
	get(s: string) {
		return this[s] as boolean;
	}
	myx(s: string) {
		// 报错
		return 2134;
	}
}
```

#### interface接口
##### implements 关键字
interface或者type可以用对象的形式,为class指定一组检查条件,也就是我们可以使用接口约束类,通过implement关键字
```
interface Country {
	name: string;
	capital: string;
	get(name: string): boolean;
}
或者
type Country = {
   name:string;
   capital:string;
}
class MyCountry implements Country {
	name = "";
	capital = "";
	x = 10; // 正确
	get(s) {
		// s 的类型是 any
		return true;
	}
	myF() {
		console.log("hello");
	}
}
```
interface只能检查条件,不能替代class本身的类型声明，类可以定义接口没有声明的方法和属性，不同于普通的对象约束

implements关键字后面可以是个类，此时后面的类会被当做为接口
```
class Car {
	id: number = 1;
	move(): void { }
}

class MyCar implements Car {
	id = 2; // 不可省略
	move(): void { } // 不可省略
}
```
##### 实现多接口
类可以实现多个接口，也就是受多个接口的限制，每个接口之间用逗号分割
```
interface MotorVehicle {
	// ...
}
interface Flyable {
	// ...
}
interface Swimmable {
	// ...
}
class Car2 implements MotorVehicle, Flyable, Swimmable {
	// 必须满足MotorVehicle, Flyable, Swimmable这三个接口的方法和属性才行
	// ...
}
```
也可以通过接口继承实现继承多接口
```
interface SuperCar extends MotorVehicle, Flyable, Swimmable {
	// ...
}
class SecretCar implements SuperCar {
	// ...
}
```
##### 类与接口的合并
TS不允许同名类，当有接口与类同名，接口会被合并到类中
```
class A3 {
	x: number = 1;
}
interface A3 {
	y: number;
}
let a3 = new A3();
a3.y = 10; // 不赋值的话y的值为undefined
a3.x; // 1
a3.y; // 10
```
#### class 类型
##### 实例类型
TS中类本身可以代表该类的实例类型
```
interface ColorBase {
	baseColor: string;
}

class Color implements ColorBase {
	name: string;
	baseColor = "block";
	constructor(name: string) {
		this.name = name;
	}
}
const green: Color = new Color("green");
const red: ColorBase = new Color("red");
```
##### 类的自身类型
无法用类名表示类的自身类型，但是可以用typeof 运算符
```
class Point4 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

function createPoint(PointClass: typeof Point4, x: number, y: number): Point4 {
	return new PointClass(x, y);
}
```
类本身是构造函数的语法糖，我们可以用构造函数对类进行类型声明
```
interface PointConstructor {
	new(x: number, y: number): Point4;
}
function createPoint2(
	PointClass: PointConstructor,
	x: number,
	y: number
): Point4 {
	return new PointClass(x, y);
}
```
##### 结构类型
class 遵循 结构类型原则，只要一个对象满足class的实例类型，就和该class属于同类型

```
class Foo {
	id!: number;
	static height: number;
	constructor(x?: number) { }
}
class FooPro {
	id!: number;
	name!: string;
	constructor(y?: string) { }
}
function fn(arg: Foo) {
	// ...
}
const bar = {
	id: 10,
	amount: 100,
};
fn(bar); // 正确
fn(new FooPro()); // 正确
const foopro: Foo = new FooPro(); // 正确
```
类或者对象，只要和类的实例结构相同，TS会认为两者类型相同
两个类的兼容关系，只检查实例成员，不考虑静态方法和构造方法
存在私有成员和保护成员时，只有继承关系的类才能兼容类型

结构类型原则， 如果类是空类，那么类型为空类的地方可以传任意值，与空对象相似
```
class Empty { }
function emfn(x: Empty) {
	// ...
}
emfn({});
emfn(window);
emfn(emfn);
```
#### 类的继承 extends
子类可以使用extends关键字继承基类的所有属性和方法，extends关键字后面不仅可以是类，只要其类型为构造函数均可以
```
class A4 {
	greet() {
		console.log("Hello, world!");
	}
}
class B extends A4 { }
const b = new B();
b.greet(); // "Hello, world!"
// 继承的类遵循结构类型原则
const a4: A4 = b;
a4.greet();
```
子类可以覆盖基类的同名方法，但是类型定义必须和基类保持一致
```
class B2 extends A4 {
	greet(name?: string) {
		if (name === undefined) {
			super.greet();
		} else {
			console.log(`Hello, ${name}`);
		}
	}
}
class B3 extends A4 {
	// 报错
	greet(name: string) {
		console.log(`Hello, ${name}`);
	}
}
```
当基类中存在受保护的成员protected，子类可以将该成员可访问属性改为public或者protected，但是不能改成private
```
class A5 {
	protected x: string = "";
	protected y: string = "";
	protected z: string = "";
}
class B6 extends A5 {
	public x: string = ""; // 正确
	protected y: string = ""; // 正确
	private z: string = ""; // 报错
}
```
#### 可访问性修饰符
类内部成员是否可以在外部访问，由修饰符public，private和protected控制
##### public
默认修饰符，默认类的属性和方法都是可以外部访问的，可以忽略不写
```
class Greeter {
	public greet() {
		console.log("hi!");
	}
}
const g = new Greeter();
g.greet();
```
##### private
私有成员，只能在当前类访问，外部和子类都不能访问
```
class A7 {
	private x: number = 0;
	#y: number = 2;
	// 内部方法可以访问修改私有成员
	getX() {
		console.log(this.x);
	}
	setX(num: number) {
		this.x = num;
	}
}
const a7 = new A7();
a7.x; // 报错
a7["x"]; // 成功
if ("x" in a7) {
	// 成功
}
a7["y"]; // 报错
class B7 extends A7 {
	// 子类他同样不能定义同名的父类得私有成员
	x = 1; // 报错
	showX() {
		console.log(this.x); // 报错
	}
}
```
private被编译后关键字会被剥离，外部成员此时就能访问，故TS没有严格限制private，可以使用方括号或者 in运算符 访问使用private定义的私有成员
ES2022可以使用前面加 # 从而实现真正意义上的私有属性

我们也可以将构造方法私有，禁止new命令生成实例，强制通过内部的工厂函数生成实例
```
class Singleton {
	private static instance?: Singleton;
	private constructor() { }
	static getInstance() {
		if (!Singleton.instance) {
			Singleton.instance = new Singleton();
		}
		return Singleton.instance;
	}
}
const s = Singleton.getInstance();
```
##### protected
protected只能在内部和子类中使用，无法在实例中使用
```
class A8 {
	protected x = 1;
	protected y = 1;
	getX() {
		// 内部可以正常的获取，设置成员
		return this.x;
	}
}
class B8 extends A8 {
	y = 2; // 子类可以定义同名成员
	getX() {
		return this.x;
	}
}
const a8 = new A8();
const b8 = new B8();

a8.x; // 报错
a8.getX();
b8.getX(); // 1
b8.y; // 2
```
##### 实例属性的简写形式
很多实例属性是通过构造方法传入
```
class Point7 {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}
```
可以简写成如下形式
```
class Point8 {
	constructor(public x: number, public y: number) { }
}
const p = new Point8(10, 10);
p.x; // 10
p.y; // 10
```
在构造函数中，参数前面加上public修饰符，TS就会自动声明对应的公开属性，同时设置参数值，不必在构造函数中再赋值
除，public，private，protected，readonly修饰符有同样的作用，readonly还可以和前面三个共同使用
```
class Aa {
	constructor(
		public a: number,
		protected b: number,
		private c: number,
		readonly d: number
	) { }
}

// 编译结果
class Aa {
	a;
	b;
	c;
	d;
	constructor(a, b, c, d) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	}
}

class Ab {
	constructor(
		public readonly x: number,
		protected readonly y: number,
		private readonly z: number
	) { }
}
```
#### 静态成员
可以在类的内部通过static关键字定义类的静态成员，静态成员只能通过类本身调用，不能通过实例对象调用
```
class MyClass2 {
	static x = 0;
	public static printX() {
		console.log(MyClass2.x);
	}
	private static y = 2; // 只能在内部访问y
	static #z = 3; // 私有属性的ES6写法
	static getY() {
		return MyClass2.y;
	}
}
MyClass2.x; // 0
MyClass2.printX(); // 0
MyClass2.y; // 报错
MyClass2.getY();

const myclass2 = new MyClass2();
myclass2.x; // 报错
```
static 关键字前面依然可以使用public

public 与 protected的静态成员可以被继承
```
class A9 {
	public static x = 1;
	protected static y = 1;
}
class B9 extends A9 {
	static getY() {
		return B9.y;
	}
}
B9.x; // 1
B9.getY(); // 1
```
#### 泛型类
类可以写成泛型，使用类型参数
```
class Box<Type> {
	contents: Type;
	constructor(value: Type) {
		this.contents = value;
	}
}
const box: Box<string> = new Box("hello!");
const box2 = new Box("hello!"); // 不加类型也会自动类型推断为 Box<string>
```
#### 抽象类，抽象成员
在类定义前面加上关键字abstract，该类就成了抽象类，不能被实例，只能作为其它类的模板，
抽象类的成员加上abstract关键字，就成了抽象成员，也是只能定义，不能在类里面实现，抽象成员必须在子类中实现对应的方法和属性，否则会报错
抽象类可以被抽象类继承
```
abstract class A10 {
	abstract name: string;
	abstract execute(): string;
	id = 1;
	test() { }
}
class B10 extends A10 {
	name = "b10";
	amount = 100;
	execute() {
		return "hello";
	}
}
abstract class AB extends A {
	bar!: string;
}
const b10 = new B10();
b10.id; // 1
b10.amount; // 100
```
抽象类的作用是相关子类拥有和基类相同接口，可以看做是模板，其中抽象成员必须子类实现，非抽象成员子类会继承
抽象成员也只能在抽象类中，不能再普通类中，不能有具体的实现代码，抽象成员也不能有`private`修饰符，否则子类无法实现
一个类只能继承一个抽象类
抽象类的实现可以用`extends`(需要在子类的`constructor`使用`super`)，也可以用`implement`
#### 类的this
类的方法中如果存在this关键字，它指向该方法当前所在的对象
this是运行时的状态，谁调用指向谁，
箭头函数中的this指向当前上下文
```
class A11 {
	name = "A11";
	getName() {
		return this.name;
	}
	getName2 = () => {
		return this.name;
	};
	getName3(this: A11) {
		return this.name
	}
	// this本身可以当做类型适用，表示当前类的实例对象
	setName(value: string): this {
		this.name = value
		return this
	}
	static aa: this //报错，this无法用于静态成员
}

const a11 = new A11();
a11.getName(); // 'A11'
a11.getName2(); // 'A11'
const b11 = {
	name: "b",
	getName: a11.getName,
	getName2: a11.getName2,
	getName3: a11.getName3,
};
b11.getName(); // 'b'
b11.getName2(); // 'A11'
b11.getName3(); // 'b'

const b12 = a11.getName3
b12() // 报错
```
ts允许函数的第一个参数名为this，用来声明函数内部的this类型，会在编译后去除该参数


noImplicitThis设置: 默认为打开，当this的值推断为any类型，会报错
```
class Rectangle {
	constructor(
		public width: number,
		public height: number
	) { }

	getAreaFunction() {
		return function () {
			return this.width * this.height; // 报错
		};
	}
}
```










