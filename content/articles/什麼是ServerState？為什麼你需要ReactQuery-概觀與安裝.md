---
title: 什麼是ServerState？為什麼你需要ReactQuery-概觀與安裝
slug: 2023-07-05T13:31:00.000Z
date: 2023-07-05T13:31:00.000Z
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
.blue{
color:blue;
}
.green{
color:green;
}
.code{
background-color:#f7f7f7;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>

本文將會依照官方文件所整理的重點加上自身理解講述下內容

- 動機
  - 簡化開發者手動處理伺服器資料
  - Web框架的伺服器資料狀態處理
- React Query特點
  - 資料獲取(fetching)
  - 快取(caching)
  - 同步(synchronizing)
  - 更新伺服器狀態(updating server state)
- 伺服器狀態
  - 處理伺服器狀態需求 
- 總結React Query
- 安裝
  - 安裝React Query
- 推薦安裝React Eslint Plugin Query
- 安裝ReactQuery devtool
- 概觀
- 程式碼講解

## 動機

- 減少開發者手動撰寫程式碼處理伺服器資料到status過程
- 大部分的Web framewrok並未提供處理伺服器資料的fetch或是update

以下針對動機詳細說明

### 簡化開發者手動處理伺服器資料

一般而言，我們作為前端開發必須手動管理<span class="blue rem25">獲取、快取、更新、同步</span>等動作，使用ReactQuery可以<span class="blue rem25">減少撰寫這些程式碼</span>，只需要<span class="blue rem25">聚焦在處理資料邏輯</span>，不必擔心處理複雜的伺服器資料流程。

### Web框架的伺服器資料狀態處理

大多數的<span class="blue">框架</span>並<span class="blue"><span class="rem25 red">沒有</span>提供伺服器資料獲取、更新和同步的功能</span>。我們只能夠仰賴開發者撰寫程式碼撰寫管理伺服器的狀態處理。

## React Query特點

React Queryv4 特點

更容易的處理以下內容包含

- **資料獲取(fetching)**
- **快取(caching)**
- **同步(synchronizing)**
- **更新伺服器狀態(updating server state)**

以下針對每個內容簡單講解

### 資料獲取(fetching)

ReactQuery針對資料獲取的功能提供了<span class="red ">**useQuery**</span>這個<span class="red">**hook**</span>，把fetch資料的非同步的函式帶入useQuery的參數就能得到像是是否loading、是否錯誤、資料、錯誤訊息等等的內容，提供了一個更簡單的方式作為資料獲取，更多可以參考[useQuery](https://tanstack.com/query/v4/docs/react/reference/useQuery)

### 快取(cacheing)

針對快取的部分，可以透過前端進行暫存資料，減少對伺服器的請求，像是可以根據<span class="blue">狀態</span>是否<span class="blue">改變</span>來決定對伺服器<span class="blue">發送請求</span>，另一方面可以<span class="blue">設定時間</span>來<span class="blue">定時向伺服器發送請求</span>，如果沒有過期的話就不會再次發送了。

### 同步(synchronizing)

這邊的<span class="blue">同步</span>指的是<span class="blue">React Query能夠將前端的資料與伺服器端的資料保持同步</span>，換句話說我們可以設定時間來定時的fetch伺服器資料，這樣前端渲染的顯示資料能夠保持定時更新。另外也能特別處理伺服器狀態的資料來讓資料同步。

### 更新伺服器狀態(updating server state)

針對更新伺服器狀態指的是當伺服器的資料庫有所變化或是如果發送的請求是造成資料庫的資料發生變化，這些資料有可能和前端的狀態不一樣，在TanStack Query可以使用useMutation發送請求並且自動獲取最新的資料。

## 伺服器狀態

大多數的狀態管理library可以處理client status，但對於非同步或伺服器狀態並不是最好的選擇，這是由於伺服器狀態具有以下特點

- **可能擁有過時的狀態**
- **隱式共享所有權，因此可能在不知情的情況被其他人串改**
  - 換句話說，當其他人更改伺服器的資料的時候，如果沒有再次發API請求，此時畫面顯示的資料就不是最新的情形
- **需要使用非同步的API請求和更新**
- **遠端資料庫是持久化，但我們卻無法擁有控制權**

<span class="blue rem25">~~如果我們資料庫的資料是真理的話，我們可以使ReactQuery來讓我們接近真理。~~</span>

### 處理伺服器狀態需求

處理伺服器狀態的時候大多數會面臨以下需求

- **caching**
- **將重複的對同一資料的多個請求合併為單一請求。**
- **在背景更新過時的狀態**
- **知道何時資料"過時"**
- **盡快的反應資料更新**
- **進行效能優化，例如分頁和延遲加載(lazying loading)**
- **管理伺服器狀態的memory和垃圾回收機制**
- **使用結構化的方式將查詢結果記憶起來**

## 總結React Query

針對以上的痛點React Query具備以下優點

- **減少複雜難度的程式碼，以 React Query程式碼取而代之**
- **使應用程式更易維護、建構新功能，無須擔心伺服器狀態與client的連結**
- **直接影響終端使用者，使應用程式感覺更為快速及具備響應式**
- **潛在減少頻寬(bandwidth) 增加記憶體效能**
 
## 安裝React Query

```bash
npm i @tanstack/react-query
```

## 推薦安裝React Eslint Plugin Query

根據官方文件我們可以使用官方所推薦的**eslint**避免在撰寫程式碼的時候寫出潛在錯誤的程式碼，透過**TanStack query eslint**可以幫助我們抓到潛在的bug。

```bash
npm i -D @tanstack/eslint-plugin-query
```

## 安裝ReactQuery devtool

對我們我在使用**ReactQuery**想要視覺化的方式知道**ReactQuery**工作情形，我們可以下載官方附帶的開發者工具以便減少debug的時間。

預設情形只會在process.env.NODE_ENV === 'development'也就是只會在開發階段的時候才會出現。

安裝完上述工具後我們就可以透過以下程式碼看到React Query的debug工具

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

如下圖

![](https://hackmd.io/_uploads/r1nWqcMK2.png)

按下按鈕可以了解目前獲取的資料內容

![](https://hackmd.io/_uploads/HJU49cfF3.png)

其他可以設定的選項像是預設是否開啟、工具顯示的位置等等，這些選項設置可以參考官方文件[TanStackQuery-Devtools](https://tanstack.com/query/v4/docs/react/devtools)

## 概觀

以下列程式碼作為概觀最基本的範例當中所需要的必須包含QueryClient、 QueryClientProvider、useQuery

```javascript
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient();  // 建立一個 QueryClient 實例

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>  // 提供 QueryClient 到元件樹中
      <Example />
    </QueryClientProvider>
  );
};
const queryFn = fetch('https://pokeapi.co/api/v2/pokemon/25').then((res) => res.json());

function Example() {
  // 使用 useQuery 鉤子獲取寶可夢資料
  const { isLoading, error, data } = useQuery(['pokemonData'], () =>
    queryFn
  );

  if (isLoading) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <img src={data.sprites.front_default} alt="Pikachu" />
      <div>基本生命值:{data.stats[0].base_stat}</div>
      <div>基本特攻:{data.stats[3].base_stat}</div>
      <div>基本速度:{data.stats[5].base_stat}</div>
    </div>
  );
}

export default App;
```

最後我們就可以得到皮卡丘了。如下圖

![](https://hackmd.io/_uploads/H11y2qfKh.png)


### 程式碼講解

<span class="red">QueryClientProvider</span>類似<span class="blue">Redux</span>或者<span class="blue">useContext</span>一樣擁有一個<span class="green">Provider</span>其key來自於<span class="red">client</span>，而我們可以透過它所提供的方法也就是<span class="green rem25">QueryClient</span>建立實體。

最後我們在某個<span class="code">Component</span>當中使用<span class="green rem25">useQuery</span>，從範例中可以看到當他解構的時候，除了<span class="red">data</span>本身還可以解構出是否資料在載入的狀態的<span class="code">isLoading</span>或者當載入的時候有錯誤的錯誤訊息<span class="code">error</span>。需要注意的地方是我們帶入<span class="green rem25">useQuery</span>的第一個參數需要有一個鍵(<span class="red rem25">key</span>)，以便後續辨識。


參考資料 [TanStack Query v4-Doc](https://tanstack.com/query/v4/docs/react/overview)
