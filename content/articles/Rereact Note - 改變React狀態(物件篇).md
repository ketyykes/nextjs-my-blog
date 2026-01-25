---
title: Rereact Note - 改變 React 狀態和 Reacting to Input with State
slug: 2023-06-03T13:31:00.000Z
date: 2023-06-03T13:31:00.000Z
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

前言可以參考[Rereact club Note + 前言 — Describing the UI - all](/tech-page/2023-05-13%20Sat)，此篇為舉辦 Rereact club 讀書會時，導讀該週並且參照 React 官方文件和其他網路資源加上自身理解所構成的筆記。也希望這些筆記能對你有所幫助😆。

## 改變 React 狀態 (物件篇)

在 React 中，狀態的操作注意事項如下：

- 狀態可以保存任何類型的 JavaScript 值
- 不應直接修改 React 狀態中保存的物件。
- 當要更新一個物件時，應該建立一個新的物件或從現有物件中複製。
- 更新後的具有複製版本的物件應該被設置為新的狀態值。

## 基本型別是 immutable

- 基本資料型別（Primitive Data Type）泛指非物件且沒有方法或屬性的資料。
- 所有的基本資料型別都是不可變的 (immutable)，也就是說它們不能被修改。
- 變數可以被重新賦值為新的資料，但是原有的值是不能被改變的。

## React state in Primitive

觀看以下的例子

```jsx
const [x, setX] = useState(0);
setX(5);
```

實際上對於基本型別而言，我們並非從 0 改變成了 5，取而代之的是我們直接賦予新的值。

## 什麼是突變的物件

觀看以下範例

```jsx
const [position, setPosition] = useState({ x: 0, y: 0 });
position.x = 5;
```

我們改變物件本的 x 值，技術上來說這樣稱之為突變。

雖然 React 狀態中的物件可以撰寫可變的方式 (不過**不會觸發渲染的作用**)，但我們應該視他們為不可變，換句話說，我們不該變異這些物件，而是透過 setState 替換一個新的值。

以上範例程式碼將<span class="red rem25">不會觸發畫面渲染</span>

## state 是唯讀

觀看[Treat state as read-only 範例](https://codesandbox.io/s/gwbwpr?file=%2FApp.js&utm_medium=sandpack)

在物件中，我們沒有透過 setState 的方式改變 React 的狀態，因此無法觸發重新渲染，所以紅色的點並不會跟隨游標。

```jsx
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}

```

沒有經過<span class="red">setState 就不會觸發畫面渲染</span>

<span class="green">這就好像在吃完餐點後才試圖改變點餐的順序一樣。</span>

要在這種情況下<span class="blue">觸發重新渲染</span>，你需要<span class="blue">建立一個新的物件並將其傳遞給**狀態設置函式 (setState)。**</span>

## 設置函式

React 將遵循以下步驟

- 使用這個新物件替換 position
- 重新渲染這個組件

我們在 onPointerMove 的事件處理器位置撰寫以下程式碼

```jsx
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

藉由建立一個新的物件搭配 setState 函式就能告訴 React 觸發渲染

## 區域的突變沒關係

雖然我們一再強調 React 不建議使用 Mutation，但我們可以先行突變 (Mutation) 完後再給 setState 函式

```jsx
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

以上的程式碼等同於如下

```jsx
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

## 使用展開運算子 (spread operator) 複製物件

在建立表單的時候我們有時候會使用一個物件的形式包裹表單內的所有資料

如下程式碼

```jsx
const [person, setPerson] = useState({
  firstName: 'Barbara',
  lastName: 'Hepworth',
  email: 'bhepworth@sculpture.com'
});
```

當我們要改變 person 的狀態時候得使用 immutation 的方式建立一個新的物件給 setPerson 如下

```jsx
setPerson({
  firstName: e.target.value,
  lastName: person.lastName,
  email: person.email
});
```

對於每個屬性在建立的時候都得撰寫原先的屬性顯得過於麻煩，因此我們可以使用 spread operator 來複製每個物件屬性如下

```jsx
setPerson({
  ...person, // 複製原有的字串
  firstName: e.target.value // 但是覆蓋這個字串
});
```

對於大型表單當中我們將資料儲存在一個物件當中非常方便，因此我們[最終範例](https://codesandbox.io/s/j99jb6?file=/App.js&utm_medium=sandpack)就能夠如期的改變表單的狀態變數。

## 多個欄位使用單一事件處理器

我們對於單一表單有多個欄位的時候，為了避免在處理 name 欄位就需要一個 handleFirstNameChange，處理 E-mail 欄位就需要 handleEmailChange，因此我們可以使用中括號的方式作為單一處理器，程式碼如下

```jsx
//上面省略

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }
 return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
     /*
     
     中間省略
     
     */
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
```

## 展開語法的淺拷貝

展開語法（spread syntax）（...）在複製物件時是「淺層」的複製。

### 淺拷貝注意事項

關於淺層拷貝重點如下

- 只會複製物件的最外層屬性，而不會複製巢狀的屬性。
- 可以提高複製過程的效率，特別是對於處理大型物件。
- 如果需要複製巢狀屬性，需要多次使用展開語法來複製每個層級的巢狀屬性，以確保它們是獨立且不會相互影響。

因此，如果要進行更深層次的複製，可以使用遞迴或相應的深層複製函式來確保所有層級的巢狀屬性都被複製而不受影響。

## 巢狀物件並非真正的"巢狀"

如以下的範例看似 obj1 是在 obj2**裡面 (inside)**，但並非事實，實際上應當說 obj3 的屬性指向 (point)obj1

```javascript
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

