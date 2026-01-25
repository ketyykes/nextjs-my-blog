---
title: D3JsDay12完成製作的壓軸，畫出圖表座標軸
slug: 2021-09-27T08:10:54.000Z
date: 2021-09-27T08:10:54.000Z
tags: ["D3.js","Javascript"]
---


昨天我們繪製了長條圖的情況，今天我們再畫出所對應的數字座標軸就可以呈現這一份圖表了，目前長條圖的Y軸部分缺少的就是數值的對應，今天我們要來使用axisAPI來做出座標軸。
 
## axisTop()、axisRight()、axisBottom()、axisLeft 

首先你必須先有一個比例尺函式
來自於之前的介紹過的**scale**，他才能根據你所輸入的比例尺製作出對應的座標軸。
以我們之前所做的長條圖為例
```javascript{numberLines: true}
let scaleY = d3.scaleLinear()
              .domain([0, 320000])
              .range([400,0]);
let axisY = d3.axisRight(scaleY);
console.log(typeof(axisY));
```

這時候它就會做出座標軸，昨天有提到如果我們如果將<font color="red">`range([0,400])`</font>的話，此時座標軸的方向將會反轉，也就是最上面是0最下面是300000，所以為了讓座標軸顯示的順序與長條圖的起始點對應，所以我們必須把<font color="red">`range()`</font>設定<font color="orange">`400`</font>到<font color="orange">`0`</font>，這邊使用的方向式Right因此數字將會在軸的右邊，另外如果座標軸式水平的話，可以設置axisTop()或axisBottom()

執行到第4行的時候在畫面上面依然看不到這個座標軸，到這邊我們只是做出一個座標軸的函式，可以想像成這是一個設計藍圖，然後我們還沒執行它，你可以用console.log(typeof(axisY))會發現它是一個函式如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210927_01.png)


接下來我們必須帶入一個d3選取的元素到函式中渲染出來，這邊我們插入一個**g**標籤來群組化這個座標軸然後帶入到剛剛所建立的函式
程式碼如下
```javascript{numberLines: true}
 const g = svg.append("g");
 axisY(g);
```
這時候你開啟開發者人員工具會發現Element欄位多了這些標籤。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210927_02.png)


你嘗試著指向這些標籤你可以發現其實axis幫你做的事情是建立了一個path來代表整個軸，然後透過line和text標籤來呈現數字和數字旁邊的橫槓之後使用g標籤群組起來來呈現整個座標軸。


![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210927_03.png)

然後你就可以看到整個完整的座標軸如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210927_04.png)

另外剛剛我們使用的是axisRight()函式，所以這些數字刻度會在座標軸的右邊我們嘗試著渲染axisBottom()函式看看。
```javascript{numberLines: true}
let axisY = d3.axisBottom(scaleY);
const g = svg.append("g");
axisY(g);
```
這時候你會看到如下圖，刻度的數字落在軸的下方。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210927_05.png)


## ticks()函式
如果當你渲染出來的軸線需要刻度多一些的時候我們可以用ticks函式來幫我們將座標軸的刻度數量增加，當然沒有設定的時候是預設tick(10)，這邊數字的意思大致是拆分十等分，但是D3Js會根據你的資料來切分，所以有可能你tick(20)他切分了18等分，並不會剛好完全等於你所切分的函式。

程式碼如下
```javascript{numberLines: true}
let axisY = d3.axisRight(scaleY)
              .ticks(20);
let g = svg.append("g");
axisY(g);
```


![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210927_06.png)

## tickFormat()函式
有時候我們希望使用者在觀看軸線的時候不需要這麼多的零，可以自訂義軸的文字地顯示內容，這時候我就可以用tickFormat()函式來做出你想要的格式，例如我們將所有的資料除以1萬之後加入"萬"
觀看以下程式碼
```javascript{numberLines: true}
let axisY = d3
              .axisRight(scaleY)
              .ticks(5)
              .tickFormat(function (d) {
                return d / 10000 + "萬";
              });
const g = svg.append("g");
axisY(g);
```
這時候你就可以看到軸格式化成你想要的樣子如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210927_07.png)

完整程式碼如下
```javascript{numberLines: true}
 const newTaipei = taipei.map((el) => {
                    el.people_total = Number(el.people_total);
                    el.area = Number(el.area);
                    el.population_density = Number(el.population_density);
                    el.site_id = el.site_id.substr(3);
                    return el;
                });
            
                let padding = 50;
                const svg = d3.select("body")
                            .append("svg")
                            .attr("width", 800)
                            .attr("height", 450);
                let min = d3.min(newTaipei, (d) => d.people_total);
                let max = d3.max(newTaipei, (d) => d.people_total);
                console.log(newTaipei);
                let scaleY = d3.scaleLinear()
                                .domain([0, 320000])
                                .range([400, 0]);

                svg.selectAll("rect")
                    .data(newTaipei)
                    .join("rect")
                    .attr("x", (d, i) => {
                        return padding + i * 60;
                    })
                    .attr("y", (d) => {
                        console.log(scaleY(d.people_total));
                        return scaleY(d.people_total);
                    })
                    .attr("width", 50)
                    .attr("height", (d) => {
                        return 400 - scaleY(d.people_total);
                    })
                    .attr("fill", "orange");
                
                
                svg.selectAll("text")
                  .data(newTaipei)
                  .join("text")
                  .text((d) => {
                      return d.site_id;
                  })
                  .attr("x", (d, i) => {
                      return padding + i * 60;
                  })
                  .attr("y", (y) => {
                      return 450 -20;
                  });
              let axisY = d3
                .axisRight(scaleY)
                .ticks(5)
                .tickFormat(function (d) {
                  return d / 10000 + "萬";
                });   
              const g = svg.append("g");
          axisY(g);
        });
```
最後如下圖所示

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210927_08.png)

