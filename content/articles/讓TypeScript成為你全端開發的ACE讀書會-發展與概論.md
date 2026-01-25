---
title: 讓TypeScript成為你全端開發的ACE讀書會-發展與概論
slug: 2023-02-25T13:31:00.000Z
date: 2023-02-25T13:31:00.000Z
tags: ["TypeScript"]
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
    font-size:2.25rem;
  }
  .rem50{
    font-size:2.5rem;
  }
}
.red {
color:red;
}
.blue{
color:blue;
}
.code{
background-color:#f7f7f7;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>

本篇參與讓TypeScript成為你全端開發的ACE讀書會所做的筆記加上自己所蒐尋的資料理解後所構成的筆記。

## TypeScript的發展愈概論

## 1.1 Typescript簡介

- typescript是javascript的超集(superset)
  - (意思是比Javascript多一點)
- 由於Js是以ECMAScript標準發展為最基準，因此Typescript也需要參照ECMAScript標準的支援度
- Javascript本身的語言特性是Typescript合法的語言特性

<span class="rem25">補充資料-什麼是超集?</span>

> 如果一個集合S2中的每一個元素都在集合S1中，且集合S1中可能包含S2中沒有的元素，則集合S1就是S2的一個超集，反過來，S2是S1的子集。
> 參考來源[百度百科-超集](https://baike.baidu.hk/item/%E8%B6%85%E9%9B%86/1059571)
> [維基百科-子集](https://zh.wikipedia.org/zh-tw/%E5%AD%90%E9%9B%86)
> 如下圖S1是S2的超集
![](https://i.imgur.com/5CKUbtE.png)

<span class="rem25">補充資料-ES Feature 的相容表 Compatibility Table</span>
> [ES Feature 的相容表 Compatibility Table](https://kangax.github.io/compat-table/es6/)
> 
> ![](https://i.imgur.com/lv413Mn.png)

<span class="rem25">補充資料-ts作者相關</span>

關於作者有興趣的也可參考以下連結
[EP 34: Anders Hejlsberg - creator of Typescript, C# - on programming languages and the power of working on something over a lifetime](https://www.aarthiandsriram.com/p/our-dream-conversation-anders-hejlsberg?sd=pf)

## 1.2 Typescript可以解決什麼樣的問題

### 1.2.1 使用Javascript開發時最常遇到的問題

- 超常行為(Unexpected Behaviour)
  - 有時候程式執行並不會發生任何問題，但可能因為資料格式型別結構錯誤而導致程式出現異常
- 邊緣情境(edge cases)
  - 程式上的行為會出現各種結果，包含呼叫函式或方法、與陌生的第三者服務接觸，但是忘記去處理掉

#### 錯誤從不該沉默

```"Erro should never pass siently"```

<span class="rem25">補充資料-zen of python名言</span>

更多有關其他名言可以參考以下
[Zen of python](https://zh.wikipedia.org/zh-tw/Python%E4%B9%8B%E7%A6%85)

#### 動態語言 vs 靜態語言

- 動態語言(Dynamically)
  - 在程式運性狀態(Run-time)，變數的型別會依據存的值本身來判斷
- 靜態語言(staticly typed language)
  - 程式正在編譯時(compliation)，根據程式宣告的型別來監控型別的狀態。

#### 漸進式型別系統Gradual typing

- 兼具動態與靜態語言特色
  - 程式碼編譯過程中遇到變數會表達式(expression)被顯性註記，這些程式碼在液態編譯過程中被監控。
- 某些沒有被註記的變數或表達式，(Inference)會在程式自行推斷型別的結果 

### 型別註記 & 型別推論

- 型別註記(Type annotation) 對變數或表達式進行文字敘述上的型別宣告動作
- 型別推論(Type Inference) 變數根據被賦予的執行別來表示該變數的型別，而表達式則式運算結果的值的型別來代表整個表達式最後的型別結果。

### 1.2.3 強行別語言 vs 弱型別語言

- 強行別語言(strongly typed)
  - 強型別語言則不允許不符合預期的型別操作，例如python、Ruby將非數字型別的值與另個數的值進行加減乘除
- 弱型別語言(weakly typed)
  - 對於任意型別的操作會自動轉型

<span class="rem25">本小節結論</span>

<span class="red">TypeScript是一門擁有漸進式型別系統(Gradual Typing)的弱型別語言</span>

### 1.2.4 TypeScript改善、解決的開發相關的問題

- 型別系統(type system)
  - 型別註記
    - 使用型別註記功能時，靜態層面監測變數或表達式的型別，在<span class="red">程式未執行前抓出淺在的錯誤</span>  
  - 型別推論
    - 透過型別推論當<span class="red">程式</span>與<span class="red">型別註記</span>功能<span class="red">沒有對應</span>的時候，就會提式錯誤訊息，換句話說避免未設想周全的邊緣情境 

## 1.3學習Type得更好處

### 1.3.1 對於各種不同版本Javascript的編譯

Javascript標準由TC39委員會官方規定。有時候某些瀏覽器只支援到ES5的版本，因此開源社群最著名的像是Babel compiler用來編譯相容於ES5的工具，另外隨著工具的發展也衍生後來整合專案的Webpack和排除未用程式碼功能的Rollup.JS等等。

然而使用Typescript也能編譯成相容於不同版本的Javascript，透過tsconfig.json就能自定義所需要編譯的Javascript版本。

### 1.3.2 Typescript擁有比較完善的物件導向語法

由於Typescritp主要語言設計者anders也是C#的設計者，在物件導向方面的語法也有跟C#相似之處。

### 1.3.3 Typescript定義檔具備使用說明文件的性質

Typescript定義檔 typescript(Definition file)具備以下相關東西
  - 型別化名(Type alias)
  - 介面規格(interface)
  - 命名模組(namespaces)

換句話說定義檔可以作為專案或**套件規格的匯集地**，能夠了解到專案或套件的使用方式
定義檔亦**可作為官方文件查詢提供的功能**

<span class="rem25">什麼是型別定義檔案補充資料</span>
>- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)就是讓你把 型別定義檔案`(*.d.ts)`，釋出到 npm 中，配合編輯器(或外掛)，就能夠檢測到 JS 庫中的靜態型別。
>- 詳細說明也可以參考這篇[DefinitelyTyped 貢獻筆記](https://medium.com/mizyind-singularity/definitelytyped-%E8%B2%A2%E7%8D%BB%E7%AD%86%E8%A8%98-14ff40ad1e0b)
>- [Typescirpt官方文件 declaration file章節](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

<span class="rem25">定義檔案如何安裝</span>

> 定義檔安裝方式可以參考保哥的文章[關於 TypeScript 2.0 之後的模組定義檔 ( Declaration Files ) ( *.d.ts )](https://blog.miniasp.com/post/2016/08/22/TypeScript-Future-Declaration-Files)



### 1.3.4 Typescript 好Hot!

#### Facebook 開源專案 Flow vs 微軟 開源專案 typescript

- flow 
  - 僅型別宣告和檢測的功能
  - 只是一個型別檢查氣
  - 可以在javascript直接使用
- typescript
  - 獨立成型別系統
  - 更多好用的程式語法例如class和namespace 
  - 完整的程式語言

> [FacebookGithub-flow](https://github.com/facebook/flow)

### 1.4.4 命名空間與模組，避不了的學習門檻

<span class="rem25">命名空間補充資料</span>

> 命名空間（英語：Namespace），也稱名字空間、名稱空間等，它表示著一個識別碼（identifier）的可見範圍。一個識別碼可在多個命名空間中定義，它在不同命名空間中的含義是互不相干的。這樣，在一個新的命名空間中可定義任何識別碼，它們不會與任何已有的識別碼發生衝突，因為已有的定義都處於其他命名空間中。
> [維基百科-命名空間](https://zh.wikipedia.org/zh-tw/%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4)

#### 本節重點
- 除了ES6的import/export語法，typescrip還有命名空間(namespace)與模組(moudle)的相關語法。
- 由於TS的標準比起ES6早，因此少數還會看到舊語法(1.5版以前)令人困惑的概念像是內部模組(Internal module)與外部模組(outer module)
- 學習舊語法不一定是為了使用它，但至少要能夠看懂它。

### 1.5旅程中的第一小步(安裝ts與ts-config介紹)

#### 全域安裝typescirpt

全域安裝typescript以便在terminal的任何地方皆可以使用編譯的語法

程式碼如下
```bash
npm install -g typescript
```

#### 建立ts-config檔案

藉由建立ts-config的檔案，其內容為編譯相關的設定，例如要編譯成的Javascript版本、是否產生sourceMap(方便瀏覽器查看ts原始檔案為哪一行code)等等

在terminal輸入以下指令
```bash
tsc --init
```

便會產生tsconfig.json的檔案

#### 更改編譯的JS版本

打開ts-config可以透過以下的內容設定要轉譯的Js版本

```javascript
//以上省略
"target": "es2016", 
   /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
//以下省略
```

#### 編譯檔案

編譯某個副檔名為ts的方式可以透過以下兩種方式

##### 方法一

<span class="red code">tsc 副檔名.ts</span>

例如
```bash
tsc helloworld.ts
```

##### 方法二

如果已經建立**ts-config**檔案的話，可以透過cd移動到對應的資料夾直接輸入<span class="red code">tsc</span>按下<kbd>enter</kbd>即可編譯該資料夾底下的所有檔案

```bash
tsc
```

#### 更改編譯的輸入、輸出路徑

我們可以指定某些資料夾的所有ts檔案需要編譯以及輸出的路徑需要到某些資料夾
找到以下rootDir和outDir的屬性，對其更改內容即可

如下圖
更改了輸入的路徑為src資料夾
更改了輸出的路徑為dist資料夾
```json
    "rootDir": "./src", /* Specify the root folder within your source files. */

    "outDir": "./dist", /* Specify an output folder for all emitted files. */
```

此時輸入tsc編譯後即可產生在對應的資料夾提取ts檔案及輸出成js檔案

![](https://i.imgur.com/CZIyrb2.png)

### 使用Visual Studio Code編譯ts

- 統一修改屬性名稱
  - 滑鼠游標移至屬性名稱上後按下f2修改屬性名字將一併修改有使用的地方
如下圖
![](https://i.imgur.com/CSIFGPa.png)
- 自動補全功能(autocomplete)
- 型別提示(type hint)
  - 滑鼠移至變數函式將會跳出行別提示
- 型別衝突偵測
  - 如果型別衝突的時候即會主動跳出警訊。
- 快入查詢
  - 若想快速看某變數、函式、型別宣告或定義所載內容，將滑鼠移至查詢目標按下ctrl和滑鼠左鍵即可快速導向到該目標。
- 普通js檔案也可型別檢查
  - 在vs code的普通js檔案上方加入以下語法即可使用類似ts的型別檢查功能
```javascript
// @ts-check
```
