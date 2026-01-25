---
title: D3JsDay03可縮放向量圖型  不用怕圖片不行—SVG簡介
slug: 2021-09-18T10:37:54.000Z
date: 2021-09-18T10:37:54.000Z
tags: ["D3.js","Javascript"]
---

由於D3Js的組成部分來自於操控<font color="red">`SVG(Scalable Vector Graphics)`</font>，所以簡單介紹一下SVG。

SVG組成是屬於向量圖形(透過電腦計算路徑形成的圖形)，因此在進行放大圖形的時候也<font color="blue">不會</font>造成<font color="blue">失真</font>情況。
如下圖這張是JPG
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210918_01.jpg)

下面這個是SVG如果你CTRL+滑鼠滾輪無限放大的時候就可以發現JPG會有出現鋸齒狀的情況，但是SVG不會。

程式碼範例
```html{numberLines: true}
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="50" style="font-size:50px">
      A
    </text>
</svg>
```

渲染出的畫面如下

<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <text x="100" y="100" style="font-size:100px">
      A
    </text>
</svg>

w3c所製定的標準，因此可以搭配DOM和CSS或者script操作。

我們可以想像成SVG為一個畫布，以下繪製兩個寬高為300px的畫布
以下這張圖顯示畫布為300
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210918_02.jpg)


## 基本的圖形
```html{numberLines: true}
  <svg width="300" height="300">
        <rect width="50" height="200" fill="pink" />
  </svg>
  <svg width="300" height="300">
      <circle cx="200" cy="100" r="25" fill="lightgreen" />
  </svg>
```
<font color="red">`<rect>`</font>表示將要繪製正方形或長方形<font color="red">`width`</font>和<font color="red">`height`</font>指的是寬、高而<font color="red">`fill`</font>表示填充的顏色
如下圖
<font color="red">`<circle>`</font>表示要繪製圓形<font color="red">`cx`</font>和<font color="red">`cy`</font>表示圓心位置<font color="red">`r`</font>代表半徑<font color="red">`fill`</font>一樣表示填充的顏色
圓形同理如下圖
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210918_03.jpg)

## SVG Line

<font color="red">`line`</font>是線段的意思
<font color="red">`x1`</font>和<font color="red">`y1`</font>為起始座標
<font color="red">`x2`</font>和<font color="red">`y2`</font>為終點座標

<font color="red">`stroke`</font>屬性為線段的顏色
<font color="red">`stroke-width`</font>為線段的粗細

程式碼如下
```html{numberLines: true}
<svg height="500" width="500">
  <line x1="0" y1="0" x2="200" y2="200" style="stroke:blue;stroke-width:2" />
</svg>
```
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210918_04.png)
一條藍色的線段如上圖就畫出來了

## SVG path

svg路徑可以拿來產生線條、曲線、圓弧等等的形狀
這邊以接下來會畫的圖形的部分做簡單介紹

| 字母 |                       填入參數                        | 說明                                                                                                                                                                                    |
| ---- | :---------------------------------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M    |                          x,y                          | 移到                                                                                                                                                                                    |
| L    |                          x,y                          | 劃一條線                                                                                                                                                                                |
| V    |                          x,y                          | 垂直線                                                                                                                                                                                  |
| H    |                          x,y                          | 水平線                                                                                                                                                                                  |
| Z    |                                                       | 把目前的座標和第一個的點連接成為封閉路徑                                                                                                                                                |
| A    | rx,ry,x-axis-rotation,large-arc-flag,sweep-flag  ,x,y | 這邊主要有7個點 rx ry表示橢圓的半徑 x-axis-rotation表示弧線與X軸的夾角 large-arc-flag 1為大角度的弧線 0為小角度的弧線 sweep-flag 1表示順時鐘方向 0表示逆時鐘方向最後的x和y是終點座標x,y |
 
接下來我們嘗試著這些來畫個雨傘吧。

首先先撰寫畫布大小是寬800高450，在style的地方撰寫path的樣式，由於我們不會填滿色彩所以<font color="red">`fill`</font>是<font color="red">`none`</font>然後線段的寬度<font color="red">`stroke-width`</font>設為<font color="red">`1`</font>
從起始點為整個畫布的中間開始所以是<font color="red">`M400 225`</font>然後<font color="red">`H450`</font>畫出水平線段，之後畫出L的終點位置x是400 y是105所以寫下<font color="red">`L400 105`</font>最後加上<font color="red">`Z`</font>自動關閉曲線
程式碼如下

