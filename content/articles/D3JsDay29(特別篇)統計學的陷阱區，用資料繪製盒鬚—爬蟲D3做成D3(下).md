---
title: D3JsDay29(特別篇)統計學的陷阱區，用資料繪製盒鬚—爬蟲D3做成D3(下)
slug: 2021-10-14T13:41:00.000Z
date: 2021-10-14T13:41:00.000Z
tags: ["D3.js","Javascript"]
---

## 前言
本日主要內容包含另一個網路擷取資料方式Convert HTML Tables To JSON、談及統計方法中位數的意義、盒鬚圖介紹與繪製並淺談其意義。
## 淺談Convert HTML Tables To JSON
昨天使用了**puppteer**來獲取網頁的元素，今天使用另一項工具叫做[Convert HTML Tables To JSON](https://www.convertjson.com/html-table-to-json.htm)。
常常在維基百科當中看到表格，想要擷取資料除了可以用爬蟲或是將其html複製起來自己撰寫程式碼來剖析以外，這次介紹的工具可以使用滑鼠操作來獲取網頁的`<table>`內容將其轉換成**JSON**檔案。


### 擷取Html檔案
以維基百科[洲](https://zh.wikipedia.org/wiki/%E6%B4%B2)為例與昨天[爬蟲D3做成D3(上)](https://ithelp.ithome.com.tw/articles/10281245)文章提到**獲取網頁元素內容**副標題的部分一樣，開啟開發者人員工具找到維基百科的該表格選取，這次要進行的操作是**滑鼠右鍵→Copy→CopyouterHTML** 

如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_01.png)
### 轉換成JSON
到**Convert HTML Tables To JSON**網站按下**Ctrl+V**將剛剛複製的HTML貼到**HTML Code**的下方空白處
如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_02.png)


網頁滾動至底下就可以看到它就會自動幫你轉成**JSON格式**

如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_03.png)


### 更改JSON物件的key值
但是通常有時候**JSON**裡面的**object**的**key**不是你想要的名稱該怎麼辦？
我們回到剛剛的找到`<th>`表頭的地方把原先的洲別改成你想要的名稱
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_04.png)

改完名稱後如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_05.png)
### HTML Table轉換到JSON完成
最後查看轉換後的JSON的呈現狀況
如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_06.png)

確定沒有問題之後就可以按下底下的**Download Result**下載下來了
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_07.png)

