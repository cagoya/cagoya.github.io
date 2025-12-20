# 应用层

## DNS

### 简介

Domain Name System（域名系统）的作用是将复杂的IP地址映射为人类可记忆的域名。在最初的ARPANET中使用了一个简单的本地文本文件来存储IP地址到名称的映射，但随着网络的扩大，如果还这么做的话，一是文本文件会很大，二是难以避免冲突，因而需要引入一个专门的系统来管理域名。

<center><img src="images/ch5/DNS.png" width=350></center>

在需要解析域名时，电脑上的stub resolver会向local DNS resolver发出请求（其中包含了要解析的域名），local DNS resolver会通过递归或迭代地查询找出映射的结果。

![](images/ch5/resolve.png)

采用递归查询会对根域名服务器造成巨大的开销，因为所有查询都是由根域名服务器在进行，而采用迭代查询将大部分的工作移到了本地，可以减少根域名服务器的负载。

### 查询流程

DNS 是一个分层的系统，从上到下依次有：

1. 根域名服务器（root server）
2. 顶级域名服务器(top-level-dns server)
3. 权威服务器(authoritative server)
4. ...

查询时从上到下依次查询

![](images/ch5/hierarchy.png)

- 域名和IP都很短小（不超过255个字符），并且域名解析非常常见，故选择使用了UDP
- 一个16bit长的Transcation Indentifier会被包含到每个请求和被复制到响应中
- 超时将重发请求
- 在一定数量的重试后使用其它的域名服务器
- 使用QNAME Minimization而不是完整的域名（fully qualified domain name）来保护隐私
- 缓存查询的结果复用，缓存的每一项要包含TTL用于刷新记录

### 格式

域名解析记录是一个Tuple，由5项组成(domain_name, time_to_live, class, type, value)

常用的类型有：

1. SOA(Start of Authority)：提供参数
2. A(Address)：持有一个IPv4地址
3. AAAA(Quad A)：持有一个IPv6地址
4. MX(Mail Exchange)：声明用来为特定域名接收邮件的域名
5. NS(Name of a server for this domain)：声明用于域名和子域名的服务器
6. CNAME(Canonical Name)：为域名创建别名