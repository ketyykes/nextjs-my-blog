---
title: 用 Google Stitch + Figma MCP + AI agent Tool：打造 GDG Tainan 社群「雞婆鄰里互助會」
slug: 2025-10-04T13:31:00.000Z
date: 2025-10-04T13:31:00.000Z
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
.green{
color:green;
}
.mycode{
padding: 2px 4px;
font-size: 90%;
color: #c7254e;
background-color: #f9f2f4;
border-radius: 4px;
}
</style>

## 前言

今天我們要來實作一個完整的專案：為 GDG Tainan 社群打造「雞婆鄰里互助會」網站。這個專案將展示如何結合 <span class="green">Google Stitch</span>、<span class="green">Figma MCP</span> 和 <span class="green">Claude Code</span>，從文案構思到自動切版的完整流程。

**本篇文章將會涵蓋以下重點：**

- 前言
  - 為什麼選擇這套流程？
  - 我們的解決方案
- 工具組合深入介紹
  - Google Stitch 是什麼？
  - Figma Context MCP 的運作原理
  - AI agent 扮演的角色
- 步驟一：準備文案內容並撰寫 Stitch Prompt
- 步驟二：使用 Google Stitch 生成設計稿
- 步驟三：將設計稿匯入 Figma
- 步驟四：設定 Figma MCP 整合
- 步驟五：使用 AI Agent 進行自動切版
- 步驟六：實作響應式設計（RWD）
- 步驟七：替換真實文案內容
- 總結與心得
- 參考資料

### 工具組合 

在這個實作過程中，我們會使用以下工具組合：

- **Google Stitch**：透過 AI 快速生成網頁設計概念稿
- **Figma**：調整與優化設計細節
- **Claude Code + Figma MCP**：自動讀取設計稿並生成程式碼

### 流程優勢

這套流程的優勢在於：

- **保留設計精確度**：不會因為 AI 理解偏差而失真
- **大幅縮短開發時間**：從設計到程式碼的轉換幾乎自動化
- **保有細節控制權**：在每個階段都能精確調整

### 為什麼選擇這套流程？

在這個 AI 技術快速發展的時代，市面上已有許多工具可以直接透過 prompt 生成網頁，例如 <span class="blue">firebase studio</span>、<span class="blue">blot.new</span>、<span class="blue">lovable</span> 等。這些工具的優勢是快速、方便，只要輸入需求就能立即產生網頁。

然而，這些趨向一鍵式、自動生成的流程，往往**犧牲了掌控細節的自由度**。當設計不符合預期時，你可能需要反覆調整 prompt，或是接受 AI 生成的結果，無法精確控制每個元素的位置、顏色、間距等細節。

### 我們的解決方案

相較之下，我們採用的這套結合 **Google Stitch**、**Figma Context MCP** 以及 **Claude Code** 的工作流程，提供了更好的平衡：

1. **保有設計圖的精確性**：不會因為 AI 理解偏差而失真
2. **不丟失元件層級與樣式資訊**：完整保留設計的結構化資料
3. **允許細節控制**：在設計前、設計圖階段與實作程式中，能夠擁有更多控制權

簡單來說，透過 **Google Stitch** 我們可以借助自然語言快速生成介面與前端程式草本。接下來藉由 **GLips/Figma-Context-MCP**，讓 Claude Code 能夠讀取<span class="blue">  Figma 的設計 的 metadata</span>，並將其轉換為 AI 易於理解的 layout 與 style 內容，最終產生精確的程式碼。

接下來，我們就一步步來實作這個專案。

## 工具組合深入介紹

在講解實作步驟之前，我們先來了解這套工具組合的運作原理。這邊會幫助你更清楚整個流程的邏輯。

### Google Stitch 是什麼？

