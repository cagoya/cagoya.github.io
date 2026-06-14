# C\#

## 简介

C# 读作 C sharp，是微软发布的一种简单、安全、通用的面向对象编程语言，是适用于 .NET 平台的最流行语言。C# 基础语法和 Java 几乎是对应的，仅在一些细节上有差距。

C# 中所有的变量和函数都应该定义在类中

```cs
class HelloWorld // 一般与文件同名
{
    /* main函数 */
    static void Main(string[] args)
    {
    Console.WriteLine("Hello World!");
    }
}
```

但是有顶级语句支持在所有类之前写一些其他代码

```cs
Console.WriteLine("请输入 A 的值:");
int a = Convert.ToInt32(Console.ReadLine());
Console.WriteLine("请输入 B 的值:");
int b = Convert.ToInt32(Console.ReadLine());
int sum = a + b;
Console.WriteLine($"A + B 的结果是: {sum}");
```

## 内置类型

:::info 值类型和引用类型
C\# 中的类型还是分为值类型和引用类型，值类型在复制时会完整拷贝一次，而引用类型则会传递引用。

:::
### 值类型

* `byte` `int` `long`
* `struct`（C\#中的结构体和类不同）
* `DateTime` `DateOnly` `TimeOnly`
* `Guid`：全局唯一标识符
* `ValueTuple`：值元组

### 内置类

#### Tuple

Tuple 用于表示固定数量的、不同类型的值的有序集合。Tuple 的元素是只读的。

```cs
var cityInfo = new Tuple<string, int>("Paris", 2200000);
Console.WriteLine($"City:{cityInfo.Item1}, Population:{cityInfo.Item2}");
```

#### List

List：表示一个可变大小的列表，元素可以通过索引访问

* 添加元素 Add(val)
* 根据值删除第一个匹配的元素 Remove(val)
* 根据索引删除元素 RemoveAt(idx)
* 清空所有元素 Clear()
* 查找是否包含某个元素 Contains(val)
* 查找元素的索引 IndexOf(val)
* 插入元素 Insert(idx, val)
* 排序 Sort()

```cs
List<int> numbers = new List<int> { 5, 2, 8, 1 };
numbers.Sort(); 
// numbers 现在是 {1, 2, 5, 8}
```

#### HashSet

HashSet：表示一个无序的、不包含重复元素的集合。它使用哈希表实现，提供快速的查找、添加和删除操作。

* 添加元素 Add(val) 添加重复的元素会被忽略
* 查找是否包含某个元素 Contains(val)
* 删除元素 Remove(val)

```cs
// 去重，但是HashSet 但是不保证顺序保持
List<int> myList = new List<int>{1, 2, 1, 3, 4, 5, 2};
HashSet<int> myHashSet = new HashSet<int>(myList);
```

#### Dictionary

Dictionary：表示一个键值对的集合，键是唯一的。它也是通过哈希表实现的，提供通过键快速查找值的功能，访问不存在的键会报错。

* 添加元素 Add(val)
* 检查键是否存在 ContainsKey(key)
* 安全访问 TryGetValue(key, out type value)
* 移除元素 Remove(val)

```cs
Dictionary<string, int> ages = new Dictionary<string, int>();
// 如果存在对应的键，这个键的值会被存到 davidAge 这个局部变量中
if (ages.TryGetValue("David", out int davidAge))
{
    Console.WriteLine($"David's age: {davidAge}");
}
else
{
    Console.WriteLine("David not found in the dictionary.");
}
```

### 接口

接口是一个引用类型，定义了一组公共行为（方法、属性、事件、索引器），但没有提供这些行为的具体实现。

```cs
// interface 中的方法默认是 public 的
public interface IShape
{
    double Area();
    double Perimeter();
}

public class Circle : IShape
{
    public double Radius { get; set; }
    public double Area() => Math.PI * Radius * Radius;
    public double Perimeter() => 2 * Math.PI * Radius;
}
```

#### 委托

委托是类型安全的函数指针。它们允许你将方法作为参数传递，或将方法存储在变量中。

我们有两类常用的委托类型：

* Action：是一个指向没有返回值的方法的引用。
* Func：表示一个有返回值的方法。

```cs
public delegate void SimpleDelegate();
public class SimpleDelegateExample
{
    public static void Method1()
    {
        Console.WriteLine("Method1 被调用了！");
    }

    public static void Method2()
    {
        Console.WriteLine("Method2 被调用了！");
    }

    public static void Main(string[] args)
    {
        // 实例化委托，并将其指向 Method1
        SimpleDelegate del1 = new SimpleDelegate(Method1);
        del1(); // 调用委托，等同于调用 Method1
        Console.WriteLine("#pagebreak()");
        // 将委托指向 Method2
        SimpleDelegate del2 = Method2; // 简写形式
        del2(); // 调用委托，等同于调用 Method2
    }
}
```

