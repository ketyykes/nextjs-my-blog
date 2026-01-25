---
title: D3JsDay26圓圈圖的實戰力，直轄市人口比例-帶入真實資料做圓圈圖
slug: 2021-10-11T10:01:00.000Z
date: 2021-10-11T10:01:00.000Z
tags: ["D3.js","Javascript"]
---

昨天已經介紹了產生圓圈圖的範例，今天將要帶入真實資料作範例，接下來將會使用先前的縣市人口數的資料製作環圈圖，預計將會製作直轄市人口比例和非直轄市人口比例，滑鼠滑到該區域的時候可以看的到該縣市的人數以及占整個圓的比例。

## 處理資料

我們一樣先觀看資料狀況，這邊取**data.result.records**的資料查看情況，主要觀看觀察**site_id**欄位，如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_01.png)

### 使用d3.group結合array.slice群組化資料

由於裡面的值都是縣市+鄉鎮劃分又台灣的縣市的名稱都是以三個字為名，例如新北市、臺南市、XX市等等，因此我們透過`d3.group`的分組方式取前三個字來當作劃分依據，程式碼如下
```javascript{numberLines: true}
 d3.json("populationDensity.json")
    .then(function (data) {
      console.log(data);
      let districtData = d3.group(data.result.records,d=>{
        return d.site_id.slice(0, 3);
      })
    console.log(districtData);
     }
```

我們`console.log(districtData)`可以看到以下內容

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_02.png)

### 用Array.from將Map物件轉換成Array
接下來使用`Array.from`轉成陣列以便後續方便操作，如下列程式碼
```javascript{numberLines: true}
const districtAry = Array.from(districtData);
```
操作完應當如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_03.png)

### 清理資料
由於政府的資料有些屬於可能人員輸入時造成的錯誤或是像是東沙群島等等並非這次要呈現的範疇，等等將使用array的操作方式稍作整理，原先內容如下圖，

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_04.png)

使用array清理資料的程式碼如下
```javascript{numberLines: true}
districtAry.splice(-6);
districtAry.shift();
```


### 增加一個元素為該縣市的人口數
我們要對該縣市的鄉鎮市行政區加總，這邊使用先前介紹過`d3.sum()`來進行。

首先我們對districtAry使用`forEach`遍歷，將元素裡面的陣列索引值1也就是鄉鎮市進行加總後，對該元素再增加一個索引值當作總人口數如下列第3行`districtAry.forEach......`所示

```javascript{numberLines: true}
districtAry.forEach(function (el) {
    el.push(d3.sum(el[1], (d) => Number(d.people_total)));
});
```
使用`console.log()`應當可以看到增加了一個元素如下圖

![](https://i.imgur.com/q51nUIq.png)

### 增加一個元素寫入是否為直轄市
我們先宣告一個municipality的陣列，把直轄市的縣市給帶進去陣列當中，然後判斷如果districtAry裡面的縣市欄位內容與municipality相等的話就在districtAry存入一個value是"直轄市"，否則就存入"非直轄市"
程式碼如下
```javascript{numberLines: true}
let municipality = ["臺北市","新北市","臺南市","高雄市","桃園市","臺中市"];
  districtAry.forEach((districtAryEl) => {
      for (let i = 0; i < municipality.length; i++) {
        if (districtAryEl[0] == municipality[i]) {
          districtAryEl[3] = "直轄市";
          return;
        } else {
          districtAryEl[3] = "非直轄市";
        }
      }
    });
```
### 處理完畢
到目前為止應當可以看到如下圖每筆陣列的value有內容也有一個陣列，這個陣列裡面有四種資料，該元素裡面是一個陣列，索引值0~3的內容如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_06.png)


## 直轄市、非直轄市、全台人口數加總

為了得到直轄市和非直轄市的人口，我們需要有所有人數和直轄市人數以及非直轄市人數，為了重複使用我們宣告一個宣告一個加總的函式，加總的內容有直轄市、非直轄市和總臺灣人口，詳細程式碼如下

```javascript{numberLines: true}
const municipalitySumFun = (municipalityStr) =>
d3.sum(districtAry, (d) => {
    if (d[3] === municipalityStr) return d[2];
    if (municipalityStr==undefined) return d[2];
});
let districtArySum = municipalitySumFun();
let municipalitySum = municipalitySumFun("直轄市");
let NotMunicipalitySum = municipalitySumFun("非直轄市");
```
帶入`console.log()`檢查一下
```javascript{numberLines: true}
console.log(districtArySum);
console.log(municipalitySum);
console.log(NotMunicipalitySum);
```
結果呈現如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_07.png)


## arc函式和pie函式
我們希望這次的圖形是圓圈圖，也就是空心的圓，中間的圓形部分可以當滑鼠移入某區域的時候得出該縣市和人口比例與人口數的資料，因此宣告的`arc()`如下

```javascript{numberLines: true}
const arc = d3.arc().innerRadius(50).outerRadius(100).cornerRadius(2);
```

這裡要注意的地方是由於我們的資料是多維陣列，預計要帶入的pie資料並非第一層陣列的索引值，而是第一層陣列元素裡的陣列(第二層)的第2個索引值

如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_08.png)

