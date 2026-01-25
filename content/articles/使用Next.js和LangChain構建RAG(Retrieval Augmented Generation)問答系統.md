---
title: 使用 Next.js 和 LangChain 構建 RAG(Retrieval Augmented Generation) 問答系統
slug: 2024-04-03T10:11:00.000Z
date: 2024-04-03T10:11:00.000Z
tags: ["AI","Next.js"]
---

## 引言

在本文中將介紹如何使用 Next.js 和 LangChain 工具，來構建一個與 Google Gemini 大型語言模型進行互動的問答系統。Next.js 是一個基於 React 的伺服器渲染應用程式框架。而 LangChain 則是一個強大的大型語言模型工具庫，它提供了許多功能，如文本處理、索引、模型調用等。可以幫助我們更加簡單的使用大型語言模型，而 Gemini 則是一個融合了多種資料型態，包括文字、影像和音訊的大型語言模型。

以下並非一定得 embedding 變成向量和與大型語言溝通，但是透過這樣的建置步驟可以幫助理解未來若有需要建置更加細緻的 RAG - Retrieval Augmented Generation 檢索增強生成應用大致所需要的步驟。

## 安裝 Next.js 


### 使用 pnpm 
由於想要節省硬碟空間，所以使用 pnpm 與 npx 類似的指令是**pnpm dlx**能夠用來從套件庫抓取套件，然後不將其安裝為依附套件，對於 pnpm 有興趣可以參考[pnpm 官方網站 - 動機](https://pnpm.io/zh-TW/motivation)

```bash
pnpm dlx create-next-app@latest
```

### 選擇專案配置

```bash
What is your project named? my-app
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like to use \`src/\` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the default import alias (@/*)? No / Yes
What import alias would you like configured? @/*
```

依序選擇如下

```bash
Typescript 選擇Yes #使用typescript來撰寫專案
EsLint選擇 Yes  #使用程式碼檢查工具減少錯誤和統一風格
Tailwind 選擇Yes # 使用Tailwind CSS framework
src 選擇 Yes # 依個人喜好選擇是否建立src資料夾 做為放靜態資源的地方
App route選擇 Yes # 選擇使用App route開發
import alias 選擇No # 不選擇使用import別名
```

## 安裝 langchain 相關套件

接下來安裝 langchain 相關的套件

```bash
pnpm add langchain @langchain/core @langchain/community 
```

## 安裝 Google Gemini  相關套件

由於這次的 LLM 使用的是 Google gemini 因此還需要安裝以下套件

```bash
pnpm add @langchain/google-genai @google/generative-ai
```

預計實作流程如下

## 與大型語言模型交互的流程

1. **使用者在 Client 端提問**：使用者透過 Next.js 應用的前端界面（Client 端）提出問題。
2. **發送 POST 請求到 Next.js 的 Server 端**：Client 端使用 fetch 函式 觸發 POST 請求，從客戶端發送到伺服器端。
3. **Server 端處理**：伺服器接收到請求後，與大型語言模型（LLM）進行交互，處理用戶的問題。
4. **返回答案至客戶端**：伺服器從語言模型獲取答案後，處理簡單的格式化，將這個答案發送回客戶端。
5. **畫面呈現**：用戶在前端界面上看到他們問題的答案。

## 建立 env 環境變數檔案

接下來我們建立一個環境變數儲存 Google API key

在專案資料夾建立.env 檔案放入

```bash
GOOGLE_API_KEY="你的API key"
```

### env 檔案說明

.env 檔案它用於存放敏感設定訊息，比如資料庫密碼或 API 金鑰。但考慮到安全性，這種類型的文件不應該被上傳到 Github 上。為了避免不小心將 .env 檔案包括進 Git 提交中，需要在 .gitignore 檔案中添加規則來排除所有以 .env 為開頭的檔案。

## 使用 v0 建置基本 component 

這次切版不是重點，因此使用[v0.dev](https://v0.dev/)來製作問問題的元件。

### v0 簡介

它允許開發者輸入簡短的提示詞，即可快速生成 React 程式碼，由於是 Vercel 製作的服務，而 Next.js 又是 Vercel 建立和維護的 React 框架，所以可以支援提示詞建立完元件後，使用 npx 的方式安裝到本地應用程式當中。

如下圖

![截圖 2024-04-02 下午 6.27.45](https://hackmd.io/_uploads/rkzRRLFy0.png)

### 安裝製作完成的元件

由於我們使用的 pnpm，因此將指令改成`pnpm dlx` 開頭輸入到你的專案資料夾的終端機位置當中

指令如下

```bash
pnpm dlx v0 '你元件的編號'
```

### 安裝完 v0 元件後的資料夾結構

輸入完畢後他是基於 shadcn 所製作的 component 他會在專案中建立 components 資料，根據實際產生的的情形也會自動建立 utils 資料夾

結構如下

```bash
├── ./app
│   ├── ./app/favicon.ico
│   ├── ./app/globals.css
│   ├── ./app/layout.tsx
│   ├── ./app/page.tsx
├── ./components
│   └── ./components/ui
│       ├── ./components/ui/button.tsx
│       ├── ./components/ui/card.tsx
│       ├── ./components/ui/input.tsx
│       └── ./components/ui/label.tsx
└── ./lib
    └── ./lib/utils.ts
```

## 與 LLM 溝通的流程

接下來建立與 LLM 溝通的程式碼的部分

在 main function 執行可以得到結果，依序步驟為

1. 載入檔案
2. 建立文字分割器
3. 建立 document 格式
4. 建立 Store 和向量檢索器
5. 建立 prompt 模板
6. 建立模型
7. 建立 Chain
8. 觸發問題與回答產生結果

### Step.1 使用 fs 和 path 載入檔案

利用了 Node.js 內建的 `path` 和 `fs` (檔案系統) 模組的 `promises` API，以非同步的方式讀取該 路徑下的 Markdown 檔案內容。

```typescript
import path from "path";
import { promises as fs } from "fs"; //提供了基於 Promise 的檔案系統操作方法

async function main(question: string) {
  //
  const trainingData = await fs.readFile(
    path.resolve("src/app/info.md"), //將相對路徑轉換為絕對路徑，
    "utf8"
  );
}
```

### Step.2 建立文字分割器

程式碼如下

```typescript
import {
    RecursiveCharacterTextSplitter,
    RecursiveCharacterTextSplitterParams,
    SupportedTextSplitterLanguage,
} from "langchain/text_splitter";

const splitter = createSplitter("markdown", {
    chunkSize: 500, // 指定每個分割塊的字符數
    chunkOverlap: 0, // 指定分割塊之間的重疊字符數
    separators: [], // 指定用於分割的分隔符列表
    keepSeparator: false, // 指定在分割後的文本中是否保留分隔符
});


 // 建立一個文本分割器的函式
function createSplitter(
    language: SupportedTextSplitterLanguage,
    option: Partial<RecursiveCharacterTextSplitterParams>
) {
    // 使用 fromLanguage 方法根據語言和選項參數來創建一個文本分割器實例
    return RecursiveCharacterTextSplitter.fromLanguage(language, option);
}

```

### Step.3 建立 document 格式

程式碼與註解如下

```typescript
// 建立文件分割成文檔的函式和前面建立的 splitter 將讀取的內容分割成多個 Document
const documents = await createDocumentsFromData(splitter, trainingData);

async function createDocumentsFromData(
  textSplitter: RecursiveCharacterTextSplitter,
  trainingText: string
) {
  // 使用 textSplitter 的 createDocuments 方法，將提供的文件分割成一系列的文檔
  return textSplitter.createDocuments([trainingText]);
}
```

### Step.4 建立 Store 和向量檢索器

```typescript
// 使用 documents 建立向量檢索器
const retriever = await createVectorRetriever(documents);

async function createVectorRetriever(
  documents: Document<Record<string, any>>[]
) {
  // 建立一個記憶體向量 store（vector store），用於儲存文件的向量
  // 使用 GoogleGenerativeAIEmbeddings 模型來生成文件的向量
  // 使用的嵌入模型名稱
  // 指定任務類型
  // 為向量儲存指定一個標題
  
  const vectorStore = await MemoryVectorStore.fromDocuments(
      documents, 
      new GoogleGenerativeAIEmbeddings({ 
          modelName: "embedding-001",  
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
      })
  );
  // 將記憶體向量 Store 轉換為檢索器並 return 
  return vectorStore.asRetriever();
}
```

### Step.5 建立 prompt 模板

```typescript
//加入任何你想添加的提示詞例如如果找不到答案請回覆 XXX 之類
const promptTemplate = `"Please answer the question following these context.
Question: {question}
Context:{context}
`;

// 使用 createPromptTemplate 函式根據模板字符串建立提示模板實例
// 此函式可以用根據特定的問題和 Context 動態生成提示內容。
const prompt = createPromptTemplate(promptTemplate);

// 使用 PromptTemplate.fromTemplate 方法將其轉換成一個 PromptTemplate 實例。可用於根據問題和 Context 定制的提示內容。
function createPromptTemplate(promptTemplate: string) {
  return PromptTemplate.fromTemplate(promptTemplate);
}
```

### Step.6 建立模型

```typescript
// 定義 chatmodel 模型的各種參數
const ModelConfig: GoogleGenerativeAIChatInput = {
  modelName: "gemini-pro", // 模型名稱
  temperature: 0.7, // 生成文本的隨機性
  topK: 1, // 在生成每個字元時，考慮的可能性最高的 K 個字元
  topP: 1, // 累積概率閾值，用於過濾掉概率小於此值的字元
  maxOutputTokens: 30000, // 最大輸出 token 數
};


const model = createModel(ModelConfig);

// 基於配置建立並回傳一個 ChatGoogleGenerativeAI 的新實例。
function createModel(GoogleModelConfig: BaseChatModelParams) {
	return new ChatGoogleGenerativeAI(GoogleModelConfig);
}
```

### Step.7 建立 Chain

```typescript
// 將剛剛的檢索器、提示模板和模型，帶入 createChain 函式。
const chain = await createChain(retriever, prompt, model);


async function createChain(
  retriever: VectorStoreRetriever<MemoryVectorStore>,
  prompt: PromptTemplate,
  model: BaseChatModel
) {
  // 使用 RunnableSequence.from 方法創建一個包含多步處理的執行鏈：
  const chain = RunnableSequence.from([
      {
          // 第一步：使用檢索器找到相關文件並將其格式化為字符串。
          context: retriever.pipe(formatDocumentsAsString),
          // 將問題 Passthrough，以便後續使用。
          question: new RunnablePassthrough(),
      },
      prompt, // 第二步：根據提示模板處理文件和問題。
      model, // 第三步：使用模型基於處理後的輸入生成回答。
      new StringOutputParser(), // 第四步：將模型輸出的回答解析為字串。
  ]);
  return chain;
}

```

### Step.8 觸發問題與回答產生結果

```typescript
// 使用剛剛建立的 chain 
// chain.invoke 方法會按照 `createChain`函式定義的方式執行，最後產生回答。
const result = chain.invoke(question);
```

### 主要的 main 函式

我們將之前提及的函式與過程整合成`main` 的函式增加可讀性

```typescript
export async function main(question: string) {
  const trainingData = await fs.readFile(
      path.resolve("src/app/info.md"),
      "utf8"
  );
  const splitter = createSplitter("markdown", {
      chunkSize: 500,
      chunkOverlap: 0,
      separators: [],
      keepSeparator: false,
  });
  const documents = await createDocumentsFromData(splitter, trainingData);
  const retriever = await createVectorRetriever(documents);
  const prompt = createPromptTemplate(promptTemplate);
  const model = createModel(ModelConfig);
  const chain = await createChain(retriever, prompt, model);
  const result = chain.invoke(question);
  return result;
}
```

## 建立 Next.js 路由

在建立了包含了處理問題的 `main` 函式後把他建立成為 `llm.js` 的檔案，接下來在 Next.js 的伺服器端建立一個 API，用於處理來自前端的請求。這個 API 會利用 `main` 函式來回答問題。

```typescript
import { NextRequest, NextResponse } from "next/server";
import { main } from "@/lib/llm";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await main(body.question);
  return NextResponse.json({
      answer: result,
  });
}
```

## 前端介面的 handler 的部分

前端的部分除了原本建立的 component，這裡是一些 事件處理器（event handler）和向後端 API 發送資料的 POST 請求的程式碼如下

```typescript
// 提交表單時的函式
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setLoading(true); 
    const response = await POSTData(question); // 發送問題到後端 API

    // 使用 remark 處理 Markdown 格式的答案
  const result = await remark()
      .use(remarkParse) // 將 Markdown 格式轉換為抽象語法樹 (AST)
      .use(html) // 接著使用 remark-html 插件將之前生成的 AST 轉換為 HTML。
      .process(response.answer); // 對從後端 API 獲得的答案進行處理。
}
```

## 最後資料夾結構

最後資料夾結構如下

```bash
├── ./README.md
├── ./components.json
├── ./next-env.d.ts
├── ./next.config.mjs
├── ./package.json
├── ./pnpm-lock.yaml
├── ./postcss.config.js
├── ./public
│   ├── ./public/next.svg
│   └── ./public/vercel.svg
├── ./src
│   ├── ./src/app
│   │   ├── ./src/app/api
│   │   │   └── ./src/app/api/llm
│   │   │       └── ./src/app/api/llm/route.ts
│   │   ├── ./src/app/favicon.ico
│   │   ├── ./src/app/globals.css
│   │   ├── ./src/app/info.md
│   │   ├── ./src/app/layout.tsx
│   │   ├── ./src/app/page.tsx
│   │   └── ./src/app/question
│   │       └── ./src/app/question/page.tsx
│   ├── ./src/components
│   │   ├── ./src/components/QA.tsx
│   │   └── ./src/components/ui
│   │       ├── ./src/components/ui/button.tsx
│   │       ├── ./src/components/ui/card.tsx
│   │       ├── ./src/components/ui/input.tsx
│   │       └── ./src/components/ui/label.tsx
│   └── ./src/lib
│       ├── ./src/lib/llm.ts
│       └── ./src/lib/utils.ts
├── ./tailwind.config.ts
└── ./tsconfig.json
```

## 總結

通過本文的介紹，我們知道如何使用 Next.js 和 LangChain 來構建一個與 Google Gemini 大型語言模型互動的問答系統。整個過程包括文件的讀取和處理、向量索引的建立、提示模板、模型的實例化和調用。

以下為參考資料

##### 參考資料

- [langchainjs](https://js.langchain.com/docs/get_started/introduction)
- [Next.js](https://nextjs.org/)
- [Gemini API -Node example ](https://ai.google.dev/tutorials/get_started_node?hl=zh-tw)