#### Array

数组是引用类型，无论它们存储的是值类型元素还是引用类型元素。

```cs
// 包含5个整数的数组对象
int[] myArray = new int[5];
```

#### 字符串

字符串是不可变的，这意味着一旦创建了一个字符串对象，它的内容就不能被改变。任何看起来修改字符串的操作（例如连接）实际上都会创建一个新的字符串对象。

* 空字符串：`string.Empty`
* `string.Join(sep)`：使用指定分隔符连接
* `StringBuilder`：当需要频繁修改或连接大量字符串时使用
* `Length`：获取字符串长度
* `Equals()`：提供更多控制，可以指定比较规则（例如是否区分大小写）
* `Compare()`：比较两个字符串，并返回一个整数表示它们的关系
* `Contains()`：检查字符串是否包含子字符串
* `IndexOf()` / `LastIndexOf()`：返回子字符串或字符第一次/最后一次出现的位置，如果未找到则返回 −1
* `StartsWith()` / `EndsWith()`：检查字符串是否以指定的子字符串开头或结尾
* `Substring()`：提取从指定索引开始（可选指定长度）的子字符串
* `Replace()`：替换字符串中的所有指定字符或子字符串
* `ToUpper()` / `ToLower()`：转换为大写或小写
* `Trim()` / `TrimStart()` / `TrimEnd()`：移除字符串开头/结尾/两端的空白字符
* `Split(sep)`：使用指定的分隔符将字符串分割成字符串数组

字符串插值提供了一种简单高效的格式化字符串的方式

```cs
string name = "Alice";
int age = 30;
string message = $"Hello, my name is {name} and I am {age}years old.";
Console.WriteLine(message); 
// 输出: Hello, my name is Alice and I am 30 years old.
```

原始字符串提供了一种不转义的字符串表示方式

```cs
// 路径字符串，避免转义反斜杠
string filePath = @"C:\Program Files\MyApp\data.txt";
Console.WriteLine(filePath); // 输出: C:\Program Files\MyApp\data.txt
```

#### 枚举

枚举的主要目的是提高代码的可读性和可维护性，因为它能将一些相关的值赋予有意义的名称。

```cs
// 默认底层类型为 int
enum Day
{
    Monday,   // 0
    Tuesday,  // 1
    Wednesday // 2
}
```

#### 可空类型

可空类型允许将值类型当作可以为 null 的类型来处理。通常情况下，像 int、bool、DateTime 这样的值类型是不能为 null 的，它们总是有一个默认值（比如 int 的默认值是 0）。然而，在某些场景下，可能需要表示一个值类型“缺失”或“未定义”的状态，这时候可空类型就非常有用了。

可以通过在值类型后面添加一个问号 ? 来声明一个可空类型

```cs
int? x = 10;
int? y = null;
```

要获取可空类型的值，可以使用它的 Value 属性，但前提是该可空类型不为 null。

```cs
int? a = 5;
if (a.HasValue)
{
    Console.WriteLine($"a 的实际值是：{a.Value}");
}
else
{
    Console.WriteLine("a 没有值。");
}
```

## 程序控制

### 分支与循环

* `if-else`，`switch`，`while`，`for`，`do...while`，三元表达式均同 C
* 支持自动类型推导，使用`var`关键字
* 支持`foreach`遍历集合所有元素

```cs
List<int> numbers = new List<int>{1, 2, 3, 4, 5};
foreach (var number in numbers)
{
    Console.WriteLine(number);
}
```

### 命名空间

命名空间的定义和 C++ 类似，使用`namespace`关键字，但是C\#中导入命名空间等于导入包，使用`using`关键字。

```cs
using System;
Console.WriteLine ("Hello there");
// 也可以写全称
System.Console.WriteLine ("Hello there");
```

### 异常处理

C\# 的异常处理依旧是传统的`try-catch-finally`，异常类主要是直接或间接地派生于 `System.Exception` 类，比如栈溢出会抛出 `System.StackOverflowException`。

## 函数

### 参数

C\# 中的函数都应该定义在类中，支持位置参数、关键字参数、默认参数和可变长参数。

```cs
public void Log(string message, bool isError = false)
{
    //实现省略...
}
Log("Hello, World!", isError: true);
```

可变长参数其实`Main`函数的命令行参数就是

