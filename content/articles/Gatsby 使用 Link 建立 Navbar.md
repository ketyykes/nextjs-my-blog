---
title: Gatsby 使用 Link 建立 Navbar - LinkAPI 補充
slug: 2022-01-18T14:21:00.000Z
date: 2022-01-18T14:21:00.000Z
tags: ["Gatsby.js","React"]
---

這篇文章將指導如何在 Gatsby 項目中使用 `Link` 組件來建立一個 Navbar 導航欄。

內容包含以下

## 建立 Navbar component

首先，在 `src` 目錄下建立一個 `components` 文件夾，用於存放自定義 component。接著在此資料夾中建立一個 `Navbar.js` 文件，程式碼如下所示：

```javascript
import React from 'react';
import { Link } from "gatsby";

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">首頁</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/test">Test</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
```

`Link` component 用於替換 `<a>` 標籤，實現 No refresh 的導航。

## 專案資料夾結構

要使 Navbar component 正常工作，必須建立相對應的頁面。專案資料夾的目錄結構應如下：

```javascript
src/
├─ components/
│   └─ Navbar.js
├─ images/
│   └─ icon.png
└─ pages/
    ├─ 404.js
    ├─ about.js
    ├─ index.js
    └─ test.js
```

Gatsby 通過 `pages` 資料夾下的 JavaScript 文件自建立建頁面和配置路由。文件名決定路由的路徑。例如，`index.js` 轉換為首頁，`about.js` 對應 "關於我們" 頁面。

## 引入 Navbar component

在專案資料夾的 `src/pages/index.js` 中引入 `Navbar` component，確保 Navbar 在首頁上顯示：

```javascript
import React from 'react';
import Navbar from '../components/Navbar';

const IndexPage = () => {
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default IndexPage;
```

到目前為止 npm run start 執行專案資料夾後，將看到一個包含三個連結的導航欄。點擊這些連結將不會導致頁面重新加載，而是直接導航到目標頁面。

## `<Link>` 補充 API

Gatsby 的 `<Link>` component 除了 Reach Router 支援的 `to`、`replace`、`ref`、`innerRef`、`getProps` 和 `state` 屬性外，增加了如下屬性：

- `activeStyle`: 當連結活躍時應用的 CSS 樣式對象。
- `activeClassName`: 當連結活躍時應用的 CSS 類名。
- `partiallyActive`: 用於設定部分 URL 是否視為活躍狀態。

範例程式碼如下

```javascript
<Link to="/about" activeClassName="active">About</Link>
<Link to="/company" activeStyle={{ color: "blue" }}>Company</Link>
<Link to="/blog" activeStyle={{ color: "green" }} partiallyActive={true}>Blog</Link>
```

##### 參考資料

[Gatsby Link API](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-link/)