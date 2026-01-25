---
title: D3JsDay30Not only MordernWeb,But also Data Club—閱讀建議、文章索引、結語
slug: 2021-10-15T13:31:00.000Z
date: 2021-10-15T13:31:00.000Z
tags: ["D3.js","Javascript"]
---

## 繪製自己鐵人賽文章資料所構成的圖表
最後一天就來做個本次文章系列的總結吧，我用puppteer爬取了我前29天的文章字數，帶入d3呈現了視覺化圖表如下圖!

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211015_01.png)

這邊附上一些先前沒用過的函式的程式碼簡單講解一下
```javascript{numberLines: true}
let firstDay = Date.parse(sortByDate[0].postTime);
let lastDay = Date.parse(sortByDate[sortByDate.length-1].postTime); //轉換從1970-1-1 00:00:00 UTC到該時間的毫秒數
const scaleX  = d3.scaleTime().domain([firstDay,lastDay]).range([0,1200]).nice(); //建立以時間構成的比例尺，裡面的值須帶入1970-1-1 00:00:00UTC到該時間的毫秒數
const axisX =  d3.axisBottom(scaleX).tickFormat(d3.timeFormat("%Y-%m-%d")).ticks(40).tickSize(-600); //timeFormate轉換日期顯示的樣式
```


另外計算了一些統計常用的數據
```javascript{numberLines: true}
let variance = Math.round(d3.variance(sortByDate,d=>(d.articleStrNum)*100))/100; //回傳變異數並且四捨五入到小數第二位
let deviation = Math.round(d3.deviation(sortByDate,d=>(d.articleStrNum)*100))/100;//回傳標準差並且四捨五入到小數第二位
```
至於這張圖表剩下的程式碼呢？~~想要我的程式碼嗎？想要的話可以全部給你，去找吧！我把所有的程式碼都放在前面二十九天了。(某卡通經典台詞)~~，希望前二十九天的幫助，你也可以實作剩下的程式碼。

## 章節回顧與心得

這次會挑選這個主題主要是因為平常都是觀看其他人撰寫的部落格或者文章來吸收程式的知識，而D3JS網路上中文的資源比較少加上有些說明的版本也比較舊，函式的寫法已經有所更新，所以才撰寫這次的文章，雖然自己目前的程式碼也還有許多進步空間，但希望還是能帶給閱讀我文章的人一點什麼。

在入門篇的部分從安裝到寫程式以及關鍵字Highlight，另外附上許多MDN的連結，希望給Javascript不夠熟悉的人也可以在臨時需要的時候補充知識，另外也從中一起試錯、附上d3官方API說明和console.log()各種方法後的結果，希望能讓大家感受到彷彿像我在學習這個函式庫的時候一樣再觀看官方文件，進階篇的撰寫部分講解部分可能會比較迅速，適合對Javascript有一定基礎或入門篇弄熟的人觀看，最後特別篇希望帶到一下資料獲取和統計的部分，才能構成整個資料視覺化的要素，畢竟`數字本身沒有意義，數字的意義來自於人們賦予意義，統計的意義也不是數字本身，而是理解統計背後的含意`。

~~最後講一個不重要的事情，我運用了回文、英文和中文押韻完成了三十天的標題OhYA，每次想標題要押韻和Match都得花上一段時間~~

以下附上表格和連結作為閱讀建議和文章綱要

| 文章               | 概要                       |
| ------------------ | -------------------------- |
| Day1~Day2          | D3、資料視覺化簡介         |
| Day3~Day12         | D3核心(入門篇)             |
| Day13~Day14        | D3動畫、事件(進階篇)       |
| Day15~Day21        | D3繪製地圖(進階篇)         |
| Day22~Day27、Day29 | 圖表製作教學及範例(進階篇) |
| Day28~Day29        | 擷取資料(特別篇)           |


