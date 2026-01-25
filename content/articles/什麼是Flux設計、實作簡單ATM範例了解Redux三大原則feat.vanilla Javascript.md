---
title: 什麼是Flux設計、實作簡單ATM範例了解Redux三大原則feat.vanilla Javascript
slug: 2022-11-23T09:34:00.000Z
date: 2022-11-23T09:34:00.000Z
tags: ["Javascript"]
---

本文提及以下內容
- 前言
- flu字根
- flux設計模式-單向資料流
- Redux
- 使用vanilla Javascript ATM範例
- 小結
 
## 前言

了解Redux的概念可以追溯到先前facebook(現在改名叫做meta)公司的演講，他們提出MVC所遇到的問題以及提出flux的設計概念，本篇文章會重點式講述flux的概念，Redux是flux的概念底下所做出的一種實踐，redudx不單只是只能用在React，他是一種狀態管理的library，因此也會以原生js實作一個簡單的範例來理解redux的原理。

## Flu字根

介紹flux之前我們先看flu字根的英文

- flu開頭源自拉丁文fluere是flow(流動的意思)
  - flush(激流)、fluent(流暢)、fluxion(流動)
- 與flow組合的字
  - inflow(流入)、overflow(溢出)
- fl開頭為flow同源的字
  - float(飄動)、flood(洪水)

從英文字母可以了解一切的根源在於**流**，flux主要也是在控管整個資料流動的設計。


## Flux設計模式-單向資料流

### 傳統MVC所遇到的問題

在傳統MVC的設計模式會導致視圖(view)與模型的關係複雜，有可能一個視圖來自於不同的model，也可能導致無限循環的情形產生。如下圖

