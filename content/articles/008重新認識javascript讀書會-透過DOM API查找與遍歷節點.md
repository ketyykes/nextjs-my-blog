---
title: 008 重新認識 Javascript 讀書會 - 透過 DOM API 查找與遍歷節點
slug: 2021-12-31T07:24:00.000Z
date: 2021-12-31T07:24:00.000Z
tags: ["008 重新認識 Javascript 讀書會","Javascript"]
---

本篇為參與 0 陷阱！0 誤解！8 天重新認識 Javascript 讀書會的導讀內容加上自己所蒐尋的資料後所構成的文章。

- 瀏覽器會分析 HTML 後將其解析成**DOM(Document Object Model) 文件物件模型**
- DOM 是 W3C 制定的一個規範
- 控制 DOM 等同於控制網頁

## `<script>`位置

由於瀏覽器讀入 html 是從第一行開始讀取，因此若 html 尚未載入進而執行 DOM 操作時，javascript 會找不到相對應的 html 也就無法操作。


###### 測試一下放的位置吧~

## DOMtree 圖

![](https://i.imgur.com/K3VK9k3.png)

## 常用的 DOM 操作

```javascript{numberLines: true}
// 根據傳入的值，找到 DOM 中 id 為 'xxx' 的元素。
document.getElementById('xxx');

// 針對給定的 tag 名稱，回傳所有符合條件的 NodeList 物件
document.getElementsByTagName('xxx');

// 針對給定的 class 名稱，回傳所有符合條件的 NodeList 物件。
document.getElementsByClassName('xxx');

// 針對給定的 Selector 條件，回傳第一個 或 所有符合條件的 NodeList。
document.querySelector('xxx');
document.querySelectorAll('xxx');
```

## nodeType 參照

![](https://i.imgur.com/vf38huT.png)

nodeType 得到的是一個數字，可以參考 MDN 對照內容知道是哪些東西。

> [MDNnodeType](https://developer.mozilla.org/zh-TW/docs/Web/API/Node/nodeType)

## DOM 節點間的查找遍歷 (traversing)

遍歷 traversing 可以翻譯成走訪，換句話說是透過某個節點當起始點，透過 DOM 的操作方法得到其他節點的一種行為。

- 父子關係
  每一個節點都會有個上層的節點，我們稱之為父節點 (Parent node)，自己下層的節點稱之為子節點 (child node)
- 兄弟關係
  有同一個「父節點」的節點，我們稱之為「兄弟姊妹」節點 (Siblings node)

## Node.childNodes

可以透過 node.hasChildNode() 來檢查是否有子節點

```javascript{numberLines: true}
var node = document.querySelector('#hello');

// 如果 node 內有子元素
if( node.hasChildNodes() ) {

    // 可以透過 node.childNodes[n] (n 為數字索引) 取得對應的節點
    // 注意，NodeList 物件內容為即時更新的集合
    for (var i = 0; i < node.childNodes[i].length; i++) {
      // ...
    };
}
```

## 走訪 DOM 操作方法

![](https://i.imgur.com/4tvWdLO.png)

Node.childNodes 回傳的可能會有這幾種：

- HTML 元素節點 (element nodes)
- 文字節點 (text nodes)，包含空白
- 註解節點 (comment nodes)

> [MDN-Node](https://developer.mozilla.org/zh-TW/docs/Web/API/Node)

## 使用 Element 的方法

使用使用 Element 的方法，可以專注在 Element 的操作上
[MDN-Element 的方法](https://developer.mozilla.org/en-US/docs/Web/API/Element)

## NodeList 非陣列

NodeList 屬於一種類陣列，但並非為實際陣列，因此沒有 forEach 或者 map 的方法
所以我們可以用 for 迴圈遍歷

## querrySelector 和 getElement 系列的差異

### 動態與靜態差別

querrySelector 屬於靜態查詢
getElement 屬於動態查詢
當使用 javascript 新增一些節點的時候，querrySelector 系列無法選擇到這些節點
反之 getElement 系列可以

### HTMLCollection 和 NodeList 差別

使用 getElemets 系列收集到的是 HTMLCollection
使用 querrySelector 收集到的是 NodeList

```javascript{numberLines: true}
const node = document.getElementsByTagName('h1')
const node2 = document.querySelectorAll('h1')
console.log(node);
console.log(node2);
```

### 另外注意 getElements 有的有 s 結尾

