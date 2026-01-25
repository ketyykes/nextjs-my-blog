---
title: 部落格留言板選擇與如何在 React 使用 giscus 教學
slug: 2024-03-09T13:31:00.000Z
date: 2024-03-09T13:31:00.000Z
tags: ["React"]
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
.code{
background-color:#e9e9e9;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>

本文章將提及以下內容

- 選擇官方推薦的 Disqus？
- 其他留言系統 
- Github 做為留言板
  - discussion vs issue 補充說明
- 開始 giscus
  - giscus 教學
    - Step.1 設置 Github 與應用程式
    - Step.2 輸入 github name 與 repo name  
    - Step.3 選擇 mappign discussion 的方式
      - mapping 簡單說明
    - Step.4 選擇分類、佈景主題等等的配置
    - Step.5 得到 script 結果
  - 使用 giscus component
    - Step.1 安裝 giscus react library
    - Step.2 引入 Giscus component 
    - Step.3 輸入 script 結果到 props
- 其他補充 - Don't Worry 404
- 參考資料

## 選擇官方推薦的 Disqus？

雖然 Gastby.js 的官方教學預設是[Disqus](https://disqus.com/)，考量了幾個層面其優點包含有 Gatsby 的[plugin](https://www.gatsbyjs.com/plugins/gatsby-plugin-disqus/?=disqus)可以進行安裝，另外在官方文件擁有[教學](
https://www.gatsbyjs.com/docs/how-to/adding-common-features/adding-comments/)，也有自動過濾垃圾郵件等等的功能[(參見連結)](https://blog.logrocket.com/4-plugins-to-add-comments-to-your-gatsbyjs-blog/)，再加上日後如果不使用 Disqus 的話轉移也有[相關工具](https://help.disqus.com/en/collections/191709-import-export-and-syncing)可以使用的樣子，但由於考量到免費版的話會有廣告，參考了一些 Blog 的廣告長怎樣的情形看到了以下的畫面。

廣告篇幅個人覺得看起來實在太大 (如下圖)，並且有可能[降低網站速度](https://blog.logrocket.com/4-plugins-to-add-comments-to-your-gatsbyjs-blog/)，因此放棄了這個選項。

![截圖 2024-03-07 晚上 7.15.31](https://hackmd.io/_uploads/Bk4_jwO6p.png)

## 其他留言系統

另外像是[Facebook Components](https://www.npmjs.com/package/react-facebook)是針對使用者做的留言系統暫時不考慮，剩下 Gatsby 官方網站有舉例其他[Commento](https://commento.io/)、[Fast Comments](https://fastcomments.com/)、[Staticman](https://staticman.net/)、[TalkYard](https://www.talkyard.io/)需要每月負擔一定的費用，覺得在留言數還沒大到一定的量加上參考了幾位所知道的知名前端技術者並沒有使用這些的服務，就暫時不考慮這些留言管理系統。

## Github 做為留言板

最後看到比較多人使用的會是透過 Github 的 API 作為留言的方式像是[Gitalk](https://gitalk.github.io/)、[Utterances](https://utteranc.es/)、[giscus](https://giscus.app/zh-TW)，由於自己部落格的取向是技術文章，通常讀者也會具備 Github 帳號，另外也可以使用 Markdown 排版。

在這三者比較當中發現比較不一樣的地方是 giscus，他是透過[GitHub Discussions](https://docs.github.com/en/discussions)驅動的留言系統，其中 Github 的[discussions](https://docs.github.com/en/discussions/quickstart)主要是促進交流的地方 (參見以下補充說明)，而 issue 比較像是程式碼有錯誤需要修復的功用，與留言板的功能比較類似的 mapping 個人會覺得 discussions 的作用比較相近。最後就決定使用它作為部落格的留言系統了。

### discussion vs issue  補充說明 

GitHub 的 Issue 和 Discussion 都是為了促進項目維護和社群互動而設計的功能，但它們有一些不同的用途和特性：

**Issue:**

- 主要用於追蹤 bug、錯誤報告、功能請求等項目相關的工作項目。
- 可以指派給特定的貢獻者進行處理。
- 支援標籤、里程碑等組織功能。
- 與程式碼倉庫緊密關聯，可以直接引用程式碼段落或提交記錄。
- 適合用於項目開發和管理流程。

**Discussion:**

- 主要用於開放式的討論、問題解答、想法分享等社群互動。
- 沒有指派功能，更適合公開討論和意見交流。
- 支援範疇 (Categories) 分類，方便組織不同主題。
- 更適合一般性的問題、建議或反饋。
- 有別於 Issue，更強調社群交流而非工作追蹤。

Issue 更專注於項目管理、錯誤追蹤和功能需求。而 Discussion 則是一個開放的討論空間，促進社群參與、提問和分享想法。

## 開始 giscus

以下教學分成**giscus 教學**與**使用 giscus component**的部分，無論你是否有用任何框架都需要藉由 giscus 教學，而 giscus component 是針對你是框架的使用者，例如 vue、react、svelte 等等。

## giscus 教學

### Step.1 設置 Github 與應用程式

使用方式也很簡單，首先到[giscus](https://giscus.app/zh-TW)官方網站有說明必須確保以下事情

1.  **此儲存庫是[公開的](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/setting-repository-visibility#making-a-repository-public)**，否則訪客將無法查看 discussion。
2.  已安裝 **[giscus](https://github.com/apps/giscus) 應用程式**，否則訪客將無法留言或回應。
3.  你要連結的儲存庫已[啟用 **Discussions** 功能](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/enabling-or-disabling-github-discussions-for-a-repository)。

官方網站滿貼心的都把相關連結附上來，基本上依照連結內容給的指示應該不會有太大的問題。

### Step.2 輸入 github name 與 repo name

接下來在網站輸入你的 github 名稱和 repo 名稱
如下圖
![image](https://hackmd.io/_uploads/ryqIVwOaa.png)

### Step.3 選擇 mappign discussion 的方式
下方可以選擇留言如何 mapping 你的 discussion 

![image](https://hackmd.io/_uploads/SyDfrvd6p.png)

#### mapping 簡單說明

以 Discussion 的標題包含頁面的`路徑名稱`為例子，如果有人在該篇文章底下留言的話，就會創建一個 discussion 在你指定的 repo，然後標題為你這個網站的 url pathname，若不想要使用 pathname 作為標題，也可以藉由網站的`<head>`標籤的`<title>`，或者`<meta property="og:title">`，由於我的部落格是根據日期做為 pathname，如果未來在 Github 找尋 Discussion 可能比較難以一目瞭然是哪篇文章底下的留言，於是我後來改用`og:title`做為 Discussion 的標題。

### Step.4 選擇分類、佈景主題等等的配置

頁面繼續往下滑依據選擇 Discussion 分類 並且選擇是否想要有 reaction (簡單說就是可以添加表情符號) 用途，以及根據你的喜好選擇適合的佈景主題。

![image](https://hackmd.io/_uploads/HJrIDv_ap.png)

### Step.5 得到 script 結果
最後就會根據你的配置選項輸出相對應 script，稍後這些結果將會加入到 giscus component 作為 props 傳入。

![image](https://hackmd.io/_uploads/HyCldwOpa.png)

## 使用 giscus component

但是由於我使用的是 react 的框架，所以官方也製作了 library 讓我們開箱即用作為 component 的方式引入到你要放置留言板的頁面。
依據你的框架安裝 library
這裡以 react 為例子

### Step.1 安裝 giscus react library

在你的專案資料夾的終端機輸入

```bash
npm i @giscus/react  
```
### Step.2 引入 Giscus component 
接下來在你要放留言板的地方 引入後就能使用 Giscus component 

```javascript
import Giscus from '@giscus/react';

export default function MyApp() {
  return (
    <Giscus
      id="comments"
      repo="giscus/giscus-component"
      repoId="你的repoId"
      category="Announcements"
      categoryId="分類ID"
      mapping="specific"
      term="Welcome to @giscus/react component!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="en"
      loading="lazy"
    />
  );
}
```
### Step.3 輸入 script 結果到 props

這時候 props 的部分帶入你剛剛在官方網站根據你的配置選項輸出相對應 script 的內容即可。至於 props 要帶入什麼東西呢？其 props 對應的剛剛
script，依照官方解釋是 prop 名稱與 giscus 網站上顯示的 data- 屬性相同，但以駝峰命名法編寫，並刪除了 data- 前綴和破折號。有興趣也可以點到他的[Giscus component 原始碼](https://github.com/giscus/giscus-component/blob/main/react/src/lib/Giscus.tsx)。

<span class="rem25">上述的步驟做完後就能在你的頁面看到以下畫面囉~🎉🎉🎉</span>

![image](https://hackmd.io/_uploads/r1J5cvuTp.png)

## 其他補充 - Don't Worry 404


當你製作完留言板完畢之後打開 devtool 發現了如下
`GET https://giscus.app/api/discussions/api/discussions?repo=[使用者名稱]%2F[儲存庫名稱]&term=[網頁連結]&category=[類別]&number=[數字]&strict=[布林值]&first=[數字] 404 (Not Found)`錯誤
<br>這不是一個程式 bug，而是當尚未建立討論時，正常反應。

可以查看是否 github Discussions 是否已經建立，如果尚未建立則會出現錯誤，如果已經建立仍然出現錯誤的話才需要檢查過程當中有沒有哪個步驟操作錯誤。有興趣的讀者可以參考這篇 [404 Not Found，error: "Discussion not found"](https://github.com/giscus/giscus/issues/1204)的 issue
##### 參考資料

- [giscus 官方網站](https://giscus.app/zh-TW)
- [giscus-component](https://github.com/giscus/giscus-component#giscus-component)
- [giscus-Advanced usage](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md#advanced-usage)
- [4 plugins to add comments to your Gatsby.js blog](https://blog.logrocket.com/4-plugins-to-add-comments-to-your-gatsbyjs-blog/)
- [Giscus is the key](https://tiagomichaelsousa.dev/articles/giscus-is-the-key)
- [Moving from utterances to giscus](https://shipit.dev/posts/from-utterances-to-giscus.html)
