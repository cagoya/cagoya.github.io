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

说白了，上述三种锁本质都是一样的，满足的性质也是相同的，下面介绍一种有界等待的实现，改进的点是要选出下一个进入临界区的进程，这个选择是线性遍历。

```c
while(true){
    waiting[i]=true;
    key=1;
    while(waiting[i] && key==1)
        key = compare_and_swap(&lock, 0, 1);
    waiting[i] = false;
        critical section;
    j = (i+1)%n;
    while((j!=i) && !waiting[j])
        j=(j+1)%n;
    if(j==i)
        lock=0;
    else
        waiting[j]=false;
    remainder section;
}
```

### 互斥锁

!!!tip 和先前内容的关系
    先前的解决方案都是站在最底层描述，相对来说较为复杂，一般来说在不涉及系统级开发时，我们都喜欢用封装好的接口，比如这里的互斥锁。

互斥锁提供了两个方法`acquire`和`release`

```c
acquire(){
    while(!available);
    available = false;
}

release(){
    available = true;
}
```

这里这种写法会导致在获得锁前一直循环，因此也叫自旋锁(spinlock)：

- 优点：
  - 适用于任意数目的进程，在单处理器或者多处理器上
  - 简单，容易验证其正确性
  - 可以支持进程内存在多个临界区，只需为每个临界区设立一个布尔变量
- 缺点：
  - 耗费CPU时间，不能实现让权等待
  - 可能不满足有限等待，因为选择是随机的
  - 可能死锁

### 信号量

#### 原理

!!!warning 注意统一用法
    要么是`wait()`和`signal()`，要么是`P()`和`V()`，不能混用！

信号量(Semaphore)是一个整型变量，提供两个原子操作`wait()`和`signal()`，或者称作`P()`和`V()`

```c
wait(S){
    while S<=0;
    S--;
}

signal(S){
    S++;
}
```

信号量可以分为：

- 计数(counting)型：无范围限制的整型值
- 二进制(Binary)型：只能是0和1，更容易实现

信号量有两大用法，除了提供互斥外，还可以实现同步

```c
// 互斥
Semaphore S;
wait(S);
critical section;
signal(S);
remainder section;
```

```c
// 同步
// p1
S1;
Signal(S);

// p2
Wait(S)
S2;
```

!!!question 需要几个信号量？
    - Case 1：四个房间，四把相同的钥匙  *1个*
    - Case 2：四个房间，四把不同的钥匙  *4个*

#### 实现

必须要保证同时只有一个进程能执行同一个信号量的`wait`和`signal`，所以信号量本身也是临界区问题，上面说过可以使用忙等实现，但是如果等待时间较长，忙等的开销也不小，忙等的示例如下：

```c
struct semaphore{
    struct spinlock lock;
    int count;
}

void V(struct semaphore *s){
    acquire(&s->lock);
    s->count += 1;
    release(&s->lock);
}

void P(struct semaphore *s){
    while(s->count==0);
    acquire(&s->lock);
    s->count -= 1;
    release(&s->lock);
}
```

与之相对，有非忙等的实现，需要将进程调度至信号量的等待队列中，及时释放出CPU资源，需要两个额外的操作（系统调用）：

1. block(sleep)：将进程加入等待队列
2. wakeup：将进程移除等待队列

```c
void V(struct semaphore *s){
    acquire(&s->lock);
    s->count += 1;
    wakeup(s);
    release(&s->lock);
}

void P(struct semaphore *s){
    while(s->count == 0)
        sleep(s);
    acquire(&s->lock);
    s->count -= 1;
    release(&s->lock);
}
```

但是上面这种实现有无法苏醒的问题，比如正当要执行`sleep`时触发了`wakeup`，实际导致先`wakeup`再`sleep`，这样一来再也等不到`wakeup`了。于是作出一点调整，判断是否要`sleep`前要先获得锁，但这样带来了另一个问题，`sleep`时是带着锁的，这会导致死锁，，因而需要在`sleep`时释放锁。

### 死锁与饿死

- 死锁(deadlock)：两个或多个进程都在无尽地等待一个只能由等待中的进程产生的事件
- 饿死(starvation)：无尽地阻塞，一个进程永远无法从等待队列中出来

## 典型问题

!!!note 这一章是考试的重点

### 基本规则

信号量的物理含义是：

- S.value>0表示有S.value个资源可用
- S.value=0表示无资源可用
- S.value<0，则|S.value|表示等待队列中的进程数

