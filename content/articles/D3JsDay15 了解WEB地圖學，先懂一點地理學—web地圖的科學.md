---
title: D3JsDay15 了解WEB地圖學，先懂一點地理學—web地圖的科學
slug: 2021-09-30T15:40:54.000Z
date: 2021-09-30T15:40:54.000Z
tags: ["D3.js","GeoJSON","Javascript"]
---

## GIS地理資訊系統(Geographic Information System)

**地理資訊系統**這個名詞聽起來有些抽象，其實諸如我們平常所使用的Google Map，汽車所使用的衛星導航，氣象局所呈現的大氣圖表、衛星雲圖或是你使用手機的租用單車APP查看哪裡還有可使用的單車，只要結合了以下

1. 地理(也就是傳統地理空間、某個地方或位置)
1. 資訊(單車可租用的位置)
1. 系統(讓使用者透過APP查看)


或是之前因為covid19疫情關係所出現的口罩地圖

1. 地理(可能是台灣或是某個縣市)
1. 資訊(包含還有口罩存貨的藥局或是已經尚無存貨的藥局等等)
1. 系統(民眾使用手機或是電腦點擊操作過濾還有剩餘口罩的藥局)

以上這些都可以算是**GIS系統**，屬於比較與民眾相關的應用，其他像是可能的應用包含如果我們將每次的車禍事故的位置記錄下來，放到電腦當中使用GIS系統繪製出交通發生的地點，對於一些事故率較高的地區在交通尖峰時期可以調派警員指揮交通，或是根據人口分布、災害發生位置分析後來妥善的配置救護車的數量。

只要是提及到空間資訊的應用、像是生態保育、都市規劃、人口遷移這些擁有位置資訊的地圖都可以套入**GIS系統**加以分析使其得出有用的資訊。

補充說明
> 地理資訊系統（英語：Geographic Information System，縮寫：GIS）是一門綜合性學科，結合地理學與地圖學，已經廣泛的應用在不同的領域，是用於輸入、儲存、查詢、分析和顯示地理資料的電腦系統。

## 空間資料格式—Shapefile、Geojson、TopoJSON
### Shapefile
**ESRI Shapefile（shp）**製作**GIS地理資訊系統**的公司所開發的一個空間資料格式，目前也在軟體界成為了開放標準
以下引用Shapefile維基百科的敘述

> Shapefile檔案用於描述幾何體物件：點、折線與多邊形。例如，Shapefile檔案可以儲存井、河流、湖泊等空間物件的幾何位置。除了幾何位置，shp檔案也可以儲存這些空間物件的屬性，例如河流的名字、城市的溫度等等。

另外比較值得一提的是雖然他叫做**Shapefile**檔案，實際上使用了多個檔案格式、其中有三個檔案是不可缺少的檔案，分別是`.shp`,`.shx`與`.dbf`檔案。

其他更多的敘述可以參考wiki

> [Shapefile維基百科](https://zh.wikipedia.org/wiki/Shapefile)

### Geojson
然而由於**shp**的檔案格式需要儲存的容量較大，因此在web世界裡面作為傳輸將會影響使用者進入網頁的速度，因此後來有人基於**JSON**格式下規範了**geojson**的標準，**json**在Web世界裡面屬於輕量級的交換文字格式，所以能更加的快速在瀏覽網頁的時候載入頁面，詳細介紹可以參考wiki
> [GeoJSON維基百科](https://zh.wikipedia.org/wiki/GeoJSON)

我們可以使用瀏覽器觀看geojson的結構可以發現使用type來儲存點、線、多邊的幾何結構和特徵或是特徵的集合。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210930_01.png)

如上圖，**properties**儲存的東西是一些資訊例如縣市名稱、縣市代號等等，coordinate儲存的是經緯度這些座標點。

其他更多可以至以下網址參考規範
> [geojson.org](https://geojson.org/)

### TopoJSON

後來**TopoJSON**可以算是**GeoJson**的改良版，由於我們在地圖的繪製過程當中像是縣市與縣市的交界或是省份與省份的交界是共用邊，因此提出了容量更小的一種格式，另外此種格式也是D3js作者Mike Bostock所發明的格式(但是在D3Js使用時候必須轉換成geojson)


## 地圖投影法 


### 麥卡托投影法
一般我們都是使用**麥卡托投影**方式，依據維基百科的說明是法蘭德斯出身的地理學家傑**拉杜斯·麥卡托**發表的一種投影法，可以使的投影後的**角度**和形狀不變，但是會使**面積產生變形**，靠近南極和北極的區域看起來會變得很大。據說早期的Google Map也不是使用麥卡托投影方式，但是由於接近極區的地圖會有角度上的偏差，他們認為大多數的使用者都需要看街道圖，如果街道圖形變形嚴重的話對他們來說十分不便利。因此後來Google的採用讓其他做Map系統的提供商也跟進。


> [GoogleHelp](https://support.google.com/maps/forum/AAAAQuUrST8A2ygEJ5eG-o/?hl=en&gpf=%23!topic%2Fmaps%2FA2ygEJ5eG-o)
> 
> [Web地圖—麥卡托投影法](https://zh.wikipedia.org/wiki/Web%E5%A2%A8%E5%8D%A1%E6%89%98%E6%8A%95%E5%BD%B1)
> 
> [麥卡托投影法Wiki](https://zh.wikipedia.org/wiki/%E9%BA%A5%E5%8D%A1%E6%89%98%E6%8A%95%E5%BD%B1%E6%B3%95)

如官方API文件的圖片

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210930_02.png)
> 
> [麥卡托投影法D3官方API](https://github.com/d3/d3-geo-projection#geoMercator)

但是其實這會導致容易形成印象是極區的土地面積比起赤道附近的土地面積來的大，例如實際上**非洲是格陵蘭的面積十四倍大**，但是在麥卡托投影法底下觀看卻看起來一樣大。

有興趣的讀者可以到以下的網站玩玩看各個國家的土地面積拉到赤道或者極區附近的話會變得如何呢？
> [The true size of](https://thetruesize.com/)


### Equal Earth投影

如果期望面積看起來與原始地球的樣貌差異不大的話，可以參考Equal Earth投影，啟發於羅賓森投影(**Robinson projection**)的改良版，在2018年發表，算是比較新的一種投影方式，D3內函式也包含了此種投影法則

官方API文件展示的圖片如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210930_03.png)


> [Equal-Earth投影D3官方API](https://github.com/d3/d3-geo/blob/v3.0.1/README.md#equal-earth)

## 小總結

以上說明了簡單說明地圖的基礎知識，對於資料視覺化來說假使我們擁有一系列的資料包含經緯度的話我們可以做透過D3JS畫出地圖，然後在地圖上面標示各種資料，例如就像你在Google Map上面的標記。另外一個知識點像是如果想要呈現關於人口和面積的地理資訊圖表的時候，也許你該選擇的投影方式是等面積類型的投影法則比麥卡托投影法來的好，反之如果你要呈現的資料包含方位或是讓使用者導覽路線的話，或許運用古時候航海圖所常用的麥卡托投影法是一個好選擇。

另外官方還有其他種類型的投影方式，也在API文件有附上圖片，可以至以下連結到參考官方API文件

> [D3-geo官方API文件](https://github.com/d3/d3-geo/blob/v3.0.1/README.md#projections)
> 

