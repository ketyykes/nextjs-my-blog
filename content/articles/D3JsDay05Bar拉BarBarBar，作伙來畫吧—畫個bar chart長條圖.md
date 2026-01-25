---
title: D3JsDay05Bar拉BarBarBar，作伙來畫吧—畫個bar chart長條圖
slug: 2021-09-20T09:05:54.000Z
date: 2021-09-20T09:05:54.000Z
tags: ["D3.js","Javascript"]
---

## 用D3繪製長條圖
我們現在可以嘗試著用已經學到的<font color="red">`SVG`</font>來畫長條圖，只不過是透過D3Js的操作來新增SVG元素到html裡面。

先宣告一個變數叫做svg並且透過D3Js建立一個SVG元素寬為800高為450來當作畫布

此時在svg底下插入一個<font color="red">`rect`</font>的元素屬性依序是x為0 y是0 寬為30高是來自於你所宣告的陣列的索引值為0的那筆資料也就是130
最後填充為綠色


```javascript{numberLines: true}
const ary = [130,45,239];
const svg = d3.select("body")
            .append("svg")
            .attr("width",800)
            .attr("height",450);

svg.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",30)
    .attr("height",ary[0])
    .attr("fill", "green");
```
此時你所看到的圖形應該會長這樣
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210920_01.png)

這時候我們試著透過陣列第二筆資料也就是索引值是1的數字45來添加至svg中
```javascript{numberLines: true}
let ary = [130,45,239];
let svg = d3.select("body")
            .append("svg")
            .attr("width",800)
            .attr("height",450);

svg.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",30)
    .attr("height",ary[0])
    .attr("fill", "green");
svg.append("rect")
      .attr("x",34)
      .attr("y",0)
      .attr("width",30)
      .attr("height",ary[1])
      .attr("fill", "green");
```
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210920_02.png)
由於寬是30多增加4來間隔兩個長方形因此我們下一個長方形給定的x值是34，高的部分填入<font color="red">`ary[1]`</font>也就是45你會發現圖形與我們以往看到的長條圖好像相反了。
這是因為當填入x與y的時候會根據起始點來生長寬和高的長方形並且對齊上方。

因此我們可以透過一點方式讓生長完的長方形都對其在整個畫布的下方
將程式碼改成以下片段
```javascript{numberLines: true}
let ary = [130,45,239];
let svg = d3.select("body")
            .append("svg")
            .attr("width",800)
            .attr("height",450);

svg.append("rect")
    .attr("x",0)
    .attr("y",450-ary[0])
    .attr("width",30)
    .attr("height",ary[0])
    .attr("fill", "green");

svg.append("rect")
.attr("x",34)
.attr("y",450-ary[1])
.attr("width",30)
.attr("height",ary[1])
.attr("fill", "green");
```

我們將y的起始點透過<font color="red">`整個svg畫布的高`</font>來<font color="red">`減掉陣列中的數值`</font>，由於生長出來的高與減去的數值是相等，最後就會對齊在svg畫布底下了。
參見如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210920_03.png)

另外我們可以添加文字和使用for迴圈來製作長條圖
程式碼如下
```javascript{numberLines: true}
let ary = [130,45,239];
let svg = d3.select("body")
            .append("svg")
            .attr("width",800)
            .attr("height",450);
for(let i=0;i<ary.length;i++){
    svg.append("rect")
        .attr("x",34*i)
        .attr("y",450-ary[i])
        .attr("width",30)
        .attr("height",ary[i])
        .attr("fill","green");
    svg.append("text")
    .attr("x",7+34*i)
    .attr("y",450-ary[i]-10)
    .attr("font-size",12)
    .text(ary[i]);
    }
```
程式碼結果如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210920_04.png)


當我們有上千筆資料的時候使用for迴圈也不需要一筆一筆輸入，另外這裡先使用陣列索引值的方式取出資料，後續會提到透過資料綁定的方式。

