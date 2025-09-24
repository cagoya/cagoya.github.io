# GO

## 简介

Go 语言被设计成一门应用于搭载 Web 服务器，存储集群或类似用途的巨型中央服务器的系统编程语言，它**抛弃了继承，弱化了 OOP**。值得一提的是，你可能会在其它地方看见有人叫它Golang ，但它的官方名字其实是一直是Go，早期的时候由于go 这个域名被抢注了，所以官网的域名就采用了 `golang.org`，导致了许多人误解。

GO 语言的结构和 C 家族语言差不多，在下面这个简单的例子中，第一行是包声明，第二行是导入的包，第三行是 main 函数。

```go
package main
import "fmt"
func main() {
    /* 这是我的第一个简单的程序 */
    fmt.Println("Hello, World!")
}
```

可以看到行尾并没有分号，在 Go 程序中，一行代表一个语句结束，理论上可以写分号，然后把两条语句写在一行，但是一般不推荐这样做（除了部分错误处理那种习惯写在一行的）

## 基础语法

### 包

Go 语言中，包是组织代码的单位，导入的最小单位是包，而不是`.go`文件，所有的 Go 程序都必须属于一个包，包名通常是小写的，包名应该与文件所在的目录名一致。

```go
// mvc 模式下的 service 层
package service
```

### 可见性

Go 语言中，没有`private`和`public`关键字，可见性是通过大写或小写字母来区分的，大写字母开头的标识符是公开的，小写字母开头的标识符是私有的。

### 导入

导入就是用import 加上包名，可以是一个一个导入，也可以是用括号括起来导入多个包，Go不允许导入但不使用（会报错）。

```go
import (
    "fmt"
    "math/rand"
)
```

如果包名重复了，或者比较复杂，可以取别名，如下所示：
```go
import e "example"
```

如今的 Go 项目推荐使用 go mod 管理依赖，vendor 基本成为了过去式。

```bash
# 创建项目
go mod init projectName
# 清理依赖
go mod tidy
```

`go mod init`会在项目中生成两个文件`go.mod`文件，相当于是 Maven 的 xml 配置文件，拉取一个库使用`go get -u url`，其中`-u`参数表示拉取最新版本，当然也可以指定版本。

### 注释

注释和 C 语言一样，单行注释用`//` ，多行注释用`/**/`，可以使用`go doc`命令查看包和函数的文档，比如：

```bash
go doc fmt
```

Go 提供文档工具`godoc`（`go install golang.org/x/tools/cmd/godoc@latest`），使用`godoc -http=:6060`可以启动一个HTTP服务加载HTML文档，然后访问`http://localhost:6060/pkg/`就可以看到文档。

### 格式化

Go 提供格式化工具，使用`go fmt path`可以格式化`path`路径下的 Go 文件。

### 变量

GO 的变量写法比较独特，类型在变量名后面，如果声明时没有赋值，那么变量的值会**自动初始化为零值**。

```go
var a string = "zju"
var b,c int = 1,2
```

不过 GO 支持类型推断，所以类型可以省略。
```go
var a = "zju"
var b,c = 1,2
```

还可以少写`var`，这是短变量声明语法糖，但如果变量已经声明过了，那么就会报错。
```go
a := "zju"
b,c := 1,2
```

还有一个常见语法是一次性声明多个变量，使用`()`包裹

```go
var (
    a = "zju"
    b = 1
    c = 2
)
```

Go 不允许声明变量但不使用，同样会报错

### 常量

Go 语言常量的定义方式和变量类似，但是使用 const 关键字，常量必须在声明时就制定初值。

```go
const a string = "zju"
const b,c = 1,2
```

除此以外，GO 还支持 iota，iota 是一个常量生成器，iota 会自动递增，然后依次计算第一行所写的表达式的值。

```go
const (
    a = iota // 0
    b // 1
    c // 2
    d // 3
)
```

这个式子是自动推导的

```go
const (
    a = iota *2 + 1 // 1
    b // 3
    c // 5
    d // 7
)
```

### 输入输出

`fmt` 包是 Go 语言的格式化输入输出包，常用`fmt.Println`输出一行内容

```go
fmt.Println("Hello, World!") // 输出单行内容
```

支持C风格的格式化输出

```go
fmt.Printf("%s", "123")
```

输入也是标准的 C 风格，要取地址

```go
var a, b int
fmt.Scan(&a, &b)
```

### 分支与循环

支持`if`和`switch`，但是条件不用打括号， `switch`分支不再需要显式写`break`

```go
// 一个简单的if-else
if a > b {
    fmt.Println("a is greater than b")
} else {
    fmt.Println("a is less than b")
}
```

