---
title: Gatsby 實作 Layout 並使用 wrapPageElement、gatsby-plugin-layout 減少 Remount
slug: 2022-01-19T13:31:00.000Z
date: 2022-01-19T13:31:00.000Z
tags: ["Gatsby.js","React"]
---

本文將提及以下內容

- Gatsby 建立 Layout component 使用 children
- 為何需要 Layout component
- 建立資料夾結構  
- 建立 Layout component
- 使用 Layout component
- Unmount 問題
- 解決元件卸載問題
  - 方法一 - 使用 gatsby-plugin-layout 插件
    - 安裝
    - 如何使用
  - 方法二 - gatsby-browser.js 中配置
- 建立 component 帶入 children 參數
- 引用 component 並加入內容傳遞給該 component

## 為何需要 Layout component

- Gatsby 建立 Layout component 使用 children
  - 為何需要 Layout component

在建立網站時，選用 Gatsby 這樣的框架能夠提高開發效率。Gatsby 基於 React 技術，支持各種前端元件。隨著專案檔案增多，為了方便維持頁面的一致性和可維護性，我們可以建立一個 Layout component

Layout component 讓開發者能夠定義一個共用的界面框架，包括 Header、Navbar 和 Footer。這保證了使用者無論訪問網站的哪一部分，都能獲得一致的體驗。同時，使用 Layout 還能提升程式碼的重用率和專案的可維護性，減少了在每一個頁面重寫佈局程式碼的需求。

本文將深入探討在 Gatsby 專案中如何有效地運用 Layout component。我們將從基礎設置、定義 Layout 開始，再到如何在頁面裡實際應用，逐步展示利用 Layout 如何能夠提高網站的整體品質。

## 建立資料夾結構

首先先建立如下的資料夾結構

```bash
├─components
│      Footer.js
│      Layout.js
│      Navbar.js
│
├─images
│      icon.png
│
└─pages
        404.js
        about.js
        index.js
        test.js
```

- `components`資料夾包含了重用的 UI 元件，如`Layout.js`、`Navbar.js`和`Footer.js`。這些元件可以在多個頁面間使用，以確保界面一致性和程式碼的高效重用。
- `images`資料夾用於存放網站使用的圖片資源，如標誌和背景圖片等。
- `pages`資料夾包含了網站的各個頁面，每個文件對應一個路徑。Gatsby 會自動將這些 JavaScript 文件轉換為網站的頁面。

## 建立 Layout component

Layout component 的主要作用是提供一個共用的框架，讓每個頁面都能嵌入其中，從而保持頁面的一致性和整潔性。在`Layout.js`中定義 Layout component 時，使用了 React 的`{children}`特性來插入子元件。這樣任何被`<Layout>`和`</Layout>`包裹的內容都會被當做子元件渲染在指定的位置。

```javascript
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({children}) => {
  return (
    <>
      <Navbar /> //先前有預先建立一個 Navbar component
      {children}
      <Footer /> //先前有預先建立一個 Navbar component
    </>
  );
};

export default Layout;
```

## 使用 Layout component

當 Layout component 準備好後，就可以在頁面中使用它了。例如在`index.js`中，你可以這樣使用 Layout 來包裹頁面內容：

```javascript
import React from 'react';
import Layout from '../components/Layout';

const IndexPage = () => {
  return (
    <Layout>
      這是首頁的內容
    </Layout>
  );
};

export default IndexPage;
```

透過這種方式，`index.js`頁面的內容會被插入到 Layout 的`{children}`位置。這樣，無論新增多少頁面，只要用 Layout 包裹，就能自動繼承 Header 和 Footer 的共用佈局，大大節省了重復佈局的工作量。

## Unmount 問題

Gatsby 預設並不會自動將頁面包裹在 Layout component 中。這意味著當從一個頁面切換到另一個頁面時，由於"Top level" Component 發生變化，React 會重新渲染所有子元件。這會導致像導航欄這樣的共用元件被卸載（unmount）和重新掛載（remount），從而破壞了 CSS 過渡效果或者這些元件內的 React 狀態。

## 解決元件卸載問題

為了防止在頁面變化時 Layout component 被卸載，我們可以專注於兩種主要的實現方式：使用`gatsby-plugin-layout`插件和直接在`gatsby-browser.js`文件中配置。
在 Gatsby 專案資料夾中避免 Layout component 在頁面切換時卸載，主要有兩種方法：使用`gatsby-plugin-layout`插件和在`gatsby-browser.js`中手動配置。

## 方法一 - 使用 gatsby-plugin-layout 插件

`gatsby-plugin-layout`插件自動實現`wrapPageElement` API，使得 Layout component 在頁面間切換時不會卸載。使用此插件可以簡化設置過程。

當使用`gatsby-plugin-layout`插件時，目的是讓 Layout component 在 Gatsby 專案資料夾的頁面間切換時不被卸載。這樣做有助於保持應用的狀態和避免重新加載共用元件。以下是如何安裝和配置這個插件的步驀：

### 安裝

首先，需要安裝插件到你的專案資料夾中：

```bash
npm install gatsby-plugin-layout
```

### 如何使用

安裝後，將這個插件加入到你的`gatsby-config.js`配置文件中。預設情況下，這個插件會尋找位於`src/layouts/index.js`的 Layout component

```javascript
module.exports = {
  plugins: [`gatsby-plugin-layout`],
}
```

如果你的 Layout component 位於專案資料夾的其他位置，可以使用`component`選項指定其位置：

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./relative/path/to/layout/component`),
      },
    },
  ],
}
```

加入此插件後則無需手動將頁面用 Layout component 包裹。插件會自動完成這一操作，讓你的每個頁面都被 Layout 所包裹，從而實現全站統一的佈局，並且在頁面之間切換時保持 Layout component 的持久化。

通過這種方式，提高了使用者體驗，因為共用元件，如導航欄，不會因為頁面切換而 remount。

## 方法二 - gatsby-browser.js 中配置

另一種方法是直接在`gatsby-browser.js`中使用`wrapPageElement` API 來保持 Layout component 的持久化。這提供了更多控制權。

在專案資料夾根目錄下建立`gatsby-browser.js`，並且加入以下程式碼：

```javascript
const React = require("react");
const Layout = require("./src/components/Layout").default; // 確保路徑匹配

exports.wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
```

如此一來就可以讓 Gatsby 在每個頁面外自動包裹 Layout component，實現全局佈局且在頁面切換時不重新掛載。

##### 參考資料

- [Layout 官方文件](https://www.gatsbyjs.com/docs/how-to/routing/layout-components/)
- [gatsby-plugin-layout](https://www.gatsbyjs.com/plugins/gatsby-plugin-layout/)