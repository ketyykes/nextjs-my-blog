---
title: D3JsDay06這包什麼餡，原來是折線—繪製折線圖
slug: 2021-09-21T13:05:54.000Z
date: 2021-09-21T13:05:54.000Z
tags: ["D3.js","Javascript"]
---


這次相比長條圖使用多一點的資料，陣列如下並且一樣先宣告svg變數繪製一個寬800高450的畫布
```javascript{numberLines: true}
const ary = [130,45,239,20,30,246,72];
const svg = d3.select("body")
    .append("svg")
    .attr("width",800)
    .attr("height",450);
```

我們先繪製折線圖上面的點與上一個長條圖的概念類似只不過這次X取的位置是起始點設為30然後間距設為40，一樣使用for迴圈繪製程式碼如下
```javascript{numberLines: true}
for (let i = 0; i <ary.length;i++){
    svg.append("circle")
    .attr("cx",30+40*i)
    .attr("cy",450-ary[i])
    .attr("r",3)
    .attr("fill","green");
 }
```
此時你會看到的圖應該是長這樣
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210921_01.png)

從畫布的最下方開始往上到點的垂直距離會表現出陣列當中的數值

接下來我們要加入線

我們可以嘗試著先加入一條線試試看，起始位置從最左下方開始
加入在for迴圈外面
```javascript{numberLines: true}
 svg.append("line")
    .attr("x1",0)
    .attr("y1",450)
    .attr("x2",30)
    .attr("y2",450-130)
    .style("stroke","black")
    .style("stroke-width","1px");
```
起始點x1是0而最下方的點就是畫布的高，因此y1是450
然後對應到第一個點的位置x是30、y是450-130也就是減去陣列的第一個數值所以x2是30、y2是320。
會看到圖長這樣
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210921_02.png)

我們嘗試著畫第二條線來觀察這中間有什麼規則
```javascript{numberLines: true}
 svg.append("line")
  .attr("x1",30)
  .attr("y1",450-130)
  .attr("x2",30+40)
  .attr("y2",450-45)
  .style("stroke","black")
  .style("stroke-width","1px");
```
這時候圖片會長類似這樣
 ![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210921_03.png)
然後我們會發現線段x1和y1的起始位置是來自於上一個點，第一條線段的起始位置是0跟450，x2和y2是當前的點位置
所以我們可以先宣告一個lastX和lastY並且給定初始值並且在for迴圈繪製線段完之後將lastX和lastY表示當前的點的位置加入進去，最後在for迴圈判斷是不是跑最後一圈，做為線斷結束到0的位置

程式碼如下
```javascript{numberLines: true}
let ary = [130,45,239,20,30,246,72];
let svg = d3.select("body")
            .append("svg")
            .attr("width",800)
            .attr("height",450);
let lastX=0;
let lastY=450;

for (let i = 0; i <ary.length;i++){
  svg.append("circle")
  .attr("cx",30+40*i)
  .attr("cy",450-ary[i])
  .attr("r",3)
  .attr("fill","green");

  svg.append("line")
      .attr("x1",lastX)
      .attr("y1",lastY)
      .attr("x2",30+40*i)
      .attr("y2",450-ary[i])
      .style("stroke","black")
      .style("stroke-width","1px");
  lastX =30+40*i;
  lastY = 450-ary[i];
  
  if(i==ary.length-1){
      svg.append("line")
      .attr("x1",lastX)
      .attr("y1",lastY)
      .attr("x2",30+40*(i+1))
      .attr("y2",450)
      .style("stroke","black")
      .style("stroke-width","1px");
  lastX =30+40*i;
  lastY = 450-ary[i];
  }
}
```

繪製完成圖片大概會長這樣
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210921_04.png)


以上就是折線圖的簡單撰寫方式，如果要加入文字的話請參考上一篇長條圖，這邊就不再闡述。
