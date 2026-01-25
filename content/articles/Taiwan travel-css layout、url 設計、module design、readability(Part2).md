---
title: Taiwan travel-css layout、url 設計、module design、readability(Part2)
slug: 2022-09-05T13:31:00.000Z
date: 2022-09-05T13:31:00.000Z
tags: ["React"]
---


本文為製作 Taiwan travel 的個人想法，如果有其他建議歡迎與我交流🙂

總共分為 4 個 part 如下：

- Taiwan travel-頁面功能、component、folder、router、UX 設計思維 (Part1)
- Taiwan travel-css layout、url 設計、module design、readability(Part2)
- Taiwan travel-issue and solution(Part3)
- Taiwan travel-可改善部分、筆記、其他知識點 (Part4)

以下為 Part2 的大綱

- css 排版設計
- 更容易調整 select 樣式、與 UI 設計稿畫面一致
- 使網址列像平常對後端發送請求的 queryString 一樣
- 減少 Homepage 顯示的程式碼量 - 將資料抽離使用模組化設計
- 減少 Sidebar 顯示的程式碼量 - 將資料抽離使用模組化設計
- 將所需 import 的檔案寫入成一支 index.js-減少引入行數、增加可讀性
- 其他增加可讀性-import 順序的調整

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
.blue {
color:blue;
}
.gray{
background-color:#d3d3d3;
}
.green{
  color:green;
}
</style>

## css 排版設計
<span class="blue rem25">為了</span>讓使用者能夠<span class="blue rem25">在捲動頁面</span>的時候讓<span class="blue rem25">Sidebar 固定在左側</span>，另外也簡化 RWD 排版，因此使用<span class="red">grid</span>搭配<span class="red">`position: sticky`</span>來達到目地，grid 的好處面對像是內容排版有二維的移動時會更能發揮其易用性，source code 如下

```javascript
.container {
  display: grid;
  grid-template-columns: 350px 1fr;
  grid-template-areas:
    "sidebar  header"
    "sidebar  article"
    "sidebar  footer"
    "sidebar  ."
    "sidebar  .";
  @include breakpoint.tablet {
    grid-template-columns: 1fr;
    grid-template-areas:
      "sidebar "
      "header"
      "article"
      "footer";
  }
}
```

而 aside.module.scss 的 sticky 部分如下

```scss
.aside {
  grid-area: sidebar;
  position: sticky;
  top: 0;
  align-self: start;
  padding: 24px;
  @include breakpoint.tablet {
    position: static;
  }
}
```

## 更容易調整 select 樣式、與 UI 設計稿畫面一致

