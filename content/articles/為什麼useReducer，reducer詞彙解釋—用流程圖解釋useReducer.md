---
title: 為什麼useReducer，reducer詞彙解釋—用流程圖解釋useReducer
slug: 2022-11-09T01:10:00.000Z
date: 2022-11-09T01:10:00.000Z
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

本文章內容涵蓋以下
- 為什麼你需要useReducer
- 關於reducer詞彙
- useReducer流程圖
- useReducer使用方式

## 為什麼需要useReducer

**useReducer**與**useState**有相似之處，允許客製化**state**的邏輯部份。如果想要管理複雜的狀態邏輯，**useReducer**可以幫助你**達到關注點分離**(separate the concerns)，將其分成渲染和狀態管理，換句話說，也就是在**component檔案僅負責渲染UI**和**分派事件**，而複雜的邏輯計算管理狀態的部分可以再抽離出成另個檔案。


## 關於reducer詞彙

從原生的**Javascript**的**Array method**就有**reduce**的方法，如果將**reduce**輸入到字典翻譯的話，reducer有**把...歸納**、**把...折合(成較小單位)**，在數學的用詞解釋有<span class="red">簡化、約簡</span>，所以再回頭看**Javascript**的**Array method**也是將整個陣列經過**reducer**函式後回傳成單一值。


## useReducer流程圖
我們再來看**React**的**useReducer**就可以嘗試著解釋成將各種複雜的邏輯歸納。

整個流程會如下
1. component令事件觸發夾帶Action Object參數呼叫dispatch函式
1. dispatch函式發送Action Object給Reducer
1. Reducer處理如何更新state的邏輯後回傳State
1. State最後使Component重新渲染

![](https://i.imgur.com/U7RILUd.png)

## useReducer使用方式
這裡將分成以下部分講解

- useReducer
- reducer函式
- dispatch
  - dispatch夾帶payload 

### useReducer hook
useReducer**主要**接受兩個參數
- reducer(**簡化器、歸納器**)：換言之將狀態給歸納整理的一個函式
- initialState(**初始狀態**)：來自於react的state。

如果嘗試著印出useReducer()的話，最後useReducer會回傳一個陣列
陣列的索引值0是state，索引值1是dispatch

```javascript
console.log(useReducer());
```
![](https://i.imgur.com/lTPe08x.png)

> 這裡由於未帶入初始值，因此索引值0是undefined

## reducer函式

這邊要作為**useReducer**的參數**reducer**函式宣告方式也需要兩個參數。

- state：來自於react的state
- action：將不同的行為分門別類

action 通常為一個物件例如

```javascript
{type:'increment'}
```

這邊引用官方的範例講解
```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}
```

我們要改變計數器的狀態，其中行為分成**decrement(增加)**、**increment(減少)**，因此使用**switch case**來將行為分門別類，當收到的**action**是**decrement**的時候，將做某事(此範例是將原先數字加一)，同理**action**接收到**increment**將數字減一。

另外這邊的default意思是當不是上述參數的時候丟出一個例外狀況。

## dispatch 
有了**reducer**函式後接下來要處理觸發時機，**dispatch**解釋成**發送**，下面範例中我們將dispatch參數帶入一個物件，屬性擁有type，值為decrement和increment做為reducer函式的action的值

```jsx
function Counter() {
  const initialState = {count: 0};
  const [state, dispatch] = useReducer(reducer, initialState);
  //這邊省略了reducer函式
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

### dispatch發送夾帶payload
我們也可以在dispatch的時候夾帶參數，記得在reducer的時候將參數取出作為action行為觸發的時候帶入要處理的邏輯部分。


```jsx
function Counter() {
    const [number, dispatch] = useReducer(reducer, initialState);
    return (
        <>
            Count: {number.count}
            <button onClick={() => dispatch({ type: 'decrement'})}>-</button>
            <button onClick={() => dispatch({ type: 'increment'})}>+</button>
        </>
    );
}
```

## 惰性初始化(Lazy initialization)

這部分要講解的內容與先前文章[從jQuery到VirtualDOM來淺談什麼是state—useState完整範例與介紹](./2022-10-22%20Sat)的useState類似可以進行lazy initialState。

當初始狀態是需要經過複雜的計算的function的時候，可以透過**lazy initialzer**帶入到useReducer的第三個參數，概念大致如下

```jsx
function init(initialState){
  // 很多複雜的程式碼
  // 很多複雜的程式碼
  // 很多複雜的程式碼
  //經過複雜的計算後
  return initialState
}

function Counter() {
    const [number, dispatch] = useReducer(reducer, initialState,init);
    return (
        <>
            Count: {number.count}
            <button onClick={() => dispatch({ type: 'decrement'})}>-</button>
            <button onClick={() => dispatch({ type: 'increment'})}>+</button>
        </>
    );
}
```

透過init這個函式可以讓下次re-render的時候避免再次消耗計算效能，另外如果建立初始狀態的init函式不需要任何引數計算的話，可以將useReducer的第二個參數設為null
如下

```jsx
const [state, dispatch] = useReducer(reducer, null,init)
```

希望以上內容有幫助到大家，也歡迎留言如果有錯誤也歡迎糾正。

##### 參考資料

> [An Easy Guide to React useReducer() Hook](https://dmitripavlutin.com/react-usereducer/)
> [React useReducer Hook ultimate guide](https://blog.logrocket.com/react-usereducer-hook-ultimate-guide/#reducer-function)
> [官方useReducer介紹](https://zh-hant.reactjs.org/docs/hooks-reference.html#usereducer)
> [reactBeta—Avoiding recreating the initial state](https://beta.reactjs.org/apis/react/useReducer#avoiding-recreating-the-initial-state)