没有`while`，但是`for`可以像`while`一样使用，即只写循环条件，同样条件不需要打括号

```go
// 一个简单的循环
for i := 0; i < 10; i++ {
    fmt.Println(i)
}
```

Go 是用`for-each`风格的循环的，但是到数组再说。

## 基础数据类型

GO 是一个静态强类型的语言，GO 语言的声明始终遵循名称在前，类型在后的原则。可以通过`type`关键字声明新的类型，虽然前后的两个类型本质上是一个类型，但是编译器认为它们不一样。

```go
type MyMap map[string]int
```

此外还可以取别名，这个前后两个类型就是被编译器认为是同一个类型

```go
type Int = int
```

在GO 中，只存在显式类型转换，**不存在隐式类型转换**，转换类型必须是可以被目标类型代表的类型（即往大的转换），比如`int16`可以转化为`int32`，但是反过来不行，明显可能溢出。

### 零值

零值准确来说应该就默认值（毕竟不一定真的是数字0），一些引用类型的零值是`nil`，这个显然和`null`差不多，需要注意`nil`不属于任何类型，`nil==nil`是无法通过编译的。

### 数组

数组是**值类型**，所以函数传参时会拷贝，数组声明时的长度只能是常量。

```go
var arr [5]int
```

可以有初始值

```go
arr := [5]int{1, 2, 3, 4, 5}
```

有初始值的情况下长度可以省略

```go
arr := [...]int{1, 2, 3, 4, 5}
```

还可以通过`new`函数获取一个指针

```go
arr := new([5]int)
```

GO 内置了`len` 和`cap` 函数用于获取序列的长度和容量。此外，数组有切割语法，切割的结果即为切片，格式为`arr[start:end]` ，切割的区间为左闭右开，**切割前后是共享内存的**。

```go
arr := [5]int{1, 2, 3, 4, 5}
arr1 := arr[1:3]
arr2 := arr[:3]
arr3 := arr[1:]

arr1[0] = 10
fmt.Println(arr)
// 结果为 [1, 10, 3, 4, 5]
```

### 切片

切片是动态的数组，是**引用类型**，初始化时自然不需要指定长度。

```go
var slice []int
slice := []int{1, 2, 3, 4, 5}
slice := make([]int, 5) // 三个参数依次为类型、长度和容量
slice := new([]int)
```

切片可以使用`append` 添加元素，GO中并不存在OOP中的那种方法，所以`append`和普通函数的写法是一样的，并且切片是引用类型，故下面的代码不存在任何拷贝。

```go
slice := []int{1, 2, 3}
slice = append(slice, 4)
```

删除元素使用切割语法就能实现，内存是自动回收的

```go
slice := []int{1, 2, 3, 4, 5}
// 删除第二个元素之后的元素
slice = slice[:2]
```

拷贝切片使用`copy`函数，会自动扩容

```go
a := make([]int, 0)
b := []int{1, 2, 3}
copy(a, b)
```

切片有`for range`遍历
```go
for i, v := range a {
fmt.Println(i, v)
}// 输出索引和值
```

Go 中表示舍弃值使用`_`

```go
for _, v := range a{
    fmt.Println(v)
}// 仅输出值
```

### 字符串

在 GO 中，**字符串本质上是一个不可变只读的字节数组**，普通的字符串使用双引号，此外还有原生字符串使用反引号。字符串全面支持`utf-8`编码，所以像`"中文"`这样的字符实际按字节存储为对应的`unicode`编码，但是这样在遍历时会出问题，按下标遍历到的不是单独的汉字，而是每个字节的内容，故需要使用`for range`遍历或者使用`utf-8`库。

Go 中涉及到转化为字符串常用`fmt.Sprintf()`，这个基本可以转换到任意格式，基本数据类型可以考虑使用`strconv`。

### 映射表

映射表是无序的键值对集合，也是**引用类型**，它的键必须是可比较的（实现`comparable`接口）

初始化映射表如下

```go
mp := map[int]string{
    1: "a",
    2: "b",
    3: "c",
}
```

也可以使用`make`获取指针

```go
mp := make(map[int]string, 8)// 参数依次是类型和容量
```

GO 的 map **访问不存在的键会返回默认值**，而且访问键其实有两个返回值，第一个是对应的值，第二个是键是否存在（布尔类型）

```go
v, ok := mp[1]
if ok {
    fmt.Println(v)
}
```

添加元素直接赋值即可，删除元素使用`delete`函数

```go
// 删除键值为 1
delete(mp, 1)
```

`for range`遍历是同时遍历键和值

```go
for k, v := range mp {
    fmt.Println(k, v)
}
```

