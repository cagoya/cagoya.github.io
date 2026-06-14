# JS

JavaScript 虽然当年干啥啥不行，但是现在统治着前端领域，可能在WebAssembly技术有进一步发展之前还会长期如此。JS 的标准被称作`ESx`，其中`ES`是`ECMAScript`的缩写，`x`是版本号，这是因为JS的正式名称确实是`ECMScript`。

## 数据类型

* JS 不区分整数和浮点数，一律都是`Number`类型
* 字符串
* 数组
* 对象
* 布尔值`true`和`false`
* `BigInt`大整数类型
* `null`和`undefined`

注意JS中的等于有两种`==`和`===`，`==`会自动做类型转换，从而导致一些奇怪的结果，这是JS设计的失败，所以不允许使用`==`，**只使用`===`**。此外`null`和`undefined`也没有本质的区别，**一般我们使用`null`**，`undefined`仅仅在判断函数参数是否传递的情况下有用。

### let 与 const

`let` 是在代码块内有效，`var` 是在全局范围内有效；`let` 只能声明一次 `var` 可以声明多次；并且`let`没有变量提升，**推荐变量只使用 `let` 声明**。

```js
{
  let a = 0;
  var b = 1;
}
a  // ReferenceError: a is not defined
b  // 1
```

`const` 用于声明常量，`const` 声明的变量不能被重新赋值，但是对象的属性可以修改。

```js
const a = 0;
a = 1;  // TypeError: Assignment to constant variable.

const obj = { a: 0 };
obj.a = 1;  // OK
```

### 字符串

用单引号或者双引号，后来增补了反引号来表示多行字符串，拼接字符串可以直接使用`+`，此外，模版字符串也是使用反引号。

```js
let name = 'World';
let str = `Hello, ${name}`;
// str = 'Hello, World'
```

字符串长度使用`length`属性，字符串是不可变类型，赋值不会报错但是无效。字符串常用的方法，什么转大写，转小写之类的这里就不一一列举了。

### 数组

JS的数组可以存储任意类型，是真的可以组合任意类型，但是不推荐这样做。比如：

```js
let arr = [1, '2', true, { a: 1 }, [1, 2, 3]];
```

获取长度还是使用`length`属性，索引超出下标的赋值不会报错，而是会自动扩展数组，未定义的元素会自动填充`undefined`。

```js
let arr = [1, 2, 3];
arr[5] = 5;
// arr = [1, 2, 3, undefined, undefined, 5]
```

数组使用`push`和`pop`方法来在末尾添加和删除元素，使用`slice`来切片。

```js
let arr = [1, 2, 3];
arr.push(4);  // [1, 2, 3, 4]
arr.pop();    // [1, 2, 3]
arr.slice(1, 2);  // [2]
```

数组支持`sort`和`reverse`方法来排序和反转。

```js
let arr = [1, 3, 2];
arr.sort();  // [1, 2, 3]
arr.reverse();  // [3, 2, 1]
```

### 对象

JS 原生的对象其实就是键值对，JS的对象所有属性（键）都是字符串，值可以是任意类型。

```js
let Person = {
  name: 'John',
  age: 30,
  isStudent: false
};
```

访问不存在的属性不会报错，而是返回`undefined`。

```js
Person.height;  // undefined
```js 是动态类型的语言，也就是说可以随意增删对象的键值对。

```js
Person.height = 180;
delete Person.age;
```

### Map 与 Set

虽然对象本身就是键值对，但是对象的属性只能为字符串，这个是不合理的，所以新增了`Map`和`Set`。

```js
let map = new Map();
map.set('Alice', 90);
map.set('Bob', 85);
map.set('Charlie', 80);
map.get('Alice');  // 90
map.has('Bob');    // true
map.delete('Charlie');

let set = new Set();
set.add(1);
set.add(2);
set.add(3);
set.has(1);    // true
set.delete(2);
```

### 解构赋值

