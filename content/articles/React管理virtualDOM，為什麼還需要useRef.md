---
title: React管理virtualDOM，為什麼還需要useRef?
slug: 2022-10-29T13:31:00.000Z
date: 2022-10-29T13:31:00.000Z
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

本文將提及以下內容

- 做到什麼事情?
- 解決什麼問題?
- useRef代入參數
- 在jsx的屬性當中加入ref
- focus效果範例
- ref無法藉由react管理
- 簡述實際應用場景

## 做到什麼事情?

- 當希望組件記得某些事情，但是又不想要觸發重新渲染的時候，我們可以使用useRef。
- 選到某個native DOM實體

## 解決什麼問題?

有時候我們得要等到畫面渲染之後才進行Javascript的操控，例如在input的欄位，實現聚焦效果(focus)，我們需要確切只到實際的DOM，因此這時候就得透過useRef用來存取實際DOM元素了。


根據**react beta**版本的官方文件解釋

> useRef is a React Hook that lets you reference a value that’s not needed for rendering.

大致意思是**useRef**是讓你參照一個值卻不會發生重新渲染的hook。


## useRef代入參數

我們可以嘗試著在**useRef**當中帶入"hello"字串

觀看以下範例
```jsx
import { useRef } from 'react'
function App() {
  const helloRef = useRef("hello")
  console.log(helloRef);
  return (
    <div>
      App
    </div>
  )
}
export default App
```

最後呈現下圖

![](https://i.imgur.com/PaCg0WL.png)

可以看到上述印出**helloRef**會印出一個物件，裡面有一個current的key，物件的值是"hello"。


這裡搭配使用**useState、useEffect、useRef**來記得渲染的次數，我們撰寫一下範例

```jsx
import { useState, useRef, useEffect } from 'react'
function App() {
  const [text, setText] = useState("");
  const number = useRef(0);

  useEffect(() => {
      number.current = number.current + 1;
  });

  return (
    <>
      <input
          type="text"
          value={text}
          onChange={
          (e) => setText(e.target.value)
        }
      />
      <h1>總共渲染起次{number.current}</h1>
    </>
  );
}
export default App
```

由於**useEffect**的第二個值不帶入參數表示每次重新渲染後會執行**useEffect**裡面的事情，因此我們將number進行加總，不會因為重新渲染導致該**current**的值不一樣，換句話說，每次渲染的物件是同一個，因此我們在text輸入了a~j總共有十個英文字母就會渲染10次，如下圖

![](https://i.imgur.com/0FEtpap.png)

## 在jsx的屬性當中加入ref

我們可以透過**useRef**搭配屬性ref來存取DOM，換句話說，他提供了一個管道使我們可以參照到實際的HTMLelement。

```jsx
function App() {
  const divRefContrainer = useRef(null);
  return (
    <div className="test" ref={divRefContrainer}>嗨</div>
  )
}
```

上面的語法相當於我們在使用vanilla javascript的下面的語法

```javascript
const divElement = document.querySelector(".test")
```
## focus效果範例

平時React將大多數的操作行為儲存在memory當中，等到先行比對Virtual Dom開始進行diff演算法，最後再實際掛載到真實的DOM當中，但有些事件是必須先渲染完後才能進行。

例如執行focus效果必須擁有真實的input DOM元素才能將效果呈現出來。我們可以觀看以下範例

```jsx
import { useRef } from 'react'
function App() {
  const inputRef = useRef(null)
  const handClick = () => {
    inputRef.current.focus();
  }
  return (
    <>
      <input
          type="text"
          ref={inputRef}
      />
      <button onClick={handClick}>按我聚焦</button>
    </>
  );
}
export default App
```
![](https://i.imgur.com/8yY8X4j.png)

## ref無法藉由react管理

需要注意的地方，不要過度使用，大多數情形我們希望react來管理狀態，透過useRef將其掛載在DOM上面會導致state和資料不統一的情形，觀看以下範例

```jsx
import { useRef, useState } from 'react'
function App() {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("")
  const handClick = () => {
    inputRef.current.focus();
    inputRef.current.value = '為什麼被改變了'
  }
  console.log("沒有觸發rerender");
  return (
    <>
        <input
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={e => setInput(e.target.value)}
        />
        <div>我輸入的東西{inputValue}</div>
        <button onClick={handClick}>按我聚焦</button>
    </>
  );
}
export default App
```

通常在我們輸入字母到畫面上的input的時候應當會因為onChage事件，所以畫面會印出我所輸入的字母。

![](https://i.imgur.com/HTBNTKY.png)

這時候如果我們改用**按我聚焦**的方式改變畫面上的input內容時卻不會顯示
如下圖
![](https://i.imgur.com/2kZq7uY.png)

這是因為我們透過useRef的方式將value輸入到input的元素當中，也沒有觸發reRender，而且inputValue和 inputRef.current.value並不一致，所以最後就沒有顯示在畫面上了。

## 簡述實際應用場景

- 管理focus聚焦效果
  - input元素點擊後聚焦事件 
- 文字選取
  - 選取文字後可能需要複製文字
- 影片播放元素
  - 影片播放的我們希望按暫停、播放等等
- 觸發動畫
  - 像是滑鼠滾輪到某個定點後觸發動畫
- Infinite Scroll
  - 無限滾動畫面 

## 小結
另外文章有錯誤的部分歡迎糾正，希望有幫助到大家。

##### 參考資料
- [ReactBeta—useRef](https://beta.reactjs.org/apis/react/useRef)
- [4 React Refs Examples](https://nordschool.com/react-refs/)
- [Manipulating the DOM with Refs](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs)
- [When to Use React.useRef](https://aaronbos.dev/posts/using-react-useref-hook)
- [useRef in React](https://javascript.plainenglish.io/implementing-useref-in-react-732908aa1998)
- [React: How to implement an infinite scroll](https://medium.com/suyeonme/react-how-to-implement-an-infinite-scroll-749003e9896a)