```html{numberLines: true}
<style>
  svg path{
     fill:none; 
     stroke-width:1;
  }
</style>
<body>
  <svg width="800" height="450">
    <path d="M400 225 H450 L400 105 Z " stroke="black" />
  </svg>
</body>
```
就可以得到一個三角形如下
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210918_05.png)

同理我們再添加左邊的一個對稱的三角形，之後我們在三角形上面的頂點地方<font color="orange">`(400,105)`</font>作為起位置畫線段到<font color="orange">`(425 225)`</font>
程式碼如下
```html{numberLines: true}
<svg width="800" height="450">
  <path d="M400 225 H450 L400 105 Z " stroke="black" />
  <path d="M400 225 H350 L400 105 Z " stroke="black" />
  <path d="M400 105 L425 225" stroke="black" />
</svg>
```
可以看到圖片如下
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210918_06.png)
左邊一樣同理畫出左三角形的中間的線，之後我們要做傘柄
首先一樣從<font color="orange">`(400,225)`</font>的點開始這時候畫出一個垂直線到y250的位置
程式碼如下
```html{numberLines: true}
<svg width="800" height="450">
  <path d="M400 225 H450 L400 105 Z " stroke="black" />
  <path d="M400 225 H350 L400 105 Z " stroke="black" />
  <path d="M400 105 L425 225" stroke="black" />
  <path d="M400 105 L375 225" stroke="black" />
  <path d="M400 225 V250" stroke="black" />
</svg>
```
這時候圖形會長這樣
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210918_07.png)

最後我們將要畫出傘的圓弧形狀，因此會動用到一A路徑設定，從起始點<font color="orange">`(400,250)`</font>然後橢圓形的<font color="red">`rx`</font>和<font color="red">`ry`</font>半徑都設為<font color="red">`1`</font>來當作這個橢圓的垂直和水平的半徑比，之後設定弧角與x軸<font color="red">`x-axis-rotation`</font>把它設定成<font color="red">`180`</font>然後由於角度設定是180度所以畫出來應當是個半圓，因此<font color="red">`large-arc-flag`</font>設定<font color="red">`0`</font>或<font color="red">`1`</font>並沒有太大區別，而我們要給予一個逆時鐘的方向因此<font color="red">`sweep-flag`</font>設定<font color="red">`0`</font>(可以設定1看看圖形從中了解差別)最後給予終點座標<font color="orange">`(425,250)`</font>

程式碼如下
```html{numberLines: true}
<svg width="800" height="450">
  <path d="M400 225 H450 L400 105 Z " stroke="black" />
  <path d="M400 225 H350 L400 105 Z " stroke="black" />
  <path d="M400 105 L425 225" stroke="black" />
  <path d="M400 105 L375 225" stroke="black" />
  <path d="M400 225 V250" stroke="black" />
  <path d="M400 250 A1 1 180 1 0 425 250" stroke="#000" fill="none"/>
</svg>
```
圖形如下
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210918_08.png)

另外我們可以讓閃餅的地方加粗寫在css屬性上面，所以用css選取器選取最後兩個元素更改粗細
最後程式碼和圖形如下
```html{numberLines: true}
<style>
  svg path{
     fill:none; 
     stroke-width:1;
  }
  svg path:nth-of-type(5){
     stroke-width:2;
  }
  svg path:last-of-type{
     stroke-width:4;
  }
</style>

<svg width="800" height="450">
  <path d="M400 225 H450 L400 105 Z " stroke="black" />
   <path d="M400 225 H350 L400 105 Z " stroke="black" />
  <path d="M400 105 L425 225" stroke="black" />
  <path d="M400 105 L375 225" stroke="black" />
  <path d="M400 225 V250" stroke="black" />
  <path d="M400 250 A1 1 180 1 0 425 250" stroke="#000" fill="none"/>
</svg>
```
![](https://filedn.eu/ll8NkasFkw1XVJBG2Fp9A1p/gatsby_image/ithome_2021/20210918_09.png)


由於svg可以動用的屬性實在很多，筆者簡單介紹一下svg的基本概念，有興趣的讀者也可以參考MDN和其他人所介紹的SVG部分

<b>參考資料</b>

[ooxx studio SVG 研究之路](https://www.oxxostudio.tw/articles/201406/svg-05-path-2.html)
[MDN SVG教學](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)
[網頁阿尼尛，到底是在幹尛？](https://ithelp.ithome.com.tw/articles/10247526)

