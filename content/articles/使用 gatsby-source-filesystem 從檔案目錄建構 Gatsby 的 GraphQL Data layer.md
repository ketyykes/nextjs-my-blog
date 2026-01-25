---
title: 使用 gatsby-source-filesystem 從檔案目錄建構 Gatsby 的 GraphQL Data layer
slug: 2022-01-25T15:20:00.000Z
date: 2022-01-25T15:20:00.000Z
tags: ["Gatsby.js","React"]
---

## 介紹 gatsby-source-filesystem

此 plugin 讓 Gatsby 能夠讀取特定目錄下的文件資料並且建構成 GraphQL 的 Data layer。

本文介紹如何安裝及配置 `gatsby-source-filesystem` 這個 Source Plugin。

## 安裝 gatsby-source-filesystem

使用以下指令安裝 `gatsby-source-filesystem`：

```bash
npm install gatsby-source-filesystem
```

## 配置 gatsby-config.js

在 `gatsby-config.js` 中的 `plugins` 陣列內新增一個物件，用於配置 `gatsby-source-filesystem`。

```javascript
module.exports = {
  // ...
  plugins: [
    // ...
    {
      resolve: `gatsby-source-filesystem`，
      options: {
        name: `markdownArticle`， // 給這個實例一個獨一無二的名稱
        path: `${__dirname}/src/pages/markdown-article`， // 指定要讀取的目錄路徑
      }，
    }，
  ]，
};
```

`options` 物件中的 `name` 屬性為這個實例命名，之後可以透過該名稱在 GraphQL 查詢中過濾資料。`path` 屬性則指定要讀取的目錄路徑。

## 準備測試文件

在 `src/pages/markdown-article` 目錄下新增一個 `test.md` 文件。目前的目錄結構如下：

```bash
├─components
│ Banner.js
│ Footer.js
│ Header.js
│ Layout.js
│ Navbar.js
│
├─images
│ banner-night.jpg
│ icon.png
│
├─pages
│ │ 404.js
│ │ about.js
│ │ index.js
│ │ tech-page.js
│ │
│ └─markdown-article
│     test.md
│
└─styles
    banner.module.scss
    footer.module.scss
    global.scss
    layout.module.scss
    usage.module.scss
    _mixin.scss
```

## 使用 GraphQL 查詢資料

1. 在瀏覽器的網址列輸入 `http://localhost:8000/___graphql` 開啟 GraphQL 工具。
2. 執行以下查詢，可獲取該目錄下所有文件的相對路徑及相對目錄，包括剛新增的 `test.md`：

```graphql
query {
  allFile {
    nodes {
      relativePath
      relativeDirectory
    }
  }
}
```

查詢結果如下

```json
{
  "data": {
    "allFile": {
      "nodes": [
        {
          "relativePath": "test.md"，
          "relativeDirectory": ""
        }
      ]
    }
  }，
  "extensions": {}
}
```

## 使用 GraphQL filter 查詢資料

若要只獲取特定實例的文件資料，可使用 `filter` 進行過濾：

```graphql
query {
  allFile(filter: { sourceInstanceName: { eq: "markdownArticle" } }) {
    nodes {
      relativePath 
      relativeDirectory
    }
  }
}
```

上述查詢會只返回 `gatsby-source-filesystem` 實例名為 `markdownArticle` 的文件資料。

##### 參考資料

- [gatsby-source-filesystem 官方文件](https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/)
