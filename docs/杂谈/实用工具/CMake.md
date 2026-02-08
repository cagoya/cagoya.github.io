# CMake

## Introduction

CMake 是开源、跨平台构建工具，可以让我们编写简单的配置文件去生成本地的Makefile,这个配置文件是独立于平台和编译器的，这样就不用亲自去编写Makefile了，但其实规则还是很复杂。

## 环境搭建

非常简单，直接在Linux下下载就行

``` bash
sudo apt install cmake
```

Windows下也有，可以下载GUI，命令行环境变量需要自己导入

## 简单入门

下面是一个示例：

``` CMake
# CMake最低版本要求
cmake_minimum_required(VERSION 3.10)

# 项目名称和版本
project(MyProject VERSION 1.0)

# 设置C++标准
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# 添加源文件
set(SOURCES
    src/main.cpp
    src/helper.cpp
)

# 可执行文件的输出
add_executable(MyExecutable ${SOURCES})

# 包含目录
target_include_directories(MyExecutable PUBLIC ${PROJECT_SOURCE_DIR}/include)

# 链接库（如果有）
# target_link_libraries(MyExecutable PRIVATE SomeLibrary)

# 定义编译选项
# target_compile_options(MyExecutable PRIVATE -Wall -Wextra -Wpedantic)
```
