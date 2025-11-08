# Solidity

!!!abstract
    Solidity 是一门面向合约的、为创建智能合约而创建的高级语言，在EVM虚拟机上运行（类似于Java虚拟机）

## 简介

### 快速开始

现代编程语言都是相似的，直接看个例子：

```solidity
// 声明编译器版本
pragma solidity ^0.7.0;

// 定义一个合约（类）
contract Store{
    // 事件定义，用于日志记录
    event ItemSet(bytes32 key, bytes32 value);

    // 变量
    string public version;
    mapping(bytes32 => bytes32) public items;
    // 构造函数
    constructor(string memory _version) public{
        _version = version;
    }

    // 方法
    function setItem(bytes32 key, bytes32 value) external{
        items[key] = value;
        emit ItemSet(key, value);
    }
}
```

### 导入

和Python一样，支持`import ...`、`import ... as ...`和`import ... from ...`，可以是从本地导入，也可以是从`github`导入。

### 注释

注释单行`//`，多行`/**/`

## 组成

### 状态变量

* 合约可以有任意多状态变量
* 可以有初始值
* 可以认为状态变量就是链上存储的数据
* 状态变量持久化存储于合约账户的`storage`中
* 状态变量的存储要消耗`gas`

### 函数

函数的可见性还是比较常规

|关键字|说明|
|:-----:|:----:|
|external|可以被其它合约或者transaction进行调用，本地合约无法直接调用，只能通过子合约调用|
|public|可以被内部调用，或者通过子合约调用|
|internal|函数只能被自身或继承的合约调用|
|private|函数只能被自身调用|

此外solidity还有函数特性：

* view：不会修改任何状态（只读）
* pure：不会读取和修改状态
* payable：可以向该函数转Eth，该函数会接收

solidity中的函数也是类型，本质是bytes24，此外，可以有多个返回值（像go那样）

#### fallback

允许拥有一个匿名函数作为fallback函数，没有输入参数，也没有输出结果，并且必须具有外部可见性。当合约收到ether或者被调用函数与其任一成员都不匹配时，fallback被触发。

#### receive

允许拥有一个匿名函数作为receive函数，必须是external和payable的，当一个合约被调用，但是没有calldata时，会触发receive函数，也就是通过send和transfer调用时。如果receive不存在，会寻找fallback函数，如果fallback也不存在，则会有异常。如果想让合约接收转账，就必须要有receive方法。

#### modifier

核心是为了验参，比如验证管理员权限

```solidity
contract Purchase{
    address public seller;
    modifier onlySeller(){
        require(
            msg.sender == seller;
            "Only seller can call this"
        );
        _;
    }

    function absort() public view onlySeller{
        //....
    }
}
```

### 事件

有点像发布订阅模式的日志，用户可以在合约内定义任意事件，并在函数内触发，所有被触发的事件将记录在回执中，起到记录日志的作用。

### 结构体

同C语言结构体，可以作为函数出入参数

### 枚举

```solidity
enum State{New, Ready, Running, Waiting, Completed}
```

### 错误

传统的抛出错误

```solidity
revert NotEnoughFunds(amount, balance);
```

## 其它语法

### 控制流

常规的关键字：

* if,else
* while,do,for
* break,continue
* return

### 类型系统

作为静态类型的语言，显然所有变量都要指定类型，还是分为值类型和引用类型。

值类型有：

* bool
* uintX,intX：X为8,16,32...256
* address/address payable：20byte
* bytes1,bytes2,...bytes32：固定大小的字节数组
* 枚举

注意 bytes 和 string不是value type

#### uintX/intX

* uncheck 会将可能得溢出合理化
* constant 是必须一开始就写死值
* immuntable 是赋值后不能更改值

#### Address

地址分为两类，address和address payable，值都是20byte的固定长度字符串。address payable比address多了send和transfer方法，可以向payable的地址转ether，反之则不行。

adress payable可以显式转化为address，反过来必须用payable(\<address\>)

常用的成员变量和函数有：

1. code：获取合约对应字节码
2. codehash：获取字节码哈希
3. balance：获取该地址对应的余额
4. transfer(uint256 amount)：向该地址转amount数量的wei，失败执行revert，调用需要gas
5. send(uint256 amount)：向该地址转amount数量的wei，失败返回false，调用需要gas
6. call(bytes memory)：向给定地址发起消息调用，附加所有可用的gas，失败返回false，成功返回true
7. delegatecall(bytes memory)：向给定地址发起Delegate消息调用，附加所有可用的gas，失败返回false，成功返回true
8. staticcall(bytes memory)：向给定地址发起只读消息调用，附加所有可用的gas，失败返回false，成功返回true

Call和Delegate的区别在于前者是调用一个合约的代码并且可以修改该合约的状态，后者是借用一个合约的代码，修改自己的状态

#### 引用类型

引用类型需要声明其变量存储的具体位置，常见的引用类型有array/struct/mapping，可以指定的location包括：

* memory：局部变量，存放在堆栈中，声明周期为函数调用期间
* storage：持久化变量，存放在账户存储空间中，声明周期为永久
* calldata：变量为函数调用输入，只能在external函数中使用