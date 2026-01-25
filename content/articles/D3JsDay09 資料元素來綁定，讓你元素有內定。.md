---
title: D3JsDay09 資料元素來綁定，讓你元素有內定—資料綁定
slug: 2021-09-24T09:45:54.000Z
date: 2021-09-24T09:45:54.000Z
tags: ["D3.js","Javascript"]
---

## 資料綁定

### datum()函式

前面的文章多半是在使用**D3**來操作**DOM**，這邊主要探討D3的核心，將資料綁定在DOM的元素中，換句話說DOM的元素樣貌可以透過資料來改變，例如當資料數值是比較大的情況時，你所繪製的<font color="red">`div`</font>或是<font color="red">`svg`</font>的<font color="red">`circle`</font>半徑也隨之變大。

先看以下範例

首先我們先建立一個陣列，然後使用for迴圈以陣列長度作為迴圈數，之後依序添加<font color="red">`div`</font>這邊有一個特別的<font color="red">`datum()`</font>函式，我們嘗試著將每一筆的陣列內容放入函式當中當作參數，最後加入<font color="red">`text()`</font>函式在其中放入一個**回呼函式**參數加入d並且**return**出來就可以看到畫面呈現。
```javascript{numberLines: true}
const arr = [7,2,5,4,13];
for(let i=0; i<arr.length; i++){    
  d3.select("body")
  .append("div")
  .datum(arr[i])
  .text(function(d){
      return d;
  })
}
```
畫面呈現如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210924_01.png)
這時候可以發現在添加的<font color="red">`div`</font>透過<font color="red">`datum()`</font>綁定上去了，你可以嘗試著將上述第5行的 <font color="red">`.datum(arr[i])`</font>註解掉應該會發現網頁畫面的數字不見了。另一個方式你可以撰寫<font color="red">`console.log`</font>印出裡面的<font color="red">`div`</font>包含的data訊息

程式碼如下
```javascript{numberLines: true}
const arr = [7,2,5,4,13];
  for(let i=0; i<arr.length; i++){    
    d3.select("body")
    .append("div")
    .datum(arr[i])
    .text(function(d){
        return d;
    })
  }
const allDataInDiv = d3.select("body").selectAll("div")["_groups"][0];
  for(let i=0; i<allDataInDiv.length;i++){
      console.log(allDataInDiv[i]);
}
```
開啟開發人員工具可以發現<font color="red">`div`</font>被添加了<font color="red">`__data__`</font>在裡面，如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210924_02.png)

所以我們才可以透過<font color="red">`text()`</font>**回呼函式**來獲得d參數，而<font color="red">`d`</font>所表示的就是**資料**的意思

### data()函式
查看以下程式碼我們預先在<font color="red">`body`</font>撰寫空的<font color="red">`div`</font>，這次使用<font color="red">`selectAll`</font>來一次選取所有的<font color="red">`div`</font>並且改用<font color="red">`data()`</font>放入整個陣列，此時一樣可以達到之前所用<font color="red">`datum()`</font>範例所創立的樣貌，因此可以這麼理解是<font color="red">`data()`</font>會**將陣列的各項分別綁定到選擇的各元素**。
```javascript{numberLines: true}
<body>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  <script>
     const arr = [7,2,5,4,13];
     d3.select("body")
     .selectAll("div")
     .data(arr)
     .text(function(d){ return d});
  </script>
</body>
```


### data()和datum比較
與<font color="red">`datum`</font>的差異你可以將<font color="red">`.data(arr)`</font>換成<font color="red">`.datum(arr)`</font>之後看畫面呈現更能看得出其中的奧妙
```javascript{numberLines: true}
<body>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>

  <script>
    let arr = [7,2,5,4,13];
    d3.select("body")
    .selectAll("div")
    .datum(arr)
    .text(function(d){ return d});
  </script>
</body>
```
此時你會看到如下圖，<font color="red">`datum()`</font>會直接將整個陣列綁在**每一個div**上面，多半我們在處理資料的時候會使用<font color="red">`data()`</font>來綁定較為容易。
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210924_03.png)

## 透過函式將樣式改變

若我們希望在大於6的數值就呈現紅色的話，我們透過<font color="red">`style()`</font>操作它的樣式，由於已經綁定資料在元素上，因此我們一樣可以在第二個參數帶入d承接資料並透過if來判斷大於6的函式<font color="red">`return`</font>紅色

```javascript{numberLines: true}
const arr = [7,2,5,4,13];
   d3.select("body")
   .selectAll("div")
   .data(arr)
   .text(function(d,i,n){ 
     return d;
    })
    .style(
        "color",function(d){
        if(d>6){
            return "red";
        }
    });
```

結果呈現如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210924_04.png)


## 關於data和text的函式的其他說明
### text()函式介紹
<font color="red">`text`</font>在綁定之後 **函式** 可以擁有三個參數，第一個參數是<font color="red">`d`</font>表示<font color="red">`data`</font>的意思，第二個參數是<font color="red">`i`</font>表示陣列的<font color="red">`索引值`</font>，第三個參數表示當前綁定的群組節點

你可以將下列程式碼執行看看並且開啟開發者人員工具。
```javascript{numberLines: true}
<body>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <script>
     const arr = [7,2,5,4,13];
     d3.select("body")
     .selectAll("div")
     .data(arr)
     .text(function(d,i,n){ 
         console.log(d);
         console.log(i);
         console.log(n);
    });
  </script>
</body>
```
這邊擷取第一次迴圈所呈現的圖片，**7表示陣列第一筆資料，0表示index索引值**，最後的**n表示當前綁定的元素節點**。
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210924_05.png)

[參考官方textAPI說明](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#selection_text)

另外<font color="red">`data()`</font>或<font color="red">`datum`</font>若<font color="red">沒有帶入參數</font>的時候可以得到綁定的數據
下面程式碼以<font color="red">`data()`</font>為例
```javascript{numberLines: true}
const arr = [7,2,5,4,13];
   d3.select("body")
   .selectAll("div")
   .data(arr)
   .text(function(d,i,n){ 
     return d;
});
console.log(    d3.select("body")
   .selectAll("div")
   .data());
```
或是以<font color="red">`datum()`</font>為例
```javascript{numberLines: true}
let arr = [7,2,5,4,13];
   d3.select("body")
   .selectAll("div")
   .data(arr)
   .text(function(d,i,n){ 
     return d;
});
console.log(
    d3.select("body")
   .select("div")
   .datum()
);
```

以上就是關於資料綁定的部分 下一篇將會介紹關於資料綁定時候需要注意的細節。
