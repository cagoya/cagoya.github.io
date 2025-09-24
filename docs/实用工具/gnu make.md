# makefile

> 结果大三的OS课程为了完成 lab，终于是必须自己看得懂 makefile 了（之前一直交给AI在写

## 规则

``` makefile
target ... : prerequisites
    recipe
    ...
    ...
```

- target 可以是一个目标文件，也可以是一个可执行文件，还可以是一个标签。
- prerequisites 生成该target所依赖的文件
- recipe 该target要执行的命令（任意的shell命令）

如果prerequisites中有一个以上文件比target文件要新（直接比修改时间）的话，recipe所定义的命令就会被执行。

## 写法

因为如果每一个文件都去写名称和操作的话，在大型程序中makefile文件会变得无比冗长，但是不用担心，makefile提供了许多简化的方法，比如变量名（类似于C的宏定义）。

一个示例：

``` makefile
# 指定使用的C编译器为gcc
CC = gcc

# 编译选项:
# -Wall: 打开所有警告
# -Wextra: 开启额外警告
# -O2: 优化级别2
GFLAGS = -Wall -Wextra -O2

# 预处理器选项:
# -MMD: 生成依赖文件，文件扩展名为.d
# -MP: 防止删除头文件后产生依赖错误
CPPFLAGS = -MMD -MP

# 获取当前目录下所有的.c源文件
SRCS = $(wildcard *.c)

# 将.c源文件转换为.o目标文件
OBJS = $(SRCS:.c=.o)

# 将.c源文件转换为.d依赖文件
DEPS = $(SRCS:.c=.d)

# 最终生成的可执行文件名称
TARGET = canculator

# 伪目标: all和clean不是真正的文件名
.PHONY: all clean

# 默认目标: all。编译所有内容并生成最终的可执行文件
all: $(TARGET)

# 链接所有的.o文件，生成最终的可执行文件
$(TARGET): $(OBJS)
    $(CC) $(GFLAGS) -o $@ $^  # $@ 表示目标文件名, $^ 表示所有的依赖文件

# 编译每个.c文件为对应的.o文件
%.o : %.c
    $(CC) $(GFLAGS) $(CPPFLAGS) -c $< -o $@  # $< 表示第一个依赖文件, 即.c文件

# 包含所有的.d依赖文件，这样可以在增量编译时只重新编译受影响的部分
-include $(DEPS)

# clean目标: 删除所有生成的.o文件、可执行文件和.d依赖文件
clean:
    rm -f *.o $(TARGET) $(DEPS)
```
