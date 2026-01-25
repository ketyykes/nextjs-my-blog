---
title: D3JsDay18 不讓資料進墳墓，秒懂農產品分布—實際資料畫地圖
slug: 2021-10-03T08:25:23.000Z
date: 2021-10-03T08:25:23.000Z
tags: ["D3.js","GeoJSON","Javascript"]
---

我們到政府開放資料平台下載這兩個檔案，第一個是包含各種伴手禮的經緯度資料、名稱、介紹等等作為要畫在地圖上的資料，另一個是台灣地圖的 shp 檔案，作為繪製地圖用。

> [推薦農村優良伴手禮](https://data.gov.tw/dataset/24657) 
> [鄉鎮市區界線](https://data.gov.tw/dataset/7441)

我們預計將**svg**和一個**div**的**class**叫做**wrap-item**放在**wrap**裡面，然後撰寫**css**使用**flex**來進行排版，**svg**這個容器是要放地圖檔案和農產品的經緯度預計要製作成 circle 的點狀的樣子來當作該地區有農產品的位置，**wrap-item**則是我們要顯示這些農產品的名稱、住址、電話、介紹等等的容器，程式碼如下

```javascript{numberLines: true}
<style>
.wrap{
    display: flex;
    justify-content: center;
}
svg{
    border:solid 1px  black;
}
</style>
<body>
<div class="wrap">
</div>
let width = 800;
let height = 600;
const projection = d3.geoMercator()
                    .center([123, 24 ])
                    .scale(5000);
const svg = d3.select("body").select(".wrap").append("svg")
                .attr("width", width)
                .attr("height", height);
const path = d3.geoPath()
            .projection(projection);

const g = svg.append("g");
d3.select(".wrap").append("div").classed("wrap-item",true);//選擇class是wrap的元素插入div並且命名為wrap-item
</body>
```

接下來我們載入真正的資料

```javascript{numberLines: true}
d3.json("taiwantopo.json").then(function(topology) {
    console.log(topology);
});
```

一樣我們先觀察轉換後的**topojson**的哪一個部分是我們需要的東西。
如下圖 objects 裡面的<font color="red">`COUNTY_MOI_1090820`</font>是我們需要的東東西

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211003_01.png)

接下來我們就進行資料綁定的部分，綁定到 path 的內容是 geojson 的 features
程式碼如下

```javascript{numberLines: true}
d3.json("taiwantopo.json").then(function(topology) {
    console.log(topology);
    const makeColor = d3.scaleSequential(t => d3.hsl(t * 360, .8, .9).formatRgb()).domain([0,30]);
    g.selectAll("path")
        .data(
            topojson
                .feature(topology, topology.objects.COUNTY_MOI_1090820)
                .features
                )
        .join("path")
        .style('fill', (d,i)=>{
            return makeColor(i);
        })
        .style("stroke", "gray")
        .style("stroke-width",".25")
        .style("stroke-opacity",".5")
        .attr("d", path);
});
```

這次沒有額外宣告一行，直接將 topojson 轉 geojson 和取出裡面的 features 綁定 data 到 path 裡面，另外第 3 行的地方，由於台灣大概有二十幾個縣市，我們就設定 domain([0,30])，這時候可以看到如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211003_02.png)

為了確保地圖資料載入之後再載入農產品，我們可以在接一個.then(function{})在剛剛畫完台灣地圖的地方
程式碼大致如下

```javascript{numberLines: true}
d3.json("taiwantopo.json")
.then(function(topology) {
// 以下省略
}
.then(function(){
  d3.json("farm-product-map.json").then(function(product){
    console.log(product);
  })
})
```

我們可以 console.log()確認看資料是否有正確載入如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211003_03.png)

接下來我們可以進行資料綁定與先前的做法都一樣是半徑設為 1 然後設定淡綠色，此時要考慮的地方是圓的位置

```javascript{numberLines: true}
d3.json("farm-product-map.json").then(function(product){
    console.log(product);
    g.selectAll("circle")
    .data(product)
    .join("circle")
    .attr("cx", function(d) {
          //?????
    })
    .attr("cy", function(d) {
          //?????
    })
    .attr("r", 1)
    .style("fill", "lightgreen")
 })
```

官方 API 說明如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211003_04.png)

因此我們可以得知要帶入的是[longitude, latitude]，他將會正確地回傳一個轉換後的 svg 位置
，我們可以試著插入 console.log(projection([d.Longitude,d.Latitude]));程式碼在問號的區域，之後看主控台如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211003_05.png)

它印出 x 和 y 的位置所形成的陣列，因此我們陣列索引值 0 來當作 cx 的屬性位置，1 來當作 cy 的屬性位置
，最後程式碼如下

```javascript{numberLines: true}
g.selectAll("circle")
  .data(product)
  .join("circle")
  .attr("cx", function(d) {
          // console.log(d);
          // console.log(projection([d.Longitude,d.Latitude]));
          console.log(projection([d.Longitude,d.Latitude]));
          return projection([d.Longitude, d.Latitude])[0];
  })
  .attr("cy", function(d) {
          return projection([d.Longitude, d.Latitude])[1];
  })
  .attr("r", 1)
  .style("fill", "lightgreen")
```

最後就可以印出各個農產品的位置在地圖上了

如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211003_06.png)

本日完整程式碼如下

```javascript{numberLines: true}
<style>
.wrap{
    display: flex;
    justify-content: center;
}
svg{
    border:solid 1px  black;
}

</style>
<body>
    <div class="wrap">
    </div>
<script>
let width = 800;
let height = 600;
const projection = d3.geoMercator()
                    .center([123, 24 ])
                    .scale(5000);
const svg = d3.select("body").select(".wrap").append("svg")
                .attr("width", width)
                .attr("height", height);
const path = d3.geoPath()
            .projection(projection);
const g = svg.append("g");
d3.select(".wrap").append("div").classed("wrap-item",true);
d3.json("taiwantopo.json")
.then(function(topology) {
    console.log(topology);
    const makeColor = d3.scaleSequential(t => d3.hsl(t * 360, .8, .9).formatRgb()).domain([0,30]);
    g.selectAll("path")
        .data(
            topojson
                .feature(topology, topology.objects.COUNTY_MOI_1090820)
                .features
                )
        .join("path")
        .style('fill', (d,i)=>{
            return makeColor(i);
        })
        .style("stroke", "gray")
        .style("stroke-width",".25")
        .style("stroke-opacity",".5")
        .attr("d", path);
})
.then(function(){
    d3.json("farm-product-map.json").then(function(product){
        console.log(product);
        g.selectAll("circle")
        .data(product)
        .join("circle")
        .attr("cx", function(d) {
                // console.log(d);
                // console.log(projection([d.Longitude,d.Latitude]));
                console.log(projection([d.Longitude,d.Latitude]));
                return projection([d.Longitude, d.Latitude])[0];
        })
        .attr("cy", function(d) {
                return projection([d.Longitude, d.Latitude])[1];
        })
        .attr("r", 1)
        .style("fill", "lightgreen")
    })
})
;
</body>
```

今天先印出農產品位置圖，明天再做互動性，來讓使用者可以滑入點的時候觀看農產品的內容

