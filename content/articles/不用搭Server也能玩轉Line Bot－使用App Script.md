---
title: 不用搭 Server 也能玩轉 Line Bot－使用 App Script
slug: 2022-04-16T07:34:00.000Z
date: 2022-04-16T07:34:00.000Z
tags: ["App Script","LINE Developers"]
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

## 如何開始

先到以下網站[Line Developers](https://developers.line.biz/en/) 建立官方帳號

### Step1-Log in

右上角點選**Log in**

![](https://i.imgur.com/OhPUT20.jpg)

### Step2-使用 LINE 帳號登入

點選**使用 LINE 帳號登入**

![](https://i.imgur.com/5pcoxvz.png)

輸入完帳號密碼

![](https://i.imgur.com/k5NE9kU.png)

## Provider channel 關係圖

![](https://i.imgur.com/unIn6tX.png)

其他更多每個角色的權限如下

> [LineDev-Managing Roles](https://developers.line.biz/en/docs/line-developers-console/managing-roles/)

## 建立 Providers

下方 Providers 有個 Create 按下去

![](https://i.imgur.com/7cPkoH5.jpg)

填入名字

![](https://i.imgur.com/cljuv6n.png)

> [](https://developers.line.biz/en/docs/line-developers-console/overview/)

## 建立 channel

### Step1-Create a new channel

點選**Create a new channel**
![](https://i.imgur.com/9FaUpkY.png)

### Step2-Create a Message API channel

點選**Create a Message API channel**
![](https://i.imgur.com/qmnCdDI.png)

### Step3-上傳大頭貼撰寫頻道描述

基本上就是看這個頁面要求哪些東西，把它填一填

- 先上傳大頭貼 Channel name 和 Channel description

![](https://i.imgur.com/3rrMXoE.png)

- 選擇 Category 和 Subcategory

![](https://i.imgur.com/L2v9ZxF.png)

- 下方勾選同意 按下 Create

![](https://i.imgur.com/HQ1zt4j.png)

- 按下 OK

![](https://i.imgur.com/woxuiJ5.png)

- 按下同意

![](https://i.imgur.com/b5Jg9xw.png)

## 建立頻道完成-加入好友

建立完之後這時候就有你的頻道了

![](https://i.imgur.com/swhLxRW.jpg)

基本上你可以先到 Message API 這邊可以看到你的官方 ID 透過這個 ID 加入好友，你也可以使用二維條碼的方式加入好友。

![](https://i.imgur.com/j7C2cjB.jpg)

做到這一步的時候加入好友的話會看到頻道會回應你歡的加入訊息。
![](https://i.imgur.com/T1yb6a4.jpg)

---

## Line Official Account Manager 頻道設定

這個時候回到**Basic settings**
點選**Line Official Account Manager**
基本上會調整的設定大致如下

功能切換那裡可以設定接受邀請加入群組

![](https://i.imgur.com/lHhwwQE.png)

回應設定這邊**必須使用聊天機器人** 加入好友的歡迎訊息我通常會選擇停用

進階設定這邊 **自動回應訊息也是停用**，之後會用程式控制回應訊息，這邊的 Official Account Manager 是透過 GUI 介面來達成。
**Webhook 這裡要選擇啟用。**

![](https://i.imgur.com/caxw0QI.png)

以上這邊的 Official Account Manager 就設定的差不多了

## Line 與伺服器的機制

使用 webhook 的方式進行

![](https://i.imgur.com/mAqVKmz.png)

### AppScirpt 和 webhook 內容

> 更多 App script 相關說明可以參考[使用 App Script 串接 GoogleSheet 發送 API](/tech-page/2022-01-26%20Wed)

## Line 傳過來的訊息 JSON

下列程式碼是你的伺服器將會收到的 JSON 格式

```json
{
  "destination": "xxxxxxxxxx",
  "events": [
    {
      "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
      "type": "message",
      "mode": "active",
      "timestamp": 1462629479859,
      "source": {
        "type": "user",
        "userId": "U4af4980629..."
      },
      "webhookEventId": "01FZ74A0TDDPYRVKNK77XKC3ZR",
      "deliveryContext": {
        "isRedelivery": false
      },
      "message": {
        "id": "325708",
        "type": "text",
        "text": "@example Hello, world! (love)",
        "emojis": [
          {
            "index": 23,
            "length": 6,
            "productId": "5ac1bfd5040ab15980c9b435",
            "emojiId": "001"
          }
        ],
        "mention": {
          "mentionees": [
            {
              "index": 0,
              "length": 8,
              "userId": "U850014438e..."
            }
          ]
        }
      }
    }
  ]
}
```

## 設定長期 token

下方點選**issue**
token 在 Channel 設定 Message API
![](https://i.imgur.com/aRhJOPe.jpg)

> post 到 line 伺服器的內容可以參考[Line-sendingMessage](https://developers.line.biz/en/docs/messaging-api/sending-messages/#methods-of-sending-message)
> line 伺服器回送過來的訊息 JSON 更多可以參考[Line-Event](https://developers.line.biz/en/docs/line-things/receive-scenario-result-event/)

## 建立 App script 腳本

將以下程式碼貼進 app script

```javascript{numberLines: true}
function doPost(e) {
  var CHANNEL_ACCESS_TOKEN = {你的CHANNEL_ACCESS_TOKEN};
  var msg = JSON.parse(e.postData.contents);
  console.log(msg);

  // 取出 replayToken 和發送的訊息文字
  var replyToken = msg.events[0].replyToken;
  var userMessage = msg.events[0].message.text;

  if (typeof replyToken === 'undefined') {
    return;
  }

  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': userMessage
      }],
    }),
  });
}
```

### 部署作業

接下來新增部署作業

![](https://i.imgur.com/ZEvUaFR.png)

按下齒輪 → 按下網頁應用程式

![](https://i.imgur.com/Uwce6mY.png)

誰可以存取 → 選擇所有人 → 部署

![](https://i.imgur.com/6fKtbje.jpg)

按下授予存取權

![](https://i.imgur.com/r6rbSQs.png)

按下前往「你的 app script 專案名稱」(不安全)

![](https://i.imgur.com/71fshV1.jpg)

最後按下允許

![](https://i.imgur.com/nXd9ytf.jpg)

按下部署 → 管理部署

![](https://i.imgur.com/8ZO2JrZ.png)

底下的網址就是等等要填入 webhook 的內容

![](https://i.imgur.com/u7l6ZTy.jpg)

回到 Message API 的設定的地方將 webhook 填入

![](https://i.imgur.com/pqiVFk0.png)

其他資料
若想要用 NODE JS 建立的話 官方有文件照做可以建立簡單的聊天機器人並佈署到 heroku

> [Line 官方使用 nodeJS 建立並佈署到 heroku](https://developers.line.biz/en/docs/messaging-api/nodejs-sample/)

