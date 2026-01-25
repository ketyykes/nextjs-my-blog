---
title: 從實作 To Do List 理解 redux toolkit—分段講解 step by step(下)
slug: 2022-11-19T13:31:00.000Z
date: 2022-11-19T13:31:00.000Z
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
.blue{
  color:blue;
}
.green{
  color:green;
}
.gray{
background-color:#d3d3d3;
}
</style>

本文內容將提及以下內容
- 前言
- 資料夾結構
- 具體程式碼
    - toDoSlice 檔案 - 分段講解
    - store 資料夾底下的 index.js 檔案
    - 最上層的 index.js 檔案
    - AddToDo 檔案
    - ListToDo 檔案
    - ToDoItem 檔案
- 小結

## 前言

先前的文章[解決 propDrilling 問題—簡化 consumer 的 useContext](./2022-11-05%20Sat)提及 useContext 將會有效能隱憂，因此在第三方套件庫當中發展了許多狀態管理的 library，其中以 redux 最為大宗，我們透過 useReducer 和 useContext 來製作 reducer 和 context 環境，接下來將來演示如果使用 redux 的解決方案又是如何設定。
以下將以目前 redux react 推薦的 toolkit 版本實作 to do list

## 資料夾結構
在 src 底下的資料夾結構，store 資料夾包含 toDoSlice 用來產生 reducer、action 等等，而 index.js 撰寫 store 的設定。

```bash
│  App.js
│  index.js
│
├─components
│  └─Todo
│          AddToDo.jsx
│          index.jsx
│          ListToDo.jsx
│          ToDoItem.jsx
│
└─store
        index.js
        toDoSlice.js
```

## 具體程式碼

### <span class="green">toDoSlice 檔案 - 分段講解</span>

使用 redux 的 createSlice 可以方便產出 actions 和 reducer，我們只要在<span class="red">createSlice</span>裡面<span class="red">撰寫 name、initialState</span>和<span class="red">reducers 物件</span>，而 reducers 物件裡面包含 reducer 的 function，就可以輕易產出了。

我們將分段講解 toDoSlice 檔案

#### <span class="rem25">Step1：建立 initialState 物件</span>

這裡先從 redux 的 toolkit <span class="green">引入 createSlice</span>
建立一個 initialState 稍後將帶入 createSlice 物件
```javascript
import { createSlice } from '@reduxjs/toolkit';

//宣告一個物件叫做 initialState 裡面，裡面包含 state，這裡的 state 是一個陣列叫做 listDate
const initialState = {
    listData: [
        {
            content: "測試",
            id: 409823109843,
            done: false
        },
        {
            content: "測試二",
            id: 543098209,
            done: false
        }
    ]
}
```

#### <span class="rem25">Step2：設定 createSlice</span>
<span class="green">createSlice 為一個函式</span>，其參數要帶入物件，將剛剛建立的 initialState 作為 key 和 value 帶入，另外也需要給一個 name 和 reducers 物件其撰寫方式如下

```javascript
export const toDoSlice = createSlice({
    name: 'toDo',
    initialState,//簡化的寫法其值是 key 和 value
    reducers: {
        addToDo: (state, action) => {
            const toDo = {
                content: action.payload,
                id: Date.now(),
                done: false
            }
            state.listData.push(toDo);
        },
        deleteToDo: (state, action) => {
            state.listData = state.listData.filter(
                toDoItem => toDoItem.id !== action.payload
            );
        },
        completeToDo: (state, action) => {
            const index = state.listData.findIndex((todo) => (todo.id === action.payload));
            state.listData[index].done = !state.listData[index].done
        }
    },
})
```
#### <span class="rem25">Step3：匯出 toDoSlice 建立的 reducer 和 actionCreator</span>
將 addToDo 和 deleteToDo 和 completeToDo 匯出稍後的 useDispatch 將會用到。
另外也會將 toDoSlice.reducer 設為 default 匯出，等等 configureStore 將會使用。

```javascript
export const { addToDo, deleteToDo, completeToDo } = toDoSlice.actions;
//將 toDoSlice.reducer 設為 default 匯出，等等 configureStore 將會使用
export default toDoSlice.reducer
```

我們可以<span class="red">console.log(toDoSlice)</span>觀看 createSlice 幫我們產出的內容如下圖

