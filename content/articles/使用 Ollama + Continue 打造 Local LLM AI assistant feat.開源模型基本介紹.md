---
title: 使用 Ollama + Continue 打造 Local LLM AI assistant feat.開源模型基本介紹
slug: 2024-09-18T13:31:00.000Z
date: 2024-09-18T13:31:00.000Z
tags: ["AI"]
---

<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.rem50{
  font-size:5.0rem;
}
@media (max-width: 576px) {
  .rem25{
    font-size:2rem;
  }
  .rem40{
    font-size:3.0rem;
  }
  .rem50{
    font-size:3.5rem;
  }
}
.red {
color:red;
}
.blue{
color:blue;
}
.mycode{
padding: 2px 4px;
font-size: 90%;
color: #c7254e;
background-color: #f9f2f4;
border-radius: 4px;
}
</style>

## 1. Ollama 介紹

### 什麼是 Ollama？

Ollama 是一款專為本地運行大型語言模型（LLMs）而設計的軟體平台，主要支援 MacOS 和 Linux 作業系統，並推出 Windows 預覽版本 (截至目前 2024/09/15 )。
Ollama 旨在簡化在本地環境中運行開源大型語言模型的過程。它消除了管理模型權重、配置和相依性所帶來的繁瑣步驟，降低了學習曲線，提供了廣泛的自訂化選項和最佳化策略，讓使用者能根據自己的需求進行調整與優化，使用者能夠專注於與語言模型的互動。

Ollama 的最大優勢在於它讓你能夠在個人電腦上，無需支付額外的費用並且不需要有網路的環境，換句話說，能確保你的隱私安全，因為所有的資料運算都在本地端進行，避免了雲端服務帶來的風險。


## 2. 為什麼選擇 Ollama？


### Ollama 特色

- Privacy and Cost-Effectiveness：資料完全保存在本地電腦，且避免了雲端服務的持續使用費用。
- Offline Operation and Flexible Deployment：支援在本地機器上離線運行多種開源大型語言模型（LLMs），不依賴網路連接，同時提供更高的資源控制與自訂化選項。
- High Performance：透過 GPU 加速，模型推理速度相較於僅使用 CPU 的設置可提升最多 2 倍，特別適用於高計算需求的任務。
- Ease of Use and Integration：安裝簡便，操作友善，即使無經驗的使用者也能輕鬆上手。與多個平台如 Langchain 和 llama-index 等無縫整合，擴展應用範圍。
- Open-Source：支援多種開源模型，促進透明性，並提供自訂化的能力，適合各類專業應用與實驗。

## 3. Ollama 安裝指南

### 系統需求

以 macOS 為例 版本為 Big Sur 以上

