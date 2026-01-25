---
title: App Script with Google sheet
slug: 2022-02-01T02:31:00.000Z
date: 2022-02-01T02:31:00.000Z
tags: ["App Script","Google Sheet","Javascript"]
---


## 建立 google sheet

建立一個 Sheet，會問你審查權限之類的基本上都是允許就對了。

```javascript{numberLines: true}
function myFunction() {
  SpreadsheetApp.create("My Spreadsheet");
}
```

## AppScript 訪問 GoogleSheet 的三種方式

```javascript{numberLines: true}
//第一種建立一個新的sheet並打開
SpreadsheetApp.create(name,[rows,columns])
//第二種藉由Id打開sheet
SpreadsheetApp.openByid(id)
//第三中藉由Sheet的Url打開sheet
SpreadsheetApp.openByUrl(url)
```

再任何一個 GoogleSheet 網址中，藍色區塊段是 id，整段則稱之為 url
<font color="red">`https://docs.google.com/spreadsheets/d/`</font><font color="blue">`1CDENb2ShKiSnZletGohNjscyYPVJ3IxRK2n8o93KM5kfo`</font>`/edit#gid=0`

### SpreadsheetApp.create 函式裡的參數

```javascript{numberLines: true}
SpreadsheetApp.create(MyFirstSheet,100,50)
//第一個參數是Sheet的名稱，第二個是Sheet的列，第三個是Sheet的行
```

## 使用應用程式驅動器來打開 GoogleSheet

程式碼範例如下
使用的是另一個應用程式驅動器，因此會再次要求審查權限。

```javascript{numberLines: true}
function myFunction(){
    SpreadsheetApp.open(DriveApp.getFilesByName('My Other Spreadsheet').next())
}
```

## AppScrip 訪問工作表(table)的三種方法

要先指定某個 sheet 然後再指定某個 table
因此程式碼應當會如下

```javascript{numberLines: true}
SpreadsheetApp.openByid(id).getSheetByName(name)
//指定某個sheet的id 和某個table的名字

//以下是指定某個sheet id後所做的事情

getSheetByName(name)
//藉由名稱取得某個table
getSheets()
//取得所有的table，回傳將會是一個陣列形式
insertSheet([sheetName,sheetIndex,options])
//對sheet插入一個新的table
```

### 取名稱為 Sheet1 的 table

程式碼如下

```javascript{numberLines: true}
const spreadsheet = SpreadsheetApp.openByid('你的ID');
spreadsheet.getSheetByName('Sheet1')
//getSheetByName函式裡面帶入table的名字
```

### 插入一個 table 位置為 1 且使用 Sheet 作為模板

可以藉由輸入第三個參數，而參數內容需要帶入某個 table 來做為模板
物件內容的 key 是 template，value 是你的模板來源

程式碼範例如下

```javascript{numberLines: true}
const spreadsheet = SpreadsheetApp.openByid('你的ID');
spreadsheet.insertSheet('NewYork',1,{template:spreadsheet.getSheetByName('Sheet1')})
```

## 得到 table 裡面的資料的四種方法

```javascript{numberLines: true}
getRange()
getValue() //可以有s
getSheetValues()
getDataRange()
```

### getRange 操作方法

能帶入 4 個參數
getRange(列,行,列數,行數)
換句話說從第幾列，第幾行開始操作，然後總共操作幾列和幾行。

```javascript{numberLines: true}
const spreadsheet = SpreadsheetApp.openById('你的ID');
const sheet1 = spreadsheet.getSheetByName('Sheet1');
const range = sheet1.getRange(2,1,1,4);
range.getValue();//在某個範圍得到值
```

### getSheetValues 的操作方法

上面範例都是先得到範圍，然後再得到值，也就是像這樣`getRange(a,b,c,d).getValues()`
可以透過 getSheetValues 這個函式簡化上面這兩個函式的方法鏈。

```javascript{numberLines: true}
const spreadsheet = SpreadsheetApp.openByid('你的ID');
const sheet1 = spreadsheet.getSheetByName('Sheet1');
sheet1.getSheetValues(2,1,1,4)
//上面getRange操作方法的範例與這個範例應當會得到相同的值
```

## 設定 googleSheet 值的兩種方法

### setValue 設定單一值

帶入一個字串

```javascript{numberLines: true}
const spreadsheet = SpreadsheetApp.openByid('你的ID');
const sheet1 = spreadsheet.getSheetByName('Sheet1');
const range = sheet1.getRange(3,1,1,1);
range.setValue("happy");
```

> 如果原本表格內有資料的話就會進行**覆蓋**

### setValues 設定多個值

帶入的是一個陣列

```javascript{numberLines: true}
const spreadsheet = SpreadsheetApp.openByid('你的ID');
const sheet1 = spreadsheet.getSheetByName('Sheet1');
const range = sheet1.getRange(3,1,1,4);
range.setValues =([['Timmy','Student','24','man']]);
```

> 如果原本表格內有資料的話就會進行**覆蓋**

## 得到最後一行或最後一列

### getLastRow 和 getLastColumn

將會回傳一個數字代表最後一列

```javascript{numberLines: true}
const spreadsheet = SpreadsheetApp.openByid('你的ID');
const sheet1 = spreadsheet.getSheetByName('Sheet1');
Logger.log(sheet1.getLastRow());
Logger.log(sheet1.getLastColumn());
```

使用 getLastRow(或 getLastColumn)優點是可以不用知道現在 sheet 擁有幾列(或行)，再新增資料的時候可以配合`getRange(sheet1.getLastRow()+1,1,1,1);`新增。

## 得到最大行數或最大列數

### getMaxRows()和 getMaxColumns();

與 getLastRow 不同的是 getMaxRows 代表整個工作表有幾列，而 getLastRow 是代表有資料的地方有幾列。

```javascript{numberLines: true}
const spreadsheet = SpreadsheetApp.openByid('你的ID');
const sheet1 = spreadsheet.getSheetByName('Sheet1');
Logger.log(sheet1.getMaxRows());
Logger.log(sheet1.getMaxColumns());
//觀看整個工作表的列數和行數。
```

> 言外之意：我們可以利用撰寫邏輯的方式刪除掉沒有資料的空白表格讓畫面更精簡。使用`sheet1.deleteColumns()`來刪除。

## copyTo

copy 除了放入範圍以外，也可以放入是否要將公式也複製。

> [官方 Range 底下的 copyTo](https://developers.google.com/apps-script/reference/spreadsheet/range?hl=en) > [官方 Range.copyTo](<https://developers.google.com/apps-script/reference/spreadsheet/range?hl=en#copyTo(Range,CopyPasteType,Boolean)>)

```javascript{numberLines: true}
const spreadsheet = SpreadsheetApp.openByid('你的ID');
const sheet1 = spreadsheet.getSheetByName('Sheet1');
let range = sheet1.getRange(1,1,3,3);
range.copyTo('給定一個range');
```

