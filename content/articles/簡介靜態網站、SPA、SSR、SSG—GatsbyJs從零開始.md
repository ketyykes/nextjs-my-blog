---
title: 簡介靜態網站、SPA、SSR、SSG—GatsbyJs 從零開始
slug: 2022-12-10T07:34:00.000Z
date: 2022-12-10T07:34:00.000Z
tags: ["Gatsby.js","React"]
---

本文提及以下重點
- GatsbyJS 介紹
- 靜態網站
- SPA 網頁 (Single Page Application)
- SSR 網頁 (Server Side Rendered)
- Static site generator (gatsby)
- Gatsby 和 Data
- 開始 Gatsby
## GatsbyJS 介紹

- 使用 Static site generator (SSG) 靜態網站產生器
  - 使用模板 (template) 和組件 (component) 和資料 (data)
- 使用 React 和 GraphQL 技術結合
- Gatsby 稱他自己是現代網站產生器

以下簡介從靜態網站→SPA→SSR→SSG→GatsbyJs

## 靜態網站
- 使用靜態 HTML 網頁 (可能包含 JS 和 CSS)
- 頁面更新是使用 CDN 或者 web 伺服器

### 缺點
*  難以更新和維護網頁 (由於有很多類似的 code 是在每一頁)
*  載入新頁面的時候需要每次都和伺服器發出請求 (也造成網站下載過慢)
*  通常不會包含動態的資料
## SPA 網頁 (Single Page Application)
- 像是 React/Vue 網站
- 只有對伺服器單次請求一個初始的頁面 (空值)
- 除了 (routing 和 data) 是以外其他都是藉由 SPA 的機制在瀏覽器解析
### 缺點
* 網站頁面對於 SEO 不友善，因為初始的網頁是空白的 HTML
## SSR 網頁 (Server Side Rendered)
- 頁面渲染是藉由伺服器處理後再回應每個請求
- 伺服器資源的資料或使用模板來渲染 HTML 頁面
- 將結果頁面傳回給瀏覽器
### 缺點
- 對於每個新的請求需要被處理後才是每個頁面
- 伺服器處理資料和渲染頁面需要時間

## Static site generator (gatsby)
- 在建置時期 (build-time) 被編譯成靜態頁面 (Static pages) (但在部署前)
- Gatsby sites/pages 是使用 React components
- 靜態頁面是之後部署網頁
- 初始請求後網頁的表現像是 SPA 一樣

## Gatsby 和 Data
- 可以使用很多不同的資料來源到你的網站
- 例如 WordPress,shopify,contentful,firebase,filesystem
- Gatsby 結合全部的資料源頭到 GraphQL 層 Gatsby 結合全部的資料源頭到 GraphQL 層
好處是我們不需要在乎資料源頭是在哪裡，我們可以使用組件相同的方式查詢和訪問

如下圖
![https://ithelp.ithome.com.tw/upload/images/20221012/20125095ulZbVayle0.jpg](https://ithelp.ithome.com.tw/upload/images/20221012/20125095ulZbVayle0.jpg)

> 圖片來源：[Gatsby-Query for Data with GraphQL](https://www.gatsbyjs.com/docs/tutorial/part-4/)
---

### Q&A
1. Gatsby 被稱之為靜態網頁生成器 (Static site generator)，所以就不能像動態網頁一樣可以有留言、帳號登入、聊天室的功能了嗎？
   - 現在由於前後端分離，因此還是可以串接 API 的方式做到上述功能，靜態網頁生成器主要是說明在部署的時候是已經決定好的內容 (靜態)，不過還是可以透過發 API 的方式做到動態的行為。

---
## 開始 Gatsby

### 基礎知識

關於 Gatsby 官方提出你所需要的背景知識，包括但不限於 HTML、CSS、Javascript、command line、React、GraphQL

另外也必須安裝如 Node.js v14.15 以上、Git、Gatsby CLI、Visual Studio Code

### Gatsby 起手式 - 安裝 GatsbyCLI

首先全域安裝 gatsby 的 CLI

`npm install -g gatsby-cli`

在 npm 安裝完畢之後可以輸入`gatsby --version`，如果出現了版本號，表示安裝成功。

另外可以查看可用的指令
`gatsby --help`

### 建立一個 Gatsby 基本頁面

[Gatsby new](https://www.gatsbyjs.com/docs/tutorial/part-1/)
先前安裝完 gatsbyCLI 後，在 terminal 輸入`gatsby new`
會問你以下問題

* What would you like to call your site?
* What would you like to name the folder where your site will be created?
* Will you be using a CMS?
* Would you like to install a styling system?
* Would you like to install additional features with other plugins?
如下圖

![](https://i.imgur.com/mNsdOk7.png)

基本上都先勾選 No(or I’ll add it later) 和 Done 最後再輸入 Y

安裝完畢之後可以使用 vs code 開啟

可以打開`package.json`檔案，他會預先幫你安裝的東西如下。

```json
{
  "name": "test",
  "version": "1.0.0",
  "private": true,
  "description": "test",
  "author": "ketyykes",
  "keywords": [
    "gatsby"
  ],
  "scripts": {
    "develop": "gatsby develop",
    "start": "gatsby develop",
    "build": "gatsby build",
    "serve": "gatsby serve",
    "clean": "gatsby clean"
  },
  "dependencies": {
    "gatsby": "^4.24.4",
    "react": "^18.1.0",
    "react-dom": "^18.1.0"
  }
}

```

這時候在 terminal 輸入`npm run start`

這時候打開`http://localhost:8000/`的網頁就能看到 gatsby 預設的頁面

### 設置測試環境的 port 號
gatsby 預設的 port 是 8000 如果需要改變預設的 port 號可以在 package.json 描述檔的地方添加-p XXXX

打開**package.json**將 start 後面添加-p 8001，表示預設開啟是 8001 port
```json
  "scripts": {
    "develop": "gatsby develop",
    "start": "gatsby develop -p 8001",
    "build": "gatsby build",
    "serve": "gatsby serve",
    "clean": "gatsby clean"
  },
```

> [設定 gatsby 測試環境的 port 號](https://www.gatsbyjs.com/docs/reference/gatsby-cli/#options)

接下來你就可以看到有一個預先建立的頁面如下

![](https://i.imgur.com/ivEXHg6.png)

可以觀看 src 的資料夾內容如下

```bash
├─images
│      icon.png
│
└─pages
        404.js
        index.js
```

接下來就可以開始編輯你的 index.js 的頁面檔
另外也能編輯 404 的頁面了



##### 參考資料

- [Static Site Generators Explained in 5 minutes](https://www.cosmicjs.com/blog/static-site-generators-explained-in-5-minutes)
- [Gatsby Tutorial](https://www.gatsbyjs.com/docs/tutorial/part-0/)
- [Gatsby-Query for Data with GraphQL](https://www.gatsbyjs.com/docs/tutorial/part-4/)
- [Gatsby-Rendering Options](https://www.gatsbyjs.com/docs/conceptual/rendering-options/)
- [The Net Ninja](https://www.youtube.com/c/TheNetNinja)


