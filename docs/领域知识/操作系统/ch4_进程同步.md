# 进程同步

## 背景

### 来源

**为什么？**

并发访问共享的数据可能导致数据不一致

**解决方案**

维持数据一致性要求有机制(mechanism)能够保证合作进程按顺序执行。

**进程同步**

> 虽然叫做进程同步，但作用对象也可以是线程

进程同步(Process Synchronization)是指在多进程或多线程环境中，为了保证多个进程能够按照一定的顺序或条件正确地访问共享资源而采取的各种协调机制。

### 生产者-消费者问题

生产者-消费者问题(Producer-Consumer Problem)是OS中的一个经典问题，分为有界buffer和无界buffer两种，讨论的更多的是有界的（无界可以看做填不满的有界），有界的情况下需要获知当前buffer中有多少个item，有两种方案：

1. (in - out) % BUFFER_SIZE
2. 添加一个变量记录

**Producer**

```c
while(true){
    while(count==BUFFER_SIZE);

    buffer[in]=nextProduced;
    in=(in+1)%BUFFER_SIZE;
    count++;
}
```

**Consumer**

```c
while(true){
    while(count==0);

    nextConsumed=buffer[out];
    out=(out+1)%BUFFER_SIZE;
    count--;
}
```

### 竞态条件

`count++`和`count--`在高级语言中看起来是一条指令，但它底层的汇编其实要涉及好几条指令，比如`count++`应该现将`count`的值读到寄存器中，然后让寄存器的值+1再写回内存。

```c
register1 = count;
register1 = register1 + 1;
count = register1;
```

依次执行`count++`和`count--`一共有三种可能结果：

1. 确实是按顺序执行的，执行完count值不变
2. `count++`写回前`count--`就已经读取了`count`的值，这种情况下`count`可能+1或-1，取决于谁后写回

这种问题被称作静态条件(Race Condition)，它描述的是一处内存地址被并发访问，且至少有一个访问是写的情况。

!!!question 非抢占的内核是否受竞态条件的影响？
    是，因为还是有并发的可能，比如发生了硬件中断

### 临界区问题

> 临界资源指的是在多线程或多进程环境中被多个线程或进程共享的资源。这些资源需要通过适当的同步机制来保护，以确保同一时刻只有一个线程或进程可以访问这些资源。

为了设计一种协议来保证合作进程之间不会相互干扰，我们将进程抽象为如下结构：

```c
Do {
    Entry section
    Critical section
    Exit section
    Remainder section
}while(true)
```

1. Entry section：进入临界区前一般要做一些检查
2. Critical section：临界区，指程序中一个访问共用资源的程序片段
3. Exit section：离开临界区还需要做一些善后操作
4. Remainder section：程序不进入临界区时都在其余段运行

!!!question 以下哪些是临界资源？
    1. 全局共享变量 :ballot_box_with_check:
    2. 局部变量
    3. 只读数据
    4. CPU

## 同步机制

### 性质

临界区问题的解决方案应该具备以下性质：

1. Mutual Exclusion（互斥）：任何情况下都只有一个进程能在临界区运行
2. Progress（空闲让进）：如果没有进程在临界区运行，并且存在一些进程希望进入临界区，选择下一个进入临界区的进程不能被无限推迟
3. Bounded Waiting（有限等待）：一个进程在请求进入临界区后，等待其它进程被允许进入临界区，直到自己被允许的时间有限（假设每个进程执行的速度不为0，不假设每个进程的相对速度）
4. 上课还讲了让权等待，即可以主动交出访问临界区的权限

### 软件方法

#### 单标志法

设置公共整形变量`turn`，指示允许进入临界区的进程编号 `turn=i`，允许$P_i $进入临界区，进程退出时临界区交给另一个进程。

**Process $P_i $**

```c
do{
    while(turn!=i);
        critical section
    turn = j;
        remainder section
}while(1);
```

**Process $P_j $**

```c
do{
    while(turn!=j);
        critical section
    tuen = i;
        remiander section
}while(1);
```

满足：

1. 互斥 Yes
2. 空闲让进 No
3. 有限等待 Yes
4. 让权等待 No

单标志法强制要求进程交替进入临界区

#### 双标志后检查法

设置布尔数组`flag[2]`，用来标记各进程进入临界区的意愿`flag[i]=true`表示进程$P_i $想进入，先表达自己进入临界区的意愿，再轮询对方是否想进入，确定对方不想进入后再进入。

**Porcess $P_i$**

```c
do{
    flag[i] = true;
    while(flag[j]);
        critical section
    flag[i] = false;
        remainder section
}while(1);
```

**Process $P_j$**

```c
do{
    flag[j] = true;
    while(flag[i]);
        critical section;
    flag[j] = false;
        remainder section;
}while(1);
```

满足：

1. 互斥 Yes
2. 空闲让进 No
3. 有限等待 No 
4. 让权等待 No