解构赋值是对赋值运算符的扩展，在代码书写上简洁且易读，语义更加清晰明了；也方便了复杂对象中数据字段获取。

```js
// 数组解构
let [a, b, c] = [1, 2, 3];
// a = 1
// b = 2
// c = 3

// 对象解构
let { a, b, c } = { a: 1, b: 2, c: 3 };
// a = 1
// b = 2
// c = 3
```

### 分支与循环

分支就是普通的`if`、`else if`和`else`，循环基本的`for`、`while`和`do while`是有的，此外，还支持`for in`和`for of`循环。`for in`循环遍历的是对象的属性，下面这个例子中，`for in`循环遍历了数组的索引（数组也是对象，索引就是属性名）；`for of`循环遍历的是可迭代对象（`iterable`），Array、Map和Set等都属于这一范畴。

```js
let a = ['A', 'B', 'C'];
for (let i in a) {
    console.log(i); // 0, 1, 2
    console.log(a[i]); // 'A', 'B', 'C'
}

for (let i of a) {
    console.log(i); // 'A', 'B', 'C'
}
```

总而言之，`for in`是一个历史遗留问题，`for of`才是更符合我们认知的现代编程语言中的`for-each`遍历。

## 函数

JS中函数是一等的公民，可以作为参数传递，也可以作为返回值返回。

```js
function add(a, b) {
    return a + b;
}

let sub = function(a, b) {
    return a - b;
}
```

### 参数传递

JS的传递常规是位置参数，但是多了不会报错，而是会自动忽略(没有变量名，但其实是传入了的)，少了也不会报错，而是会自动填充`undefined`。JS提供了`arguments`来获取所有传入的参数，`arguments`类似于一个数组。

```js
function f() {
    for (let i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
}
f(1, 2, 3);
// 输出：
// 1
// 2
// 3
```

ES6引入了`rest`参数，可以将所有传入的参数收集到一个数组中，也就是可变参数模版。

```js
function f(x, ...args) {
    for (let i = 0; i < args.length; i++) {
        console.log(args[i]);
    }
}
f(1, 2, 3);
// 输出：
// 2
// 3
```

### 命名空间

JS 其实并不存在命名空间，也不存在所谓的全局空间，在浏览器中，JS默认有个全局变量`window`，所有全局作用域的变量都被绑定到了`window`对象上，如果要区分自己的命名空间，可以把变量和函数绑定到一个自定义对象上。

```js
let myNamespace = {};
myNamespace.a = 1;

myNamespace.f = function() {
    console.log(myNamespace.a);
}
myNamespace.f();
```

### 方法

JS中的方法，就是对象的属性，只不过属性值是函数。

```js
let obj = {
    a: 1,
    f: function() {
        console.log(this.a);
    }
}
obj.f();
// 输出：1
```

这里有个`this`关键字，虽然`this`在很多OOP的语言里面都有，但是JS和它们不一样，这是一个大坑，也是JS的设计缺陷，`this`的值取决于函数的调用方式。在非严格模式下，当函数在全局环境中被直接调用时，`this` 默认指向全局对象，在浏览器中就是`window`。

```js
function showThis() {
  console.log(this);
}

showThis(); // 在浏览器中会输出 Window 对象

function f() {
    console.log(this.a);
}

let obj = {
    a: 1,
    f: f
}
f();
obj.f();
// 输出：
// undefined
// 1
```

还有一个常见的例子是嵌套函数，内层函数的`this`会重新指向全局对象。

```js
let obj = {
    a: 1,
    f: function() {
        function g() {
            console.log(this.a);
        }
        g();
    }
}
obj.f();
// 输出：undefined
```

### 高阶函数

高阶函数就是函数作为参数或者返回值的函数，常用的内置高阶函数有`map`、`filter`、`reduce`和`sort`等。

