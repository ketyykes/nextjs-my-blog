---
title: 從安裝webpack理解react與react-dom(without JSX)
slug: 2022-10-01T13:31:00.000Z
date: 2022-10-01T13:31:00.000Z
tags: ["React","Webpack"]
---

本文章將安裝webpack和react library，實現一個最簡單的react App(不使用JSX)，從中間接解釋安裝的library背後所做的事情，每個標題將後會有安裝指令和一些解釋。

從這篇文章
你可以初步了解以下內容
- 原生DOM
- react library做了什麼
- react-dom library做了什麼
- 使用最少的webpack設定打包react App(不用JSX)

## 建置資料夾

在開始前我們不免透過npm來安裝react，透過前幾天的範例首先記得`npm init -y`來開始一個project，並且建立src資料夾與內容如下圖

![](https://i.imgur.com/tVawFBd.png)

## react library

`npm install react` 

### 什麼是DOM

瀏覽器藉由HTML的標記語言建立了**DOM**(Document Object Model)文件物件模型，也就是當瀏覽器在讀取HTML元素的時候，就會被解析成DOM元素。
一個網頁是一個文件(document)，他可以被瀏覽器視窗顯示或是做為Html原始碼顯示
例如
以下Html原始碼
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Hello world</h1>
  </body>
</html>

```
在下圖就是被瀏覽器視窗給顯示
![](https://i.imgur.com/uTE4vSD.png)

當我們點選滑鼠右鍵的時候，檢視原始碼
![](https://i.imgur.com/r09c0Nh.png)

此時所看到的內容如下圖
![](https://i.imgur.com/m0ARfdY.png)

對比這兩張圖指的是同一個文件(document)

文件物件模型(document object model)提供了一個接口使我們像物件導向一般表示網頁，透過程式語言存取和修改以改變最後呈現的網頁畫面。

[https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)

![](https://i.imgur.com/lKuffJs.png)
[維基百科-文件物件模型](https://zh.wikipedia.org/zh-tw/%E6%96%87%E6%A1%A3%E5%AF%B9%E8%B1%A1%E6%A8%A1%E5%9E%8B)


### DOM API
[DOM API](https://developer.mozilla.org/zh-TW/docs/Web/API/Document_Object_Model)是一系列使Javascript可以操控DOM。也許你曾經使用過`document.querrySelector`或是`document.createElement`，這些都隸屬於Web API，由於實際操控DOM是非常耗效能。

### 所以React做了什麼

我們透過React函式庫來建構React的h1元素，另外也透過React提供的[Virtual DOM](https://reactjs.org/docs/faq-internals.html#gatsby-focus-wrapper)技術將其保存在記憶體中，再重新渲染前會經由React透過[他們的Diff演算法](https://reactjs.org/docs/reconciliation.html#the-diffing-algorithm)快速計算渲染前後差異。實際上我們是在撰寫React元素，透過React操縱虛擬DOM，來實作最後UI該如何呈現，這裡也就呼應官方網站標題下的小字，用來**實作使用者介面的UI的Javascript函式庫**。


上個段落主要講述了我們需要React的其中一項原因—打造高效能的[單頁式網站](https://zh.wikipedia.org/zh-tw/%E5%8D%95%E9%A1%B5%E5%BA%94%E7%94%A8)，因此我們將在App.js檔案撰寫內容，透過createElement來建立React的元素
程式碼如下

```javascript
import React from "react";
const App = () => {
  return React.createElement("h1", {}, "我是H1");
  //第一個參數是tag名稱，第二個是prop、第三個是內容
};
```

我們可以嘗試著console.log這個元素會看到如下圖

![](https://i.imgur.com/5zGFosP.png)

而上圖元素就是React的元素。

## React DOM

`npm install react-dom`

上一部分講述了React library，我們實際要呈現在瀏覽器當中則需要**ReactDOM**的函式庫的幫助，它包含了讓**React元素**實際渲染至瀏覽器的工具，也就是**具體操作DOM的方法**。

換個方式解釋**React DOM**是什麼，如果你有使用React撰寫非web的應用程式(例如**React Native**用來打造mobile Application)，你就不需要安裝**react-DOM**，React產生了React元素後，他們就只是沒有被實際掛載前都只是一群Javascript物件的程式碼或稱為**Host tree**(備註)，透過**react-dom**將這些程式碼與瀏覽器的DOM綁定或稱為**Host Instance**，換言之如果在Mobile的**Host Instance**就是例如像是Android、iOS等等。

> 備註：推薦觀看知名react第三方工具庫—redux的作者的文章[React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)，可以更加理解react與一些原理。

### index.js的程式碼

程式碼部分通常也會將React.DOM使用在App最上層的地方

這邊建立了一個`index.js`檔案
如下
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));
//函式內填入實際綁定的DOM元素並透過ReactDOM的render函式渲染到畫面上
root.render(React.createElement(App, null, null));
```

## webpack

`npm webpack webpack-cli`

由於最後我們需要將所寫的程式碼和react的函式庫打包，因此安裝webpack和webpack-cli，如果對於webpack概念不熟悉的可以參考[從編譯Sass實作來理解webpack前端自動化打包工具](/tech-page/2022-09-28%20Wed)

### webpack設定檔
webpack.config.js的設定檔如下

```javascript
const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
};
```

### package.json設定檔
package.json
```javascript
{
  "name": "你的專案名稱",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build":"webpack"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "react": "^18.1.0",
    "react-dom": "^18.1.0"
  },
  "devDependencies": {
    "webpack": "^5.72.1",
    "webpack-cli": "^4.9.2"
  }
}

```

最後在`dist`資料夾建立一個`index.html`如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./bundle.js"></script>
  </body>
</html>
```

我們輸入`npm run build`再開啟網頁就能看到最後結果了。

![](https://i.imgur.com/jGryl9S.png)

## 小結

本日實作了最基本從webpack開始建置react從中介紹react與react-dom的一些細節，希望藉由此篇文章對大家理解react上面有些幫助。

##### 參考資料

- [Why Use React? – Top 8 Reasons Experts Use React in 2022](https://www.monocubed.com/blog/why-use-react/)
- [10 Key Reasons Why You Should Use React for Web Development](https://www.techmagic.co/blog/why-we-use-react-js-in-the-development/)
- [MDN—Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction#what_is_the_dom)
- [React as a UI Runtime](https://overreacted.io/zh-hans/react-as-a-ui-runtime/)