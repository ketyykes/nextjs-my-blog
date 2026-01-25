---
title: ECharts 官方文件的建議閱讀內容
slug: 2024-12-04T13:42:00.000Z
date: 2024-12-04T13:42:00.000Z
tags: ["Javascript"]
---

<style> 
.rem25{
font-size:2.5rem;
}
.rem40{
font-size:4.0rem;
}
.rem50{
  font-size:5.0rem;
}
@media (max-width: 576px) {
  .rem25{
    font-size:2rem;
  }
  .rem40{
    font-size:3.0rem;
  }
  .rem50{
    font-size:3.5rem;
  }
}
.red {
color:red;
}
.blue{
color:blue;
}
.mycode{
padding: 2px 4px;
font-size: 90%;
color: #c7254e;
background-color: #f9f2f4;
border-radius: 4px;
}
</style>

## 前言

ECharts 是一款功能很強的開源資料視覺化工具，為開發者提供豐富的圖表類型與互動性設計。官方文件是學習 ECharts 的最佳資源。為了幫助讀者快速掌握核心概念與實踐技巧，本文根據 **推薦觀看指數** 將官方文件的內容進行整理與分類，並標註各章節的重要程度，協助讀者快速上手 EChart 的內容

需要注意的是，未提及的部分並不代表不重要，建議讀者自行查閱官方文件，以獲取更全面的資訊。

本文涵蓋以下引導內容

- 快速上手
  - 圖表容器及大小
  - 數據集 (又稱資料集)
  - 數據轉換
  - FAQ
  - 座標軸
  - 圖例
  - 事件與行為
  - 常用圖表類型
  - Canvas vs Svg
- API
  - 補充說明：event 與 action 差別哪裡？
    - 事件 (Event)
    - 動作 (Action)
    - 主要差異比較
    - 綜合範例
- 配置項
- GL 配置
- Example
- 表格工具
- 術語速查手冊

## 快速上手

### 🔹圖表容器及大小 

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐（10 顆星）

必看：因為是圖表初始化的方式

