---
title: D3JsDay22散佈圖 給我兩個以上的變數，給你呈現資料的散佈—散佈圖
slug: 2021-10-07T05:50:38.000Z
date: 2021-10-07T05:50:38.000Z
tags: ["D3.js","Javascript"]
---



## 散佈圖

先前使用長條圖來表示各個行政區的人口數，散佈圖則適合做兩個變數以上的關係性，如果呈現的狀況聚集的點像是在一直線上的話，表示可能帶有正相關或是負相關，這次我們使用d3JS來繪製散佈圖，X軸表示平方公里、Y軸表示人口數，

## tickSize()函式

還之前教過如何設置座標軸嗎？如果忘記可以先去看第十二天的[完成製作的壓軸，畫出圖表座標軸](https://ithelp.ithome.com.tw/articles/10273251)的文章，這裡要再介紹一個函式`tickSize()`用來方便觀看每個點的確切位置。

> [d3官方tickSize()](https://github.com/d3/d3-axis/blob/v3.0.0/README.md#axis_tickSize)
> 


官方說明如下，可以設置外部軸和內部軸的大小，至於什麼是外部軸和內部軸呢?

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211007_01.png)

於是你點了連結的藍色字它又告訴你如下，這邊提到外部刻度是`path`
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211007_02.png)

我們可以撰寫程式碼實際觀看一下

### tickSizeOuter();

```javascript{numberLines: true}
const svg = d3.select("body")
            .append("svg")
            .attr("width", 800)
            .attr("height", 600);
let scaleY = d3.scaleLinear()
      .domain([0, 100])
      .range([500,0]);
let axisY = d3.axisRight(scaleY)
            .tickSizeOuter(100);
const g = svg.append("g")
.attr("transform",`translate(0,10)`);
axisY(g);
```
這個時候你打開主控台可以發現他將`<path>`的d改變了數值，另外看畫面頭和尾的長度也增加了如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211007_03.png)
### tickSizeInner()函式

觀看帶入tickSizeInner()看看
```javascript{numberLines: true}
    let axisY = d3.axisRight(scaleY)
                .tickSizeInner(100);
```
一樣打開主控台觀看數值的變化和網頁畫面如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211007_04.png)

這邊可以發現`tickSizeInner()`改變的數值是class為tick的g元素裡面的`<line>`，而`tickSizeOuter()`改變的數值是最上面的`<path>`元素裡面的屬性d。最後我們嘗試改用`tickSize()`試試看就可以發現他將會改變`<path>`和`<line>`

```javascript{numberLines: true}
  let axisY = d3.axisRight(scaleY)
                .tickSize(100)
```

因此當我們沒有設置`tickSize()`時，預設將會給`<path>`和`<line>`數值是6，另外值得一提的是如果輸入負值軸線將會往反方向伸展

## 實際帶入地圖資料
了解後我們帶入上次的行政區人口密度的資料，這時候我們就可以將.tickSize()設定的數值和scale的上限(`range()`)相等，記得注意伸展方向，因此我們**設置負值**，另外我們將對座標軸的樣式做小部分的修改，因此加入class名字。
具體程式碼如下
```javascript{numberLines: true}
 const newTaipei = taipei.map((el) => {
                    el.people_total = Number(el.people_total);
                    el.area = Number(el.area);
                    el.population_density = Number(el.population_density);
                    el.site_id = el.site_id.substr(3);
                    return el;
                });
const svg = d3.select("body")
            .append("svg")
            .attr("width", 600)
            .attr("height", 600);
const scaleX = d3.scaleLinear().domain([0,70]).range([0,500]);
const scaleY = d3.scaleLinear().domain([0, 320000]).range([500, 0]);
const axisX = d3.axisBottom(scaleX)
            .ticks(15)
            .tickFormat(function (d) { 
               return  d+"km²";
            })
            .tickSize(-500); 
const axisY = d3.axisLeft(scaleY)
                .ticks(15)
                .tickFormat(function (d) {
                    return d / 10000 + "萬";
                })
                .tickSize(-500); 
const gX = svg.append("g")
            .attr("transform",`translate(50,550)`)
            .classed("xAxis",true);
axisX(gX);
const gY = svg.append("g")
            .attr("transform",`translate(50,50)`)
            .classed("yAxis",true);
axisY(gY);
```
接下來將會看到的畫面如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211007_05.png)

