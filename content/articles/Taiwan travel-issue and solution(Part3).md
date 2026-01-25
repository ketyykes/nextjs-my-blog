---
title: Taiwan travel-issue and solution(Part3)
slug: 2022-09-06T13:31:00.000Z
date: 2022-09-06T13:31:00.000Z
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

本文為製作 Taiwan travel 的個人想法，如果有其他建議歡迎與我交流🙂

總共分為 4 個 part 如下：

- Taiwan travel-頁面功能、component、folder、router、UX 設計思維 (Part1)
- Taiwan travel-css layout、url 設計、module design、readability(Part2)
- Taiwan travel-issue and solution(Part3)
- Taiwan travel-可改善部分、筆記、其他知識點 (Part4)

以下為 Part3 的大綱
- 問題一：API 資料帶有 HTML code
- 問題二：$skip 參數無法作用
- 問題三：將先前搜尋結果的網址儲存後下次打開會消失
  - 解決方案一：將中文字儲存在網址列
  - 解決方案二：儲存城市的英文在網址列
  - 解決方案三：使用 localStorage
- 問題四：發送查詢 API 前需帶入 token(還有更好的解決方式)
- 問題五：設計稿與後端 API 沒有統一
- 問題六：state 的頁面傳遞
- 問題七：過多的程式碼在一支 component 中



## 問題一：API 資料帶有 HTML code

另外在接 TDX 的資料時候，如下圖，有部分資料包含了 html 的 tag，如果直接寫在 react 的 jsx 檔案當中，就會讓畫面直接顯示出<span class="red">`<p>10:00-1800<br />一二公休，其餘一臉書公告而定<p>`</span>的型態在網頁畫面上。

