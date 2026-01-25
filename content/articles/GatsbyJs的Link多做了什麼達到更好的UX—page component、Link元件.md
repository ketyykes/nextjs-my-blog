---
title: GatsbyJs的Link多做了什麼達到更好的UX?—page component、Link元件
slug: 2022-12-14T11:30:00.000Z
date: 2022-12-14T11:30:00.000Z
tags: ["Gatsby.js","React"]
---

本文提及以下內容

- Gatsby建立頁面檔
- 添加頁面Title
- Link元件預載preloading原理
- Link Component使用方式

## GatsbyJs建立頁面檔

官方說明對於頁面檔的觀念如下

> Pages created in the src/pages directory use the name of the file as the route for the page.
> For example, if you had a file called src/pages/garden-gnomes.js, you could access that page at localhost:8000/garden-gnomes.

大致意思是頁面檔只要建立在`src/pages`的資料底下就能夠建立`pages component`。

接下來將會開始進入實作環節。

### 資料夾結構

我們建立了一個react的component，接下來再pages的資料夾**建立js檔案的時候**，**gatsby就會自動將其變成一個路由**

首先我們觀看以下的資料夾結構。

```bash
├─images
│      icon.png
│
└─pages
        404.js
        index.js
```

我們在此添加了一個hello.js
```bash
├─images
│      icon.png
│
└─pages
        404.js
++      hello.js
        index.js
```

### 建立hello.js檔案

在檔案裡面我們新增了一個函式如下

```jsx
import React from "react";

const hello = () => {
  return <div>Hello world</div>;
};

export default hello;
```

在此當我們`npm run start`的時候

在pages的頁面就能夠擁有hello的route

如下圖

![](https://i.imgur.com/hoVKpgc.png)

## 添加頁面title

我們在頁面檔底下添加一個Head的函式

透過在頁面檔export Head函式就能自動幫我們添加到實際頁面的`<head>`的地方

例如在hello.js頁面檔如下

```javascript
import React from "react";

const hello = () => {
  return <div>Hello world</div>;
};

export default hello;
export const Head = () => (
  <>
    <title>Hi</title>
    <meta name="description" content="Your description" />
  </>
);
```

這時候我們重新整理就能發現該內容被添加到了頁面標題

如下圖

![](https://i.imgur.com/ltqwQlX.png)

## 預載Link元件的原理

gatsby提供了`Link的component`來實作跳轉頁面

- 預先載入(proeloading)
  - 使用者需要跳轉頁面的時候能夠預先載入資源

以下方為兩個階段

1. 使用`Intersection Observer API`低優先級預先載入
    - Link component進入到使用者的viewport，他會開始以低優先權的方式索取該頁面的資源檔
2. `onMouseOver event事件`轉為高優先級載入更新
    -  onMouseOver event滑入Link時候將會轉為高優先級載入更新資源。

上述兩個預載入階段的實現是確保在點擊跳轉頁面的時候能夠更迅速的準備好render。

使用Gatsby與先前提到[React route如何運作、建立404的路由、巢狀路由、動態路由](https://ithelp.ithome.com.tw/articles/10306082)的react route不一樣的地方是他幫我們多加處理了預載入以至於當我們在使用gatsby可以達到更好的UX。

## Link Component使用方式

我們透過從gatsby引入Link然後添加在頁面上，

如下程式碼藉由Link component的方式，我們就能夠跳轉到某個路由了。

```javascript
import React from "react";
import { Link } from "gatsby";
const hello = () => {
  return (
    <>
      <div>
        Hello ,回到我的頁面吧<Link to="/">我的頁面</Link>!
      </div>
    </>
  );
};

export default hello;
export const Head = () => (
  <>
    <title>Hi</title>
    <meta name="description" content="Your description" />
  </>
);

```

最後應當能看到下圖

![](https://i.imgur.com/rZCO1D4.png)

##### 參考資料
- [Gatsby-Link API](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-link/)
- [Gatsby-Create a page component](https://www.gatsbyjs.com/docs/tutorial/part-2/)
