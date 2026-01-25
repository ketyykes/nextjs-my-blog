---
title: React route如何運作、建立404的路由、巢狀路由、動態路由
slug: 2022-11-26T13:31:00.000Z
date: 2022-11-26T13:31:00.000Z
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

本文提及以下內容
- 用戶端的路由
- 傳統路由
- react route如何運作
- 起手式
- 建立404的路由
- 巢狀路由
- 動態路由
 

## 用戶端的路由

用戶端的路由不需等待伺服器即可切換頁面。
## 傳統路由
傳統的路由，用戶需要發送請求到伺服器接收html檔案，以便導航到新的頁面。

## react route如何運作
1. Javascript/HTML是在用戶導航到其他頁面前先發送請求
2. 用戶點擊連結或進入到新的路徑
3. 透過Javascript改變瀏覽器的URL
4. HTML的DOM重新替換
5. 重複以上動作

> [了解更多可以查看MDN-HistoryAPI](https://developer.mozilla.org/zh-TW/docs/Web/API/History_API)

### 優點
- 快速的交互作用
- 快速的頁面傳送
- 不用重新刷新(沒有白色的跳轉畫面)
- 感覺就像是使用一個手機APP

### 缺點
- 下載不需要的Javascript(一般用戶不會訪問所有頁面)
- 在首次發送請求下載全部的頁面
- 首次請求的效能也是需要等待一些時間

## 起手式
為了確保整個App都能接收路由，在最外層import`BrowserRouter`，並加入到jsx中，程式碼如下
```javascript
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);
```


在App.js檔案使用`<Routes>`包住各個`<Route>`我們在element帶入jsx組件，在path寫入要生成的url路由，另外如果是根路由可以帶入index，程式碼如下

```javascript
import Count from "./Count.js";
import Test from "./Test.js";
import { Routes, Route, Link } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/count" element={<Count />}></Route>
        <Route path="/test" element={<Test />}></Route>
        <Route index element={<div>這是首頁</div>}></Route>
      </Routes>
    </div>
  );
}
export default App;
```
這時候用npm run start在url的部分輸入count就可以看到對應的jsx組件了，例如`http://localhost:3001/test`
## 建立404的路由
使用 <span class="rem25 red">*</span> 表示剩下的路由要顯示的訊息，通常用在404的頁面，程式碼範例如下
```javascript
   <div className="App">
      <Routes>
        <Route path="/count" element={<Count />}></Route>
        <Route path="/test" element={<Test />}></Route>
        <Route path="*" element={<div>404 Not Found</div>}></Route>
      </Routes>
    </div>
```
## 巢狀路由
可以在路由內再設置路由的方式稱之為巢狀路由，如下面範例，網址列就會輸入`http://localhost:3000/post/1`
就能得到po文的第一頁內容了。
```javascript
<div className="App">
<Routes>
  <Route path="/count" element={<Count />}></Route>
  <Route path="/test" element={<Test />}></Route>
  <Route path="/posts/"}/>
   <Route path="1" element={<div>這是第一頁</div>}></Route>
  <Route path="*" element={<div>404 Not Found</div>}></Route>
</Routes>
</div>
```

### 巢狀路由顯示
若想要在巢狀路由當中也顯示父元素的內容，可以使用`<Outlet />`，這時候輸入`http://localhost:3000/post/1`就能顯示出post的jsx和/1的jsx了
如果只輸入`http://localhost:3000/post/`則可顯示post的jsx

比較值得注意的是想要使用巢狀路由的話/posts後面不必帶斜線，裡面接的巢狀路由，前面也不需斜線。
然後在父路由的jsx也要寫`<Outlet />`
```javascript
<div className="App">
<Routes>
  <Route path="/count" element={<Count />}></Route>
  <Route path="/test" element={<Test />}></Route>
  <Route path="/posts"element={<div>這裡有很多頁<Outlet /></div>}/>
    <Route path="1" element={<div>這是第一頁</div>}></Route>
  <Route path="*" element={<div>404 Not Found</div>}></Route>
</Routes>
</div>
```
> 參見[reactrouter-v6](https://reactrouter.com/docs/en/v6/getting-started/tutorial#nested-routes)
### 巢狀路由中顯示未匹配

若我們在巢狀路由當中使用`*`的path，可以設置在此父層路由底下的路由未匹配，簡單說可以參見以下程式碼

```javascript
<div className="App">
<Routes>
  <Route path="/count" element={<Count />}></Route>
  <Route path="/test" element={<Test />}></Route>
  <Route path="/posts"element={<div>這裡有很多頁<Outlet /></div>}/>
    <Route path="1" element={<div>這是第一頁</div>}></Route>
    <Route path="*" element={<div>沒有找到任何貼文</div>}>
  <Route path="*" element={<div>404 Not Found</div>}></Route>
</Routes>
</div>
```

如果在網址列輸入`http://localhost:3000/post/abcd`的話，因為沒有abcd這個路由，就會顯示沒有找到任何貼文。

## 動態路由

### 接收URL的參數

如果想要將某個route後面的網址列當作參數接受的話使用冒號，在element裡面可以接要接收參數的jsx
程式碼如下
```javascript
<div className="App">
  <Routes>
    <Route path="/count" element={<Count />} />
    <Route path="/test" element={<Test />} />
    <Route
      path="/post"
      element={
        <div>
          這裡有很多頁
          <Outlet />
        </div>
      }
    >
      <Route path="1" element={<div>這是第一頁</div>} />
      <Route path=":id" element={<Post />} />
    </Route>
  </Routes>
</div>
```

而Post的JSX如下，記得引用useParams
```javascript
import React from "react";
import { useParams } from "react-router-dom";

const Post = () => {
  const params = useParams();
  return <div>{params.id}</div>;
};

export default Post;
```
##### 參考資料

- [React Route](https://reactrouter.com/en/main)
