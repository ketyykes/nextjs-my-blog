---
title: D3JsDay11 觀測時候別鐵齒，拿出你的比例尺。
slug: 2021-09-26T12:10:54.000Z
date: 2021-09-26T12:10:54.000Z
tags: ["D3.js","Javascript"]
---

想像一下假設今天你的資料的數字是如此龐大，而電腦螢幕的寬和高卻是有限的情況之下，不可能以1個人口對應1個螢幕的高或是寬，例如我們的資料是各個國家的人口數，例如台灣兩千三百萬的數字、美國三億多、日本一億多、加拿大三千多萬，當我們的資料的數字是如此龐大的情況，想要製作長條圖，不太可能是div有4億px的height或是svg的width設定成兩千三百萬，因此我們勢必得進行資料轉換，將這些數字轉換對應到我們螢幕上的寬、高。


## d3.scaleLinear()線性比例轉換
 首先先使用<font color="red">`d3.scaleLinear()`</font>來創造一個線性比例尺，並且由<font color="red">`domain()`</font>定義原始輸入的範圍，再由<font color="red">`range()`</font>定義一個輸出後的範圍。例如我們一公里等於一千公尺，因此我們可以設定如下的程式碼。
 ```javascript{numberLines: true}
let Km_Transform_M = d3.scaleLinear().domain([0,1]).range([0,1000]);
console.log(Km_Transform_M(1.35));
```
這時候我們將值1.35帶入之後就會看到轉換後的數字

當然我們甚至也可以拿來做溫度的轉換，由於華氏和攝氏溫度也是線性關係，因此我們方程式改成如下
```javascript{numberLines: true}
  let temC_Transform_temF  = d3.scaleLinear().domain([0,100]).range([32,212]);
  console.log(temC_Transform_temF(30));
```
這時候你就可以告訴大家我用d3Js的資料視覺化套件可以做出溫度轉換了 ~~(其他人表示：???)~~
我們也可以引用國中y=ax+b 學到的一元二次方程式理解這段程式碼，x代入0、y帶入32和x帶入100、y代入212解二元一次聯立方程式的a和b就可以知道這個線性轉換方程式了，當然這些並不是這一章節主要的內容，以上只是幫助你理解整個程式碼的運作。
## clamp()函式
clamp翻成中文有夾住、強制執行等等的意思，你可以想像一下原本資料進行轉換的時候我們設定<font color="red">`range()`</font>是0到1000正常來說他會依比例進行轉換，也就是說如果輸入1.35會轉換成1350的數字，但是我們的<font color="red">`range`</font>設定的是1000**卻超出範圍**了，因此可以使用這個函式， clamp()可以比喻成把資料夾住在這個範圍裏面或是強制執行在這個範圍裏面此時，當你輸入的值轉換後超出range的最大值的時候，將會**一律以最大值呈現**，參見以下程式碼

```javascript{numberLines: true}
let Km_Transform_M = d3.scaleLinear()
                      .domain([0,1])
                      .range([0,1000])
                      .clamp(true);
                      
console.log(Km_Transform_M(12));
```
<font color="red">`clamp()`</font>的參數需帶入布林值<font color="red">`true`</font>或是<font color="red">`false`</font>，如果設置true之後超過的部分將會以最大值來呈現。以剛剛的例子
這時候只要你輸入超過1的數字，轉換後的數字都會是最大值1000，如果未設定的情況下，表示預設是false，這個函式的作用可以用來避免畫出來的圖形超出你預期的空間。