```cs
public void DisplayNumbers(params int[] numbers)
{
    Console.WriteLine("您输入的数字是:");
    foreach (int num in numbers)
    {
        Console.Write($"{num} ");
    }
    Console.WriteLine();
}
```

C\# 支持函数重载，规则同C++

```cs
public int Add(int a, int b)
{
    return a + b;
}

public double Add(double a, double b)
{
    return a + b;
}
```

## 本地函数

虽然C\# 不是函数式的语言，但是它支持在一个函数内部定义另一个函数，这个函数被称为本地函数。

```cs
public void outer(int a)
{
    int inner(int b)
    {
        return b * 2 + a;
    } // 访问了外面的 a
    int res = inner(10); // 在这里调用小函数
    return res;
}
```

## lambda 表达式

lambda表达式即匿名函数，格式为

```cs
(参数列表) => 表达式或语句块
```

* 参数列表和普通函数的参数列表相同
* 表达式或者语句块
  * 如果是表达式，那么 lambda 表达式会返回该表达式的值
  * 如果是语句块，那么 lambda 表达式会执行该语句块，这种情况下有返回值需要使用 return 返回

```cs
Action greet = () => Console.WriteLine("你好！");
greet();// 输出：你好！

Func<int, int> square = x => x * x;
Console.WriteLine(square(5)); // 输出：25
```

## OOP

> 面向对象的整体风格和 C++ 差不多，这里只介绍一些 C# 特有的。

### 属性

带有后备字段的属性，是属性最基本和最完整的实现方式。

```cs
public class Person
{
    private string _name; // 后备字段 
    public string Name // 属性
    {
        get
        {
            // 在获取值之前可以添加逻辑，例如日志记录
            Console.WriteLine("Getting name...");
            return _name;
        }
        set
        {
            // 在设置值之前可以添加逻辑，例如数据验证
            if (string.IsNullOrWhiteSpace(value))
            {
                throw ...;
            }
            _name = value;
            Console.WriteLine("Setting name to: " + value);
        }
    }
}
```

有没有觉得上面那种写法很麻烦，所以当不需要对get set 方法添加额外逻辑时可以简写

```cs
public class Product
{
    public string ProductName { get; set; }
    public decimal Price { get; private set; }
}
```

### 对象初始化器

对象初始化器提供了一种简洁的方式来创建和初始化对象，相比构造函数传入的值全部写在参数里面更为直观。

```cs
Product product = new Product
{
    ProductName = "笔记本电脑",
    Price = 8999.99m
};
```

### 继承

:::info 接口与抽象类
尽量实现接口，而不是继承抽象类，一方面一个类是可以实现多个接口的，但是不能继承多个抽象类，另一方面过多层的继承本身就是一个不太好的设计。

:::
C\# 只支持单继承，使用`:`表示继承关系，和`Java`不一样，虚函数还是需要像`C++`一样用`virtual`关键字标注，当子类想要重写父类的虚方法时，需要使用`override`关键字。

如果一个类包含抽象方法（只有声明没有实现的方法），那么这个类必须声明为`abstract`。抽象类不能直接实例化。

### 泛型

泛型和`C++`的模版类似，支持类型参数。

```cs
// 泛型函数
public class Utility
{
    public static void Swap<T>(ref T a, ref T b)
    {
        T temp = a;
        a = b;
        b = temp;
    }
}
```

```cs
// 泛型类
public class MyGenericClass<T>
{
    public T Value { get; set; }
    public MyGenericClass(T value)
    {
        Value = value;
    }
    public void PrintValueType()
    {
        Console.WriteLine($"值的类型是: {typeof(T).Name}");
    }
}
```

有时，你需要对泛型类型参数施加限制，例如，你可能需要确保泛型类型是一个引用类型

```cs
// 其中 T 必须是引用类型，并且必须有一个无参公共构造函数
public class MyRestrictedClass<T> where T : class, new()
{
    public T CreateInstance()
    {
        return new T(); // 由于 new() 约束，我们可以调用无参构造函数
    }
}
```

### 拓展方法

拓展方法允许你向已有的类型添加新的方法，而不需要修改原始类型。

定义拓展方法有以下几个关键点：

1. 静态类
2. 静态方法
3. 第一个参数是 this 关键字，后面跟着你想要拓展的类型。

```cs
// 给 int 类型添加一个判断偶数的方法
namespace MyMathExtensions
{
    public static class NumberExtensions
    {
        // 这是一个拓展方法，它拓展了 int 类型
        public static bool IsEven(this int number)
        {
            return number % 2 == 0;
        }
    }
}
```