`wait`和`signal`需要满足一些基本限制：

- `wait`和`signal`必须成对出现，当为互斥操作时，它们同处于一个进程，当为同步操作是，则处于不同进程
- 如果两个`wait`相邻，同步的`wait`必须在互斥的`wait`之前，否则可能导致死锁，两个相邻的`signal`的顺序无关紧要，因为无论如何`signal`都应该立刻完成

### 有界缓冲区问题

!!!question N buffers，每个可以容纳一个元素

我们的需求是：

1. 不能同时读写缓冲区 $\Rightarrow $ 临界区问题，需要一个互斥锁
2. 缓冲区为空时不能读，缓冲区为满时不能写 $\Rightarrow $需要两个信号量来指示这两种临界状态

故解决方案如下，定义：

- 信号量 `mutex`，初始值为1
- 信号量 `empty`，初始值为n
- 信号量`full`，初始值为0

```c
// 生产者
while(true){
    wait(empty);
    wait(mutex);
    // 写缓冲区
    signal(mutex);
    signal(full);
}
```

```c
// 消费者
while(true){
    wait(full);
    wait(mutex);
    // 读缓冲区
    signal(mutex);
    signal(empty);
}
```

### 读者写者问题

一个数据集在一系列并发的进程之间共享：

- 读者：只能读
- 写者：可以读写

!!!question 读者优先
    允许多位读者一起读，有且仅有一位写者能在没有读者时开始写

我们的需求是：

1. 可以同时读，但写和读写均互斥，写需要有写锁
2. 读者可以同时有多位，需要记录当前读者的数量，**这是一个普通变量**，但是不能同时加减这个变量，需要一个互斥锁

```c
// 读者
wait(mutex);
readcount++;
if(readcount == 1) wait(wrt);
signal(mutex);
// 读操作
wait(mutex);
readcount--;
if(readcount == 0) signal(wrt);
signal(mutex);

// 写者
wait(wrt);
// 写操作
signal(wrt);
```

!!!question 写者优先
    读者可以一起读，不过读者只有在没有写者处于等待中的情况下才能开始读，同时只能有一位写者在写

```c
// 信号量
semaphore rw_mutex = 1;      // 读写锁
semaphore mutex_r = 1;       // 保护read_count
semaphore mutex_w = 1;       // 保护write_count
semaphore block_readers = 1; // 阻塞新读者（写者优先的关键）

int read_count = 0;
int write_count = 0;

// 读者
while(true) {
    wait(block_readers);     // 检查是否允许新读者
    wait(mutex_r);
    read_count++;
    if(read_count == 1) {
        wait(rw_mutex);
    }
    signal(mutex_r);
    signal(block_readers);
    
    // 读操作
    
    wait(mutex_r);
    read_count--;
    if(read_count == 0) {
        signal(rw_mutex);
    }
    signal(mutex_r);
}

// 写者
while(true) {
    wait(mutex_w);
    write_count++;
    if(write_count == 1) {
        wait(block_readers);  // 第一个写者阻塞新读者
    }
    signal(mutex_w);
    
    wait(rw_mutex);
    // 写操作
    signal(rw_mutex);
    
    wait(mutex_w);
    write_count--;
    if(write_count == 0) {
        signal(block_readers); // 最后一个写者允许新读者
    }
    signal(mutex_w);
}
```

!!!question 读写公平
    可以同时读，不能同时写，读写公平竞争

```c
semaphore rw_mutex = 1;  // 读写锁
semaphore mutex = 1;     // 保护read_count
semaphore fair = 1;      // 保证公平性
int read_count = 0;

// 读者
wait(fair);
wait(mutex);
read_count++;
if(read_count == 1) wait(rw_mutex);
signal(mutex);
signal(fair);
// 读操作
wait(mutex);
read_count--;
if(read_count == 0) signal(rw_mutex);
signal(mutex);

// 写者
wait(fair);
wait(rw_mutex);
signal(fair);
// 写操作
signal(rw_mutex);
```

### 哲学家问题

!!!question 哲学家问题
    哲学家面前有一碗饭，左右手各一只，需要同时拿起一双筷子才能吃饭

问题本身并不复杂，但是下面这种实现可能导致死锁，解决起来不难，比如只允许四个人同时吃饭，其中有一个反序拿筷等

```c
while(true){
    wait(chopstick[i]);
    wait(chopstic[(i+1)%5]);
    // eat
    signal(chopstick[i]);
    signal(chopstick[(i+1)%5]);
    // think
}
```