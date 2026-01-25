---
title: React route—useNavigate介紹、控制history stack、傳遞參數、重新導向
slug: 2022-11-30T13:31:00.000Z
date: 2022-11-30T13:31:00.000Z
tags: ["React"]
---

本文提及以下內容
- 基本設置
- useNavigate控制導向
- useNavigate傳遞history stack
- useNavigate傳遞狀態
- 頁面重新導向
- 注意事項

## 基本設置

### src資料夾

src的資料夾內容如下

```bash
App.js
Count.js
Home.js
index.js
NotFound.js
Test.js
```

### index檔案

index檔案如下

```javascript
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

```

### App.js檔案

路由設置如下

```javascript
import Count from "./Count.js";
import Test from "./Test.js";
import NotFound from "./NotFound.js";
import Home from "./Home.js";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/count" element={<Count />}></Route>
        <Route path="/test" element={<Test />}></Route>
        <Route index element={<div>這是首頁</div>}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}
export default App;

```

## useNavigate控制導向

如果今天想要用程式控制頁面改變URL的話，我們可以使用**useNavigate hook**

程式碼如下

```javascript
const navigate = useNavigate();
//做某些事情的時候切換到Count頁面
navigate("/Count")
```

## useNavigate傳遞history stack

useNavigate參數當中除了可以添加連結也能添加數字表示`history stack`，像是製作上一頁或下一頁的按鈕，可以將useNavigate帶入-1的方式，當使用者點擊的時候就能回上一頁。換言之帶入-2就是回前兩頁。

### Test檔案

```javascript
import React from "react";
import { useNavigate } from "react-router-dom";
const Test = () => {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate(-1)}>回上一頁</button>
      <div>Test</div>
    </>
  );
};
export default Test;
```

## useNavigate傳遞狀態

有時候我們希望傳遞某些變數到下一個頁面的時候可以帶入第二個參數程式碼如下
  
### Home檔案

```jsx
import React from "react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => {
          navigate("/Test", {
            state: {
              test: "hello",
            },
          });
        }}
      >
        狀態傳遞
      </button>
    </div>
  );
};

export default Home;
```

在頁面檔上面我們有一顆狀態傳遞的按鈕

![](https://i.imgur.com/pRHAhF8.png)

當我們按下的時候會導向到Test頁面，其中第二個參數帶入一個物件，key為state，而值是一個物件。

### Test檔案

在Test檔案我們就可以使用`useLocation`來獲取剛剛從home頁面所傳遞過來的變數。

```javascript
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
const Test = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state);
  return (
    <>
      <button onClick={() => navigate(-1)}>回上一頁</button>
      <div>Test</div>
    </>
  );
};

export default Test;
```

如下圖

![](https://i.imgur.com/Uu6TMAi.png)

## 頁面重新導向

另外我們可以使用**useNavigate**搭配**useEffect**進行重新導向(備註)

當使用者找不到頁面的時候，我們可以顯示**NotFound**幾秒鐘再重新導向回某個頁面

### NotFound檔案

撰寫程式碼如下

```jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }, [navigate]);
  return <div>NotFound</div>;
};
export default NotFound;
```

本範例當中延遲一秒鐘後就會進行頁面跳轉回首頁

> (備註):在v6.4當中的版本如果使用loader和action會建議改用[redirect](https://reactrouter.com/en/main/fetch/redirect)來處理response

## 注意事項

我們應當避免將所有要跳轉的連結都使用useNavigate，應當使用`<Link>`，由於`<Link>`最後呈現會變成a element，因此更加符合html的element設計。

```javascript
<li onClick={() => navigate("/somewhere")} />
//盡量避免使用按鈕製作導航
//應當在適當的時機使用useNavigate，例如表單傳遞或是回上一頁
```

##### 參考資料
[react route v6.4—usenavigate](https://reactrouter.com/en/main/hooks/use-navigate)