```js
let arr = [1, 2, 3];
arr.map(x => x * 2);  // [2, 4, 6]
arr.filter(x => x > 2);  // [3]
arr.reduce((x, y) => x + y);  // 6
arr.sort((x, y) => y - x);  // [3, 2, 1]
```

### 闭包

闭包就是函数可以访问到外部函数的变量，即使外部函数已经执行完毕。

```js
function f() {
    let a = 1;
    function g() {
        console.log(a);
    }
    return g;
}
let g = f();
g();  // 输出：1
```

### 箭头函数

看起来就是匿名函数

```js
let f = () => {
    console.log('Hello');
}
```

但其实箭头函数没有自己的`this`，而是继承自父级作用域，上面的例子可以修改为：

```js
let obj = {
    a: 1,
    f: function() {
        let g = () => {
            console.log(this.a);
        }
        g();
    }
}
obj.f();
// 输出：1
```

## 面向对象

在ES6中，`class`作为对象的模板被引入，它可以看作一个语法糖，本质是`function`，让对象原型的写法更加清晰、更像现代面向对象编程的语法。

```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    sayHello() {
        console.log('Hello, my name is ' + this.name);
    }
}

let person = new Person('John', 30);
person.sayHello();  // 输出：Hello, my name is John
```

通过`extends`实现类的继承，子类`constructor`方法中必须有`super`，且必须出现在`this`之前。

```js
class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    
    sayHello() {
        console.log('Hello, my name is ' + this.name + ' and I am in grade ' + this.grade);
    }
}
```

### 导入导出

使用`export`关键字导出模块，使用`import`关键字导入模块。每个模块都有自己的上下文，每个模块内声明的变量都是局部变量，不会污染全局作用域，每个模块只加载一次（是单例），若再去加载同目录下同文件，直接从内存中读取。

```js
// module.js
export function f() {
    console.log('Hello');
}

// main.js
import { f } from './module.js';
f();
```

## DOM 操作

:::info
这部分其实对于实际开发来说，用的并不多，因为现在已经有`React`、`Vue`等框架，它们已经封装好了`DOM`操作，我们只需要关注业务逻辑即可。

:::
### 基本概念

DOM 是 Document Object Model 的缩写，中文意思是文档对象模型。它描述了网页的结构，将网页看作一棵树，每个节点都是一个对象，通过 JavaScript 可以操作这棵树。这里只简单列举可以做些什么。

1. 首先需要找到想要操作的元素，可以根据`id`、`class`、`tag name`等来找到元素。
2. 然后可以修改元素的属性、内容、样式等。
3. 最后可以新增、删除元素。

以上可以做到创造出基本的`HTML`和`CSS`的组合了，但是我们还需要交互的逻辑，这就是事件处理。

### 事件处理

事件处理是`DOM`操作中非常重要的一环，它让网页能够响应用户的行为，例如点击、鼠标移动、键盘输入等。`element.addEventListener('eventName', function, [options])`: 这是最推荐的方法。它允许你为一个元素添加多个事件监听器。例如：

```js
const button = document.querySelector('#Button');
button.addEventListener('click', () => {
  alert('按钮被点击了！');
});
```

## 异步编程

:::info 为什么需要异步编程？
JS的一大特点是它的单线程和异步特性，这意味着它一次只能执行一个任务。如果某个任务需要很长时间（比如从服务器获取数据），程序就会被阻塞，用户界面会卡住，为了解决这个问题，异步编程应运而生。

:::
### 回调函数

回调函数指的是一个函数作为参数被传递给另一个函数，并在外部函数执行完毕后，内部调用这个函数来执行。同步的回调就是单纯地调用传入的函数：

```js
function processArray(array, callback) {
  for (let i = 0; i < array.length; i++) {
    // 在循环中立即调用回调函数
    callback(array[i]);
  }
}

// 使用同步回调
let numbers = [1, 2, 3];
processArray(numbers, function(item) {
  console.log(item * 2); // 输出 2, 4, 6
});
```

