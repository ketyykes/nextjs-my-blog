---
title: D3JsDay02 學學D3JS  技能提高SSS—為什麼D3
slug: 2021-09-17T08:52:54.000Z
date: 2021-09-17T08:52:54.000Z
tags: ["D3.js","Javascript"]
---

關於資料視覺化的工具一般使用者最先接觸的可能是<b>Microsoft Excel</b>工具，後來在程式語言當中常見的是<b>Python Matplotlib</b>和<b>R 語言</b>，另外商業界常見的<b>Power BI</b>、<b>Tableau</b>。
其他同樣是 Javascript 的函式庫的像是<b>ChartJs</b> 、<b>Hightcharts</b>等等

## 工具比較

### 非程式設計人員

- Microsoft Excel
- Power BI
- Tableau

### 程式設計人員

- Matplotlib (python)
- ChartJs (Javascript)
- Hightcharts (Javascript)
- D3Js (Javascript)

---

一般而言 Excel 出發點比較像是原先處理報表計算相關的事情附加可以繪製圖表
<b>Power BI</b>和<b>Tableau</b>是後來才出現，專為數據分析、視覺化呈現等等因此操作方式會比<b>Excel</b>簡單許多，以上這些都是對於非程式設計人員比較友善的工具。

如果我們今天要處理的資料是比較繁瑣，而且重複的性質很高的話，例如一份產品資料當中含有利潤、產品型號、成本、各區銷售額、產品子分類，我們每次要處理這些資料都必須下載資料匯入用滑鼠操作切割出我們需要的資料，可能我只想知道產品和銷售數量的長條圖卻每次都必須切割出不需要的部分，這樣操作繁瑣的事情正是程式設計人員善於解決的事情，藉由程式設計人員的自動化可以節省時間成本，也讓事情簡單化，更別說我們如果是要上架到網頁當中可能需要繪製圖表人員截圖或是產出圖表再請網頁開發人員放入到網站中。

因此對於程式設計人員自然而然可以選擇像是<b>python</b>、<b>R 語言</b>、<b>Javascript</b>等等，今天要完成的事情是將資料呈現成圖表放置到網站中又網頁三大元素 HTML、CSS、Javascript 剛好所使用的便是 Javascript 這個程式語言，所以自然而然在引入方面也會選擇 Javascript 相關的套件比較容易、也無須再接觸一個新的語言增加學習成本，另外值得一提的事情是 R 語言除了資料視覺化呈現，比較強大的地方在於資料分析，而 python 現在可以做的事情越來越多，屬於比較通用性的語言，善於做爬蟲、機器學習、人工智慧、後端，如果你有上述需求需要結合資料視覺化的話也可以研究這些程式語言。

## 為什麼 D3Js

為何 Javascript 當中有像是<b>D3Js</b>、<b>Heightcharts</b>、<b>chartJs</b>的這些套件當中要選擇 D3 呢？與其說 D3Js 是一個圖表庫，應該說他是一個<b><font color="red">易於操作網頁 DOM 而且結合資料的 library</font></b>，所以也更可以做出一些動畫、客製化需求的圖表，如果你只是要簡單的圖表像是長條圖、折線圖，其實<b>Heightcharts</b>、<b>chartJs</b>這些圖表庫並沒有不好，但如果你想要呈現的資料是根據客戶或主管要求而這些圖表庫沒有你所要的圖表時候，D3Js 會是你的好選擇。

另一方面 D3Js 在 Github 的星星數比其他兩個多上許多，因此能夠找到的資源和社群間的互動可能也相對比較高一些。

Github

> [D3 Github](https://github.com/d3/d3/wiki)
> [Hightcharts Github](https://github.com/highcharts/highcharts)
> [Chart Js Github](https://github.com/chartjs/Chart.js)

---

非程式設計使用軟體的官方網站

> [Microsoft Power BI 官方網站](https://powerbi.microsoft.com/zh-tw/)
> [Microsoft Excel 官方網站](https://www.microsoft.com/zh-tw/microsoft-365/excel)
> [Tablbau 官方網站](https://www.tableau.com/zh-tw)

---

接下來就會開始 D3Js 的相關教學
