# 大模型相关概念和工具

## 提示词

提示词（Prompt）是用户输入给大模型的文本，大模型根据提示词生成回复。Prompt 的质量直接影响大模型的回复质量,Prompt应该尽量满足以下要求：

- 使用标签来标注由用户输入的部分，以防止提示词注入，比如`翻译<text></text>标签之间的文本`
- 提示词尽量包含足够的上下文，并且附带一些示例，以帮助大模型理解用户的需求
- 格式化输出，比如以`json`或者`xml`格式输出

## Function Calling

大语言模型本身无法直接执行外部操作（如查询天气、访问数据库等），但可以通过调用外部函数来实现这些功能。Function Calling机制允许模型生成结构化的函数调用请求，由外部系统执行实际的操作。

模型会返回类似这样的调用请求：

```json
{
    "id": "get_weather:0",
    "type": "function",
    "function": {
        "name": "get_weather",
        "arguments": "{\"city\": \"北京\"}"
    }
}
```

## MCP 协议

MCP（Model Context Protocol，模型上下文协议）是一个开放标准，旨在统一大语言模型与外部工具、数据源和服务的交互方式。它类似于AI应用的"USB-C接口"，为AI模型提供标准化的连接方式。

MCP的核心组件有以下三个：

- **MCP Host**：运行AI模型的应用程序（如Claude Desktop、Cursor等）
- **MCP Client**：在Host内部，负责与MCP Server通信
- **MCP Server**：提供特定功能的轻量级程序，暴露工具、资源和提示模板

## Agent

AI Agent（智能体）是能够感知环境、做出决策并采取行动以实现特定目标的AI系统。与传统的一次性问答不同，Agent具备以下特征：

- **规划能力**：将复杂任务分解为可执行的步骤
- **记忆能力**：维护短期和长期记忆
- **工具使用**：调用外部函数和服务
- **反思能力**：评估和调整自己的行为

## LangChain

LangChain是一个用于构建基于大语言模型的应用程序的开源框架，提供了以下核心功能：

- **LangChain Expression Language (LCEL)**：声明式链式组合
- **Chains**：预置的任务链模板
- **Memory**：对话历史管理
- **Agents**：支持工具调用的智能体
- **Callbacks**：事件监听和调试


```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4")
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个有用的助手"),
    ("user", "{input}")
])
chain = prompt | llm | StrOutputParser()
result = chain.invoke({"input": "你好"})
```

## vLLM

vLLM是一个高性能的大语言模型推理和服务引擎，专为高吞吐量场景优化。

- **PagedAttention**：高效的注意力机制内存管理
- **连续批处理**：提高GPU利用率
- **流式输出**：支持实时响应
- **OpenAI兼容API**：无缝迁移现有应用
- 
```bash
# 部署示例
# 启动vLLM服务
python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-2-7b-chat-hf \
  --tensor-parallel-size 2 \
  --max-model-len 4096
```

## RAG

RAG（Retrieval-Augmented Generation，检索增强生成）是一种结合信息检索和文本生成的技术，通过从外部知识库检索相关信息来增强大模型的回答质量。

RAG工作流程如下：

1. **索引阶段**：将文档分割成chunks，生成向量嵌入并存储
2. **检索阶段**：根据用户查询检索相关文档片段
3. **生成阶段**：将检索到的上下文与查询一起输入模型生成回答

```python
# 代码示例
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA

# 创建向量存储
vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=OpenAIEmbeddings()
)

# 创建RAG链
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever()
)
```