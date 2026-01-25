---
title: firebase realtime、query、orderBy、timestamp...
slug: 2022-01-02T13:31:00.000Z
date: 2022-01-02T13:31:00.000Z
tags: ["Firebase","Javascript"]
---

## 使用 realtime

藉由 onSnapshot 函式可以理解成監聽資料狀態，當資料變動的時候觸發該函式執行。

> [使用 realtime 資料](https://firebase.google.com/docs/firestore/query-data/listen)

```javascript{numberLines: true}
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const db = getFirestore()
const colRef = collection(db,'screen')

initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "screen");

onSnapshot(colRef, (el) => {
  console.log(el);
  console.log(el.docs);
  let screen = [];
  el.docs.forEach((doc) => {
    screen.push({ ...doc.data(), id: doc.id });
  });
  console.log(screen);
})
//第一個帶入資料集，第二個帶入callback function 當資料變動後要執行的函式
```

## firebase 簡單查詢

[firebase 官方查詢](https://firebase.google.com/docs/firestore/query-data/queries)

要先 import query、where 函式

```javascript{numberLines: true}
import { initializeApp } from "firebase/app";
import {getFirestore,collection,onSnapshot,addDoc,deleteDoc,doc,query,where} from "firebase/firestore";
initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "screen");
const q = query(colRef ,where("brand","==","ksi"))
//先使用query函式來選擇要查詢的東西，第一個參數帶要查詢的資料集
//where裡面代入三個變數，第一個是物件的key，第二個是邏輯運算子，第三個是value
onSnapshot(q, (el) => {
  console.log(el);
  console.log(el.docs);
  let screen = [];
  el.docs.forEach((doc) => {
    screen.push({ ...doc.data(), id: doc.id });
  });
  console.log(screen);
})
```

## firebase 排序

如果沒有指定排序的情況，預設是使用 id 排序，然而 id 是隨機產生，所以排序也有點像沒有被排序的樣貌

> [官方文件排序範例](https://firebase.google.com/docs/firestore/query-data/order-limit-data) > [官方建立索引教學](https://firebase.google.com/docs/firestore/query-data/indexing?authuser=0#use_the_firebase_console) > [官方建立索引使用 CLI 教學](https://firebase.google.com/docs/firestore/query-data/indexing?authuser=0#use_the_firebase_cli)

在排序之前先去 firebase 控制台的 firestore database 然後選擇索引

![](https://i.imgur.com/uds8Kfz.png)

右下角建立索引按下去

![](https://i.imgur.com/HtHASiX.png)

依序輸入 brand 和 price 都是使用遞增

下列程式碼是以 price 為順序進行升冪排序

```javascript{numberLines: true}
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,orderBy
} from "firebase/firestore";

initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "screen");
const q = query(colRef ,orderBy("price","asc"))
//使用query查詢，第一個帶入要查詢的資料集
//第二個orderBy函式填入要遵照什麼key和排序屬於升冪或降冪(如果降冪是"desc")
onSnapshot(q, (el) => {
  console.log(el);
  console.log(el.docs);
  let screen = [];
  el.docs.forEach((doc) => {
    screen.push({ ...doc.data(), id: doc.id });
  });
  console.log(screen);
})
```

如下圖
![](https://i.imgur.com/ZJrMnJB.png)

除了 where 和 orderBy 以外還有 limit 或者 startAt、startAfter、endAt、endBefore 的方法，詳細可以觀看官網文件
[startAt 之類的範例](https://firebase.google.com/docs/firestore/query-data/query-cursors)

## firebase 時間戳

使用 serverTimestamp 模組來添加時間戳記，一樣先引入該模組，在要執行的地方使用該函式如下列程式碼

```javascript{numberLines: true}
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,orderBy,serverTimestamp
}
const firebaseConfig = {
    //略
};
initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "screen");
const q = query(colRef ,orderBy("timestamp"))
onSnapshot(q, (el) => {
  // console.log(el);
  // console.log(el.docs);
  let screen = [];
  el.docs.forEach((doc) => {
    screen.push({ ...doc.data(), id: doc.id });
  });
  console.log(screen);
})

const addScreenForm = document.querySelector(".add");
addScreenForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(colRef, {
    brand: addScreenForm.brand.value,
    price: Number(addScreenForm.price.value),
    timestamp:serverTimestamp()
  }).then(() => {
    addScreenForm.reset();
  });
});
//也可以使用orderBy來依時間排序
```

之後就會有 timestamp 的物件如下圖
![](https://i.imgur.com/yWAFioO.png)

> [官方文件 serverTimestamp](https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp)

## fetch 單一的資料

獲取單次單一資料

```javascript{numberLines: true}
const docRef = doc (db , 'screen','傳入id')
    getDoc(docRef)
        .then((el)=>{
        console.log(el.data(),doc.id)
    })
```

使用 onSnapshot 模組獲取單一的資料

```javascript{numberLines: true}
const docRef = doc(db,'screen','你的ID')
onSnapshot(docRef,(doc)=>{
    console.log(doc.data())
}
```

## 更新資料

```javascript{numberLines: true}
import {updateDoc} from 'firebase/firestore'
const docRef = doc(db,'screen','你的ID')
onSnapshot(docRef,(doc)=>{
    const docRef = doc(db,'screen','你要更新哪個ID的東西')
    //可以不必傳入所有物件的key和value僅需傳入你要更新的key就可以了。
    updateDoc(docRef, {
        screen:'你要覆寫的名字'
    })
    .then(()={
        //更新完數據後要做的事情
    })
})
```

> 更新 update 資料](https://firebase.google.com/docs/firestore/manage-data/add-data#update-data)

## 其他資料

> [官方 github 的範例](https://github.com/firebase/quickstart-js)

