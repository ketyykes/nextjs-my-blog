---
title: 008 重新認識 Javascript 讀書會-Callback Function 與 IIFE
slug: 2022-02-06T05:55:00.000Z
date: 2022-02-06T05:55:00.000
tags: ["008 重新認識 Javascript 讀書會","Javascript"]
---

本篇為參與 0 陷阱！0 誤解！8 天重新認識 Javascript 讀書會的導讀內容加上自己所蒐尋的資料後所構成的文章。

## setTimeout Callback

書上範例如下，會印出 5 個 5，因為 setTimeout 是非同步的執行，因此 for 迴圈並不會等待 setTimeout 函式所以會繼續往下執行，

```javascript{numberLines: true}
for( var i = 0; i < 5; i++ ) {
  window.setTimeout(function() {
    console.log(i);
  }, 1000);
}
```

由於在 ES6 以前，JavaScript 變數有效範圍的最小單位是以 function 做分界的
(因為只有 var 的宣告方式)

但是使用 let 就可以印出 0 1 2 3 4

```javascript{numberLines: true}
for( let i = 0; i < 5; i++ ) {
  window.setTimeout(function() {
    console.log(i);
  }, 1000);
}
```

## 關於回呼生活化 (Callback)

觀看下面範例

```javascript{numberLines: true}
let money = null
function slower() {
  setTimeout(function() {
    money = 30
  }, 200)
}
function faster() {
  setTimeout(function() {
    console.log('I have ' + money)
  }, 100)
}
slower()
faster()
```

由於在 200 微秒的時候才會將 money 存入 30，若執行上述程式碼 faster 就會先執行，但是此時 money 沒有值，因此先印出 I have null.

> 引用自[JS20min Day — 18 關於回呼生活化 (Callback)](https://whien.medium.com/js20min-day-18-%E9%97%9C%E6%96%BC%E5%9B%9E%E5%91%BC%E7%94%9F%E6%B4%BB%E5%8C%96-callback-1a112db1a788)

## 小練習

觀看下面範例

```javascript{numberLines: true}
function aFunc(value, callback){
  callback(value)
}

function bFunc(value, callback){
  setTimeout(callback, 0, value)
}

function cb1(value){ console.log(value) }
function cb2(value){ console.log(value) }
function cb3(value){ console.log(value) }
function cb4(value){ console.log(value) }

aFunc(1, cb1)
bFunc(2, cb2)
aFunc(3, cb3)
bFunc(4, cb4)
```

### 其他補充

在 JavaScript 中，除了 DOM 事件處理中的回調函式 9 成 9 都是異步執行的，語言內建 API 中使用的回調函式不一定是異步執行的，也有同步執行的例如 Array.forEach

> 引用自從 ES6 開始的 Javascript 生活

> [異步回調函式](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/callback.html#%E7%95%B0%E6%AD%A5%E5%9B%9E%E8%AA%BF%E5%87%BD%E5%BC%8F)

### void 補充

觀看以下程式碼

```javascript{numberLines: true}
void (console.log('HI!'));
// console 主控台會印出 "HI"，然後回傳 undefined
```

> [冷知識 - 你所不知道的-void/](https://kuro.tw/posts/2019/08/04/JS-%E5%86%B7%E7%9F%A5%E8%AD%98-%E4%BD%A0%E6%89%80%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84-void/)

另外 Optional Chaining 透過 babel 編譯的時候可以發現 void 0 的身影。

> [Optional Chaining 透過 babel 轉譯](https://medium.com/easons-murmuring/javascript-%E4%B8%AD%E7%9A%84-void-%E5%92%8C-undefined-2b75aecc021b)