在上面的例子中，`console.log(item * 2)`这个回调函数在`processArray`函数执行时，每遍历一个元素就会立即执行一次。

异步回调函数在外部函数执行之后，等待某个事件（如定时器结束、数据加载完成）发生后才被调用。

```js
function fetchData(callback) {
  console.log("正在从服务器获取数据...");
  setTimeout(function() {
    // 模拟网络请求，2秒后调用回调函数
    const data = "这是服务器返回的数据";
    console.log("数据获取成功！");
    callback(data);
  }, 2000);
}

// 使用异步回调
fetchData(function(result) {
  console.log("接收到数据：", result);
});

console.log("程序继续执行，不会被阻塞。");
```

这个例子中`fetchData`函数会先打印“正在从服务器获取数据...”，然后`setTimeout`会在2秒后才执行回调函数。在此期间，`console.log("程序继续执行...")`已经被立即执行了，程序没有被阻塞。

但是回调函数的缺点是，当异步操作嵌套很深的时候，代码会变得难以阅读和维护，这种问题被称为回调地狱。

```js
// 假设这是一个异步函数
doThing1Async(function(result1) {
  // 当 doThing1Async 完成后，这个函数会被调用
  doThing2Async(result1, function(result2) {
    // ...以此类推，形成回调地狱
    doThing3Async(result2, function(result3) {
      console.log(result3);
    });
  });
});
```

### Promise

`Promise`是JS中用于处理异步操作的对象，简单来说，它是一个占位符，代表着一个还未完成的操作，但这个操作最终会有一个结果。一个`Promise`实例会经历以下三种状态之一：

1. Pending（进行中）：初始状态，既不是成功，也不是失败。
2. Fulfilled（已成功）：意味着操作成功完成。
3. Rejected（已失败）：意味着操作失败。

一个`Promise`实例只能从`Pending`状态转换为`Fulfilled`或`Rejected`状态，并且状态一旦改变就不能再变。

`Promise`通过`.then()`和`.catch()`方法来处理异步操作的结果：

* `.then()`：用于处理`Promise`成功（`Fulfilled`）时的结果。它接收一个回调函数，该函数会接收到成功时返回的值。
* `.catch()`：用于处理`Promise`失败（`Rejected`）时的错误。它接收一个回调函数，该函数会接收到失败时返回的错误信息。

`Promise`的一个强大之处在于它可以链式调用。`.then()`方法总是会返回一个新的`Promise`，这使得我们能够连续地进行异步操作，避免了回调地狱：

```js
doThing1Async()
  .then(result1 => {
    console.log(result1);
    // 返回一个新的 Promise
    return doThing2Async(result1);
  })
  .then(result2 => {
    console.log(result2);
    // 返回另一个 Promise
    return doThing3Async(result2);
  })
  .then(finalResult => {
    console.log(finalResult);
  })
  .catch(error => {
    // 整个链条中的任何错误都会被这里捕获
    console.error('有一个错误发生:', error);
  });
```

### async/await

`async/await`语法让异步代码变得更易读，因为它允许你以一种更像同步代码的方式来编写异步代码。`async`函数总是返回一个`Promise`。在 `async` 函数内部，你可以使用 `await` 关键字来“暂停”函数的执行，直到一个`Promise`成功解决。

```js
async function doAllTheThings() {
  try {
    const result1 = await doThing1Async();
    console.log(result1);
    
    const result2 = await doThing2Async(result1);
    console.log(result2);

    const finalResult = await doThing3Async(result2);
    console.log(finalResult);

  } catch (error) {
    console.error('有一个错误发生:', error);
  }
}

doAllTheThings();
```

### fetchAPI

`fetchAPI`是用于进行网络请求的API，它返回一个`Promise`，可以链式调用`then`和`catch`方法，默认请求方式是`GET`，`fetch`的第二个参数可以设置请求头、请求体、请求方式等。

```js
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

fetchData();
```