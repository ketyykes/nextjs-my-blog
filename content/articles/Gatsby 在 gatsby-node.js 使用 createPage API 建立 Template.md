---
title: Gatsby 在 gatsby-node.js 使用 createPage API 建立 Template
slug: 2022-01-20T14:26:00.000Z
date: 2022-01-20T14:26:00.000Z
tags: ["React","Gatsby.js"]
---

## Gatsby 產生頁面方式 - createPages 介紹

之前生成頁面的方式都是直接在 `src/pages` 資料夾下撰寫 React 頁面元件。根據 Gatsby 官方文件，有三種方式可以產生頁面：

1. 在 `src/pages` 目錄下建立 React 元件。(注意必須將元件設為預設匯出)
2. 使用檔案系統路由 API 以程式化的方式從 GraphQL 建立頁面，並建立純用戶端路由。
3. 在站點的 `gatsby-node.js` 檔案中，實作 `createPages` API。(外掛也可以實作 `createPages` 並為你建立頁面)

本文將討論第三種方式，即透過建立 Template 並根據 Markdown 檔案產生 HTML 頁面。

## 建立 Template

首先在 `src` 目錄下建立一個 `templates` 資料夾，並在其中建立一個 Template React 元件檔案，例如 `article-template.js`。

```
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
│     fakeData copy 10.md
│     fakeData copy 2.md
│     ...
│
├─styles
│ article-template.module.scss
│ banner.module.scss
│ footer.module.scss
│ global.scss
│ layout.module.scss
│ usage.module.scss
│ _mixin.scss
│
└─templates
    article-template.js
```

## 建立 gatsby-node.js 檔案

接下來，在整個專案的根目錄下建立 `gatsby-node.js` 檔案。`gatsby-node.js` 是在建置時期利用 JavaScript 為你產生網站或頁面模板的設定檔。


如下圖

![](https://i.imgur.com/N5faef4.png)

在 `gatsby-node.js` 中我們將使用 `createPages` API 動態建立頁面。

## 使用 createPages API

```javascript
const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
  const { data } = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          html
          id
          frontmatter {
            title
            stack
            slug
          }
        }
      }
    }
  `);

   console.log(data);
  //在這裡撰寫 console.log(data)
  //可以在 npm run start 建立時期看到 log 訊息。
  
  data.allMarkdownRemark.nodes.forEach(node => {
    actions.createPage({
      path: '/tech-page/' + node.id, // 動態產生的網址，必須注意前面要有斜線
      component: path.resolve("./src/templates/article-template.js"), // 選用的模板
      context: { id: node.id } // 傳遞給模板元件的資料
      ////在組件的地方接收參數的 props 則可以透過 pageContext 得到該內容
    });
  });
};
```

在上述程式碼中，我們先使用 GraphQL 查詢獲取所有 Markdown 檔案的資料，然後利用 `actions.createPage` 根據每個檔案動態產生一個頁面，並指定使用我們之前建立的 `article-template.js` 作為模板，同時將檔案 ID 傳遞給模板元件。

## 在 Template 中獲取資料

最後，我們可以在 `article-template.js` 中解構從 `gatsby-node.js` 傳遞過來的資料，並使用 GraphQL 查詢獲取相關的 Markdown 內容。

程式碼如下
```jsx
import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import * as styles from "../styles/article-template.module.scss";

const ArticleTemplate = ({ data, pageContext }) => {
  const { articleContent } = styles;
  const { html, frontmatter } = data.markdownRemark;
  const { title, stack } = frontmatter;

  return (
    <Layout>
      <div className={articleContent}>
        <h2>{title}</h2>
        <h3>{stack}</h3>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Layout>
  )
}

export default ArticleTemplate;

export const query = graphql`
  query($id: String) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        stack
      }
    }
  }
`
```

在上述程式碼中，我們從 `pageContext` 解構出之前傳遞的 `id`，並在 `pageQuery` 中使用該 `id` 查詢對應的 Markdown 內容。然後在元件中渲染相關的標題、副標題和 HTML 內容。

需要注意的是，由於安全性考量，React 不建議直接渲染 HTML 字串，因此我們使用 `dangerouslySetInnerHTML` 這個較不安全的方式注入 HTML。在生產環境中需要特別小心，避免潛在的 XSS 攻擊風險。

## 相關資源

- [Gatsby 官方文件 - Creating and Modifying Pages](https://www.gatsbyjs.com/docs/creating-and-modifying-pages/)
- [Gatsby 官方文件 - createPages API](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/#createPages)
- [Egghead.io 影片 - Create a Gatsby Page Without Any Data](https://egghead.io/lessons/gatsby-create-a-gatsby-page-without-any-data)