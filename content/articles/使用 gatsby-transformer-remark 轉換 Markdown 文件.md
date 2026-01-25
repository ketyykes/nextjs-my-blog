---
title: Gatsby - 使用 gatsby-transformer-remark 轉換 Markdown 文件
slug: 2022-03-01T14:21:00.000Z
date: 2022-03-01T14:21:00.000Z
tags: ["Gatsby.js","React"]
---

## 介紹 gatsby-transformer-remark

在使用 `gatsby-source-filesystem` 插件讓 Gatsby 知道要讀取哪些目錄下的文件後。

我們還需要使用 `gatsby-transformer-remark` 這個插件，將 Markdown (.md) 文件轉換為可供 GraphQL 查詢的資料節點 (nodes)。

## 安裝 gatsby-transformer-remark

首先使用以下指令安裝 `gatsby-transformer-remark`:

```bash
npm install gatsby-transformer-remark
```

## 配置 gatsby-config.js

在 `gatsby-config.js` 中的 `plugins` 陣列內新增 `gatsby-transformer-remark`:

```javascript
module.exports = {
  plugins: [
    // 其他插件...
    `gatsby-transformer-remark`，
  ],
}
```

## 準備測試用 Markdown 文件

假設我們的項目目錄結構如下，在 `src/pages/markdown-article/` 目錄下有一個 `test.md` 文件：

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

`test.md` 文件的內容如下：

```html
---
title: 這是我第二個標題
stack: 這是我第二個副標  
slug: MySecondSlug
ImageHD: ../hdImages/bear.jpg
---

# 這個是我的第二冊是檔案

**lorem loremloremloremloremloremloremloremloremlorem**，QQ

<p>test</p>

<b>kkkk</b>
```

上面的內容包含了一些 Markdown 語法和 HTML 語法，同時在文件開頭使用了 FrontMatter 設定了一些元數據。

## 使用 GraphQL 查詢轉換後的資料

接下來我們可以在瀏覽器中開啟 `http://localhost:8000/___graphql` 進入 GraphQL 操作 playground，輸入以下查詢：

```graphql
query {
  allMarkdownRemark {
    nodes {
      html
      frontmatter {
        slug
        stack
        title
      }
    }
  }
}
```

執行後可以看到查詢結果如下：

```json
{
  "data": {
    "allMarkdownRemark": {
      "nodes": [
        {
          "html": "<h1>這個是我的第二冊是檔案</h1>\n<p><strong>lorem loremloremloremloremloremloremloremloremlorem</strong>，QQ</p>\n<p>test</p>\r\n<b>kkkk</b>",
          "frontmatter": {
            "slug": "MySecondSlug",
            "stack": "這是我第二個副標",
            "title": "這是我第二個標題"
          }
        }
      ]
    }
  }，
  "extensions": {}
}
```

查詢結果包含了 Markdown 文件的 HTML 內容以及我們在 FrontMatter 中設定的元數據。

## 在 React 組件中獲取資料

最後，我們可以在某個 React 組件中使用 `pageQuery` 的方式獲取上述查詢的資料

```jsx
import React from 'react'
import { graphql } from 'gatsby'

const MyPage = ({ data }) => {
  const { html, frontmatter } = data.allMarkdownRemark.nodes[0]
  const { slug, stack, title } = frontmatter

  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark {
      nodes {
        html
        frontmatter {
          slug
          stack
          title   
        }
      }
    }
  }
`

export default MyPage
```

需要注意的是由於安全性考量，React 不建議直接渲染 HTML 字串，因此我們使用 `dangerouslySetInnerHTML` 這個較不安全的方式注入 HTML。在 production 階段中需要特別小心，避免潛在的 XSS 攻擊風險。詳細內容可以觀看以下相關資源

## 相關資源

- [gatsby-transformer-remark 官方文件](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/)
- [React Doc - dangerouslySetInnerHTML](https://zh-hant.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)