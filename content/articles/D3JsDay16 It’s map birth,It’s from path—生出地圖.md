---
title: D3JsDay16 It's map birth,It's from path—生出地圖
slug: 2021-10-01T06:05:23.000Z
date: 2021-10-01T06:05:23.000Z
tags: ["D3.js","GeoJSON","Javascript"]
---


昨天介紹完關於Web地圖的相關知識之後今天我們要開始使用**geojson**的資料來繪製一個地圖首先我們到以下的網站下載**shp**檔案

[Natural Earth](https://www.naturalearthdata.com/)

[政府開放平台SHP](https://data.gov.tw/faqs/631)


## 轉換格式工具
### 工具一　mapshaper
由於要繪製地圖的時候我們必須使用**geojson**的格式進行，在網路上得到的資源是屬於**shapefile**的格式，所以要先進行轉換成**geojson**

> [D3jeo官方API文件](https://github.com/d3/d3-geo/tree/v3.0.1)提到如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_01.png)

D3的作者也進行了開源專案讓**shp**轉換成**geojson**可以參考以下連結
> [D3作者開源專案轉換shapefile](https://github.com/mbostock/shapefile)

我們使用另一個方式線上進行轉換

首先進到[mapshaper](https://mapshaper.org/)網站之後將從政府開放平台資料下載的檔案解壓縮之後的**shp**拖曳到畫面當中，按下**import**

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_02.png)

基本上會看到預覽圖如下

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_03.png)

另外可以點擊右上角的**simplify**做壓縮

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_04.png)

看到這個畫面之後按**Apply**

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_05.png)

這時候畫面上方會多一個可以拉動0到100%的設定如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_06.png)

你可以嘗試著拉動它這邊拉動至0%試試看如下圖，~~你就知道為什麼台灣會被說像番薯了~~

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_07.png)

這裡我們調整大概80%左右如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_08.png)

按下右上角的**Export**應該會看到如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_09.png)

這裡我們選擇**topoJson**按下**export**之後應該就會開始下載了，做到這一步基本上你會得到一個json檔案


## 工具二　topojson


我們剛剛輸出的是**topojson**先前提到整體檔案會比**geojson**來的小，當我們後續要撰寫程式碼的時候也必須將**topojso**n轉換成**geojson**這邊可以使用CDN的方式也就是載入連結的方式引入到腳本中或是**npm安裝**，我們使用CDN的方式
基本上打開下面的網頁滾動到下方把這行複製到你的網頁的<font color="red">`head`</font>裡面就可以了。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_10.png)

> [topojson轉換](https://github.com/topojson/topojson)


## 感受程式碼
這一次換個解說方式，我們先行給予程式碼來讓各位感受一下，還不了解沒關係，等等將會講解重要函式的作用
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
const g = svg.append("g"); //先行撰寫一個g群組以便之後要插入path屬性
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
    .attr("d", path)
    ;
})
```

## Projection函式介紹

打開官方文件在安裝的那一欄就就有寫到要先宣告一個**projection**，然後使用**geoPath路徑生成器**來指定投影方式

**這裡projection翻成中文是投影的意思**

如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_11.png)
 
> [d3-geoInstalling](https://github.com/d3/d3-geo/tree/v3.0.1#installing)

因此我們撰寫程式碼了解一下projection是什麼東西如下

```javascript{numberLines: true}
const projection = d3.geoMercator();
console.log(typeof(projection));
```
這時候我們使用<font color="red">`console.log(typeof(projection))`</font>，它會說是一個函式

如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_12.png)

官方API文件說明是將球面的多邊形幾何轉換成平面的多邊形幾何，簡單說就是先前地理知識將球影投影到平面上的意思

官方說明如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_13.png)

> [d3Projection官方說明](https://github.com/d3/d3-geo/blob/v3.0.1/README.md#projections)

## geopath函式介紹

我們先看官方API說明如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_14.png)

1. 需要知道的第一點是官方提到這裡是一個路徑產生器，可以指定投影方式，我們上一個部分介紹到的projection將會派上用場
1. 需要知道的第二點是這一行說明**Renders the given object, which may be any GeoJSON feature or geometry object:**這邊意思是<font color="red">`path函式`</font>要進行轉換的時候需要帶入的是**GeoJSON**的**feature**先記得這個說明之後會用到

> [d3的geojson官方API](https://github.com/d3/d3-geo/blob/v3.0.1/README.md#geoPath)

## topojson轉換函式

這個時候到官方API文件滑到下方點擊這個有寫到轉換**topojson**到**geojson**

<font color="blue">topojson.feature </font>- convert TopoJSON to GeoJSON.

因此我們要用的是這個函式

[topojsonAPI文件](https://github.com/topojson/topojson#manipulation-topojson-client)

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_15.png)

官方有提到接受物件如果是**GeometryCollection**會將每個幾何圖形映射到**Feature**

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_16.png)

這時候我們撰寫程式碼，一樣使用先前提到的json載入資料方式來載入世界地圖，然後觀看一下<font color="red">`console.log`</font>的內容

```javascript{numberLines: true}
d3.json("World_Countries.json").then(function(topojsonData) {
    console.log(topojsonData);
})
```

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_17.png)

如上圖打開<font color="red">`console.log`</font>看**objects**的**World_Countries**那一欄顯示裡面的東西是**GeometryCollection**正是我們需要的東西。


所以我們宣告一個**convertedGeojson**來**儲存剛剛的東西**，目前為止是將**topojson**轉換成**geojson**存入變數**convertedgeojson**中

程式碼如下

```javascript{numberLines: true}
d3.json("World_Countries.json")
.then(function(topojsonData) {
        console.log(topojsonData);
        const convertedGeojson =topojson
                .feature(topojsonData, topojsonData.objects.World_Countries);
          
  })
```

## 組合程式碼

上面介紹完這三個函式的用途之後
我們回頭看剛剛所給各位感受的程式碼
具體步驟如下

1. 宣告一個porjection變數來取得某個投影方法函式
2. 將剛剛的投影方法指定至path路徑產生器
3. 找尋topojson資料中的**GeometryCollection**物件來透過<font color="red">`topojson函式`</font>轉換
4. 使用<font color="red">`path`</font>路徑函式將轉換後的**geojson**提取出**features**進行繪製

因此剛剛的程式碼
第6行就是宣告一個投影方式
第8行宣告一個路徑產生器來指定投影方式
第13行使用<font color="red">`topojson的feature函式`</font>將**GeometryCollection**轉換至**Geojson**
第14行將Geojson的features提取出來當成之後要使用<font color="red">`path函式`</font>的參數

最後的樣貌應該會如下圖

明天再來教學如何美化這個地圖和顯示地圖相關區域

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211001_18.png)
