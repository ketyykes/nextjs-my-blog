---
title: D3JsDay13 讓資料擁有過渡動畫，讓各位觀眾看見神話—過渡動畫
slug: 2021-09-28T08:05:54.000Z
date: 2021-09-28T08:05:54.000Z
tags: ["D3.js","Javascript"]
---


transition這個翻譯成**過渡**的意思，一個吸引人的圖表當中，加入了一點動畫成分和過渡的轉變能吸引使用者的目光，也讓觀看者有預期心理畫面將要轉換，另外也使得圖表更有質感。


首先我們先建立一個rect以寬50高300的長方形。
```javascript{numberLines: true}
const svg = d3.select("body")
            .append("svg")
            .attr("width",800)
            .attr("height",800);
svg.append("rect")
    .attr("x",10)
    .attr("y",0)
    .attr("width",50)
    .attr("height",300)
    .attr("fill","orange");
```

其中官方文件如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210928_01.png)
> [d3-transition官方API文件](https://github.com/d3/d3-transition/tree/v3.0.1#d3-transition)

這時候我們要考慮的地方是<font color="red">`transition()`</font>要放在到哪個位置，依據官方的文件說明，前面**要有一個selection**，也就是你所選擇的元素，後方需要帶入要改變的樣式，因此依據指示我們可以放在<font color="red">`append()`</font>的後面

程式碼如下
```javascript{numberLines: true}
svg.append("rect")
    .attr("x",10)
    .attr("y",0)
    .attr("width",50)
    .attr("height",300)
    .attr("fill","orange")
    ;
```
此時當你按下瀏覽器的重新整理按鈕的時候或是剛載入網頁的時候應當會看到如下面這個範例

[D3Day13-1範例](https://codepen.io/ketyykes/pen/RwgrvMN)

但出現的速度如此之快因此我們可以加入另一個函式來處理播放時間。


## duration()和delay()函式

<font color="red">`duration()`</font>添加至<font color="red">`transtition()`</font>後面，以下範例設定**3000毫秒**，也就是**3秒**

程式碼如下

```javascript{numberLines: true}
 const svg = d3.select("body")
            .append("svg")
            .attr("width",600)
            .attr("height",600);
svg.append("rect")
.transition()
.duration(3000)
.attr("x",10)
.attr("y",0)
.attr("width",50)
.attr("height",300)
.attr("fill","orange");
```
範例如下
[D3day13-2](https://codepen.io/ketyykes/pen/RwgrdLV)

<font color="red">`delay()`</font>函式放在<font color="red">`transition()`</font>函式後面，主要的用途是要延遲幾秒再執行的意思
[D3day13-3](https://codepen.io/ketyykes/pen/yLXewKw)



## ease()
### easeLinear()
這邊主要是帶入要呈現漸變時期的動畫時的效果，裡面帶入參數第一個是指定你要的函式第二個是時間，具體用法程式碼如下
```javascript{numberLines: true}
svg.append("rect")
    .transition()
    .ease(d3.easeLinear,1)
    .duration(1500)
    .attr("x",10)
    .attr("y",0)
    .attr("width",50)
    .attr("height",300)
    .attr("fill","orange");
```

函式圖形如下
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210928_02.png)
這邊帶入的就是線性的動畫，雖然官方文件寫參數值帶入t，但筆者觀看原始碼後線性所轉回的值與原先是一樣的情況，基本上你帶入99所呈現的畫面應當不會有所差別。
[D3day13-4](https://codepen.io/ketyykes/pen/RwgrmNm)

Linear原始碼如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210928_03.png)

> [官方easeLinear說明](https://github.com/d3/d3-ease#easeLinear)
> 
> [官方Linear原始碼](https://github.com/d3/d3-ease/blob/main/src/linear.js)
> 



### easePolyIn()
這邊官方說明就有提到t數值會改變動畫的效果
官方原文如下
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210928_04.png)

程式碼如下
```javascript{numberLines: true}
    svg.append("rect")
        .transition()
        .ease(d3.easePoly,4)
        .duration(5000)
        .attr("x",10)
        .attr("y",0)
        .attr("width",50)
        .attr("height",300)
        .attr("fill","orange")
        ;
```

[D3day13-5](https://codepen.io/ketyykes/pen/BaZjEYe)
函式圖型如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210928_05.png)


[官方easePolyIn說明](https://github.com/d3/d3-ease#easePolyIn)

其他更多的函式可以參考官方API文件


> [easeAPI官方文件](https://github.com/d3/d3-ease#_ease)

值得注意的一點是有些函式並不適用於每個屬性像是這個長條圖有寬和高
因此如果你想嘗試使用<font color="red">`d3.easeElasticInOut()`</font>這個函式的話
由於函式圖型有超出原本的區間，因此會造成寬高變成負值就會輸出錯誤。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210928_06.png)

另外D3的作者有發表關於其他範例，可以參考d3作者所用的範例，它所用的範例是改變位移的屬性，因此也就能更加瞭解每個函式直接的差別。

> [D3作者的範例](https://bl.ocks.org/d3noob/1ea51d03775b9650e8dfd03474e202fe)

## 長條圖動畫

原本的<font color="red">`<rect>`</font>的程式碼如下，延續我們之前的範例假設**我們希望畫面載入的時候長條圖由底部開始漸漸變長**的話，該如何撰寫呢？


```javascript{numberLines: true}
svg.selectAll("rect")
    .data(newTaipei)
    .join("rect")
    .attr("x", (d, i) => {
        return padding + i * 60;
    })
    .attr("y", (d) => {
        return scaleY(d.people_total);
    })
    .attr("width", 50)
    .attr("height", (d) => {
        return 400 - scaleY(d.people_total);
    })
    .attr("fill", "orange");
```


由於<font color="red">`transition方法鏈`</font>後面所帶入的東西是你要改變的屬性，因此勢必我們得思考後面帶入的東西是什麼？因為我們預計會改變長方形的高度，所以我們必須關注height屬性，另外我們的svg的(0,0)座標是在左上角，如果只改變<font color="orange">`height`</font>屬性的話，長方形的動畫會從上方伸長到下方，因此我們也得改變<font color="orange">`y`</font>的起始點位置，這邊svg的底部<font color="orange">`y`</font>的位置是<font color="orange">`400`</font>，所以在transition前面寫下<font color="red">`.attr("y", 400)`</font>，高度從0開始伸長所以寫下<font color="red">`.attr("height", 0)`</font>

而我們原本的程式碼是放在<font color="red">`transition`</font>之後當作**最後的結果**，最後的程式碼就如下面所示

```javascript{numberLines: true}
svg.selectAll("rect")
            .data(newTaipei)
            .join("rect")
            .attr("x", (d, i) => {
              return padding + i * 60;
            })
            .attr("y", 400)
            .attr("height", 0)
            .attr("width", 50)
            .attr("fill", "orange")
            .transition()
            .duration(3000)
            .attr("y", (d) => {
              return scaleY(d.people_total);
            })
            .attr("height", (d) => {
              return 400 - scaleY(d.people_total);
            });
```

整個做出長條圖從無到有的過程大概分成三個階段

1. 先製作出初始樣貌放在<font color="red">`transition`</font>前面
1. 加入<font color="red">`transition`</font>函式和<font color="red">`delay`</font>與<font color="red">`duration`</font>等等函式
1. 放在<font color="red">`transition`</font>後面是最後要改變的屬性或樣式


本日完整程式碼如下
```javascript{numberLines: true}
  let newTaipei = taipei.map((el) => {
            el.people_total = Number(el.people_total);
            el.area = Number(el.area);
            el.population_density = Number(el.population_density);
            el.site_id = el.site_id.substr(3);
            return el;
          });

          let padding = 50;
          let svg = d3
            .select("body")
            .append("svg")
            .attr("width", 800)
            .attr("height", 450);
          let min = d3.min(newTaipei, (d) => d.people_total);
          let max = d3.max(newTaipei, (d) => d.people_total);
          console.log(newTaipei);
          let scaleY = d3.scaleLinear().domain([0, 320000]).range([400, 0]);

          svg.selectAll("rect")
            .data(newTaipei)
            .join("rect")
            .attr("x", (d, i) => {
              return padding + i * 60;
            })
            .attr("y", 400)
            .attr("height", 0)
            .attr("width", 50)
            .attr("fill", "orange")
            .transition()
            .duration(3000)
            .attr("y", (d) => {
              return scaleY(d.people_total);
            })
            .attr("height", (d) => {
              return 400 - scaleY(d.people_total);
            });

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
              return 450 - 20;
            });

          let axisY = d3.axisRight(scaleY)
                        .ticks(5)
                        .tickFormat(function (d) {
                        return d / 10000 + "萬";
                        });
          let g = svg.append("g");
          axisY(g);
        });
```