這時候當網格渲染出來之後如果在內容加入散佈圖的圓點時可能會讓人覺得網格影響視覺比重，因此我們使用css選取器選到剛剛所加入的class並將裡面的`<line>`的顏色進行微調程式碼如下
```javascript{numberLines: true}
.xAxis line, .yAxis line {
    stroke:rgba(0,0,0,.1);
}
```

接下來我們將要進行資料綁定，與先前製作的長條圖的差別在於這次綁定完的資料在位置的設定要使用兩種變數資料。
程式碼如下
```javascript{numberLines: true}
const circle = svg.selectAll("circle")
                    .data(newTaipei)
                    .join("circle");
const joinCircle = circle.data(newTaipei).join("circle");
joinCircle.attr("cx",d=>(scaleX(d.area)))
        .attr("cy",d=>(scaleY(d.people_total)))
        .attr("r",5)
        .attr("fill","red")
        .attr("transform", "translate(50,50)");   
```

接下來就會看到如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211007_06.png)

由於每個紅點表示的是每個行政區，因此我們得再加入一項g群組來顯示文字，它的位置得到的方式和剛剛圓點的位置得道的方式一樣，皆來自於綁定資料的區域面積和人口總數所轉換的Scale函式，但是必須微調往右移，因此使用` gText.attr("transform",`translate(60,50)`);`

具體程式碼如下
```javascript{numberLines: true}
let gText = svg.append("g");
gText.attr("transform",`translate(60,50)`);
let joinText = gText.selectAll("text").data(newTaipei).join("text");
joinText.text((d) => {
    return d.site_id;
    })
    .attr("x", (d, i) => {
        return scaleX(d.area);
    })
    .attr("y", (d) => {
        return scaleY(d.people_total);
    })
    .attr("font-size",9);
```

最後應當可以看見如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211007_07.png)


本日完整程式碼如下
```javascript{numberLines: true}
   d3.json("populationDensity.json")
    .then((data) => {
        return data.result.records;
    })
    .then((data) => {
        let reg = RegExp(/臺北市/);
        return data.filter((el) => {
            return reg.test(el.site_id);
        });
    })
    .then((taipei) => {
        const newTaipei = taipei.map((el) => {
            el.people_total = Number(el.people_total);
            el.area = Number(el.area);
            el.population_density = Number(el.population_density);
            el.site_id = el.site_id.substr(3);
            return el;
        });
        const svg = d3.select("body")
                    .append("svg")
                    .attr("width", 600)
                    .attr("height", 600);
        const scaleX = d3.scaleLinear().domain([0,70]).range([0,500]);
        const scaleY = d3.scaleLinear().domain([0, 320000]).range([500, 0]);
        const axisX = d3.axisBottom(scaleX)
                    .ticks(15)
                    .tickFormat(function (d) { 
                       return  d+"km²";
                    })
                    .tickSize(-500)  ; 
                    ;
        const axisY = d3.axisLeft(scaleY)
                        .ticks(15)
                        .tickFormat(function (d) {
                            return d / 10000 + "萬";
                        })
                        .tickSize(-500); 
        const gX = svg.append("g")
            .attr("transform",`translate(50,550)`)
            .classed("xAxis",true);
        axisX(gX);
        const gY = svg.append("g")
                    .attr("transform",`translate(50,50)`)
                    .classed("yAxis",true);
        axisY(gY);
        const circle = svg.selectAll("circle")
                    .data(newTaipei)
                    .join("circle");
        const joinCircle = circle.data(newTaipei).join("circle");
        joinCircle.attr("cx",d=>(scaleX(d.area)))
                    .attr("cy",d=>(scaleY(d.people_total)))
                    .attr("r",5)
                    .attr("fill","red")
                    .attr("transform", "translate(50,50)");            
        let gText = svg.append("g");
        gText.attr("transform",`translate(60,50)`);
        let joinText = gText.selectAll("text").data(newTaipei).join("text");
        joinText
            .text((d) => {
            return d.site_id;
            })
            .attr("x", (d, i) => {
                return scaleX(d.area);
            })
            .attr("y", (d) => {
                return scaleY(d.people_total);
            })
            .attr("font-size",9);
    });
```
