---
title: D3JsDay08 做為視覺化圖表的燃料，從網路擷取檔案的資料—fetch Data
slug: 2021-09-23T11:25:54.000Z
date: 2021-09-23T11:25:54.000Z
tags: ["D3.js","Javascript"]
---

## 淺談原始碼

D3<font color="red">`包裝`</font>了 Javascript 的<font color="red">`fetchAPI`</font>來擷取資料我們這裡可以看到 D3Js 的原始碼為以下片段，不難看出它是 return 了 fetchAPI

```javascript{numberLines: true}
function json(input, init) {
  return fetch(input, init).then(responseJson);
}
```

另外也可以參見 d3 原始碼的部分

```javascript{numberLines: true}
function dsv(delimiter, input, init, row) {
  if (arguments.length === 3 && typeof init === "function") row = init, init = undefined;
  var format = d3Dsv.dsvFormat(delimiter);
  return text(input, init).then(function(response) {
    return format.parse(response, row);
  });
}
```

從中可以理解如果沒有帶入<font color="red">`init物件`</font>參數而且第二個參數是 function 就會當作是轉換函式

<font color="red">`dsv`</font>的 API reference 說明文件下方有寫到

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210923_01.png)

> [參見 d3.dsv API reference](https://github.com/d3/d3-fetch/blob/v3.0.1/README.md#dsv)

## 常見的擷取元素

這邊以常見的擷取檔案來做簡單說明
| 函式                                    | 說明                                           |
| --------------------------------------- | ---------------------------------------------- |
| d3.text(input[, init])                  | 擷取 txt 檔案，並解析為 UTF-8 的編碼字串       |
| d3.json(input[, init])                  | 擷取 JSON 檔案並且解析之後放入物件中           |
| d3.csv(input[, init][, row])            | 擷取資源最後一個帶入的參數可以設定選用轉換函式 |
| d3.dsv(delimiter, input[, init][, row]) | 傳入一個分隔符號，最後的參數可以帶入轉換函式   |
| d3.image(input[, init])                 | 擷取資源後解析成為 HTML 的 img 元素            |
| d3.html(input[, init])                  | 擷取資源後解析成為 HTMLDocument 的元素         |

其他可以 fetch 的資料參見官方 API 說明

> [d3-fetchAPI 官方文件](https://github.com/d3/d3-fetch/tree/v3.0.1)

## 擷取資料

以下就 D3 來獲取資料，需要注意的地方是由於是開啟 URL 因此必須使用伺服器的方式請求你的檔案，例如 Visual Studio Code 的套件**LiveServer**或者使用**Apache**開啟伺服器
擷取資料方法如下

### 擷取 JSON 檔案

```javascript{numberLines: true}
const data = d3.json("populationDensity.json");
  data.then((data) => {
      console.log(data);
      return data;
  });
```

另外也可以支援使用<font color="red">`async await`</font>的方式使用，這邊接一個<font color="red">`立即函式(IIFE)`</font>來執行它

```javascript{numberLines: true}
const fn = async function (){
  const data = await d3.json("populationDensity.json");
  await console.log(data);
}();
```

### 擷取 CSV 檔案

程式碼如下

```javascript{numberLines: true}
const data = d3.csv("populationDensity.csv");
data.then((data)=>{
    console.log(data);
})
```

我們可以看到它會回傳一個陣列形式如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210923_02.png)

因此也可以使用<font color="red">`console.table`</font>來觀看
程式碼如下

```javascript{numberLines: true}
const data = d3.csv("populationDensity.csv");
data.then((data)=>{
    console.table(data);
})
```

結果就會如下圖呈現表格的形式了

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210923_03.png)

### 擷取 html

程式碼如下

```javascript{numberLines: true}
const data = d3.html("hello.html");
data.then((data)=>{
    console.log(data);
})
```

可以發現它會自動解析成**HTML**的**Element**
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210923_04.png)

### 擷取 image

程式碼如下

```javascript{numberLines: true}
const data = d3.image("test.jpg");
data.then((data)=>{
    console.log(data);
})
```

可以發現它會自動解析成**HTML**的**img**元素

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210923_05.png)

如果對於<font color="red">`Fetch`</font>的<font color="red">`init`</font>參數有興趣的話可以看製定 HTML 標準的協會所寫的 spec

> [Fetch Standard](https://fetch.spec.whatwg.org/#requestinit)

另外也可以參考 MDN 的說明文件

> [MDN 的 fetchAPI](https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API/Using_Fetch#%E4%BD%BF%E7%94%A8_fetch_%E7%99%BC%E9%80%81%E8%AB%8B%E6%B1%82_request)

以上介紹比較常見的擷取資料格式，隔天將會提到資料綁定的部分。
