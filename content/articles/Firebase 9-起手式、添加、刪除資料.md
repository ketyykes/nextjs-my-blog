---
title: Firebase 9-起手式、添加、刪除資料
slug: 2021-12-30T13:31:00.000Z
date: 2021-12-30T13:31:00.000Z
tags: ["Firebase","Javascript"]
---

Firebase 節省掉後端複雜的伺服器建置，作為 NodeJs 及 MongoDB 的另外一種替代品，使我們製作產品的時候更專注於前端開發大部分的功能對於小型個人網站可以免費使用。

> [官網的範例程式碼](https://firebase.google.com/docs/firestore/quickstart#swift) 
> [firebaseLite](https://firebase.google.com/docs/firestore/solutions/firestore-lite)

## version8 與 9 的差別

官網說明如下

<br>

Firebase provides two SDK versions for Web apps:

- Version 8. This is the JavaScript interface that Firebase has maintained for several years and is familiar to Web developers with existing Firebase apps. Because Firebase will remove support for this version after one major release cycle, new apps should instead adopt version 9.
- Modular version 9. This SDK introduces a modular approach that provides reduced SDK size and greater efficiency with modern JavaScript build tools such as webpack or Rollup.

版本 9 使用模組化系統，更好的支援現代化的 Javascript 工具像是 Webpack 或 Rollup，透過 bundle 可以達到良好的 tree shaking 減少程式碼體積。

> [firebase9 與 8 差異說明](https://firebase.google.com/docs/web/learn-more) 
> [firebase9 與 8 寫法上差別](https://firebase.google.com/docs/web/learn-more#web-version-9_1)

## Firebase 官網建立新專案

[firebase 官方網站](https://firebase.google.com/)
![](https://i.imgur.com/NdNtXJB.png)

右上角點**Go to console**(或點**Get started**)

選擇 [firebase 新增專案](https://console.firebase.google.com/)

![](https://i.imgur.com/DBAAMNi.png)

輸入專案名稱

![](https://i.imgur.com/AKLa3Jj.png)

等待興建完畢後

![](https://i.imgur.com/apJybSJ.png)

按下<font color="red">`</>`</font> 新增網頁應用程式

![](https://i.imgur.com/Klxr2Vm.png)

輸入應用程式暱稱後，可以不用勾應用程式設定託管服務

![](https://i.imgur.com/7aOuGGb.jpg)

回到**主控台**後按下**齒輪**

![](https://i.imgur.com/29E7bD9.png)

在**一般設定**底下的**網頁應用程式**選擇 **設定**可以看到 API 金鑰

![](https://i.imgur.com/kozxaWC.jpg)

由於上圖有提到<font color="red">必須先初始化 firebase</font>，在使用初始化的 function 的時候先載入 initializeApp 模組
因此回到 vs code 上面在 src 裡面新增一個 index.js 檔案

```javascript{numberLines: true}
import { initializeApp } from 'firebase/app' //載入初始化的模組


const firebaseConfig = {
    apiKey: "略",
    authDomain: "略",
    projectId: "略",
    storageBucket: "略",
    messagingSenderId: "略",
    appId: "略"
  };//將相關APIKey和權限等等的設定參數存入至firebaseConfig變數
initializeApp(firebaseConfig)//將設定參數帶入初始化function
```

## firebase 控制台建立資料庫

回到 firebase 控制台，點擊左方的**firestore Datebase** 然後右邊選擇建立資料庫

![](https://i.imgur.com/fOm0Clj.png)

記得選擇測試模式以便訪問你自己的資料庫，換句話說在生產模式當中讀寫時需要遵照你先前設定的安全性規則。

![](https://i.imgur.com/mOlFg8p.png)

設定好伺服器位置

![](https://i.imgur.com/7HpeHId.png)

接下來我們點選左邊的**FireStore DataBase**就可以看到資料庫被分成**集合(collection)**和**文件(document)**

![](https://i.imgur.com/zXS5lfN.jpg)

按下**新增集合**給定好名字之後

![](https://i.imgur.com/6rqjtni.png)

下一步我們可以新增欄位例如給定一個標題和價格(假設他是一本書)

![](https://i.imgur.com/r4Ff1E4.jpg)

這邊預先建立了 collection 是 screen，裡面的 document 是 screen 的物件如圖 key 是品牌和價格

![](https://i.imgur.com/McZGzcc.png)

## 單次獲取儲存在 firstore 的資料

由於使用的是 friebase 的雲端服務，因此需要從 firebase/firestore 引入 getFirestore 模組

![](https://i.imgur.com/4W2NTAL.png)

> [引入 cloud 模組](https://firebase.google.com/docs/firestore/quickstart#set_up_your_development_environment) > [獲取單次的資料](https://firebase.google.com/docs/firestore/query-data/get-data)

```javascript{numberLines: true}
import { initializeApp } from 'firebase/app'
import {getFirestore , collection , getDocs, addDoc,deleteDoc } from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "略",
    authDomain: "略",
    projectId: "略",
    storageBucket: "略",
    messagingSenderId: "略",
    appId: "略"
  };
  initializeApp(firebaseConfig)
  const db = getFirestore()
  const colRef = collection(db,'screen')

  // 1.得到資料
  getDocs(colRef)
    .then((el) =>{
      console.log(el)
      console.log(el.docs)
      let screen = []
      el.docs.forEach((doc)=>{
        screen.push( {...doc.data()
          ,id: doc.id
        })
      })
      console.log(screen)
    })
    .catch((err) =>{
      console.log(err.message)
    })
```

## 添加資料或刪除資料

在**html**的部分建立表單如下

```html{numberLines: true}
<form class="add">
    <label for="brand">brand:</label>
    <input type="text" name="brand"  required>
    <label for="price">price:</label>
    <input type="number" name="price"  required>
    <button type="submit">新增一筆資料</button>
</form>
<form class="delete">
    <label for="id">資料的ID</label>
    <input type="text" name="id"required>
    <button type="submit">刪除一筆資料</button>
</form>
```

在**Javascript**的部分添加如下程式碼

```javascript{numberLines: true}
import { initializeApp } from 'firebase/app'
import {getFirestore , collection , getDocs, addDoc,deleteDoc } from 'firebase/firestore'
//引入的時候記得引入和deleteDoc
const firebaseConfig = {
    //省略
    //省略
    //省略
};
  initializeApp(firebaseConfig)
  const db = getFirestore()
  const colRef = collection(db,'screen')
  const deleteScreenForm = document.querySelector('.delete')
  deleteScreenForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const docRef = doc(db,'screen',deleteScreenForm.id.value)
    deleteDoc(docRef)
      .then(()=>{
        deleteScreenForm.reset()
      })
  })
```

> 刪除資料比較需要值得注意的地方是如果你的 document 裡面還有 collection 刪除父層仍然能夠透過對的路徑取得子層

![](https://i.imgur.com/W1HJKCd.png)

## 使用 CDN 方式

![](https://i.imgur.com/gv8YALV.png)

官網建議使用綑綁工具例如**rollup**或**webpack**來用 firebase，但是也可以使用 CDN 方式說明如下

> [CDN or Node.Js 使用方式文件](https://firebase.google.com/docs/web/alt-setup#from-the-cdn)

