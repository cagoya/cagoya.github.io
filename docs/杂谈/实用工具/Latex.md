# Latex

## 简介

LaTeX 是一种基于标记语言的排版系统，广泛用于科学、技术、工程和数学文档的撰写。你要写论文就离不开Latex，当然如果你愿意用word写你的毕业论文，那么请随意。下面这段文字摘自CS170

You’re welcome to produce your homework PDF in various ways: $\LaTeX $, some other word processor, or neatly handwriting and scanning. We strongly advise using LaTeX. Here’s why:

* LaTeX documents are beautiful and a joy to read.
* LaTeX is ubiquitous across mathematics and the sciences, so learning it is a sound investment.
* Many past CS 170 readers believe that LaTeXed solutions tend to be correct more often.
* CS170 is typically the class where students take time to learn LaTeX, which is a valuable skill to have.

## 环境配置

1. 在线环境 [overleaf](https://cn.overleaf.com/)：好处是不用配本地环境，而且支持多人协作，坏处是编译时间有限制，但一般是超不了的
2. Texstdio + Texlive：缺点很明显是内存占用大并且需要自己配置环境，如果不放默认路径还得自己去调整
3. vscode + vscode-ts-tex：这个安装起来倒是很方便，貌似是最近才有的

## 入门

### 1. 文档结构

```latex
\documentclass{article} % 文档类型
\usepackage{amsmath} % 导入数学公式包
\begin{document} % 开始文档
% 内容在这里
\end{document} % 结束文档
```

### 2. 段落与换行
* **段落**：段落之间用空行分隔。
* **换行**：使用 `\\` 或 `\newline`。

### 3. 标题

```latex
\section{一级标题}
\subsection{二级标题}
\subsubsection{三级标题}
```

### 4. 文字格式
* **加粗**：`\textbf{文字}`
* **斜体**：`\textit{文字}`
* **下划线**：`\underline{文字}`
* **删除线**：`\sout{文字}` （需要 `\usepackage{ulem}` 包）

### 5. 列表
* **无序列表**：

    ```latex
    \begin{itemize}
    \item 项目1
    \item 项目2
    \end{itemize}
    ```
* **有序列表**：

    ```latex
    \begin{enumerate}
    \item 项目1
    \item 项目2
    \end{enumerate}
    ```

### 6. 数学公式
* **行内公式**：`$公式 $`
* **独立公式**：` \[ 公式 \] ` 或 ` \begin{equation} 公式 \end{equation} `

### 7. 矩阵

```latex
\begin{matrix}
a & b \\
c & d \\
\end{matrix}
```

需要使用 `\begin{pmatrix}`、`\begin{bmatrix}` 或 `\begin{vmatrix}` 来分别生成带圆括号、方括号或竖线的矩阵。

### 8. 表格

```latex
\begin{tabular}{|c|c|}
\hline
列1 & 列2 \\
\hline
数据1 & 数据2 \\
\hline
\end{tabular}
```

### 9. 图片

```latex
\begin{figure}[h]
\centering
\includegraphics[width=0.5\textwidth]{图片路径}
\caption{图片说明}
\label{fig:example}
\end{figure}
```

### 10. 引用与参考文献
* **引用公式或图表**：`\ref{label}`
* **参考文献**：

    ```latex
    \begin{thebibliography}{99}
    \bibitem{label1} 参考文献1
    \bibitem{label2} 参考文献2
    \end{thebibliography}
    ```

### 11. 注释

```latex
% 这是一行注释
```

## 进阶

### 文字与符号

中文需要导入```\usepackge[utf8]{inputenc}```，使用utf8编码，中文写作需要使用全角字符，需要特别注意破折号和省略号可以通过```Shift``` + ```-``` or ```6```得到

西文的逗号、句号、分号后面应该加空格，这不仅能保证正确间距，也能保证正确的换行