![](https://i.imgur.com/gM7oDVO.png)

實際上最好的解決辦法是<span class="blue">請負責後端的人更改資料庫的內容，讓資料是純文字資料</span>，而不用加入 html 的 tag，優點是也**可以讓接收資料端不僅只可以用來渲染網頁，在手機端也能拿取資料做出相對的應用**，但是由於後端的控制權並非在我們手中的時候，我們能夠做的地方就是資料後處理。

因此為了解決這項問題，有嘗試著<span class="blue">使用[dangerouslySetInnerHTML](https://zh-hant.reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)的方式將其掛載在畫面</span>上，程式碼大致如下
```jsx
<div dangerouslySetInnerHTML={{ __html: data.OpenTime }}></div>
```

但是會面臨到的問題是`<p>`是屬於區塊元素 (block element)，其中資料也有`<br>`的屬性，都會自動地幫畫面換行，為了避免資料自動換行可能還得使用 css 的語法將其變成行內元素 (inline element) 等等的方式，但是變成是除了動用 javascript 以外，還得用 css 來解決資料的問題，因此最好的做法是<span class="green">去除這些 html 的 tag</span>。

至於如何實現呢？
由於在<span class="green">**瀏覽器的 Javascript 的 DOM 操作的 document.element 擁有 textContent 的方式可以只取文字內容**</span>，這樣一來就只會取得 tag 裡面的文字，換句話說也去除了 html 的 tag。
實際最後解決的辦法在要接資料的 jsx 寫了一個 arrow function 處理資料如下
```jsx
<div className={wrap_time_or_phone}>
  <img src={clock} alt="clock" />
  {(() => {
    const createTempleteDiv = document.createElement("div");
    createTempleteDiv.innerHTML = OpenTime;
    return createTempleteDiv.textContent;
  })()}
</div>
```

結果就能僅留下 API 回傳的文字內容，而不會有 html 的 tag 產生。



## 問題二：$skip 參數無法作用
另外實作分頁的時候，以 laravel 為例 (備註)，通常會給我們頁面資訊，而且前端可以自由決定帶入參數給後端要求每頁幾筆，大致回應會如下
```json
{
 "total": 50,
 "per_page": 15,
 "current_page": 1,
 "last_page": 4,
}
```
> 更多可以參考 laravel 官方網站
> [laravel-Converting Results To JSON](https://laravel.com/docs/9.x/pagination#converting-results-to-json)
> 
然而依據 TDX 的官方給予的**Swagger 文件**則是讓我們**帶入 queryString 參數**是<span class="red">`$top`</span>和<span class="red">`$skip`</span>，換句話說，假如我們一頁十筆，需要第二頁的話，<span class="red">`$top`</span>要帶入 20，<span class="red">`$skip`</span>則要帶入 10，則得到的資訊就是 11~20 筆的內容。
![](https://i.imgur.com/wWZegCn.png)

當我邏輯已經確定，程式碼部分已經寫定完畢的時候，實際在渲染畫面卻沒有拿到實際想要的資料，於是先檢查程式碼的邏輯部分有無寫錯，確定各個打 API 流程的程式碼都沒有取得相對應的陣列資料，則改用 postman 檢查 API 所回傳的內容和 swagger 官方文件可以測試回傳的內容後才發現`$skip`的參數並沒有被實作，換句話說就是在 react 專案和 postman 和 sagger 文件實測的結果帶入`$skip`都沒有反應，推測可能是官方原先是 PTX 的 API 轉到今年的 TDX 的時候`$skip`這個功能並沒有被實作出來。

解決方式則是實際<span class="green">**將所需要的資料全部拿回到用戶端，最後再透過陣列操作將其分頁**</span>，程式碼大致如下
```javascript
let totalPage = (Math.ceil(itemAmount / 12));
function makePaginationButtonValue(
    { 
      totalPage,
      currentPage,
      perPageButtonAmount = 5
    }
) {
    //算總頁數
    //算出所有的頁數的陣列
    const totalPageNumberArray = Array.from({
        length: totalPage
    }, (_, index) => (
        index + 1
    ))
    //算出頁數陣列開始的位置
    let beginSliceNumber = (Math.ceil(currentPage / perPageButtonAmount) - 1) * perPageButtonAmount;
    //算出頁數陣列結束的位置
    let endSliceNumber = (Math.ceil(currentPage / perPageButtonAmount)) * perPageButtonAmount;
    // 算出當前的頁數陣列的數字
    return totalPageNumberArray.slice(beginSliceNumber, endSliceNumber);
  }
const paginationButtonValueArray = makePaginationButtonValue({ totalPage, itemAmount, currentPage })
```
在 jsx 的部分就會使用該 array 渲染按鈕
```jsx
{
  paginationButtonValueArray.map(
  (element, index) => (
    <button
        className={`${currentPage === element ? current_page_button : common_page_button}`}
        value={element}
        key={index}
        onClick={(e) => clickPageButtonHandler(e, "page")}
    >
        {element}
    </button>)
  )
}
```

## 問題三：將先前搜尋結果的網址儲存後下次打開會消失
當我們按下 sidebar 的放大鏡搜尋
假如重新整理或者將網址儲存後，日後想要得到上次的搜尋結果的時候，因為先前已經將 queryString 的資訊儲存在網址列了，但是城市的中文名字該如何儲存呢？如果與配合好的後端實作，可以將搜尋結果透過 json 的方式回傳給我們，以達到發同樣的 request 都會擁有該搜尋的 title 在回傳的 json 中。
![](https://i.imgur.com/1PEfQgR.jpg)

### 解決方案一：將中文字儲存在網址列

透過將中文字儲存在網誌列的方式，如果今天在實際的商用專案，網址列內涵中文字轉貼分享的時候有**可能會造成亂碼**，也會讓用戶發現有不明確的網址造成點擊意願下降。

### 解決方案二：儲存城市的英文在網址列

儲存城市的英文在網誌列的方式製作的話，就得使用`useParams`先得到城市的英文名字後，再透過 Javascript 的機制先行建立對應表，讓城市的英文可以對應到要顯示的城市的中文，不過這樣的做法也會衍生需要多建立一個對應表的 code。

### 解決方案三：使用 localStorage
另外一個解決方案就是儲存在 localstorage，不過缺點是將網址分享給其他用的時候，該標題就會消失。

最後我的選擇儲存在 localStorage 的原因是出於好奇是否有可以將 state 可以長期保留的解決方案，因此搜尋了相關關鍵字，而得知`redux-persist`這個套件，其作用方式是將其儲存在 localStorage，另外也能將不需要持久化的 state 設定黑名單，如下列的範例，就將 token 設為黑名單，使其避免儲存在 localStorage。
```javascript
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
import rootReducer from './reducers'

// navigation will not be persisted
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["token"],
};

const reducers = combineReducers({
  token: tokenReducer,
  selectResult: selectResultReducers,
});
const persistedReducer = persistReducer(persistConfig, reducers);
```

## 問題四：發送查詢 API 前需帶入 token(還有更好的解決方式)
針對發送 TDX 的 API 如果未帶入 token 進行查詢的話將會有次數限制，因此為了能夠在發送 API 前帶入 token，這邊撰寫的方式是在<span class="green">**App 的地方先得到 request，並且儲存在 redux 的 state 作為 global state**</span>，當初這樣設計的構想是可能在其他地方都會使用到該 token 發送 API，另外自己在 toolkit 使用`createAsyncThunk`的次數並不多，為了更熟悉使用方式就使用此種解法，因此將其儲存在 global state

設置 slice 的地方大致如下
```javascript
export const getToken = createAsyncThunk("token/getToken", async () => {
  try {
    return await axios(config);
  } catch (error) {
    console.log(error);
  }
});
export const tokenSlice = createSlice({
  name: "token",
  initialState,
  extraReducers: {
    [getToken.pending]: (state, action) => {
      state.status = "loading";
    },
    [getToken.fulfilled]: (state, { payload }) => {
      state.tokenData = payload;
      state.status = "success";
    },
    [getToken.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});
export default tokenSlice.reducer;
```


## 問題五：設計稿與後端 API 沒有統一

由於設計稿內容包含了精選主題，理想上也許後端的 API 送給前端如果是透過簡單的**queryString**或是透過**切分子路由**的方式得到內容，例如<span class="red">`baseURL/visit/history`</span>表示歷史文化的精選主題，而**後端透過 SQL 語法**或是**伺服器端的語言 filter**過後回傳給前端，但是實際上 TDX 的 API**必須透過 oDate 的語法**帶入得到所需的資料，所以才會<span class="green">**先行製作的 array 的檔案**</span>用來定義每個精選主題所需要帶入的查詢參數。

大致如下
```javascript
 [
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
    //以下省略
   ...
]
```

另外像是設計稿當中的推薦或是熱門程度如下
![](https://i.imgur.com/Pr12dBd.png)

理想上也許後端可以**根據被請求的次數計數，加到資料庫中**，再 json 的回傳結果包含類似如下的資訊
```json
{
  "hot":2343254,
  "star":5
}
```
但實際上當後端所回傳的 Json 沒有做類似設計的時候就得做取捨，例如前端使用 fake data 來達成或者取捨不做。


## 問題六：state 的頁面傳遞

在 Sidebar 的地方由於點擊某精選主題後會有綠色外框如下圖

![](https://i.imgur.com/Ec96m6J.png)

其作法是用當下選的 state 是否和該 array 的 urlPathName 一樣，如果一樣就套用該 css 的 class。
```jsx
{allCityArray.map((city, index) => {
  return (
    <button key={index} value={city.urlPathName}
    className={
      city.urlPathName === queryState.urlPathName ? select_city : null
    }
    onClick={
      () => {
        qDispatch(selectCity(city))
        distnationFunction(false)
      }
    } >
      {city.chineseName}
    </button>)
})}
```

但由於點擊精選主題之後就會進行頁面跳轉，這時候整個 sidebar 會重新被渲染，解決辦法像是可以使用<span class="blue">global state</span>或者<span class="blue">使用 lifting-state</span>或是<span class="blue">內建 useContextAPI</span>等等方式，不過在 react <span class="green">**route 的 navigate 有提供一個方式是可以夾帶 state 到該頁面**</span>，實際使用如下
```javascript
navigate(`/search/${url}`, {
  state: {
      themeName: themeItem.title
  }, replace: true
});
```
在要取用的地方再使用如下的語法取出
```javascript
const location = useLocation();
//為了避免有些不是從精選主題跳轉過來造成的重新渲染，因此使用？.來取 themeName
const themeName = location?.state?.themeName;
```

## 問題七：過多的程式碼在一支 component 中

另外為了減少 component 的邏輯，在 sidebar 的檔案中，嘗試<span class="green">**使用 useReducer 來拆分**</span>，將仿造 redux 的方式切分檔案大致如下
```bash
queryActionCreator.js
queryActionType.js
queryInitState.js
queryReducer.js
```

其中將選擇的城市和輸入的關鍵字搜尋定義是操縱同一個 state，各個檔案內容大致如下
### queryActionCreator.js
```javascript
import { SEARCH_INPUT, SELECT_CITY } from "./queryActionType";
function selectCity(city) {
  return {
    type: SELECT_CITY,
    payload: city,
  };
}
function searchInput(inputValue) {
  return {
    type: SEARCH_INPUT,
    payload: inputValue,
  };
}
export { selectCity, searchInput };
```
### queryActionType.js
```javascript
export const SELECT_CITY = "selectCity";
export const SEARCH_INPUT = "searchInput";
```
### queryInitState.js
```javascript
const queryInitState = {
  chineseName: "目的地",
  urlPathName: "all",
  title: "",
  image: null,
  visitType: "ScenicSpot",
  queryObject: {
    $select: "ScenicSpotName,Picture,OpenTime,Address,ScenicSpotId",
    $filter: `Picture/PictureUrl1 ne null and Address ne null`,
  },
};
export default queryInitState;
```

### queryReducer.js
```javascript
import { SELECT_CITY, SEARCH_INPUT } from "./queryActionType";
function queryReducer(state, action) {
  switch (action.type) {
    case SELECT_CITY:
      return {
        ...state,
        chineseName: action.payload.chineseName,
        urlPathName: action.payload.urlPathName,
      };
    case SEARCH_INPUT:
      return {
        ...state,
        queryObject: {
          $select: "ScenicSpotName,Picture,OpenTime,Address,ScenicSpotId",
          $filter: `Picture/PictureUrl1 ne null and Address ne null and contains(${
            state.visitType
          }Name,'${action.payload.trim()}')`,
        },
      };
    default:
      return state;
  }
}
export default queryReducer;
```
### Sidebar 宣告 useReducer 的部分
```javascript
const [queryState, qDispatch] = useReducer(queryReducer, queryInitState);
```
