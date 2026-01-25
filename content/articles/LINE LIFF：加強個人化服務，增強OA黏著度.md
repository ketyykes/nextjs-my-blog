---
title: LINE LIFF：加強個人化服務，增強OA黏著度
slug: 2023-03-08T07:49:37.000Z
date: 2023-03-08T07:49:37.000Z
tags: ["LINE Developers"]
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
.red {
color:red;
}
.code{
background-color:#f7f7f7;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>



本文主要以[2022 LIFF 介紹與各式應用](https://www.youtube.com/watch?v=qPGzANjLhr0)為基底加上官方文件與其他參考資料來介紹LIFF的相關應用，其中將會提及以下內容

- LIFF
  - 什麼是Channel?
  - 什麼是Provider
  - LIFF with各種應用
  - LIFF 介紹
    - Line login
    - LIFF開啟
    - 實際應用範例
      - 預約系統
      - 會員系統
      - 支付系統
  - LIFF with Message API的各種應用
  - LIFF函式介紹
    - 與LIFF應用程式互動時的輔助函式
    - liff特點函式介紹
- 其他參考資料

## 什麼是Channel?

Channel使服務提供商能夠使用 LINE 平台提供的功能。
要開發使用LINE平台的服務，首先得建立一個頻道。

![](https://i.imgur.com/69gwZ3K.png)

1. Line使用者端的對話框輸入訊息 →
1. Line platform →
1. Channel →
1. 你的伺服器系統

> 參考資料
> [Creating a channel on the LINE Developers Console](https://developers.line.biz/en/docs/messaging-api/getting-started/#using-console)
> [LINE Developers Console](https://developers.line.biz/en/docs/line-developers-console/)

## 什麼是Provider

- 獨立開發者、公司或組織
- Channel建立之後是不能更動Provider
- 請勿使用測試帳號到線上環境
  - 舉例：建議A Provider是開發環境、B Provider是正式環境

由於A Provider底下的所有Channel的UID(個別用戶的辨識碼)會是共用的情形，所以可能牽扯到個人資料與隱私權問題。

> 參考資料如下[1分鐘快速了解什麼是Provider及Channel](https://tw.linebiz.com/manual/line-official-account/line-porvider-and-channel-intro/)

## LIFF 介紹

當前的LINE Front-end Framework（LIFF）是一個開放式的平台，它可以讓開發者使用Web技術，像是HTML、CSS、和JavaScript，建立LINE應用程式，在LINE對話框開啟的網頁或LINE App中與LINE進行互動。能夠與LINE聊天機器人（chatbot）或LINE Pay等等服務進行整合。

另外LIFF可以說是基於Line Login底下的一種應用，也就是說在LIFF的函式庫中有許多需要先建立Login的Channel然後先行登入後才能使用其函式。

### Line login

#### 簡介

LINE Login是一種登入服務，允與使用者使用他們的LINE帳號作為你的網站或應用程式的識別帳戶，節省使用者輸入個人資訊的時間，使其輕鬆登入與註冊。

<span class="rem25">功能與優點</span>

- 社交登入服務，允許使用者使用他們的LINE帳號進行註冊和登入。
- 使用者可以輕鬆地使用LINE Login按鈕進行登入，無需輸入他們的帳號和密碼。
- 不僅適用於Web應用程式，適用於如Unity或者手機應用程式。
- 可以輕鬆地將LINE帳戶上的個人資訊與你的網站或應用程式進行整合。

如下圖，使用LINE作為遊戲註冊與登入

![](https://i.imgur.com/VI6FyR7.png)

> 參考資料 [LINE Login overview](https://developers.line.biz/en/docs/line-login/overview/)

### LIFF開啟

LIFF可以從LINE APP中開啟，也可以從外部瀏覽器中開啟
其中在LINE APP開啟可以分為Full、Tall、Compact大小。

其圖片如下

![](https://i.imgur.com/1HXUymS.png)

#### 特點與建議場景如下

- Full
  - 實際用途例如購物車、NFT商城
- Tall
  - 3/4版面的大小
  - 擁有暗示使用者仍在LINE官方帳號底下
  - 實際用途例如簡單的表單
- Compact
  - 實際應用像是單一Input框、更簡化的表單
  - 間接與使用者和官方帳號擁有更緊密的簡單互動連結
  - 舉例如下
    - 舉辦小遊戲→請輸入通關密語之類的應用
    - 活動舉辦→請輸入本次活動的題目答案等等

### 實際應用範例

#### 預約系統

例如使用LIFF應用程式在美髮和餐廳等地方進行預約

預約系統集結了LIFF應用程式，而當預約時間快到的時候，可以通過LINE消息發送提醒。另外也可以從LIFF應用程式獲得的用戶ID，用來發送不僅是預約通知，還包括促銷等等消息。

如下圖
![](https://i.imgur.com/rQNkb2x.png)

**特點**

- 無需下載其他應用程式或註冊會員。
- 通過LINE消息發送提醒，幫助使用者記得預約。
- 可獲取用戶ID，並用於發送促銷或活動消息等等，發送的訊息可以根據以下資料作為適性化的推薦，提升重複訪問率
  - 使用者在預約應用程式的操作
  - 到店訪問歷史紀錄

> 參考資料如下
> [Make restaurant reservations using LINE](https://lineapiusecase.com/en/usecase/reservation.html)


#### 會員系統

使用LIFF應用程式在LINE上為自己的服務提供會員卡。例如，在實體商店（如超市、藥店和服裝店）提供會員卡的公司也可以轉成線上會員卡。線上會員卡的好處能作為另一種與用戶傳播消息的方式。

如下圖

![](https://i.imgur.com/IshjSbl.png)

**特點**

- 立即性發行會員卡，不需要輸入個人資料達到更方便的註冊
- 不再需要實體會員卡，降低會員卡製作成本
- 提升顧客體驗，避免錢包塞了一堆會員卡
- 結合服務商的系統隨時查詢消費紀錄
- 根據相關的活動歷史記錄傳遞促銷

> 參考資料如下
> [Easy-to-issue membership cards](https://lineapiusecase.com/en/usecase/membership.html)


#### 支付系統
 
透過支付系統與LIFF的結合，能夠實現的智慧零售解決方案，藉由LINE手機應用程式結合支付功能，消費者可以在線上及線下完美結合的消費體驗中享受優惠，而這種綜合性的消費體驗已成為新的零售標準。

**特點**

- 透過掃描條碼的方式能作為優惠查詢、結帳、處理會員卡等功能
- 消費數據可以儲存在提供商的CRM中，作為最佳化推薦的建議之一
- 降低現金結帳的排隊擁擠並預防接觸感染
  
![](https://i.imgur.com/hbhRRbb.png)

## LIFF with Message API的各種應用

- Message API
  - Text Message
  - Flex Message
  - Rich Menu
  - Rich menu actions
    - close rich menu
    - open rich menu
    - open keyboard
    - open voice message input mode

Message API主要內容是作為訊息回復，其中文字部分的回覆可以使用普通文字的Text Message以及在Line對話欄中具有對應設計的Message Message，具體撰寫格式可以使用官方的[Flex Message Simulator](https://developers.line.biz/en/docs/messaging-api/using-flex-messages/)使其更方便的實現並同時觀看成果。

另外LIFF除了透過Message傳送訊息的方式回覆以外，架設在Rich Menu也是很常的情形。

如下圖

![](https://i.imgur.com/YkXM5rf.png)

需要注意的地方Rich Menu目前僅會生成在手機板的LINE應用程式，在電腦版的LINE應用程式則不會顯示。

> 參考資料
> [What are rich menus?](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/#using-rich-menus-introduction)

相關圖片如下
![](https://i.imgur.com/CfwqmVS.png)

## LIFF函式介紹

### 與LIFF應用程式互動時的輔助函式

建立LIFF應用程式時，可以透過以下的函式用來先行檢查無法使用的原因或者限定使用者必須在某些版本後方可使用以及建立更好的LIFF體驗等等

- liff.ready()：檢查 LIFF 是否已準備就緒
  - 檢查LIFF是否已經載入
  - 呼叫時將會回傳 Promise物件。
- liff.getOS()
  - 取得使用者裝置作業系統例如（Web、iOS 或 Android）。
- liff.getLanguage()
  取得使用者裝置語言設定，例如「zh-TW」、「en-US」等。
- liff.getVersion()
  - 取得目前 LIFF 版本號。
- liff.getLineVersion()：取得 LINE 版本資訊
  - 取得LINE 應用程式版本號。
- liff.isClient()：檢查是否在 LINE 內
  - 判斷使用者是否在 LINE 內，回傳布林值。
- liff.closeWindow()
  - 關閉LIFF畫面
  - 使用情境執行完某些操作後關閉視窗
- liff.use()

### liff特點函式介紹

#### send message

liff.sendMessages() 方法可讓使用者代表自己在聊天畫面中傳送訊息，但僅限於從一對一聊天室中啟動的 LIFF 應用程式中使用，換句話說也就是使用者藉由LIFF的網頁操作可以執行傳送訊息給官方帳號LINE BOT

使用此功能需要 chat_message.write 權限，你可以在 LINE 開發者控制台的 LIFF 建置中選擇此權限(chat_message.write 必須打勾)。若未選擇此權限或使用者未授權，則無法傳送訊息。

**特點與注意事項**

- 支援發送各種message格式
- 最多一次發送5則訊息
- 必須從Official Account點擊過去的LIFF才能使用
- 必須授予chat_message.write權限

> 參考資料如下
[liff.sendMessages()](https://developers.line.biz/en/reference/liff/#send-messages)
> 其他參考資料如下
> [如何在 LIFF 傳送隱藏資料給機器人](https://taichunmin.idv.tw/blog/2020-04-07-line-liff-send-hidden-data.html)

#### share target picker

透過 liff.shareTargetPicker() 方法，可以跳轉到分享好友或群組的畫面，在選擇好友或目標後將開發者所建立的訊息傳送到所選擇的對象。這個訊息將會以使用者的身分傳送所選擇的群組或好友的聊天室中。

在使用share target picker的函式為了確保可用性，可以先執行liff.isApiAvailable()，此函式是為了確保某些liff的API的可用性

![](https://i.imgur.com/ZQQJzWX.png)

**特點**

- 使用戶在liff的網頁以該用戶身分分享訊息給其他用戶
- 在分享網頁的時候也可以讓顯示的訊息更為漂亮(例如使用flex message)

**注意事項**

- 當使用外部瀏覽器時，需要先呼叫 liff.login() 完成登入
- 如欲確認share target picker是否可在 LIFF 應用中使用，可先呼叫 liff.isApiAvailable()
- 必須在 LINE Developers Console 中開啟「share target picker」功能才能使用參見下圖

![](https://i.imgur.com/YGxp3er.png)

> 參考資料
> [liff.shareTargetPicker](https://developers.line.biz/en/docs/liff/developing-liff-apps/#share-target-picker)

#### scanCodeV2

liff.scanCodeV2()可以啟動二維碼掃描器並獲取二維碼中的字元串。要啟用2D碼掃描器，請在LINE開發者控制台上開啟"Scan QR"。

如下圖

![](https://i.imgur.com/gtI8SiD.png)

[LINE LIFF 新掃碼 API 功能測試](https://taichunmin.idv.tw/blog/2021-09-30-liff-scan-code-v2.html)

當使用者在LINE應用程式上使用此功能時，他們可以掃描二維條碼並快速獲得相應的內容，例如訪問某個網站或添加好友等。

若要啟用LIFF的2D碼掃描器，必須在LINE開發者控制台上開啟"Scan QR"，並在程式中呼叫liff.scanCodeV2()。此時，LINE應用程式會啟動相機功能，用戶可以掃描QR code並獲取相應的內容。這些內容以Promise物件形式回傳，可供後續的處理。

為了實現掃描器功能，liff.scanCodeV2()使用了WebRTC技術，它可以透過支援WebRTC API的外部瀏覽器的方式開啟鏡頭。在掃描過程中，API會使用jsQR的函式庫將圖像中的QR code解碼成字元串，並回傳結果。

除了用戶自己使用掃描器功能外，開發者還可以將掃描到的QR code內容傳送到服務商的伺服器上進行處理。這為一些應用場景提供了便利，例如舉辦實際跑點掃描QR code之類的活動，並使用掃描器來進行資料的收集。

**特點與說明**

- 藉由webRTC的實作也可以透過支援WebRTC API的外部瀏覽器的方式開啟鏡頭
- 內部使用[jsQR](https://github.com/cozmo/jsQR)的函式庫
- 掃描結果以Promise物件形式回傳
- 可將讀到的QR code內容傳送到服務商的伺服器上
- 舉辦實際跑點掃描QR code之類的活動

##### 其他參考資料

* [官方帳號-LINE Front-end Framework (LIFF)](https://developers.line.biz/en/docs/liff/overview/)
* [Youtube-2022 LIFF 介紹與各式應用](https://www.youtube.com/watch?v=qPGzANjLhr0)
* [Line LIFF 可以做什麼？](https://medium.com/aiii-ai/line-liff-%E5%8F%AF%E4%BB%A5%E5%81%9A%E4%BB%80%E9%BA%BC-eb2ca40147ac)
* [it邦幫忙-如何在 LINE Bot 開啟 LIFF 應用 - LINE Front-end Framework](https://ithelp.ithome.com.tw/articles/10229840)
* [LINE 經營教學進階篇｜如何從 LINE Developers 開設 LIFF App？](https://oakmega.com/blog/add-liff-app-from-line-developers)
* [LINE經營進階篇｜line liff應用、liff教學及如何從 line developer 建立 Line LIFF](https://www.ezpretty.com.tw/blog/inner?id=43&title=LINE%E7%B6%93%E7%87%9F%E9%80%B2%E9%9A%8E%E7%AF%87%EF%BD%9Cline%20liff%E6%87%89%E7%94%A8%E3%80%81liff%E6%95%99%E5%AD%B8%E5%8F%8A%E5%A6%82%E4%BD%95%E5%BE%9E%20line%20developer%20%E5%BB%BA%E7%AB%8B%20Line%20LIFF)
* [開啟 LINE LIFF v2 的無限潛力 — liff.shareTargetPicker](https://engineering.linecorp.com/zh-hant/blog/start-liff-v2-sharetargetpicker-power/)
* [LINE API Use Case](https://lineapiusecase.com/en/top.html)
