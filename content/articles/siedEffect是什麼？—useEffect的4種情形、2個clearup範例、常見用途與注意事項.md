---
title: siedEffect是什麼？—useEffect的4種情形、2個clearup範例、常見用途與注意事項
slug: 2022-10-26T13:31:00.000Z
date: 2022-10-26T13:31:00.000Z
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

# siedEffect是什麼？—useEffect的4種情形、2個clearup範例、常見用途與注意事項
sideEffect在中文裡翻譯成副作用，因此useEffect可以試著解釋成並非主要渲染的過程，這個<span class="red">hook實際上是指元件在瀏覽器中渲染完後要做的事情</span>。


useEffct是沒有回傳值，因此我們引入之後就直接使用(不像useState需要建立變數並解構)，第一個參數帶入要在Effect所做的事情，第二個參數帶入依賴項(dependencise)，通常取決於你要依賴於某個state。

## 淺談Hook Flow

可以先簡單瀏覽一下圖

![](https://i.imgur.com/Vj0wkoq.png)

以下圖片橫向的黃色圓圈分別為mount、update、unmount這三個過程
縱向的是只在其過程中所經歷的hook與hook的過程(例如lazy initializer)。

> 參考資料
> [west, donavon west-Twitter](https://twitter.com/donavon/status/1104765084377800706?lang=zh-Hant)


## 只執行第一次
<span class="red">使用空陣列讓其只在第一次渲染的時候執行</span>
以下最簡單的範例
```javascript
import React, { useState, useEffect } from 'react'
const App = () => {
  useEffect(() => { console.log("我只印一次"); }, [])
  const [number, setNumber] = useState(0);
  const incrementHandler = () => {
    setNumber((prev) => (prev + 1));
  };
  return (
    <div>
      <div>{number}</div>
      <button onClick={incrementHandler}>+</button>
    </div>
  );
}
export default App
```
如下圖
我按下了五次的按鈕，畫面重新更新了五次，但是只做了一次useEffect
![](https://i.imgur.com/MWSpTnw.png)

## 畫面任何更動都執行

若想要讓<span class="red">每次畫面渲染都執行useEffect的話，第二個參數不帶任何東西</span>。這邊使用兩個state來作範例，藉此說明第二個參數是不依賴任何state的時候畫面都會更新。

```javascript
import React, { useState, useEffect } from 'react'
const App = () => {
  useEffect(() => { console.log("我印很多次"); })
  const [number, setNumber] = useState(0);
  const [string, setString] = useState("");
  const incrementHandler = () => {
    setNumber((prev) => (prev + 1));
  };
  return (
    <div>
      <div>{number}</div>
      <button onClick={incrementHandler}>+</button>
      <br />
      <input type="text" onChange={(e) => setString(e.target.value)} />
      <div>{string}</div>
    </div>
  );
}
export default App
```

![](https://i.imgur.com/poV0lyU.png)

## 依賴某個state
這邊使用依賴於number這個state，可以看得出當我輸入字母，並沒有觸發useEffect，但我按下+的按鈕的時候，讓useEffect執行
```javascript
import React, { useState, useEffect } from 'react'
const App = () => {
  const [number, setNumber] = useState(0);
  const [string, setString] = useState("");
  useEffect(() => { console.log("我印很多次"); }, [number]);
  const incrementHandler = () => {
    setNumber((prev) => (prev + 1));
  };
  return (
    <div>
      <div>{number}</div>
      <button onClick={incrementHandler}>+</button>
      <br />
      <input type="text" onChange={(e) => setString(e.target.value)} />
      <div>{string}</div>
    </div>
  );
}
export default App
```
![](https://i.imgur.com/Gv7713L.png)
## 元件銷毀前-clearup

另外我們可以在useEffect帶入一個callback Function來建立當上一次的元件被銷毀前所要執行的事情，通常我們稱之為clarup函式，先看以下範例
```javascript
import React, { useState, useEffect } from 'react'
const App = () => {
  const [number, setNumber] = useState(0);
  useEffect(() => {
    console.log("元件渲染後數字是",
      number)
    return () => {
      console.log("元件銷毀前數字是", number);
    }
  }, [number]);
  const incrementHandler = () => {
    setNumber((prev) => (prev + 1));
  };
  return (
    <div>
      <div>{number}</div>
      <button onClick={incrementHandler}>+</button>
    </div>
  );
}
export default App
```
如下圖我們按下三次+號，整個流程會是
這個App元件被執行→
印出**元件渲染後數字是0**→
按下＋號按鈕→
印出**元件銷毀前數字是0**→
印出數字印出元件渲染後數字是1→
按下＋號按鈕→
印出**元件銷毀前數字是1**
印出數字印出**元件渲染後數字是2**→
按下＋號按鈕→
印出元件**銷毀前數字是2**
印出數字印出**元件渲染後數字是3**→
![](https://i.imgur.com/lJS0VRI.png)

### 範例使用setInterval配合clearup

一定要清除的狀況例如使用setInterval、訂閱某人要清除訂閱的時候

這個範例當元件render完畢後使用useEffect函式裡面加入setInterval以初始2秒印出時間，當按下按鈕的時候會由於number+1，因此會變成4秒印出時間，如果沒有清除setInterval就會造成擁有2個週期，一個是每2秒印出時間和另一個週期是每4秒也印出時間的狀況。
```javascript
import React, { useState, useEffect } from 'react'
const App = () => {
  const [number, setNumber] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      const event = new Date();
      console.log(event.toUTCString());
    }, number * 2000);//每2秒會印出時間
    return () => {
    }
  }, [number]);
  const clickHandler = () => {
    setNumber((pre) => (pre + 1));
  }
  return (
    <div>
      {number}
      <br />
      <button onClick={clickHandler}>按鈕</button>
    </div>
  )
}
export default App
```
如下圖
![](https://i.imgur.com/XnfGt9H.png)
因此我們可以銷毀上次設置的setInterval
```javascript
import React, { useState, useEffect } from 'react'
const App = () => {
  const [number, setNumber] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      const event = new Date();
      console.log(event.toUTCString());
    }, number * 2000);
    return () => {
      clearInterval(interval); //清除上一次的interval
    }
  }, [number]);
  const clickHandler = () => {
    setNumber((pre) => (pre + 1));
  }
  return (
    <div>
      {number}
      <br />
      <button onClick={clickHandler}>按鈕</button>
    </div>
  )
}
export default App
```

## 倒數計時範例
```javascript
import React, { useState, useEffect } from 'react'
const App = () => {
  const [timeCountdown, setCountdown] = useState(60);
  useEffect(() => {
    if (!timeCountdown) return;
    const intervalId = setInterval(() => {
      setCountdown((prev) => (prev - 1));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeCountdown]);
  return (
    <div>
      <h1>{timeCountdown}</h1>
    </div>
  );
};
export default App;
```
## 使用console.log理解useEffect順序
我們分別在以下地方帶入console
* App函式裡面的最外層
* return jsx裡面
* useEffect裡面
* useEffect 的callback裡面(callback)

程式碼如下

```jsx
import React, { useState, useEffect } from 'react'
const App = () => {
  console.log("我在AppFunction裡面");
  const [number, setNumber] = useState(0);
  const clickHandler = () => {
    setNumber((prev) => (prev + 1));
  }
  useEffect(() => {
    console.log("我在useEffect裡面");
    return () => {
      console.log("我在useEffect的callback裡面稱為clearup");
    }
  })
  return (
    <div>
      {number}
      {console.log("我在render函式裡面")}
      <button onClick={clickHandler}>+</button>
    </div>
  );

}
export default App
```

最後渲染如下圖
初次載入可以發現順序如下(mount時期)

1. App函式裡面的最外層
1. return jsx裡面
1. useEffect裡面

當我按下按鈕觸發第二次重新渲染的時候(update時期)
1. App函式裡面的最外層
1. return jsx裡面
3. useEffect 的callback裡面(callback)
4. useEffect裡面


![](https://i.imgur.com/5zxDll4.png)

## useEffect常見的用途
- 向後端發送API請求以獲取資料
- 使用瀏覽器API、(直接操作DOM的情形)
- 註冊和取消註冊事件
- 讀取localStorage
- 驗證字串

## 注意事項
- useEffect第二個參數是透過Object.is來比對是否相等，因此如果當依賴值是物件的時候，可能造成物件內容改變，但卻沒有執行useEffectFunction，這是因為兩個物件是相同的reference (可以使用useMemo改善)
- 元件重新渲染後的每次useEffect都是獨立、或說新的一個函式，所以才需要透過clearup清除一些訂閱事件或者setInterval之類的函式

### 其他參考資料
這邊有一篇完整介紹了useEffect的內容是redux的作者也是react團隊的成員之一
> [useEffect 的完整指南](https://overreacted.io/zh-hant/a-complete-guide-to-useeffect/)

另外這裡講述一些關於fetch資料的方式

> [How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/)

### 參考資料
> [6 use cases of the useEffect ReactJS hook](https://dev.to/colocodes/6-use-cases-of-the-useeffect-reactjs-hook-282o)
> [使用 Effect Hook](https://zh-hant.reactjs.org/docs/hooks-effect.html)
> [A Simple Explanation of React.useEffect()](https://dmitripavlutin.com/react-useeffect-explanation/)
> [UseEffect dependency array and object comparison!](https://dev.to/ms_yogii/useeffect-dependency-array-and-object-comparison-45el)
