---
title: D3JsDay14不想圖表被冰凍，那就做一點互動—事件互動
slug: 2021-09-29T10:05:54.000Z
date: 2021-09-29T10:05:54.000Z
tags: ["D3.js","Javascript"]
---


什麼是互動?簡單說希望能夠讓使用者允許監聽和分派事件，用比較白話的一點方式舉例就是當我們滑鼠按下某個元素的時候，圖表會呈現某些樣貌，**監聽就是滑鼠按下**的意思，**委派就是讓圖表呈現某些樣貌，**

> 對應到的原生Js說明可以參考[Event reference-MDN](https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events)
其他更多說明也可以參考d3JSAPI文件
> [官方API事件處理](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#handling-events)
## 監聽器
首先我們要有一個所選取的元素，在後面透過方法鏈的方式加入要執行的函式，這邊可以直接就範例學習即可，例如我們預做出一個當按鈕按下去就會產生隨機的長條圖，我們可以先把按鈕和長條圖準備好
建立好的範例如下
```html{numberLines: true}
<style>
.btn {
      padding: 8px;
      background-color: orange;
      border: none;
      border-radius: 4px;
    }
.btn:hover {
  background-color: rgba(255, 166, 0, 0.664);
  cursor: pointer;
}
</style>
<body>
  <script>
    let btn = d3.select("body")
                .append("button")
                .text("按鈕")
                .style("display", "block")
                .classed("btn", true);
    let randomIntFun = d3.randomInt(50, 400);
    let randomArr = [];

    for (let index = 0; index < 20; index++) {
      randomArr.push(randomIntFun());
    }
    let padding = 40;
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", 800)
      .attr("height", 450);
    svg.selectAll("rect")
      .data(randomArr)
      .join("rect")
      .attr("x", (d, i) => {
        return padding + i * 30;
      })
      .attr("y", () => 400 + padding)
      .attr("width", 20)
      .attr("height", 0)
      .attr("fill", "green")
      .transition()
      .duration("1000")
      .attr("y", (d) => {
        return 400 - d + padding;
      })
      .attr("height", (d) => {
        return d;
      });

    let scaleY = d3.scaleLinear().domain([0, 400]).range([400, 0]);
    let axisY = d3.axisRight(scaleY);

    const g = svg.append("g");
    axisY(g);
    g.attr("transform", `translate(0,40)`);
  </script>
</body>
```
[d3Day14-1](https://codepen.io/ketyykes/pen/xxrOGjJ)

### randomInt()、svg屬性transform() 補充說明
> 這裡用到了<font color="red"> `randomInt()`</font>的方法，簡單說是建立一個函式，這個函式執行後會回傳隨機的整數，randomInt()裡面填的數值是最小值和最大值，根據範例就可以產生出最小值50，最大值400的隨機亂數，然後使用for迴圈將產生的數值使用array push到陣列當中，總共執行二十次。
> [d3官方文件randomInt](https://github.com/d3/d3-random#randomInt)

> 補充二第58行的地方 <font color="red"> `g.attr("transform", "translate(0,40)")`</font>的地方使用了transform，有時候我們渲染出來的座標與圖表位置沒有對應到的時候可以使用這個屬性來調整它，可以參考[MDN-SVG-transform](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform)


### 加入on監聽

接下來我們預計使用滑鼠點擊的事件因此在 <font color="red"> `on()`</font>內第一個參數填入**click**，第二個參數則是填入要執行的**function**，我們預計每次按下按鈕的時候畫出一個長條圖，因此先取名叫做render函式
```javascript{numberLines: true}
     let btn = d3.select("body")
        .append("button")
        .text("按鈕")
        .style("display", "block")
        .classed("btn", true)
        .on("click", render);
```
這時候我們將剛剛所建立的長條圖和隨機產生數字的程式碼用function render()包住此時大概會長這樣
```javascript{numberLines: true}
    function render() {
        let randomIntFun = d3.randomInt(50, 400);
        let randomArr = [];
        
        //中間如上面的程式碼故省略......
        //中間如上面的程式碼故省略......
        //中間如上面的程式碼故省略......
        
        let scaleY = d3.scaleLinear().domain([0, 400]).range([400, 0]);
        let axisY = d3.axisRight(scaleY);

        let g = svg.append("g");
        axisY(g);
        g.attr("transform", `translate(0,40)`);
    }
```

這時候按下按鈕會發現它將會再次新增一筆，所以我們一直按的話會看到下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210929_01.png)

因此我們在執行render function的時候要先把先前的svg給移除掉，另外希望畫面載的時候有一個長條圖，因此可以先執行一次render()

```javascript{numberLines: true}
    function render() {
       d3.select("body").select("svg").remove();
        let randomIntFun = d3.randomInt(50, 400);
        let randomArr = [];
        
        //中間如上面的程式碼故省略......
        //中間如上面的程式碼故省略......
        //中間如上面的程式碼故省略......
        
        let scaleY = d3.scaleLinear().domain([0, 400]).range([400, 0]);
        let axisY = d3.axisRight(scaleY);

        let g = svg.append("g");
        axisY(g);
        g.attr("transform", `translate(0,40)`);
    }
    render();
```

完整程式碼參考

[d3Day14-2](https://codepen.io/ketyykes/pen/BaZzodZ)


延續前幾天的程式碼我們希望可以再滑鼠滑入到某個 <font color="red"> `<rect>`</font>的時候列出對應到的人口實際數字，另外添加過渡動畫改變長條圖的顏色，當滑鼠移出該rect的時候變回來。

因此我們再前幾天的程式碼後面加入以下片段
```javascript{numberLines: true}
svg.selectAll("rect")
  .on("mouseenter", function () {
    let thisRectX = d3.select(this).attr("x");
    let thisRectY = d3.select(this).attr("y");
    let text = d3.select(this).data()[0].people_total;
    d3.select(this).transition().duration(800).attr("fill","blue");
    svg.append("text")
    .attr("id","people-total")
    .attr("x",thisRectX)
    .attr("y", ()=>(scaleY(text)-10))
    .style("fill","blue")
    .text(text);
  })
```

上述程式碼主要是在滑鼠移入到對應的 <font color="red"> `rect`</font>長條時先存取該 <font color="red"> `rect`</font>的 <font color="orange">`x`</font>屬性位置和 <font color="red"> `y`</font>屬性的位置如第**3、4**行，這邊的this指向的是你所觸發滑鼠移入事件的元素，另外也**宣告text變數**來儲存你所指的元素的資料，第**7~12**行就是在**svg**底下添加**text元素**，然後各個屬性的值來自於剛剛第**3、4、5**行所取的值，另外為了之後方便移除，所以在text元素添加了一個id屬性，到目前為止只有由於執行 <font color="red"> `mouseenter Event`</font>也就是滑鼠移入事件，因此當我們離開 <font color="red"> `rect`</font>元素的時候，顏色沒有變回來，上方的數值也沒有消失

如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210929_02.png)

所以我們得在添加關於離開元素的時候的程式碼，程式碼如下
```javascript{numberLines: true}
svg.selectAll("rect")
  .on("mouseenter", function () {
    let thisRectX = d3.select(this).attr("x");
    let thisRectY = d3.select(this).attr("y");
    let text = d3.select(this).data()[0].people_total;
    d3.select(this).transition().duration(800).attr("fill","blue");
    svg.append("text")
    .attr("id","people-total")
    .attr("x",thisRectX)
    .attr("y", ()=>(scaleY(text)-10))
    .style("fill","blue")
    .text(text);
}).on("mouseleave",function () {
  d3.select(this)
  .transition()
  .duration(800)
  .attr("fill","orange");
    svg.select("#people-total").remove(this);
})
```
這邊的this來自於事件的觸發也就是你當滑入進去的元素，方法鏈後面繼續接續一個事件表示滑鼠離開該元素時所要執行的事情，這邊執行的事情直接把剛剛添加的text用id選取起來並移除它，另外也將顏色改變回來。

完整程式碼如下
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
          svg.selectAll("rect")
            .on("mouseenter", function () {
              let thisRectX = d3.select(this).attr("x");
              let thisRectY = d3.select(this).attr("y");
              
              let text = d3.select(this).data()[0].people_total;
              d3.select(this).transition().duration(800).attr("fill","blue");
              svg.append("text")
              .attr("id","people-total")
              .attr("x",thisRectX)
              .attr("y", ()=>(scaleY(text)-10))
              .style("fill","blue")
              .text(text);

          }).on("mouseleave",function () {
            d3.select(this)
            .transition()
            .duration(800)
            .attr("fill","orange");
              svg.select("#people-total").remove(this);
          })
```
