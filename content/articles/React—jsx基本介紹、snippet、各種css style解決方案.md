---
title: React—jsx基本介紹、snippet、各種css style解決方案
slug: 2022-10-15T13:31:00.000Z
date: 2022-10-15T13:31:00.000Z
tags: ["React"]
---

<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.red {
color:red;
}
.gray{
background-color:#d3d3d3;
}
</style>
## 基本jsx

首先我可以看到一個簡單的jsx如下
```javascript
import React from 'react'
const App = () => {
  return (
    <div>App</div>
  )
}
export default App
```

而整個函式就稱為**function component**

值得注意的地方是函式必須是以<span class="red">大寫</span>開頭也是避免被誤認為原生的<span class="red">web-component</span>

因此function名稱不允許是小寫a開頭例如命名叫做app。

## 在jsx當中撰寫程式碼

如果我們想要將變數加入到jsx中就以大括號表示，在jsx的語法當中，我們要撰寫表達式。

```javascript
import React from 'react'
const App = () => {
  const name = "小明"
  return (
    <div>{name}</div>
  )
}
export default App
```

## 渲染list

如果我們想要渲染陣列裡面的資料可以使用map的方式，由於jsx需要表達式，因此在array method的map回傳一個陣列，而陣列內容可以是一個jsx。
例如以下程式碼

```jsx
import React  from "react";
import "./styles/css/style.css";
let friends = ["Tom","Mary","Harry"];
const App=()=>{
  return(
    <div className="main">
      <h1 >這是標題</h1>
      <p>我的朋友有</p>
      {
        friends.map((friends)=>(<p>{friends}</p>))
      }
    </div>
  )  
}
export default App;
```

需要注意的方式我們必須撰寫一個key否則會跳出警告如下

![keyWaring](https://i.imgur.com/sImZg4m.png)

因此我們只需要加入key就能解除這個警告了，需要注意的是key必須是唯一的，通常會使用UUID的方式，當沒有UUID的時候可以使用index，但可能會有一些其他的問題，可以參考官方文件解釋。

官方解釋
> 我們並不建議你使用索引作為 key，尤其如果項目的順序會改變的話。這會對效能產生不好的影響，也可能會讓 component state 產生問題。請參考 Robin Pokorny 這篇深入剖析使用索引作為 key 的負面效應ㄧ文。如果你選擇不明確分配 key 到列表項目時，React 預設將會使用索引作為 key。

```jsx
import React  from "react";
import "./styles/css/style.css";
let friends = ["Tom","Mary","Harry"];
const App=()=>{
  return(
    <div className="main">
      <h1 >這是標題</h1>
      <p>我的朋友有</p>
      {
        friends.map((friends,index)=>(<p key={index}>{friends}</p>))
      }
    </div>
  )  
}
export default App;
```

## self close tag

我們在引入<span class="red">component</span>，如果<span class="red">open tag</span>和<span class="red">close tage</span>中間沒有要放東西。例如<span class="red">&lt;App&gt;&lt;/App&gt;</span>的話，可以使用self close tag的方式，換句話說和以往一些html標籤一樣，例如<span class="red">&lt;img /&gt;</span>或<span class="red">&lt;br/&gt;</span>，只不過這樣撰寫方式在html已經改成非強制了。

自我結束標籤的寫法範例如
<span class="red">&lt;App/&gt;</span>

**小於** **名字** **空格** **斜線** **大於** 

### 知識小補充

> 這些原本html的self close tag他們也被稱之為空的元素void element，更多標籤可以參考以下網站
> [List of HTML Self-Closing Tags](http://xahlee.info/js/html5_non-closing_tag.html)

## 撰寫component的snippet的套件

ES7 React/Redux/GraphQL/React-Native snippet是一個vscode的擴充套件

當我們建立一個檔案例如叫做<span class="red">Nav.jsx</span>的時候，透過這個snippet的套件就能馬上建立一些內容。使用步驟如下

### Step.1 到vs code下載套件

首先到vs code extension搜尋以下名稱

![ReactSnippetExtension](https://i.imgur.com/6roUvK6.png)

### Step.2 建立檔案

建立一個名為Nav.jsx的檔案
![Nav圖片](https://i.imgur.com/fLKdj3P.png)

### Step.3 輸入snippet

輸入<span class="red">rafce</span>然後<span class="red">tab</span>就會產出如下的提示

![rafce](https://i.imgur.com/ZeFJLus.png)

```javascript
import React from 'react'
const Nav = () => {
  return (
    <div>
    </div>
  )
}
export default Nav
```

## 套件提示

另外在撰寫react的時候，vs code右下角可以更改語言，可以改成react

![reactVsCode](https://i.imgur.com/zyZqt4C.png)

可以選擇為.js設定檔案關聯，vs code的語法提示也可能會變得比較精準

![選擇關聯vsCodeLang](https://i.imgur.com/QX76MYL.png)

## 在react撰寫css

在React中可以使用許多種css的方式以下介紹幾種常見的方式。

### 行內樣式

使用inline style的方式，也就是在element撰寫style的屬性，然後內容是一個物件，由於js的object的key名稱不允許中間有<span class="red">-</span>所以像是<span class="red">font-size</span>就要改以駝峰式命名法的方式代替其key，例如fontSize

```javascript
import React from "react";
let friends = ["Tom","Mary","Harry"];
const App=()=>{
  return(
    <div>
      <h1 style={{color: 'red',fontSize:'4rem'}}>這是標題</h1>
      <p>我的朋友有</p>
      {
        friends.map((friends,index)=>(<p key={index}>{friends}</p>))
      }
    </div>
  )  
}
export default App;
 
```

我們理解外面的大括號是要撰寫js的表達式，裡面的大括號表示是css各種style組合成的物件，另外style屬性的值是字串。

### CSS-in-JS

我們以平常在寫原本css的寫法撰寫一個css檔案，之後在jsx直接引入檔案。

```jsx
import React  from "react";
import "./styles/css/style.css";
let friends = ["Tom","Mary","Harry"];
const App=()=>{
  return(
    <div className="main">
      <h1 >這是標題</h1>
      <p>我的朋友有</p>
      {
        friends.map((friends,index)=>(<p key={index}>{friends}</p>))
      }
    </div>
  )  
}
export default App;
```

### CSSmodule

我們也可以使用CSS module，原理是通過webpack的幫助會幫我們編譯成class名稱+hash值以達到css的class並不會重複的情況。

首先建立一個app.module.css檔案

使用原本的方式撰寫css例如

```css
.font {
  color: #f00;
  font-size: 20px;
}
```

引入該模塊後，然後使用物件屬性存取的方式加入到className

```jsx
import React  from "react";
import styles from "./styles.module.css";
let friends = ["Tom","Mary","Harry"];
const App=()=>{
  return(
    <div className={styles.font}>
      <h1 >這是標題</h1>
      <p>我的朋友有</p>
      {
        friends.map((friends)=>(<p>{friends}</p>))
      }
    </div>
  )  
}
export default App;
```

### 使用CSS-in-JS函式庫

react當中也有專門在將CSS注入到JS中的函式庫，比較著名以styled component和emotion，以下用styled component的例子，這樣就會創造一個Hello的component，讓我們在用的時候就跟平常的component一樣。

```jsx
import { React } from "react";
import styled from "styled-components";
function App() {
  const Hello = styled.div`
    background-color: red;
  `;
  return <Hello />;
}
export default App;
```

##### 參考資料

- [React官方文件](https://zh-hant.reactjs.org/docs/introducing-jsx.html)
- [Different Ways to Write CSS in React](https://css-tricks.com/different-ways-to-write-css-in-react/)
