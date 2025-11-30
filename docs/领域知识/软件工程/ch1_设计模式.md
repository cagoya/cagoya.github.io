# 设计模式

!!!abstract
    设计模式是软件工程中最佳实践的总结，是经过时间考验的解决方案，与算法不同，算法是解决特定问题的步骤，而设计模式是解决一类问题的通用方法。

贴个[菜鸟教程](https://www.runoob.com/design-pattern/design-pattern-tutorial.html)的链接，现在让AI给点例子也很方便。

## 创建型模式

创建型模式关注点是如何创建对象，其核心思想是要把对象的创建和使用相分离，这样使得两者能相对独立地变换。

创建型模式包括：

* 工厂：Factory
* 抽象工厂：Abstract Factory
* 建造者：Builder
* 原型：Prototype
* 单例：Singleton

## 结构型模式

结构型模式主要涉及如何组合各种对象以便获得更好、更灵活的结构。虽然面向对象的继承机制提供了最基本的子类扩展父类的功能，但结构型模式不仅仅简单地使用继承，而更多地通过组合与运行期的动态组合来实现更灵活的功能。

结构型模式包括：

* 适配器：Adapter
* 桥接：Bridge
* 组合：Composite
* 装饰：Decorator
* 外观：Facade
* 享元：Flyweight
* 代理：Proxy

## 行为型模式

行为型模式主要涉及算法和对象间的职责分配。通过使用对象组合，行为型模式可以描述一组对象应该如何协作来完成一个整体任务。

行为型模式包括：

* 责任链：Chain of Responsibility
* 命令：Command
* 解释器：Interpreter
* 迭代器：Iterator
* 中介者：Mediator
* 备忘录：Memento
* 观察者：Observer
* 状态：State
* 策略：Strategy
* 模版：Template
* 访问者：Visitor