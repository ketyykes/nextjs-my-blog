---
title: 從jQuery到VirtualDOM來淺談什麼是state—useState完整範例與介紹
slug: 2022-10-22T11:30:00.000Z
date: 2022-10-22T11:30:00.000Z
tags: ["React","Javascript"]
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
本篇文章將會涵蓋以下重點

- 資料變動但是畫面卻沒變？
- state設計原因
- 使用useState Hook
- setState的誤區
- state初始值—使用lazy initialState
- hook注意事項

## 資料變動但是畫面卻沒變？

在講解useState之前，我們先撰寫以下的範例
```javascript
import React, { useState } from 'react'
const App = () => {
  let number = 123;
  const incrementHandler = () => {
    number +=1;
    console.log(number);
  };
  return (
    <div>
      <div>{number}</div>
      <button onClick={incrementHandler}>+</button>
    </div>
  );
}
export default App
```

當我們點擊**onClick**的時候，可以打開主控台查看，資料的確有變動，但是畫面卻沒有更動
如下圖

![](https://i.imgur.com/DvzeWRn.png)


<span class="red">原因是我們並沒有告知react number數字已經更新了</span>，必須使用state來讓react知道畫面必須更新

## state設計原因

state是react所設置很特別的變數，透過該變數與瀏覽器的畫面綁定，當<span class="red">state改變的同時就改變瀏覽器的畫面</span>。

### jQuery style vs React.js style

由於渲染畫面是非同步的行為，前端很常做的事情是

**事件觸發→資料改變→操縱DOM→瀏覽器更新畫面(非同步行為)**

但是當事件多的時候可能就會變成下圖

![](https://i.imgur.com/3HFys6n.png)

react框架為了統一管理這些事件處理，所以用state這個特別的變數，所以整個流程如下

![](https://i.imgur.com/cIaecmI.png)

> 參考資料
> [Jquery Vs React js. Reactjs is a smart and promising framework](https://twitter.com/codingalienblog/status/942620890424074240)

### 從state到畫面更新—Virtual Dom

在偵測到**state**改變到畫面更新過程大概如下圖

![](https://i.imgur.com/FJsDhAP.png)

流程大致如下

1. 偵測到某個state改變
1. 執行diff演算法比對與先前的樹結構
1. 決議最後要繪製的dom結構
1. 在繪製到真實的browser 

由於實際操作**Browser Dom**是非常消耗效能的一件事情，因此透過**Virtual Dom**將比對子元件後，當前次的子元件與要改變的子元件不同的時候，將其子元件底下連接的所有元件直接移除後替換成改變後的子元件。

### 更有效的管理資料與畫面變動

多虧**Virtual Dom**與**diff演算法**的作法，使我們更有效的管理畫面與資料變動的依賴關係，順帶一提像是知名前端框架—vue的作法也是使用**Virtual DOM**的方式。

如下圖
![](https://i.imgur.com/5PR1Mhz.png)

> [React Virtual DOM Explained in Plain English](https://dev.to/adityasharan01/react-virtual-dom-explained-in-simple-english-10j6)
> [Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism.html#rendering-mechanism)

## 使用useState Hook

因此為了讓資料可以正確被渲染，這時候我們就要使用react其中一個hook叫做<span class="red">useState</span>。


根據官方[基礎的 Hook](https://zh-hant.reactjs.org/docs/hooks-reference.html#usestate)的文件

以下節錄自官方文件

> useState將會回傳一個state 的值，以及更新 state 的 function。
> 在首次 render時，回傳的state的值會跟第一個參數（initialState）一樣。
> setState function 是用來更新 state。它接收一個新的 state 並將 component的重新 render 排進佇列。
> 在後續的重新 render，useState 回傳的第一個值必定會是最後更新的 state。

等等將會解說這些文字是什麼

首先可以藉由一些方式理解**useState**是什麼，嘗試著<span class="red">console.log(useState(123))</span>的時候可以發現，這個function 執行結果它會**回傳一個陣列**。

```javascript
import React from 'react'
const App = () => {
  console.log(useState(123));
  return (
    <div>App</div>
  )
}
export default App
```

該陣列索引值0表示的是變數的初始值，索引值1表示是之後要用來對這個state設值的funciton，慣例上我們都會將其設定為<span class="red">set"你的變數名字"</span>的函式。

![](https://i.imgur.com/bhSHYKm.png)

通常我們會使用ES6解構賦值的方式來宣告state

因此改寫如下
```javascript
//以上省略
const App = () => {
  const [number,setNumber] = useState(123);
  return (
    <div>App</div>
  )
}
//以下省略
```

如果對於解構賦值不太理解的也可以參考官方文件[方括號代表什麼](https://zh-hant.reactjs.org/docs/hooks-state.html#tip-what-do-square-brackets-mean)或是之前撰寫[解構賦值Destructuring assignment—為什麼需要和用途](https://ithelp.ithome.com.tw/articles/10292493)的文章


這時候123就會設定成state的初始值，setNumber是用來改變number值的函式。

還記得原先寫的函式嗎？
這時候我們就可以改寫成如下即可讓react知道畫面需要更新

```javascript
//import部分以上省略
const [number, setNumber] = useState(123);
const incrementHandler = () => {
  setNumber(number + 1);
};
//render部分以下省略
```

## setState的誤區

setState使用上需要注意什麼呢？以下透過**setTimeout**範例來探討情形並且簡單實作如果在物件中使用的方式。

### 以setTimeout為例

需要注意的是地方是setStatus是一個非同步的函式
我們試著改寫範例如下讓其非同步的狀況更加明顯的時候

```javascript
//import部分以上省略
  const [number, setNumber] = useState(123);
  const incrementHandler = () => {
    setTimeout(function delay() {
      setNumber(number + 1);
    }, 1000);
  };
//render部分以下省略
```

這時候模擬非同步行為，當我們在一秒鐘內點三下的時候，最後畫面只有更新一次，這是由於<span class="red">畫面函式(也就是整個App component)重新渲染前(也就是setNumber設值後告訴react渲染畫面)，number值是都同一個</span>，即便我們點了三下，畫面函式還沒被重新執行的時候都是指的是同一個，因此最後只更新一次。


> 參考資料
> [理解React的setState到底是同步還是非同步](https://ithelp.ithome.com.tw/articles/10257994)

### update函式

根據上一個範例如果想要讓每次按下的同時都可以正確改到值的話，可以使用update函式，我們將其改寫如下
```javascript
const incrementHandler = () => {
  setTimeout(function delay() {
    setNumber((prev)=>(prev + 1));
  }, 1000);
};
```



更新函式，其第一個參數值(也就是prev)會等於上次的狀態值，因此在一秒內按下三次的時候就能夠正確累加三次了。

簡言之，在<span class="red">setState裡面帶入的函式是一個特殊函式被稱為更新函式</span>，可以確保你所依賴的state有正確被更新。

其他類似的範例像是我們想要在同一個按下事件執行三次setState函式的話，一樣可以使用update函式，下面範例當我們按下+按鈕的時候就能對數字+3了。

這邊就可以發現，<span class="red">如果當你更新後的值是仰賴於更新前值的時候，建議使用畫面更新函式以避免出錯</span>

```javascript
const [number, setNumber] = useState(123);
const incrementHandler = () => {
  setNumber((prev) => (prev + 1));
  setNumber((prev) => (prev + 1));
  setNumber((prev) => (prev + 1));
};
```

### 在物件中使用
由於我們要更新status變數的話都要使用setStatus，在物件當中若要更改值是依賴上次的值的時候，通常會使用使用展開運算子進行
範例如下
```javascript
import React, { useState } from 'react'
const App = () => {
  const [number, setNumber] = useState([1, 2, 3]);
  const incrementHandler = () => {
    setNumber((prev) => (
      [...prev, prev[prev.length - 1] + 1]
    ))
  };
  return (
    <div>
      <div>{number[number.length - 1]}</div>
      <button onClick={incrementHandler}>+</button>
    </div>
  );
}
export default App
```

## state初始值-使用lazy initialzer

根據官方文件的解說

> initialState 參數只會在初始 render 時使用，在後續 render 時會被忽略。如果初始 state 需要通過複雜的計算來獲得，你可以傳入一個 function，該 function 只會在初始 render 時被呼叫

### useState初始值傳入一個函式呼叫

假設我們給予useState的初始值是透過函式計算而來的方式，而且是<span class="red">傳入的初始值是函式執行完</span>的話，當我們點擊+的時候，觸發setStatue重新渲染畫面的時候(也就是執行整個AppFunction的時候)，checkExecuted<span class="red">函式都會被執行</span>。

但是這個範例當中初始值都是相同的，不應當再次被執行，因此我們透過下個範例來解決這項問題。

觀看以下程式碼
```javascript
import React, { useState } from 'react'
const App = () => {
  function checkExecuted() {
    console.log("被執行了");
    return 0;
  }
  const [string, setString] = useState(checkExecuted());
  const incrementHandler = () => {
    setString((prev) => (prev + 1));
  };
  return (
    <div>
      <div>{string}</div>
      <button onClick={incrementHandler}>+</button>
    </div>
  );
}
export default App
```

![](https://i.imgur.com/V9vO15p.png)

### lazy initialzer—初始值傳入一個函式

可以使用<span class="red">lazy initialzer</span>的技巧<span class="red">將初始值的計算函式傳入，而不是傳入函式執行的結果</span>，其回傳值就是useState的初始值。
```javascript
import React, { useState } from 'react'
const App = () => {
  const [string, setString] = useState(() => {
    console.log("被執行了");
    return 0;
  });
  const incrementHandler = () => {
    setString((prev) => (prev + 1));
  };
  return (
    <div>
      <div>{string}</div>
      <button onClick={incrementHandler}>+</button>
    </div>
  );
}
export default App
```

畫面如下

![](https://i.imgur.com/9p5rAYV.png)


## hook注意事項
由於useState是一種hook這邊將官方文件的hook提及注意事項如下
1. 不要在class component使用它
```javascript
//這裡就是class component
class App extends React.component {
  render () {}
}
```
2. 不要在if、迴圈、巢狀的funciton 使用它
```javascript
function App(){
  if(this == something){
    useState()
  }
}
```
> [Hook的規則](https://zh-hant.reactjs.org/docs/hooks-rules.html)



## 參考資料

* [從最基本的useState,useEffect 開始](https://medium.com/hannah-lin/react-hook-%E7%AD%86%E8%A8%98-%E5%BE%9E%E6%9C%80%E5%9F%BA%E6%9C%AC%E7%9A%84-hook-%E9%96%8B%E5%A7%8B-usestate-useeffect-fee6582d8725)
* [React思考模式：從hook入門到開發實戰](https://www.books.com.tw/products/0010898837?loc=M_0005_001)
* [React Hooks: Managing State With useState Hook](https://blog.bhanuteja.dev/react-hooks-managing-state-with-usestate-hook)
* [React Virtual DOM Explained in Simple English](https://programmingwithmosh.com/react/react-virtual-dom-explained/)
* [關於 useState，你需要知道的事](https://medium.com/@xyz030206/%E9%97%9C%E6%96%BC-usestate-%E4%BD%A0%E9%9C%80%E8%A6%81%E7%9F%A5%E9%81%93%E7%9A%84%E4%BA%8B-5c8c4cdda82c)
* [useState in React: A complete guide](https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/#reacthooksupdatestate)
* [React Hook Flow](https://wityan.medium.com/react-hook-flow-e09462fc7dd3)
* [Do you know React Hooks Flow?](https://dev.to/varunprashar5/do-you-know-react-hooks-flow-24gi) 
* [useState lazy initialization and function updates](https://kentcdodds.com/blog/use-state-lazy-initialization-and-function-updates)
* [A Complete Beginner's Guide to React useState hook](https://javascript.works-hub.com/learn/a-complete-beginners-guide-to-react-usestate-hook-f85a0)
