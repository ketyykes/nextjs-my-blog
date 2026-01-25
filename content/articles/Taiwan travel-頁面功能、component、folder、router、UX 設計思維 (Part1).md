---
title: Taiwan travel-頁面功能、component、folder、router、UX 設計思維 (Part1)
slug: 2022-08-31T13:31:00.000Z
date: 2022-08-31T13:31:00.000Z
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

以下為 Part1 的大綱

  - 頁面功能
    - 首頁
    - 搜尋頁面 
    - 詳細頁面
  - 使用技術
  - 資料夾的拆分方式
  - component 的拆分思維
  - route 設計的思維
  - 使用者體驗


## 頁面功能

以下將會講解整個網站可以達到的功能。

### 首頁

- <span class="blue rem25">點選</span>右方可以得到更多該類型的資訊
![](https://i.imgur.com/u3oAw9H.png)

- <span class="blue rem25">點選</span>目的地<span class="green rem25">可選擇城市</span>
  - 未選擇城市預設會全部搜尋
![](https://i.imgur.com/1yaRZrH.png)
- <span class="blue rem25">輸入</span>內容至搜尋關鍵字 input 欄位可以<span class="green rem25">得到關鍵字的搜尋結果</span>
![](https://i.imgur.com/HtCXnbo.png)
- <span class="blue rem25">點選</span>精選主題將會得到<span class="green rem25">該主題內容</span>
![](https://i.imgur.com/77seMZc.png)
- <span class="blue rem25">點選</span>任意地點 (卡片) 可以<span class="green rem25">得到該地點的詳細頁面</span>
![](https://i.imgur.com/LmyMGac.png)

### 搜尋頁面
![](https://i.imgur.com/otnFqEI.png)

搜尋結果<span class="green rem25">可得到地址和營業時間</span>
<span class="blue rem25">點擊</span>Pagination<span class="green rem25">可跳轉該頁、上、下頁和首頁及最後頁</span>

![](https://i.imgur.com/qkXFeyM.png)

可以<span class="blue rem25">分享</span>搜尋結果給其他人能得到相同的資訊

### 詳細頁面
- 開源地圖，<span class="blue rem25">可拖放</span><span class="green rem25">得知位置資訊</span>
![](https://i.imgur.com/ltQ5ZjW.png)

- 下方更多景點<span class="green rem25">可以得到</span>隨機產出三個景點

![](https://i.imgur.com/213l66c.png)


## 使用技術
- axios
- dayjs
- leaflet
- qs
- react-leaflet
- react-redux
- redux-persist
- fontAwesome
- react-toolkit

## 資料夾的拆分方式

- API：API 路由的地方
- assets：圖片或資料的地方
- component：元件的地方
- hook：Custom hook 的地方
- store：Redux 設定的地方
- styles：被 mixin 或 global 的 scss 的地方

| 資料夾名稱 | 內容物                     |
| ---------- | -------------------------- |
| API        | API 路由                   |
| assets     | 圖片或資料                 |
| component  | 元件                       |
| hook       | Custom hook                |
| store      | Redux 設定                 |
| styles     | 被 mixin 或 global 的 scss |

下方為資料夾實際結構

```bash
├─API
├─assets
│  └─images
│      └─best_theme
├─component
│  ├─Aside
│  ├─Banner
│  ├─Card
│  ├─Footer
│  ├─Header
│  ├─Logo
│  ├─Pagination
│  ├─Sidebar
│  ├─ThemeCardContentByVisitType
│  ├─ThemeSection
│  └─ThemeTitle
├─hook
├─pages
│  ├─Detail
│  ├─HomePage
│  ├─NotFound
│  └─Search
├─store
└─styles
```

## component 的拆分思維

考量到 react 使用[Composition](https://zh-hant.reactjs.org/docs/composition-vs-inheritance.html)的概念，拆分 component 其考量到的部分包含複用性、將大問題拆解成小問題、讓單一程式碼複雜度降低，這邊拆分的原件如圖
![](https://i.imgur.com/FD1eUWo.png)


### 使用物件和方法產生 component
比較值得提的拆分構想是 ThemeCardVisitType，由於不同類型卡片資訊、像是熱門景點、觀光活動、美食品嘗、住宿推薦，其卡片內容組成是**圖像 + 卡片**內容資訊，而卡片內容資訊的部分有的是**地址 + 開放時間**、有的是**地址 + 活動時間**、有的是**地址 + 電話**
如下列的圖片
![](https://i.imgur.com/6PiUNvL.png)

![](https://i.imgur.com/6iWjHko.png)

![](https://i.imgur.com/fyy3yfE.png)

![](https://i.imgur.com/qipL0kA.png)

加上由 API 回傳回來的 data 會根據不同的類型而不同，例如觀光類的 key 會叫做 ScenicSpotName、美食類的 data 的 key 會是 RestaurantName，還有要顯示的圖片也會根據類型的不同而不同
因此建置了一個**ThemeCardContentByVisitType**的物件來產生其 Component 如下圖

![](https://i.imgur.com/PBdrpYb.png)

由於<span class="blue">卡片內容 (CardContent) 的 jsx 的部分並不多</span>，也<span class="red">避免</span>在撰寫<span class="blue">Card 元件的時候暴露太多邏輯</span>，轉而改用建構成物件型式，透過接收 children 的方式，這樣做的好處是當我們瀏覽卡片元件區段的程式碼，讓 Card 元件就處理 Card 的事情 (把 Card 作為容器和觸發事件用)，例如點擊卡片元件事件的頁面跳轉邏輯、錯誤處理和接收 children 將其作為 UI 渲染而已，如下列程式碼

> 備註：如果不將卡片內容拆分出小元件的話，可能在進到卡片元件的邏輯時，需要使用多個 if 或者 switch 判別是哪種類型的卡片內容元件，使得 Card 元件暴露太多邏輯。
```jsx
const Card = ({ placeDatum, visitType, children }) => {
const { card, wrap_img } = styles;
const navigate = useNavigate();
const handleError = (e) => {
    e.currentTarget.src = banner;
}
const clickCardHandle = () => {
    const id = placeDatum[`${visitType}ID`]
    let url = `${visitType}?$filter=${visitType}ID eq '${id}'`;
    navigate(`/detail/${url}`);
}

// card 不要共用到太複雜，而是別人給他什麼 他就渲染成什麼

return (
    <div className={card} onClick={clickCardHandle}>
        <div className={wrap_img}>
            <img src={placeDatum.Picture.PictureUrl1 || banner} onError={(error) => handleError(error)} alt="" />
        </div>
        <p>{placeDatum[`${visitType}Name`]}</p>
        {children}
    </div>
)
}
```

在一些需要 Card 元件的地方僅需要**像一般的 html 的 tag 使用方式透過 children 方式傳遞給 Card**，其邏輯部分已經在**ThemeCardContentByVisitType**物件處理了。

```jsx
<div className={wrap_card}>
  {
    randomPlace.map(
        (place, index) =>
        (
          <Card key={index} visitType={visitType} placeDatum={place}>
              <CardContent placeDatum={place} />
          </Card>
        )
    )
  }
</div>
```

另外 Detail 頁面有部分需要顯示的畫面與卡片的內容重疊，因此也<span class="green">可以複用**ThemeCardContentByVisitType**物件</span>

### 使用 children 時機 - 如同看 html tag 般的閱讀性
由於 detail 頁面與 search 頁面都有 header，但其內容差別一個是 render 標題，另一個 render 是 Banner 元件，因此使用讓 children 裡面帶入的內容用起來像是在看 html tag 擁有階層關係的 code

觀看程式碼的時候如下
在 HomePage 頁面
```jsx
<Header menuValue={menuValue} >
  <Banner />
</Header>
```
在 Search 頁面
```jsx
<Header >
  <h2 className={`${title_type} ${menuValue ? display_none : display_block}`}>
    {title ||= "搜尋結果"}
  </h2>
</Header>
```
### 簡化頁面檔暴露的 component
另外主要頁面檔的 jsx 會盡量以類似 HTML5 的語意化標籤 (Semantic Elements) 的命名的元件為主
以 NotFound 頁面的 jsx 為例就會僅有 Aside、Header、Banner 和 Footer 的 component，如果想了解 Aside 內容包含些什麼的話，再去 Aside Component 觀看其程式碼。
```jsx
<div className={container}>
  <Aside
      menuValue={menuValue}
      menuValueFunction={menuValueFunction}
  />
  <Header menuValue={menuValue} >
    <Banner />
  </Header>
  <article className={`${article} ${menuValue ? display_none : display_block}`}>
      找不到該分頁
  </article>
  <Footer menuValue={menuValue} />
</div >
```
### 父層可查看 component 的傳入的 props 內容
在首頁的部分有熱門景點、觀光活動、美食品嘗、住宿推薦使用 ThemeSection 元件<span class="blue">透過 prop 可以看出傳入的資料流是什麼內容</span>
以首頁的程式碼為例如下
```jsx
<article className={`${article} ${menuValue ? display_none : display_block}`}>
  <ThemeSection
      title="熱門景點"
      visitType="ScenicSpot"
      placeData={placeDataScenicSpot}
      CardContent={ScenicSpot}
      moreQuery={SCENICSPOT_MORE_QUERY}
  />
  <ThemeSection
      title="觀光活動"
      visitType="Activity"
      placeData={placeDataActivity}
      CardContent={Activity}
      moreQuery={ACTIVITY_MORE_QUERY}
  />
  <ThemeSection
      title="美食品嘗"
      visitType="Restaurant"
      placeData={placeDataRestaurant}
      CardContent={Restaurant}
      moreQuery={RESTAURANT_MORE_QUERY}
  />
  <ThemeSection
      title="住宿推薦"
      visitType="Hotel"
      placeData={placeDataHotel}
      CardContent={Hotel}
      moreQuery={HOTEL_MORE_QUERY}
  />
</article>
```
### 適時使用 composition 概念
在 ThemeSection 裡面再次使用**React 的核心概念 Composition**，藉由 ThemeTitle 和 Card 去構成 Component
程式碼如下
```jsx
<ThemeTitle visitType={visitType} title={title} moreQuery={moreQuery} />
<div className={wrap_card}>
  {placeData?.map(
    (place, index) =>
      (
        <Card 
          visitType={visitType} 
          key={index} 
          placeDatum={place}>
          <CardContent placeDatum={place} />
        </Card>
      )
    )
  }
</div>
```

## route 設計的思維
```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/search/:visitType/:city/:page" element={<Search />} />
  <Route path="/detail/:visitType" element={<Detail />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

![](https://i.imgur.com/yPysewH.png)

### 共用 search route
由於設計稿畫面呈現 SideBar 搜尋後和首頁點選更多景點的畫面差異不大，所以在 react-route 切分出<span class="red">`/search`</span>

### visitType、page 參數設定與 TDX API 類似
其 visitType 和 City 參數也設定成和 TDX 的 API Route(如上圖) 類似，visitType 表示<span class="blue">**觀光種類**</span>為**ScenicSpot、Restaurant、Hotel**或者**Activity**這四種 API 其中一種，city 表示某個縣市，如果想要搜尋全台參數則是帶入 all(在後面資料抽離的部分會顯示。

### page 參數

當搜尋結果過多的時候將會進行分頁，因此添加 page 參數進行頁面劃分。

### 詳細頁面 route

點擊任何卡片頁面將會導向<span class="red">`/Detail`</span>的 Route

### not found 頁面

預設除了上述自定義 Route 以外的 path 就會導向 NotFound 頁面。

## 使用者體驗

雖然當初再看設計稿的時候有些並非是設計師具有詳細說明的地方，但是畢竟前端是要製作畫面有關的工程，也是面對使用者的第一道線，因此這邊會簡單說明製作了那些使用者體驗。

### 使用 hover 和 active 增加或改變顏色。

#### 精選主題的 Icon

在滑鼠的游標 hover 和 active 的時候，添加 border，在 active 的時候顏色改略為淡色，增加回饋感。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/React-Taiwan-Visit/userExperienceGif/visitTransitionAfterSelectorTheme.gif)

#### 上下頁切換按鈕

在 pagination 的部分 hover 改變 background 的顏色，一樣在點擊的時候 (active) 使用淡色系增加回饋感。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/React-Taiwan-Visit/userExperienceGif/visitTransitionPagation.gif)


### 使用 scale 微放大 icon

#### Logo 點擊回首頁
使用<span class="red">scale</span>，微放大 Logo 按鈕表示可供點擊的提示。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/React-Taiwan-Visit/userExperienceGif/visitTransitionLogo.gif)


#### FontAwesome 回上一頁
使用<span class="blue">fontAwesome</span>製作回上一頁的按鈕，一樣在**hover**的時候使用<span class="red">scale</span>語法微放大表示可供點擊。
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/React-Taiwan-Visit/userExperienceGif/visitTransitionPrePage.gif)

### 更多景點的連結與卡片

```scss
a {
    color: variable.$primary_color1;
    position: relative;
    padding: 10px 0px;
    white-space: nowrap;
    &:after {
      content: "";
      position: absolute;
      height: 5px;
      width: 100%;
      left: 0;
      bottom: 0;
      background: variable.$primary_color1;
      transform: scaleX(0);
      transform-origin: bottom left;
      border-radius: 4px;
    }
    &:hover:after {
      transition: transform 0.5s;
      transform: scaleX(1);
    }
  }
```

使用偽元素技巧製作下底線，原先的樣貌是<span class="red">`scaleX(0)`</span>在 hover 的時候會變成<span class="red">`scaleX(1)`</span>，使用<span class="red">`transform`</span><span class="blue rem25">優點</span>是可以透過<span class="red">`tansform-origin`</span>的屬性<span class="blue rem25">決定延伸的方向</span>，以這裡的語法為例是在文字的下方由左至右延伸，另外添加一點點<span class="red">`border-radius`</span>使線條帶點圓潤感。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/React-Taiwan-Visit/userExperienceGif/visitTransitionMoreAndCardHover.gif)

### dropdown 的減少突兀感，選擇城市後自動收回

這邊使用<span class="red">`max-height`</span>從 0 漸變到其設定的高度，icon 的部分使用<span class="red">`rotate`</span>暗示可以再次點擊收回下拉式選單，在使用者體驗上面也透過動畫減少突兀感，另外點擊選擇的城市後則會自動收回以便使用者順勢搜尋關鍵字。如下列兩張圖。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/React-Taiwan-Visit/userExperienceGif/visitTransitionSelectorCity.gif)

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/React-Taiwan-Visit/userExperienceGif/visitTransitionAfterSelectorCity.gif)
