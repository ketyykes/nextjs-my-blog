---
title: 使用 Gatsby.js 的 graphQL 獲取文章資料並列出文章連結
slug: 2022-03-02T14:21:00.000Z
date: 2022-03-02T14:21:00.000Z
tags: ["Gatsby.js","React"]
---

## 使用 graphQL 查詢 Markdown 文件

為了在 Gatsby.js 中使用 graphQL 查詢 Markdown 文件的 Frontmatter 資料

例如標題、標籤等，我們需要進一步查詢該 Markdown 文件的 ID。
這個 ID 將用作 `map` 函式的 `key` 屬性值，因為 React 需要一個唯一的值作為 `key`。

要進行查詢，你可以在 `http://localhost:8000/___graphql` 的 GraphQL Playground 中輸入以下 graphQL 查詢語法：

```graphql
query listArticleQuery {
  allMarkdownRemark {
    nodes {
      frontmatter {
        slug
        stack
        title
      }
      id
    }
  }
}
```

這個查詢將返回所有 Markdown 文件的 Frontmatter 資料（如 `slug`、`stack` 和 `title`）以及對應的 `id`。

## 在頁面 component 中使用 Page Query 查詢資料

接下來，你需要在頁面 component 中使用 Page Query 來查詢上述的資料。首先，在 component 文件的頂部引入必要的模組：

```javascript
import React from 'react'
import Layout from '../components/Layout'
import {graphql} from 'gatsby'
```

然後，在 component 函式中，你可以從 `data` 參數中獲取查詢結果。你可以先將查詢結果輸出到控制台以進行 debug：

```javascript
const yourPage = ({data}) => {
  console.log(data.allMarkdownRemark.nodes);
  // 你的 JSX 代碼
}
```

最後，在 component 的底部，使用 `export const query = graphql` 語法來定義查詢語句：

```javascript
export const query = graphql`
  query listArticleQuery {
    allMarkdownRemark {
      nodes {
        frontmatter {
          slug
          stack
          title
        }
        id
      }
    }
  }
`
```

## 使用 Gatsby Link component 呈現文章連結

在 Gatsby.js 中，你可以使用內建的 `Link` component 來生成連結。與普通的 React 不同，Gatsby 為我們簡化了 `Link` 的使用方式。

首先，你需要從 `gatsby` 模組中引入 `Link`：

```javascript
import {graphql,Link} from 'gatsby'
```

然後你可以使用 `Array.map` 方法將查詢到的文章資料渲染為連結和標題。需要注意的地方是你需要為每個連結提供一個唯一的 `key` 屬性值，而文章的 `id` 正好可以作為這個唯一值。
另外`Link` component 的 `to` 屬性需要以斜線 `/` 開頭。

```jsx
import React from 'react'
import Layout from '../components/Layout'
import {graphql,Link} from 'gatsby'

const techPage = ({data}) => {
  console.log(data.allMarkdownRemark.nodes);
  const markdownArticle = data.allMarkdownRemark.nodes;

  return (
    <>
      <Layout>
        <div>
          {markdownArticle.map(article => (
            <Link to={"/article/" + article.id} key={article.id}>
              {/* 這裡連結一定要斜線然後接 article */}
              <div>
                <h3>{article.frontmatter.title}</h3>
                <p>{article.frontmatter.stack}</p>
              </div>
            </Link>
          ))}
        </div>
      </Layout>
    </>
  )
}

export default techPage;

export const query = graphql`
  query listArticleQuery {
    allMarkdownRemark {
      nodes {
        frontmatter {
          slug
          stack
          title
        }
        id
      }
    }
  }
`
```

在上面的程式碼中，`markdownArticle.map` 函式會遍歷每一篇文章，並使用 `Link` component 生成對應的連結。

每個連結的 `to` 屬性值為 `/article/` 加上該文章的 `id`，這樣可以避免出現相同命名的網址。連結的內容包含文章的標題（`frontmatter.title`）和標籤（`frontmatter.stack`）。

