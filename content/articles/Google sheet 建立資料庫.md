---
title: Google sheet 建立資料庫
slug: 2021-05-01T13:31:00.000Z
date: 2021-05-01T13:31:00.000Z
tags: ["Google Sheet","Backend"]
---

到 google drive 建立 google 試算表

![](https://i.imgur.com/Xfxb24J.png)

點選共用讓開放權限讓所有知道連結者可以檢視
![](https://i.imgur.com/9DNozw0.png)
點選工具 → 指令碼編輯器
![](https://i.imgur.com/oErzaID.png)

之後將以下程式碼複製進去

```javascript{numberLines: true}

function doGet(e){

 //複製你的表單連結
 var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1H2fhVubmRP8ISlHFHhJ9tlESvGyjygPbXGVQMtKdA9Y/edit#gid=0");

//更改你的table 的名字
 var sheet = ss.getSheetByName("test");

 return getUsers(sheet);

}

//以下function是處理表單資料讓他轉成json物件格式

function getUsers(sheet){
  var jo = {};
  var dataArray = [];

//擷取資料範圍從第二列第一行開始到最後一列減一(因為少了第一列)和最後一行然後存到rows這個變數

//此時這個變數是一個陣列

  var rows = sheet.getRange(2,1,sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
  Logger.log(rows);
  for(var i = 0, l= rows.length; i<l ; i++){
    var dataRow = rows[i];
    var record = {};
    //需告record為一個物件 然後將第一行的東西
    record['編號'] = dataRow[0];
    record['名字'] = dataRow[1];
    record['工作'] = dataRow[2];
    //之後會將第一列的東西所構成的資料存成一個物件
    //再用陣列的push方法存到dataArray物件裡面
    dataArray.push(record);
  }

  jo.user = dataArray;

  var result = JSON.stringify(jo);

  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  //將結果給字串化後回傳出去設再設定成JSON格式
}


```

此時執行的時候會顯示需要權限
![](https://i.imgur.com/sxQG8Ne.png)
按下審查權限 允許 進階 允許 就是了。

最後再按下部署 → 新增部署作業

![](https://i.imgur.com/1RFulDb.png)
按下選取類型旁邊的齒輪
選擇網頁應用程式
![](https://i.imgur.com/SvlpkFm.png)
底下 誰可以存取 選擇 "所有人" 最後完成
![](https://i.imgur.com/zEABTrJ.png)

最後將底下的網址在 postman 進行 API 呼叫測試就可以了

