---
title: D3JsDay25圈圈圓圓圈圈，甜甜黏黏甜甜—圓餅圖與環圈圖
slug: 2021-10-10T13:15:00.000Z
date: 2021-10-10T13:15:00.000Z
tags: ["D3.js","Javascript"]
---

## 介紹
圓餅圖和環圈圖常出現在我們統計圖表當中，一般用來表示各個分類的數量所佔的百分比，由幾個扇形的圓形統計圖表，這些扇形區域合起來剛好是一個完全的圓。

## SVG使用

我們在SVG使用的時候要繪製出矩形的圖只要對笛卡爾座標的X軸和Y軸的絕對位置有一定的熟悉程度一般而言可以自行透過描述點的方式繪製出來，但是如果像是圓形或是擁有扇形區域具有曲線的線條想要憑藉著寫入點座標繪製來說相對困難許多，因此d3擁有一些圖形生成器來將一些資料給轉換成適合被svg繪製的數值，在我們繪製圓餅圖的時候會使用到Pies()和arc()這兩個函式，下一部分將會介紹這些函式的使用方式。

## arc()
官方表示這個函式主要的作用是將輸入內角和外角和開始角度和結束角度即可產生一個路徑的數值
> [d3.arc()官方文件](https://github.com/d3/d3-shape/tree/v3.0.1#arc)

具體所需要的物件如官方範例所示如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211010_01.png)

因此我們可以自己嘗試看看撰寫如下程式碼，與官方不同的地方是我們 endAngle帶入2π也就是360度的意思
```javascript{numberLines: true}
const arc = d3.arc();
const obj = {innerRadius: 0,
            outerRadius: 100,
            startAngle: 0,
            endAngle: 2*Math.PI}
console.log(arc(obj));
```
這時候我們console.log()會得到一串數值如下
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211010_02.png)
是否覺得似曾相識，這些數值和英文字母組成是我們先前介紹svg的path的時候所需要的內容，因此我們嘗試著將這個數值複製起來撰寫到html的svg裡面的path中程式碼如下
```html{numberLines: true}
<svg width="400" height="400">
    <path d="M6.123233995736766e-15,-100A100,100,0,1,1,-6.123233995736766e-15,100A100,100,0,1,1,6.123233995736766e-15,-100Z"></path>
</svg>
```

這時候應當會看到如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211010_03.png)
由於他所繪製的以(0,0為中心)，因此我們通常都會使用transform的translate來移動顯示整個圓形，因為寬和高是400，所以我們使用transform="translate(200,200)"位移，最後應當可以看到如下圖
```html{numberLines: true}
<svg width="400" height="400">
      <path transform="translate(200,200)" d="M6.123233995736766e-15,-100A100,100,0,1,1,-6.123233995736766e-15,100A100,100,0,1,1,6.123233995736766e-15,-100Z"></path>
</svg>
```
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211010_04.png)


除了可以使用物件的方式帶入進arc函式修改角度以外，也可以使用arc底下的方法鏈將角度傳入進arc函式裡面，
程式碼如下
```javascript{numberLines: true}
const arc = d3.arc().innerRadius(0).outerRadius(100).startAngle(0).endAngle(2*Math.PI);
```



| 函式           | 設置內容       |
| -------------- | -------------- |
| innerRadius()  | 圓形的內半徑   |
| outerRadius()  | 圓形的外半徑   |
| startAngle()   | 圓形起始角度   |
| endAngle()     | 圓形結束角度   |
| cornerRadius() | 圓角的邊角半徑 |

## pie函式

了解arc()帶入的內容所需要的是開始角度startAngle()和endAngle()等等的內容時，必須思考一個問題是一般我們真實的世界的資料不會有這些屬性名稱剛好對應到arc所需該怎麼辦?

因此我們需要pie()來將原始資料轉成適合arc使用的資料

官方說明提到關於這些數據可以傳遞給arc()所用
如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211010_05.png)


> [d3 Pies官方API](https://github.com/d3/d3-shape/blob/v3.0.1/README.md#pies)

接下來我們撰寫程式碼來嘗試使用pie()函式並且console.log()看看呈現什麼內容
```javascript{numberLines: true}
 const data = [1, 1, 2, 3, 5, 8, 13, 21];
const pie = d3.pie();
console.log(pie(data));
```

打開主控台可以發現他會將原本的陣列中的各個數值自動轉換成圓餅圖所需要占比的角度，換句話說是自動分配每筆數據所比例並且回傳成arc所需要的資料
如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211010_06.png)

接下來我們將開始利用這些資料進行繪圖

由於我們的pie函式幫我們轉換出來只有startAngle和endAngle，因此必須給予內圓半徑和外圓半徑的數值
這邊我們內半徑改設置50、外半徑改設置100試試看，具體程式碼如下
```javascript{numberLines: true}
const arc = d3.arc().innerRadius(50).outerRadius(100)	
```

接下來我們將著手開始繪圖，記得使用`transform:translate`位移圓的位置，與先前教過的資料綁定一樣使用data()資料綁定然後join("path")函式

這邊主要需要注意的地方是綁定的資料是剛剛進行pie函式轉換後的資料，而在繪製path的屬性d所帶的數值是使用arc轉換data的值，程式碼如下
```javascript{numberLines: true}
const width = 400;
const height = 400;
d3.select("body").append("svg").attr("width", width);
const svg = d3.select("svg").attr("width", width).attr("height", height);
const arc = d3.arc().innerRadius(50).outerRadius(100);

const data = [1, 1, 2, 3, 5, 8, 13, 21];
const pie = d3.pie();

svg.append("g")
.attr("transform", `translate(${width / 2}, ${height / 2})`)
.selectAll("path")
.data(pie(data))
.join("path")
.attr("d", (data) => arc(data))
```

將會呈現下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211010_07.png)

這時候環圈圖將如期呈現，但是每筆資料的間隙太相近了，因此我們可以加入stroke屬性並設定和背景一樣的白色，另外可以添加cornerRadius()數值觀看其呈現效果

最後完整程式碼如下
```javascript{numberLines: true}
const width = 400;
const height = 400;
d3.select("body").append("svg").attr("width", width);
const svg = d3.select("svg").attr("width", width).attr("height", height);
const arc = d3.arc().innerRadius(50).outerRadius(100).cornerRadius(5)	;
const data = [1, 1, 2, 3, 5, 8, 13, 21];
const pie = d3.pie();
svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)
    .selectAll("path")
    .data(pie(data))
    .join("path")
    .attr("d", (data) => arc(data))
    .attr("stroke", "white")
    .attr("stroke-width", "1");
```

最後應該如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20211010_08.png)

## 總結

本日介紹了arc產生器和pie產生器，要繪製圓餅圖具體步驟如下

1. 宣告一個變數來存放arc()的轉換函式並且設定內徑和外徑例如`const arc = d3.arc().innerRadius(50).outerRadius(100)`
2. 宣告一個變數來存放pie()的轉換函式用來預備將原始資料轉換給arc()使用，換句話說將原始資料轉換生成startAngle和endAngle的資料(這也是arc所需要的資料內容)
3. 在svg繪圖，綁定的資料是由pie將原始資料轉換後的數值，path屬性的d所帶入的數值是arc轉換剛剛綁定的資料
4. 依據生成圖形適當的添加stroke屬性、顏色等等

