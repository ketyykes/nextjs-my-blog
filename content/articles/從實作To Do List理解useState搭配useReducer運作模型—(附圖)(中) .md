---
title: 從實作 To Do List 理解 useContext 搭配 useReducer 運作模型—(附圖)(中)
slug: 2022-11-16T10:37:54.000Z
date: 2022-11-16T10:37:54.000Z
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

本文將以實作 To Do List 理解 Listing State Up
包含以下部分
-  useContext 運作模型—圖解
-  useReducer 運作模型—圖解
-  資料夾結構
-  具體程式碼

為了解決需要透過層層元件傳遞，因此可以使用 context 將 status 統一管理，透過訂閱的方式將所需的 status 取出，就可以避免僅是為了父傳遞給子元件的子元件而必須在第一層的子元件的 props 當中接棒傳給第二層子元件。

## useContext 運作模型—圖解
大致可以理解成下圖的方式
![](https://i.imgur.com/JlgZfLk.jpg)

## useReducer 運作模型—圖解

另外將處理的邏輯抽離出來到 reducer，component 僅做派送 action 物件給 reducer 最後回傳給訂閱的 component status 大致如下圖

* action creator 僅製作 action 物件
* dispatch 負責派送 action 物件
* reducer 接收 action 物件和 status
* status 依據所訂閱的 component 渲染

![](https://i.imgur.com/ognnXCG.jpg)

## 資料夾結構

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
        toDoActionCreator.js
        toDoContext.js
        toDoReducer.js
```

我們將建立一個<span class="green">store 資料夾</span>用來<span class="green">儲存 handler 的邏輯以及 listData 的 state</span>，其中包含三個檔案<span class="blue">**toDoActionCreator**、**toDoContext**、**toDoReducer**</span>

## 程式碼部分

### toDoContext 檔案

這個檔案僅用來建立一個 context，稍後將會引入至 App 的檔案裡
```javascript
import { createContext } from "react";
//用來建立一個 context
const toDoContext = createContext();
export default toDoContext;
```

### toDoActionCreator 檔案

這邊的 function 是<span class="green">用來製造 action 物件</span>，其物件裡面包含要做的<span class="red">動作類型 (type) 和輸入值 (payload)</span>
```javascript
export function addToDo(input) {
    return {
        type: 'ADD_TO_DO',
        payload: input
    }
}
export function deleteToDo(id) {
    return {
        type: "DELETE_TO_DO",
        payload: id
    }
}
export function completeToDo(id) {
    return {
        type: "COMPLETE_TO_DO",
        payload: id
    }
}
```

### toDoReducer 檔案

reducer 函式的參數<span class="green">接收原先的 state 和要執行的 action 需要注意的是如果沒有對應的 action 的時候應當回傳原先的 state</span>。

程式部分可以看到這邊使用 switch case 來分門別類 action 物件。使用 default 用來作為當傳進來的 action 沒有對應的時候回傳原先的 state，

```javascript
function toDoReducer(state, action) {
    switch (action.type) {
        case 'ADD_TO_DO':
            if (action.payload === "") { return state; }
            return [
                ...state,
                {
                    content: action.payload,
                    id: Date.now(),
                    done: false
                }
            ];
        case 'DELETE_TO_DO':
            return state.filter(
                toDoItem => toDoItem.id !== action.payload
            )
        case 'COMPLETE_TO_DO':
            return state.map(item => {
                if (item.id === action.payload) {
                    item.done = !item.done;
                }
                return item;
            })
        default:
            return state;
    }
}
export default toDoReducer;
```

### App 檔案
最後我們在 app 檔案引入 toDoContext 和 toDoReducer，接下來將宣告 listData state 並將<span class="green">透過 context 發布至底下的 component</span>

```javascript
import React, { useReducer } from 'react'
import { AddToDo, ListToDo } from './components/Todo';
import toDoContext from './store/toDoContext';
import toDoReducer from './store/toDoReducer';
const App = () => {
  //這邊給定了初始狀態將其發布
  const initialState = [
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
  ];
  // 透過 Provider 將 listData 和 dispatch 發佈
  const [listData, listDispatch] = useReducer(toDoReducer, initialState);
  return (
    <div >
      <toDoContext.Provider value={{ listData, listDispatch }}>
        <AddToDo />
        <ListToDo />
      </toDoContext.Provider>
    </div>
  )
}
export default App
```

### AddToDo 檔案
這裡先引入 useContext，將 toDoContext 所建立的<span class="green">context 給放入到 useContext 的參數中，就能簡單的提取出裡面的值</span>，這邊我們提取 listDispatch，另外也要引入 ActionCreator，其預計用來製造 action 的物件，將 listDispatch 放到 onClick 事件函式當中，當按下 add 的時候就會使用 listDispatch 分派 action，其透過接收 input 參數給 actionCreator 作為 payload 的用途。

```javascript
import { useState, useContext } from 'react';
import toDoContext from '../../store/toDoContext';
import { addToDo } from '../../store/toDoActionCreator';
const AddToDo = () => {
  //in-line style 的部分
  const margin0Auto = { width: "300px", margin: "0 auto" };
  const textAlign = { textAlign: "center" };

  //使用 Controlled component
  const [input, setInput] = useState("");
  const inputChange = (e) => {
    setInput(e.target.value);
  }

  //提取 listDistpatch 以便稍後用來發送事件
  const { listDispatch } = useContext(toDoContext);

  return (
    <div style={{ ...textAlign, ...margin0Auto }}>
      <input type="text" value={input} onChange={inputChange} />
      <button onClick={() => {
        listDispatch(
          addToDo(input)
        )
        setInput('');
      }}>add</button>
    </div>
  )
}

export default AddToDo
```

### ListToDo 檔案

同樣引入 toDoContext 為了提取儲存在 store 的 status，另外也引入 useContext 的 hook 來簡化寫法，這時候我們就能得到 listData。

```javascript
import React, { useContext } from 'react'
import ToDoItem from './ToDoItem';
import toDoContext from '../../store/toDoContext';
const ListToDo = () => {
  //in-line style 的部分
  const margin0Auto = { width: "300px", margin: "0 auto" };
  
  //使用 useContext 提取 listData
  const { listData } = useContext(toDoContext);
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

### ToDoItem 檔案
引入 toDoContext 將其放入 useContext 提取出 listDispatch，同樣<span class="green">引入 actionCreator 來製造完成和刪除的 action 物件</span>，其參數最後會變成 action 物件的 payload

```javascript
import React, { useContext } from 'react'
import toDoContext from '../../store/toDoContext';
import { deleteToDo, completeToDo } from '../../store/toDoActionCreator';
const ToDoItem = ({ id, content, done }) => {
  const margin10 = { margin: "10px" };
  const displayFlex = { display: "flex", justifyContent: "center", alignItems: "center" };
  const displayBlock = { display: "block" };
  const { listDispatch } = useContext(toDoContext);

  return (
    <li style={{ ...margin10, ...displayFlex }}>
      <input type="checkbox"
        checked={done}
        onChange={
          () => listDispatch(completeToDo(id))
        } />
      <p style={
        { textDecoration: done ? 'line-through' : 'none' }
      }
      >
        {content}
      </p>
      <button style={{ ...margin10, ...displayBlock }}
        onClick={
          () => listDispatch(deleteToDo(id))
        } >
        delete
      </button>
    </li >
  )
}
export default ToDoItem
```
最後應當可以看到畫面如下，其中會先出現兩個 toDo 是因為我們先前在 App 那支檔案有宣告過 initialState
![](https://i.imgur.com/tsX2tJ1.png)

