---
title: 用 toDoList 淺談原生 JS、Vue、React 寫法
slug: 2022-04-08T07:34:00.000Z
date: 2022-04-08T07:34:00.000Z
tags: ["React","Javascript","Vue"]
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

## 初衷

根據[stateofjs](https://2021.stateofjs.com/zh-Hant/libraries/front-end-frameworks)的統計目前知名的前三大前端框架為**React、Vue、Angular**(如附圖)
![](https://i.imgur.com/knX4zI2.png)，另外根據 Google trend 顯示台灣對於 Vue 及 React 更是比 Angular 的搜尋趨勢有更顯著的差異(如附圖)
![](https://i.imgur.com/r8xPyJA.png)

為了感受其差別，這邊撰寫 React、Vue 和原生 JS 的 to do list 來體驗一下。

## VanillaJS(原生 JS)

### HTML 結構

首先我們先刻出簡單的 html 結構，這邊<span class="red">`<li>`</span>的地方先放假資料，由於本次目標主要重點是在 Javascript 邏輯的部分，因此就不寫外部的 css 檔案，用 inline-style 當作行內樣式。

```html{numberLines: true}
<p>
 <input type="text" id="input" /><!-- 這邊加入id屬性是為了之後使用js方便選取該元素-->
 <button id="add">add</button><!-- 這邊加入id屬性是為了之後使用js方便選取該元素-->
</p>
<ul id="ul"><!-- 這邊加入id屬性是為了之後使用js方便選取該元素-->
<!-- 這邊的li僅先繪製出來，等等在javascript邏輯部分要渲染的html結構與這裡會有關係 -->
 <li id="li" style="margin: 10px; text-decoration: line-through">
  <input type="checkbox" />測試<button style="margin: 10px">
   delete
  </button>
 </li>
</ul>
```

### 使用 Js 選取元素

接下來選取**add、input**和**ul**元素，等等將會掛載事件監聽，順便宣告一個**listArray**來存放代辦事項的資料。

```javascript{numberLines: true}
const getAddElement = document.getElementById("add");
const getInputElement = document.getElementById("input");
const getUlElement = document.getElementById("ul");
```

### 新增代辦事項(addFunction)

首先我們先在 add 按鈕上面監聽，當按下 add 按鈕的時候將資料寫入到**listArray**，然後我們命名在監聽事件要執行的函式叫做**addFunction**，在代辦事項當中使用<span class="red">`Date.now()`</span>暫時作為[UUID(通用唯一辨識碼)](https://zh.wikipedia.org/wiki/%E9%80%9A%E7%94%A8%E5%94%AF%E4%B8%80%E8%AF%86%E5%88%AB%E7%A0%81)使用(備註)

```javascript{numberLines: true}
let listArray = [];
getAddElement.addEventListener("click", addFunction);
  function addFunction() {
    let item = {
    date: Date.now(),//這邊暫時使用Date.now()來當作UUID
    content: getInputElement.value,
    done: false,
  };
listArray.push(item);
//render(listArray);等等將會有一個render function
}
```

這邊按鈕按下去後還不會有畫面的呈現，主要是為了做[關注點分離(Separation of concerns)](https://zh.wikipedia.org/wiki/%E5%85%B3%E6%B3%A8%E7%82%B9%E5%88%86%E7%A6%BB)，預計將資料處理和畫面渲染的動作分開成不同函式。

> 備註：更好的做法可以使用[uuid 套件](https://www.npmjs.com/package/uuid#uuidv5name-namespace-buffer-offset)有興趣可以自行查閱。

### 渲染函式(renderFunciton )

接下來撰寫**render function**，這邊使用<span class="red">innerHTML</span>先將先前的內容清空，再根據接收到的資料(listArray)來繪製<span class="red">`<li>`</span>的內容，其中在 html 的部分，將資料的 date(也就是剛剛所說作為 uuid)的部分設置在<span class="red">`dataset`</span>作為識別不同的<span class="red">`<li>`</span>。

```javascript{numberLines: true}
function render(listTodo) {
  getUlElement.innerHTML = "";
  var string = "";
  listTodo.forEach(function (item) {
    //這邊使用inline style在text-decoration當作是否已完成，若已完成的話將增加刪除線
    string += `
                <li style="margin: 10px; text-decoration: ${
                  item.done ? "lineThrough" : "none"
                };" data-id=${item.date}><input type="checkbox"
                ${item.done ? "checked" : ""}
                />
                  ${item.content}
                  <button style="margin: 10px">
                    delete
                  </button>
                </li>`;
  });
  getUlElement.innerHTML = string;
}
```

目前已經將**render 的 funciton** 寫完後，應當可以看到畫面的呈現。

### 刪除和勾選已完成的代辦事項(deleteFunction、completeFunction)

同理刪除該代辦事項和已完成也一樣綁定監聽事件其程式碼如下

```javascript{numberLines: true}
/*刪除事件將會監聽刪除按鈕，
  之後得到刪除按鈕的id後，
  比對原本的listArray裡面的資料，
  將不是點擊刪除按鈕的資料留下來，
  (換句話說就是留下沒被點刪除的資料，
  因為你點刪除資料當然就不見了阿XD)
*/
getUlElement.addEventListener("click", deleteFunction);
function deleteFunction(e) {
  if (e.target.nodeName === "BUTTON") {
    let thisLi = e.target.parentNode;
    let date = thisLi.dataset.id;
    listArray = listArray.filter(function (el) {
      return el.date.toString() !== date;
    });
    render(listArray);//最後重新渲染listArray的資料
  }
}

/*監聽已完成checkbox，
 點擊後藉由得到dataset的id比對listArray當中的資料，
 將原本done改成true或false
*/
getUlElement.addEventListener("change", completeFunction);
function completeFunction(e) {
  if (e.target.nodeName === "INPUT") {
    console.log(e.target);
    let thisLi = e.target.parentNode;
    let date = thisLi.dataset.id;
    listArray.forEach(function (el) {
      if (el.date.toString() == date) {
        el.done = !el.done;
      }
    });
    console.log(listArray);
    render(listArray);//最後重新渲染listArray的資料
  }
}
```

## Vue.js

首先使用[vue-cli](https://cli.vuejs.org/zh/guide/#cli-%E6%9C%8D%E5%8A%A1)，先全域安裝其指令如下<span class="red">`npm install -g @vue/cli`</span>，接下來就可以使用指令<span class="red">`vue create [專案名稱]`</span>來建置一個專案了(備註)

> 備註：搭建鷹架(英文為 scaffolding 亦翻譯腳手架)作為快速搭建專案的方式更多請參考[vue-cli-overview](https://cli.vuejs.org/guide/#overview)

### 單文件組件(Single-File Components)

這邊使用[單文件組件](https://staging-cn.vuejs.org/guide/scaling-up/sfc.html)的方式建置代辦事項，並且將整個 to do list 做為一個**component**(其實要拆分 component 還是可以拆得更細，但不在這次主要討論範疇因此先暫且不拆)，因此在 src 的資料夾底下結構大致如下

```bash
│  App.vue
│  main.js
│
│
└─components
        toDo.vue
```

> [vue-單文件組件](https://staging-cn.vuejs.org/guide/scaling-up/sfc.html)

### Template

在 toDo 的 vue 檔案裡面寫了[模板語法](https://staging-cn.vuejs.org/guide/essentials/template-syntax.html)，該語法是基於 HTML 模板所構成的東西，可以被一般瀏覽器和 HTML 解析器解析，Vue 再將其編譯成 Javascript 並結合**響應式系統(Reactivity)**，如果想要寫得像 react 的渲染函式或式 JSX 的話，vue 也可以達到，可以參見官方的[渲染函式&JSX](https://staging-cn.vuejs.org/guide/extras/render-function.html)，不過官方也提到這樣做將不能得到與模板相同的編譯優化。

另外官方使用 vue-cli 鷹架所建置出來的內容也是預設使用模板系統(備註)

這邊會在**template**裡面除了常見的 html 的標籤以外，也會嵌入一些**vue 語法**，像是<span class="red">`v-model、v-on、v-for、v-bind`</span>等等，在程式碼旁邊將會撰寫簡單說明如下

```javascript{numberLines: true}
<template>
  <p>
    <input type="text" v-model="input" />//透過v-model綁定使用者輸入的文字與接下來的data函式input變數的值
    <button v-on:click="addHandler">add</button>//使用v-on撰寫按鈕按下時要做的事件處理函式
  </p>
  <ul>
    <li
      v-for="item in listArray" //透過v-for遍歷data裡面的listArray
      v-bind:key="item.date"
      v-bind:style="{
        textDecoration: item.done ? 'line-through' : 'none'
      }"//對屬性動態綁定，換句話說可以撰寫data函式的變數，也能使用函式表達式的方式動態改寫屬性。
    >
      <input type="checkbox" v-on:change="changeHandler(item)" />{{
        item.content
      }}<button v-on:click="deleteHandler(item)" style="margin: 10px">
        delete
      </button>
    </li>
  </ul>
</template>
```

> 官方也是推薦使用模板系統撰寫，更多資訊可以參考官方文件[模板 vs 渲染函式](https://staging-cn.vuejs.org/guide/extras/rendering-mechanism.html#template-vs-render-functions)

### Reactivity Fundamentals(響應式)

透過響應式的方式來宣告元件的狀態，換句話說結合**template**撰寫的內容在元件建立實體的時候會使用這邊的函式。更多可以參考[響應式基礎](https://staging-cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)

- data()函式
  - 原先的**template**也有**listArray**和**input**變數，這些變數就是參照我們在**data 函式**裡面定義的內容
- methods 物件
  - 這邊可以對元件添加方法，**method**可以說是包含很多方法的物件，已剛剛的 template 為例就是在`<span class="red">v-on</span>`的地方要觸發的事件函式，值得一提的地方式透過**this.變數名稱**來指向 data 裡面的變數。

以下**addHandler、deleteHandler、changeHandler**除了需要透過**this**指向正確的變數外，函式內的方法與原生 JS 寫法大同小異，則不再闡述。

```javascript{numberLines: true}
<script>
export default {
  name: "toDo",
  data() {
    return {
      listArray: [],
      input: "",
    };
  },
  methods: {
    addHandler() {
      let object = {};
      object.content = this.input;
      object.date = Date.now();
      object.done = false;
      this.listArray.push(object);
    },
    deleteHandler(item) {
      this.listArray = this.listArray.filter(function (el) {
        return el.date != item.date;
      });//透過this.xxxx用來指向data()函式裡面的變數值
    },
    changeHandler(item) {
      this.listArray.forEach(function (el) {
        if (el.date == item.date) {
          el.done = !el.done;
        }
      });
    },
  },
};
</script>
<!-- 添加scoped的屬性是表示此css僅能在此元件使用-->
<style scoped></style>
```

> 更多細節可參考[vue-聲明方法](https://staging-cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#declaring-methods)

## React

在 React 方面在命令提式字元使用<span class="red">`npx create-react-app XXX`</span>的方式可以快速建立一個專案捆包，其 src 資料夾結構大致如下

```bash
│  App.js
│  index.js
│
└─components
        Todo.js
```

### Function component

目前根據 16.8 版本後所撰寫的方式官方推薦使用 function 的方式結合 hook 來建置 react，想了解更多資訊可以參考官方[hook 的動機](https://zh-hant.reactjs.org/docs/hooks-intro.html#motivation)說明。

### JSX

接下來我們在**component function**的 return 的地方撰寫畫面，可以發現 return 的東西長得很像 HTML，實際上這些 code 稱之為[JSX](https://zh-hant.reactjs.org/docs/introducing-jsx.html)，而原本像是 html 就有的<span class="red">`onclick`</span>之類的撰寫方式，在 JSX 當中變成[駝峰式](https://zh.wikipedia.org/zh-tw/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)寫法，使得我們可以對觸發後的事件執行相對應的事情，另外在{}當中可以直接使用 javascript 語法撰寫函式表達式來指定要渲染的內容。例如可以參考程式碼當中 list.map(以下略...)那一段，比較值得一提的地方是**onChange**和**onClick**要帶入參數的話，得用 callbackFunction 的方式。(備註)

> 備註：若帶入函式加小括弧(也就是只有寫`completeHandler(listItem.date)`)的話，畫面在載入的時候就會被執行，但這種情況並非我們想要的結果，我們希望是在按下 click 後或者 chage 事件發生的時候再觸發，因此再用一個 callback 函式包裹住。

```javascript{numberLines: true}
import React, { useState } from "react";
const Todo = () => {
  return (
    <>
      <p>
        <input type="text" value={input} onChange={inputHandler}></input>
        <button onClick={addHanndler}>add</button>
      </p>
      <ul>
        {list.map((listItem) => { //渲染list的資料的內容
          return (
            <li
              style={listItem.done ? { ...margin, ...deleteLine } : margin}
              key={listItem.date}
            >
              <input
                type="checkbox"
                checked={listItem.done}
                //要帶數值進去所以要多一個callback
                onChange={() => completeHandler(listItem.date)}
              />
              {listItem.content}
              <button
                style={margin}
                onClick={() => deleteHandler(listItem.date)}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default Todo;
```

### hook 與事件處理

剛剛在 JSX 的事件處理要觸發的函式將會寫在 component 函式當中，可以注意到我們也宣告了 list 和 input 透過解構的方式引用了 useState 這個 hook，這邊可以理解成跟畫面渲染有關係的資料得透過 hook 的方式進行連動，要更改資料的部分也是透過 setInput 和 setList 這個函式來進行，值得一提的地方是`setList([...list, inputObject])`的寫法是透過`...list`[展開運算子](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Spread_syntax)得到變動前的值然後加入新的物件到陣列當中作為要變動後的值。更多可以參考官方網站[hook](https://zh-hant.reactjs.org/docs/hooks-intro.html)的解說。

```javascript{numberLines: true}
const Todo = () => {
  const margin = { margin: 10 };
  const deleteLine = { textDecoration: "line-through" };
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);
  const inputHandler = (e) => {
    setInput(e.target.value);
  };
  const addHanndler = (e) => {
    const inputObject = {
      content: input,
      date: Date.now(),
      done: false,
    };
    setList([...list, inputObject]);//透過展開運算子來展開list然後再加入物件組成新陣列最後透過setList函式更改list變數。
  };
  const completeHandler = (date) => {
    const newList = list.map((el) => {
      if (el.date === date) {
        el.done = !el.done;
      }
      return el;
    });
    setList(newList);
  };
  const deleteHandler = (date) => {
    console.log(date);
    const newList = list.filter((el) => {
      return el.date !== date;
    });
    setList(newList);
  };
}
return //(以下省略)


```

## 總結

在寫完 Vue 和 React 和原生 js 的 to do list 後，可以理解為什麼有些人說 React 寫起來比較像是 Javascript、Vue 比較像在寫原本的 HTML 以下簡單比較一下寫法。

### 寫法差異

#### Vue 的寫法

用 template 的方式撰寫合法的 html，對於原本不用框架的人來說相對上手比較容易，另外在 template 有一些增強的語法可以簡單的使用來控制畫面處理的邏輯，例如<span class="red">`v-for`</span>的方式就可遍歷出<span class="red">`<li>`</span>另外把資料和方法建立在**Reactivity Fundamentals**(響應式基礎)系統當中，比喻就好像填空題，將資料放入**data 函式**，將要操作的方法放入**method 物件**當中。

#### React 的寫法

用**JSX**的方式作為基礎來撰寫，如果初次使用的的人突然看到<span class="red">`return(<div>Hello World</div>)`</span>的話，將會難以理解，另外今天的範例使用<span class="red">`list.map()`</span>的表達式來將<span class="red">`<li>`</span>給遍歷後渲染，而且你可以寫事件處理和宣告變數在 return **JSX**之前，換句話說就像 Javascript 在撰寫函式的時候將要執行的內容執行完再 return 出去，諸如此類的作法更像是在寫**Javascript**。

