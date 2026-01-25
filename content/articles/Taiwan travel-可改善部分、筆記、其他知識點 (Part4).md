---
title: Taiwan travel-可改善部分、筆記、其他知識點 (Part4)
slug: 2022-09-12T13:31:00.000Z
date: 2022-09-12T13:31:00.000Z
tags: ["React"]
---

本文為製作 Taiwan travel 的個人想法，如果有其他建議歡迎與我交流🙂

總共分為 4 個 part 如下：

- Taiwan travel-頁面功能、component、folder、router、UX 設計思維 (Part1)
- Taiwan travel-css layout、url 設計、module design、readability(Part2)
- Taiwan travel-issue and solution(Part3)
- Taiwan travel-可改善部分、筆記、其他知識點 (Part4)

以下為 Part4 的大綱

- 可以再改善部分
  - token 存入 cookie
  - 使用 axios 切分 API
- 其他知識點
  - 在物件的 key 使用變數的形式
  - Logical OR assignment (||=)
  - IntersectionObserver in React

## 可以再改善部分

### token 存入 cookie
先前提到發送查詢 API 前需帶入 token，為了更熟悉 redux 使用 global state，不過其實 TDX 回應的 token 有時效性，大致內容如下。
```json
{
    "access_token": "這裡是 TDX 所回應的 token",
    "expires_in": 86400,
    "refresh_expires_in": 0,
    "token_type": "Bearer",
    "not-before-policy": 0,
    "scope": "profile email"
}
```
他存活的時間是 86400(應當是秒)，也就是一天的時效，應當是將 token 透過 document.cookie 的方式存入，在發送查詢 API 前先使用 axios 的 interceptors 夾帶 token，如果發送的時候發現過期的話，再重新取得 token 後再發送查詢的 API。

### 使用 axios 切分 API
由於使用 oData 的形式將眾多資料查詢的控制權移轉給前端，因此我們就能更詳細的切分 API 的內容，在這次的 project 中，目前僅只有透過 axios 的 crate 方式建立一個 instance，在需要使用的地方透過 instance 實體添加 config 參數來發送 API。
```javascript
import axios from "axios";
export const visitInstance = axios.create({
  baseURL: `https://tdx.transportdata.tw/api/basic/v2/`,
});
```

在發送查詢的 API 的程式碼部分使用 config 參數，好處是所有的查詢都可以透過這部分的程式碼做到查詢，不過當 project 過大的時候也許會造成管理不易，其實可以做到的地方是將要查詢的內容也切分檔案或者 function 的方式讓日後查找程式碼更為方便。

```javascript
const config = {
  method: "GET",
  url: `/Tourism/${pathUrl + cityPath}?${params}`,
  headers: {
    Authorization: `${token_type} ${access_token}`,
  },
};
```


## 其他知識點

### 在物件的 key 使用變數的形式
這次實作的部分主要著重在練習拆分程式碼，另外也與人家交流的過程和自己嘗試撰寫程式碼的時候得知一些之前沒有使用過的做法，像是解構當中，物件的 key 使用變數的形式如下
```javascript
const { Picture: { PictureUrl1 } = {},
        Position: { PositionLat = 23.5, PositionLon = 121 } = {},
Description, DescriptionDetail,
TravelInfo, [`${visitType}Name`]: visitName } = detailData?.[0] || {};
```
在 detail 頁面有可能根據 visitType 的不同造成要解構的 key 不一樣，因此使用變數命名的方式。

### Logical OR assignment (||=)
從其他人得知預設值也能使用||=的方式或是？?=的方式，其用法類似+=。
原本我們在給定變數預設值可以使用 |或`??`，例如當 title 是未定義的時候則會回傳"預設值"。
```javascript
const title = title || "預測值";
//如果 title 未定義的話將會回傳||右邊的值
```
類似+=的方式可以使用另外一個寫法是`||=`
如下
```javascript
const title ||= "預設值";
```
同樣的？?也能使用類似的用法如下
```javascript
const title ??= "預設值";
```

### IntersectionObserver in React
沒有實作在手機板頁面改用無限滾動 (infinite scroll) 的原因是首先 TDX 的 API 並沒有實作`$skip`達到切分頁的效果，這些分頁的按鈕的實作方式實際上是將資料一次性全部拿回來後把資料使用 array 分類將其切分出頁面。

希望日後有實際分頁 router 的 API 時再完整實作，然而在不用 scroll 的監聽事件以及套件的情況下，有一個 IntersectionObserver 的物件可以將其設定無限滾動，優點是效能比起 scroll 好，因此這邊簡單記錄一下實作的方式。

```jsx
<Route path="/infinite/ScenicSpot/all/:page" element={<Infinite />} />
```

實作方式是在`jsx`的地方創立一個 div 如下，
```jsx
<div className={wrap_card}>
  {
    renderData.map(
      (place, index) => {
        if (renderData.length === index + 1) {
            return (
              <Card key={index} visitType={"ScenicSpot"} placeDatum={place}>
                <CardContent placeDatum={place} />
              </Card>
            )
        } else {
          return (
          <Card key={index} visitType={"ScenicSpot"} placeDatum={place}>
              <CardContent placeDatum={place} />
          </Card>)
        }
      }
    )
  }
  <div ref={divRef}></div>
</div>
```

這裡為了得到該 element，因此使用**useRef()**的 hook，將其設在 jsx 的 div 上，此時`div.Ref.current`就是實際的 DOM 元素，這時候要實際操縱 DOM 元素的時候就得綁在 useEffect 上面，程式碼大致如下
```javascript
useEffect(() => {
    const io = new IntersectionObserver((entries) => {
        console.log(entries);
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            setPage(prev => prev + 1);
        });
    }, {});
    io.observe(divRef.current);
}, []);
```
其邏輯大概是透過捲動的時候，當捲動到被綁定的 div 與 viewport(也就是整個頁面視窗，會觸發 setPage，而 setPage 是 useState 的 hook，因此就會讓畫面渲染，這時候 div 的位置又掉出 viewport 外面了，再次捲動到被綁定的 div 與 viewport 又會觸發 setPage，以此類推的方式就可以達到無限滾動的效果了。

最後呈現結果如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/React-Taiwan-Visit/userExperienceGif/visitInfaniteScroll.gif)
> 參考資料
> [Intersection Observer using React](https://dev.to/producthackers/intersection-observer-using-react-49ko)

