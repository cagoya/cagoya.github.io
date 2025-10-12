# Redis

## 简介

Redis(Remote Dictionary Server)是一个 key-value 的数据库，常用于缓存、消息队列、会话存储等场景。需要注意正常情况下 Redis 是存储在内存的。现在安装自然是推荐使用 docker 拉取：

```bash
docker pull redis:latest
docker run -d --name redis -p 6379:6379 redis
```

### 配置

Redis 配置文件位于 Redis 安装目录下，文件名为`redis.conf`，Redis 默认不以守护进程的方式运行。

> 守护进程是一种在后台运行的特殊进程，它独立于控制终端，并且通常不与用户进行直接的交互。它的主要目的是在系统启动时就开始运行，在后台持续地执行一些系统级或网络级的任务，等待特定事件的发生并对其进行处理。

### 数据类型

1. 字符串：string 类型是二进制安全的，理论上可以存储任意类型，常存储字符串、整数或者浮点数，一个键最多存储 5112 MB
2. 哈希：hash 本身也是一个 string 类型的 key-value 结构，特别适合于存储对象
3. 列表：List 是简单的字符串列表，按照插入顺序，可以将一个元素添加到头部或者尾部
4. 集合：Set 是 string 类型无序集合
5. 有序集合：Zset 和 Set 的区别是每个元素都会关联一个 double 类型分数，将按照这个分数排序