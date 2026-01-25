---
title: 使用App Script串接GoogleSheet發送API
slug: 2022-01-26T08:30:00.000Z
date: 2022-01-26T08:30:00.000Z
tags: ["App Script","Google Sheet","Javascript"]
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


## 從 Google 雲端硬碟建立 App Script 並印出 Hello World

![](https://i.imgur.com/SpeesqH.png)

現在可以嘗試著使用 Logger.log 印出 hello world
程式碼如下

![](https://i.imgur.com/bl53SW9.png)

記得先儲存該 AppScript(快捷鍵 Ctrl+S)後再點擊**執行**

畫面就如下
![](https://i.imgur.com/kiWD4z1.png)
<span class="red rem25">注意：</span>Logger 僅是輕量級的實時的 log，若要使用 console.log()或是長時間紀錄 log，參照[官方 GCP 雲端伺服器的說明](https://developers.google.com/apps-script/guides/logging)

## 從 App Script 讀取 Google Sheet 資料

到你的 GoogleSheet 的網址列可以得知你的 ID

在 d/後面到下一個斜線前就是這個 Google Sheet 的 ID

![](https://i.imgur.com/irEzs2K.jpg)

接下來撰寫下列程式碼到 AppScirpt

```javascript{numberLines: true}
function myFunction() {
  const id = "你的google sheet ID";
  const sheet = SpreadsheetApp.openById(id).getSheetByName('doPostDoGetEx01');
    //getSheetByName函式裡面是你的table名字
  const data = sheet.getDataRange().getValues();
    //getDataRange選擇資料的範圍
    //getValues得到該資料範圍的值
  Logger.log(data);
}
```

如下圖 table 名字叫做 doPostDoGetEx01

![](https://i.imgur.com/h6DCeAj.png)

接下來按下**執行**

他會問你審查權限就是按下去後，讓 google sheet 帳號本人同意

![](https://i.imgur.com/9i9WrzP.png)

按下帳號登入後會跳出如下訊息

![](https://i.imgur.com/vZNC6xG.jpg)

按下**進階**

再按下**前往「你的 AppScript 專案的名字」(不安全)**

![](https://i.imgur.com/rmTXiNF.png)

最後按下**允許**

![](https://i.imgur.com/v50vFlT.png)

由於剛剛有在 Logger.log(data)

就能得到 sheet 的資料

![](https://i.imgur.com/LClB1i5.png)

## 從 App Script 寫入 Google Sheet 資料

輸入以下的程式碼

```javascript{numberLines: true}
function myFunction() {
    const id = "你的id";
    const sheet = SpreadsheetApp.openById(id).getSheetByName('doPostDoGetEx01');
    const data = sheet.getRange(4,5).setValue("test");
    //getRange選取一個資料範圍
    // 如下帶入(4,5)就是對第4列第5行執行
    // 要添加值可以用setValue("你要設定的值")
    Logger.log(data);
}
```

到 google sheet 應當可以看到第 4 列第 5 行增加了一個 test 的值

## 使用 AppScript 發送 Get 的 API

### 在 AppScript 撰寫 API

如果要讓前端的網頁 fetch 資料(也叫做發 request)或者 Postman 發送 request 的話，在 AppScript 就要使用<b>doGet()</b>這個特殊函式。

當有人使用 GET 的 Method 發送請求(也就是 request)的時候，就會執行 doGet 函式
最簡單的回傳 hello world 字串如下

```javascript{numberLines: true}
function doGet(e) {
    return ContentService.createTextOutput('Hello, world!');
}
```

我們嘗試建立一 object 裡面含有 name 和 age 並且設定 Mime 的類型要 JSON 檔案格式，因此程式碼如下

```javascript{numberLines: true}
function doGet(e) {
  const obj = {
    name:"小明",
    age:13
  }
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
    //使用setMimeType函式 裡面帶入要回傳的型態
    //這邊使用ContentService.MimeType.JSON，也就是回傳成JSON格式
}
```

### 部署 API

接下來進行**部署**以便讓 Postman 或前端的 axios、fetch 可以接到資料
點擊部署 → 新增部署作業

<span class="rem25">step1.新增部署</span>

![](https://i.imgur.com/gyWd5xR.png)

<span class="rem25">step2.部署成網頁應用程式</span>

左邊選取類型的齒輪 → 網頁應用程式

![](https://i.imgur.com/EuAdHd2.png)

<span class="rem25">step.3 開啟所有人權限</span>

誰可以存取的地方選擇<span class="red rem25">所有人</span>→ 部署

![](https://i.imgur.com/5raSWX8.png)
<span class="rem25">step3.部署成功</span>

最後應當可以看到一串網址

![](https://i.imgur.com/DpCH3Ce.jpg)

<span class="rem25">step4.使用 Postman 發送請求</span>

將剛剛的網址複製到 Postman 選擇 GET 方法應當可以得到剛剛發布的 API

![](https://i.imgur.com/7WqJoPO.png)

## 使用 AppScript 發送 Post 的 API

### 使用 form-data 格式

doPost 或者 doGet 是 App Script 特有的函式，其中 doGet 和 doPost 的 e 參數也是 AppScript 特有的參數，他用來接收像是前端、Postman、發 request 者，所夾帶的內容參數。
詳細可以參考[GoogleAppScriptAppScript 文件](https://developers.google.com/apps-script/guides/web)

我們輸入以下程式碼

```javascript{numberLines: true}
function doPost(e) {
    return ContentService.createTextOutput(JSON.stringify(e.parameter)).setMimeType(ContentService.MimeType.JSON);
    //我們使用e.parameter來得到傳送過來的參數，為了方便知道是否有接收到參數，所以這邊return回去給發送API方。
}
```

接下來這邊使用 Postman 發送 Post 請求，Body 這邊使用**form-data**的格式，分別帶入**key**和**value**，這時候就能在畫面上面看到你發送過去的請求了。

![](https://i.imgur.com/iy99TEN.jpg)

### POST 的各種方法

先前介紹使用 form-data 的方式，app script 也支援其他的格式可以接受到前端所送的資料

為了方便比較其差異性這邊 doPost 回傳都是 e
撰寫以下程式碼在 app script

```javascript{numberLines: true}
function doPost(e) {
    return ContentService.createTextOutput(JSON.stringify(e)).setMimeType(ContentService.MimeType.JSON);
}
```

#### 方法一 使用 form-data 格式

在 postman 帶入如下
![](https://i.imgur.com/tsH0v8l.png)

e 會回傳的內容如下

```json
{
    "contextPath": "",
    "queryString": "",
    "parameter": {
        "price": "100",
        "fruit": "apple"
    },
    "parameters": {
        "price": [
            "100"
        ],
        "fruit": [
            "apple"
        ]
    },
    "contentLength": 272
}
```

#### 方法二-使用 x-www-form-urlencoded

在 postman 帶入如下
![](https://i.imgur.com/AIVXq4d.png)

e 的回傳結果如下

```json
{
    "postData": {
        "contents": "fruit=apple&price=100",
        "length": 21,
        "name": "postData",
        "type": "application/x-www-form-urlencoded"
    },
    "contextPath": "",
    "parameter": {
        "price": "100",
        "fruit": "apple"
    },
    "queryString": "",
    "contentLength": 21,
    "parameters": {
        "price": [
            "100"
        ],
        "fruit": [
            "apple"
        ]
    }
}
```

#### 方法三-使用 text/plain

在 postman 帶入如下
![](https://i.imgur.com/ynG1VSa.png)

e 的回傳結果如下

```json
{
    "parameter": {},
    "contextPath": "",
    "queryString": "",
    "parameters": {},
    "postData": {
        "contents": "fruit=apple&price=100",
        "length": 21,
        "name": "postData",
        "type": "text/plain"
    },
    "contentLength": 21
}
```

