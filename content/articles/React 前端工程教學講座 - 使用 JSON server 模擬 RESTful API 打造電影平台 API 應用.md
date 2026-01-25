---
title: React 前端工程教學講座 - 使用 JSON server 模擬 RESTful API 打造電影平台 API 應用
slug: 2022-12-13T13:31:00.000Z
date: 2022-12-13T13:31:00.000Z
tags: ["React"]
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
.red {
color:red;
}
.pink{
  color:pink
}
.blue {
color:blue;
}
.green {
color:green;
}
.gray{
background-color:#d3d3d3;
}
</style>

此篇為到大學教導第二週的實作範例的教導內容，這次實作範例包含使用 MUI 製作頁面後渲染頁面並透過 useState 和 useEffect 與 axios 發送至 TMDB 電影查詢 API 以及使用 JSON server 模擬 RESTful API 的 CRUD。

雙週課程大綱為以下內容

1.React 是什麼
2.Component 基本介紹
3.常用 Hook 介紹
4.JSX 介紹
5.React router
6.串接第三方 API
7.使用 JSON Server 模擬 RestfulAPI

希望對於 React 有興趣的人可以參考，若內容有問題也可以告訴我🙂


[下載 github 範例檔案](https://github.com/ketyykes/cjcu-react-mui)

## 註冊 TMDB

一個可以查詢電影 API 的網站

[TMDB 官方網站](https://www.themoviedb.org/?language=zh-TW)

記得收信

## MUI

[MUI-官方安裝文件](https://mui.com/material-ui/getting-started/installation/)

### 基本安裝

內容包含 emotion 樣式和 emotion for react 以及 mui 的核心

MUI 預設基本內建預設樣式使用 emotion

```bash
npm install @mui/material @emotion/react @emotion/styled
```

### MUI ICON 安裝

[Material Icons 官方樣式參考](https://mui.com/material-ui/material-icons/#main-content)

以下指令為安裝 MUI 的 icon
其內容就是安裝 MUI 的 icon

```bash
npm install @mui/icons-material
```

## react-router-dom

安裝 react router dom
其內容是讓 URL 與 UI 同步，換句話說就是輸入某個網址列將會渲染某個畫面。

```bash
npm install react-router-dom
```

[React-Router-Dom 官方文件](https://reactrouter.com/en/main/start/tutorial)

## Axios

一個用來發送 API 的套件，可以更有效的管理 API

```bash
npm install axios
```

## SASS

作為 CSS 預處理器

```bash
npm install sass
```

## json-server

作為暫時伺服器用

```bash
npm install -g json-server  
```

## 建立一個.env 檔案

敏感資料不該上傳置 github

新增一個.env 檔案

```bash
REACT_APP_API_KEY=輸入你的api key
```

在 react-create-app 可以設定環境變數方法請參考官網
[react-create-app 環境變數](https://create-react-app.dev/docs/adding-custom-environment-variables/)

## 其他 vs code extension 推薦

### auto import

[auto import](https://marketplace.visualstudio.com/items?itemName=ElecTreeFrying.auto-import)

### auto close tag

[Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

鍵入一個 tag 的時候自動生成另一個對應的 tag，詳情參見官方網站

### Auto Rename Tag

Auto Rename Tag

當重新命名 tag 的時候可以自動重新命名對應的 tag，詳情請見官方網站

[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)

### AutoFileName

import 的時候能夠提示路徑
[AutoFileName](https://marketplace.visualstudio.com/items?itemName=JerryHong.autofilename)

### EMMET

[emmet 的 doc](https://docs.emmet.io/cheat-sheet/)

---

<span class="green rem50">🙂開始專案了🙂</span>

## reset css

建立一個 reset css

## css module

- 樣式的作用域只會在該 component
- 解決 CSS 全域汙染

<span class="rem25 blue">★建立 Footer</span>

### Footer 樣式

```css
.footer {
	text-align: center;
	padding: 20px 0;
	background-color: #1976d2;
	color: white;
	font-size: 24px;
}
```

### Footer component

```jsx
import React from 'react'
import styles from "./footer.module.scss";
const Footer = () => {
  const { footer } = styles;
  //透過解構將其取出，在 className 的部分改帶入變數
  return (
    <footer className={footer}>Footer</footer>
  )
}

export default Footer
```

## scss(sass)-CSS 預處理器

- 編譯後產生純 css
- 巢狀選擇器寫法，避免 css 選擇器需重複撰寫

其他更多用法參見官方網站
[scss 官方網站](https://sass-lang.com/)

<span class="rem25 blue">★建立 Header</span>

### Header 樣式

```scss
.header {
  text-align: center;
  padding: 20px 0;
  background-color: #1976d2;
  color: white;
  ul {
    display: flex;
    justify-content: flex-end;
    li {
      a {
        color: white;
        font-size: 24px;
        padding: 20px;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}

```

### Header component

Link 是 react-router-dom 的元件，有點像是 a tag

```jsx
import React from 'react'
import styles from './header.module.scss'
import { Link } from "react-router-dom"
const Header = () => {
  const { header } = styles;
  return (
    <header className={header}>
      <ul>
        <li><Link to="/">首頁</Link></li>
        <li><Link to="/favorite">我的最愛</Link></li>
      </ul>
    </header >
  )
}

export default Header
```

## MUI—sx props, color

### sx prop

- sx 是 css 的超集
- 所有 MUI 的 component 都可以使用的 props，用來添加 css 樣式在 component 上
- 別名寫法例如
  - m→margin
  - pt→padding-top
  - bgcolor→backgroundColor

更多可以參考官網
[MUI-sx prop](https://mui.com/system/getting-started/the-sx-prop/)

### MUI-color

#### MUI 的 color 調色盤

如下圖

![](https://i.imgur.com/8W89UNg.png)

使用方式如下

```javascript
import { red } from '@mui/material/colors';
const color = red[500]; //回傳#f44336
```

更多可以參考[MUI-color](https://mui.com/material-ui/customization/color/#color-palette)

<span class="rem25 blue">★建立 Content</span>

### Content Component

```jsx
import { Container, Box } from "@mui/material"
import { lightBlue } from '@mui/material/colors';

export default function Content({ children }) {

  return (
    <Box sx={{ bgcolor: lightBlue[50], p: 6 }}>
      <Container>
        {children}
      </Container>
    </Box>
  );
}
```

## react-router-dom

建置網站的時候，根據不同的網址，擁有不同的頁面，我們稱之為 Router。

使用方式建立一個 router 的 js 檔案，取名叫做 index.js

原先已經建立的頁面檔需要引入作為參數帶入

### createBrowserRouter

帶入一個陣列形式區分不同的 router，其內容為一個物件。

以下為物件屬性和說明

- path 路由網址
- element 要回傳的 component（或稱頁面檔）
- loader 當載入的頁面需要事先請求資料的時候可以帶入一個 function 作為請求
- errorElement 當遇到錯誤的時候要回傳的 component

實際 code 可能如下

```javascript

//請求資料的 function

async function fetchPopular() {
  
    const config = {
      method: "get",
      url: "https://api.themoviedb.org/3/movie/popular?api_key=你的 APIKEY",
    };
    return await axios(config);
  } catch (error) {
    console.log(error);
    return [];
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,//回傳 HomePage
    loader: fetchPopular,//請求 funciton 
    errorElement: <NotFound />,//錯誤時候要回傳的 component
  },
  //多個路由將以第二個物件回傳
  {
    path: "/favorite",
    element: <FavoritePage />,
  },
]);

```

<span class="rem25 blue">★建立 router 的 index.js</span>

### router 的 index.js

```javascript
import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/HomePage.jsx";
import FavoritePage from "../pages/FavoritePage.jsx";
import NotFound from "../pages/NotFound.jsx";

import axios from "axios";

async function fetchPopular() {
try {
  const config = {
    method: "get",
    url: "https://api.themoviedb.org/3/movie/popular?api_key=你的 APIKey",
  };
  return await axios(config);
} catch (error) {
  console.log(error);
  return [];
}
}

const router = createBrowserRouter([
{
  path: "/",
  element: <HomePage />,
  loader: fetchPopular,
  errorElement: <NotFound />,
},
{
  path: "/favorite",
  element: <FavoritePage />,
},
]);
export default router;

```

<span class="rem25 blue">★更動 index.js</span>

### index.js

在 index.js 當中加入 RouterProvider 應當可以如期渲染出對應的東西

其程式碼如下

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./reset.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
);
```

## 建立 HomePage 頁面

本頁重點

- 使用 MUI Grid 格線系統
- react route useLoaderData
- 透過 props 將剛剛提取的資料傳遞到 MovieCard
- js 知識點 map 的 callback funciton 也可以解構


### react route useLoaderData

這個 hook 用來提取剛剛 loader 所發送的 API 請求
更多用法請參考[React-Router-useLoaderData](https://reactrouter.com/en/main/hooks/use-loader-data)

### Grid 請參考

參考鐵人賽文章
[格線系統、基本用法、Responsive values、Grid version 2？—MUI](https://ithelp.ithome.com.tw/articles/10307345)

<span class="rem25 blue">★建立 HomePage</span>
實際程式碼如下

map 的 callback function 也可以解構

提取到的資料透過 prop 傳遞
```jsx
import React from 'react'

import { Grid } from "@mui/material"
import { useLoaderData } from "react-router-dom";

import Content from '../components/Content/Content'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import MovieCard from '../components/MovieCard/MovieCard'

const HomePage = () => {
  const { data: { results: popularMovies } = {} } = useLoaderData();
  return (
    <>
      <Header>
      </Header>
      <Content >
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          {
            popularMovies.map(({ overview, title, backdrop_path }, index) => (
              <Grid item xs={12} lg={4} xl={3} md={6} sm={6} key={index}>
                <MovieCard overview={overview} title={title} backdrop_path={backdrop_path} />
              </Grid>
            ))
          }
        </Grid>
      </Content>
      <Footer />
    </>
  )
}

export default HomePage
```

## 建立 MovieCardComponent

<span class="rem25 blue">★建立 MovieCard</span>

本小節小重點

- 將得到的 props 透過解構
- js 知識點，使用邏輯運算子||作為渲染內容

```jsx
import React from 'react'

import { Card, CardContent, CardMedia, Typography } from "@mui/material"

const MovieCard = ({ overview, title, backdrop_path }) => {
  return (
    <Card key={title} sx={{ maxWidth: 345, height: '100%' }}>
      <CardMedia
        component="img"
        image={`https://image.tmdb.org/t/p/w400${backdrop_path}`}
        alt={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {overview || "暫無說明"}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default MovieCard
```

## NotFoundPage 頁面

### useNavigate 作為跳轉

- 可以使用程式碼的方式實現頁面導航
- 可以帶入第二個參數傳遞 state
- 與 history statck 一樣可以帶入 -1 表示上一頁

[HistoryAPI-MDN](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

### useRouteError();

由於先前有使用 errorElement，因此可以使用 useRouteError 錯誤訊息

<span class="rem25 blue">★建立 NotFoundPage</span>

### NotFoundPage

下面的功能使用 useEffect 撰寫，當兩秒鐘後 navigate 進行畫面跳轉

```jsx
import React, { useEffect } from 'react';

import { Typography } from "@mui/material"
import { useRouteError, useNavigate } from "react-router-dom";

import Content from '../components/Content/Content'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const NotFound = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Header />
      <Content >
        <Typography variant="h1" sx={{ textAlign: "center" }} component="h2" >
          {error.statusText}
        </Typography>
      </Content>
      <Footer />
    </>
  )
}

export default NotFound
```

## instanceAPI 檔案

- 封裝 API 更好管理
- 透過命名來知道是哪個 instance 實體

<span class="rem25 blue">★建立 instanceAPI</span>

### 建立 axios 的實體

由於需要帶的參數固定，因此可以使用 create 的方式建立實體

更多可以參考[The Axios Instance-doc](https://axios-http.com/docs/instance)

```javascript
import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:3004",
  headers: {
    "Content-Type": "application/json",
  },
});

```

## 使用 json-server

可以用的方法如下

GET    /posts
GET    /posts/1
POST   /posts
PUT    /posts/1
PATCH  /posts/1
DELETE /posts/1

更多用法可以參考 json-server npm 如下
[json-serverDoc](https://www.npmjs.com/package/json-server?activeTab=readme)

```javascript
npm install -g json-server  
```

### 建立一個 db.json

```json
{
  "favorites": [
    {
      "id": 1670875867685,
      "title": "哈利波特",
      "finished": false
    }
  ]
}
```

指令輸入以下指令即可開啟 3004 的伺服器

```javascript
json-server --watch db.json --port 3004
```


[](https://www.npmjs.com/package/json-server)

## 使用 PostMan 測試 CURD

點擊 + 符號 新增 collection
![](https://i.imgur.com/bIDT3Ys.png)

可以點擊 add request

![](https://i.imgur.com/9NKwsV1.png)

新建完 request 後記得 ctrl+s 儲存


可以興建以下 request

![](https://i.imgur.com/awJrqS2.png)

<span class="green rem50">🙂最後一個頁面了🙂</span>

## 建立 FavoritePage 頁面

推薦看鐵人賽文章

[從實作 To Do List 理解 OOO 系列](https://ithelp.ithome.com.tw/articles/10303850)

本章節小重點

- 當使用 Post 或者 update 或者 delete 完後再次 get 一次資料，建議使用 async await 可以確保資料已經新增到資料庫後後再次 get
- onClick 如果需要帶入變數的話要一個 callback function，因為 onClick 是 function 不是 function 執行的結果
- 使用 form 表單元素搭配 onSubmit 可以作為 enter 送出訊號，記得使用 e.preventDefault() 預防畫面閃一下

<span class="rem25 blue">★建立 FavoritePage 頁面</span>

```javascript
import React, { useEffect, useState } from 'react'

import { List, ListItem, IconButton, ListItemText, TextField, Box } from '@mui/material';
import { TaskAlt as TaskAltIcon, Delete as DeleteIcon } from '@mui/icons-material'

import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Content from '../components/Content/Content'

import { instance } from "../API/instanceAPI"

const FavoritePage = () => {
  const [favorite, setFavorite] = useState([]);
  const [inputFavorite, setInputFavorite] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await instance.get('/favorites')
        setFavorite(data)
      } catch (error) {
        console.log(error);
      }
    })();
  }, [])

  const newFavoriteHandler = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const posetResponse = await instance.post('/favorites', {
          id: Date.now(),
          "title": inputFavorite,
          "finished": false
        })
        console.log(posetResponse);
        const { data } = await instance.get('/favorites')
        setFavorite(data)
      } catch (error) {
        console.log(error);
      }
    })();
    instance.get('/favorites')
      .then(response => {
        const { data } = response
        setFavorite(data)
      }).catch(error => {
        console.log(error);
      })
    setInputFavorite('');
  }

  const finishedHandler = (id, title, finished) => {
    (async () => {
      try {
        const putResponse = await instance.put(`/favorites/${id}`, {
          id,
          title,
          finished: !finished
        })
        console.log(putResponse);
        const { data } = await instance.get('/favorites')
        setFavorite(data)
      } catch (error) {
        console.log(error);
      }
    })();
  }

  const deleteHandler = (id) => {
    (async () => {
      try {
        const deleteResponse = await instance.delete(`/favorites/${id}`)
        console.log(deleteResponse);
        const { data } = await instance.get('/favorites')
        setFavorite(data)
      } catch (error) {
        console.log(error);
      }
    })();
  }

  return (
    <>
      <Header />
      <Content>
        <Box sx={{ boxShadow: 1, maxWidth: "600px", margin: "0 auto", p: 6, }}>
          <Box onSubmit={newFavoriteHandler} component="form" noValidate
            autoComplete="off">
            <TextField
              value={inputFavorite}
              fullWidth={true}
              label="輸入待看清單"
              variant="filled"
              onChange={
                (e) => { setInputFavorite(e.target.value) }
              }
            />
          </Box>
          <List>
            {favorite.map(({ title, id, finished }) => {
              return (<ListItem key={id}>
                <ListItemText
                  primary={title}
                  sx={{ textDecoration: finished ? "line-through" : "none" }}
                />
                <IconButton
                  sx={{ m: 1 }}
                  edge="end"
                  aria-label="TaskAltIcon"
                  onClick={() => (finishedHandler(id, title, finished))}>
                  <TaskAltIcon />
                </IconButton>
                <IconButton
                  sx={{ m: 1 }}
                  edge="end"
                  aria-label="delete"
                  onClick={() => (deleteHandler(id))}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>)
            })}
          </List>
        </Box>
      </Content>
      <Footer />
    </>
  )
}

export default FavoritePage
```

最後如下圖

![截圖 2024-04-06 晚上 8.44.02 2](https://hackmd.io/_uploads/SJ7OU60kR.png)

另外一個頁面

![截圖 2024-04-06 晚上 8.54.12](https://hackmd.io/_uploads/HkLuI6AJ0.png)

<span class="green rem50">完成🎉🥳🎊</span>
