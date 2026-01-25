---
title: bootstrap的一堆筆記
slug: 2021-05-14T02:31:00.000Z
date: 2021-05-14T02:31:00.000Z
tags: ["Bootstrap","UI Framework","CSS"]
---

<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.red {
color:red;
}
.gray{
background-color:#d3d3d3;
}
</style>

## reboot

bootstrap 擁有<span class="red rem25">類似</span>css reset 的部分
差別在於
<span class=rem40>css reset</span>會<span class="red rem25">重置</span>所有樣式
bootstrap 的<span class=rem40>reboot</span>會<span class="red rem25">保留預設樣式</span>，但是使<span class="red rem25">各瀏覽器樣式統一</span>。

例如在 h1 原本瀏覽器有預設樣式 margin 的部分也會經由 bootstrap 載入後消除

另外像是原本程式碼如下

```html{numberLines: true}
<style>
    div{
            height: 100px;
            width: 100px;
            padding: 50px;
            background-color: red;
        }
</style>
```

### box-sizing

省去 padding 和 border 的麻煩計算 bootstrap 會預先載入 box-sizing:border-box;
定義的寬度=實際的呈現寬度

### 字體堆疊 native font stack

字體堆疊意思是讓瀏覽器顯示你所選擇的字體，如果沒有就挑選下一個。
在 css 設定如下

```html{numberLines: true}
body {
font-family: -apple-system, BlinkMacSystemFont, Microsoft Jhenghei, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !default;
}
```

