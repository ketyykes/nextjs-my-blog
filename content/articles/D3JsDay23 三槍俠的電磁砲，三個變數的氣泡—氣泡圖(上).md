---
title: D3JsDay23 三槍俠的電磁砲，三個變數的氣泡—氣泡圖(上)
slug: 2021-10-08T12:16:00.000Z
date: 2021-10-08T12:16:00.000Z
tags: ["D3.js","Javascript"]
---

## 氣泡圖介紹
昨天已經介紹完散佈圖了，大致上與散佈圖的作法大同小異，差別在於氣泡本身也就是`circle`，也能呈現一個變數值，在svg裡面我們將設定其屬性r來定義氣泡的半徑大小。

本日預計使用實價登錄網站的台南交易資料來實作一個氣泡圖、其中x軸表示售出時的建物面積、y軸表示售出時的土地面積，其氣泡的大小表示成交價格。

### 注意顯示資料的半徑R值

為了肉眼辨別視覺差異，讓使用者觀看面積有總價上的感覺，因此`R必須再開平方根`避免渲染出來的圖形造成次方倍的扭曲解讀。

這邊使用數學式子來稍微講解一下關係

關係表格如下假設半徑是r

半徑與面積關係如下
r：πr²

| 半徑( r )  | 1   | 2   | 3   | 4   |
| :--------: | --- | --- | --- | --- |
| 半徑平方r² | 1   | 4   | 9   | 16  |
| 圓面積πr²  | π   | 4π  | 9π  | 16π |

套用到上述的例子當中，
半徑1的半徑平方是1圓面積是π
半徑1的半徑平方是4圓面積是4π
寫數學式子如下

1:π = 4:4π = 9:9π

故圓面積是與半徑平方成正比

## 功能說明
* 可以使用下拉式選單切換行政區域後重繪成該行政區的圖表
*  使用者可以輸入土地面積和建物面積的範圍來後，點下軸線更新按鈕重繪圖表
*  當滑鼠滑入到某個圓點的時候可以顯示該筆資料的相關資訊

## 程式構想淺談
* 我們要有一個下拉式選單和四個`input`欄位來輸入x軸、y軸的範圍並加上一個**軸線更新**的按鈕
* 我們下拉式選單的行政區內容是經由d3Js篩選出鄉鎮市地區後動態新增至選單裡
* 我們多設置一個ScaleR將總價格轉換成圓的半徑，之後再以`Math.sqrt()`將其半徑開平方根，以便繪圖完的圓形面積比與房屋價格比相同，與上一篇文章大同小異會是設置scaleX和scaleY來進行資料轉換至svg的座標點位置。

## 撰寫html點擊按鈕
```html{numberLines: true}
<div class="wrap">
    <select id="district">
    </select>
    <div class="area-str">建物面積最小值</div>
    <input type="number" id="min-bulid" value=0>
    <span>平方公尺</span>
    <div class="area-str">建物面積最大值</div>
    <input type="number" id="max-bulid" value=300>
    <span>平方公尺</span>
    <div class="area-str">土地面積最大值</div>
    <input type="number" id="max-land" value=500>
    <span>平方公尺</span>
    <div class="area-str">土地面積最小值</div>
    <input type="number" id="min-land" value=0>
    <span>平方公尺</span>
    <button id="btn">軸線更新</button>
</div>
```
這邊在`input`使用`id屬性`以便日後要使用js選取時更為方便。

## 動態插入至select選單
```javascript{numberLines: true}
const groupData = d3.group(data,d=>d["鄉鎮市區"]);
groupData.delete("The villages and towns urban district");
console.log(groupData);
const districtAry = [...groupData.keys()];
let defaultDistrict = districtAry[0];
    for (let i=0;i<districtAry.length;i++) {
        d3.select("#district").append("option").text(districtAry[i]);
}
```
1. 將資料根據鄉鎮市區的欄位進行群組化 
1. 由於群組化後的資料第一筆是實價登錄網用來說明的內容，因此使用Map.delet()方法將其刪除
1. 可以觀看console.log()觀看群組化後的資料樣貌如下圖
1. 其透過Map.keys()的方法將資料展開後再次包裝成陣列的樣貌存入districtAry變數裡面，另外選定陣列當中的第一筆當作預設行政區預計讓使用者載入的時候可以先行看到畫面
1. 最後使用for迴圈將option內容插入至id為district的元素


> 如果不熟悉map或展開運算不熟的話可以參考MDN
> [Map物件操作MDN介紹](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
> [展開運算子](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
## 資料篩選與轉型
可以`console.log(groupData.get(defaultDistrict))`查看資料內容
為了確保他是否為一個陣列再次使用`Array.isArray()`方法檢查
確認無誤後使用陣列的操作方法進行資料篩選，本次希望以交易標的是房子為主，因此過濾掉交易標的為車位和土地的資料
使用`forEach()`轉換將土地、建物、總價的資料從字串型態轉換成數字型態
程式碼如下

```javascript{numberLines: true}
console.log(groupData.get(defaultDistrict));
console.log(Array.isArray(groupData.get(defaultDistrict)));
const house = groupData.get(defaultDistrict).filter(function (d) {
if (d["交易標的"] !== "土地" && d["交易標的"] !== "車位") {
    return d;
}
});
house.forEach(el => {
    el["建物移轉總面積平方公尺"] = +(el["建物移轉總面積平方公尺"]);
    el["土地移轉總面積平方公尺"] = +(el["土地移轉總面積平方公尺"]);
    el["總價元"] = +el["總價元"];
});
```

console出來的資料如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211008_01.png)

## selection.node()介紹
取得HTML元素雖然可以使用原生Js的`getElementById`，不過這邊介紹一個在d3的select底下的一個方法，`selection.node()`
嘗試著撰寫以下程式碼
```javascript{numberLines: true}
console.log(d3.select("#min-bulid").node());
console.log(document.getElementById("min-bulid"));
console.log(d3.select("#min-bulid").node()===document.getElementById("min-bulid"));
```
這邊可以發現透過d3的`selecttion.node()`的API和`document.getElementById()`的方法所得到的內容是相等的情形如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211008_02.png)


