---
title: D3JsDay17 Fill the color,Zoom in on center—地圖各項操作及填色
slug: 2021-10-02T06:45:23.000Z
date: 2021-10-02T06:45:23.000Z
tags: ["D3.js","GeoJSON","Javascript"]
---

## 改變path的樣貌
```javascript{numberLines: true}
const width = 800;
const height = 600;
const svg = d3.select("body").append("svg")
              .attr("width", width)
              .attr("height", height);
const  projection = d3.geoMercator();
console.log(typeof(projection));
const path = d3.geoPath()
.projection(projection);
const g = svg.append("g");
d3.json("World_Countries.json").then(function(topojsonData) {
  console.log(topojsonData);
  const convertedGeojson =topojson
          .feature(topojsonData, topojsonData.objects.World_Countries);
  const getGeoFeature = convertedGeojson.features;
g.selectAll("path")
  .data(
      getGeoFeature
          )
  .join("path")
  .style("stroke", "gray")
  .style("stroke-width","1")
  .style("stroke-opacity",".5")
  .style("fill","white")
  .attr("d", path)
  ;
})
```

昨天我們所畫出的地圖是黑色的區塊，如果我們只有撰寫24行<font color="red">` .style("fill","white")`</font>設定成白色的話，由於你的svg背景也是白色，所以整個地圖將會看起來像消失一般

因此我們在21行撰寫<font color="red">`.style("stroke", "gray")`</font>的地方將加入線段並且設定成灰色，為了讓線段不要太過突兀，可以設定他的透明度和線段粗細如第22行的<font color="red">` .style("stroke-width","1")`</font>和23行的<font color="red">`.style("stroke-opacity",".5")`</font>所示


## 連續顏色比例尺轉換

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211002_01.png)

這邊提到它的<font color="red">`range是[0,1]`</font>，我們可嘗試著撰寫一下程式碼看看會印出什麼
```javascript{numberLines: true}
const a = d3.scaleSequential().domain([0,100]);
console.log(a(1));
```
其實這裡會印出的東西相當於先前提到的<font color="red">`scaleLinear()`</font>使用<font color="red">`range([0,1])`</font>的函式
如下
```javascript{numberLines: true}
const b = d3.scaleLinear().domain([0,1000]).range([0,1]);
console.log(b(1));
```

底下有一個範例是轉換你所輸入的數字變成一個色彩的範例，然而官方說明提到**如果沒有指定domain的話將會預設成**<font color="red">`domain([0,1])`</font>，換句話說它會預設成**domain**和**range**都是**(0,1)**，因此不論你輸入什麼數字都會轉換成同一種色彩。

因此我們可以給予一個**domain**來表示預計轉換的數字範圍
程式碼如下
```javascript{numberLines: true}
var rainbow = d3.scaleSequential(function(t) {
          return d3.hsl(t * 360, 1, 0.5) + "";
          }).domain([1,20]);
console.log( rainbow(5));//印出rgb(188, 255, 0) 
```
可以嘗試將rainbow代入不同的數字會印出不同的rgb參數

