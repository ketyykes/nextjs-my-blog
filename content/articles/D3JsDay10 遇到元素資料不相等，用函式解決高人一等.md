---
title: D3JsDay10 遇到元素資料不相等，用函式解決高人一等
slug: 2021-09-25T11:00:54.000Z
date: 2021-09-25T11:00:54.000Z
tags: ["D3.js","Javascript"]
---


## enter()函式—沒放入元素的資料

先看以下程式碼
```javascript{numberLines: true}
<body>
  <div></div>
  <div></div>
  <script>
    const arr = [13,6,2,34,23];
    const div = d3.select("body").selectAll("div");
    console.log(div.data(arr));
    div.data(arr).text(function(d) { return d});
  </script>
</body>
```
這時候你嘗試著開啟開發者人工具的會發現有一個叫做<font color="red">`_enter`</font>的陣列裡面元素前兩個是<font color="red">`empty`</font>和後面三個<font color="red">`Ut`</font>的物件，由於你所選取的<font color="red">`div`</font>只有兩個，當資料被添加進去<font color="red">`div`</font>的時候會有兩個如願地加進<font color="red">`div`</font>然而剩下三個並沒有被加入進去的就會在<font color="red">`_enter`</font>陣列裡面呈現。

畫面如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210925_01.png)

這時候你可以發現網頁只有前兩個資料被顯示在畫面上
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210925_02.png)

因此這時候我們可以使用<font color="red">`enter()`</font>這個方法來獲取那些未被添加至<font color="red">`div`</font>的資料進行操作，我們嘗試著將程式碼改成以下片段
```javascript{numberLines: true}
const arr = [13,6,2,34,23];
const div =d3.select("body").selectAll("div");
div.data(arr).enter().append("div").text(function(d) { return d});
```

這個時候畫面可以渲染出未被放入起始<font color="red">`div`</font>的資料

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210925_03.png)

因此我們將程式碼改成如下
```javascript{numberLines: true}
let arr = [13,6,2,34,23];
let div =d3.select("body").selectAll("div");
div.data(arr).text(function(d){return d});
div.data(arr).enter().append("div").text(function(d) { return d});
```


原先的程式碼將在<font color="red">`div.data(arr)`</font>添加<font color="red">`enter()`</font>的方法後再添加<font color="red">`div`</font>最後同樣地用<font color="red">`text()`</font>把資料顯示在畫面上，如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210925_04.png)
因此我們可以結合上面的程式碼就能正確的渲染出畫面

我們可以看下圖一般使用`data()`綁定元素的時候如果原先畫面有div會被正確對應，如果沒有被對應到的會被歸類到enter裡面，這時候我們就用`enter`函式來`append` `div`元素就可以渲染出整個畫面


![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210925_05.png)



另外官方API文件<font color="red">`enter()`</font>的說明有提到可以使用<font color="red">`merge()`</font>來**合併**，下個部分會提到關於<font color="red">`merge()`</font>的應用。
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210925_06.png)

> [官方enter()文件參考](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_enter)
## merge()函式—合併
使用<font color="red">`merge`</font>把原先**body**裡面有的**div**和後來透過<font color="red">`append()`</font>添加的**div**進行合併，我們宣告一個merge做為起點來操作畫面，如下程式碼
```javascript{numberLines: true}
let arr = [13,6,2,34,23];
let div =d3.select("body").selectAll("div");
let merge = div.data(arr)
               .merge(
                 div.data(arr)
                 .enter()
                 .append("div")
                );
  console.log(merge);
  merge.text(function(d) {return d});

```
這時候你開啟開發人員工具的時候就比較像是當初你在<font color="red">`body`</font>擁有5個<font color="red">`div`</font>一樣了，此時我們加入<font color="red">`text()`</font>函式就能完整的顯示出**arr陣列**裡面的內容在網頁上。
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210925_07.png)



## exit()函式—沒資料放入的元素
前面的例子提到當資料大於畫面中的元素時候使用<font color="red">`enter()`</font>選取來補足，反之如果當資料量小於畫面中的元素的時候，我們可以使用<font color="red">`exit()`</font>函式來選取通常也伴隨著<font color="red">`remove()`</font>函式來移除多餘的這些元素，來看以下的例子。
```javascript{numberLines: true}
<body>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
<script>
  const arr = [13,6,2,34,23];
  const div =d3.select("body").selectAll("div");
  const dataInDiv = div.data(arr);
  dataInDiv.text(function(d){return d})
  dataInDiv.exit().remove();
</script>
```
[exit()官方API文件](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_exit)
可以參照官方API文件說明

這時候你開啟開發者人員工具可以發現原本你寫六個<font color="red">`div`</font>，因為撰寫了第<font color="red">`13`</font>行  <font color="red">`dataInDiv.exit().remove()`</font>，把沒有綁定資料的**div**給移除了。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210925_08.png)

如下圖如果資料綁定的過程當中有多餘的元素時會被歸類在`exit`裡面，這時候可以使用`remove`來移除多餘的元素。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210925_09.png)


## join()函式—三個願望一次滿足
由於我們可能不確定元畫面上的元素和資料哪個數量比較大，因此在撰寫資料到元素時，我們會用上述的方法來確保的數量是相等，不會有元素大於資料或者資料大於元素的情況，參照以下程式碼
```javascript{numberLines: true}
<body>
  <div></div>
  <div></div>
  <script>
    const arr = [13, 6, 2, 34, 23];
    const div = d3.select("body").selectAll("div");
    const dataInDiv = div.data(arr);
    const merge = div.data(arr)
                   .merge(dataInDiv.enter()
                                   .append("div")
                          );
    merge.text(function (d) {
      return d;
    });
    dataInDiv.exit().remove();
  </script>
</body>
```
撰寫如上述的程式碼後，無論畫面上原本的<font color="red">`div`</font>數量是**兩個**或是**六個**並不會造成資料缺失或是元素過多的情形。
然而這些操作對於新手不友善，並且繁瑣，所幸後來的版本增加了一個函式叫做join()接下來你可以嘗試著使用下列程式碼。
```javascript{numberLines: true}
  let arr = [13, 6, 2, 34, 23];
  let div = d3.select("body").selectAll("div");
  let dataInDiv = div.data(arr);
  let join = dataInDiv.join("div");
  join.text(function (d) { return d});
```
頓時你會覺得世界的美好，官方API說明他將會合併<font color="red">`enter`</font>和綁定資料的<font color="red">`selection`</font>甚至移除多餘的部分

> [官方API文件JOIN()](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_join)

參考以下官方API截圖
![](https://i.imgur.com/O81R0CP.png)

