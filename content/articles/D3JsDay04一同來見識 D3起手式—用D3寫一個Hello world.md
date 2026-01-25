---
title: D3JsDay04一同來見識 D3起手式—用D3寫一個Hello world
slug: 2021-09-19T05:52:54.000Z
date: 2021-09-19T05:52:54.000Z
tags: ["D3.js","Javascript"]
---

## 如何開始 D3js

### 方法一 使用 CDN

請 google 搜尋 D3Js 到 D3Js 的官方網站。
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210919_01.jpg)
滑鼠滾輪到下方處
複製<font color="blue">`<script src="https://d3js.org/d3.v7.min.js"></script>`</font>
[D3Js 官方網站](https://d3js.org/)

```html{numberLines: true}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</head>
<body>
</body>
</html>
```

把它複製貼到你的 HTML 頁面就可以了

### 方法二 去官方網站下載壓縮檔

另外也可以在下方<font color="blue">`d3-7.0.1.tgz`</font>下載
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210919_02.jpg)

解壓縮之後會看到如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210919_03.jpg)

到<font color="blue">`dist`</font>的資料夾
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210919_04.jpg)

把<b>d3.js</b>或者<b>d3.min.js</b>擇一複製到你的專案資料夾底下就可以了

### 方法三 npm install d3

有用<font color="red">`npm`</font>(node 套件包管理工具)的人也可以使用<font color="red">`npm install d3`</font>就會自動下載 d3 的資源包了。

#### 檢測是否有安裝成功

使用開發者人員工具的 console 欄位鍵入<font color="red">`d3.version`</font>
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210919_05.jpg)

#### 第一個 d3

有用過 jQuery 的人起手式大概很熟悉的是$字號做開頭，d3 是類似的方式，使用 d3 來做開頭後續使用<font color="red">`方法鏈(method chain)`</font>的方式來實作每個步驟。

先直接看以下程式碼

```javascript{numberLines: true}
<script>
  d3.select("body").append("div");
</script>
```

可以看到先選擇了<font color="red">`body`</font>這個 tag，然後在裡面插入<font color="red">`div`</font>，於是打開開發者人員工具

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210919_06.jpg)

在底下插入了一個<font color="red">`div`</font>
這邊語法講解<font color="red">`select()`</font>是選到<b>第一個</b>出現的元素
然後<font color="red">`append()`</font>是插入一個元素，換句話說如果我們選擇的元素有兩個一樣，只會選到第一個元素參見以下程式碼

```html{numberLines: true}
<div class="hello">
</div>
<div class="hello">
</div>
<script>
  d3.select(".hello").append("div");
</script>
```

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210919_07.jpg)
這個時候打開開發者人員工具會發現<font color="red">只有</font><b>第一個</b><font color="red">`class`</font>名為<b>hello</b>的底下有插入<font color="red">`div`</font>這個元素
因此如果想要選取多個元素要改用<font color="red">`selectAll()`</font>來選取多個元素

程式碼變成以下

```html{numberLines: true}
d3.selectAll(".hello").append("div");
```

當打開開發者人員工具就可以發現成功插入兩個 div 元素了。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210919_08.jpg)

接下來我們要在新增的<font color="red">`div`</font>底下插入文字

```html{numberLines: true}
 d3.select("body").append("div").text("Helo world");
```

畫面就會出現如下面

## ![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210919_09.jpg)

以上介紹如何安裝 D3 和撰寫一個 Hello World 下一篇將會使用 D3 來畫出一些簡單的圖表

參考 API 文件說明

[API 文件參考 select()](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#select)
[API 文件參考 append()](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_append)
[API 文件參考 selectAll()](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_selectAll)
[API 文件參考 text()](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_text)