> [selection.node()](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_nodes)

因此接下來我們可以撰寫以下的程式碼來得到使用者輸入的值並且將其設置為座標比例尺的上限和下限
具體程式碼如下
```javascript{numberLines: true}
let minBuildArea =d3.select("#min-bulid").node().value;
let maxBuildArea =d3.select("#max-bulid").node().value;
let minLandArea = d3.select("#min-land").node().value;
let maxLandArea =d3.select("#max-land").node().value;
const scaleX =  d3.scaleLinear().domain([minBuildArea,maxBuildArea]).range([0,800]).clamp(true);
const scaleY =  d3.scaleLinear().domain([maxLandArea,minLandArea]).range([0,800]).clamp(true);
```
## 圓形半徑比例尺
與昨天不同的是這次我們要再**加入一個ScaleR來做為圓點的半徑**，我們將其範圍映射到5到900，換句話說希望圓點的半徑最小有5，由於之後會開平方根，因此最大值也頂多占座標軸的√900=30而已
然後房價輸入價位最大值設定1億(~~這樣範圍應該可以容納大多數的房價了吧???~~)，
因此添加以下程式碼
```javascript{numberLines: true}
let minPrice = 0;
let maxPrice = 10000000;
const scaleR = d3.scaleLinear().domain([minPrice,maxPrice]).range([5,900]).clamp(false);
```
最後我們將剛剛所做出來的比例尺配合**axisAPI**製作座標軸程式碼如下
```javascript{numberLines: true}
const axisX = d3.axisBottom(scaleX)
                .ticks(15)
                .tickFormat(d=>(d+"m²"))
                .tickSize(-800); 
const axisY = d3.axisLeft(scaleY)
                .ticks(15)
                .tickFormat(d=>(d+"m²"))
                .tickSize(-800); 
const gX = svg.append("g")
                .attr("transform",`translate(50,850)`)
                .classed("xAxis",true);
const gY = svg.append("g")
                .attr("transform",`translate(50,50)`)
                .classed("yAxis",true);                    
```
## selection.call()介紹
這邊簡單介紹一下`selection.call`，先前我們再進行座標渲染的時候都是使用`axis(selection)`的方式，例如`axisBottom( svg.append("g"))`，然而**d3Js是大量使用方法鏈所形成的一個套件**，因此如果使用axisY(gY)的方式來渲染座標軸的話，不便將方法鏈形成(由於回傳的內容不能傳遞給下一個函式使用。)

我們可以撰寫以下程式碼來觀看差異
```javascript{numberLines: true}
console.log(axisY(gY));
console.log(gY.call(axisY));
```

這邊觀看回傳的東西可以發現`axisY(gY)`回傳的是**undefined**，但是`Y.call(axisY)`可以回傳一個物件，所以當我們執行`axisY(gY)`或`gY.call(axisY)`的時候雖然都可以將座標軸繪製到網頁畫面上，但是使用call的方式會回傳物件以便後續給函式繼續接續方法鏈。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211008_03.png)

這邊也可以觀看官方文件的說明，他表示下列兩種執行方式都是一樣的結果，如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211008_04.png)

> [參考selction.call](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_call)

## 添加動畫
因此我們可以使用call將座標軸添加至畫面上並且加入動畫如以下程式碼
```javascript
gX.transition().duration(1000).call(axisX);
gY.transition().duration(1000).call(axisY);
```

呈現結果如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211008_05.gif)

## 繪製圓圈圈
接下來我們進行繪製圓型
程式碼如下
```javascript{numberLines: true}
const gCircle = svg.append("g");
gCircle.selectAll("circle")
        .data(house)
        .join("circle")
        .attr("transform", "translate(50,50)")
        .attr("fill","rgba(255,0,0,.1)")
        .attr("cx",d=>(scaleX(d["土地移轉總面積平方公尺"])))
        .attr("cy",d=>(scaleY(d["建物移轉總面積平方公尺"])))
        .attr("r",d=>{return Math.sqrt(scaleR(d["總價元"]))})
```
基本上資料綁定的data和透過scale函式將資料轉換到圓點的x和y的位置與昨天的製作方式大同小異。
這邊比較不一樣的地方是**R需要帶入`ScaleR()`將房屋價格帶入比例尺函式映射出圓形的半徑**，記得再使用Math.sqrt()進行開平方根。

到此為止應當可以映射出圓點如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211008_06.png)

## 小總結

本日淺談了程式構想，使用一些方法處理資料並且介紹了先前未提及的**selection.call()**和**selection.node()**，另外依序將三個數值帶`Scale()`後添加動畫，明天將處理調圓形超出範圍的部分和軸線更新以及行政區切換，先行預告一下可能需要有一點座標平面的概念，以上。