## 更新陣列的狀態

- 可以將陣列放入狀態中，但不能直接修改它們。
- 為了避免變異（mutate）陣列，應該建立一個新版本的陣列，並將狀態更新為新版本。
- 使用展開語法 ([...arr, newItem]) 可以建立一個包含新項目的陣列。
- 使用 filter() 和 map() 可以建立具有過濾或轉換項目的新陣列。
- 使用 Immer 可以讓程式碼更簡潔，它提供了一種簡化不可變狀態更新的方式。

在 JavaScript 中，陣列（Array）只是另一種物件（Object）。就像處理物件一樣，在 React 狀態中，你應該把陣列視為唯讀。這意味著你不應該重新賦值陣列中的項目，例如 arr[0] = 'bird'，也不應該使用會修改陣列的方法，例如 push() 和 pop()。

相反，每次你想要更新陣列時，應該向狀態設定函式傳遞一個新的陣列。你可以使用陣列的非變異方法，例如 filter() 和 map()，從原始陣列建立一個新陣列。然後你可以將狀態設定為新的結果陣列。

以下是常見陣列操作的參考表。當處理 React 狀態中的陣列時，應避免使用左列中的方法，而應使用右列中的方法：



|           | 避免變異 (mutates) 陣列                                                                                      | 推薦回傳新陣列                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| adding    | <span class="red code">push</span>, <span class="red code">unshift</span>                                    | <span class="red code">concat</span>, <span class="red code">[...arr]</span> spread syntax ([example](https://react.dev/learn/updating-arrays-in-state#adding-to-an-array)) |
| removing  | <span class="red code">pop</span>, <span class="red code">shift</span>, <span class="red code">splice</span> | <span class="red code">filter</span>, <span class="red code">slice</span> ([example](https://react.dev/learn/updating-arrays-in-state#removing-from-an-array))              |
| replacing | <span class="red code">splice</span>, <span class="red code">arr[i] = ...</span> assignment                  | <span class="red code">map</span> ([example](https://react.dev/learn/updating-arrays-in-state#replacing-items-in-an-array))                                                 |
| sorting   | <span class="red code">reverse</span>, <span class="red code">sort</span>                                    | 先行複製 ([example](https://react.dev/learn/updating-arrays-in-state#making-other-changes-to-an-array))                                                                     |


## slice 和 splice 在名稱上相似，但實際上有很大的不同


slice 允許你複製一個陣列或其中的一部分。
splice 則會對陣列進行變異（插入或刪除項目）。
在 React 中，你會<span class="red rem25">更常使用 slice（沒有 p！）</span>，因為你不希望在狀態中變異物件或陣列。


## 添加元素到陣列中使用 array spread

```javascript
[
  ...artists, // 包含所有舊元素的部分
  { id: nextId++, name: name } // 以及在最後添加的新元素
]
```

使用展開語法（spread syntax）將原有的 artists 陣列展開，然後在最後添加一個新的物件，其中包含指定的 id 和 name。這樣可以建立一個新的陣列，同時保持原有陣列的不變性。

## 刪除陣列中的元素使用 filter

```javascript
setArtists(
  artists.filter(a =>
    a.id !== artist.id
  )
);
```

從 artists 陣列中過 filter 掉特定 id 的 artist，並將 filter 後的結果設定為新的 artists 狀態，換句話說，filter 掉特定 id 的 artist 等同於刪除特定 id 的 artist。

## 取代陣列的元素使用 map

```javascript
const nextCounters = counters.map((c, i) => {
  if (i === index) {
    // Increment the clicked counter
    return c + 1;
  } else {
    // The rest haven't changed
    return c;
  }
});
setCounters(nextCounters);
```

根據指定的索引位置增加計數器的值，並將更新後的結果設定為新的 counters 狀態。它使用 map() 方法遍歷 counters 陣列，如果索引值相符，就將計數器值加 1，否則保持不變。最後更新 counters 狀態。

## 插入元素到陣列中使用展開運算子搭配 slice()

```javascript
const insertAt = 1; // 可以是任何索引值
const nextArtists = [
  // 插入點之前的元素
  ...artists.slice(0, insertAt),
  // 新增的元素
  { id: nextId++, name: name },
  // 插入點之後的元素：
  ...artists.slice(insertAt)
];
setArtists(nextArtists);

```

首先定義了一個 insertAt 變數，用來表示要插入新元素的索引位置。

然後使用展開運算子（spread operator）和 slice() 方法來建立一個新的 nextArtists 陣列。這個陣列由三部分組成：

- ...artists.slice(0, insertAt)：
  - 將原始 artists 陣列中插入點之前的所有元素展開到新陣列中。
- { id: nextId++, name: name }：
  - 插入一個新的元素，它是一個具有特定 id 和 name 屬性的物件。
- ...artists.slice(insertAt)：
  - 將原始 artists 陣列中插入點之後的所有元素展開到新陣列中。


最後使用 setArtists 函式將新的 nextArtists 陣列設定為更新後的 artists 狀態。

## 先複製陣列後進行變異再設值

以下方程式碼將 list 陣列中的 item 進行反轉（倒序）並更新狀態為例子

```javascript
const nextList = [...list];
nextList.reverse();
setList(nextList);
```

遵循以下步驟

- 使用展開運算子 ... 建立一個新的陣列 nextList，其內容與原始的 list 陣列相同。
- 使用陣列的 reverse() 方法將 nextList 陣列中的 item 反轉，即改變它們的順序。
- 使用 setList 函式將反轉後的 nextList 陣列設定為新的 list 狀態。

## 更新陣列當中的物件

以下方程式碼為例陣列當中擁有物件
```javascript
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];
```

要複製巢狀物件具有以下方式

- JSON stringify 後再 JSON.parse 得注意 JSON 缺乏某些資料型別
- 使用迴圈得注意每層複製都得 immutate
- immer 套件
- 重新以不同的結構方式扁平化

[點我參見範例](https://codesandbox.io/s/mfvh7f?file=%2FApp.js&utm_medium=sandpack)


## 參考資料

> - [Object Mutation In JavaScript](https://blog.devgenius.io/object-mutation-in-javascript-c1a4bc27dea2)

<br>
<br>

---

## 命令式的程式 (imperative pragramming)

在命令式的程式撰寫當中，你必須根據發生的情況寫出確切的指令來操作 UI。

如下圖：想像自己坐在車上，告訴駕駛員要如何轉彎前進。

![](https://react.dev/images/docs/illustrations/i_imperative-ui-programming.png)

## 宣告式的 UI

宣告式的 UI 可以理解你宣告了想要顯示什麼，然後 React 負責更新 UI

如下圖：想像一下坐進計程車後，告訴司機你要去哪裡，而不是告訴他們該怎麼轉彎。司機的工作是把你帶到目的地。

![](https://react.dev/images/docs/illustrations/i_declarative-ui-programming.png)

### 描述 component 狀態

描述 component 處於不同的狀態，根據使用者輸入作為狀態的切換就像設計師在描繪 UI 設計稿的時候會在畫布上面定義不同種的狀態一樣。

你只要告訴 React 什麼樣的狀態該渲染什麼樣 UI 就好。

如下圖：就像函式一樣，帶入什麼樣的 state 就會回傳 UI

![](https://hackmd.io/_uploads/HyDHiDpU3.png)

> 圖片來源：[Flutter-doc](https://docs.flutter.dev/data-and-backend/state-mgmt/declarative)

1. 辨識組件的不同視覺狀態
1. 確定好這些狀態變化的觸發器 (trigger)
1. 使用 useState 將狀態儲存在記憶體中
1. 刪除任何非必要的狀態
1. 連結事件處理器來設定狀態

## 狀態機

- 狀態機（State machine）是一種數學模型，用於描述系統的行為，特別是隨著時間的推移而變化的行為。
- 狀態機由一組狀態（State）和在這些狀態之間轉換的規則（Transitions）組成。
- 在狀態機中，系統的行為被建模為從一個狀態轉換到另一個狀態的過程。
- 每個狀態代表系統在某個特定時間點的狀態，而狀態之間的轉換則表示系統在不同條件或事件觸發下的轉變。
- 狀態機可以有不同的類型，包括有限狀態機（Finite State Machine）和無限狀態機（Infinite State Machine）。
- 在軟體開發中，狀態機被廣泛應用於處理複雜的系統行為，幫助開發人員將系統的行為和狀態抽象出來，並定義清晰的轉換邏輯。
- 在狀態管理庫或框架中，如 React 的狀態管理庫（如 Redux、Mobx）或有限狀態機庫（如 XState），狀態機的概念被應用於管理應用程式的狀態和行為，提供了專用的工具和語法便於建立、管理和渲染狀態機。

### 有限狀態機

有限狀態機（Finite State Machine，簡稱 FSM）是一種數學模型，用於描述具有有限個狀態和狀態之間的轉換規則的系統。它是狀態機（State Machine）的一個特殊類型。

在有限狀態機中，系統的行為被建模為從一個狀態轉換到另一個狀態的過程，並且轉換是根據一組預定義的規則執行的。每個狀態代表系統在某個特定時間點的狀態，而狀態之間的轉換則表示系統在不同條件或事件觸發下的轉變。

有限狀態機的主要特點包括：

1. 有限個狀態：有限狀態機只能處於一組預定義的狀態之一。每個狀態可以代表系統的某種狀態或行為。
2. 狀態轉換：狀態之間的轉換是根據事先定義的規則執行的。當特定條件或事件發生時，系統將根據這些規則從一個狀態轉換到另一個狀態。
3. 事件驅動：有限狀態機的狀態轉換通常是基於特定事件的觸發。這些事件可以是外部輸入、內部事件或時間的變化。
4. 規則定義：有限狀態機的轉換規則被事先定義並存儲在狀態機的描述中。這些規則描述了在特定狀態和事件條件下，系統應該從一個狀態轉換到另一個狀態。

有限狀態機在軟體開發中廣泛應用，特別是在處理複雜的系統行為、狀態管理和業務邏輯時。它可以幫助開發人員以可視化和結構化的方式設計。

> 補充資料狀態機
> [Finite-state machine-wiki](https://en.wikipedia.org/wiki/Finite-state_machine)

## 畫出狀態變化圖以便理解所有 state

![](https://hackmd.io/_uploads/SkhXABew2.png)

## 實際範例

實際範例如下

```jsx
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

