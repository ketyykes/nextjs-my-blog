---
title: 深入理解 async await—concurrentAsync vs sequenceAsync
slug: 2022-08-10T01:10:00.000Z
date: 2022-08-10T01:10:00.000Z
tags: ["Javascript"]
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



當一個 function 附帶有**async**的關鍵字的時候，他被稱之為**async function**，透過**async function**將可讓**await** 關鍵字寫在裡面，反之如果不是在**async function**裡面撰寫**await**關鍵字的話將會沒有作用，另外透過**await**的關鍵字可以使其非同步操作，也可以更簡潔的方式撰寫**promise**的行為，換句話說可以免於撰寫**promise chain**。

以上翻譯自 MDN 並加入一些個人字詞以便使字句更通順
參考資料

> [MDN-asyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

## 原本 promise 寫法

首先我們可以先觀看原本 promise 的寫法再對照
觀看以下程式碼

```javascript{numberLines: true}
function resolveAfter1Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
}

//   使用prmise;
resolveAfter2Seconds().then((response) => {
  console.log("calling");
  console.log(response);
  console.log("finally");
});
```

我們建立一個 function 將會回傳建立出一個**Promise 物件**，透過**setTimeoutAPI**在一秒後將執行**resolve()**的函式

按照順序將會印出
`calling`
`resolved`
`finally`

## async await 寫法

如果換成 async 的方式改寫的話如下

```javascript{numberLines: true}
async function asyncCall() {
  console.log("calling");
  const result = await resolveAfter2Seconds();
  console.log(result);
  console.log("finally");
}
asyncCall();
```

在 function 添加 async 關鍵字後以及在 promise 物件前面添加 await 關鍵字即可得到 resolve 的值，讓我們不用撰寫 then

## async 回傳一個 promise

```javascript
console.log(asyncCall());
```

我們嘗試著印出 asyncCall()的執行結果可以發現 console 顯示 Promise，因此 async function 呼叫後回傳是一個 promise 物件
![](https://i.imgur.com/2hFAQzK.png)

因此我們當然可以使用 promise 本身.then 的方式串接 asyncCall()

觀看以下範例

```javascript{numberLines: true}
function randomNumberToMakeBigOrSmallString() {
  return new Promise((resolve) => {
    setTimeout(() => {
      let randomNumber = Math.floor(Math.random() * 10);
      if (randomNumber >= 5) {
        resolve("大");
      } else {
        resolve("小");
      }
    }, 1000);
  });
}
async function asyncCall() {
  const BigOrSmall = await randomNumberToMakeBigOrSmallString();
  return BigOrSmall;
}
asyncCall().then((response) => {
  console.log("你的幸運數字偏" + response);
});
```

我們隨機產生一個 1~10 的數字，如果大於等於 5 的話就回傳"大"，這邊使用.then 串接裡面的 callback function 接收一個參數來自於 asyncCall 的 return 值。

但通常用了 async await 後就應當避免使用.then 的寫法繼續串接下去。

## 使用 IIFE 搭配 async await

可以使用 IIFE(Immediately Invoked Function Expression)立即執行函式搭配 async 和 await

```javascript{numberLines: true}
function randomNumberToMakeBigOrSmallString() {
  return new Promise((resolve) => {
    setTimeout(() => {
      let randomNumber = Math.floor(Math.random() * 10);
      if (randomNumber >= 5) {
        resolve("大");
      } else {
        resolve("小");
      }
    }, 1000);
  });
}
async function asyncCall() {
  const BigOrSmall = await randomNumberToMakeBigOrSmallString();
  return BigOrSmall;
}
(async () => {
  console.log("你的幸運數字偏" + (await asyncCall()));
})();
```

[async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

## 錯誤處理

由於使用 async await 的 funciton 的前提是讓非同步的 code 轉換成類似同步的寫法，以往撰寫 promise 使用.then 的時候可以藉由.then 的第二個參數或是撰寫.catch 裡面的 callback 進行錯誤處理。如下

```javascript{numberLines: true}
function getNumber(number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (number >= 5) {
        resolve("大");
      } else {
        reject("太小了");
      }
    }, 1000);
  });
}
getNumber(3)
.then((response) => {
  console.log("你輸入的數字是"+response);
})
.catch((response) => {
  console.log("你輸入的數字是"+response);
});
```

### 使用 async 搭配 try catch 錯誤處理

原本的範例我們可以透過 async 和 try catch 進行改寫，範例如下

```javascript{numberLines: true}
function getNumber(number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (number >= 5) {
          resolve("大");
        } else {
          reject("太小了");
        }
      }, 1000);
    });
  }
(async () => {
    try {
      console.log("你輸入的數字是" + (await getNumber(3)));
    } catch (error) {
      console.log("無法成功的原因是" + error);
    }
  })();
```

## 得知來自於某個 await 的錯誤

### 使用多個 try catch 接收各別 await 的錯誤

如果擁有多個 await 的時候想要得知是哪一行得使用多個 try catch，撰寫如下

```javascript{numberLines: true}
(async () => {
  try {
    console.log("你輸入的數字是" + (await getNumber(3)));
  } catch (error) {
    console.log("無法成功的原因1是" + error);
  }
  try {
    console.log("你輸入的數字是" + (await getNumber(2)));
  } catch (error) {
    console.log("無法成功的原因2是" + error);
  }
})();
```

### 使用 await 串接 catch

await 所接的 function 本質是得到一個 promise，因此也可以使用原先 promise 的 catch 串接，我們在 await 後面串接 catch
程式碼如下

```javascript{numberLines: true}
(async () => {
let result1 = await getNumber(3).catch((error) => {
  return 1 + error;
});
let result2 = await getNumber(1).catch((error) => {
  return 2 + error;
});
console.log("無法成功的原因" + result1);
console.log("無法成功的原因" + result2);
})();
```

## async 搭配 promise all

### 使用 then 撰寫 promise all

撰寫以下範例 lateWakeUp 的函式在 2 秒後會執行 resolve 函式，earlyWakeUp 在 1 秒後執行 resolve 函式，使用 Promise all 的用法是將其放入可迭代的東西上(例如 array)，之後在執行 Promise all 將會平行運算(Parallel Computing)。換句話說 lateWakeUp 和 earlyWakeUp 是同時開始執行，因此在 Promise.all 開始執行的時候，1 秒後將會印出 early done，之後再過 1 秒鐘就會印出 late done

```javascript{numberLines: true}
function lateWakeUp() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("I am late");
      console.log("late done");
    }, 2000);
  });
}
function earlyWakeUp() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("I am early");
      console.log("early done");
    }, 1000);
  });
}
let early = earlyWakeUp();
let late = lateWakeUp();
Promise.all([early, late]).then((string) => console.log(string));
```

### 使用 async await 撰寫 Promise all

#### 方法一

以剛剛的範例撰寫成 asyanc await 的形式，其 all 函式裡面一樣放入陣列，在整個函式外面加上 async 的 keyword，在 Promise.all 的地方加上 await 一樣可以印出回傳值為一個陣列
程式碼如下

```javascript{numberLines: true}
async function asyncWithPromiseAll() {
  let response = await Promise.all([earlyWakeUp(), lateWakeUp()]);
  console.log(response);
}
asyncWithPromiseAll();
```

#### 方法二

另外也可以在 Promise.all 函式裡面寫一個 IIFE(Immediately Invoked Function Expression)立即執行函式，範例如下

```javascript{numberLines: true}
async function asyncWithPromiseAll() {
  let response = await Promise.all([
    (async () => {
      return earlyWakeUp();
    })(),
    (async () => {
      return lateWakeUp();
    })(),
  ]);
  console.log(response);
}
asyncWithPromiseAll();
```

這樣寫的好處是可以在立即執行函式透過撰寫 await 關鍵字在函式裡面，當 resolve 時候印出其值，而透過 Promise all 也能平行運算，範例如下

```javascript{numberLines: true}
async function asyncWithPromiseAll() {
  await Promise.all([
    (async () => {
      console.log(await earlyWakeUp());
    })(),
    (async () => {
      console.log(await lateWakeUp());
    })(),
  ]);
}
asyncWithPromiseAll();
```

## concurrentAsync vs sequenceAsync

這裡將對比同時間發生的 async 和循序發生的 async

### 建立 reslove 函式和 reject 函式

以下程式碼將會先建立出一個 1 秒後才會執行 resolve 的 Promise 函式和 1 秒後才會執行的 reject 函式

```javascript{numberLines: true}
function resolveFunction() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("I am resolve");
      console.log("resolve done");
    }, 1000);
  });
}
function rejectFunction() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject("I am reject");
      console.log("reject done");
    }, 1000);
  });
}
```

### 按順序呼叫(使用常見的方式寫 async 和 await)

這邊使用 Date.now()的方式來觀看執行的時間差，下面的範例將會依序的執行兩次 resolveFunction()，換句話說第三行呼叫完畢才會呼叫第四行

```javascript{numberLines: true}
async function sequenceAsync() {
  const start = Date.now();
  let response1 = await resolveFunction();
  let response2 = await resolveFunction();
  console.log(`The response1 is ${response1}\nThe response2 is ${response2}\nIt is spend ${
    Date.now() - start
  } ms.
  `);
}
sequenceAsync();
```

執行結果如下圖

![](https://i.imgur.com/XmJ4HdY.png)

### 使用 async await 建立一個 Parallel

透過先呼叫建立 Promise 的函式，將其存入某個變數之後再使用 await 將其內容提取出，觀看以下程式碼

```javascript{numberLines: true}
async function concurrentAsync() {
  const start = Date.now();
  const caller1 = resolveFunction();
  const caller2 = resolveFunction();
  let response1 = await caller1;
  let response2 = await caller2;
  console.log(
    `The response1 is ${response1}\nThe response2 is ${response2}\nIt is spend ${
      Date.now() - start
    } ms.`
  );
}
concurrentAsync();
```

這邊可以看到由於我們在執行兩次 resolveFunction 的時候並沒有使用 await 關鍵字，而是在第 5 行和第 6 行的時候使用 await 關鍵字將其值給提取出來，最後計算時間可以發現，他們是幾乎同時呼叫了 resolveFunction

結果如下圖

![](https://i.imgur.com/g5etaz3.png)

### concurrentAsync = Promise.all ?

既然 concurrentAsync 可以做到同時執行 resolveFunction，那我們是否可以用來替代 Promise.all 呢?

可以參考在 MDN 英文版的[async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#async_functions_and_execution_order)這個範例的 waring 部分，如果不太懂意思，在 stack overflow 上也有人針對 MDN 的 waring 部分提問連結如下

> [Promise rejection regardless of configuring catch clause on caller](https://stackoverflow.com/questions/61877051/promise-rejection-regardless-of-configuring-catch-clause-on-caller)

另外一篇 stack overflow 也有人提問連結如下，這篇的範例講解可以清楚了解當 reject 的時候，執行結果的差異。

> [Any difference between await Promise.all() and multiple await?](https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-await)

Promise.all 定義是當引數(iterable)的所有 promise 被 resolved 或者第一個被拒絕的 promise，假設使用 concurrent Async 與 multiple await 做為 thread compute 出發，當第一個 reject 回來的時候會比較短。

##### 參考資料

- [Deeply Understanding JavaScript Async and Await with Examples](https://blog.bitsrc.io/understanding-javascript-async-and-await-with-examples-a010b03926ea)
- [What is Async/Await Good For](https://alanstorm.com/what-is-asyncawait-good-for/)
- [Async function / Await 深度介紹](https://www.casper.tw/development/2020/10/16/async-await/)
- [Asynchronous Iterators for JavaScript](https://github.com/tc39/proposal-async-iteration)
- [for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
- [[JS] Async and Await in JavaScript](https://pjchender.dev/javascript/js-async-await/)
- [Asynchronous Functions 101](https://bitsofco.de/asynchronous-functions-101/)
- [Waiting for more than one concurrent await operation-stack- overflow](https://stackoverflow.com/questions/46889290/waiting-for-more-than-one-concurrent-await-operation)
- [Promise rejection regardless of configuring catch clause on caller](https://stackoverflow.com/questions/61877051/promise-rejection-regardless-of-configuring-catch-clause-on-caller)
- [Any difference between await Promise.all() and multiple await?](https://stackoverflow.com/questions/45285129/any-difference-between-await-promise-all-and-multiple-await)
- [JavaScript async and await in loops](https://zellwk.com/blog/async-await-in-loops/)
- [如何在 JS 迴圈中正確使用 async 與 await](https://iter01.com/425093.html)

