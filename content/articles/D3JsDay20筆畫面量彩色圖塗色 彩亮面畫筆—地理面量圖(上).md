---
title: D3JsDay20筆畫面量彩色圖塗色 彩亮面畫筆—地理面量圖(上)
slug: 2021-10-05T04:07:38.000Z
date: 2021-10-05T04:07:38.000Z
tags: ["D3.js","GeoJSON","Javascript"]
---

## 面量圖介紹
面量圖又稱分層設色圖、區域密度圖、(Choropleth map)，高中地理課本的說明是在界限明確的區域平均分布的地理現象以色彩或網紋來代表其數量大小，例如台北市的人口數用某個顏色代表，並且在台北市的地圖區域範圍呈現出該顏色。
以下圖片為範例
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_01.png)
> 圖片取自維基百科
> 更多知識點可以參考維基百科[Choropleth map Wiki](https://en.wikipedia.org/wiki/Choropleth_map)(英文)


## 下載原始資料
這次範例預計實作一個臺南市的面量圖，每個區的顏色表示該平均土地房屋的價格高低，因此我們要先有地圖資料和房屋土地的價格資料

我們用的資料是實價登錄網因此先到該[網址](https://plvr.land.moi.gov.tw/DownloadOpenData)找非本期下載如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_02.png)

預計使用109第四期的臺南市CSV資料如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_03.png)

[鄉鎮市區界線(TWD97經緯度)](https://data.gov.tw/dataset/7441)
[實價登路的網址 ](https://plvr.land.moi.gov.tw/DownloadOpenData)


## 加入dbf作為geojson的properties屬性
我們將製作台南市
由於dbf含有地圖區域的資料，因此這次我們到[mapshaper](https://mapshaper.org/)的網站添加shp副檔名之外還有添加dbf資料以便之後要進行資料篩選的時候把台南市給選取起來
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_04.png)

之後步驟與先前一樣輸出成topojson格式，再使用d3.json把引入的資料轉換成geojson的格式後使用consolo.log可以發現這時候properites的欄位多了欄位

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_05.png)

如上圖我們可以先看console.log(geojson)能夠發現每個陣列底下的properites都有正確被載入，裡面包含了縣市名稱、鄉鎮市名稱和英文名字等等的資訊，因此可以篩選COUNTYNAME為臺南市，然後重新組合成一個陣列來當作預備繪製我們台南市地圖的geojson資料
具體程式碼如下
## 設置地圖中心點和投影
與先前一樣設置地圖中心點和投影轉換函式
程式碼如下
```javascript{numberLines: true}
let width = 1200;
let height = 675;
const projection = d3.geoMercator()
    .center([120.24,23.18 ])
    .scale(50000);
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
let path = d3.geoPath()
    .projection(projection);
const g = svg.append("g");
d3.json("taiwanDistrict.json")
.then(function(topology) {
    const geojson =  topojson
                .feature(topology, topology.objects.TOWN_MOI_1100415)
                .features;
    console.log(geojson);}
    )
```
## 篩選縣市做為新的geojson資料
```javascript{numberLines: true}
const tainanGeojson = [];
geojson.forEach(function(el) {
    if(el.properties.COUNTYNAME=="臺南市"){
        tainanGeojson.push(el);
    }
})
console.log(tainanGeojson);
```
我們先建立一個陣列叫做tainanGeojson，然後對原本轉換完的geojson遍歷然後把元素裡面的properties.COUNTYNAME臺南市給添加到tainanGeojson的陣列裡面最後
這時候可以用console.log檢查裡面的東西是不是都為臺南市

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_06.png)

如上圖裡面的properties內容物都是臺南市的資料，另外臺南市的行政區有37個，因此對應到陣列個數剛好也是37筆。


## 載入土地房屋資料
```javascript{numberLines: true}
  d3.csv("taiwan109s4.csv")
            .then(function(csvData){
                console.log(csvData);
            }
```
接下來我們再載入109年第四季台南的土地資料，使用console.log可以看到有八千多筆的資料有如期的被正確載入如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_07.png)


## 分類區域—d3.group群組化
這邊可以使用d3的一個API叫做group先行群組化，我們將用行政區來分組
具體說明可以看到官方API文件的範例group的第一個參數帶入該陣列，第二個參數可以是一個function此時的d參數是陣列裡面的資料，使用callback函式的方式把你要依據的分組方式給對應出來，官方的範例是取陣列中的資料key是name的值
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_08.png)

另外官方網站有提到關於group轉換後的是InternMap的資料類型
，簡單的說他轉換後的資料會變成像是Map的資料格式，但比原生的Javascript又多了一些功能其說明可以參考下面

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_09.png)


> [Interning介紹](https://github.com/d3/d3-array/blob/v3.0.4/README.md#interning)
> [d3.group官方API](https://github.com/d3/d3-array/blob/v3.0.4/README.md#group)

因此撰寫程式碼如下


```javascript{numberLines: true}
 d3.csv("taiwan109s4.csv")
.then(function(csvData){
    console.log(csvData);
    const districtMap = d3.group(csvData, d => d["鄉鎮市區"]);
    console.log(districtMap);
```

轉換完畢就可以使用使用console可以看到如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_10.png)
## 新增geojson的properties欄位
我們希望新增一個資料欄位是房屋土地的平均價格以便之後再進行繪製地圖的時候可以使用d3的data()函式得到該筆資料，由於資料有8千多筆，這裡也會使用到d3內建計算統計的mean()函式這裡先簡單說明一下

### d3.mean()計算平均數
官方提到可以計算陣列裡面的平均數，另外也可以輸入一個函式來指定要訪問陣列的元素裡，物件的某一個屬性。
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_11.png)

官方範例如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_12.png)

> [d3.mean()](https://github.com/d3/d3-array/blob/v3.0.4/README.md#mean)

因此我們帶入回原始資料，程式碼如下
```javascript{numberLines: true}
tainanGeojson.forEach(function(el){
    for (let [key, value] of districtMap) {
        if(key===el.properties.TOWNNAME){
            el.properties.HOUSEPRICE= d3.mean(value, d=>d["單價元平方公尺"]);
        }
    }
});
```

這邊主要先遍歷整個**tainanGeojson**的**geojson**，每次執行到某個台南市行政區域的時候再使用`for of` 遍歷整個map，在裡面的大括號判斷如果**districtMap**的**key**和**tainanGeojson**元素的**properties.TOWNNAM**一樣的話就把districtMap的value透過d3.mean這個方法再遍歷得出平均值存入geojson該行政區的properties的HOUSEPRICE屬性裡面。

如果看不懂的話可以看下圖理解

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211005_13.png)

不熟for of 可以參考MDN
> [for of的MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)
> 

## 小總結
今天主要先做資料預處理，先將shp和dbf轉成topojson後轉成geojson，將其台南市的geojson過濾出來並加入行政區的[單位元平方公尺]的平均值至該properties，透過網路中得到的資料做資料預處理幾乎是不可避免的情況，很少的情況是拿到資料剛好完全符合你所需要的內容，例如某一類的平均值又或者沒有多餘的資料，即便是拿到一份報表也可能擁有產品編號、成本、售價、分類、進口商等等，也許你僅需要某個分類的成本和售價製作成圖表也是需要進行資料預處理，今天額外補充了兩個函式d3.mean()和d3.group()，明天將會開始著手繪圖並且加入一些動畫效果吸引閱聽人的目光。

