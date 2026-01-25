---
title: AppScript Lock service–避免 concurrency、多用戶執行時資料被同時覆寫等等
slug: 2022-03-23T13:31:00.000Z
date: 2022-03-23T13:31:00.000Z
tags: ["App Script","Backend"]
---

## 用途

通常被用來預防併發(concurrency)
Lock 住的程式碼可以預防資料被覆寫

## Lock 鎖的類型

在 Lock service 類別底下分成幾種 Lock 類型

- Document Lock 文件鎖
文件檔需要在父對象的上下文或者父容器呼叫它，例如 bound sciprt
- Script Lock 腳本鎖
用途主要是多個用執行相同腳本的時候必須等待正在執行的用戶執行完畢才可以讓其他用戶依序執行
- User Lock 用戶鎖

## Lock 常用的方法

- tryLock(timeoutInMillis)
  - 將會 Lock 住一段時間，如果時間到了還沒 releaseLock 的話將會回傳 false
- waitLock(timeoutInMillis)
  - 與 tryLock 類似，但是差別在於如果超過時間沒有 releaseLock 的時候會丟出 error，因此在外層建議用 try catch 包住
- hasLock
  - 判斷 lock 實體是否已經被鎖住
- releaseLock
  - 在 Lock 實體透過 tryLock 或者 waitLock 鎖住後在未來某個程式碼片段解鎖，解鎖後便 tryLock 或者 waitLock 的時間將不再等待。

參見以下範例，例如在 doPost 的地方會運用到插入表格，希望其他用戶在執行該腳本的時候不能動到同筆資料，因此可以使用 LockService

```javascript{numberLines: true}
//首先必須先建立一個lock的實體，這邊使用getScriptLock表示建立的實體是屬於腳本鎖Script Lock
const lock = LockService.getScriptLock();
try {
	lock.waitLock(3000);//使用waitLock的時候要搭配try catch
} catch (e) {
	const object = { messager: 'Could not obtain lock after 3 seconds.' }
	return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
}

if (lock.hasLock()) {
//這邊寫入要操作表格的腳本內容，例如插入某些資料到表格
 lock.releaseLock();//最後部分記得releaseLock()
}
```

> [WaitLock-method](https://developers.google.com/apps-script/reference/lock/lock?hl=en#waitlocktimeoutinmillis)本範例用到的 wait 方法可參考官方文件

## 官方文件參考

> [Lock Service](https://developers.google.com/apps-script/reference/lock) 
>  [Lock method](https://developers.google.com/apps-script/reference/lock/lock?hl=en) 
>  [Container-bound Scripts](https://developers.google.com/apps-script/guides/bound)—對於 bound Script 的定義官方文件意思是從 google 的文件指令碼編輯器建立的情況

