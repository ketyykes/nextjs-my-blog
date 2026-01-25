---
title: Rereact Note - Adding Interactivity (Part1 2-1~2-2)
slug: 2023-05-20T13:31:00.000Z
date: 2023-05-20T13:31:00.000Z
tags: ["React","Rereact club"]
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
@media (max-width: 576px) {
  .rem25{
    font-size:2rem;
  }
  .rem40{
    font-size:3.0rem;
  }
  .rem50{
    font-size:3.5rem;
  }
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
word-break: keep-all;
}
</style> 

前言可以參考[Rereact club Note + 前言 — Describing the UI - all](/tech-page/2023-05-13%20Sat)，此篇為舉辦Rereact club讀書會時，導讀該週並且參照React官方文件和其他網路資源加上自身理解所構成的筆記。也希望這些筆記能對你有所幫助😆。

## 事件處理器 alert

使用alert主要為了方便查看事件處理器觸發，另外由於alert和渲染無關，所以就不需要使用useState。

我們在上層的時候傳入一個事件處理器

```jsx
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

實際範例[React Alert](https://codesandbox.io/s/h1031c?file=/App.js&utm_medium=sandpack)

## 添加事件

你可以按照以下三個步驟，在用戶點擊時使其顯示一條消息：

1. 在你的Button組件內宣告一個名為handleClick的函式。
1. 在該函式內實現相應的邏輯（使用alert來顯示消息）。
1. 將onClick={handleClick}添加到`<button>`的JSX中。

```jsx
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

在事件撰寫可以使用一般的func#####tion

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

## 帶入的是function而不是function執行的結果

事件處理器中傳遞的函式必須是傳遞而不是被呼叫。例如：

| passing a function (correct)         | calling a function (incorrect)         |
| ------------------------------------ | -------------------------------------- |
| &lt;button onClick={handleClick}&gt; | &lt;button onClick={handleClick()}&gt; |

由於JSX都會執行一次，如果帶入的是一個函式的話，當初次渲染的時候到這個Component的時候就會執行

如果不希望每次渲染的時候執行，以`alert()`為例，我們就得使用一個function包裹

### 傳遞function vs 呼叫function

<br>

| 傳遞一個function    (正確的)                                        | 呼叫一個function (不正確)                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------- |
| <span class="code red"><button onClick={() => alert('...')}></span> | <span class="code red"><button onClick={alert('...')}></span> |

### 每次渲染時呼叫

下面的例子告訴我們每次渲染的時候就會呼叫。

```jsx
// 這個alert在組件渲染時被觸發，而不是在點擊時！
<button onClick={alert('You clicked me!')}>
```

### 點擊才呼叫

如果你想要在inline方式定義事件處理器，可以像以下方式將其包裹在匿名函式中

```jsx
<button onClick={() => alert('You clicked me!')}>
```

透過匿名函式或取名為handleClick都是帶入一個function

* `<button onClick={handleClick}>` passes the `handleClick` function.
* `<button onClick={() => alert('...')}>` passes the `() => alert('...')` function.

如果希望帶入**handlerClck()**的話也可以使用return 一個function 的方式。

如下
```javascript
function AlertButton({ message, children }) {

  function handlerClck (){
    return function(){
      alert(message);
    }
  }
  return (
    <button onClick={handlerClck()}>
      {children}
    </button>
  );
}
```

## 將事件處理器做為prop傳遞

下面的範例使我們可以複用Button，透過傳遞不同的props觸發不同的行為。

```jsx
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}
export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

## Stop propagation 

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

### 小知識點

每個事件在三個階段中進行傳播：

1. 它向下傳播，呼叫所有onClickCapture處理器。
2. 它執行被點擊元素的onClick處理程序。
3. 它向上傳播，呼叫所有onClick處理器。

### 防止預設行為

一些瀏覽器事件與預設行為相關聯。例如，當點擊`<form>`內部的按鈕時，會觸發表單的提交（submit）事件，預設情況下會重新載入整個頁面。


## 請使用button、不要使用div

確保你使用適當的HTML標籤來處理事件。例如，要處理點擊事件，請使用<span class="code red">&lt;button onClick={handleClick}&gt;</span>而不是<span class="code red">&lt;div onClick={handleClick}&gt;</span>。使用真正的瀏覽器<span class="code red">&lt;button&gt;</span>可以啟用內置的瀏覽器行為，例如鍵盤導航。

## 通知React重新渲染使用setState函式

當你需要使用新數據更新元件時，需要執行兩個步驟：

1. 在重新渲染之間保留數據
2. 觸發React使用新數據重新渲染組件（重新渲染）

`useState`可以幫助我們完成這兩個步驟。

```jsx
// 使用 useState 維護數據
const [data, setData] = useState(null);