### 索引器

索引器允许你像访问数组一样访问对象中的数据，而无需显式调用方法，类似于`C++`中重载`[]`运算符。

```cs
public class ArrayLikeCollection
{
    private int[] _data;
    public int this[int index]
    {
        get { return _data[index]; }
        set { _data[index] = value; }
    }
}
```

## 特性

特性（Attributes）是用于向代码元素（如类、方法、属性等）添加元数据的机制，对标`Java`的注解。在C\#中，特性即为放置在代码元素前面的方括号`[]`所描述的类。

```cs
public class Program
{
    [Obsolete("Don't use OldMethod, use NewMethod instead",true)]
    static void OldMethod()
    { 
        Console.WriteLine("It is the old method");
    }

    static void NewMethod()
    { 
        Console.WriteLine("It is the new method"); 
    }

    public static void Main()
    {
        OldMethod();
    }
}
```

IDE （甚至都不需要编译）应该会报错：`Don’t use OldMethod, use NewMethod instead`

## 异步编程

`Task` 是 C\# 中用于表示异步操作的核心抽象，它代表一个可以在未来完成的操作。Task 对象提供了比直接使用线程更高级别的抽象，因为它管理了线程池，并提供了更方便的组合和等待异步操作的方式。

```cs
public class Program
{
    static void Main()
    {
        // Task.run 是一种强制异步的手段
        Task.Run(() =>
        {
            Console.WriteLine("Hello World!");
        });
    }
}
```

`async` 和 `await` 关键字用于定义和调用异步方法：

* `async` 是一个修饰符，用于标记一个方法是异步的。
* `await` 关键字用于“等待”一个异步操作的完成。它只能在`async`方法内部使用。当`await`表达式遇到一个尚未完成的异步操作，它会暂停当前方法的执行，并将控制权返回给调用方。当被等待的异步操作完成后，方法将从暂停的地方继续执行。

## 模式匹配

模式匹配 是一种强大的特性，它允许根据表达式的“形状”或运行时类型来测试表达式，并根据匹配的结果提取信息，这里仅介绍最常用的类型模式，类型模式用于检查表达式的运行时类型是否与指定的类型匹配。

```cs
object obj = "Hello World";
if (obj is string s)
{
    Console.WriteLine($"这是一个字符串: {s}");
}
```

可以用上述方法检测是否为空

```cs
string? message = ReadMessageOrDefault();
if (message is not null)
{
    Console.WriteLine(message);
}
```

## 简单 LINQ

LINQ（Language Integrated Query）是 C# 中一个非常强大的特性，它允许你使用类似于 SQL 的语法来查询各种数据源，比如集合、数据库、XML 文档等。

LINQ 主要通过两种语法来编写查询：

1. 查询语法（Query Syntax）： 类似于 SQL 语句，更具声明性。
2. 方法语法（Method Syntax / Fluent Syntax）： 使用扩展方法和Lambda 表达式，更具函数式编程的风格。

推荐使用方法语法

假设我们有一个 Student 类的列表：

```cs
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
    public string Major { get; set; }
}

List<Student> students = new List<Student>{...};
```

`Select`：筛选出年龄等于 20 的学生

```cs
var studentsAge20Method = students.Where(s => s.Age == 20);
foreach (var student in studentsAge20Method)
{
    Console.WriteLine($"ID: {student.Id}, 姓名:{student.Name}, 年龄: {student.Age}");
}
```

:::info LINQ 是何时完成查询的？
LINQ 并不是在你写出表达式的时候就去执行了，它是惰性执行的，知道你去遍历 LINQ 查询结果真的获取数据时才会执行。

:::
`Project`：只选择学生的姓名和专业

```cs
var studentNamesAndMajorsMethod = students.Select(s => new { s.Name, s.Major });
```

这上面`new`出来的是匿名类型，允许在不显式定义类的情况下，创建一个包含一组只读属性的新对象。

Sort：按年龄升序排列学生

```cs
var studentsSortedByAgeMethod = students.OrderBy(s => s.Age);
```

Group：按专业分组学生

```cs
var studentsGroupedByMajorMethod = students.GroupBy(s => s.Major);
foreach (var group in studentsGroupedByMajorMethod)
{
    Console.WriteLine($"专业: {group.Key}");
    foreach (var student in group)
    {
        Console.WriteLine($"  姓名: {student.Name}, 年龄: {student.Age}");
    }
}
```

Aggregate：计算所有学生的平均年龄

```cs
var averageAgeMethod = students.Select(s => s.Age).Average();
```