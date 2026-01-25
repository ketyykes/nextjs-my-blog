---
title: Gatsby - 建立 siteMetadata 在頁面和元件中使用 一般 graphQL query 或 useStaticQuery
slug: 2022-01-27T12:00:00.000Z
date: 2022-01-27T12:00:00.000Z
tags: ["React","Gatsby.js"]
---

## 前言

在 Gatsby 中，我們可以使用 GraphQL 查詢來獲取網站的各種資料，例如網站標題、網址和描述等。這些資料可以存儲在 `gatsby-config.js` 檔案中的 `siteMetadata` 物件中。

我們可以在頁面或元件中執行 GraphQL 查詢，從 `siteMetadata` 獲取所需的資料。

本文將介紹如何在 Gatsby 中設置 `siteMetadata`，以及如何在頁面和元件中使用 GraphQL 查詢獲取這些資料。

## 建立站點資訊 (siteMetadata)

我們可以在 `gatsby-config.js` 這個檔案中設定站點的資料 (siteMetadata)，值得一提的地方是在使用 Query 時，需注意命名衝突的問題。如果有多個 Query，命名必須不相同。。

```javascript
module.exports = {
  siteMetadata: {
    title: `react-my-blog`,
    siteUrl: `https://www.yourdomain.tld`,
    description: `This is my first siteMetadata`
  },
  plugins: [
    `gatsby-plugin-sass`
  ]
}
```

## 使用 Gatsby 的 Playground GUI 進行 GraphQL 查詢

在執行 `npm run start` 後，我們可以打開 `http://localhost:8000/___graphql` 來使用 Gatsby 提供的 GUI 介面進行查詢資料。

![](https://i.imgur.com/ygJ1l5p.png)

我們嘗試點選 **site** → **siteMetadata** → **description**、**siteUrl**、**title**

中間的畫面應該會自動產生如下的語法

```graphql
query MyQuery {
  site {
    siteMetadata {
      description
      siteUrl
      title
    }
  }
}
```

之後點選上方的三角形**執行**按鈕，應該可以獲取資料

如下所示：

```javascript
{
  "data": {
    "site": {
      "siteMetadata": {
        "description": null,
        "siteUrl": "https://www.yourdomain.tld",
        "title": "react-my-blog"
      }
    }
  },
  "extensions": {}
}
```

## 在某個頁面查詢

我們可以將剛剛使用的查詢語法加入到任何一個頁面的 JavaScript 檔案中，並增加以下語法。剛剛命名為 `MyQuery` 的查詢可以更換成 `SiteQuery`或者使用自己想要的名稱。

```javascript
export const query = graphql`
  query SiteQuery {
    site {
      siteMetadata {
        description
        siteUrl
        title
      }
    }
  }
`
```

首先我們需要從 Gatsby 引入 `graphql` 並解構出來：

```javascript
import { graphql } from 'gatsby'
```

然後，在頁面元件中，我們可以解構出從 `data` prop 傳入的資料：

```javascript
const IndexPage = ({ data }) => {
  console.log(data);
  const { title, description } = data.site.siteMetadata;

  return (
    <div>
      <p>{title}:{description}</p>
    </div>
  )
}
```

在 `http://localhost:8000/___graphql` 的 Playground 中，我們可以看到 `data` 物件的結構，因此我們可以像在 React 中解構 props 一樣，解構出所需的資料。

`console.log(data)` 應該會輸出類似下圖的結果：

![](https://i.imgur.com/bCgdtdk.png)

## 完整程式碼

```javascript
import React from 'react'
import { graphql } from 'gatsby'

const IndexPage = ({ data }) => {
  console.log(data);
  const { title, description } = data.site.siteMetadata;

  return (
    <div>
      <p>{title}:{description}</p>
    </div>
  )
}

export default IndexPage

export const query = graphql`
  query MyQuery {
    site {
      siteMetadata {
        description
        siteUrl
        title
      }
    }
  }
`
```

## Gatsby - 在元件內加入 GraphQL 查詢 - Static Query (useStaticQuery)

靜態查詢 (Static Query) 是指使用 `useStaticQuery` hook 在元件內部執行 GraphQL 查詢的方式。

這種查詢方式會在建置時期執行，而非在瀏覽器中執行。

## 使用 useStaticQuery

根據 Gatsby 官方文件的說明，如果需要在元件內部加入 GraphQL 查詢，就必須使用 `useStaticQuery` 這個函式。

由於一個檔案只能有一個 GraphQL 查詢，因此如果需要多個欄位，必須將它們全部加入到一個查詢中。

官方說明如下：

> 注意：你只能在一個檔案中呼叫一次 `useStaticQuery`。如果你需要多個欄位，你可以將它們全部加入到一個單一的查詢中。例如如果你需要從 `site` 欄位和 `siteBuildMetadata` 欄位獲取資料，你可以進行如下的 `useStaticQuery` 呼叫：

在元件中的具體用法如下：

```javascript
import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          description
          title
        }
      }
    }
  `)

  // 使用 useStaticQuery 函式內部加入 GraphQL 查詢語法
  // 可以不用帶入查詢函式，直接使用物件包裹要查詢的 GraphQL 內容就好
  // 如期可以得到查詢後的 data

  console.log(data);

  return (
    <header className="container-xxl">
      <Banner />
      {children}
      <Footer />
    </header>
  )
}

export default Layout
```

在上述範例中，我們在 `Layout` 元件內使用 `useStaticQuery` hook，傳入一個 `graphql` 標記函式，其中包含我們要執行的 GraphQL 查詢。查詢的結果將被存儲在 `data` 變數中，我們可以在元件中使用這些資料。

需要注意的是，每個檔案只能呼叫一次 `useStaticQuery`。如果需要多個欄位，必須將它們全部加入到同一個查詢中。

## 相關資源

- [Gatsby 官方文件 - useStaticQuery](https://www.gatsbyjs.com/docs/tutorial/part-4/#task-use-usestaticquery-to-pull-the-site-title-into-the-layout-component)
- [Gatsby 官方文件 - Querying Data in Pages with GraphQL](https://www.gatsbyjs.com/docs/how-to/querying-data/page-query/)