> [洲—維基百科](https://zh.wikipedia.org/wiki/%E6%B4%B2)
> [Convert HTML Tables To JSON](https://www.convertjson.com/html-table-to-json.htm)

## 中位數的重要性
我們國小的數學就有教導平均數的概念，假設已知班上全部人的身高，我們將每個人的身高加總除以人數就可以得到平均身高，平均數用在人的身高可能有其數字的意義，也許僅有平均數可以猜想該班每位學生的身高，例如平均身高是150公分，班上有五個人，每個人可能可以想像是**140、145、150、155、160**公分，你不太可能會想像**1、100、150、200、299**，畢竟身高1公分和身高299公分的人其數值顯然不貼近現實生活人的身高，這也是**常態分布**模型被廣泛使用在各個領域的原因之一。

倘若今天用全國人們的資產上面的話，可能就不能反映現實情況。假設全國的平均資產是100萬美元的情況，若陷入統計數字的陷阱，可能會像：**「哇！這個國家人民平均的資產有100萬美元，人民應該過得不差吧？」**。但實際的情況是如果資產前百分之一的人民可能是1兆美元的話，由於他們的資產太高了和資產不到2萬美元的人民平均後就拉高了整體平均數，顯然資產這個資料不太適合使用平均數來顯示其意義。

因此中位數的意義就顯得其重要，中位數意義表示`假設有一組數列，由小到排到大在中間的數字`，換句話說即便薪水最富有的人資產是是10兆美元也不影響中位數的值。

另外中位數是得出第百分之50的數，想要得知資料分布的情況還有一項統計名詞稱為百分位距有興趣的可以參閱[百分位距](https://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E4%BD%8D%E6%95%B0)維基百科
> [百分位距wiki](https://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E4%BD%8D%E6%95%B0)


在d3統計API當中也有中位數和百分位距的地方叫做
`d3.quantile`和`d3.median`
如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_08.png)

> [d3StatisticsAPI](https://github.com/d3/d3/blob/main/API.md#statistics)

## 盒鬚圖介紹
盒鬚圖又稱作箱型圖(Box plot)可以用來表示資料分布的情形，能夠簡單得知群體之間的離散程度
參見以下整理出的表格

| 名詞   | 說明                                                                      |
| ------ | ------------------------------------------------------------------------- |
| Q1     | 將一組數據由小到大排列排在1/4的地方又稱第一四分位數                       |
| Q2     | 將一組數據由小到大排列排在2/4的地方又稱第二四分位數，也稱中位數           |
| Q3     | 將一組數據由小到大排列排在3/4的地方又稱第三四分位數                       |
| IQR    | 由Q3-Q1所計算出來的值，稱為四分位距interQuantileRange                     |
| 最大值 | Q1向下延伸1.5倍的距離，使用這種計算方式是要凸顯(或排除)離群值(或異常值)   |
| 最小值 | Q3向上延伸1.5倍的距離，使用這種計算方式是要凸顯(或排除)離群值  (或異常值) |

有興趣查看更多的話請參見維基百科盒鬚圖
> [盒鬚圖wiki](https://zh.wikipedia.org/wiki/%E7%AE%B1%E5%BD%A2%E5%9C%96)
## 繪製d3Js標籤的盒鬚圖
接下來接續昨天得到的資料我們用來繪製出其盒鬚圖
### 得出Q1、Q2、Q3值

接下來我們將昨天的資料裡面的文章字數算出q1的數值，中位數和q3的數值
具體程式碼如下
```javascript{numberLines: true}
let dataSort = d3.sort(data,(a,b) => d3.ascending(a.articleStrNum,b.articleStrNum));
let q1 = d3.quantile(dataSort,.25,d=>(d.articleStrNum));
let median =d3.quantile(dataSort,.5,d=>(d.articleStrNum));
let q3 = d3.quantile(dataSort, .75,d=>(d.articleStrNum));
let interQuantileRange = q3 - q1;
let minBox = q1 - 1.5 * interQuantileRange;
let maxBox = q1 + 1.5 * interQuantileRange;
```

## 繪製盒鬚圖的軸線
另外也在這邊多加一個g群組來裝盒鬚圖的各種svg元素，其中`nice()`這個函式讓軸的上限或者下限能夠自動延展到適當的值，不會因為你`domain()`設定min和max軸線然後不根據軸體的等距刻度就馬上截斷它。

程式碼如下
```javascript{numberLines: true}
let scaleY =  d3.scaleLinear()
                .domain([minBox,max])
                .range([800, 0]).nice();
let axisY =  d3.axisLeft(scaleY)
            .ticks(40);
const gY = svg.append("g")
        .attr("transform",`translate(${padding},${padding})`);
        gY.call(axisY);
let boxPlotG = svg.append("g")
        .attr("transform",`translate(${padding},${padding})`);
```



這裡我們宣告一個盒子的中心位置和寬度如下
```javascript{numberLines: true}
let boxCenter = 100;
let boxWidth = 50;

boxPlotG
.append("line")
.attr("x1", boxCenter)
.attr("x2", boxCenter)
.attr("y1", scaleY(minBox) )
.attr("y2", scaleY(maxBox) )
.attr("stroke", "black");
```
由於盒鬚圖僅用到**y軸**，水平並沒有軸線，為了方便觀看所以使他偏移右邊一些，因此宣告箱子的中心當作偏移量，一樣記得要把**y1**和**y2**的資料帶入比例尺轉換成svg的位置，依據盒鬚圖的定義帶入最大值和最小值。


如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_09.png)


接下來我們將繪製盒鬚圖的盒子的部分，由於一個`<rect>`的**x,y**是來自於左上角作為起始點，之後再繪製高度和寬度，因此我們將剛剛的盒子中心必須向左偏移，因為盒子對稱的關係所以將盒子的寬度除以2作為偏移量，另外依照盒鬚圖的定義帶入q3的值透過比例尺轉換作為y的位置，其盒鬚圖的高度就是四分位距
具體程式碼如下
```javascript{numberLines: true}
boxPlotG
    .append("rect")
    .attr("x", boxCenter - boxWidth/2)
    .attr("y", scaleY(q3) )
    .attr("height", (scaleY(q1)-scaleY(q3)) )
    .attr("width", boxWidth )
    .attr("stroke", "black")
    .style("fill", "#e89baa");
```
之後你應當可以看到如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_10.png)

接下來我們要繪製盒鬚圖的最小值和最大值和中位數，把剛剛所算出的這三個數字帶入成一個陣列，用d3的資料綁定把這三筆資料綁定到`<line>`上就可以簡單的劃出這三條線了。
其中x位置要向左偏移，其原理與剛剛的`<rect>`同理。
程式碼如下
```javascript{numberLines: true}
        boxPlotG
        .selectAll(".SML")
        .data([minBox, median, maxBox])
        .join("line")
        .attr("x1", boxCenter-boxWidth/2)
        .attr("x2", boxCenter+boxWidth/2)
        .attr("y1", function(d){ return(scaleY(d))} )
        .attr("y2", function(d){ return(scaleY(d))} )
        .attr("stroke", "black")
        .classed("SML",true);
```

最後應當可以看到下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_11.png)


值得一提的是文章字數並沒有負值，所以在此例子當中呈現最小值為負值也顯得有些奇怪。

另外呈現了以文章字數的最大值(也就是平常我們認知的最大值)當做盒鬚圖的上限和最小值當盒鬚圖的下限的圖，還有以圓點的方式把所有文章的字數分布出來做比對，圓點的程式碼如下

```javascript{numberLines: true}
let circleG = svg.append("g").attr("transform",`translate(${padding},${padding})`);
circleG.selectAll("circle").data(dataSort)
.join("circle")
.attr("cx","300")
.attr("cy", function(d){ 
    return scaleY(d.articleStrNum);
})
.attr("r", "5")
.attr("fill","rgba(255,0,0,.1)" );//以透明度0.1當作顏色主要是如果資料重疊的情況發生的時候可以看得出資料密集的程度
})
```

呈現結果如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211014_12.png)

## 小小小結語
期望本次的實作可以讓大家了解資料判讀時的重要性，不要若入**統計陷阱區**。