接下來我會嘗試著匯入真實的資料畫出長條圖，這邊的資料用政府開放平台的人口資料參見以下網址
> [政府開放平台資料各鄉鎮人口密度](https://data.gov.tw/dataset/8410)

這邊先將109年的資料下載下來，之後和**html**檔案與**json**檔案放在同一個資料夾並且改名成**populationDensity.json**以便比較好識別，由於預計僅畫出台北市的資料所以這邊接完的資料先進行<font color="red">`資料前處理`</font>以便操作，這邊實際畫出圖表會使用<font color="red">`箭頭函式`</font>來簡化撰寫

第一個then所包含的是將主要的各個鄉鎮內容的陣列取出

第二個then是透過<font color="red">`正則表達式(regular expression 
literal)`</font>來過濾資料，把符合正則規則的資料篩選出來

最後一個then處理人口密度、人口總數、鄉鎮市的面積，由於原始資料的內容是字串，這邊使用Number()將它轉型成數字<font color="orange">`site_id`</font>資料內容是臺北市大安區、臺北市士林區，每筆資料內容都包含了<font color="blue">`"臺北市"`</font>，因此希望能夠簡化它，所以將取第四個字開始，長條圖的<font color="orange">`bar`</font>預計留<font color="orange">`50`</font>給之後要放各個區文字的空間，因此先**padding**設定<font color="orange">`50`</font>

### 小補充
如果對於箭頭函式和正則表達式不熟的人可以參考
> [箭頭函式MDN介紹](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
> [正規表達式MDN介紹](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Regular_Expressions)
> [Number()MDN函式介紹](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Number#%E8%BD%89%E6%8F%9B%E6%95%B8%E5%80%BC%E5%AD%97%E4%B8%B2%E6%88%90%E6%95%B8%E5%80%BC)


```javascript{numberLines: true}
d3.json("populationDensity.json")
  .then((data) => {
    return data.result.records;
  })
  .then((data) => {
    const reg = RegExp(/臺北市/);
    return data.filter((el) => {
      return reg.test(el.site_id);
    });
  })
  .then((taipei) => {
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
    });
```

## 繪製比例尺常用的函式min() max()
由於繪製比例尺的時候我們往往不太知道要設<font color="orange">`domain`</font>為多少，所以我們通常必須先知道所有資料當中**最大值**和**最小值**來構想預計要從多少來縮放比例，這邊資料只有十二筆雖然用眼睛稍微掃描一下就可以得知資料最大和最小值是誰，但是如果當資料上萬筆的時候不太可能用這方式來找出來，d3也提供了一些函式來處理這個問題以下作介紹

<font color="red">`min()`</font>函式帶入兩個參數，第一個參數帶入陣列，如果陣列內容是一個物件的話可以帶入第二個參數，參數內容是函式可以撰寫你要篩選的資料是什麼，這邊就以下範例
```javascript{numberLines: true}
let min = d3.min(newTaipei, (d) => d.people_total);
let max = d3.max(newTaipei, (d) => d.people_total);
console.log(max);
```

<font color="red">`max()`</font>和<font color="red">`min()`</font>大同小異，這邊不多述，另外值得一提的地方官方文件內有提到不像Math.min，如果資料當中有一些null或者underfined和NaN的時候將會自動忽略，這對資料遺失時候的情況十分有用。


![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210926_01.png)

[d3官方API Min()](https://github.com/d3/d3-array/blob/v3.0.2/README.md#min)

接下來我們得到最大值<font color="orange">`302644`</font>和最小值是<font color="orange">`118758`</font>，因此我們設置大小如下

至於為什麼<font color="red">`range()`</font>要使用<font color="orange">`400`</font>到<font color="orange">`0`</font>的關係，之後下個章節在介紹座標軸的時候會提到原因。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210926_02.png)
```javascript{numberLines: true}
let scaleY = d3
  .scaleLinear()
  .domain([0, 320000])
  .range([400, 0]);
```

## 繪製長條
接下來我們將會畫出長方形來作為資料的大小值程式碼如下
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
接下來你應該會看到如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210926_03.png)

我們將資料放入<font color="red">`rect`</font>當中之後的<font color="red">`x`</font>起始點先加入<font color="orange">`padding`</font>往右移，然後根據索引值再繪製出每個<font color="red">`rect`</font>長方形的時候再向右移<font color="orange">`60`</font>來當作起始點，而y的部分使用剛剛所做的<font color="red">`scaleY()`</font>函式來進行資料的轉換，轉換的數值設為<font color="orange">`y`</font>的起始點，接下來寬設定<font color="orange">`50`</font>，x當時是根據索引值<font color="orange">`i`</font>設置<font color="orange">`60`</font>當起始點，而長方形的寬是設置50所以他們之間的間距自然而然就是<font color="orange">`60-50=10`</font>，最後再渲染出高的時候是使用<font color="red">`400-scaleY(d.people_total)`</font>，因為剛剛的<font color="red">`scaleY`</font>的<font color="red">`range()`</font>起始是<font color="orange">`400`</font>結束點是<font color="orange">`0`</font>所以原先的資料越大轉換之後的數字越小，所以使用400減去它，自然而然就可以表示原始資料所對應的大小了，最後我們填充橘色作為這個長條圖的顏色。

## 繪製鄉鎮區的名稱
接下來我們將各個鄉鎮區帶入，一樣先選取整個<font color="red">`text`</font>然後將資料給放入，裡面使用函式參數來return 鄉鎮區的字串，為了對齊剛剛所製成的長條圖，決定<font color="orange">`x`</font>起始點位置和長條圖的內容將會是一樣，最後減去<font color="orange">`20`</font>的原因是為了讓它更靠近長條圖，使間距縮小。

```javascript{numberLines: true}
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
```

完整程式碼如下

```javascript{numberLines: true}
d3.json("populationDensity.json")
.then((data) => {
    return data.result.records;
})
.then((data) => {
  let reg = RegExp(/臺北市/);
  return data.filter((el) => {
      return reg.test(el.site_id);
  });
})
.then((taipei) => {
  const newTaipei = taipei.map((el) => {
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

  const scaleY = d3
  .scaleLinear()
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
})
```

最後完成如圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210926_04.png)


