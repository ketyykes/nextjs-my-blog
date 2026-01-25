---
title: 從實作To Do List理解Listing State Up(附圖)(上)
slug: 2022-11-12T01:10:00.000Z
date: 2022-11-12T01:10:00.000Z
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

本文將以實作To Do List理解Listing State Up
包含以下部分
- component拆分—圖解
- lifting-state說明
- 重要概念
- 具體程式碼
- 小結—Listing State Up造成什麼問題

## component拆分—圖解

我們拆分App、AppToDo、ToDoItem、ListToDo這幾個component以下針對component要做的事情做簡單的說明

- AddTodo：
  - 提供輸入代辦事項的**input**，
  - 輸入完input後按下 <kbd>add</kbd> 即可新增事項
- ListToDo：
  - 渲染所有的代辦事項
- ToDoItem：
  - 顯示個別的代辦事項
  - 按下<kbd>delete</kbd>即可刪除該代辦事項
  - 按下勾選框即可在代辦事項內容顯示刪除線
- App：
  - 包含整個代辦事項的應用程式

具體呈現如下圖每個顏色的線框表示一個<span class="blue ">**component**</span>

![](https://i.imgur.com/L2Iqgtx.jpg)

## lifting-state說明
根據react官方[提升state](https://zh-hant.reactjs.org/docs/lifting-state-up.html)的解釋，當我們有一些<span class="red">**component擁有相同的資料需要變化的時候，建議使用共享的state提升到最靠近的共同ancestor**</span>。

以本範例當中，我們會有<span class="blue">共同的state變數</span>叫做<span class="blue">`listData`</span>，listData是一個所有代辦事項內容的array，其中這些component都依賴此state，我們會在App這個祖層(ancestor)的component宣告state，然後透過props傳遞。

![](https://i.imgur.com/EPlka6Q.jpg)

## 重要概念
- single source of truth
- top-down data flow

lifting State底下的官方說明如下
> There should be a single “source of truth” for any data that changes in a React application. Usually, the state is first added to the component that needs it for rendering. Then, if other components also need it, you can lift it up to their closest common ancestor. Instead of trying to sync the state between different components, you should rely on the top-down data flow.

以這個範例而言，我們將資料建立在App component，<span class="blue">資料由上而下透過props傳遞</span>到ToDoItem和AddToDo，這些<span class="blue">元件仰賴的來源是App元件所建立的state</span>。也就符合了<span class="red">**single source of truth**和**top-down data flow**</span>

## 具體程式碼

### 資料夾結構
具體建立資料夾可以如下的方式
在<span class="blue">components</span>資料夾建立ToDo資料夾
其中包含<span class="blue">AddToDo</span>和<span class="blue">ListToDo</span>和<span class="blue">ToDoItem</span>以及<span class="blue">index.js</span>

Todo裡面的index.js僅彙整component再export讓App.js做引入

在toDo資料夾底下的index.js程式碼如下
```javascript
export {default as AddToDo} from './AddToDo.jsx';
export {default as ListToDo} from './ListToDo.jsx';
```

資料夾結構如下

```bash
│  App.js
│  index.js
└─components
    └─Todo
        AddToDo.jsx
        index.jsx
        ListToDo.jsx        
        ToDoItem.jsx  
```
## 程式碼部分
### App檔案
透過<span class="rem25 red">state lifting</span>的方式將<span class="green">state宣告在共同祖層(ancestor)</span>的app.js
```jsx
import React, { useState } from 'react'
import { AddToDo, ListToDo } from './components/Todo'
const App = () => {
  //將listData state宣告在上層
  const [listData, setListData] = useState([]);
  return (
    <div >
      <AddToDo setListData={setListData} />
      <ListToDo listData={listData} setListData={setListData} />
    </div>
  )
}
export default App
```
### AddToDo檔案

<span class="green">props接收從父層App component的setListData</span>，如果使用者輸入完畢按下新增按鈕來新增代辦事件的時候呼叫setListData
```jsx
import { useState } from 'react';
const AddToDo = ({ setListData }) => {
  //in-line style的部分
  const margin0Auto = { width: "300px", margin: "0 auto" };
  const textAlign = { textAlign: "center" };

  const [input, setInput] = useState("");

  const inputChange = (e) => {
    setInput(e.target.value);
  }

  const addHandler = () => {
    //避免輸入空白
    if (input.trim() === "") { return }
    //來自App component的setListData函式
    setListData(
      (prev) => ([...prev, {
        content: input,
        id: Date.now(),
        done: false
      }])
    )
    //按下新增後清空input
    setInput('');
  }

  return (
    <div style={{ ...textAlign, ...margin0Auto }}>
      <input type="text" value={input} onChange={inputChange} />
      <button onClick={addHandler}>add</button>
    </div>
  )
}
export default AddToDo
```
### ListToDo檔案

這個component只負責遍歷listData內容來渲染`<ToDoItem/>`元件並將所需要用到的props和<span class="green">setListData繼續往下傳給子層</span>的<span class="blue">`ToDoItem`</span>元件。
```jsx
import React from 'react'
import ToDoItem from './ToDoItem';
const ListToDo = ({ listData, setListData }) => {
  //in-line style的部分
  const margin0Auto = { width: "300px", margin: "0 auto" };
  //使用map來render<ToDoItem /> 並將listData這個array裡面的item屬性透過props傳遞給ToDoItem
  return (
    <ul style={margin0Auto} >
      {listData.map((data) => {
        return <ToDoItem setListData={setListData} key={data.id} content={data.content} id={data.id} done={data.done} />
      })}
    </ul >
  )
}
export default ListToDo
```

### ToDoItem檔案
接收來自ListToDo的props其中包含用來更新ListData狀態setListData
```jsx
import React from 'react'
const ToDoItem = ({ id, content, setListData, done }) => {
  const margin10 = { margin: "10px" };
  const displayFlex = { display: "flex", justifyContent: "center", alignItems: "center" };
  const displayBlock = { display: "block" };
  const deleteHandler = () => {
    setListData((prev) => (prev.filter(item => item.id !== id)))
  }
  const completeHandler = (id) => {
    setListData(prev => {
      return prev.map(item => {
        if (item.id === id) {
          item.done = !item.done;
        }
        return item;
      })
    });
  }
  return (
    <li style={{ ...margin10, ...displayFlex }}>
      <input onChange={() => completeHandler(id)} type="checkbox" />
      <p style={{ textDecoration: done ? "line-through" : "none" }}>
        {content}
      </p>
      <button onClick={deleteHandler} style={{ ...margin10, ...displayBlock }}>delete</button>
    </li>
  )
}
export default ToDoItem
```

最後應當可以看到如下圖
![](https://i.imgur.com/tGrmSTK.png)

## 小結—Listing State Up造成什麼問題

這邊可以發現ListToDo並沒有實質使用setListData函式，因為其子層元件ToDoItem需要使用的原因，所以得透過props接收來自App.js後再次透過props轉傳給子層的ToDoItem，這邊僅傳遞兩層，如果遇到其<span class="red">共通ancestor需傳遞給子元件過多層數</span>時候，此一現象稱之為<span class="red">props drilling</span>

另外在處理addHandler、completeHandler、deleteHandler的邏輯程式碼都會寫在其component裡面，為了改善上述兩種情形此系列(中)將搭配使用**useContext**和**useReducer**。

##### 參考資料
- [官方文件—Lifting State Up](https://reactjs.org/docs/lifting-state-up.html)