![](https://i.imgur.com/mUFxVhT.png)

### store 資料夾底下的 index.js 檔案

以下檔案將透過 configureStore 設定 store

#### combineReducers 函式

第一種方式可以將剛剛從 toDoSlice 建立的 toDoReducer 引入然後交給 combineReducers 函式製作，<span class="green">其所回傳的值可以給 configureStore 使用</span>。
#### 自己撰寫 reducer 的物件

第二種方式是自己撰寫 reducer 的物件，其物件內容就是放入剛剛在 toDoSlice 所建立的 toDoReducer
```javascript
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux';
import toDoReducer from './toDoSlice';

// 方法一 如果有多個 slice 的話可以透過 combineReducers 將其結合
// const reducer = combineReducers({ toDoReducer })
// const store = configureStore({
//     reducer
// })

// 方法二 直接在物件裡面宣告一個 key 為 reducer 值為你所建立的 reducer
//透過 configureStore 的方式設定 store 
const store = configureStore({
    reducer: {
        toDoReducer
    }
})
export default store;
```

### 最上層的 index.js 檔案
如同 useContext 的用法，其 store 需要包含所有需要用到的元件，以便後續某個 component 需要使用，如下列程式碼

我們將剛剛 store 所建立的檔案放入作為 Provider 的 value

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import App from './App';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```
### AddToDo 檔案

<span class="green">引入 useDispatch 作為用來分派事件的函式</span>，其引入 addToDo 是從 toDoSlice 匯出的 actionCreator 函式，addToDo 帶入的參數就是 payload。

```jsx
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { addToDo } from '../../store/toDoSlice'
const AddToDo = () => {
  //in-line style 的部分
  const margin0Auto = { width: "300px", margin: "0 auto" };
  const textAlign = { textAlign: "center" };

  //引入 useDispatch 作為稍後分派事件使用
  const dispatch = useDispatch();

  //使用 Controlled component
  const [input, setInput] = useState("");
  const inputChange = (e) => {
    setInput(e.target.value);
  }

  //透過從 toDoSlice 引入的 addToDo 函式，其函式為一個 actionCreator
  //所以我們將 input 作為 payload 帶入即可。
  return (
    <div style={{ ...textAlign, ...margin0Auto }}>
      <input type="text" value={input} onChange={inputChange} />
      <button onClick={() => {
        dispatch(addToDo(input));
        setInput('');
      }}>add</button>
    </div>
  )
}

export default AddToDo
```

另外我們也可以嘗試著<span class="red">console.log(addToDo("test"))</span>看看。
如下圖，此函式的確回傳一個 action 物件
![](https://i.imgur.com/HoM6bes.png)

### ListToDo 檔案
這邊引入<span class="green">useSelector 將 state 提取出來</span>，我們需要的是 listData，因此使用解構的方式將 listDate 提取後作為遍歷 ToDoItem 的 array

```jsx
import React from 'react'
import ToDoItem from './ToDoItem';
import { useSelector } from "react-redux";
const ListToDo = () => {
  //in-line style 的部分
  const margin0Auto = { width: "300px", margin: "0 auto" };

  //透過 useSelector 將 store 的 state
  const {listData} = useSelector((state) => state.toDoReducer);
  return (
    <ul style={margin0Auto} >
      {listData.map((data) => {
        return <ToDoItem key={data.id} content={data.content} id={data.id} done={data.done} />
      })}
    </ul >
  )
}
export default ListToDo
```


當然我們也可以使用<span class="red">console.log(useSelector(state => state));</span>
其回傳如下圖

![](https://i.imgur.com/V8Xqqpj.png)

這邊的 toDoReducer 是來自於我們 store 的 configureStore 的 key 值，而 state 就是當初 initialState 的值

### ToDoItem 檔案
最後同理引入 deleteToDo 和 completeToDo 這兩個 actionCreator 函式透過 useDispatch 分派 action

```jsx
import { deleteToDo, completeToDo } from '../../store/toDoSlice'
import { useDispatch } from "react-redux";

const ToDoItem = ({ id, content, done }) => {
  const margin10 = { margin: "10px" };
  const displayFlex = { display: "flex", justifyContent: "center", alignItems: "center" };
  const displayBlock = { display: "block" };

  const dispatch = useDispatch();
  return (
    <li style={{ ...margin10, ...displayFlex }}>
      <input type="checkbox"
        checked={done} onChange={() => { dispatch(completeToDo(id)) }}
      />
      <p style={
        { textDecoration: done ? 'line-through' : 'none' }
      }
      >
        {content}
      </p>
      <button style={{ ...margin10, ...displayBlock }} onClick={() => {
        dispatch(deleteToDo(id))
      }}
      >
        delete
      </button>
    </li >
  )
}
export default ToDoItem
```
## 小結
藉由實作 to do list 理解 redux 的運作方式，可以發現在實作上面需要許多步驟，有時候我們僅是要將狀態的邏輯部分抽離出來或是 state 的變更並不會時常操作時仍然可以使用 useContext 來解決狀態管理，當應用程式大到一定的數量級以上的時候就能考慮使用 redux 的做法。
本系列告一段落了，希望以上希望對大家有所幫助。