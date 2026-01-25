---
title: 解決propDrilling問題—簡化consumer的useContext
slug: 2022-11-05T11:30:00.000Z
date: 2022-11-05T11:30:00.000Z
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

本文章將提及以下內容

- props傳遞的遇到什麼問題—propDrilling
- 使用context解決propDrilling
  - Setp1 建立context環境-createContext()
  - Setp2 使用所建立的context將值設定給Provider
  - Step3 使用Consumer提取值
- 使用useContext注意事項
- useContext的問題
- 放棄使用useContext？

## props傳遞的遇到什麼問題—propDrilling

我們將component比擬成電梯，因此取名叫做Elevator的component，最上層是<span class="red">App.js</span>、最下層是<span class="red">Elevator3.js</span>

觀看以下import的階層關係

1. <span class="red">App import Elevator1</span>
2. <span class="red">Elevator1 import Elevator2</span>
3. <span class="red">Elevator2 import Elevator3</span>

範例如下
```javascript
//App.js檔案
import React, { useState } from 'react'
import Elevator1 from './Elevator1'
const App = () => {
  const [user, setUser] = useState("Tim");
  return (
    <>
      <Elevator1 user={user} />
    </>
  );
};
export default App;
```

```javascript
//Elevator1.js檔案
import React from 'react'
import Elevator2 from './Elevator2'
const Elevator1 = ({ user }) => {//為了向下傳遞接收上層傳來的props
  return (
    <>
       //為了向下傳遞必須撰寫props
      <Elevator2 user={user} />
    </>
  )
}
export default Elevator1
```
```javascript
//Elevator2.js檔案
import React from 'react'
import Elevator3 from './Elevator3'
const Elevator2 = ({ user }) => {//為了向下傳遞接收上層傳來的props
  return (
    <>
      //為了向下傳遞必須撰寫props
      <Elevator3 user={user} />    
    </>
  )
}
export default Elevator2
```
```javascript
//Elevator3.js檔案
import React from 'react'
const Elevator3 = ({ user }) => {
  return (
    <>
      {user}
    </>
  )
}
export default Elevator3
```

如果想要將**App**的值傳遞到**Elevator3**的話就得在每一層藉由**props**傳遞，其中Elevator2和Elevator1都<span class="red">沒有用到這個變數卻還是得宣告在props</span>，因此會出現(**Prop Drilling**)過度傳遞問題。

## 使用context解決propDrilling
為了避免過度傳遞，react官方提出可以使用context(備註)來解決上述問題
> 備註：如果你去查context的中文，得到的翻譯會是上下文、來龍去脈、背景、我們可以比喻成我們創造了一個背景空間，提供橋梁使得各個元件來這裡就可以得到共用值。

使用context我們關注以下三點

1. createContext()
2. Context.Provider
3. Context.Consumer 

另外**useContext**只是**Context.Consumer**的語法糖，稍後會提到解釋。

### Setp1 建立context環境-createContext()
首先我們先引入createContext，他是用來製造context的函式。
這邊我將檔案給分離出來命名成createUseContext.js
程式碼如下
```javascript
import React, { createContext } from 'react'
export const UserContext = createContext();
```

### Setp2 使用所建立的context將值設定給Provider
第二步引入剛剛所建立的檔案後，將準備值提供給Provider。

使用方式是先將剛剛所建立的context帶入到jsx裡面，透過物件取值提取Provider並設定props屬性為value，而value的值是你要共用的值，以下面範例所指的共用的值就是user這個變數。

Provider需要放在component較上層的地方，以這個範例來說App是Elevator1、Elevator2、Elevator3的上層。

在App.js引入這支檔案
```javascript
import React, { useState } from "react";
import { UserContext } from './createUserContext';
import Elevator1 from './Elevator1'
const App = () => {
  const [user, setUser] = useState("Tim");
  return (
    <>
      <UserContext.Provider value={user}>
        <Elevator1 />
      </UserContext.Provider>
    </>

  );
}
export default App
```
### Step3 使用Consumer提取值
最後要在使用值的地方藉由Consumer來提取值，記得先引入剛剛所建立的**UserContext**，並且使用**context**的**consumer**來提取共用的值。範例如下
```javascript
//在Elevator3.js
import React from 'react'
import { UserContext } from './createUserContext'
const Elevator3 = () => {
  return (
    <>
      <UserContext.Consumer>
        {value => <h1>{value}</h1>}
      </UserContext.Consumer>
    </>
  )
}
export default Elevator3
```
如期我們就可以在**Elevator3**提取到**value**。

### 使用useContext
由於要提取共用的值需要撰寫<span class="red">&lt;UserContext.Consumer&gt;</span>和<span class="red">{value => &lt;h1&gt;{value}&lt;/h1&gt;}</span>的語法過於冗長，因此使用**useContext**可以簡化。

使用的方式將剛剛所建立的**context**整個帶入到**useContext**函式裡面作為參數即可，**useContext**回傳的值就會是在**Provider**所建立的值。
範例如下

```javascript
//在Elevator3.js
import React, { useContext } from 'react'
import { UserContext } from './createUserContext'
const Elevator3 = () => {
  const name = useContext(UserContext);
  return (
    <>
        <h1>{name}</h1>
    </>
  )
}
export default Elevator3
```

## 使用useContext注意事項

[官方](https://zh-hant.reactjs.org/docs/hooks-reference.html#usecontext)提到以下幾個重點

### useContext 的參數必需為 context object 自己

- 正確: useContext(MyContext)
- 錯誤: useContext(MyContext.Consumer)
- 錯誤: useContext(MyContext.Provider)
他只是簡化了consumer的寫法，在最上層一樣需要撰寫Provider

### 巢狀的context僅會顯示內層

以先前的範例如果在Provider撰寫如下的方式，最後**consumer**只會取得比較靠近的**provider**的值。
範例如下
```jsx
<UserContext.Provider value={user}>
  <UserContext.Provider value={"test"}>
    <Elevator1 />
  </UserContext.Provider >
</UserContext.Provider>
```

## useContext的問題

<span class="red">當context的state改變的時候底下的consume將全部重新渲染</span>

換句話說，如果整個Application的state只使用一個**context**的話，那麼將會造成大量的重新渲染。

長久累積將會產生效能問題。

## 放棄使用useContext？

既然官方提出**consumer**這個hook一定有它的用處，

面對不常變動的**state**就可以考慮使用**useContext**。

另外面對重新渲染的問題也可以透過宣告不同的**context**來解決或是搭配**useMemo**來做最佳化效能處理。

[官方issue](https://github.com/facebook/react/issues/15156)有提出一些方式可以參考看看或是也可以選擇使用知名第三方套件**redux**的解決方式。

##### 參考資料

 - [The Problem with React's Context API](https://leewarrick.com/blog/the-problem-with-context/)
 - [Demystifying React Hooks: useContext](https://dev.to/milu_franz/demystifying-react-hooks-usecontext-5g4a)
 - [useContext官方文件](https://zh-hant.reactjs.org/docs/hooks-reference.html#usecontext)
 - [Preventing rerenders with React.memo and useContext hook](https://github.com/facebook/react/issues/15156)
 - [Fixing useContext Performance Issues](https://javascript.plainenglish.io/fixing-usecontext-performance-issues-bfc695f48192)