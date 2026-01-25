---
title: D3JsDay07不懂資料格式，那就會我們曾相識，只是不合適—檔案格式介紹
slug: 2021-09-22T06:15:54.000Z
date: 2021-09-22T06:15:54.000Z
tags: ["D3.js","Javascript"]
---

## 格式介紹
通常你的資料會是檔案、API接口或是一個連結作為D3輸入的資料，這邊就以下常見的資料格式簡單介紹一下

### CSV逗號分隔值(Comma-Separated Values)
<font color="red">`CSV`</font>是一種通用、簡單的格式，檔案以純文字儲存表格的資料，常見使用逗號來分隔資料，換句話說如果你用記事本的格式開啟的話大概會長這樣。
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210922_01.png)

如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210922_02.png)

你也可以使用Microsoft Excel開啟，它會自動幫你引入表格當中呈現

一般而言由於是以純文字的方式儲存，因此也會有編碼上的差異，如果你用記事本檔案→另存新檔的時候，存檔類型選擇所有檔案，在編碼的地方可以看到有許多種類可供選擇，順帶一提<font color="red">`ANSI編碼`</font>在語言不同的情況之下會有亂碼出現的可能性，現在大部分會使用<font color="red">`UTF`</font>形式儲存文字，目前常見使用的<font color="red">`UTF-8`</font>也常用在html的<font color="red">`meta`</font>資訊裡面，另外如果用Excel打開的時候會出現亂碼也可以嘗試另存成<font color="red">`具BOM的UTF-8`</font>來儲存，提供給預開啟軟體自動識別這是UTF的格式。

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210922_03.png)

> 其他更多資訊可以參見維基百科
[CSV維基百科](https://zh.wikipedia.org/zh-tw/%E9%80%97%E5%8F%B7%E5%88%86%E9%9A%94%E5%80%BC)

### JSON JavaScript物件表示法(JavaScript Object Notation)
起先由<b>Douglas Crockford</b>設計和構想的輕量級資料交換格式，雖然<font color="red">`JSON`</font>是<font color="red">`JavaScript的子集`</font>，但其實目前很多程式語言都支援JSON的生成和解析，以下列出他們所擁有的資料型態


| 資料型態       | 值                    |
| -------------- | --------------------- |
| object物件     | {}                    |
| array陣列      | []                    |
| string字串     | ""                    |
| number數值     | 0-9的整數、小數、負數 |
| boolean 布林值 | true 或 false         |
| null 空值      | null                  |

以下作為JSON範例
```javascript{numberLines: true}
{
  "item":{
      "name": "香蕉",
      "catalog": "水果",
      "price": 100,
    }
}
```
可以發現與Javascript的物件可以儲存的內容有著十分類似的樣貌，但是<font color="red">Javascript的物件可以儲存函式</font>，然而JSON僅是儲存資料因此不能儲存函式，另外JSON在資料交換的時候必須使用<font color="red">`UTF-8的格式`</font>，也可以使用Unicode16進位跳脫字元序列，若你在網路上下載的JSON資料以文字檔打開的時候的文字類似像<font color="red">`\u0041`</font>這樣類型的話，並不是出現亂碼的狀況，而使它使用了十六進位的跳脫字元序列，你在console.log欄位的話就能看出原本的字元。
如下圖

![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210922_04.png)

另外在網路上找到相對應的字元編碼可以轉譯文字，參照下列網址
> [UnicodePlus](https://unicodeplus.com/)
> 
### XML可延伸標記式語言(Extensible Markup Language)
<font color="red">`XML`</font>是一種<font color="red">標記式語言</font>，他長得有點類似HTML，這裡嘗試著寫一個XML的範例
```html{numberLines: true}
<?xml version="1.0"?>
<item>
  <name>香蕉</name>
  <catalog>水果</catalog>
  <price>100</price>
</item>
```

由於它是從<font color="red">`SGML`</font>標準通用標記式語言（Standard Generalized Markup Language）所衍生出的子集，算是比較早期拿來做資料交換的格式，和JSON類似的地方一樣可以在標籤內涵蓋其他標籤，擁有階層的概念，這邊主要會稍微和JSON做對應，由於可以看到XML比起JSON多了標頭<font color="red">`<item>`</font>和標尾<font color="red">`</item>`</font>，因此整個檔案所占用的空間也較少，也因為如此所以JSON目前是更加廣泛和流行。


這邊僅提出較常見的格式，其他還有像是<font color="red">`tsv`</font>和<font color="red">`dsv`</font>是類似<font color="red">`csv`</font>一些格式可以參見維基百科介紹

> [DSV維基百科](https://en.wikipedia.org/wiki/Delimiter-separated_values)
> [TSV維基百科](https://zh.wikipedia.org/zh-tw/%E5%88%B6%E8%A1%A8%E7%AC%A6%E5%88%86%E9%9A%94%E5%80%BC)

