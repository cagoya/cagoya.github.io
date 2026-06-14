# makefile

> 结果大三的OS课程为了完成 lab，终于是必须自己看得懂 makefile 了（之前一直交给AI在写

## 规则

``` makefile
target ... : prerequisites
    recipe
    ...
    ...
```

- target 可以是一个目标文件，也可以是一个可执行文件，还可以是一个标签
- prerequisites 生成该target所依赖的文件
- recipe 该target要执行的命令（任意的shell命令）

如果prerequisites中有一个以上文件比target文件要新（直接比修改时间）的话，recipe所定义的命令就会被执行。规则是简单的，但实际写起来的问题很多。

## 写法

makefile 的编写并不是那么简单，这里先给一个简单的示例，假设你的项目目录如下

```bash
├── Makefile        # makefile文件
├── main.cpp        # 主程序文件
└── utils.cpp       # 辅助函数实现
└── utils.h         # 辅助函数头文件
```

> makefile文件一般推荐命名为`Makefile`或者`makefile`，其实`Makefile`更好，因为大写字母开头的在代码规范里面都是些特别的文件，能和源代码之类的区分开。

对于这个项目，如果手写gcc的话，就可能是`g++ -std=c++17 -Wall -Wextra main.cpp utils.cpp -o my_app`，写在makefile中就可能是：

```makefile
# 编译器和编译选项
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -g

# 目标程序名称
TARGET = my_app

# 所有 .cpp 源文件
SRCS = main.cpp utils.cpp

# 所有 .o 目标文件
OBJS = $(SRCS:.cpp=.o)

# 默认规则：编译目标程序
all: $(TARGET)

# 链接规则：将所有的 .o 文件链接成最终的可执行文件
$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $(TARGET)

# 编译 .cpp 文件到 .o 文件的通用规则
# $< 代表依赖项（即 .cpp 文件）
# $@ 代表目标（即 .o 文件）
%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# 清理规则：删除所有生成的文件
.PHONY: clean
clean:
	rm -f $(TARGET) $(OBJS)
	
# 额外的“全部”和“清理”标记，表明它们不是真正的文件
.PHONY: all
```