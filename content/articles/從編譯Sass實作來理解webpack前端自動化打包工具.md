---
title: 從編譯Sass實作來理解webpack前端自動化打包工具
slug: 2022-09-28T11:30:00.000Z
date: 2022-09-28T11:30:00.000Z
tags: ["Webpack"]
---

![](https://i.imgur.com/Zpr8dDG.png)
> 圖片來源：[webpack官方文件](https://webpack.js.org/)
## 什麼是webpack 
現代化的前端技術與以往不同，不僅是只有基本的HTML、CSS、Javascript，很多時候我們撰寫的內容是需要經由編譯，像是你可能會看到的副檔名包含SASS中的sass或scss、React中的jsx、Vue當中的vue，諸如此類的內容，瀏覽器並沒有辦法理解這些副檔名。甚至有些東西我們希望能夠預先處理後再變成實際網頁渲染的東西，例如將圖片壓縮檔案大小、程式碼刪除空白以便使檔案容量降低，讓眾多的Javascript檔案整合成單一檔案，因此也造就了自動化工具的產生。

Webpack就是處理類似上述事情的前端自動化打包工具。

以下透過列點式的方式列出以下優點
- 編譯多種東西像是scss、react、pug還可以壓縮圖片、html
- 多人團隊開發 統一開發
   - 可以記錄套件的版本號 
- 打包成一隻Javascript檔案解決src非同步的問題
- 跨瀏覽器版本的問題
   - 例如babel、polyfill等等

這篇文章將會透過實作編譯sass來從中了解webpack的內容

## 核心概念
在實作之前我們先知道幾個核心重點
- entry
  用來指定webpack應該從哪個檔案作為開始，換句話說指定一個(或多個的入口)作為編譯的開始點
- output
  用來指定編譯後的輸出檔案位置
- module的rule底下loader
  由於webpack只能理解Javascript，其內容可以設定loader使其讀取相關檔案
- plugin
  插件可以想像成要自動化做某些事情，例如自動清除某些檔案、建置某個資料夾
- mode
  指定生產模式或者開發模式

接下來我們開始實作一個可以編譯sass和自動化生成模板的webpack設定吧

### 建立src資料夾

我們預計在src資料夾建立一些檔案如下
```bash
├─js
│      index.js
│
└─scss
        all.scss
```
這裡的內容主要放置webpack處理前的內容

### Step.1安裝webpack和webpack-cli

- `npm init -y` 
    - 建立的時候不會問你問題並建立package.json
- `npm install webpack webpack-cli --save-dev`
    - 安裝webpack和webpackcli 其中--save-dev將其加入到開發時的依賴項中。

### Step.2安裝loader和編譯sass的套件
接下來要安裝loader
由於js無法理解sass或者css，因此使用loader可以在js當中直接import時候預處理內容，以下指令簡單理解可以說是loader讓webpack讀懂scss，稍後就能在index.js可以import scss檔案。

- `npm install css-loader sass-loader -D`
    - 安裝sass loader和css loader
- `npm install sass`
    - 用來編譯sass的套件

### Step.3安裝獨立出css檔案的套件

- `npm install mini-css-extract-plugin -D`
我們編譯後的檔案可以透過[style-loader](https://webpack.js.org/loaders/style-loader/)將其自動化加入在html的header裡面，但是有時候我們希望編譯出來的css是一支副檔名為css的檔案，因此需要[MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)這個插件。

### Step.4在不同作業系統指令統一
- `npm install cross-env -D`
    - 安裝跨作業系統統一指令的套建
我們稍後會使用指令的方式設定`NODE_ENV`環境變數後再讓webpack自動判別生產環境還是開發環境，然而不同的作業系統要設定**環境變數**的指令也不太一樣。

在linux設定環境變數的指令是是`NODE_ENV`
在windows則是`set NODE_ENV`

為了在不同的作業系統上面的指令統一，因此就可以下載**cross-env**套件解決這樣的問題。

### Step.5在package設定執行腳本

安裝完畢後在**package.json**的script的部分將腳本設定如下
腳本內容大致意思是 使用cross-env設定環境變數**NODE_ENV**的值為`development`(或production)，再執行webpack。
```javascript
{
    //以上省略
    "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "cross-env NODE_ENV=development webpack",
    "deploy": "cross-env NODE_ENV=production webpack"
        },
    //以下省略
 }
```

設定完畢後，意思是如果我們輸入`npm run start`就等同於輸入`cross-env NODE_ENV=development webpack`的指令了。

### Step.6設定 webpack.config.js
接下來終於來到設定webpack環節，我們預計透過NodeJs的指令`process.env`判斷當下的NODE_ENV環境變數，之後再存入到變數中，因此宣告了一個modeEnv的變數。

另外**path.resolve**是nodeJs的方法，使其透過`__dirname`絕對路徑的方式產生dist的資料夾，並且命名叫做`bundle.js`。

在rules的部分則是會判斷哪些檔案需要被編譯，透過**正規表達式**的方式就是sass或scss將其加入規則中，讓webpack抓取的到。

`filename: "./css/[contenthash:8].bundle.css",`這段程式碼是**plugin**撰寫產生8碼的hash值，其原因是當網站重新佈署的時候，使用者的瀏覽器如果再次造訪這個網頁的時候，會發現css檔案不一樣，因此將會重新抓取新的css樣式，換句話說不會因為瀏覽器css暫存的關係讓畫面沒有更新到最新的樣式。
```javascript
const path = require("path");//引入nodeJs內建的path模組
const modeEnv =
  process.env.NODE_ENV === "production" ? "production" : "development";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: modeEnv,
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        // 把 sass-loader 放在首要處理 (第一步)
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      }, //注意載入順序
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/[contenthash:8].bundle.css",
    }),
  ],
};
```
### Step.7 撰寫scss將其載入到index.js
在我們剛剛建立的scss資料夾建立`all.scss`檔案以及在js資料夾建立`index.js`

在`index.js`的檔案
```javascript
import "../scss/all.scss";
```

在`all.scss`的檔案
```css
body {
  div {
    text-align: center;
    color: red;
  }
}
```
### 結果展示—development vs production

最後我們在terminal的地方輸入`npm run start`，應當能如期看到產生了一個具有8碼hash的css以**及bundle.js**如下圖
![](https://i.imgur.com/UP4d5CR.png)

我們嘗試著打開其建置的css檔案可以看到如下的原始碼
```css
/*!************************************************************************************************************!*\
  !*** css ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/all.scss ***!
  \************************************************************************************************************/
body div {
  text-align: center;
  color: red;
}
```

這是因為我們執行的**mode**模式是**development**

我們可以嘗試著改執行`npm run deploy`
其產生的出的css檔案內容如下
```css
body div{text-align:center;color:red}
```
換句換說，在**production**模式的時候webpack會將多餘的空白給刪除達到程式碼最小化以節省檔案大小。

## 小結

希望透過編譯scss的過程的範例實作能夠理解到webpack一些核心概念和原理，也希望對大家有幫助。

##### 參考資料
- [webpack官方文件](https://webpack.js.org/)
- [NPM cross-env](https://www.npmjs.com/package/cross-env)
- [Node.js document-path](https://nodejs.org/api/path.html)
- [關於 Webpack，它是什麼？能夠做什麼？為什麼？怎麼做？](https://askie.today/what-is-webpack/)