> 補充說明HSL是一種色彩表示方式，第一個數字代表顏色範圍是0~360，第二個數字和第三個數字代表飽和度和亮度範圍都是0到1更多可以參考[HSL和HSV維基](https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4)
> [scaleSequentiald3官方API](https://github.com/d3/d3-scale/blob/v4.0.0/README.md#scaleSequential)
> 其他更多的色彩可參考[d3官方色彩API](https://github.com/d3/d3-color/blob/v3.0.1/README.md#lab)

因此我們可以宣告一個**diversityColor變數**裡面使用**t**來設定不同的顏色，這邊飽和度和亮度設定0.9，為了確保格式正確使用<font color="red">`formatRgb()`</font>方法來轉換，另外全世界大概兩百多個國家，我們<font color="red">`domain([0,250])`</font>
```javascript{numberLines: true}
const diversityColor = d3.scaleSequential(t => d3.hsl(t * 360,.9,.9).formatRgb()).domain([0,250]);
```
接下來宣告完之後我們就再剛剛插入data的地方使用i遍歷每個區塊程式碼如下
```javascript{numberLines: true}
g.selectAll("path")
  .data(
      getGeoFeature
          )
  .join("path")
  .style("stroke", "gray")
  .style("stroke-width","1")
  .style("stroke-opacity",".5")
  .style("fill",(d,i)=>(diversityColor(i)))
  .attr("d", path);
```
之後你應該會看到的畫面如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211002_02.png)


## 設經緯度、縮放、旋轉角度

假如你畫出來的地圖位置不是你所要的話，又或者顯示面積太小的話該如何處理，例如本範例當中是放入世界地圖，如果我們要呈現台灣要如何處置?


這邊可以參考[D3官方projection](https://github.com/d3/d3-geo/blob/v3.0.1/README.md#projection_center)

直接用將參數帶入到projection作方法鏈連接
程式碼如下
```javascript{numberLines: true}
const  projection = d3.geoMercator()
                        .center([120, 23])
                        .scale(5000)
                        .rotate([0,0,0]);
```
由上面的程式碼我們設定<font color="red">`scale(5000)`</font>和台灣的經緯度，代入<font color="red">`center([120, 23])`</font>就可以讓世界地圖移動到台灣的地方並且放大，另外可以旋轉角度，有興趣的人可以自行試試看

設置完會看到如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211002_03.png)

## zoom()縮放位移函式
### zoom事件
我們在使用GoogleMap地圖的時候通常可以透過滾輪、滑鼠連續點兩下可以放大、滑鼠按住後移動可以位移地圖，在d3裡面可以使用zoom事件來表示這些行為

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211002_04.png)

我們撰寫以下程式碼
```javascript{numberLines: true}
 const zoom = d3.zoom()
              .on('zoom', function(event) {
                  console.log(event.transform);
                  g.selectAll('path')
                   .attr('transform', event.transform);
                });
```
### event.transform

這裡用<font color="red">`on()`</font>來監聽zoom事件，嘗試著印出event.transform看看，將會看到以下片段

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211002_05.png)

這邊k表示縮放距離，x和y表示位移座標

官方文件說明如下，大致上的意思是使用高中數學所學的矩陣的概念轉換位置，web運作原理是來自於SVG的**transformMatrix**有興趣的人可以參考[SVGtransformMatrixMDN章節](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#matrix)

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211002_06.png)

上述第2行綁定事件之後後面callback函式裡面可以代入要執行的動作，我們藉由所抓取的**zoom事件**來對應要改變屬性transform。

另外記得的一點是建立一個zoom的行為的時候記得要掛載到某個元素上面
官方說明如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211002_07.png)

> [D3官方Zoom官方API](https://github.com/d3/d3-zoom/blob/v3.0.0/README.md#zoom)

### scaleExtent()函式限制縮放焦距
這個函式只要是可以讓使用者在透過滾輪或是滑鼠點擊兩下的時候不要無限放大(或是無限縮小)
綜合以上的程式碼如下
```javascript{numberLines: true}
 const zoom = d3.zoom().scaleExtent([1,10])
                      .on('zoom', function(event) {
                          console.log(event.transform);
                          g.selectAll('path')
                           .attr('transform', event.transform)
                           ;
                        });
svg.call(zoom);
```
我們設定下限是1也就是不讓使用者縮小，也可以設定負值讓使用者縮小

另外<font color="red">`zoom()`</font>這個功能不限於只能用在地圖這邊的使用，在一般的<font color="red">`<svg> <rect> <circle>`</font>等等皆可使其放大縮小位移

## 總結

本日學習到可以設定經緯度的中心點<font color="red">`center()`</font>指定縮放倍數縮放大小<font color="red">`scale()`</font>旋轉角度<font color="red">`rotate()`</font>

設定path的線段粗細、顏色、透明度，區塊的顏色填充和顏色的產生

設定焦距的縮放位移

明天將會找尋一個實際資料來做視覺化呈現地圖