// 使用新數據來更新元件：
setData(newData); // 這將會保留數據並觸發重新渲染
```

當我們在React中需要用新資料來更新元件，我們需要透過以下兩個步驟：

1. 在重新渲染之間保留資料：我們需要一種方式，在連續的渲染過程中，來記住某些資訊。在Functional Component中，我們可以利用 `useState` 這個 Hook 來達成。

2. 觸發React用新資料重新渲染元件（即重新渲染）：當我們的資料有所更新後，我們需要通知React，告訴React我們的資料已經變更，並需要對相關的元件進行重新渲染。這時`useState` 提供的設定狀態的函式（如上述的 `setData`）可以在設定新狀態時，同時通知React進行重新渲染。

以下是 `useState` 的使用說明：

```jsx
// 首先，我們使用 useState 來創建一個狀態變數和一個設定該狀態的函式
// 這邊我們的狀態變數名稱叫做 data，而設定該狀態的函式則命名為 setData
// useState 的初始值設定為 null
const [data, setData] = useState(null);

// 當我們需要使用新的資料來更新 data 時：
setData(newData); 
// 呼叫 setData 函式，新的資料 newData 將會取代原先的 data，同時觸發元件的重新渲染。我們就完成了資料的保存以及觸發更新的兩個步驟。
```

## 命名慣例和解構賦值

在React中，使用`useState`這個Hook來創建和更新狀態變數是一種常見的方式。

1. 命名慣例：通常會使用一對變數名稱來分別代表狀態變數以及用來更新該狀態的函式。
這對名稱的命名慣例是 "[變數名稱]、set[變數名稱首字母大寫]"。例如，如果你的狀態變數名為 `index`，則更新該狀態的函式應命名為 `setIndex`。

```jsx
// 使用 useState 宣告狀態變數和設定狀態的函式
const [index, setIndex] = useState(0);
```

1. 使用解構賦值：這種命名慣例的實踐方式源於ES6的解構賦值語法。當你使用 `useState` 時，它會回傳一個包含兩個元素的陣列。第一個元素是狀態變數的當前值，而第二個元素是一個函式，用於更新該狀態變數。我們可以利用解構賦值語法來方便地為這兩個值命名。

```jsx
// 使用解構賦值語法來為回傳的狀態變數和設定狀態的函式命名
const [state, setState] = useState(initialState);
```

## 局部變數的改變不會觸發渲染

在React中，局部變數的變動並不會引起元件的重新渲染。React並不會因為局部變數的改變而認為有需要重新渲染元件。

```jsx
let localVariable = 0; // 不會觸發
```

## 只能在top Level使用 Hooks

Hooks需要在React元件的頂層調用。這樣確保了每次渲染同一個元件時，Hooks的調用順序始終保持穩定。

```jsx
function Example() {
  // 正確的使用方式，使用 useState 在頂層
  const [count, setCount] = useState(0); 

  if (count > 0) { //這段if是錯誤的方式
    // 錯誤的使用方式：不應該在迴圈、條件式、或是巢狀函式中使用 Hooks
    // const [anotherCount, setAnotherCount] = useState(10);
  }
}
```

## 一起變動的值使用物件

假設有一個紀錄位置的狀態

原本程式碼如下

```jsx
const [x, setX] = useState(0);
const [y, setY] = useState(0);
setX(5);
setY(10);
```

取而代之的是使用物件的方式

```jsx
const [position, setPosition] = useState({ x: 0, y: 0 });
setPosition({ x: 5, y: 10 });
```

## Hooks重點與注意事項

- 在React中，useState以及任何以"use"開頭的函式都被稱為Hook。
- Hook是一種特殊的函式，僅在React渲染時可用。
- Hook（以 <span class="red">use</span> 開頭的函式）只能在元件的頂層或自己的 Hooks 中呼叫。
- 你不能在條件式、迴圈或其他巢狀函式中使用 Hooks。
  - 雖然Hook是一個funciton，但是宣告你所需要的component的時候請思考別使用條件宣告的方式。
  - 這樣可以確保Hooks在每次組件渲染時都以相同的順序被呼叫，從而保持狀態管理的一致性。
- 在元件的頂部使用 React 功能，就像在檔案的頂部匯入模組一樣
  - 例如<span class="red code">import React, { useState, useEffect } from 'react';</span>

## 參考資料

> * [How does React know which state to return?](https://react.dev/learn/state-a-components-memory#how-does-react-know-which-state-to-return)
> * [State is isolated and private ](https://react.dev/learn/state-a-components-memory#state-is-isolated-and-private)