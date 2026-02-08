# Git

## 什么是Git？

当今世界上使用最广泛的<font color = red>分布式版本控制器</font>,是一个优质的开源项目。（你无需支付任何费用就可以使用）

## 如何安装Git？

和大多数工具一样安装方式因平台而异,可能低年级的同学几乎都是Windows吧。其实对于大多数用户来说，在你不懂这个选项到底代表着什么的情况下默认选项非常明智，<font color = purple>初学者就全选默认吧</font>( bishi),其实还是要注意一下，以免下了半天结果运行不了
安装完 Git 之后，要做的第一件事就是设置自己的用户名和邮件地址。

```
git config --global user.name "Email Pairs"
git config --global user.email "eparis@atlassian.com"
```

其中global 代表全局配置，当然与此相对应还有local 代表局部配置

## Git 的基本操作

### 在当前目录新建一个git代码库

  初始化：

  ```
  git init
  ```

  通常这是新项目中运行的第一个命令，大部分命令在未init的情况下不可用。
  执行此命令将在当前工作目录创建一个新的.git子目录（隐藏文件，也将创建一个新的主分支
  在未初始化的情况下执行大多数git命令，将会得到以下报错

  ```
  fatal: not a git repository (or any of the parent directories): .git
  ```

  也许和你想象的不太一样，你可以安全地在一个已经运行过git init 的项目目录上再次运行该命令。它不会覆盖现有的.git配置。

!!!warning
    切记：不要手动乱改.git文件，否则会破坏git仓库，.git文件的东西远比你想的要复杂

### 克隆

  用于创建远程代码库的副本或克隆。目标代码存储库可以是本地的也可以是远程的。

  ```
  git clone <repo url>
  ```

  下载一个项目和它的整个代码历史
  其中url支持多种格式，如Git SSH URL：

  ```
  git@HOSTNAME:USERNAME/REPONAME.git
  ```

  !!!note
    运行git init 和git clone都能在你的电脑上得到一个可用的git仓库，那它们有没有什么区别呢？
      省流：git clone 依赖于git init
      实际上 git clone 会先调用git init 来创建新的存储库，然后再从现有存储库中复制数据。

### 保存变更

  git add 会将文件添加到代码库暂存区域并创建一个包含消息的新提交。

  ```
  git add <file>
  ```

  将指定文件添加到暂存区

  ```
  git add <directory>
  ```

  添加指定目录到暂存区

  ```
  git add .
  ```

  将当前目录所有文件添加到暂存区 .代表当前目录
  而git commit 会将文件提交到项目历史记录中。
  git commit -a
  提交工作区自上次commit的变化，直接到仓库区

  ```
  git commit -m "commit message"
  git commit -am "commit message"
  ```

!!!note
    规范格式使用少于50个字符在第一行汇总提交，留一个空行，然后详细解释发生了什么变化。

### 忽略特殊文件

  在git工作区的根目录下创建一个特殊的.gitignore文件，然后把要忽略的文件名填进去，git就会自动忽略这些文件。
  一些常见的被忽略的文件如下。

- 依赖性缓存
- 编译的代码
- 构建输出目录，如/bin、/out或/target
- 产生的运行时文件，如.log、.lock或.tmp
- 隐藏的系统文件，如Thumbs.db或.DS_Store
- 个人IDE配置文件，如.idea/workspace.xml

### 提交状态

  可以使用git status来查看文件状态（可以加-s来简化结果
  完整的状态消息其实还包括暂存/取消暂存的相关说明。
  </br>
  未跟踪文件：

- 尚未提交的文件
- 编译后的二进制文件（二进制文件其实也可以跟踪，但毫无价值，因为你只能知道一个二进制文件从1kb变到了2kb
  
### 提交历史

  ```
  git log
  ```

  显示已提交快照，可以使用该命令来列出项目历史记录、对其进行筛选并搜索特定的变更。
  git log 仅在已提交历史记录上运行
  从上到下依次是版本号、提交人、时间、提交注释

### 撤销操作

  ```
  git reset
  ```

  git add 和 git commit 都可以用git reset来撤销。顺便一提，git reset最适用于撤销本地私有变更。

### 连接远程库

  ```git remote```命令允许您创建、查看和删除与其他存储库的连接。
  可以使用 ```git remote -v```列出与其他存储库的远程链接
  git remote add <name> <url>

### 库间协作

  ```git push```命令将代码推送到远程代码库，使其他成员能够访问到这一变更，这里我们用github作为远程仓库
  创建与远程存储库的新连接

  ```
  git push <remote><branch>
  ```

  移除与 ＜name＞ 远程存储库的连接

  ```
  git remote rm <name>
  ```

  ```git pull```用于从远程存储库获取和下载内容，并更新本地存储库。
  但实际上git push也是两个命令的组合（逗号前后各对应一个——```git fetch```+```git merge```

  ```
  git pull <remote>
  ```

### 配置和设置

  显示当前git配置

  ```
  git config --list
  ```

  将远程代码库URL添加到本地

  ```
  git push -u <remote_name> <local_branch_name>
  git remote add <remote_name><remote_repo_url>
  ```

### 什么是Git SSH 秘钥？

  SSH密钥是SSH网络协议的访问凭证，用于不安全开放网络计算机之间的远程通信
  如何创建？
  通过公钥加密算法生成，最常见的是RSA或DSA

!!!note
    建议使用ed25519的key:ssh-keygen -t ed25519
  
!!!warning
    <font color = red>请注意保护你的私钥。</font>公钥(.pub结尾)可以发给别人或上传到Github Settings中，私钥（无后缀名）永远不要放到网络上。<del>（毕竟你也不想···</del>

### 分支

#### 列出储存库中的分支

  ```
  git branch 列出所有本地分支
          -r 列出所有的远程分支
          -a 显示所有分支
  ```

#### 创建分支

  分支只是指向提交的指针，存储库的历史记录保持不变，如：

  ```
  git branch <branch name>
  ```

  创建一个新分支，但不切换,  通过checkout来切换分支。

  ```
  git checkout <branch>
  ```

  创建远程分支必须首先配置远程代码存储库并将其添加到本地代码存储库配置中

### 合并分支

  将指定分支合并到当前分支，需要处理冲突部分（沟通协商、手动解决）

  ```
  git merge <branch>
  ```

  </br>
  将特定 commit 合并进当前分支
  
  ```
  git cherry-pick <commit id>
  ```

### 删除分支

  删除本地分支

  ```
  git branch -d <branch>
  ```

  <br></br>
  删除远程分支

  ```
  git push <remote> --delete <branch>
  git branch -dr <remote>/<branch>
  ```