![image](https://hackmd.io/_uploads/B1W8md4T0.png)

所需記憶體則需要根據你要執行的模型決定，（如下表）

以下是支援的模型清單，你可以在 [ollama.com/library](https://ollama.com/library 'ollama model library') 下載：

| 模型               | 參數  | 大小  | 下載命令                       |
| ------------------ | ----- | ----- | ------------------------------ |
| Llama 3.1          | 8B    | 4.7GB | `ollama run llama3.1`          |
| Llama 3.1          | 70B   | 40GB  | `ollama run llama3.1:70b`      |
| Llama 3.1          | 405B  | 231GB | `ollama run llama3.1:405b`     |
| Phi 3 Mini         | 3.8B  | 2.3GB | `ollama run phi3`              |
| Phi 3 Medium       | 14B   | 7.9GB | `ollama run phi3:medium`       |
| Gemma 2            | 2B    | 1.6GB | `ollama run gemma2:2b`         |
| Gemma 2            | 9B    | 5.5GB | `ollama run gemma2`            |
| Gemma 2            | 27B   | 16GB  | `ollama run gemma2:27b`        |
| Mistral            | 7B    | 4.1GB | `ollama run mistral`           |
| Moondream 2        | 1.4B  | 829MB | `ollama run moondream`         |
| Neural Chat        | 7B    | 4.1GB | `ollama run neural-chat`       |
| Starling           | 7B    | 4.1GB | `ollama run starling-lm`       |
| Code Llama         | 7B    | 3.8GB | `ollama run codellama`         |
| Llama 2 Uncensored | 7B    | 3.8GB | `ollama run llama2-uncensored` |
| LLaVA              | 7B    | 4.5GB | `ollama run llava`             |
| Solar              | 10.7B | 6.1GB | `ollama run solar`             |

> <span class="red rem25">注意</span>
> 執行 7B 模型需要至少 8GB 的 RAM，執行 13B 模型需要 16GB 的 RAM，執行 33B 模型需要 32GB 的 RAM。

### 下載安裝

在官網[下載](https://ollama.com/download/mac)後執行即可讓 Ollama 運行，接下來開啟終端機執行指令`ollama run llama3.1`

```bash
ollama run llama3.1
```

初次執行該指令的時候由於本地端沒有該模型，因此必須先等待下載

![image](https://hackmd.io/_uploads/rygC8_VTC.png)

等待模型下載完畢後，即可在終端機與 LLM 對話

![image](https://hackmd.io/_uploads/ry0ACdN6R.png)

#### 補充說明 - 常見 cli 指令

更多指令可以參考[Ollama CLI Reference](https://github.com/ollama/ollama/blob/main/README.md#cli-reference)

| 指令                                   | 說明                             |
| -------------------------------------- | -------------------------------- |
| `ollama run <model>`                   | 運行模型                         |
| `ollama create <model> -f <Modelfile>` | 從 Modelfile 建立模型            |
| `ollama pull <model>`                  | 從註冊表拉取模型，或更新本地模型 |
| `ollama rm <model>`                    | 移除模型                         |
| `ollama cp <source> <destination>`     | 複製模型                         |
| `ollama show <model>`                  | 顯示模型資訊                     |
| `ollama list`                          | 列出本地所有模型                 |
| `ollama serve`                         | 啟動 ollama 伺服器               |
| `ollama ps`                            | 列出正在運行的模型               |
| `ollama push <model>`                  | 推送模型到註冊表                 |
| `ollama help`                          | 顯示指令幫助資訊                 |
| `-h, --help`                           | 顯示 ollama 的幫助資訊           |
| `-v, --version`                        | 顯示版本資訊                     |

## 4. Ollama Popular 模型介紹

以下將會介紹 Ollama 上面 popular 的模型基本介紹包含如下

- Llama3.1
- Gemma2
- Mistral
- Owen2
- Phi-3

### 模型評估

根據 artificialanalysis 的資料，這裡將選取該模型最大的參數量進行比較，以 Chatgpt4o 作為參考如下圖

![image](https://hackmd.io/_uploads/BkRqS2NTC.png)

1. 人工分析品質指數（Artificial Analysis Quality Index）：
   Mistral Large 和 Llama 3 405B 表現優異，分別獲得 73 分和 72 分，位居前列。Qwen 2 緊隨其後，得分 69 分。
2. 推理與知識（MMLU）：
   Llama 3 405B 在此項目中表現突出，得分 87%。Mistral Qwen 2 也表現出色，分別獲得 85% 和 83% 的高分。
3. 科學推理與知識（GPQA）：
   Llama 3 405B 在這個類別中領先，得分 50%。Mistral Large 緊隨其後，得分 48%。其他模型如 Qwen 2 和 Claude 3 Sonnet 也有不錯的表現。
4. 定量推理（MATH）：
   Qwen 2 在此項目中表現最佳，得分 74%。Mistral Large 2 緊隨其後，得分 72%。Llama 3 405B 也有不錯的表現，得分 69%。
5. 寫程式（HumanEval）：
   Mistral Large 在這個類別中表現優異，得分 87%。Llama 3 465B 緊隨其後，得分 82%。Qwen 2 也有不錯的表現，得分 79%。
6. 溝通能力（LMSys Chatbot Arena ELO Score）：
   Llama 3 405B 在此項目中表現最佳，得分 1266。Mistral Large 2 緊隨其後，得分 1250。Google 的 Gemma 2 7B 也表現不俗，得分 1212。

Llama 3.1 405B 和 Mistral Large 系列模型在多個類別中表現出色，經常佔據前幾名的位置。Qwen 2 和 Claude 3 Sonnet 在某些領域也展現了強勁的實力。值得注意的是，像 Google 的 Gemma 2 7B 這樣的新興模型在某些特定領域（如溝通能力）也顯示出了競爭力。

### Output 速度比較

如下圖
![image](https://hackmd.io/_uploads/B1uTr3VaR.png)

### 品質與速度的象限圖

如下圖
![image](https://hackmd.io/_uploads/HJZlInVaR.png)

[資料來源 - Artificial Analysis](https://artificialanalysis.ai/?models_selected=gpt-4o-2024-08-06%2Cllama-3-1-instruct-405b%2Cgemma-2-27b%2Cmistral-large-2%2Cphi-3-medium%2Cqwen2-72b-instruct%2Cclaude-3-sonnet%2Cmistral-large)

### 各個模型的 Context Window

| Model Name                | Creator         | License     | Context Window |
| ------------------------- | --------------- | ----------- | -------------- |
| o1-mini                   | OpenAI          | Proprietary | 128k           |
| GPT-4o (2024-08-06)       | OpenAI          | Proprietary | 128k           |
| GPT-4o mini               | OpenAI          | Proprietary | 128k           |
| GPT-4                     | OpenAI          | Proprietary | 8k             |
| Llama 3.1 Instruct 405B   | Meta            | Open        | 128k           |
| Llama 3.1 Instruct 70B    | Meta            | Open        | 128k           |
| Llama 3.1 Instruct 8B     | Meta            | Open        | 128k           |
| Gemma 2 27B               | Google          | Open        | 8k             |
| Gemma 2 9B                | Google          | Open        | 8k             |
| Gemma 7B Instruct         | Google          | Open        | 8k             |
| Mistral Large 2           | Mistral         | Open        | 128k           |
| Mixtral 8x22B Instruct    | Mistral         | Open        | 65k            |
| Mistral NeMo              | Mistral         | Open        | 128k           |
| Mistral Small             | Mistral         | Proprietary | 33k            |
| Mixtral 8x7B Instruct     | Mistral         | Open        | 33k            |
| Codestral-Mamba           | Mistral         | Open        | 256k           |
| Mistral Large             | Mistral         | Proprietary | 33k            |
| Mistral 7B Instruct       | Mistral         | Open        | 33k            |
| Phi-3 Medium Instruct 14B | Microsoft Azure | Open        | 128k           |
| Qwen2 Instruct 72B        | Alibaba         | Open        | 128k           |

### Llama 3.1 介紹

Llama 3.1 是由 Meta AI 開發的一款開源大型語言模型，旨在推動人工智慧技術的民主化。該模型的設計目的是為了與市場上最先進的 AI 模型競爭，如 OpenAI 的 GPT-4 和 Anthropic 的 Claude 3.5。

#### 特色

- 提供不同的參數版本:Llama 3.1 提供三種不同的參數版本：8B、70B 和 405B，最大版本擁有 4050 億個參數。
- Context Windwos：該模型的 Context Windows 長度為 128K tokens，使其能夠處理長文本和復雜的查詢。
- 增強的語言理解：Llama 3.1 在自然語言處理方面的能力有所提升，能更好地理解和生成各種語言的文本。
- 多模態支持：該版本支持多種數據類型，包括文本、圖像等，能夠進行更複雜的任務。
- 可擴展性：Llama 3.1 提供了更好的可擴展性，能夠適應不同的應用場景和需求。
- 使用者友善的 API：改進的 API 設計，使得開發者可以更輕鬆地集成和使用模型。
- 安全性和道德考量：在設計中考慮了安全性和倫理問題，努力減少模型生成有害內容的風險。

### Gemma 2 介紹

Gemma 2 是 Google 開發的一系列開放語言模型中的最新版本，於 2024 年 6 月正式發布。該模型的設計旨在提供強大的 AI 工具，滿足開發者和研究人員的需求。Gemma 2 包含兩個主要版本：90 億參數（9B）和 270 億參數（27B），並在性能和效率上有顯著提升。

#### 特色

- 輕量級與可擴展性：Gemma 2 能在標準遊戲 GPU 或單個 TPU 主機上運行，降低了部署成本，適合各種規模的開發環境。
- 多樣化應用：支持文本生成、問題回答、摘要生成等多種能力，適用於多種 AI 任務。
- 開放性與易用性：模型開放於 Google AI Studio 及其他平台供開發者和研究人員使用，並支持 Hugging Face、JAX、PyTorch 和 TensorFlow 等主流框架。
- 改進的架構設計：引入局部/全局注意力機制和分組查詢注意力技術，有效提升模型推理效率和準確性。

### Mistral 介紹

Mistral 是一個由 Mistral AI 公司開發的先進大型語言模型（LLM），專門設計用於各種文本基礎的應用場景。該公司於 2023 年成立，創始人包括 Arthur Mensch 和 Guillaume Lample，兩位曾在美國科技巨頭工作過的專家。Mistral AI 的使命是推動開源社區的發展，並提供高效能的 AI 解決方案。

#### 特色

- 多種模型類型：包括 Mistral 7B 和 Mixtral 8x7B。Mixtral 8x7B 是一種稀疏的專家混合模型，具有更高的效率和性能。
- Context Windows 的 token 數量：Mistral 的 Mixtral 8x7B 模型支持高達 32,000 個 token 的上下文窗口，可以處理更長的文本並提供更精確的回應。
- 多語言支持：Mistral 支持多種語言，包括英語、法語、德語、西班牙語和意大利語，適應全球市場的需求。
- 文本生成：可用於創建高品質的文字內容，如文章、報告和故事，並保持高水平的語言流暢性和邏輯性。
- 數據分析：支援對大量文本數據進行分析和摘要，幫助用戶快速獲取關鍵信息，並能自動化數據輸入和報告生成，提升工作效率。
- 客戶支持：適用於開發 AI 聊天機器人，提供 24/7 的多語言客戶服務，能夠理解並回應各種查詢。

### Qwen2 介紹

Qwen2 是由阿里巴巴集團的通義千問團隊開發並開源的大型語言模型系列。這個系列模型的發布標誌著在開源 AI 領域的一次重大進展，尤其是在 Windows 環境下的應用潛力。Qwen2 系列包含多個模型版本，參數從 0.5B 到 72B 不等，旨在滿足不同用戶的需求。

#### 特色

- 多樣化模型選擇：Qwen2 系列包括 Qwen2-0.5B、Qwen2-1.5B、Qwen2-7B、Qwen2-57B-A14B 和 Qwen2-72B，適合不同規模的應用需求。
- 增強的上下文處理能力：支持最高 128K tokens 的上下文長度，能夠處理更複雜的文本輸入，適用於長文本生成和理解任務。
- 多語言支持：除了中英文外，Qwen2 還支持約 30 種語言，包括西班牙語、法語、德語等，提升其在全球市場的適用性。
- 高效能與指令微調：Qwen2 系列模型在多項基準測試中表現優異，特別是在語言理解、生成、寫程式和數學推理等領域，顯示出與專有模型的競爭力。
- 工具調用與增強生成：支持工具調用和檢索增強文本生成（RAG），可以在虛擬助手、客戶服務等場景中應用。

### Phi-3 介紹

微軟的 Phi-3 模型是一系列開源的小型語言模型（SLM），旨在提供高效能且低成本的 AI 解決方案。這些模型特別適合在資源有限的環境中使用，並且可以在 Windows 系統上運行。Phi-3 系列包括多個變體，其中最小的 Phi-3-mini 具有 38 億個參數，並且在各種語言理解、推理和寫程式任務中表現出色。

#### 特色

- 開源性：Phi-3 模型是由微軟開發並開源，支持在 Azure AI、Hugging Face 和 Ollama 等平台上使用。
- 高效能：儘管參數較少，但 Phi-3-mini 在多項基準測試中超越了許多參數更多的模型，如 GPT-3.5。
- 小型設計：Phi-3-mini 的設計使其能夠在移動設備和低資源環境中運行，適合用於聊天機器人等應用。
- 多種上下文長度：提供 4K 和 128K tokens 的上下文長度選擇，能夠處理更長的文本輸入。
- 經濟實惠：相較於其他大型模型，Phi-3 的運行成本大幅降低，可能只有十分之一。
- 訓練數據質量：使用經過嚴格篩選的數據集進行訓練，強調數據質量而非數量，這使得模型在多種任務上表現優異。
- Windows 相容性：Phi-3 模型經過優化，能夠在 Windows 系統上透過 ONNX Runtime 和 DirectML 進行高效運行。


## 5. Countinue 介紹

Continue AI Code Assistant 是一個專為開發者設計的人工智慧輔助工具，旨在提升寫程式效率和品質。這個工具能夠在寫程式的過程中提供即時的建議和自動補全功能，幫助開發者快速解決問題，並減少錯誤。

這個助手利用大型語言模型（LLM）技術，能夠理解上下文並生成相關的程式碼片段，從而支持多種程式語言。開發者只需輸入簡單的提示，Continue AI Code Assistant 就能生成相應的程式碼。

另外 Continue AI Code Assistant 也具備學習能力，能夠根據用戶的使用習慣和需求進行調整，持續優化其建議的準確性和實用性。這使得它不僅限於簡單的程式碼補全，還能幫助開發者理解更複雜的寫程式概念和技術。

## 6. Continue 安裝指南

### 安裝步驟

目前支援 **VS Code** 和 **JetBrains** 的 IDE 編輯器。

以下以 Vs code 安裝為例

1. 打開 VS Code 的 Extensions 視窗，並搜尋 `Continue` 。
   
   ![image](https://hackmd.io/_uploads/ByVnkwSTR.png)

2. 或者前往 [官網](https://docs.continue.dev/) 的 **Getting Started** 頁面，進行 **Install** 。

## 7. 使用 Ollama 搭配 Continue 配置

1. 安裝完成後，點擊左側的 **Continue** 圖標，然後點選下方的 <span class="mycode">...</span> 。
![截圖 2024-09-18 下午 4.20.05](https://hackmd.io/_uploads/rkgb0b_6A.png)
2. 點擊後，選擇 **QuickStart**，並選擇 **Local** 。

   ![image](https://hackmd.io/_uploads/By1d-0Ip0.png)
3. 在終端機依序輸入以下指令：

```bash
ollama pull llama3.1:8b    
```

```bash
ollama pull startcoder2:3b
```

4. 若需使用 **Embeddings**，官方建議安裝 `nomic-embed-text`。
5. 最後，按下 **Connect** 。
6. 點擊下方的齒輪圖標，可以查看當前的 `config.json`，如下圖：

![截圖 2024-09-17 下午 6.26.29](https://hackmd.io/_uploads/H1s75CUpA.png)

config.json 範例如下

```json
{
 "models": [
   {
     "title": "Llama 3.1 8B",
     "provider": "ollama",
     "model": "llama3.1:8b"
   }
 ],
 "tabAutocompleteModel": {
   "title": "Starcoder 3b",
   "provider": "ollama",
   "model": "starcoder2:3b"
 },
 "embeddingsProvider": {
   "provider": "ollama",
   "model": "nomic-embed-text"
 }
}
```

官方文件有對應的推薦的模型若有興趣可以到[Model types](https://docs.continue.dev/customize/model-types)

7. 按下<kbd>Command</kbd> + <kbd> L </kbd>即可開始聊天

如下圖

![image](https://hackmd.io/_uploads/S1Oa7f_6R.png)


##### 參考資料

[Running LLMs locally with Ollama](https://medium.com/@omargohan/running-llms-locally-with-ollama-b87b087e70e6)
[Intro to Ollama: Full Guide to Local AI on Your Computer](https://www.shepbryan.com/blog/ollama#why-ollama-matters)
[Introduction to Ollama + Run LLM Locally + Data Privacy + Why On Google Collab?](https://medium.com/@sridevi.gogusetty/introduction-to-ollama-run-llm-locally-data-privacy-f7e4e58b37a0)
