---
title: Rereact Note - Adding Interactivity (Part2 2-3~2-5)
slug: 2023-05-27T13:31:00.000Z
date: 2023-05-27T13:31:00.000Z
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
}
</style> 

前言可以參考[Rereact club Note + 前言 — Describing the UI - all](/tech-page/2023-05-13%20Sat)，此篇為舉辦Rereact club讀書會時，導讀該週並且參照React官方文件和其他網路資源加上自身理解所構成的筆記。也希望這些筆記能對你有所幫助😆。

## 渲染步驟

1. Triggering 觸發渲染（將客人的訂單送到廚房）
1. Rendering 組件<span class="red">**渲染中**</span>（在廚房中準備訂單）
1. Committing 提交到DOM（將訂單放在桌子上）

## 觸發渲染條件

### 初始渲染

1. 組件的初始渲染。(initial render)
1. 組件（或其父組件之一）的狀態已被更新。

對於觸發渲染的情形來自於以上兩點，首次的渲染，其中initial又可以翻譯成最初的。第二點換句話說的意思是當父組件被重新渲染的時候，其子組件也會連帶跟著被重新渲染。

### 當State更新時重新處觸發渲染

透過[setState](https://react.dev/reference/react/useState#setstate)更新Component將會進到Queue進行渲染，可以想像這個過程就像一個餐廳的客人在第一次點餐後根據他們的口渴或飢餓程度，訂購茶、甜點和各種東西。

1. State Update...
2. ...triggers...
3. ...render!

## React 渲染你的Component

**Rendering**即是<span class="red">React呼叫你的Components</span>

- 在初次渲染中React呼叫你的rootComponent
- 對於隨後的Render，React會呼叫因為狀態更新所觸發渲染的Component

整個過程是遞迴，換句話說當渲染的Component是Return另一個Component時，就會再次呼叫該Component以此類推直到沒有任何渲染Component被呼叫。

```jsx
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg" 
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

以上面的程式碼為例

當Gallery被呼叫的時候由於Return了Image Component，因此Image會再次被呼叫。

<span class="red rem25">注意事項</span>

渲染必須是 [Pure calculation](https://react.dev/learn/keeping-components-pure)

- 相同的輸入擁有相同的輸出就像有些人點番茄沙拉，他不應該收到洋蔥沙拉
- 他只關心自身渲染，也就是他不該在Rending之前改變任何其他物件或者變數就像他點的餐點不該改變其他人的餐點

<span class="blue rem25">效能優化</span>
如果更新的組件在Tree較上層的位置，預設行為是會將所有巢狀的組件一同更新，這對性能可能造成問題，可以根據性能部分的描述選擇一些方法解決。但不要太早進行效能優化。

## React提交改變實質的DOM 

在呼叫組件後，React會修改DOM。

* 對於初始渲染，React會使用**appendChild() DOM API**將建立的所有DOM節點放置在螢幕上。
* 對於重新渲染，React將應用最小必要的操作（在渲染期間計算！）以使DOM與最新的渲染輸出匹配。

這裡我們稱之為瀏覽器<span class="red">繪製(paint)</span>
在渲染完成並且更新了DOM，瀏覽器將會重新繪製螢幕，這個過程稱為瀏覽器的渲染，但為了避免混淆，我們將其稱為<span class="red">繪製</span>。

https://codesandbox.io/s/y5b4hi?file=/App.js&utm_medium=sandpack

## State就像Snapshot

狀態變數像是Snapshot，setState並不會改變原本的狀態的變數，而是觸發重新渲染。

在[Setting state triggers renders範例](https://codesandbox.io/s/yxnodj?file=%2FApp.js&utm_medium=sandpack)當中，觸發重新渲染似乎像是按下按鈕，但實際上是透過setStatus來告訴React進行重新渲染

```jsx
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

當你點擊按鈕時，會發生以下情況：

1. <span class="red code">onSubmit</span>事件處理器執行。
2. <span class="red code">setIsSent(true)</span>將<span class="red code">isSent</span>設置為<span class="red code">true</span>並排隊進行新的渲染。
3. React根據新的<span class="red code">isSent</span>值重新渲染組件。

渲染意思是React正在呼叫你的Component，他的Local variable、Prps、State都是渲染時(呼叫時)計算得出

重新渲染組件經過以下步驟

1. React再次呼叫你的函式
1. 你的函式回傳一個新的JSX快照。
1. React將更新螢幕以匹配你return的快照。

<span class="blue">以上的步驟，簡言之，React將呼叫函式後計算得出新的JSX樣貌，最後React再根據JSX的快照更新螢幕(paint in screen)</span>

本次的渲染告訴number必須+1，當時的number原本為1，因此即便執行三次setNumber最後遞交給React也會只有進行一次加一而已。

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```


這個按鈕的點擊處理器告訴React要做以下的操作：

1. setNumber(number + 1)：此時number為0，所以setNumber(0 + 1)。
React準備在下一次渲染中將number更改為1。

1. setNumber(number + 1)：此時number為0，所以setNumber(0 + 1)。
React準備在下一次渲染中將number更改為1。

1. setNumber(number + 1)：此時number為0，所以setNumber(0 + 1)。
React準備在下一次渲染中將number更改為1。

儘管你**呼叫了三次setNumber(number + 1)**，但在此渲染的事件處理器中，number始終為0，因此你將狀態設置為1三次。這就是為什麼在事件處理器完成後，React使用number等於1重新渲染組件，而不是3。

你還可以通過在程式碼中將狀態變數替換為其值來將其可視化。

以下為逐步講解

<span class="rem25">第一次按下按鈕</span>

```jsx
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

<span class="rem25">第二次按下按鈕</span>

```jsx
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

## setState後alert

由於每次的執行該Component就像snapshot，因此當執行Counter Component時所擷取到的number是0，即便執行了setNumber後，當下的number還是當時擷取到的0

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

即便使用非同步的setTimeout也是擷取當下的number，因此最後會印出來的數字是0。


```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

在處理setState前，React會將該事件處理器的所有程式碼都被執行。

> 這可能讓你想起在餐廳點餐時服務員的行為。服務員不會在你點的第一道菜時就立即跑到廚房！相反，他們會讓你完成點菜，讓你對點菜做出更改，甚至接受桌上其他人的點菜。

## 下次渲染前多次更新相同的狀態


你可以<span class="red">**傳遞一個函式**</span>，根據<span class="red">**隊列中的前一個狀態計算出下一個狀態**</span>

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}

```

## Naming convention - 命名約定

通常update的引述名稱來自於狀態的第一個字母
例如

```jsx
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

另一種常見的命名方式是加入前綴和完整的 **state** 名稱像是<span class="red code">setEnabled(prevEnabled => !prevEnabled).</span>