> 更多的訊息[請參考 bootstrap5 文件](https://getbootstrap.com/docs/5.0/content/reboot/#native-font-stack)

## 排印-Typography

官方文件連結
[bootstrap5-Typography](https://getbootstrap.com/docs/5.0/content/typography/

如果不希望有語意的話可以設 class=h2 程式碼如下

```html{numberLines: true}
  <p class="h2">H2 文字大小的段落</p>
```

如果需要更大的文字可以採用 Display headings
程式碼如下

> [Display headings](https://getbootstrap.com/docs/5.0/content/typography/#display-headings)

```html{numberLines: true}
    <h1 class="display-1">Display 1</h1>
```

lead 前導主題
程式碼如下

```html{numberLines: true}
  <div class="lead">前導主題</div>
```

### Unstyledl 去除原先清單樣式

程式碼如下

> [unstyle 連結](https://getbootstrap.com/docs/5.0/content/typography/#unstyled)

```html{numberLines: true}
    <ul class="list-unstyled">
    </ul>
```

### 表單 inline

讓 ul 呈現行內元素的樣式(最常使用在 navbar 的 a 連結處)
程式碼如下

```html{numberLines: true}
<ul class="list-inline">
    <li class="list-inline-item">This is a list item.</li>
    <li class="list-inline-item">And another one.</li>
    <li class="list-inline-item">But they're displayed inline.   </li>
</ul>
```

### 文字截短—text-truncate

> [Description list alignment 連結](https://getbootstrap.com/docs/5.0/content/typography/#description-list-alignment)

```html{numberLines: true}
<dl class="row">
    <dt class="col-sm-3">Description lists</dt>
<dd class="col-sm-9">A description list is perfect for defining terms.</dd>

<dt class="col-sm-3">Term</dt>
<dd class="col-sm-9">
    <p>Definition for the term.</p>
    <p>And some more placeholder definition text.</p>
</dd>

<dt class="col-sm-3">Another term</dt>
<dd class="col-sm-9">This definition is short, so no extra paragraphs or anything.</dd>

<dt class="col-sm-3 text-truncate">Truncated term is truncated</dt>
<dd class="col-sm-9">This can be useful when space is tight. Adds an ellipsis at the end.</dd>

<dt class="col-sm-3">Nesting</dt>
    <dd class="col-sm-9">
        <dl class="row">
        <dt class="col-sm-4">Nested definition list</dt>
            <dd class="col-sm-8">I heard you like definition lists. Let me put a definition list inside your definition list.                </dd>
        </dl>
    </dd>
</dl>
```

### 標記、粗體、斜體、刪除線、引用、註記等等......

其他部分可以參考官方文件
[官方文件](https://getbootstrap.com/docs/5.0/content/typography/#inline-text-elements)

## Content-Image 章節的 doc

### 響應式圖片

在 class 的地方加上 img-fluid 則會在其 css 部分增加
max-width: 100%;
height: auto;
因此就可以達到響應式圖片，即便圖片初始值比較小
在進行畫面縮放的時候加上 img-fluid 也是可以避免畫面縮放的時候出現水平卷軸
程式碼如下

```html{numberLines: true}
<img src="..." class="img-thumbnail" alt="...">
```

### 縮圖

可以產生 1px 的留白
如圖
![](https://i.imgur.com/pb45tJx.png)

程式碼如下

```html{numberLines: true}
<img src="..." class="img-thumbnail" alt="...">
```

### 圖片排版-文繞圖

使用 float 靠左或 float 靠右
程式碼如下

<span class="red">注意事項-記得補上清除浮動</span>

```html{numberLines: true}
<div class="clearfix">
    <img src="..." class="rounded float-start" alt="...">
    <img src="..." class="rounded float-end" alt="...">
</div>
<p>
    這是假文字
</p>
```

### 圖片排版-水平置中-方法一

程式碼如下，利用 m0-auto 還有將圖片設成 block 的方式

```html{numberLines: true}

<img src="..." class="rounded mx-auto d-block" alt="...">
```

### 圖片排版-水平置中-方法二

程式碼如下，利用 text-align 的方式置中維持行內元素，但是也會造成文字也置中

```html{numberLines: true}
<div class="text-center">
  <img src="..." class="rounded" alt="...">
</div>
```

## Content-Table 表格建立

> [參見 content-table 文件](https://getbootstrap.com/docs/5.0/content/tables/)
> 如果希望字體是白色的，可以使用 table-dark 這個 class 然後在 uitilities 的 color 類別選擇你想要的表格顏色
> 程式碼如下

```html{numberLines: true}
<tr>
  <td class="table-dark bg-primary">...</td>
</tr>
```

### 表格的說明

另外可以放置表格說明 class 設置 caption
程式碼如下

```html{numberLines: true}
<table class="table caption-top">
  <caption>List of users</caption>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
```

### 表格的響應式

表格的響應式則是加上 table-responsive 然後根據希望在哪個解析度以下顯示水平捲軸來加上 sm 或 md 等等
範例如下

```html{numberLines: true}
<div class="table-responsive-sm">
  <table class="table">
    ...
  </table>
</div>
```

### 表格的合併

加入 col-span 屬性

```html{numberLines: true}
<table border="1" cellpadding="5" style="border:2px #26FF26 solid;text-align:center;">
<tr><td colspan="2">使用了 colspan 的欄位</td></tr>
<tr><td>表格欄位</td><td>表格欄位</td></tr>
</table>

<table border="1" cellpadding="5" style="border:2px #FFB326 solid;text-align:center;">
<tr><td colspan="3">使用了 colspan 的欄位</td></tr>
<tr><td>表格欄位</td><td>表格欄位</td><td>表格欄位</td></tr>
</table>

<table border="1" cellpadding="5" style="border:2px #00DBDB solid;text-align:center;">
<tr><td>表格欄位</td><td>表格欄位</td><td>表格欄位</td></tr>
<tr><td colspan="5">使用了 colspan 的欄位</td></tr>
</table>
```

## 欄與列-col 和 row

<span class="rem25">row 做了哪些事情?</span>

1. 設定 display:flex
2. 設定 flex-wrap
3. 做 margin-left 和 margin-right 負值

<span class="red rem25"另外 row 有預設的 padding</span> 可以加入 g-0 這個 class 設定 0 來消除 pading

3 註解:<span class="gray rem25">來和 col 的 padding 抵銷讓格線佔滿 container 的整個空間</span>

bootstrap 的格線系統 col 的欄數相加是 12
最外層有 container 來置中
<span class="red rem25">注意事項</span>

> <span class="red ">外層是 row</span> > <span class="red ">內層是 col-xx</span>

正確程式碼如下

```html{numberLines: true}
<div class="container mt-3">
  <div class="row"> <!--row一定是在外層-->
    <div class="col-6"> <!--col一定是在內層-->
      <div class="box"></div> <!--頁面內容一定是在內層-->
    </div>
    <div class="col-6">
      <div class="box"></div>
    </div>
  </div>
</div>
```

<span class="red rem40">以下錯誤範例</span>
將 box 樣式和 col 設為同層，會失去 gutter(間隙)

```html{numberLines: true}
<div class="container">
  <div class="row">
    <div class="col-6 box">
    </div>
    <div class="col-6 box">
    </div>
  </div>
</div>
```

### 響應式中斷點

指在某個解析度底下會套用的版型
[官方範例程式碼](https://getbootstrap.com/docs/4.6/layout/grid/#grid-options)

| Breakpoint        | Class infix | Dimensions  |
| ----------------- | ----------- | ----------- |
| X-Small           | None        | <576px      |
| Small             | sm          | ≥576px      |
| Medium            | md          | ≥768px      |
| Large             | lg          | ≥992px      |
| Extra large       | xl          | ≥1200px     |
| Extra extra large | xxl         | xxl ≥1400px |

換句話說加上 sm 螢幕裝置在 576px~767px 的時候會套用該版型
在 768px~991px 的時候的時候會套用該版型以此類推

#### 螢幕解析度為何使用這些數字

| Breakpoint | Class infix | Dimensions                        |
| ---------- | ----------- | :-------------------------------- |
| 576px      | sm          | 手機橫向                          |
| 768px      | md          | ipad 平板直向                     |
| 992px      | lg          | ipad 平板橫向、ipadPro 直向、桌機 |
| 1200px     | xl          | ipadPro 平板橫向                  |
| 1400p      | xxl         | 超大寬螢幕                        |

### bootstrap 排版系統 row 和 col 是使用 flex

如果想要設置三欄排版使用先前提到的 col-4 來排版
程式碼如下

```html{numberLines: true}
<div class="container">
  <div class="row">
    <div class="col-4">
       lorem
    </div>
    <div class="col-4">
         lorem
    </div>
    <div class="col-4">
        lorem
    </div>
  </div>
</div>
```

另外也可以使用三個 col 程式碼如下

```html{numberLines: true}
<div class="container">
  <div class="row">
    <div class="col">
       lorem
    </div>
    <div class="col">
         lorem
    </div>
    <div class="col">
        lorem
    </div>
  </div>
</div>
```

差別在於使用 col-4 的 width 是 33.3333%

然而單純使用 col 的是使用 flex 系統而且 flex-grow:1

如果是參雜數字和 col 的情況
如下則會分配剩餘的空間
意思是 col-6 佔 6/12 然後剩下的 6/12 是被 col 分配成 3/12 和 3/12 的情況

```html{numberLines: true}
<div class="container">
  <div class="row">
    <div class="col">
       lorem
    </div>
    <div class="col-6">
         lorem
    </div>
    <div class="col">
        lorem
    </div>
  </div>
</div>
```

col-auto
會根據內容來決定寬度而非分配剩餘的空間
例如

```html{numberLines: true}
<div class="container">
  <div class="row">
    <div class="col">
       lorem
    </div>
    <div class="col-auto">
         lorem lorem lorem lorem lorem lorem lorem
    </div>
    <div class="col">
        lorem
    </div>
  </div>
</div>
```

會根據 lorem 這些假文字的寬度來給予空間

### 在不同螢幕裝置使用不同的欄數

<span class="rem40">方法一在 col 添加數字</span>
以下程式碼在小尺寸的手機會呈現滿版
在平板的時候會呈現三欄式排版
在桌機的時候會顯示四欄式排版

程式碼如下

```html{numberLines: true}
<div class="container">
        <div class="row">
           <div class="col-12 col-md-4 col-lg-3">
               <div class="item">
                   <img src="https://picsum.photos/id/1058/600/400" class="w-100" alt="">
                       <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed ipsa eius reprehenderit sit. Odit ut laboriosam eaque beatae, rem quas quae facere cumque ullam soluta accusamus adipisci qui voluptatibus vel!</p>
               </div>
           </div>
            <div class="col-12 col-md-4 col-lg-3">
               <div class="item">
                   <img src="https://picsum.photos/id/1058/600/400" class="w-100" alt="">
                       <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed ipsa eius reprehenderit sit. Odit ut laboriosam eaque beatae, rem quas quae facere cumque ullam soluta accusamus adipisci qui voluptatibus vel!</p>
               </div>
           </div>
           <div class="col-12 col-md-4 col-lg-3">
                <div class="item">
                    <img src="https://picsum.photos/id/1058/600/400" class="w-100" alt="">
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed ipsa eius reprehenderit sit. Odit ut laboriosam eaque beatae, rem quas quae facere cumque ullam soluta accusamus adipisci qui voluptatibus vel!</p>
                </div>
            </div>
            <div class="col-12 col-md-4 col-lg-3">
                <div class="item">
                    <img src="https://picsum.photos/id/1058/600/400" class="w-100" alt="">
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed ipsa eius reprehenderit sit. Odit ut laboriosam eaque beatae, rem quas quae facere cumque ullam soluta accusamus adipisci qui voluptatibus vel!</p>
                </div>
            </div>
        </div>
    </div>
```

<span class="rem40">方法二在 row 添加數字</span>
col 無數字(它會自動分配剩餘的空間)
row 添加數字例如
row-col-1 泛指在小裝置的時候只有一欄
row-cols-md-3 在中型裝置的時候變成三欄式排版

```html{numberLines: true}
<div class="container">
    <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 ">
       <div class="col">
           <div class="item">
               <img src="https://picsum.photos/id/1059/600/400" class="w-100" alt="">
                   <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed ipsa eius reprehenderit sit. Odit ut laboriosam eaque beatae, rem quas quae facere cumque ullam soluta accusamus adipisci qui voluptatibus vel!</p>
           </div>
       </div>
        <div class="col">
           <div class="item">
               <img src="https://picsum.photos/id/1059/600/400" class="w-100" alt="">
                   <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed ipsa eius reprehenderit sit. Odit ut laboriosam eaque beatae, rem quas quae facere cumque ullam soluta accusamus adipisci qui voluptatibus vel!</p>
           </div>
       </div>
       <div class="col">
            <div class="item">
                <img src="https://picsum.photos/id/1059/600/400" class="w-100" alt="">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed ipsa eius reprehenderit sit. Odit ut laboriosam eaque beatae, rem quas quae facere cumque ullam soluta accusamus adipisci qui voluptatibus vel!</p>
            </div>
        </div>
        <div class="col">
            <div class="item">
                <img src="https://picsum.photos/id/1059/600/400" class="w-100" alt="">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed ipsa eius reprehenderit sit. Odit ut laboriosam eaque beatae, rem quas quae facere cumque ullam soluta accusamus adipisci qui voluptatibus vel!</p>
            </div>
        </div>
    </div>
</div>
```

### gutter

bootstrap5 新的屬性名稱
gutter 可以設定水平和垂直的間距
例如
gx-1
gy-1
[bootstrap5 gutter](https://getbootstrap.com/docs/5.0/layout/gutters/#horizontal-gutters)
程式碼如下 可以讓其擁有水平和垂直的間距

```html{numberLines: true}
<div class="container">
  <div class="row g-2">
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
    <div class="col-6">
      <div class="p-3 border bg-light">Custom column padding</div>
    </div>
  </div>
</div>
```

### 容器-container

container 稱為<span class="red rem25">定寬容器</span>也就是有固定寬度的容器
讓容器擁有最大寬度為某 px 值

如果不想要定寬的話使用<span class="red rem25">container-fluid</span>

container-fluid 的 class 的寬度皆是使用 100%來表示，因此在各個寬度的時候都會滿版

先前提到使用 col 和 row 來進行排版，建議外層再加上 container 的方式
藉由外層增加 container 的 class 可以達到在某個解析度底下版型是滿版
例如 container-sm 是在 576px 的解析度以下達到滿版

container-xxl 是在 1400px 以下達到滿版

## d-flex

d-flex
預設是沒有 flex-wrap 的值

### flex-grow、flex-shrink

在容器設置 flex
當設置 flex-grow 數字的時候會分配剩餘空間
例如原先容器寬度為 100px 有三個內元件 第一個元件為寬度 20px 另外兩個元件分別設置 flex-grow:2 flex-grow:3 的話由於剩餘 80 因此會分配 2 等份給第二個元件 分配 3 等份給第三個元件，因此得到 32px 寬度和 48px 寬度
程式碼和呈現畫面如下

![](https://i.imgur.com/tS4Y34L.png)

```html{numberLines: true}
<style>
    .outer{
        display: flex;
        border: 1px solid black;
        width: 100px;
        height: 40px;
        box-sizing: border-box;
    }
    .inner:first-child{
        width: 20px;
        background: green;
    }
    .inner:nth-child(2){
        background-color:gray;
        flex-grow: 2;
    }
    .inner:last-child{
        flex-grow:3;
        background-color:rgb(255, 0, 0);
    }
</style>
<div class="outer">
    <div class="inner">1</div>
    <div class="inner">2</div>
    <div class="inner">3</div>
</div>
```

flex-shrink 是否壓縮
預設是 1
當容器空間不足以裝下內元件的時候會進行壓縮
當 flex-shrink 設置 0 的時候會爆出容器外

### align-content

align-content 其效果類似 justify-content
但是<span class="red rem25">僅有在 flex-wrap 下有效</span>

### order 屬性

order-數字可以改變排列的順序
例如
.order-4
.order-5
或是
.order-sm-0
.order-sm-1
.order-sm-2

<span class="red rem25">使用情境</span>
.order-sm-1 或.order-XX-X 使用情境

> 例如希望使用者在手機顯示的時候最先看到的畫面是某種排序
> 在桌機又是另外一種排序

flex 的預設 order 值是 0
換句話說沒有設置任何 order 的時候他的值是 0

另外還有 order-first 和 order-last
裡面 order 的 css 屬性值對應到的是-1 和 13
(因為 col 最多就是 12 欄很自然的最大值就是 13)

如上也就是讓該內容在 576px 以下的時候的排列順序

> [order 參考連結](https://getbootstrap.com/docs/5.0/utilities/flex/#order)

### align-content

<span class="red rem40">注意</span>在擁有<span class="red">flex-wrap</span>屬性的情況之下才能使用

bootstrap5 官方文件
[align-content Bootstrapo](https://getbootstrap.com/docs/5.0/utilities/flex/#align-content)
可參考 MDN 連結
[align-content MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)

## Spacing

{property}{sides}-{size}
舉例：mt-5
bootstrap5 使用 start 和 end 來取代之前的 left 和 right

> 由於某些語言 例如希伯來文和阿拉伯文是由右閱讀到左(RTL)
> 因此若採用 ps-Num 和 pe-Num 可以避免在切換語言的時候要改大量的 HTMLclass 的名稱

<span class=rem25>在 bootstrap4 版本</span>
使用 ml-2
<span class=rem25>在 bootstrap5 版本</span>
使用 ms-2

### 使用 auto 小技巧

可以使用 auto 的方式來建立預留空位
若要使用如圖的情況
首先撰寫三個 col-3 然後在第二個 col-3 的地方加入 ms-auto 此時就可以製造出一個位置空白

![](https://i.imgur.com/RbfiWHq.png)

程式碼如下

```html{numberLines: true}
<div class="container">
    <div class="row mb-1">
        <div class="col">
            <div class="box">0</div>
        </div>
    </div>
    <div class="row">
        <div class="col-3">
            <div class="box">1</div>
        </div>
        <div class="col-3 ms-auto">
            <div class="box">2</div>
        </div>
        <div class="col-3">
            <div class="box ps-5">
                3
            </div>
        </div>
    </div>
</div>
```

畫面如下

### 使用負的邊界

亦可使用負的 margin(padding 不行)
使用方法請參考官方文件

這些負值的 margin 在預設情況下是禁用的，但可以通過在 Sass 中設置 $enable-negative-margins: true 以啟用。

語法與預設的、正值 margin 通用類別幾乎相同，在所需的大小前加入 n
例如 mt-n1

[負的邊界 ](https://getbootstrap.com/docs/5.0/utilities/spacing/#negative-margin)

### offset 交錯式設計

offset 的原理是使用 margin:left 的技巧

例如建置平均四欄版面，但只有三欄內容並且在第二、三欄中間空一欄的時候可以<span class="red rem25">在第三欄的 col 地方加入 offset-3</span>這樣就可以製造出間隔

也可以算是除了 justify-content-around 或 justify-content-between 的另種選擇

另外想要做出交錯式版面可使用以下方式
加入媒體查詢可以在手機板顯示的時候變回原樣

```html{numberLines: true}
<style>
    .box{
        background-color: red;
        height: auto;
        width: auto;
    }
    .hello{
      background: rgb(73, 37, 37);
      height: 100px;
      width: 100px;
      color: #fff;
    }

    .txt{
        background-color: #ccc;
    }
    @media screen and (min-width:768px) {
        .margin-negative{
            margin-top: -20px;
        }
    }
</style>


<div class="container">
    <div class="row ">
       <div class="col-12 col-md-7">
           <div class="item">
               <img class="w-100"src="https://picsum.photos/id/1058/600/400" class="w-100" alt="">

           </div>
       </div>
       <div class="col-12 col-md-7 offset-md-5 margin-negative">
           <div class="txt">
               <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores accusantium vel, iusto sint temporibus blanditiis, eos quis eum, alias voluptatibus repellat animi. Voluptatibus inventore nihil harum in asperiores, hic voluptatum.</p>
           </div>
       </div>
        <div class="col-12 col-md-7">
           <div class="item">
               <img class="w-100"src="https://picsum.photos/id/1058/600/400" class="w-100" alt="">

           </div>
       </div>
       <div class="col-12 col-md-7 offset-md-5 margin-negative">
           <div class="txt">
               <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores accusantium vel, iusto sint temporibus blanditiis, eos quis eum, alias voluptatibus repellat animi. Voluptatibus inventore nihil harum in asperiores, hic voluptatum.</p>
           </div>
       </div>
       <div class="col-12 col-md-7">
            <div class="item">
                <img class="w-100"src="https://picsum.photos/id/1058/600/400" class="w-100" alt="">

            </div>
        </div>
        <div class="col-12 col-md-7 offset-md-5 margin-negative">
            <div class="txt">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores accusantium vel, iusto sint temporibus blanditiis, eos quis eum, alias voluptatibus repellat animi. Voluptatibus inventore nihil harum in asperiores, hic voluptatum.</p>
            </div>
        </div>ㄎ
        <div class="col-12 col-md-7">
            <div class="item">
                <img class="w-100"src="https://picsum.photos/id/1058/600/400" class="w-100" alt="">

            </div>
        </div>
        <div class="col-12 col-md-7 offset-md-5 margin-negative">
            <div class="txt">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores accusantium vel, iusto sint temporibus blanditiis, eos quis eum, alias voluptatibus repellat animi. Voluptatibus inventore nihil harum in asperiores, hic voluptatum.</p>
            </div>
        </div>
    </div>
</div>
```

呈現畫面如下
![](https://i.imgur.com/zZ99Mxz.jpg)
手機板畫面如下
![](https://i.imgur.com/9eqQfPK.png)

## Ratios-影片比例

可以設置影片的比例詳情請參見官方文件
[影片比例](https://getbootstrap.com/docs/5.0/helpers/ratio/)

(bootstrap4 的關鍵字是 embed)

## Text-truncate 文字刪減

其他請參考官方文件
[text 官方文件](https://getbootstrap.com/docs/5.0/utilities/text/)
當內容擁有寬度的時候設置 text-truncate 會改以刪節號顯示
<span class="red rem25">內容必須設定寬度才有效</span>

# BootstrapComponents

在 bootstrap 中有自定義 data-toggle 的屬性，用來觸發相關的功能
常見的像是<span class="red">data-bs-toggle="collapse"、data-bs-toggle="tab"、data-bs-toggle="collapse"</span>
其皆附帶 data-target 屬性用來對應所要觸發的位置例如<span class="red"> data-bs-target="#collapseExample"</span> <span class="gray">
上面的<span class="red">#號</span>代表自取的元素名字 id</span>

> 在 bootstrap5 叫做 data-bs-toggle 和 data-bs-target

## Button

btn 不僅只限使用`<button>`，使用 input 和 a 也可以，但是 type 和 value 都要加上去
範例如下

[官方文件 Btn](https://getbootstrap.com/docs/5.0/components/buttons/#button-tags)

```html{numberLines: true}
<a class="btn btn-primary" href="#" role="button">Link</a>
<button class="btn btn-primary" type="submit">Button</button>
<input class="btn btn-primary" type="button" value="Input">
<input class="btn btn-primary" type="submit" value="Submit">
<input class="btn btn-primary" type="reset" value="Reset">
```

麵包屑也可以使用 a 連結 他的斜線是用偽元素做的

```html{numberLines: true}
<nav aria-label="breadcrumb">
    <a class="breadcrumb-item" href="#">Home</a>
    <a class="breadcrumb-item" href="#">Library</a>
    <a class="breadcrumb-item active" aria-current="page">Data</a>
</nav>
```


### 按鈕大小

.btn-group-lg 加上大小可以將群組的按鈕變大

```html{numberLines: true}
<div class="demo">
  <div class="btn-group btn-group-lg" role="group" aria-label="...">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>
    <button type="button" class="btn btn-secondary">3</button>
  </div>
  <div class="btn-group" role="group" aria-label="...">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>
    <button type="button" class="btn btn-secondary">3</button>
  </div>
  <div class="btn-group btn-group-sm" role="group" aria-label="...">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>
    <button type="button" class="btn btn-secondary">3</button>
  </div>
</div>
```

<span class="gray rem25">Input 和 a 連結也可以群組化</span>

### aria 無障礙網頁

> [詳情請參考 MDN 無障礙敘述](https://developer.mozilla.org/zh-TW/docs/Learn/Accessibility/WAI-ARIA_basics)

### 巢狀結合下拉式選單

當你想要下拉式功能表與群組按鈕混合時，只需要將 .btn-group 放在另一個 .btn-group 中。

```html{numberLines: true}
<div class="demo">
  <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
    <button type="button" class="btn btn-secondary">1</button>
    <button type="button" class="btn btn-secondary">2</button>

    <div class="btn-group" role="group">
      <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown
      </button>
      <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
        <a class="dropdown-item" href="#">Dropdown link</a>
        <a class="dropdown-item" href="#">Dropdown link</a>
      </div>
    </div>
  </div>
</div>
```

## card 卡片

card 可以和其他元件組合 例如 list

卡片可以結合無序清單
範例如下

```html{numberLines: true}
<div class="card" style="width: 18rem;">
  <ul class="list-group list-group-flush">
    <li class="list-group-item">An item</li>
    <li class="list-group-item">A second item</li>
    <li class="list-group-item">A third item</li>
  </ul>
</div>
```

### Navigation 導覽式卡片

一定要寫 card-header-tab 才會正常 導覽式卡片元件

> [參考官方文件](https://getbootstrap.com/docs/5.0/components/card/#navigation)

card-header-pills 也是要加入
範例如下

```html{numberLines: true}
<div class="card text-center">
  <div class="card-header">
    <ul class="nav nav-pills card-header-pills">
      <li class="nav-item">
        <a class="nav-link active" href="#">Active</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
```

### 卡片圖片

[卡片圖片](https://getbootstrap.com/docs/5.0/components/card/#images-1)
card-img-overlay 讓文字蓋到圖片上面

### card 的間距

bootstrap5 把 card-columns 拿掉了
因此直接使用 gutter 來調整間距
例如 <span class="red">g-0</span>

> [Card Gutter](https://getbootstrap.com/docs/5.0/components/card/#grid-cards)

## Carousel 輪播

ID 記得對應上且加上井字號

```html{numberLines: true}

<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="..." class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="...">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
```

## collapse 收摺

收摺如果是 a 連結要加上 href 的 id 屬性例如 href="#collapseExample"對應到指定的 id

如果是 button 要加上 data-bs-target="#collapseExample"屬性 一樣對應到指定的 id

兩者都要加上 data-bs-toggle="collapse"的屬性 使其功能正常運作

```html{numberLines: true}
<p>
  <a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
    Link with href
  </a>
  <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Button with data-bs-target
  </button>
</p>
<div class="collapse" id="collapseExample">
  <div class="card card-body">
    Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
  </div>
</div>
```

### 多個收摺

也就是按下按鈕一次收摺兩個

[多個目標手風琴](https://getbootstrap.com/docs/4.6/components/collapse/#multiple-targets)

## Accordion 手風琴

bootstrap5 獨立出來在 component 底下
當點擊某個展開後再點擊另一個展開後原先的那個會收摺
[參考資料手風琴](https://getbootstrap.com/docs/5.0/components/accordion/#example)

## dropdowns 下拉式選單

主要是外層有個 data-toggle 的屬性可以觸發 JS 事件展開選單內容

通常外面有一個 class 是 dropdown
下面有個 button
再下面有個 dropdown-menu
程式碼如下

```html{numberLines: true}
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown button
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
  </ul>
</div>
```

### 分離式按鈕

加入 class dropdown-toggle-split
參考官方文件[Split Button](https://getbootstrap.com/docs/5.0/components/dropdowns/#split-button)

### dropdown 的方向性

加入 dropup 使其向上(如果空間不夠的話還是自動切換會向下)

[參考官方文件](https://getbootstrap.com/docs/5.0/components/dropdowns/#directions)

### dropdown 的標題

加入 dropdown-header 使其顯示(且不能按)
[dropdown-header](https://getbootstrap.com/docs/5.0/components/dropdowns/#headers)

### dropdown 分隔線

dropdown-divider 加入後可以使其分隔
[dropdown 分隔線](https://getbootstrap.com/docs/5.0/components/dropdowns/#dividers)

### dropform 表單

dropdown-menu 裡面也可以是 form 表單
程式碼內容如下 按下按鈕之後可以看到表單

```html{numberLines: true}
<div class="demo">
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Dropdown button
    </button>
    <div class="dropdown-menu">
      <form class="px-4 py-3">
        <div class="form-group">
          <label for="exampleDropdownFormEmail1">Email address</label>
          <input type="email" class="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com">
        </div>
        <div class="form-group">
          <label for="exampleDropdownFormPassword1">Password</label>
          <input type="password" class="form-control" id="exampleDropdownFormPassword1" placeholder="Password">
        </div>
        <div class="form-check">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input">
            Remember me
          </label>
        </div>
        <button type="submit" class="btn btn-primary">Sign in</button>
      </form>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item" href="#">New around here? Sign up</a>
      <a class="dropdown-item" href="#">Forgot password?</a>
    </div>
  </div>
</div>
```

## from

表單大概形式外層一個 form-group 的 div 裡面擁有 label 和 input 之類的
程式碼如下

```html{numberLines: true}
<div class="form-group">
  <label for="exampleInputEmail1">Email address</label>
  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
</div>
```

### form controls

表單控制參考官方文件
form control 主要是 input 和 textarea 的表單輸入 都是使用這個 class 去產生的
在 input 添加這個 class
[form-controls](https://getbootstrap.com/docs/5.0/forms/form-control/)

#### form-control-lg 表單控制大小

主要是 form-control 後面加上 lg sm 等字樣來使表單大小變化

### form check

包含以下三個 class
form-check
form-check-input
form-check-label
程式碼如下

```html{numberLines: true}
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
  <label class="form-check-label" for="flexCheckDefault">
    Default checkbox
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
  <label class="form-check-label" for="flexCheckChecked">
    Checked checkbox
  </label>
</div>
```

#### form-check 加上 disable

在 input 元素裡面加上 disable 屬性
之後 label 就會自動套用
程式碼如下

```html{numberLines: true}
<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="flexCheckDisabled" disabled>
  <label class="form-check-label" for="flexCheckDisabled">
    Disabled checkbox
  </label>
</div>
```

#### form-check 的 inline

加上.form-check-inline 屬性 使其水平排列
參考官方資料
[參考 form-check-inline](https://getbootstrap.com/docs/5.0/forms/checks-radios/#inline)

#### form-check 沒有 label

form-check 沒有 label 在 bootstrap5 不需要加入其他屬性

bootstrap4 需要加入 position-static 這個 class 名稱

### form-select

bootstrap5 改名為表單選擇
[官方文件選擇](https://getbootstrap.com/docs/5.0/forms/select/)

加入 multiple 屬性的話就可以多選了
程式碼如下

```html{numberLines: true}
<select class="form-select" multiple aria-label="multiple select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
```

### readonly 只限閱讀

在 form 的<input>元素裡面加入 readonly 屬性

```html{numberLines: true}
<input class="form-control" type="text" placeholder="Readonly input here..." aria-label="readonly input example" readonly
```

### form 使用網格系統

bootstrap5 去除 form-row 屬性改用 gutter 來控制間距
[參考 form-layout](https://getbootstrap.com/docs/5.0/forms/layout/#gutters)

#### col-form-label

加入這個屬性的話就會按 form-control 對齊

#### form 水平排列

添加 row-cols-auto 來達到內層的 col 水平成一列
bootstrap4 是使用 form-inline

### 表單文字

加入 form-text 使表單文字再小一點
參考
[form-text](https://getbootstrap.com/docs/5.0/forms/overview/#form-text)

### 直接在 fieldset 下加入 disable 就可將所有表單內容禁用

程式碼如下

```html{numberLines: true}
 <form>
      <fieldset>
        <div class="row row-cols-auto g-3 align-items-center">
          <div class="col">
            <label class="visually-hidden" for="inlineFormInputGroupUsername"
              >Username</label
            >
            <div class="input-group">
              <div class="input-group-text">@</div>
              <input
                type="text"
                class="form-control"
                id="inlineFormInputGroupUsername"
                placeholder="Username"
              />
            </div>
          </div>

          <div class="col">
            <label class="visually-hidden" for="inlineFormSelectPref"
              >Preference</label
            >
            <select class="form-select" id="inlineFormSelectPref">
              <option selected>Choose...</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>

          <div class="col">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="inlineFormCheck"
              />
              <label class="form-check-label" for="inlineFormCheck">
                Remember me
              </label>
            </div>
          </div>

          <div class="col">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </fieldset>
    </form>
```

#### 表單驗證

該 input 需要加入<span class="red">required</span>屬性
如果是前端可以使用加入 is-valid 反之 is-invalid 的 class
如果有回傳數值加入 valid-feedback 反之 invalid-feedback 的 class

[參考官方程式 server-side](https://getbootstrap.com/docs/5.0/forms/validation/#server-side)
程式碼如下

```html{numberLines: true}
<form class="row g-3">
  <div class="col-md-4">
    <label for="validationServer01" class="form-label">First name</label>
    <input type="text" class="form-control is-valid" id="validationServer01" value="Mark" required>
    <div class="valid-feedback">
      Looks good!
    </div>
  </div>
  <div class="col-md-4">
    <label for="validationServer02" class="form-label">Last name</label>
    <input type="text" class="form-control is-valid" id="validationServer02" value="Otto" required>
    <div class="valid-feedback">
      Looks good!
    </div>
  </div>
  <div class="col-md-4">
    <label for="validationServerUsername" class="form-label">Username</label>
    <div class="input-group has-validation">
      <span class="input-group-text" id="inputGroupPrepend3">@</span>
      <input type="text" class="form-control is-invalid" id="validationServerUsername" aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback" required>
      <div id="validationServerUsernameFeedback" class="invalid-feedback">
        Please choose a username.
      </div>
    </div>
  </div>
  <div class="col-md-6">
    <label for="validationServer03" class="form-label">City</label>
    <input type="text" class="form-control is-invalid" id="validationServer03" aria-describedby="validationServer03Feedback" required>
    <div id="validationServer03Feedback" class="invalid-feedback">
      Please provide a valid city.
    </div>
  </div>
  <div class="col-md-3">
    <label for="validationServer04" class="form-label">State</label>
    <select class="form-select is-invalid" id="validationServer04" aria-describedby="validationServer04Feedback" required>
      <option selected disabled value="">Choose...</option>
      <option>...</option>
    </select>
    <div id="validationServer04Feedback" class="invalid-feedback">
      Please select a valid state.
    </div>
  </div>
  <div class="col-md-3">
    <label for="validationServer05" class="form-label">Zip</label>
    <input type="text" class="form-control is-invalid" id="validationServer05" aria-describedby="validationServer05Feedback" required>
    <div id="validationServer05Feedback" class="invalid-feedback">
      Please provide a valid zip.
    </div>
  </div>
  <div class="col-12">
    <div class="form-check">
      <input class="form-check-input is-invalid" type="checkbox" value="" id="invalidCheck3" aria-describedby="invalidCheck3Feedback" required>
      <label class="form-check-label" for="invalidCheck3">
        Agree to terms and conditions
      </label>
      <div id="invalidCheck3Feedback" class="invalid-feedback">
        You must agree before submitting.
      </div>
    </div>
  </div>
  <div class="col-12">
    <button class="btn btn-primary" type="submit">Submit form</button>
  </div>
</form>
```

## input group

### input group

bootstrap5 去除了 input-group-prepend

需要加入 addon 僅需要 group 起來就好了
[參考官方 multiple addon ](https://getbootstrap.com/docs/5.0/forms/input-group/#multiple-addons)

### buttons with dropdowns

可以建立一個 input group 群組然後裡面內涵收摺 dropdown
範例如下

```html{numberLines: true}
<div class="input-group mb-3">
  <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Separated link</a></li>
  </ul>
  <input type="text" class="form-control" aria-label="Text input with dropdown button">
</div>

<div class="input-group mb-3">
  <input type="text" class="form-control" aria-label="Text input with dropdown button">
  <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Separated link</a></li>
  </ul>
</div>

<div class="input-group">
  <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action before</a></li>
    <li><a class="dropdown-item" href="#">Another action before</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Separated link</a></li>
  </ul>
  <input type="text" class="form-control" aria-label="Text input with 2 dropdown buttons">
  <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
    <li><hr class="dropdown-divider"></li>
    <li><a class="dropdown-item" href="#">Separated link</a></li>
  </ul>
</div>
```

## Nav

[參考 bootstrap5 nav](https://getbootstrap.com/docs/5.0/components/navbar/#nav)

nav 也是用 flex 排版
nav 通常會結合 pill 和 tab 使用
[參考 pill](https://getbootstrap.com/docs/5.0/components/badge/#pill-badges)

## navs & tabs

[參考 bootstrap5 Tab](https://getbootstrap.com/docs/5.0/components/navs-tabs/#javascript-behavior)
data-bs-target 要對應到 div 內容下的 id 記得加入#號來指定目標物
程式碼如下

```html{numberLines: true}
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Contact</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">...</div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
  <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
```

由上面可以見到<span class="red">tab-content</span>是要透過上面的 ol 裡的 li(也就是被稱為標籤)來切換的內容物

在 tab-content 裡面的 div 有 id 因此原先的 li 內容<span class="red">data-bs-toggle="tab"</span>需要<span class="red rem25">給定一個類型</span>_(這裡的類型是 tab)_ 而<span class="red>data-bs-target="目標"</span>需要<span class="red rem25">給定目標</span>且由於是 id 所以需要加<span class="rem25">#號</span>

list-group-item-action
使其滑鼠滑入的時候有灰色效果
data-target 如果是 a 連結可以使用 href#來綁定

## Model 互動視窗

> [參考 model](https://getbootstrap.com/docs/5.0/components/modal/)

互動視窗 data-target 也可以使用 classname 例如.nd-example-modal-lg

## popover 談出式對話框

如果想要點擊非對話框部分關閉對話框的話可以加入 data-bs-trigger="focus" 換句話說就是使用可以讓我不用一定要按原按鈕就可以關掉彈出訊息

然後 JS 部分加入

```javascript{numberLines: true}
var popover = new bootstrap.Popover(document.querySelector('.popover-dismiss'), {
  trigger: 'focus'
})
```

![](https://i.imgur.com/TaTNJ1I.png)
如上圖 這樣典籍非對話框和按鈕部分就可以關閉對話框了。

[參見 Dismiss on next click](https://getbootstrap.com/docs/5.0/components/popovers/#dismiss-on-next-click)

## 加入 disabled 和 tabindex=-1

針對有些按鈕或表單想進行 disabled 即便滑鼠按下去無法作用也建議加入 tabindex=-1 來避免有些視障人士按下 tab 會被選到
如下面官方範例
[Disabled forms](https://getbootstrap.com/docs/5.0/forms/overview/#disabled-forms)

```html{numberLines: true}
<input class="form-control" id="disabledInput" type="text" placeholder="Disabled input here..." disabled>
```

## tooltips

tooltips 滑動顯示少量訊息

<span class="red rem25">注意</span>tooltips 要加入 js 才會運作
在 tooltips 裡面加入這個就可以寫 htmldata-html="true"

官方範例 tooltips
[tooltips](https://getbootstrap.com/docs/5.0/components/tooltips/#examples)

## scrollspy

Scrollspy 使其滾動的時候對應顯示顏色詳細請看官方文件
[scrollspy 滾動監聽](https://getbootstrap.com/docs/5.0/components/scrollspy/)

## breadcrumb 技巧

<span class="red">breadcrumb</span> 的 class 背景顏色設定透明然後外面再加一個 class 設定背景顏色就可以擁有滿版的寬度 然後裡面的麵包屑記得外層包 container
另外 nav 那層可以拿掉

程式碼如下

```html{numberLines: true}
<div class="bg-warning">
  <div class="container ">
      <ol class="breadcrumb ">
        <li class="breadcrumb-item"><a href="#" >Home</a></li>
        <li class="breadcrumb-item"><a href="#">Library</a></li>
      </ol>
  </div>
</div>
```