GO 不提供 Set，但是可以使用 map 的 key 来实现，值取成一个空的结构体，一个空的结构体并不会占用内存。

```go
mp := map[int]struct{}{}
mp[1] = struct{}{}
if _, ok := mp[1]; ok {
    fmt.Println("1 exists")
}
```

### 指针

GO 中保留了指针，但是移除了对指针的运算，也就是一个指针指向的地址不能被改变，以防止指向一个异常的地址。

## 函数

GO 中函数是一等的公民，也就是支持函数式语法，声明有两种方式

```go
func sum(a int, b int) int {
    return a + b
}

var sum = func(a int, b int) int {
    return a + b
}// 这个相当于把一个匿名函数赋值给了sum
```

需要注意GO不支持函数重载，如果签名不一样，那就是不同的函数。

### 参数

Go 中不存在：

- GO 中不存在关键字参数
- GO 中也不存在默认参数

为了可读性，参数都应该写名称（除了接口，但是推荐都写上），对于类型相同的参数而言可以只声明一次类型，不过条件是必须相邻。

```go
// a、b 均为 int，可以只声明一次
func sum(a, b int) int {
    return a + b
}
``` 

此外GO 还支持变长参数，变长参数必须声明在末尾

```go
// 接收任意个 int 参数然后返回和
func sum(a ...int) int {
    sum := 0
    for _, v := range a {
        sum += v
    }
    return sum
}
```

GO 中的参数传递都是值传递，但是像切片和映射表这种引用类型本质上都是指针。

```go
func f(slice []int) {
    for i := range slice {
        slice[i] += 1
    }
}

func main() {
    slice := []int{1, 2, 3}
    f(slice)
    fmt.Println(slice)
    // 输出 [2, 3, 4]
}
```

### 返回值

当不需要返回值时，不需要写void ，直接不写返回值即可。
```go
func f() {
    fmt.Println("Hello, World!")
}
```

GO 允许有多个返回值，此时需要用括号将返回值括起来写在最后，类似于返回一个元组，甚至也是可以给返回值命名的。

```go
func f() (int, int) {
    return 1, 2
}

func g() (a, b int) {
    a = 1
    b = 2
    return
}
```

### 匿名函数与闭包

GO 的匿名函数和其他语言一样匿名函数主要是作为高阶函数的参数。

```go
func mapping(f func(int) int, slice []int) []int {
    for i, v := range slice {
        slice[i] = f(v)
    }
    return slice
}

func main() {
    slice := []int{1, 2, 3}
    slice = mapping(func(x int) int { return x * x }, slice)
    fmt.Println(slice)
    // 输出 [1, 4, 9]
}
```

GO 的闭包和 Python 的闭包类似，就是高阶函数返回一个内部函数，然后高阶函数内部的变量并没有随着高阶函数的返回而消失，仍然可以被返回的内部函数使用。

```go
func avg() func(int) float64 {
    sum := 0
    count := 0
    return func(x int) float64 {
        sum += x
        count++
        return float64(sum) / float64(count)
    }
}

func main() {
    avg := avg()
    fmt.Println(avg(1))
    fmt.Println(avg(2))
    fmt.Println(avg(3))
    // 输出 1, 1.5, 2
}
```

### 方法

方法与函数的区别在于，方法拥有接收者，而函数没有（和 OOP 中的方法类似），且只有自定义类型能够拥有方法，其使用也类似于调用一个类的成员方法。

```go
type Point struct {
    X int
    Y int
}

func (p Point) Distance(q Point) int {
    return int(math.Sqrt(float64((p.X-q.X)*(p.X-q.X) + (p.Y-q.Y)*(p.Y-q.Y))))
}

func main() {
    p := Point{1, 2}
    q := Point{4, 6}
    fmt.Println(p.Distance(q))
    // 输出 5
}
```

但是上文提到过可以用`type`声明新类型，如果有`type myInt int`，那么可以给`myInt`绑定方法，这间接实现了给内置类型绑定方法。

上面示例中的接收者是值，就被称作值接收者，此外还有指针接收者，它们之间的区别显然是能否修改实际接收者的值，这里有个语法糖是对于结构体指针而言，不需要解引用就可以访问其内容，实际是编译时补全解引用。

```go
type Vector struct {
    X int
    Y int
}

func (p *Vector) Add(q Vector) {
    p.X += q.X
    p.Y += q.Y
}

func main() {
    p := &Vector{1, 2}
    q := Vector{4, 6}
    p.Add(q)
    fmt.Println(p)
    // 输出 &{5, 8}
}
```

## 结构体

### 初始化

GO 抛弃了 OOP，结构体自然也没有构造函数

```go
type Person struct {
    name string
    age int
}
```