[Stitch](https://stitch.withgoogle.com/) 是 Google 的實驗性工具，可以透過文字描述來生成網頁 UI 設計。換句話說，你只要用文字描述你的需求，它就能幫你畫出設計稿。

Stitch 的特色在於：
- 支援自然語言描述轉換為視覺設計
- 可快速切換不同的設計主題與配色
- 能直接匯出到 Figma 進行進一步調整

### Figma Context MCP 的運作原理

[Figma Context MCP](https://github.com/GLips/Figma-Context-MCP)（由 GLips 維護）是這套流程的核心技術。為了讓大家更好理解，我們可以把它想像成一個「翻譯員」：

1. **讀取 Figma API**：透過 Figma 的 API 存取設計檔案
2. **解析設計 Metadata**：抓取圖層結構、樣式、位置、尺寸等資訊
3. **轉換為結構化資料**：將設計資訊轉換為 AI 容易理解的格式
4. **提供給 Claude Code**：讓 AI 能夠準確理解設計意圖

簡單的說法就是，這個工具讓 AI 不需要「看圖猜測」，而是能夠直接<span class="blue">讀取精確的設計參數</span>，就像建築師看建築藍圖一樣精確。這樣一來，程式碼的準確度就大幅提升了。

### AI agent 扮演的角色 


接下來我們來看看 AI agent  在這套流程中的角色。根據我們的實作經驗，AI agent 主要負責：

- 接收來自 Figma MCP 的設計資訊
- 分析設計結構與元件關係
- 生成對應的 HTML/CSS/JavaScript 程式碼
- 自動下載並整合設計稿中的圖片資源

這裡以 Claude code 為例，可以選擇具有 MCP client 可串接的工具即可，例如 <span class="blue">Codex Cli</span>、<span class="blue">Geminil Cli</span>、<span class="blue">Cursor</span>...等等

## 步驟一：準備文案內容並撰寫 Stitch Prompt

接下來我們開始實作。首先，我們需要整理「雞婆鄰里互助會」的完整文案內容，包括：

- 活動理念與目的
- GP（雞婆點數）累積方式
- Google 雞婆加碼機制
- 頻道查詢說明
- 行動呼籲

整理好文案後，這邊會進入一個關鍵步驟：撰寫 Stitch Prompt。我們可以使用三種不同詳細程度的 prompt。

> <span class="green">💡 小技巧</span>
>
> 如果對撰寫 Prompt 沒有頭緒，可以先請 LLM（如 Claude、ChatGPT）幫你生成初版 prompt！只要把你的文案內容和設計需求貼給 LLM，請它參考 Stitch Prompt Guide 的格式幫你產出 prompt，再根據需要微調即可。


### 三種 Prompt 版本介紹 

以下為 LLM 產生的 prompt 範例：

#### 1. 完整精準版（推薦）

這是最詳細的版本，適合對設計有明確需求的情境。包含：

- **品牌調性與設計方向**：Material 3 風格、溫暖色調（amber/orange）、親切友善的社群氛圍
- **版面架構**：Hero 區塊、關於我們、GP 規則、Google 加碼、頻道查詢、FAQ、行動呼籲、頁尾
- **互動元件規格**：按鈕樣式、卡片設計、表格/卡片切換、排行榜、提示訊息
- **響應式設計需求**：Mobile-first、斷點設定（768px、1200px）、多欄布局
- **無障礙規範**：WCAG AA 標準、鍵盤導覽、焦點明顯、aria-label

以下是完整精準版的 prompt 範例：

```bash
**Goal:** Generate a polished one-page website design and export starter HTML/CSS.
Use Google Material 3 vibes mixed with friendly community tone.

**Language:** Output UI texts in Traditional Chinese (Taiwan).

**Brand vibe & art direction:**
* Friendly, neighborly, playful but clean.
* Color: warm primary (amber/orange) + Google-like accents (blue/green/red/yellow in subtle chips).
  High contrast for readability.
* Typography: Headings: geometric sans; Body: humanist sans. Generous line-height for Chinese.
* Iconography: simple line icons; a small "GP" badge icon.
* Imagery: abstract shapes / subtle grid—no stock people.

**Layout (single page with anchor nav):**
* Sticky top nav with anchors: 「關於」「如何累積 GP」「Google 加碼」「頻道與查詢」「FAQ」「行動呼籲」
* Sections (in order):
  1. **Hero**（大標＋副標＋CTA）
  2. **關於雞婆鄰里互助會**（理念）
  3. **如何累積 GP**（卡片或表格）
  4. **Google 雞婆加碼**（Buff 區）
  5. **頻道與查詢**（說明＋活躍分享者 TOP5 placeholder）
  6. **FAQ / 還能做什麼**（輕鬆語氣）
  7. **行動呼籲 CTA**（表單連結）
  8. **頁尾**（聯絡/社群/版權）

**Components & micro-interactions:**
* CTA button: primary, large, rounded-xl, hover raise.
* Cards for GP 類型，含點數與簡述；hover 陰影加深。
* Table variant（可切換卡片/表格）。
* "活躍分享者 TOP5"用排行榜樣式（暫放假資料 slots）。
* Toast/inline banner for「目前查詢為人工處理」提醒。
* Back-to-top 浮動按鈕。
* Smooth scroll for anchor。

**Accessibility:**
* 色彩對比達到 WCAG AA。
* 可鍵盤導覽、焦點明顯。
* 所有 icon 與連結有 aria-label。

**Responsive:**
* Mobile-first：單欄；Section 之間 32–40px 間距。
* ≥768px：雙欄；GP 卡片 2–3 欄瀑布式。
* ≥1200px：更寬白邊與網格，導航顯示完整文字。

**Content (use EXACT texts below):**

*Hero*
* H1：**雞婆鄰里互助會：你的分享，我們單純記錄**
* Sub：**分享，本來就是社群裡無處不在的日常。**
* Paragraph：**一個新發現的工具、一個超難的 bug 解決方案、一家超讚的宵夜……
  這些不經意的「雞婆」分享，常常在不經意間幫助了別人。我們認為，這些寶貴的熱情值得被記錄下來。**
* Primary CTA：**我要填 20 秒表單** →
  `https://docs.google.com/forms/d/e/1FAIpQLSdKrAzJW4DzRk5pb0zc89p5pwL6xXjmUTW6Je2YqX1isdqUvg/viewform`

（以下省略其他區塊的詳細文案...）

**Deliverables:**
* Provide final page mock + component variants.
* Export starter HTML/CSS with semantic sections and anchor IDs.
* Include a color tokens snippet (CSS variables) and spacing scale.
```

#### 2. 設計師自由版

這個版本給 AI 較多創作空間，保留核心需求但允許自由發揮：

```bash
Design a one-page site in Traditional Chinese (Taiwan) for **「雞婆鄰里互助會」**.
Tone is friendly, neighborly, playful-clean; Material 3 influence.
Use warm primary and subtle Google-like accents.

Sections: Hero, About, GP Rules (cards/table), Google Bonus, Channel & GP Query (TOP5 board),
FAQ, CTA, Footer.

Add sticky nav with smooth anchors, mobile-first responsive grid, accessible contrast,
keyboard focus, aria-labels.

Use my exact copy below per section (don't paraphrase), and wire up the CTA to the Google Form URL.
Provide Figma-ready frames or export starter HTML/CSS.

（貼上完整文案內容）
```

#### 3. 極短版

快速試水溫，用最精簡的描述生成初步設計稿：

```bash
One-page site in zh-TW for "雞婆鄰里互助會". Material-3-inspired, warm, friendly.

Anchored nav; sections: Hero / About / GP Rules / Google Bonus / Channel & Query (TOP5) / FAQ / CTA / Footer.

Responsive grid, high contrast, keyboard-friendly, smooth scroll.
Use EXACT texts provided; primary CTA links to the Google Form.
Export starter HTML/CSS + color tokens.

（貼上完整文案內容）
```

### 本次實作選擇：完整精準版

一開始我嘗試使用極短版來快速產出設計稿，但發現生成的內容與預期有些落差。<span class="blue">如果你也想快速測試，可以先用極短版試水溫</span>。

經過比較後，我決定採用**完整精準版**。對於正式專案來說，明確的設計規範能大幅提升產出的準確度，也能確保設計細節符合需求。


## 步驟二：使用 Google Stitch 生成設計稿

現在我們把撰寫好的 prompt 輸入到 [Google Stitch](https://stitch.withgoogle.com/)。

輸入 prompt 後，Stitch 會開始生成設計稿。接下來我們可以進行以下調整

### 調整設計主題

生成設計稿後，你會在右上角看到主題選項。點擊後可以快速套用不同的設計主題。

舉例來說，如果我們想把主題顏色改成綠色，可以看到按鈕、強調色等元素就會馬上跟著變色。這個功能讓我們能快速試驗不同的配色方案。

![變換主題](https://hackmd.io/_uploads/B120CZ-pex.png)

### 查看 Prompt Guide

如果想要更進一步了解如何下達更精確的指令，這邊有個小訣竅：<span class="red">可以按下畫面上的「...」按鈕</span>，查看官方的提示詞指南（Prompt Guide）。這份[官方指南](https://discuss.ai.google.dev/t/stitch-prompt-guide/83844)提供了詳細的 prompt 撰寫技巧。

### 微調與預覽

在這個階段，我們可以：

- **微調細節**：如果某些元素不符合預期，可以透過追加 prompt 來修正
- **預覽效果**：確認各個區塊的排版與文字是否正確
- **即時調整**：Stitch 支援即時修改，讓你能快速迭代設計

當我們對設計稿感到滿意後，就可以準備匯出到 Figma 了。

以下是極短版與完整精準版的設計稿比較：

**極短版設計稿**：

![極短版的設計稿](https://hackmd.io/_uploads/ryMQAn0nlx.png)

**完整精準版設計稿**：

![完整精準版的設計稿](https://hackmd.io/_uploads/HkgnahChgx.png)


## 步驟三：將設計稿匯入 Figma

接下來就是神奇的時刻了！我們要把 Stitch 的設計稿匯入到 Figma 中進行進一步調整。

### 1. 複製設計稿到剪貼簿

當我們對 Stitch 產生的設計感到滿意後，神奇的事情發生了！你會在畫面上方看到一個 **Figma** 的圖示，勇敢地按下去！設計稿就會被複製到剪貼簿。

值得一提的是<span class="blue">按下按鈕後不會有明顯的視覺回饋，但設計稿已經成功複製了</span>。

![Figma 匯出按鈕](https://hackmd.io/_uploads/Hk6gWa02xe.png)

### 2. 開啟 Figma 並建立設計檔案

接下來我們前往 [Figma Design](https://www.figma.com/design)，點選上方的 **"Design file"** 按鈕，然後準備貼上我們的設計稿：

![Figma design 按鈕](https://hackmd.io/_uploads/rJCtFmUwee.png)

### 3. 貼上設計稿

這一步非常簡單。在 Figma 畫布上直接按下 <span class="mycode">Cmd+V</span>（Mac）或 <span class="mycode">Ctrl+V</span>（Windows）貼上，剛剛在 Stitch 的設計稿就完整地出現在我們的 Figma 畫布上了！




## 步驟四：設定 Figma MCP 整合

接下來就是**重頭戲**了！我們要設定 [Figma Context MCP](https://github.com/GLips/Figma-Context-MCP)，讓 **Claude Code** 能夠「看懂」我們的 Figma 設計稿。

### 如何取得 Figma Token？

這是必要的前置作業，為了讓工具能存取我們的 Figma 檔案，我們需要<span class="red">一組 API 金鑰（Token）</span>：

1. 點擊 Figma 右上角的大頭貼
2. 進入 **"Settings"**
3. 找到 **"Personal access tokens"** 區塊
4. 點擊 **"Generate new token"** 來產生一組新的金鑰
5. <span class="red">請記得務必先把這組金鑰複製下來</span>，因為關掉視窗後就看不到了！

![取得 Figma Token](https://hackmd.io/_uploads/BJOy07LDxg.png)

### 設定 MCP

拿到金鑰後，打開終端機，準備把 Figma MCP 加到 Claude Code 環境中。執行以下指令：

```bash
claude mcp add-json "FramelinkFigmaMCP" '{"command":"npx","args":["-y","figma-developer-mcp","--figma-api-key=你的金鑰","--stdio"]}'
```

這邊需要注意的是，<span class="red">MCP 的名稱有一些限制，只能包含字母和數字，不能有空白、連字號（hyphens）或底線</span>。如果你在執行時看到 `Invalid name` 的錯誤，請檢查一下名稱是否符合規範。

### 確認設定成功

設定成功後，在 Claude Code 中輸入 <span class="mycode">/mcp</span>，就可以看到 <span class="green">FramelinkFigmaMCP</span> 已經成功連線了！

```bash
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Manage MCP servers                                                                                                 │
│                                                                                                                    │
│ ❯ 1. FramelinkFigmaMCP  ✔ connected · Enter to view details                                                        │
│                                                                                                                    │
│ MCP Config locations (by scope):                                                                                   │
│  • User config (available in all your projects):                                                                   │
│    • /Users/xxx/.claude.json                                                                                   │
│  • Project config (shared via .mcp.json):                                                                          │
│    • /Users/xxx/Desktop/project/ooxx/.mcp.json (file does not exist)                                      │
│  • Local config (private to you in this project):                                                                  │
│    • /Users/ooxx/.claude.json [project: /Users/ooxx/Desktop/project/fish-shop]                               │
│                                                                                                                    │
│ For help configuring MCP servers, see: https://docs.anthropic.com/en/docs/claude-code/mcp                          │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
   Esc to exit
```

## 步驟五：使用 AI Agent 進行自動切版


現在我們可以開始自動切版了！打開 Claude code <span class="red">在下達指令之前，我們需要先取得 Figma 設計稿的連結</span>。

### 取得 Figma 設計稿連結

回到 Figma，我們需要取得剛才貼上的設計稿連結，供 Claude Code 讀取。這邊的步驟很簡單：

1. 在選取的元件或整個設計稿上按右鍵
2. 選擇 **"Copy link to section"**（如下圖）
3. 複製下來的連結待會會用到

![copy link to selection](https://hackmd.io/_uploads/SkEK1nyael.png)

### 下達切版指令

取得連結後，接下來我們在 Claude Code 中下達以下指令：

```bash
幫我使用 Figma mcp 切「https://www.figma.com/design/你的設計稿連結」
在 @src/app/page.tsx，包含下載圖片的部分
```

送出指令後，**神奇的事情發生了**！Claude Code 會自動幫我們完成以下工作：

1. **連接 Figma MCP**：讀取設計稿的結構與樣式資訊
2. **分析設計元件**：理解各個區塊的佈局、文字、顏色、間距等
3. **生成 HTML/CSS 程式碼**：根據設計稿產生對應的程式碼
4. **下載圖片資源**：自動下載設計稿中使用的圖片到專案資料夾

整個過程大約需要幾分鐘，Claude Code 會即時顯示進度。完成後，我們就會得到一個基本的網頁結構。

## 步驟六：實作響應式設計（RWD）

雖然 Claude Code 已經幫我們生成了基本的程式碼，但我們還需要針對不同裝置優化版面。這時候我們可以這樣下指令：

```bash
@src/components/ @src/app/page.tsx
你是一個 UX/UI 大師，我使用 Tailwind CSS，
幫我規劃 RWD 的手機版和平板版面並且實作
```

送出指令後，Claude Code 會自動幫我們：

- 分析現有的元件結構
- 使用 Tailwind CSS 的響應式工具類別
- 為手機版（<768px）、平板版（768px-1200px）、桌面版（>1200px）分別優化
- 調整元件排列、字體大小、間距等

完成後，我們可以在瀏覽器中測試不同裝置尺寸的顯示效果。換句話說，整個響應式設計的實作，只需要下一個指令就能完成。

## 步驟七：替換真實文案內容

到目前為止，網頁上可能還有一些 Stitch 生成的假文案或佔位文字。接下來我們要把它們替換成真實的內容：

```bash
@src/components/ @src/app/page.tsx
原先的文字是假的，我的真實文案如下：

雞婆鄰里互助會：你的分享,我們單純記錄

分享,本來就是社群裡無處不在的日常。

一個新發現的工具、一個超難的 bug 解決方案、一家超讚的宵夜……
這些不經意的「雞婆」分享,常常在不經意間幫助了別人。
我們認為,這些寶貴的熱情值得被記錄下來。

「雞婆鄰里互助會」的目的很單純,就是將這些散落在各處的分享,
變成一個具現化的「雞婆」點數 (GP)。
我們不強調你能獲得什麼,而是希望讓你的熱情與付出,能被真實地看見。

（以下省略完整文案...）
```

> <span class="green">💡 小技巧</span>
>
> 建議使用 <span class="mycode">ultrathink</span> ，這樣 Claude Code 會更仔細地分析文案結構，確保替換的準確度和語意的完整性。

Claude Code 會智慧地找出對應的文字區塊，並進行替換，同時保持原有的 HTML 結構與樣式。

## 總結與心得

透過這次實作，我們完整體驗了從設計到程式碼的自動化流程。<span class="blue">整個過程可以總結為</span>：

**文案準備** → **Prompt 撰寫** → **Stitch 生成設計** → **Figma 調整** → **Claude Code 切版** → **RWD 實作** → **文案替換** → **最終優化**

### 這套流程的三大優勢

綜合以上所述，我們透過串連 <span class="mycode">Google Stitch</span>、<span class="mycode">Figma </span> 以及 <span class="mycode">Claude Code </span>，成功建立了一套自動化工作流程。相較於市面上的一鍵生成工具，這套流程具有以下優勢：

1. **保有設計圖的精確性**
   - 設計稿的每個細節都能被準確轉換成程式碼
   - 不會因為 AI 理解偏差而失真
   - Figma MCP 直接讀取設計 metadata，而非「看圖猜測」

2. **不丟失元件層級與樣式資訊**
   - 完整保留設計的結構化資料
   - 元件之間的關係與層級都能被正確識別
   - 樣式屬性（顏色、間距、字體等）精確轉換

3. **允許細節控制**
   - **設計前**：透過詳細的 Prompt 精確控制設計方向
   - **設計圖階段**：在 Figma 中自由調整每個元素
   - **實作程式階段**：程式碼生成後仍可自由修改優化
   - 每個步驟都能人工介入，保有最大彈性

### 與一鍵生成工具的對比

| 特性         | 一鍵生成工具 | 本流程           |
| ------------ | ------------ | ---------------- |
| **速度**     | 非常快速     | 快速但需多步驟   |
| **精確度**   | 依賴 AI 理解 | 讀取精確設計資料 |
| **可控性**   | 黑盒作業     | 每步驟可調整     |
| **設計細節** | 容易失真     | 完整保留         |
| **元件結構** | 可能混亂     | 結構化保留       |

### 大幅縮短開發時間

- 從設計到程式碼的時間從**數天縮短到數小時**
- 自動化處理重複性工作（如圖片下載、響應式設計）
- AI 協助處理瑣碎但必要的細節調整

### 實務建議與注意事項

根據我們的實作經驗，這邊有幾個建議：

- **Prompt 撰寫**：撰寫 Prompt 時要越詳細越好，包含品牌調性、色彩規範、互動細節等
- **安全性考量**：<span class="red">Figma Token 要妥善保管</span>，不要洩漏給他人，這是存取你設計檔案的關鍵
- **版本選擇**：使用完整精準版 Prompt 能獲得最符合需求的設計稿
- **檢查流程**：在切版前先在 Figma 中確認設計稿的完整性
- **RWD 實作**：建議使用 Tailwind CSS 等 utility-first 框架
- **最終檢查**：務必在真實裝置上測試，確保體驗符合預期

希望這篇實作教學對大家有幫助，讓我們一起享受 AI 工具帶來的開發效率提升！

## 參考資料

- [Stitch Prompt Guide](https://discuss.ai.google.dev/t/stitch-prompt-guide/83844)
- [Google Stitch 官方文件](https://stitch.withgoogle.com/)
- [Figma Context MCP GitHub](https://github.com/GLips/Figma-Context-MCP)
- [Claude Code 文件](https://docs.anthropic.com/en/docs/claude-code)
