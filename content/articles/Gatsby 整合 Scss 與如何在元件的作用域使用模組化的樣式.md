---
title: Gatsby 整合 Scss 與如何在元件的作用域使用模組化的樣式
slug: 2021-11-21T13:31:00.000Z
date: 2021-11-21T13:31:00.000Z
tags: ["React","Gatsby.js"]
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
.gray{
background-color:#d3d3d3;
}
</style>

本文章將提及以下內容

- 前言
- 安裝必要的插件和套件
- 在 gatsby-config.js 中設定
- 建立全域 Sass 檔案
- 建立模組化 Sass 檔案
  - 方法一：使用物件解構
  - 方法二：直接解構所需的樣式
- 使用多個樣式

## 前言

在建立 Gatsby 網站時，引入 Sass 可以幫助開發者更有效率地管理 CSS，透過使用變數、嵌套規則和模組化樣式，大幅提升開發速度和樣式的可維護性。Sass 的功能支持開發者將樣式組織得更加結構化，例如能夠透過變數集中管理顏色和字型設定，利用嵌套規則簡化 CSS 的撰寫方式以及透過模組化將樣式分割成易於管理的多個檔案。這些特性特別適合用於開發需要大量自定義樣式的大型專案。

本文旨在引導你如何在 Gatsby 項目中整合 Sass，從基本安裝到設定全域樣式和建立模組化 Sass 檔案，幫助你有效利用 Sass 提高網站開發的效率和品質。

## 安裝必要的插件和套件

首先需要安裝兩個插件：

1. `gatsby-plugin-sass`
2. `sass`

透過 npm 指令安裝：

```bash
npm install sass gatsby-plugin-sass
```

```bash
npm install node-sass
```

## 在 gatsby-config.js 中設定

安裝完成後，需要在`gatsby-config.js`檔案中加入`gatsby-plugin-sass`插件，以啟用 Sass 功能：

```javascript
module.exports = {
  plugins: [`gatsby-plugin-sass`],
}
```

## 建立全域 Sass 檔案

為了方便管理全域樣式，可以在`src`資料夾下建立一個`styles`資料夾，用於存放 Sass 檔案。

範例專案結構：

```bash
├─components
│ Footer.js
│ Layout.js
│ Navbar.js
│
├─pages
│ │ 404.js
│ │ about.js
│ │ index.js
│ │
│ └─projects
│     index.js
│
└─styles
    content.module.scss
    footer.module.scss
    global.scss
    home.module.scss
    navbar.module.scss
```

在`styles`資料夾中，建立一個`global.scss`檔案，用於存放全域樣式：

```scss
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  color: rgb(26, 163, 26);
}

html,
body {
  min-height: 100%;
  background-repeat: no-repeat;
}

body {
  // 全域版面樣式
}

p {
  margin: 16px auto;
  line-height: 1.5em;
}
```

在需要套用全域樣式的元件中可以引入`global.scss`:

通常會在`Layout.js`中引入，讓全域樣式在整個網站中生效。

```javascript
import '../styles/global.scss'
```


使用 Sass 後，我們可以更簡單的管理樣式檔案。透過建立一個`global.scss`檔案作為全域樣式的入口點是一個不錯的做法。

在`global.scss`中，我們可以導入其他的 Sass 檔案，例如變數、mixin 等，使樣式更加模組化和可維護。舉例來說可以建立一個`_variables.scss`檔案，用於存放專案中常用的顏色、字型等變數：

```scss
// _variables.scss
$primary-color: #007bff;
$secondary-color: #6c757d;
$success-color: #28a745;
$danger-color: #dc3545;

$base-font-size: 16px;
$font-family: 'Roboto', sans-serif;
```

然後在`global.scss`中導入這個變數檔案：

```scss
// 使用@use 導入 variables 檔案
@use 'variables' as *;
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  color: $primary-color; // 直接使用變數，因為我們用了 as *
  font-family: $font-family; // 直接使用變數
}

// ...其他樣式
```



## 建立模組化 Sass 檔案

除了全域樣式外，也可以建立模組化的 Sass 檔案，用於單一元件的樣式。模組化 Sass 檔案的檔名需要以`.module.scss`結尾。

觀看以下範例，我們再在`styles`資料夾中建立`footer.module.scss`:

```scss
.footer {
  text-align: center;
  margin: 0 auto;
  max-width: 1200px;
  line-height: 2rem;
  vertical-align: middle;
  font-size: 12px;
  background: rgb(47, 0, 255);
  border-radius: 4px;
}
```

有兩種方式可以在元件中引入模組化的 Sass 樣式：

### 方法一：使用物件解構

```javascript
import React from 'react'
import * as styles from '../styles/footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.footer}>
      這裡是 footer
    </div>
  )
}

export default Footer
```

### 方法二：直接解構所需的樣式

```javascript
import React from 'react'
import { footer } from '../styles/footer.module.scss';

const Footer = () => {
  return (
    <div className={footer}>
      這裡是 footer
    </div>
  )
}

export default Footer
```

在 Gatsby 中，模組化的 CSS 檔案是非常推薦的做法。它可以避免全域樣式的命名衝突，並將樣式的作用域限制在單一元件內，使程式碼更加模組化和可維護。

Gatsby 在建置時，會自動為模組化的 CSS 類別名稱添加一個唯一的雜湊值，確保不會與其他元件的樣式產生衝突。例如，如果我們在`footer.module.scss`中定義了一個`.footer`類別：

```scss
.footer {
  // 樣式定義
}
```

在建置後的 HTML 中，`.footer`類別名稱可能會變成`.footer-2k3jd92k`這種形式，其中`2k3jd92k`是一個唯一的雜湊值。

這種機制可以讓我們在不同的元件中使用相同的類別名稱，而不用擔心命名衝突的問題。同時由於樣式的作用域被限制在單一元件內，也更容易追蹤和修改樣式，提高了程式碼的可維護性。

不過需要注意的是模組化的 CSS 檔案無法直接在 JavaScript 中引入，必須透過`import`語句將其引入 React 元件中。Gatsby 在建置時期會自動將模組化的 CSS 檔案轉換為 React 元件可以使用的形式。

## 使用多個樣式

如果需要在同一個元素上使用多個樣式，可以使用樣板字面值 (template literals) 將樣式合併

觀看以下範例

```javascript
import * as styles from "../styles/home.module.scss"

<section className={`${styles.layout} ${styles.big}`}>
  <div>
    <h1>這裡有內容</h1>
    <h2>這裡是 H2</h2>
    <h3>這裡是 H3</h3>
  </div>
</section>
```

上述範例中`home.module.scss`包含了`layout`和`big`兩個樣式：

```scss
.layout {
  /* 樣式定義 */
}

.big {
  /* 樣式定義 */
}
```

透過將`styles.layout`和`styles.big`合併成一個字串，如此一來就可以同時套用這兩個樣式。

在 React 中合併多個 CSS 類別是一種常見的做法，不僅限於 Sass 或 Gatsby。不過在 Gatsby 中使用模組化的 CSS 檔案時，我們需要透過`import`語句將樣式引入 React 元件，然後使用類似上例的方式合併多個樣式。

##### 參考資料

- [Using Sass in Gatsby - 官方文件](https://www.gatsbyjs.com/docs/how-to/styling/sass/)
- [Component-Scoped Styles with CSS Modules](https://www.gatsbyjs.com/docs/how-to/styling/css-modules/)