![](https://i.imgur.com/TmfDcyP.jpg)

為了解決資料流混亂的問題，因此提出了flux的設計概念。

如下圖

![](https://i.imgur.com/BbudpFM.png)

> 圖片來源：[Flux官方網站-In-Depth Overview](https://facebook.github.io/flux/docs/in-depth-overview)

### Flux的角色

1. action 促進資料傳遞給dispatcher的輔助方法(規範改變資料的動作)
3. dipatcher 收到action和payload廣傳到被註冊的callback(被註冊的store)
4. store 應用程式狀態和邏輯處理(也就是被註冊的callback)的容器
5. view 根據資料渲染UI和監聽使用者的事件


### flux優點
- view專注在顯示資料(不用撰寫邏輯)
- 資料和邏輯統一存放
- 明確定義每個角色使開發者快速理解App行為


## Redux

flux設計模式提出，facebook也開源了flux的專案，但目前官方已經處於維護狀態並且推薦了其他狀態管理的library像是**Redux、MobX、Recoil**。

如下圖

![](https://i.imgur.com/I6FFHW8.png)

>圖片來源：[facebook/flux](https://github.com/facebook/flux)

另外有興趣的人也可以觀看stack overflow的redux開發者的回答[Why use Redux over Facebook Flux?](https://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux/32920459#32920459)更可以了解redux與flux的差別。

接下來講述redux發展的動機。

### 動機

- SPA(單頁應用程式)蓬勃發展
- 狀態多樣化(例如伺服器資料、暫存資料、本地端資料)

隨著Javascript單頁應用程式發展，需要管理許多狀態，這些狀態包含**伺服器、資料暫存、本地端**還**沒有正式儲存到伺服器的資料**等等，`即便react簡化了事件流程，但state還是留給開發者自行管理`。


**state**狀態傳遞的時候遇到的瓶頸

![](https://res.cloudinary.com/practicaldev/image/fetch/s--6FBCjTcb--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/u4jh8mkvtnzrhzdfwtam.png)

在沒有**Redux**之前狀態是需要在各個**component**之間傳遞十分麻煩，有了**Redux**後將狀態統一儲存在**store**配發給每個**component**


圖片來源[First Day Guide to Redux](https://dev.to/voralagas/first-day-to-redux-531)

![](https://d33wubrfki0l68.cloudfront.net/01cc198232551a7e180f4e9e327b5ab22d9d14e7/b33f4/assets/images/reduxdataflowdiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

UI接收到事件觸發後使用**dispatch**發送**action**到**store，store**經由所接收到的**action**到**reducer**處理對應的**action**後回傳**state**，UI接收到**state**
圖片來源[Redux Application Data Flow](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#redux-application-data-flow)

## 三大原則

- [單一來源](https://redux.js.org/understanding/thinking-in-redux/three-principles#single-source-of-truth)
  - 作為應用程式全域的state儲存了Object tree在單一的store裡面
- [State是唯讀屬性](https://redux.js.org/understanding/thinking-in-redux/three-principles#state-is-read-only)
  - state只能透過發送action來改變，如此一來確保view或者fetch的callback都不會直接寫入到state，透過集中管理嚴格照順序的逐一觸發。


- [修改只能是純函式](https://redux.js.org/understanding/thinking-in-redux/three-principles#changes-are-made-with-pure-functions)
  - 撰寫reducer的函式只能是pure function，透過接收先前的state和action回傳新的state

## ATM範例

這邊以提款機範例展示Redux

- 一個帳戶內擁有存款
- 可以更改狀態(存款)的ATM提款機


提款機範例最小化redux基本要素包含以下
- action物件
- initState物件
- reducer函式
- store

提款機範例中的角色各司其職

### action物件
一個最基礎的action物件，帶有type的屬性，用來作為dispatch的參數，稍後將會被reducer函式接受做出對應的動作。
以此範例而言，action可以存款和提款
```javascript
{
  type: 'DEPOSIT'
}
{
  type: 'WITHDRAW'
}
```


### initState物件
定義state的初始值的物件，換句話說算是資料的初始值，以此範例為一個key為money，值為1000的物件。
```javascript
const initState = {
  money: 1000
}
```

### reducer

```javascript
function ATMReducer(state = initState, action) {
  switch (action.type) {
    case 'DEPOSIT':
      return { money: state.money + 100 }
    case 'WITHDRAW':
      return { money: state.money - 100 }
    default:
      return state
  }
}
```

`reducer作為改變state`的函式，負責`邏輯處理`，這邊接收兩個參數，第一個參數是`state的初始值`第二個參數是`action`，透過switch用來辨認等等接收的dispatch的動作是哪一種類型，以此範例的話`解析action的type`，將state的物件+100或-100，這邊可以發現撰寫方式是`immutable`，我們不直接更改state裡面的值，而是`創造一個新的物件return`回去。

### store檔案

```javascript
//初始化一個store將reducer代入
let store = createStore(ATMReducer);
//當改變發生的時候要做什麼事情
//這裡帶入一個callback
//透過store.getState就可以讀取當前state的東西
store.subscribe(() => console.log(store.getState()));
//發送WITHDRAW的action
store.dispatch({
    type: 'WITHDRAW'
});
store.dispatch({
    type: 'DEPOSIT'
});
store.dispatch({
    type: 'WITHDRAW'
});
```

- createStore()初始化一個store代入reducer
- store.subscribe 改變發生的時候要做什麼事情
- store.dispatch 發送action

完整程式碼如下

```javascript
import { createStore } from 'redux'
const initState = {
    money: 1000,
}
const depositActionCreator = (payload) => (
    {
        type: 'DEPOSIT',
        payload
    })
const withdrawActionCreator = (payload) => (
    {
        type: 'WITHDRAW', payload
    }
)
function ATMReducer(state = initState, action) {
    switch (action.type) {
        case 'DEPOSIT':
            return { money: state.money + action.payload }
        case 'WITHDRAW':
            return { money: state.money - action.payload }
        default:
            return state
    }
}
let store = createStore(ATMReducer);
store.subscribe(() => console.log(store.getState()));
store.dispatch(depositActionCreator(100));
store.dispatch(withdrawActionCreator(200));
store.dispatch(depositActionCreator(500));
```

## 小結
希望透過vanilla javascript可以更了解redux，如果內容有誤歡迎底下留言，希望以上內容對大家有所幫助。

##### 參考資料

- [深入淺出 Flux](https://medium.com/4cats-io/%E6%B7%B1%E5%85%A5%E6%B7%BA%E5%87%BA-flux-44a48c320e11)
- [ReduxBook](https://chentsulin.github.io/redux/docs/basics/Reducers.html)
- [First Day Guide to Redux](https://dev.to/voralagas/first-day-to-redux-531)
- [facebook的flux repo](https://github.com/facebook/flux)
- [Hacker Way: Rethinking Web App Development at Facebook](https://youtu.be/nYkdrAPrdcw?t=737)
- [Why use Redux over Facebook Flux?](https://stackoverflow.com/questions/32461229/why-use-redux-over-facebook-flux/32920459#32920459)
