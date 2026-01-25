---
title: vite建立react專案feat.vite.config scss、localsConvention、preprocessorOptions
slug: 2023-04-26T12:11:00.000Z
date: 2023-04-26T12:11:00.000Z
tags: ["React","Vite"]
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

## 不再使用Create React App？

本文提及以下內容
- 不再使用Create React App
- 如何選擇建立React Application in 2023
- 開始建立vite專案
- 使用CSS module
- 經過hash的css class名稱
- 使用駝峰式引用含有dash的css Class 名稱
- 在vite中使用SCSS
- 使用scss module
- 全域共用變數載入至jsx或scss module


目前React官方網站的 Start a New React Project 章節的安裝方式圍繞在SSR或SSG的框架，若單純想建立SPA的話在2023年的今天，傾向使用其他Framework，至於原因可以參考[Create React App Alternatives in 2023](https://blog.javascripttoday.com/blog/create-react-app-alternatives/)一文提到幾點

1. 緩慢的開發體驗
2. 對於市面上受歡迎的工具難以設定
3. 有更好的選擇

對於相關議題有興趣的也可以觀看[Create React App is Dead?](https://dev.to/thevinitgupta/create-react-app-is-dead-3igo)

## 如何選擇建立React Application in 2023

至於目前React.dev官方網站建立React的方式大多數是SSR(server site render)或SSG(server side generator)的Framework，例如Gatsby.js、Next.js、Remix等等。

對於剛初學React的人在使用學習這些框架的同時可能會包含一些非React相關的東西在該框架當中，因此若只是想單純學習React的人也許就會無法分辨哪些是屬於React，哪些則是屬於該框架，目前社群或者知名Youtuber Kyle在[The React Docs Are Wrong (If You Are Trying To Learn React)](https://www.youtube.com/watch?v=KCEVIY0Z3xY&t=222s&ab_channel=WebDevSimplified)的影片中則是推薦使用Vite作為學習React的開始

由於**vite**使用了**ES module**作為編譯方式使得網頁載入的時候即時編譯，另外採用較少的設置、簡單的設計原則，也支持各種主流的前端框架，對於想要自定義的部分也可以透過插件或是中間件來自行擴充，換句話說相比於**Create React App**對於伺服器的啟動速度和開發體驗以及建立完畢的初始library相比都是較為輕量及快速的選擇方案。

## 開始建立vite專案

在terminal中輸入以下指令

```bash
npm create vite@latest
```

![](https://i.imgur.com/qka1Fa1.png)

![](https://i.imgur.com/wLcfpn4.png)

如上圖，接下來他會詢問是否安裝，按下Y得以繼續，由於我們的Project的資料夾已經建立了，因此<span class="blue">Project Name可以輸入./表示當前路徑</span>，依序選擇Javascript後就建立了基本的資料夾結構。

接下來將會提示指令分別是安裝node module 的相依套件

![](https://i.imgur.com/rrY1ELf.png)

```bash
npm install
npm run dev
```

安裝完畢後src的整個資料夾結構大概會長這樣

```bash
│  App.css
│  App.jsx
│  index.css
│  main.jsx
│
└─assets
        react.svg
```

接下來會將預設用不到的資源先刪除，依據需求可能會留存assets資料夾，最後資料夾與檔案結構如下

```bash
│  App.jsx
│  main.jsx
│  
└─assets
```

## 使用CSS module
為了切分**component**的**CSS**作用域，我們使用**CSS moudle**來達成

因此我們可以建立一個名為<span class="code red">app.module.css</span>的檔案

```bash
App.jsx
app.module.css
main.jsx
```

建立完畢後我們在app.module.css的檔案內加入以下的class

```css
.title-h1 {
 color: red;
}
```

在App.jsx引入
```jsx
import sytles from "./app.module.css"
const App = () => {
  console.log('sytles', sytles);
  return (
    <div className={sytles['title-h1']}>  App</div>
  )
}
export default App
```

## 經過hash的css class名稱

如下圖，我們可以得到從**console.log**得知藉由css module他會將我們的class名稱**加入hash**值得name以**達到在不同的component當中的className不一樣**。

![](https://i.imgur.com/OcUjdgl.png)

## 使用駝峰式引用含有dash的css Class 名稱
在撰寫CSS當中我們很常使用**dash**(也就是-符號)來**做為class的name**，但是在Javascript當中如果物件的名字包含了**dash**的話就得**撰寫中括號來取值**(也就是<span class="code">sytles['title-h1']</span>)，因此我們可以藉由vite讓我們引入css的class到jsx更為方便。

在**vite.config.js**當中設定如下
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	css: {
    modules: {
      localsConvention: "camelCase",
    },
	},
}); 
```

藉由加入<span class="red code">localsConvention: "camelCase"</span>，就能更方便我們在引入的時候使用<span class="blue">camelCase的撰寫方式</span>(備註1)，實際程式碼如下(備註2)

```jsx
import styles from "./app.module.css"
const App = () => {
  return (
    <>
      <h1 className={styles.titleH1}>App</h1>
      //能使用駝峰式寫法
    </>
  )
}
export default App
```

> 備註1 更多設定方式可以參考[vite-css module](https://cn.vitejs.dev/config/shared-options.html#css-modules)<br>
> 備註2：官方的vite也有提及到底層的實踐技術是來自於[postcss-modules](https://cn.vitejs.dev/config/shared-options.html#css-modules)

## 在vite中使用SCSS

另外<span class="blue">為了撰寫巢狀css</span>的方式，我們也會<span class="blue">安裝sass</span>在**Terminal**輸入<span class="red code">npm i -D sass</span>

輸入以下指令
```bash
npm i -D sass
```

安裝完畢後我們建立global.scss，此時src的資料夾內容如下

```bash
  App.jsx
  global.scss
  main.jsx
```

如此一來當我們在撰寫jsx的時候，就能使用scss樣式了，嘗試著**global.scss**撰寫如下

```scss
p {
 color: green;
}
```

此時在**App.jsx**引用**global.scss**，如下程式碼

```jsx
import "./global.scss"
const App = () => {

  return (
    <>
      <h1>測試</h1>
      <p>
        段落文字
      </p>
    </>
  )
}
export default App
```

顯示畫面如下

![](https://hackmd.io/_uploads/BJ52K1PH2.png)

## 使用scss module

先前提到css module，在scss中我們一樣可以建立scss module，我們在src當中建立一個<span class="red ">app.module.scss</span>，此時src的檔案內容如下

```bash
App.jsx
app.module.scss
global.scss
main.jsx
```

一樣在app.module.scss撰寫如下

```scss
.title-h1 {
 color: red;
}
```

此時我們就能如同先前所提到的**css module**一樣，在這邊就是使用**scss module**

```jsx
import "./global.scss"
import { titleH1 } from "./app.module.scss"
const App = () => {
  return (
    <>
      <h1 className={titleH1}>測試</h1>
      <p>
        段落文字
      </p>
    </>
  )
}
export default App
```

## 全域共用變數載入至jsx或scss module

如果我們有些變數或者mixin以往在另外一個檔案要使用，我們會在另外一個檔案使用@use 來載入該檔案。

```scss
@use "../../styles/breakpoint";
@use "../../styles/variable";
```

但是**有些變數**或者**mixin**是<span class="red">希望在全部的jsx或者scss都讀取的到</span>
此時我們只要在 **vite.config.js** 設定 **preprocessorOptions** 就能將該檔案載入在所有的jsx和scss module了

根據官方[share otpion-css.preprocessorOptions](https://vitejs.dev/config/shared-options.html#css-preprocessoroptions)

範例的設定，就是將$injectedColor這個變數放到每個jsx或者scss module檔案裡面

如下

```javascript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`,
      },
      less: {
        math: 'parens-division',
      },
      styl: {
        define: {
          $specialColor: new stylus.nodes.RGBA(51, 197, 255, 1),
        },
      },
    },
  },
})
```

<span class="code red"> @use "@/src/global.scss";</span> 這行會被加到每一份 **style** 中，等同於在每個scss module引入<span class="code red">".src/global.scss"</span>，如此一來元件就都能取用 global.scss 裡面 scss 的變數

具體程式碼如下

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	css: {
    modules: {
      localsConvention: "camelCase",
    },
    preprocessorOptions: {
      scss: {
        //下面的寫法就不用在每個地方都寫glbal.XXX變數
        additionalData: `@use "./src/global.scss" as *;`,
      },
    },
  },
});
```

>補充說明<br>
>若對於@use為什麼要使用as *的話可以觀看 [SCSS Choosing a Namespace](https://sass-lang.com/documentation/at-rules/use#choosing-a-namespace) 的官方說明

##### 參考資料

- [Day 15: 在 Vue 專案使用 Sass/SCSS +共用變數 (feat. Vite)](https://ithelp.ithome.com.tw/articles/10301528)
- [Create React App is Dead?](https://dev.to/thevinitgupta/create-react-app-is-dead-3igo)
- [將 Vite 加入現有 React 專案](https://huybn.medium.com/add-vite-to-existing-react-project-75725c223495)
- [The React Docs Are Wrong (If You Are Trying To Learn React)](https://www.youtube.com/watch?v=KCEVIY0Z3xY&t=222s&ab_channel=WebDevSimplified)
- [vite-css.modules](https://cn.vitejs.dev/config/shared-options.html#css-modules)