从时间长短来看有可能双方同时想进导致程序卡死

#### 双标志先检查法

和后检查的区别是先询问对方是否想进入，再设置自己想进入

**Porcess $P_i$**

```c
do{
    while(flag[j]);
    flag[i]=true;
        critical section;
    flag[i]=false;
    remainder section;
}while(1);
```

**Porcess $P_j$**

```c
do{
    while(flag[i]);
    flag[j]=true;
        critical section;
    flag[j]=false;
    remainder section;
}while(1);
```

满足：

1. 互斥 No
2. 空闲让进 Yes
3. 有限等待 Yes
4. 让权等待 No

如果两个进程同时想进入临界区，可能会违反互斥

#### Peterson 算法

针对两个进程的解决方案，假设`load`和`store`是原子的，思想是：
- 结合单标志法和双标志后检查法，首先表达自身意愿，之后设置自身要进入
- 若双方互相确定对方都想进入时，`turn`只能等于一个值，因此会谦让对方进入
- 若一方不想进入，则其`flag[i]=false`，对方可进入

**Porcess $P_i$**

```c
while(true){
    flag[i]=true;
    turn=j;
    while(flag[j] && turn==j);
        critical section;
    flag[i]=false;
        remainder section;
}
```

**Porcess $P_j$**

```c
while(true){
    flag[j]=true;
    turn=i;
    while(flag[i] && turn==i);
        critical section;
    flag[j]=false;
        remainder section;
}
```

但Peterson算法对于现代计算机体系结构不保证生效，因为存在乱序执行，也就是指令实际执行顺序和看到的不一致。

> 内存栅栏(memory barrier)可以避免乱序执行，栅栏前的操作必须全部完成并提交到内存后，才能执行栅栏后的操作

#### 面包房算法

面包房(Bakery)算法的思想是排号：

- 每个进程进入临界区前获得一个数，数最小的进程进入临界区
- 如果$P_i $和$P_j $得到了相同的数，如果i<j，那么就$P_i $先执行
- 数机制(number scheme)以增序产生数字

```c
do{
    choosing[i] = true;
    number[i] = max{number[0], number[1],...,number[n-1]} + 1;
    choosing[i] = false;
    for(j=0;j<n;j++){
        while(choosing[j]);
        while((number[j] != 0) && (number[j], j) < (number[i], i));
    }
    critical section;
    number[i] = 0;
    remainder section;
}while(1);
```

### 硬件方法

#### 关中断法

进入临界区前直接屏蔽中断，保证临界区资源顺利使用，使用完毕，打开中断。在单处理器(Uniprocessor)情况下，关闭中断能够使并发执行的代码不被抢占，但在多处理器(Mutiprocessor)下太低效，OS一般只小规模使用这种方法。

缺点：

- 可能影响系统效率：其锁住CPU可能导致一些短时间能完成的操作需要等待开中断
- 不适用于多CPU系统：在多CPU系统中无法有效同步各CPU操作
- 安全性问题：滥用关中断权力可能导致严重后果，例如错过一些重要中断请求

#### TestAndSet

现代操作系统提供特殊的原子硬件指令，比如这里的TestAndSet，所谓的原子指令指的是同时只能有一个线程执行，不被打断。

```c
boolean TestAndSet(boolean *target)
{
    boolean rv = *target;
    *target = true;
    return rv;
}
```

可以使用TestAndSet实现锁

```c
// lock 是一个全局共享变量，初始化为false
while(true){
    while(TestAndSet(&lock));
        critical section;
    lock=false;
        remiander section;
}
```

满足：

1. 互斥 Yes
2. 空闲让进 Yes
3. 有限等待 No

#### Swap

其实和TestAndSet差不多，TestAndSet相当于永远和`true`交换

```c
void Swap(boolean *a, boolean *b){
    boolean temp = *a;
    *a = *b;
    *b = *temp;
}
```

实现锁也差不多

```c
// lock是全局共享变量，初始化为false
while(true){
    key = true;
    while(key == true)
        Swap(&key, &lock);
    critical section;
    lock=false;
    remiander section;
}
```

满足：

1. 互斥 Yes
2. 空闲让进 Yes
3. 有限等待 No

#### compare_and_swap

依旧差不多

```c
int compare_and_swap(int *value, int expected, int new_value){
    int temp = *value;
    if(*value = expected)
        *value=new_value;
    return temp;
}
```

实现锁

```c
// lock是一个全局共享变量，初始化为0
while(true){
    while(compare_and_swap(&lock, 0, 1)!=0);
        critical section;
    lock=0;
    remiander section;
}
```

满足：

1. 互斥 Yes
2. 空闲让进 Yes
3. 有限等待 No

---

说白了，上述三种锁本质都是一样的，满足的性质也是相同的，下面介绍一种有界等待的实现。

```c
while(true){
    waiting[i]=true;
    key=1;
    
}
```