## D3、資料視覺化簡介
[Day01 資料視覺化 圖表說說話—介紹篇](https://ithelp.ithome.com.tw/articles/10265231)
[Day02 學學D3JS 技能提高SSS—為什麼D3](https://ithelp.ithome.com.tw/articles/10266099)
## 入門篇
[Day03可縮放向量圖型 不用怕圖片不行—SVG簡介](https://ithelp.ithome.com.tw/articles/10266952)
[Day04一同來見識 D3起手式—用D3寫Helloworld](https://ithelp.ithome.com.tw/articles/10267374)
[Day05Bar拉BarBarBar，作伙來畫吧—畫個bar chart長條圖](https://ithelp.ithome.com.tw/articles/10268424)
[Day06這包什麼餡，原來是折線—繪製折線圖](https://ithelp.ithome.com.tw/articles/10269143)
[Day07不懂資料格式，那就會我們曾相識，只是不合適—檔案格式介紹](https://ithelp.ithome.com.tw/articles/10269757)
[Day08做為視覺化圖表的燃料，從網路擷取檔案的資料—fetch Data](https://ithelp.ithome.com.tw/articles/10270548)
[Day09 資料元素來綁定，讓你元素有內定—資料綁定](https://ithelp.ithome.com.tw/articles/10271215)
[Day10 遇到元素資料不相等，用函式解決高人一等](https://ithelp.ithome.com.tw/articles/10271954)
[Day11 觀測時候別鐵齒，拿出你的比例尺](https://ithelp.ithome.com.tw/articles/10272615)
[Day12完成製作的壓軸，畫出圖表座標軸](https://ithelp.ithome.com.tw/articles/10273251)
## 進階篇
### D3動畫、事件
[Day13 讓資料擁有過渡動畫，讓各位觀眾看見神話—過渡動畫](https://ithelp.ithome.com.tw/articles/10273867)
[Day14不想圖表被冰凍，那就做一點互動—事件互動](https://ithelp.ithome.com.tw/articles/10274553)
### D3繪製地圖
[Day15 了解WEB地圖學，先懂一點地理學—web地圖的科學](https://ithelp.ithome.com.tw/articles/10275129)
[Day16 It's map birth,It's from path—生成地圖](https://ithelp.ithome.com.tw/articles/10275786)
[Day17 Fill the color,Zoom in on center—地圖各項操作及填色](https://ithelp.ithome.com.tw/articles/10276314)
[Day18 不讓資料進墳墓，秒懂農產品分布—實際資料畫地圖](https://ithelp.ithome.com.tw/articles/10276882)
[Day19 地圖加入了事件，地點資料就呈現—為地圖加入互動事件](https://ithelp.ithome.com.tw/articles/10277317)
[Day20筆畫面量彩色圖塗色 彩亮面畫筆—地理面量圖(上)](https://ithelp.ithome.com.tw/articles/10277812)
[Day21筆畫面量彩色圖，塗色彩亮面畫筆—地理面量圖(下)](https://ithelp.ithome.com.tw/articles/10278303)
### 圖表製作教學及範例
[Day22給我兩個以上的變數，給你呈現資料的散佈—散佈圖](https://ithelp.ithome.com.tw/articles/10278770)
[Day23 三槍俠的電磁砲，三個變數的氣泡—氣泡圖(上)](https://ithelp.ithome.com.tw/articles/10279062)
[Day24 三槍俠的電磁砲，三個變數的氣泡—氣泡圖(下)](https://ithelp.ithome.com.tw/articles/10279625)
[Day25圈圈圓圓圈圈，甜甜黏黏甜甜—圓餅圖與環圈圖](https://ithelp.ithome.com.tw/articles/10280156)
[Day26圓圈圖的實戰力，直轄市人口比例-帶入真實資料做圓圈圖](https://ithelp.ithome.com.tw/articles/10280477)
[Day27What's the tree?Let me see—樹狀圖(tree diagram)](https://ithelp.ithome.com.tw/articles/10280825)
[(特別篇)統計學的陷阱區，用資料繪製盒鬚—爬蟲D3做成D3(下)](https://ithelp.ithome.com.tw/articles/10281613)

## 擷取資料(特別篇)
[Documents-Delivered-Data,Data-DrivenDocuments—爬蟲D3做成D3(上)](https://ithelp.ithome.com.tw/articles/10281245)
[統計學的陷阱區，用資料繪製盒鬚—爬蟲D3做成D3(下)](https://ithelp.ithome.com.tw/articles/10281613)



---

## D3函式索引

這邊也附上索引值來方便大家查看，如果對於某些函式忘記如何使用，我這邊已經整理好第一次被使用到該函式或是有撰寫該函式說明的文章都呈現在下方表格了。

|                                                            d3API                                                             | 文章名稱                                                                                                     |
| :--------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------- |
|                                `select()、selectAll()、selection.append()、selection.text()`                                 | [Day04一同來見識 D3起手式—用D3寫Helloworld](https://ithelp.ithome.com.tw/articles/10267374)                  |
|                                                     ` selection.attr()`                                                      | [Day05Bar拉BarBarBar，作伙來畫吧—畫個bar chart長條圖](https://ithelp.ithome.com.tw/articles/10268424)        |
|                                                     `selection.style()`                                                      | [Day06這包什麼餡，原來是折線—繪製折線圖](https://ithelp.ithome.com.tw/articles/10269143)                     |
|                              `d3.text()、d3.json()、d3.csv()、d3.dsv()、d3.image()、d3.html()`                               | [Day08做為視覺化圖表的燃料，從網路擷取檔案的資料—fetch Data](https://ithelp.ithome.com.tw/articles/10270548) |
|                                           `selection.data()、selection.datum()、`                                            | [Day09 資料元素來綁定，讓你元素有內定—資料綁定](https://ithelp.ithome.com.tw/articles/10271215)              |
|                                    `selection.enter()、selection.exit()、 selection.join`                                    | [Day10遇到元素資料不相等，用函式解決高人一等](https://ithelp.ithome.com.tw/articles/10271954)                |
|              `d3.scaleLinear()、continuous.clamp、d3.max()、d3.min()、continuous.domain()、continuous.range() `              | [Day11 觀測時候別鐵齒，拿出你的比例尺](https://ithelp.ithome.com.tw/articles/10272615)                       |
|                 `d3.axisTop()、d3.axisRight、d3.axisBottom、d3.axisLeft()、axis.ticks()、axis.tickFormat()`                  | [Day12完成製作的壓軸，畫出圖表座標軸](https://ithelp.ithome.com.tw/articles/10273251)                        |
|   `selection.transition()、transition.attr()、transition.delay()、transition.duration()、d3.easeLinear()、d3.easePolyIn()`   | [Day13 讓資料擁有過渡動畫，讓各位觀眾看見神話—過渡動畫](https://ithelp.ithome.com.tw/articles/10273867)      |
|                                     `selection.on()、d3.randomInt()、selection.remove()`                                     | [Day14不想圖表被冰凍，那就做一點互動—事件互動](https://ithelp.ithome.com.tw/articles/10274553)               |
|                       `geoEqualEarth()、geoPath()、d3.geoMercator()、projection()、topojson.feature()`                       | [Day16 It's map birth,It's from path—生成地圖](https://ithelp.ithome.com.tw/articles/10272615)               |
| `d3.scaleSequential()、d3.hsl()、color.formatRgb()、projection.center()、projection.rotate()、projection.scale()、d3.zoom()` | [Day17 Fill the color,Zoom in on center—地圖各項操作及填色](https://ithelp.ithome.com.tw/articles/10276314)  |
|                                                     `selection.html()、`                                                     | [Day19 地圖加入了事件，地點資料就呈現—為地圖加入互動事件](https://ithelp.ithome.com.tw/articles/10277317)    |
|                                                   `d3.group()、d3.mean()`                                                    | [Day20筆畫面量彩色圖塗色 彩亮面畫筆—地理面量圖(上)](https://ithelp.ithome.com.tw/articles/10277812)          |
|                                        `d3.interpolateRdYlGn()、d3.scaleSequential()`                                        | [Day21筆畫面量彩色圖，塗色彩亮面畫筆—地理面量圖(下)](https://ithelp.ithome.com.tw/articles/10278303)         |
|                                        `tickSize()、tickSizeOuter()、tickSizeInner()`                                        | [Day22給我兩個以上的變數，給你呈現資料的散佈—散佈圖](https://ithelp.ithome.com.tw/articles/10278770)         |
|                                             `selection.node()、selection.call()`                                             | [Day23 三槍俠的電磁砲，三個變數的氣泡—氣泡圖(上)](https://ithelp.ithome.com.tw/articles/10279062)            |
|       `d3.arc()、arc.innerRadius()、arc.outerRadius()、arc.startAngle()、arc.endAngle()、arc.cornerRadius()、d3.pie()`       | [Day25圈圈圓圓圈圈，甜甜黏黏甜甜—圓餅圖與環圈圖](https://ithelp.ithome.com.tw/articles/10280156)             |
|                                `d3.pie().value()、d3.schemeTableau10、transition.attrTween()`                                | [Day26圓圈圖的實戰力，直轄市人口比例-帶入真實資料做圓圈圖](https://ithelp.ithome.com.tw/articles/10280477)   |
|      `d3.hierarchy()、node.links()、d3.tree()、tree.size()、node.descendants()、d3.linkVertical、d3.linkHorizontal()、`      | [Day27What's the tree?Let me see—樹狀圖(tree diagram)](https://ithelp.ithome.com.tw/articles/10280825)       |
|                                                     `continuous.nice()`                                                      | [統計學的陷阱區，用資料繪製盒鬚—爬蟲D3做成D3(下)](https://ithelp.ithome.com.tw/articles/10281613)            |


## 感謝與結語

最後感謝好想工作室夥伴們給我文章撰寫範例的靈感，~~還有感謝他們聽我講幹話給我歡樂的動力持續寫文XD~~還有感謝我在理解函式過程當中，國內外撰寫過D3Js文章的Bloger們。
另外要說的是D3Js是一個龐大的函式庫，我介紹到的部分僅是核心的DataBinding和冰山一角的常用圖表繪製，D3函式庫還可以繪製的圖表包括但不限於力圖、泡泡圖、TreeMap、AreaChart還有任何你能發揮創意巧思並且運用強大D3Js客製化工具所展現的視覺畫圖表，希望藉由這系列文章旅程能~~成為我們的夥伴，一起航向偉大的航道~~帶領你成為學習的基礎，變成後續學習的要領。最後再說一次本篇文章的重點`數字本身沒有意義，數字的意義來自於人們賦予意義，統計的意義也不是數字本身，而是理解統計背後的含意`~~重點就這句而已(誤)~~，以上。