根據自身經驗實際撰寫 select 的 CSS 時候所面臨的問題以及 MDN 的說法
> [MDN-select](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#styling_with_css)
> The `<select>` element is notoriously difficult to style productively with CSS. You can affect certain aspects like any element — for example, manipulating the box model, the displayed font, etc., and you can use the appearance property to remove the default system appearance.

簡言之意思是 Html 的<span class="red">`<select>`</span>可以客製化的程度並不高。  

為了能夠更**容易調整 select 樣式**以及與**UI 設計稿的畫面一致**，因此選擇使用<span class="red">`<div>`</span>搭配<span class="red">`<button>`</span>來實作。
這裡使用<span class="red">`<div>`</span>的 tag 搭配<span class="red">`<button>`</span>客製化下拉式選單，grid 排版主要用途是排版按鈕，<span class="red">`position:absolute`</span>作用是使其脫離**normal flow**讓他覆蓋在原本的 sidebar 上方，程式碼如下
```scss
.wrap_destination_city {
  background-color: #fff;
  max-height: 0;
  display: grid;
  width: min-content;
  grid-template-columns: repeat(auto-fill, minmax(min-content, 100px));
  justify-content: center;
  overflow: hidden;
  position: absolute;
  top: 50px;
  width: 100%;
  z-index: 2;
  button {
    margin: 4px;
    display: block;
    white-space: nowrap;
    border: 1px solid variable.$primary_color1;
    font-weight: 700;
    border-radius: 8px;
    padding: 8px 20px;
    font-size: variable.$font_desktop_body1;
    cursor: pointer;
    &:hover {
      background-color: variable.$primary_color1;
      color: #fff;
    }
  }
```


## 使網址列像平常對後端發送請求的 queryString 一樣


雖然前端的網址列是透過 **Web History API**(備註 1) 做出來與後端真正指向某個 html 檔案或是發 request 到伺服器不太一樣，但是為了能仿造一般某些網頁可以在網址列上面上呈現類似？page=1 或是 tab=hot 的方式，其呈現效果就像是實際發送給後端一樣，因此將 oData 帶入的參數方式也顯示在網址列上，假設使用者有網頁的基礎也了解 oData 帶參數的形式 (見下圖)，就會在發 request 的程式碼部分將使用者帶入網址列的 queryString 參數發給 TDX 釋出的 API 作為參數請求。

> 備註 1 [MDN-History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
  
![](https://i.imgur.com/PJ2a6em.png)

> 圖片來源：公共運輸整合資料文件
  
  其作法是使用<span class="blue">react-router-dom</span>的**useSearchParams**，將網址列取得後轉成 String 帶入到 custom 的 hook 中。
大概的程式碼如下
  
```javascript
import { useParams, useSearchParams } from "react-router-dom";
const [searchParams] = useSearchParams();
const data = useGetPlaceData(visitType, searchParams.toString(), city); //custom hook
```

## 減少 Homepage 顯示的程式碼量 - 將資料抽離使用模組化設計

在 visitTypeQuery.js 的檔案中，由於首頁要顯示的資料是固定的內容，因此會以大寫常數的方式定義在這支檔案當中，下列程式碼為帶的參數內容，也因為使用物件的方式顯示可帶參數，因此在可讀性上也比起純粹的 string 更好閱讀。

```javascript
const SCENICSPOT_MORE_QUERY_PARAMS = {
  $select: "ScenicSpotName,Picture,OpenTime,Address,ScenicSpotID",
  $filter:
    "Picture/PictureUrl1 ne null and Description ne null and Description ne null",
};
  
```

下列程式碼則宣告了一個 queryStringCreator 的函式用來生成字串，做法是透過 URLSearchParams(object).toString() 轉成字串。
  
```javascript
export function queryStringCreator({ $select, $filter, $top }) {
  const object = {};
  if ($select) {
    object.$select = $select;
  }
  if ($filter) {
    object.$filter = $filter;
  }
  if ($top) {
    object.$top = $top;
  }
  return new URLSearchParams(object).toString();
}
```

實際當首頁要調用的內容也就是 export 出去的東西如下
  
```javascript
export const SCENICSPOT_QUERY = queryStringCreator(SCENICSPOT_QUERY_PARAMS);
```
  
## 減少 Sidebar 顯示的程式碼量 - 將資料抽離使用模組化設計

在下拉式選單當中有城市的中文名字，根據 TDX 所開的 API 所需的 UrlName 是英文，因此設計了一個陣列，單個陣列的內容是一個物件包含了該縣市的英文與中文的名字，大致如下

```javascript
const allCityArray = [
  { chineseName: "全部", urlPathName: "all" },
  { chineseName: "台北", urlPathName: "Taipei" },
  { chineseName: "新北", urlPathName: "NewTaipei" },
//以下省略
]
```

另外精選主題夾帶的參數和圖片也是將資料抽離出來，裡面包含要發 request 的內容和顯示的圖片等等。大致如下
```javascript
const allThemeArray = [
  {
    title: "history",
    chineseName: "歷史文化",
    image: history,
    visitType: "ScenicSpot",
    queryObject: {
      $select: "Class1,ScenicSpotName,Picture,OpenTime,Address,ScenicSpotID",
      $filter: `(Class3 eq '古蹟類' or Class2 eq '古蹟類'or Class1 eq '古蹟類' or Class3 eq '文化類' or Class2 eq '文化類'or Class1 eq '文化類' or Class3 eq '藝術類' or Class2 eq '藝術類'or Class1 eq '藝術類') and Picture/PictureUrl1 ne null and Address ne null and Description ne null and OpenTime ne null`,
    },
  },
  {
    title: "outdoor",
    chineseName: "戶外踏青",
    image: outdoor,
    visitType: "ScenicSpot",
    queryObject: {
      $select: "Class1,ScenicSpotName,Picture,OpenTime,Address,ScenicSpotID",
      $filter: `(Class3 eq '生態類' or Class2 eq '生態類'or Class1 eq '生態類' or Class3 eq '林場類' or Class2 eq '林場類'or Class1 eq '林場類' or Class3 eq '休閒農業類' or Class2 eq '休閒農業類'or Class1 eq '休閒農業類') and Picture/PictureUrl1 ne null and Address ne null and Description ne null and OpenTime ne null`,
    },
  },
...//以下省略
]
```
  
在 sidebar 實際要使用時候就能使用 map 的方式渲染出 UI 並且夾帶該資料，以精選主題的 UI 按鈕部分為例。

```jsx
 {allThemeArray.map((themeItem, index) => (
    <li key={index}
        className={themeName === themeItem.title ? select_theme : null}
        onClick={() => selectThemeHandler(themeItem)}
    >
      <div>
        <img src={themeItem.image} alt={themeItem.title} />
      </div>
      <span>
        {themeItem.chineseName}
      </span>
    </li>
))}
```

## 將所需 import 的檔案寫入成一支 index.js-減少引入行數、增加可讀性

之後會引入的內容如圖片、元件、custom hook，因此在該資料夾底下建立一個 index.js 的檔案，其內容僅用來做 import 各個檔案。

例如在 images 的資料夾部分有一支 index.js 的檔案，內容如下
  
```javascript
export { default as arrow_left } from "./arrow_left.png";
export { default as banner } from "./banner.png";
export { default as calling } from "./calling.png";
```
  
在 component 的資料夾內第一層也有一支 index.js，也是整合各個 component 統整成一支的檔案
  
```javascript
export { default as Banner } from "./Banner/Banner";
export { default as Card } from "./Card/Card";
export { default as Footer } from "./Footer/Footer";
export { default as Logo } from "./Logo/Logo";
export { default as Sidebar } from "./Sidebar/Sidebar";
export { default as ThemeSection } from "./ThemeSection/ThemeSection";
export { default as ThemeTitle } from "./ThemeTitle/ThemeTitle";
export { default as Aside } from "./Aside/Aside";
export { default as Header } from "./Header/Header";
export { default as Pagination } from "./Pagination/Pagination";
```
  
實際在 import 的時候僅需要寫一行就好，以 Homepage 為例
```javascript
import { Aside, Header, Banner, ThemeSection, Footer } from '../../component'
```

## 其他增加可讀性-import 順序的調整
另外觀看了一些管理程式碼文章，這次先不使用 Eslint 的風格管理 (常見的像是 standard、AirBnb、Google) 的方式思考規劃拆分檔案和撰寫程式碼，在 import 檔案的時候也會做到將 library 部分的 import 先引入，而自己撰寫的程式碼模組在引入 library 之後才引入。
如下
```javascript
import React, { useReducer } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import queryReducer from './queryReducer';
import { selectCity, searchInput } from './queryActionCreator'
import queryInitState from './queryInitState';

import styles from './sidebar.module.scss';
import { changeTitle } from '../../store/searchSlice'
import { magnifying, drop_down } from '../../assets/images'
import allCityArray from '../../assets/allCityArray';
import allThemeArray from '../../assets/allThemeArray';
import useToggle from '../../hook/useToggle.js';
```