因此我們需要使用`d3.pie().value()`這個函式，官方說明如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_09.png)

> [d3.pie().value()官方說明](https://github.com/d3/d3-shape/blob/v3.0.1/README.md#pie_value)



換句話說也就是我們必須指定什麼資料要做成`pie`的開始角度、結束角度、和value物件等等

具體程式碼如下
```javascript{numberLines: true}
let pie = d3.pie().value(function (d) {
              return d[2];
        });
console.log(pie(districtAry));
```
顯示出來的`console.log`如下圖，應當可以看到轉換後的值是來自於縣市人口總數所構成的開始角度、結束角度等等的物件。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_10.png)

## 開始繪製圖形

我們這次選用`d3.schemeTableau10`的顏色組，將渲染的圓形放大2.5倍
順帶一提這次使用是**Tableau**的色系，Tableau也是先前[D3JsDay02 學學D3JS 技能提高SSS—為什麼D3](https://ithelp.ithome.com.tw/articles/10266099)那一篇所介紹的資料視覺化軟體。

具體程式碼如下
```javascript{numberLines: true}
let color = d3.scaleOrdinal(d3.schemeTableau10);
g.attr(
  "transform",
  `translate(${width / 2}, ${height / 2}) scale(2.5)`
)
g.attr(
      "transform",
      `translate(${width / 2}, ${height / 2}) scale(2.5)`
    )
g.selectAll("g")
    .data(d3.sort(pie(districtAry), (d) => d.index))
    .join("g")
    .append("path")
    .attr("stroke", "white")
    .attr("stroke-width", ".25")
    .attr("fill", (d, i) => color(d.data[3]))
    .attr("d",function(d){
    return arc(d);
    })
```

到目前為止應當可以看到一個具體的圓圈圖呈現如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_11.png)

## 添加動畫

我們希望慢慢的繪製出整個圓形，可能你會想要使用下列的程式碼進行動畫繪製
```javascript{numberLines: true}
g.selectAll("g")
.data(d3.sort(pie(districtAry), (d) => d.index))
//中間省略
//中間省略
//中間省略
.transition()
.ease(d3.easeLinear)
.duration(500)
.delay(function (d, i) {
return i*500;
})
.attr("d",function(d){
return arc(d);
})
```
但畫面看起來不夠柔順
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_12.gif)

這裡我們使用補間動畫
`transition().attrTween()`來增加每個扇形區域進行繪製的時候要進行的動畫

官方說明如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_13.png)

換句話說就是第二個參數要接收一個**callback函式**，裡面要**return一個插值器函式(interpolate)**，然後在根據時間**t(t將會介於0~1逐漸增加)**來對當前的元素內容修改值

我們直接觀看程式碼
```javascript{numberLines: true}
//上面省略
.transition()
.ease(d3.easeLinear)
.duration(500)
.delay(function (d, i) {
return i*500;
})
.attrTween("d", function (d) {  //也就是設置每一個d的補間動畫
    let i = d3.interpolate(d.startAngle, d.endAngle);
    return function (t) {
      d.endAngle = i(t);
      return arc(d);
    };
  });
```
`d3.interpolate`輸入的參數是**0~1**
然後時間參數t是介於0~1的數字，我們宣告一個`interpolate`轉換函式將時間參數轉換成結束角度，在每t秒的時候的結束角度皆不同並且使用 `arc(d)`繪製出來。

最後結果應當會呈現如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_14.gif)
## 計算百分比函式
最後我們要顯示人口百分比，這裡先宣告一個計算百分比的函式
```javascript{numberLines: true}
function Percentage(num, total) {
    if (num == 0 || total == 0) {
      return 0;
    }
    return Math.round((num / total) * 10000) / 100.0;
  }
```
## 添加滑鼠滑入事件

接下來將插入滑鼠事件，selection.html()函式與眾多的函式一樣可以接收資料d，因此我們撰寫程式碼如下
```javascript{numberLines: true}
g.selectAll("g")
.on("mouseenter", function (e) {
    let appendText = d3
      .select(this)
      .append("text")
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .html(d=>{
        return `<tspan x="0" y="-.5em">${d.data[0]}</tspan>
              <tspan x="0" y=".5em">${d.data[2]}人</tspan>
              <tspan x="0" y="1.5em">${Percentage(d.data[2],districtArySum)}%</tspan>`
  })
})
.on("mouseleave", function (e) {
    d3.select(this).select("text").remove();
});
```
上述程式碼的第三個`tspan`就會將執行剛剛所宣告的`Percentage()`來計算百分比，另外`tspan`的**y**我們改用**em**來當作單位以便得知換行所需要的**y值**

最後補上直轄市和縣轄市的人口比例在畫面上就大功告成了，程式碼如下

```javascript{numberLines: true}
svg.append("g").html(`
        <text  y="${height-100}" style="font-size:50; transform:translate(-20%,0)">
            <tspan x="${width/2}">直轄市${Percentage(municipalitySum,districtArySum)}%</tspan>
            <tspan x="${width/2}"  dx="-0.5em"dy="1em">非直轄市${Percentage(NotMunicipalitySum,districtArySum)}%</tspan>
        </text>
        `)
```

最後呈現結果如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211011_15.gif)

