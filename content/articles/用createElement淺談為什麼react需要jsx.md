---
title: 用createElement淺談為什麼 react 需要jsx
slug: 2022-10-05T07:34:00.000Z
date: 2022-10-05T07:34:00.000Z
tags: ["React","Webpack"]
---


這篇文章將會介紹以下部分

- createElement有什麼?
- 淺談children是什麼
- 為什麼jsx
- 使用webpack編譯jsx
- 小結

## createElement有什麼?


[從安裝webpack理解react與react-dom(without JSX)](/tech-page/2022-10-01%20Sat)的文章內容在**createElement**的解釋並沒有多作探討，因此這裡解釋一下**createElement**函式的參數。
依據官方文件[React Top-Level API-createelement](https://reactjs.org/docs/react-api.html#createelement)
**createElement**可以接受參數如下
```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

**type**指的是tag的名字，例如'div'，'h1'等等，第二個參數參數是**props**，其內容例如HTML的屬性id=animal，第三個參數是**children**，這裡使用...表示children可以不僅是一個，下面範例延續昨天範例，這次多加了屬性為[style](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style)，其value也是一個物件，其物件的屬性是color、值為紅色。

```javascript
import React from "react";
const App = () => {
  return React.createElement("h1",
     {
      style: {
        color: "red",
      },
    }, "我是H1");
  //第一個參數是tag名稱，第二個是prop、第三個是內容
};
```
透過**console**的方式**React.createElement**的回傳值可以看到如下

![](https://i.imgur.com/aqnUQyl.png)

透過瀏覽器除錯工具打開上面的語法最後**react-dom**會幫我們渲染成如下的內容

![](https://i.imgur.com/HhjfT7n.png)


## 淺談children是什麼

我們如果今天要渲染h1內容有"我是h1"的話，react其實就是以props.children來渲染，因此如果希望有子元素像是無序清單`<ul>`裡面有`li`也可以用同樣的方式渲染。則可以在**createElement**第三個參數後帶入。

觀看以下的程式碼
```javascript
import React from "react";
const App = () => {
  const list = React.createElement(
    "ul",
    {
      style: {
        color: "red",
      },
    },
    React.createElement("li", null, "Dog"),
    React.createElement("li", null, "Cat"),
    React.createElement("li", null, "Fish")
  );
  console.log(list);
  return list;
};
export default App;
```

打包完畢後應當可以看到如下圖

![](https://i.imgur.com/xuRCK6R.png)

我們最後也可以console查看最後react元素的內容是什麼，如下圖。

![](https://i.imgur.com/IZ9uFcP.png)

可以發現當children不只一個的時候，他會變成陣列的形式成為react 元素。

## 為什麼jsx
由上述程式碼可以發現假如我們需要建構一個大型應用程式，其包含許多標籤的時候程式碼會過於複雜，因此勢必要衍生出一種新的撰寫模式—jsx。

根據[facebook的github](https://github.com/facebook/jsx)解釋jsx的spec其大致描述是一種類似於XML的**javascript語法擴充**，但他不會納入ECMAscript的spec，因此需要透過預處理器轉譯。

在選用**jsx**前也有考量到**Template literals**樣板字面值的方式如何，但是閱讀性也不佳，另外也可能導致一些建置工具將可能無法作用。

另外也有考慮使用[JXON](https://github.com/facebook/jsx#why-not-jxon)的做法，但是也因為語法提示不佳，因此最後**jsx**成為了多數人撰寫react的方式。



![](https://i.imgur.com/SiNEwRp.png)

圖片來源[facebook—github/jsx](https://github.com/facebook/jsx)

## 使用webpack編譯jsx

### Babel是什麼？
Babel工具是一套能夠將Javascript新語法轉譯成與某個舊版本的瀏覽器相容的工具，例如我們如果用ES6以上的語法，然而在一些舊的瀏覽器當中並不能夠理解這些Javascript的新語法，因此我們透過**babel**將新語法轉換成舊語法或是使用[Polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill)的方式來實現在舊的瀏覽器運行。

### core-preset-env
需要編譯jsx的話，事前得安裝core和preset-env，一個是babel的核心，另外一個是轉換舊語法的工具
`npm install @babel/core @babel/preset-env --save-dev`

### babel loader
另外由於要給webpack需要讀懂babel，想當然而也需要loader，因此輸入以下指令安裝babel loader
`npm install babel-loader --save-dev`

### preset-react
最後是要編譯成jsx的工具(備註)。
`npm install @babel/preset-react --save-dev`
> 備註：其內容其實包含許多plugin，有興趣的人可以點該[連結](https://babeljs.io/docs/en/babel-preset-react)

### webpack.config.js
安裝完畢後設定`webpack.config.js`如下
```javascript
const path = require("path");
module.exports = {
  entry: "/src/index.js",
  output: { path: path.resolve(__dirname, "dist") },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,//正則表達式取副檔名是js/jsx
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
        },
      },
    ],
  },
};
```

上面設定意思是將副檔名為js或jsx的檔案透過**babel-loader**載入後使用**preset-env**和**preset-react**編譯。
### App.js

App.js的內容如下
```jsx
import React from "react";
const App = () => {
  return <div>測試</div>;
};
export default App;
```

### index.html
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
    <script src="./main.js"></script>
  </body>
</html>
```

### 資料夾結構
其資料夾結構應當如下

![](https://i.imgur.com/EUrQ52m.png)

最後再`npm run build`應當可以如期的得到打包後的js檔案。

我們也就成功編譯了jsx了。如下圖


![](https://i.imgur.com/HjE7g9j.png)

## 小結

本篇講解了createElement的函式，其中提到了props和children，當我們實際在使用react的時候會很常使用這兩個屬性，另外也淺談使用了jsx的原因，透過實作webpack編譯jsx的過程也提及了bebal的用途，最後Babel有提供一個線上觀看轉譯後的程式碼的網頁[連結在此](https://babeljs.io/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABACQKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8amciA7nGevQEJaAekasA3EQC-RIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=7.19.2&externalPlugins=&assumptions=%7B%7D)，左邊勾選react和LineWrap就可以看到轉譯後的結果了。

希望這篇文章能對大家有所幫助以上!

##### 參考資料
- [What the heck is JSX and why you should use it to build your React apps](https://www.freecodecamp.org/news/what-the-heck-is-jsx-and-why-you-should-use-it-to-build-your-react-apps-1195cbd9dbc6/)
- [facebook/jsx-Github](https://github.com/facebook/jsx)
- [Babel-What is Babel?](https://babeljs.io/docs/en/)
- [reac-createelement](https://reactjs.org/docs/react-api.html#createelement)