> [圖表容器及大小](https://echarts.apache.org/handbook/zh/concepts/chart-size)

### 🔹數據集 (又稱資料集)

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐⭐（9 顆星）

可以稍微看一下 dataset 和 series 的使用方式差別

簡單敘述如下

- 資料集（dataset）：專門用來管理資料的元件。
- 舊有方式：
  - 每個系列可以透過 `series.data` 設定資料。
- 從 ECharts 4 開始的建議：
  - 優先使用資料集（dataset）來管理資料。
- 使用資料集的好處：
  - 資料可以被多個元件共用。
  - 更容易實現「資料與其他設定分離」的配置方式。
- 原因：
  - 在執行時，資料通常是最常變動的部分。
  - 其他設定通常維持不變，分離管理能提升靈活性與效率。

> [數據集](https://echarts.apache.org/handbook/zh/concepts/dataset)

### 🔹數據轉換

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐（7 顆星）

有點像是 EChart 提供一種 mapping 資料或者資料拆分來形成另外一種資料格式

Apache ECharts™ 5 引入「資料轉換」功能，能以宣告式方式根據轉換方法（如篩選、排序等）生成新的資料集，並用於多樣化的圖表繪製與資料處理。

> [數據轉換](https://echarts.apache.org/handbook/zh/concepts/data-transform)

### 🔹FAQ

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐（8 顆星）

實用性說明：對解決常見問題非常有幫助，但實用性取決於實際使用情境。

如果你使用 Vue，務必查看 FAQ 的 <span style="color:red;">其他</span> 部分

![image](https://hackmd.io/_uploads/HkQlhRRXye.png)


> - [FAQ](https://echarts.apache.org/zh/faq.html)  
> - [已解決的 Vue3 支援問題](https://github.com/apache/echarts/issues/17723#issuecomment-1268311307)  
> - [Vue 文件：markRaw](https://cn.vuejs.org/api/reactivity-advanced#markraw)

### 🔹座標軸

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐ (9 顆星)

![image](https://hackmd.io/_uploads/HyXMnA0Qyl.png)

對於理解 ECharts 擁有座標軸相關圖表有幫助。

[座標軸](https://echarts.apache.org/handbook/zh/concepts/axis)

### 🔹圖例

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐（8 顆星）

適合學習如何進一步優化圖表的展示效果。

[圖例](https://echarts.apache.org/handbook/zh/concepts/legend)

### 🔹事件與行為

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐（9 顆星）  

如果有使用互動行為的話，觀看後可以對互動性圖表設計的幫助極大，尤其是需要客製化操作時。

[事件與行為](https://echarts.apache.org/handbook/zh/concepts/event)

### 🔹常用圖表類型

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐（10 顆星）

常用的圖表類型都可以看一看，提供了基礎圖表的範例與詳細解說。

如下

- 長條圖
- 折線圖
- 圓餅圖
- 散點圖

[常用圖表類型](https://echarts.apache.org/handbook/zh/how-to/chart-types/bar/basic-bar)

### 🔹Canvas vs Svg

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐（7 顆星)

預設使用 Canvas 渲染，看情況可以選擇使用 SVG 渲染，這裡內容有涵蓋 SVG 與 Canvas 的選擇考量點。

> [canvas vs svg](https://echarts.apache.org/handbook/zh/best-practices/canvas-vs-svg)

## API 

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐（9 顆星）  

API 主要 主要分為以下四個部分，其中第三部分和第四部分補充說明了 `eChartInstance.dispatchAction` 和 `eChartInstance.on` 的功能與使用方式。

1. eCharts (Global 物件)  
   - 可透過 `import * as echarts from 'echarts'` 引入。  
   - 提供全域方法，例如：  
     - `init`：初始化圖表。  
     - `connect`：連接多個圖表以進行聯動操作。  
     - `dispose`：銷毀圖表並釋放資源。

2. eChartInstance (圖表實例)  
   - 透過 `echarts.init` 方法建立的圖表實例。  
   - 提供操作圖表的功能，例如：  
     - `setOption`：設置或更新圖表配置。  
     - `resize`：重新調整圖表大小。  
     - `getOption`：獲取當前圖表配置。

3. action (行為操作)  
   - 使用圖表實例 (eChartInstance) 的 `dispatchAction` 方法來觸發交互行為。  
   - 支援的行為範例：  
     - 高亮某數據 (`highlight`)。  
     - 縮放或平移圖表 (`dataZoom`)。  
     - 重置圖表 (`restore`)。

4. events (事件監聽)  
   - 使用圖表實例 (eChartInstance) 的 `.on` 方法監聽圖表事件。  
   - 可捕捉的互動事件例如：  
     - `click`：點擊事件。  
     - `mouseover`：滑鼠懸停事件。  
     - `legendselectchanged`：圖例選擇狀態變更事件。
> [文件 API](https://echarts.apache.org/zh/api.html#echarts)


### 🔹補充說明 : event 與 action 差別哪裡？

在 ECharts 中，事件 (event) 和 動作 (action) 是兩個不同的概念，主要的區別在於它們的觸發來源與作用方向不同。

<span class="blue rem25">事件 (Event)</span>

- 事件 是由 外部觸發 的，通常來自使用者的操作（如滑鼠點擊、滑鼠移動）或圖表內部狀態的改變。
- 特點：
  - 觸發來源：外部操作或內部變化。
  - 監聽方式：透過 `chart.on()` 註冊事件監聽器。
  - 用途：用來響應使用者的操作，例如點擊圖表後顯示詳細資料。
  - 常見事件：
    - `click`：使用者點擊圖形時觸發。
    - `mouseover`：滑鼠移到圖形上時觸發。
    - `legendselectchanged`：圖例的選中狀態改變時觸發。
- 範例：
```javascript
// 監聽使用者點擊事件
myChart.on('click', function (params) {
    console.log('事件觸發：', params);
});
```

- 典型場景：
當使用者點擊圖表中的某個元素時，應用程式可以根據事件資訊進行相應操作，如彈出詳細資訊框或更新其他部分的視圖。

<span class="blue rem25">動作 (Aciton) </span>
- 動作 (Action)
動作 是由 程式內部觸發 的，用來主動改變圖表的狀態或執行某些內建行為。
- 特點：
  - 觸發來源：程式邏輯。
  - 執行方式：透過 `chart.dispatchAction()` 主動呼叫動作。
  - 用途：用於程式主動控制圖表的行為，例如模擬使用者操作或更新圖表狀態。
  - 常見動作：
    - `highlight`：高亮某個圖形元素。
    - `legendSelect`：選中某個圖例。
    - `dataZoom`：調整縮放範圍。
    - `showTip`：顯示提示框。

- 範例：
```javascript
// 主動執行高亮動作
myChart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: 2
});
```
- 典型場景：
當資料或狀態變化時，程式可以透過動作更新圖表狀態，例如在滑鼠移入某個列表項時高亮對應的圖表元素。

<span class="blue rem25 ">主要差異比較</span>

| 特性     | 事件 (Event)                     | 動作 (Action)                      |
| -------- | -------------------------------- | ---------------------------------- |
| 觸發方式 | 使用者的操作或圖表內部變化       | 程式內部主動呼叫                   |
| 觸發來源 | 外部（例如滑鼠點擊、滑鼠移動）   | 內部（程式邏輯）                   |
| 使用方法 | `chart.on()` 註冊事件監聽器      | `chart.dispatchAction()` 呼叫動作  |
| 作用方向 | 從圖表傳遞到程式外部（觸發邏輯） | 從程式傳遞到圖表內部（更新狀態）   |
| 典型用途 | 響應使用者操作（如點擊、選中）   | 主動改變圖表的狀態（如高亮、縮放） |

<span class="blue rem25">綜合範例</span>

以下範例展示了事件與動作的互動：

```javascript

// 監聽點擊事件
myChart.on('click', function (params) {
    console.log('使用者點擊了：', params);

    // 使用者點擊後，程式主動執行動作高亮點擊的資料點
    myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex
    });
});
```

## 配置項

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐（10 顆星）

對於 eChartInstance 的 setOption 方法詳細說明

透過 `setOption` 方法可設定圖表實例的配置與資料，這是一個通用的接口，所有參數與資料的更新皆可透過此方法完成。ECharts 會將新的參數與資料進行合併，並重新渲染圖表。如果啟用了動畫，ECharts 會自動比對新舊數據的差異，並以適當的動畫呈現數據變化。

## GL 配置

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐（6 顆星）

若有需要 3D 圖表功能需要參考的文件

需額外安裝 [echarts-gl](https://github.com/ecomfe/echarts-gl)

> [GL 配置](https://echarts.apache.org/zh/option-gl.html#globe)

## Example

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐（10 顆星）
（內容多樣且豐富，是學習與參考的最佳資源。）

> [Example](https://echarts.apache.org/examples/zh/index.html)

## 表格工具  

推薦觀看指數：⭐⭐⭐⭐⭐⭐（6 顆星）  

eCharts 表格工具是一個提供 GUI 操作的工具，用於將表格數據快速轉換為 JSON 或 JavaScript 格式的資料物件，方便用戶直接貼上資料並快速生成所需的格式。

> [表格工具](https://echarts.apache.org/zh/spreadsheet.html)

## 術語速查手冊

推薦觀看指數：⭐⭐⭐⭐⭐⭐⭐⭐（8 顆星）

（快速查找 ECharts 相關術語，適合開發者使用。）

![image](https://hackmd.io/_uploads/By5V300Qyg.png)

可以透過圖行的介面快速查詢配置手冊，透過選圖表後，右邊可以看到查看配置手冊即可跳轉到 該 API 詳細說明。

> [術語速查手冊](https://echarts.apache.org/zh/cheat-sheet.html)
