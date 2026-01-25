---
title: 008 重新認識 Javascirpt 讀書會 - 從 setTimeout 與 setInterval 理解 EventQueue
slug: 2022-02-13T06:55:00.000Z
date: 2022-02-13T06:55:00.000Z
tags: ["008 重新認識 Javascript 讀書會","Javascript"]
---

本篇為參與 0 陷阱！0 誤解！8 天重新認識 Javascript 讀書會的導讀內容加上自己所蒐尋的資料後所構成的文章。

## setTimeout setInterval

- 回傳事件 ID
- 第三個後面的參數 表示 callback 的引數

### 回傳事件 ID 範例

可以觀看下面的例子使用 console.log 會印出 id

```javascript{numberLines: true}
let timeoutID = window.setTimeout(function(){
	console.log("hello");
},1000);

let timeoutID2 = window.setTimeout(function(){
	console.log("hello");
},1000);

console.log(timeoutID);
console.log(timeoutID2);
```

### 添加引數到 setTimeout 的 call back

嘗試著在一秒之後印出引數的平方，觀看以下例子

```javascript{numberLines: true}
let passParaml = window.setTimeout(function(num){
	console.log(num*num);
},1000,2);
```

### 清除設定 setInterval

```javascript{numberLines: true}
let cancelSetInterval = window.setInterval(function(){
	console.log("setInterval");
},1000);
window.clearInterval(cancelSetInter);
```

## 各項專業名詞

- V8 引擎 將 Javascript 編譯成機器碼
- Single thread 單執行
- Call stack 呼叫堆疊
- Call heap 呼叫堆積
- Event Loop 事件循環
- Callback queue 回呼佇列

---

- Heap 就是記憶分配 (memory allocation)
- Stack 就是執行背景 (execution)

#### setTimeout、DOM、HTTP request 並不在 V8 引擎 (以上這些都是非同步的東西)

下圖是 Javascript 的簡化示意圖
![](https://i.imgur.com/BgvdrX8.png)

![](https://i.imgur.com/gWOpa97.png)

上圖表示在非同步執行完畢的時候，就會放進事件迴圈的佇列當中，等待 stack 執行完畢再執行。

---

## The call stack

- one thread == one call stack == one thing at a time
  單執行緒 也就是一個堆疊 換句話說 同個時期只能做一件事情

### 比喻

- stack 是先進後出 (例如洋芋片)
- queue 是先進先出 (例如免洗杯架)

> [stack vs queue 梗圖](https://www.reddit.com/r/ProgrammerHumor/comments/k5ejiw/stacks_vs_queues/) >[call stack 影片起始位置](https://youtu.be/8aGhZQkoFbQ?list=PLJbPeIvXVHPnMyX6J14gMZNIYZOcsfjzy)

另外 call stack 也是一種資料結構

---

## stack 的錯誤訊息範例

### 手動新增一個錯誤訊息

由於執行先後順序，也會依照 stack 機制顯示錯誤訊息
如下圖
![](https://i.imgur.com/MGL2k5D.png)

### 無窮呼叫的錯誤訊息

```javascript{numberLines: true}
function foo(){
	return foo();
}
foo();
```

在無窮呼叫當中，瀏覽器會噴出錯誤訊息如下
![](https://i.imgur.com/GXJkowh.png)

可以看的出錯誤訊息寫 call stack 已經超出最大值

### 阻塞、非阻塞

> [Huli 同步非同步、阻塞非阻塞、callback、event loop](https://blog.techbridge.cc/2019/10/05/javascript-async-sync-and-callback/)

如果我們寫了幾個需要等待的同步的程式的話，瀏覽器畫面就會卡住也就是發生阻塞 (block)
，**例如 一個很花時間的 while 迴圈**

瀏覽器當中幾乎沒有阻塞式函式 (blocking)，在 node 也是一樣，都是非同步 (async) 的函式

---

其他參考資料

> [Understanding JavaScript — Heap, Stack, Event-loops and Callback Queue](https://javascript.plainenglish.io/understanding-javascript-heap-stack-event-loops-and-callback-queue-6fdec3cfe32e)

> [promise 補充](https://pjchender.dev/javascript/js-promise/)

