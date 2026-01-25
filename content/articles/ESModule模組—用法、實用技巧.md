---
title: ESModule 模組—用法、實用技巧
slug: 2022-09-24T03:35:00.000Z
date: 2022-09-24T03:35:00.000Z
tags: ["Javascript","React"]
---

Javascript 當初設計的時候僅是網頁執行簡單腳本的語言，隨著時間的推演，一個網頁擁有大量複雜的腳本需要被執行，直到近年網頁所涵蓋的 Javascript 腳本越來越多，勢必要考慮將 Javascript 模組拆分，因此慢慢衍生一些模組化系統，在 ES6 之前比較知名的有 CommonJS 和 AMD(Asynchronous Module Definition)，ComonJS 主要是設計給伺服器端的 Node.js 使用，AMD 的目標則是給瀏覽器端，近年制定 Javascript 標準的[ECMAScript](https://zh.wikipedia.org/zh-tw/ECMAScript)在 2015 年將模組化的語法納入到標準當中，因此被稱為 ES6 Moudle(ESM)。

本文重點將會以 ES6 的 Module 為主

文章將會提到以下幾點
- 什麼是 module
- 基本用法
- 具名匯出、預設匯出
- default 匯出就像具名匯出？
- 其他技巧—as 別名、包裹物件匯出、sideEffect 模組
- 合併模組
- React 中實際應用場景
- 重點回顧


## 什麼是 Module

在介紹 ES moudle 之前，首先得簡單講解一下模組是什麼，根據維基百科[模組化設計
](https://zh.m.wikipedia.org/zh-tw/%E6%A8%A1%E7%B5%84%E5%8C%96%E8%A8%AD%E8%A8%88)的介紹提到**其旨在於將一個系統細分為許多小單元，稱為模組（module）或模塊（block），可以獨立的於不同的系統中被建立與使用**，對應到現實生活中例如一台車子當中，具有煞車模組、引擎控制模組、傳動系統等等，以電腦為例擁有供電模組、散熱模組、記憶體模組，每個模組可能不僅只能使用在同一型號的電腦，藉由不同型號的裝置，共用模組可以達到大量製造、降低生產成本等等的優點。

回到 Javascript 的 Module，其內容就是將一個功能或者類似的功能組合在一起的程式碼，而且其中也常被包含在更大的應用程式用來執行某些特定的任務。

## 為什麼我們需要模組化？

大致上整理出以下幾點

- 複用性：模組能夠簡單的整合到其他程式當中達到複用性。
- 隔離性：透過模組可以避免命名衝突，也易於測試，除此之外可以輕易地進行多人協作不同的模組
- 組織性：如果切分成不同模組的邏輯模組，可以更易於管理大型應用。


## 基本用法

例如我們在 src 的資料夾內有`app.js`和`data.js`和 index.html 如下

```bash
└─src
    app.js
    data.js
    index.html
```

在 index.html 的`script`使用`type=module`的方式如下
```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module" src="app.js"></script>
  </body>
</html>
```

在`data.js`底下程式碼如下
```javascript
export const data=[1,2,3,4,5,6,7,8];
```

在`app.js`程式碼如下
```javascript
import { data } from './data.js'
console.log(data);
```

這樣的做法就能如期印出 data 了，換言之就是在 app 程式當中引用了 data 的模組

### Module—嚴格模式
需要注意的地方是`**當我們使用模組的時候，其程式碼部分將會自動成為嚴格模式**`

> 更多有關嚴格模式的說明可以參考[MDN-Strict mode for modules](
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#strict_mode_for_modules)

## 具名匯出、預設匯出

我們針對**export**分成下列兩種方式

- named export 具名匯出
    - 可以匯出物件、變數、函式等等，匯出前要給予特定名稱一個檔案可以有很多個具名匯出

- default export(預設匯出)
    - 一個檔案**只能有一個**default export

另外匯出的時候不一定需要取名字，因為在 import 的時候會取名，但是通常使用原本 module 的名字，換句話說引入的時候也可以改成你想要的名字 

### 匯出 function

我們除了看到基本用法匯出資料以外，通常一個模組的檔案也會包含許多 function，這邊示範如何匯出 function

#### 預設匯出 function
上面基本用法簡單介紹了一下匯出資料的方式，這裡使用**default**匯出 function

這裡假設命名了一隻檔案叫做`fn.js`
檔案內容如下
```javascript
export default function (name) {
  console.log(name);
}
```

在另一支檔案`app.js`裡面就是 import 直接使用，程式碼如下
```javascript
import fn from "./fn.js";
fn("Danny");
```

#### 具名匯出 function

上面示範如何預設匯出 function 我們可能一隻檔案有很多 function，因此可以使用具名匯出範例如下

```javascript
export function sayHello() {
  console.log("Hello");
}
export function sayMyName(name) {
  console.log("Hi I am " + name);
}
```

在 app.js 使用大括弧的方式引入如下
```javascript
import { sayHello, sayMyName } from "./fn.js";
sayHello();//Hello
sayMyName("Danny");//Hi I am Danny
```

## default 匯出就像具名匯出？

這次原本的`data.js`以下片段
```javascript
export const array = [1, 2, 3, 4, 5, 6, 7, 8];
export function sayMyName(name) {
  console.log(name);
}
export default function () {
  console.log("你好");
}
```
在 app.js 改成以下片段

我們使用`*`表示全部引入的意思，他會包含 default 和具名匯出的東西。
```javascript
import * as myModule from "./data.js";
console.log(myModule);
```

這裡我們可以看到如下圖擁有一個 key 叫做**default**的屬性

![](https://i.imgur.com/z56RZSr.png)

這時候我們就可以解構賦值的方式將其提取出來使用
程式碼如下
```javascript
import * as myModule from "./data.js";
console.log(myModule);
const { array, sayMyName } = myModule;
const { default: data } = myModule;
data();
console.log(array);
sayMyName("Danny");
```

因此可以知道的事情如下

- 由於 default 是[保留字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words)(備註) 所以**得額外取名**
- defalut 與其他具名匯出的模組類似**可以用解構的方式得到該內容**

> 備註：更多保留字的解釋可以參考[MDN-保留字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words)


## 其他技巧—as 別名、包裹物件匯出、sideEffect 模組

### 包裹成物件匯出

另外如果想要 export 多個函式卻又不想要一直撰寫`export`這個關鍵字的時候，可以使用包裹成物件的形式預設匯出
```javascript
const foo = () => console.log('你好')
const foo2 = () => console.log('安安')
const foo3 = () => console.log('安安你好')
export default { foo, foo2, foo3 }
```

另一隻 app.js 檔案
```javascript
import hiModule from "./data.js";
console.log(hiModule);
const { foo, foo2, foo3 } = hiModule; //解構賦值把函式取出
foo();
foo2();
foo3();
```

印出如下圖

![](https://i.imgur.com/79zjPpw.png)

### 使用 as 取別名

我們在引入的時候也可以另外取名字的方式，通常會這麼做的時候是因為可能原先**export**的太過冗長或是在引用的檔案當中有相同的命名，因此會使用`as`來做為額外命名

> 比較方便記憶的方式是 as 是英文 alias 的簡寫，而 alias 的中文有化名、別名的意思

我們的 data.js 裡面有以下內容
```javascript
export const data=[1,2,3,4,5,6,7,8];
export function sayMyName(name){
    return console.log(name);
}
```
引入的 app.js，這時候可以看到下面的 sayMyName 被取名成 say 了。
```javascript
import {data,sayMyName as say }from './data.js';
console.log(data);
say("Tom");
```
###  匯入 side effect 模組
如果我們在原本的檔案當中不寫**export**關鍵字的話，一樣可以在其他要使用的地方引入，只是這樣的做法就被稱為**side effect 模組**

原本的`data.js`不寫入 export
```javascript
function hello(){
    console.log("hello");
}
hello();
```

在`app.js`引入

```javascript
import("./data.js");
```

瀏覽器就會直接顯示 hello，換句話說如果我們希望在引入的時候直接使用的話可以使用**sideEffect**的方式。

## 合併模組

有時候我們會有多個模組，我們可以也可以透過一個檔案的方式將多個模組的檔案整合成一支檔案。

### 使用`*`縮寫匯入後匯出

先前提到`*`具有全部的意思，因此我們可以使用`*`，將其他模組的內容一次載入再匯出整合成一支檔案。

在`test.js`
```javascript
export const a = 1;
export const b = [2,3];
export default function(){
    console.log("test");
}
```

需要注意的地方是 在`data.js`，**雖然 export`*` 但其實並沒有匯出`test.js`的 default。**

```javascript
export * from  './test.js';  // 匯出此種方法並不會匯出在 test 的 default
```

在`app.js`撰寫如下

```javascript
import * as module from "./data.js"
console.log(module);
const { a , b }= module;//使用解構賦值方式將其取出
```

如此一來印出 module 的時候會發現並沒有 default 的內容

![](https://i.imgur.com/K65aE8a.png)

### 匯入預設模組再匯出

為了能夠在重新匯出的時候也包含了原先在 test 的 defautl 的內容，因此`data.js`必須改成如下

```javascript
export * from "./test.js"; // 匯出此種方法並不會匯出在 test 的 default
//要匯出 default 的話要寫以下片段
export { default } from "./test.js";
```

在`app.js`撰寫成以下片段，就能如期的使用剛剛在 test 所匯出的 function

```javascript
import fn, * as module from "./data.js";
console.log(module);
fn();
const { a, b, test } = module; //使用解構賦值方式將其取出
```

### 匯入預設模組再取名匯出
另外我們一樣可以使用 as 的方式將預設模組匯入之後再取名匯出
再 data.js 的內容改成如下

```javascript
export * from "./test.js"; // 匯出此種方法並不會匯出在 test 的 default
//要匯出 default 的話要寫以下片段
export { default as test} from "./test.js";
```
在 app.js 的檔案使用大括號的方式就能夠如期使用，內容如下
```javascript
import { a, b, test } from "./data.js";
console.log(a);
console.log(b);
test();
```
印出內容如下
![](https://i.imgur.com/2znfGxw.png)

## React 中實際應用場景
### component 拆分
在 React 中 (或其他框架) 我們可以透過 module 的方式做到**component 的檔案拆分**。
例如以下就是將各個網頁上的 component 實際切分出的資料夾形式
```bash
├─API
├─component
│  ├─Aside
│  ├─Banner
│  ├─Card
│  ├─Footer
│  ├─Header
│  ├─Logo
│  ├─Pagination
│  ├─Sidebar
├─hook
├─pages
│  ├─Detail
│  ├─HomePage
│  ├─NotFound
│  └─Search
├─store
└─styles
```
### 整合 component 到 index.js 檔案

在 React 中 (或其他框架中)，我們可以**透過整合模組的技巧，建立一支 index.js，簡化引入時候的程式碼**。

```javascript
export { default as Banner } from "./Banner/Banner";
export { default as Footer } from "./Footer/Footer";
export { default as Aside } from "./Aside/Aside";
export { default as Pagination } from "./Pagination/Pagination";
```

這樣在引入的地方就能減少程式碼的量，增加可讀性。
例如我們在 page 的 js 檔案，import 的時候僅需要寫一行就好。

```javascript
import { Aside, Header, Banner, Footer } from '../../component'
```

### 將資料抽離出撰寫邏輯的檔案
例如我們需要在撰寫邏輯程式碼的，地方減少程式碼量，增加可讀性，這個時候就可以將資料統整成一支檔案，舉例如下
```javascript
export const JapaneseCharacter = [
  {
    hiragana: "あ",
    katakana: "ア",
    roma: "a",
  },
  {
    hiragana: "い",
    katakana: "イ",
    roma: "i",
  },
  {
    hiragana: "う",
    katakana: "ウ",
    roma: "u",
  },
  {
    hiragana: "え",
    katakana: "エ",
    roma: "e",
  },
  {
    hiragana: "お",
    katakana: "オ",
    roma: "o",
  },
  {
    hiragana: "か",
    katakana: "カ",
    roma: "ka",
  },
  //日文字有五十個，以下省略
];
```

在需要日文資料的地方再 import 就好了。

## 重點回顧
* **一支檔案只能有一個 default Export** 另外引入的時候可以改成你想要的名字 但是一般人不會這樣做，換句話說模組名字會和引入的名字一樣像是<font color="red">`import lodash from 'lodash'`</font>
* 如果在 export 沒有使用 default 的方式的話 就要使用大括號的方式做引入
* 用大括弧方式引入可以寫 alias 來另取名字 通常會這麼做是因為 import 的 variable 名字太長或是命名衝突的問題
* 在瀏覽器的時候要寫 type=module 
* import* 可以引入那支檔案所有的 export 包含 default 但是還是要有名字 alias 的方式做引入
* 具名匯入比較嚴謹，因為需要名字一樣才能使用。


##### 參考資料 
- [從 ES6 開始的 Javascript 學習生活—模組系統](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/module_system.html)
- [MDN-JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Javascript modules, why?](https://dev.to/ishansrivastava/javascript-modules-why-28gh)
- [Everything You Need to Know About Javascript Modules in 6 Minutes](https://medium.com/swlh/everything-you-need-to-know-about-javascript-modules-in-6-minutes-54922fea9880)
