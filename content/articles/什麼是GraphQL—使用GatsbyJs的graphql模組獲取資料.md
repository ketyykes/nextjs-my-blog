---
title:  什麼是GraphQL—使用GatsbyJs的graphql模組獲取資料
slug: 2022-12-17T13:32:00.000Z
date: 2022-12-17T13:32:00.000Z
tags: ["Gatsby.js","React"]
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
background-color:#f7f7f7;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>

本文提及以下內容

- 什麼是GraphQL
- GatsbyJs中的GraphQL資料層組成
- 為什麼Gatsby使用GraphQL 
- 使用GraphiQL工具
- 使用graphql查詢頁面資料

## 什麼是GraphQL

`GraphQL`是一種查詢語言，比起REST，可以用來提升效能和靈活的獲取資料

優點：
- 靈活性
  - GraphQL可以根據client端定義的資料結果從server端拿取對應的資料
- 減少冗於資料
  - 從伺服器端回傳的資料皆為客戶端所請求的格式，相對於REST可能有些屬性並非客戶端需要的內容

例如希望得到文章ID、標題、留言日期等等

就能使用
```
{
    article {
        id
        title 
        contentTime
    }
}
```

集結成Graph ql 統一進行查詢，概念大致如下圖

![](https://i.imgur.com/C4StvId.png)

圖片來源：GraphQL官方網站

## GatsbyJs中的GraphQL資料層組成
GraphQL 組成方式為以下兩種

- GraphQL API 
  - 資料來自本身的檔案系統，例如project內的md檔、
  - 資料來自於CMS內容管理系統，例如airtable、contentful、wordpress等等
  - 自行建立schemas從不同的API

GatsbyJs將會透過這些檔案或者貼文來建立GraphQL API
GatsbyJs將其添加至內容網格中(content mesh)


## 為什麼Gatsby使用GraphQL

由於可能有些資料會在網站當中頻繁的使用，為了方便管理，可以將資料寫在`gatsby-config`、寫成某支檔案、例如txt,md之類的附檔名，藉由一些plugin讀取這些資料後放入GraphQL的資料層，最後透過GraphQL的Query語法查詢，從檔案的角度來看可以維持原本檔案的屬性例如txt、md等等的副檔名，從管理層面來看，所有的資料已經被分離在GraphQL資料層了。

## 使用GraphiQL工具

這是一個可以在開發時期造訪的網頁，也是當我們建置一個gatsbyJs專案的時候會時常使用到的網頁。

在我們npm run start的時候除了你所建置的gatsby網頁以外，將會有另一個網址<span class="code">http://localhost:8000/___graphql</span>

如下圖

![](https://i.imgur.com/MudrsMb.png)


我們造訪這個網頁的時候就會看到以下的圖，右邊有DOC按鈕，推薦可以觀看一下

透過左邊的Explorer介面就能添加查詢

按下三角形的時候就能執行查詢結果

下方的MyQuery的內容，在使用`useStaticQuery`或是`import { graphql } from "gatsby";`就透過該語法進入到gatsbyJs中，進行查詢得到資料。

![](https://i.imgur.com/6D2uj6c.png)


## 使用graphql查詢頁面資料

### 添加meta數據

我們在`gatsby-config.js`的檔案當中使用siteMetadata作為key帶入一個object，其title和description就做為稍後要載入的key

觀看以下程式碼

```javascript
module.exports = {
  siteMetadata: {
    title: `這是我的title`,
    description: "這是我的描述.",
  },
  plugins: [],
};
```

### 使用GraphiQL工具選擇對應的資料

npm run start後
<br>
進入<span class="code">http://localhost:8000/___graphql</span>頁面

在左側選擇site→siteMetadata→description和title

![](https://i.imgur.com/wwBiiEa.png)

按下上方三角形或快捷鍵`ctrl+Enter`就能得到如下圖的查詢結果了

如下圖
![](https://i.imgur.com/s4ARHB4.png)

### 從Gatsby引入

graphql這個模組可以讓頁面檔使用GraphQL

其原理是來自於Javascript的[tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)，有興趣者可以自行觀看。

需要注意的地方是`每個頁面檔案只能有一個頁面查詢(page query)`
首先從Gatsby引入graphql
`import { graphql } from 'gatsby'`

### 宣告自頁面檔案的下方

在元件下方`export`一個const的變數，變數名稱並不會影響Gatsby查詢，

變數等號右邊加入graphql \`這裡放入你要使用GraphQL查詢的內容\`

具體語法如下

```javascript
export const query = graphql`
  query hello {
    site {
      siteMetadata {
        description
        title
      }
    }
  }
`;
```

### 在頁面檔案接收prop為data的值

在頁面元件中使用`data`作為`prop`接收GraphQL查詢的結果

實際如下

```javascript
 const HomePage = ({data}) => {
   console.log(data);
  return (
    <div>
     Hello!
     {data.site.siteMetadata.description}
    </div>
  )
}
```

### 實際結果

接下來就可以使用如期拿到值了

如下圖

`console.log(data)`結果

![](https://i.imgur.com/F6glYWV.png)

頁面結果

![](https://i.imgur.com/EpT4xvt.png)

##### 參考資料
- [The Net Ninja](https://www.youtube.com/c/TheNetNinja)
- [GraphQL官方網站](https://graphql.org/)
- [Gatsby官方網站](https://www.gatsbyjs.com/)