初始值直接赋

```go
p := Person{name: "Alice", age: 20}
```

Go 喜欢创建者模式，当参数较多时，可以单独编写一个函数来初始化，实际上自定义类型都推荐写创建函数，相当于写了构造函数。

```go
func NewPerson(name string, age int) Person {
    return Person{name: name, age: age}
}
```

### 组合

GO 中没有继承，只有组合

```go
type Student struct {
    p Person
    grade int
    class int
}

type Teacher struct {
    p Person
    subject string
}
```

也可以不具名

```go
type Student struct {
    Person
    grade int
    class int
}

type Teacher struct {
    Person
    subject string
}
```

这两种写法的区别在于访问时的写法

```go
// 具名
s := Student{Person{Person{name: "Alice", age: 20}, grade: 1, class: 1}}
s.p.name = "Bob"
s.grade = 2
s.class = 2

// 不具名可以直接访问
// s.Person.name 也是正确的
s := Student{Person{Person{name: "Alice", age: 20}, grade: 1, class: 1}}
s.name = "Bob"
s.grade = 2
s.class = 2
```

## 接口

在 Go 语言中，接口是一种抽象类型，用于定义一组方法签名而不提供方法的实现。接口的核心理念是描述行为，而具体的行为实现由实现接口的类型提供。

```go
type Animal interface {
    Eat()
}
```

接口的实现在 Go 中是隐式的，只要类型拥有了接口中定义的所有方法，那么这个类型就实现了这个接口。

```go
// 这里的 Dog 实现了 Animal 接口
type Dog struct {
    name string
}

func (d Dog) Eat() {
    fmt.Println("Dog" + d.name + " is eating")
}

func (d Dog) Bark() {
    fmt.Println("Dog" + d.name + " is barking")
}
```

和其它语言中的差不多，实现了这个接口就可以用这个接口存储

```go
var a Animal = Dog{name: "Alice"}
a.Eat()
// 错误
// a.Bark()
```

根据实现的定义，任何自定义类型都可以实现接口，甚至从内置类型衍生出来的类型也可以实现接口。

```go
type Int int

type Adder interface {
    Add(Int) Int
}

func (i Int) Add(j Int) Int {
    return i + j
}
```

空接口就是函数声明时的`Any`，任何类型都实现了空接口,所以 Any 接口可以保存任何类型的值。

```go
type Any interface{
}
```

GO 提供了类型推断语法，用于判断一个变量是否是某个类型或者是否实现了某个接口。

```go
var b int = 1
var a interface{} = b
// 判断 a 是否是 int 类型
if intVal, ok := a.(int); ok {
    fmt.Println(intVal)
} else {
    fmt.Println("error type")
}
// 结果为 1
```

## 泛型

泛型函数的语法格式类似于：

```go
func Sum[T int | float64](a, b T) T {
    return a + b
}
```

- 类型形参：`T` 就是一个类型形参，形参具体是什么类型取决于传进来什么类型
- 类型约束：`int | float64` 构成了一个类型约束，这个类型约束内规定了哪些类型是允许的

实际调用时类型可以写出，也可以省略，省略时会自动推断，不过前提是不会出现类型推断不唯一的情况。

```go
res1 := Sum[int](1, 2)
res2 := Sum(1, 2)
```

泛型类型的语法格式如下：

```go
type GenericMap[K comparable, V int | string | byte] map[K]V
gmap1 := GenericMap[int, string]{1: "hello world"}
gmap2 := make(GenericMap[string, byte], 0)
```

## 错误

在 Go 语言中，错误处理与传统的 try-catch 机制有所不同。Go 鼓励通过函数返回多个值来显式地处理错误。函数在可能发生错误的情况下，会返回一个额外的 error 类型的值。如果操作成功，错误值通常为`nil`；否则，它将是一个实现了`error`接口的非`nil`值。

在 Go 中的异常有三种级别：

- error：正常的流程出错，需要处理，直接忽略掉不处理程序也不会崩溃
- panic：很严重的问题，程序应该在处理完问题后立即退出
- fatal：非常致命的问题，程序应该立即退出

这里只考虑最常见的`error`，它的接口定义为：

```go
type error interface {
    Error() string
}
```

下面是一个错误处理的示例

```go
package main

import (
    "fmt"
    "strconv"
)

func main() {
    var numStr string
    fmt.Scan("%s", &numStr)
    num, err := strconv.Atoi(numStr) // Atoi 函数返回 (int, error)
    if err != nil {
        fmt.Printf("转换字符串到整数失败: %v\n", err)
    } else {
        fmt.Printf("成功将 %s 转换为整数: %d\n", numStr, num)
    }
}
```