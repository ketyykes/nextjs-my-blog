---
title: Google Cloud雲端運算、Serverless簡介—以AppEngine部署解決CORS的App為例
slug: 2022-11-10T13:31:00.000Z
date: 2022-11-10T13:31:00.000Z
tags: ["AppEngine","Deploy","Backend"]
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
.blue{
  color:blue;
}
.green{
  color:green;
}
.gray{
background-color:#F5F5F5;
}
.code{
background-color:#f7f7f7;
padding :4px;
font-size:0.9rem;
font-weight:700;
}
</style>

本文依序提及以下內容

- 雲端運算
  - IasS
  - PasS
  - SasS
- Serverless(無伺服器架構)
- 新增Google Cloud App Engine專案
- 安裝Gcloud CLI
- 建置nodeJs專案以express解決cors為例
- 部署應用程式專案
- 總結
- 其他參考資料

## 雲端運算

- 基礎設施即服務(Infrastructure as a Service)
  - 用戶不需要購買伺服器，並且可以控制作業系統、儲存裝置、網路
  - 實際舉例
    - Amazon EC2
    - Google cloud—Compute Engine
    - [OpenStack](https://zh.wikipedia.org/zh-tw/OpenStack)
- 平台即服務(platform as a service)
  - 介於軟體即服務和基礎設施及服務之間，用戶可以藉由已經部署好的環境使用程式語言、程式庫等等的服務。
  - 實際舉例
    - Heroku
    - [Google App Engine](https://zh.wikipedia.org/zh-tw/Google_App_Engine)
    - Amazon S3
- 軟體即服務(Software as a Service)
  - 開箱即用、透過網路傳輸不需安裝、下載至硬碟即可使用，在商業應用中例如會計系統、協作系統、內容管理系統等等
  - 實際舉例
    - iCloud
    - Google App
    - Office 365
    - Adobe Creative Cloud
**參考資料**

> [維基-軟體即服務](https://zh.wikipedia.org/zh-tw/%E8%BD%AF%E4%BB%B6%E5%8D%B3%E6%9C%8D%E5%8A%A1)
> [維基-平台即服務](https://zh.wikipedia.org/zh-tw/%E5%B9%B3%E5%8F%B0%E5%8D%B3%E6%9C%8D%E5%8A%A1)
> [維基-基礎設施即服務](https://zh.wikipedia.org/zh-tw/%E5%9F%BA%E7%A4%8E%E8%A8%AD%E6%96%BD%E5%8D%B3%E6%9C%8D%E5%8B%99)
> [雲端運算](https://zh.wikipedia.org/zh-tw/%E9%9B%B2%E7%AB%AF%E9%81%8B%E7%AE%97)

## Serverless(無伺服器架構)

- 專注在寫程式碼與開發功能和業務邏輯，減少維運的問題
實際上並非真的沒有伺服器，而是開發者不需要關注伺服器架構，只需要關注程式碼即可。

## App engine介紹

- App Engine使用熱門的設計程式語言，例如Node.js、Java、Ruby、C#、Go、Python 或 PHP來建置應用程式
- 全託管服務將基礎架構的各種事務交給App Engine管理即可

AppEngine是一個完全託管的平台即服務(Pass)，作為部署網站和API用途，我們能夠藉由該平台能夠讓開發者更專注在寫程式碼上面，而非配置環境，但換言之也就是我們能夠控制的內容有限，例如無法選擇作業系統或是得依照他提供的環境來執行，以NodeJs為例(備註)在標準環境當中僅提供NodeJs10、NodeJs12、NodeJs14、NodeJs16版。
如下圖

![](https://i.imgur.com/1ZvvOg6.png)

> 備註：這裡提供的官方文件是2022/11月份的內容，實際提供的版本以Google Cloud官方網站為主
> 另外筆者在撰文當下Goodle cloud的App Engine提到即將重新整理文件網站，讓App engine與其他的Cloud網站一致。
> 如下圖
> ![](https://i.imgur.com/V5sheI1.png)

## 新增Google Cloud App Engine專案

### Step1.上Google app Engine網站

Google搜尋關鍵字打 google App engine

![](https://i.imgur.com/N0v5pbo.png)

### Step2.前往控制台

進到該頁面後點擊<span class="blue rem25">前往控制台</span>

右上角可以選擇你喜歡的語言瀏覽文件(但不一定該語言都有翻譯完整)

![](https://i.imgur.com/2x6rQvA.png)

### Step3.查看所擁有的專案資訊

![](https://i.imgur.com/cXPH6DJ.jpg)

點擊左上角可以查看你現在擁有的專案

然後按下對話框的右上角新增專案

### Step4.新增專案

對話框彈出後會**顯示你所擁有的專案**，這時我們可以按下<span class="blue rem25">新增專案</span>

![](https://i.imgur.com/10ECClE.jpg)

### Step5.填入專案名稱帳戶資訊

填入專案名稱和帳單資訊等資訊後按下<span class="blue rem25">建立</span>


![](https://i.imgur.com/imF8KVy.jpg)

## 安裝Gcloud CLI

由於筆者已經安裝Google Cloud而且根據不同的作業系統安裝步驟也不盡相同，因此請查看官方文件說明書安裝。

需要注意的地方是Cloud SDK Shell需要安裝Python 目前接收的版本是**Python3 3.5~3.9**

另外安裝完畢後可以**添加PATH環境變數**，以便在打開Terminal的時候可以在其他地方使用**gcloud開頭的指令**

依據官方文件安裝CLI網址如下
[GCP官方文件-Install the gcloud CLI](https://cloud.google.com/sdk/docs/install)

## 建置Node.js專案以express解決cors為例

### CORS簡單說明

我們使用前端對某些API發送請求的時候常常因為後端未開放同源政策

因此會跳出以下的錯誤

<p class="code red">
Access to fetch at ‘http://localhost:3000/' from origin ‘http://localhost:8081' has been blocked by CORS policy: No ‘Access-Control-Allow-Origin’ header is present on the requested resource. If an opaque response serves your needs, set the request’s mode to ‘no-cors’ to fetch the resource with CORS disabled.
</p>

因此本範例也提供自己開設後端伺服器轉發給前端的解決方案搭配**GCP App Engine**

事前需先**安裝NodeJs環境**

依序遵循下列步驟

### Step1.初始化專案

在已經建立的專案資料夾使用terminal開啟後輸入以下指令
<span class="red gray">&nbsp;npm init -y&nbsp;</span>
其內容表示初始化npm專案
<span class="red gray">-y</span>表示其專案設定例如專案名字、作者等等都使用預設值

### Step2.安裝相關套件

<span class="red gray">&nbsp;npm i axios cors express&nbsp;</span>

安裝axios cors express的library

#### 簡介安裝的library

- axios library能對API發送requese 在前後端皆可使用
- express library是一個nodeJs建置伺服器的框架
- cors是當我們開出API的時候使前端能在非同源的請求當中獲得資料

### Step3.編輯package.json
設定package.json

當我們專案建置完畢之後打開package.json
我們添加指定的scripts使AppEngine在部署後自動執行

#### 添加start在script裡

參見以下json範例

#### 添加engines屬性

參見以下json範例
```json
{
  "name": "gcp-cors",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js" //表示當app engine啟動後需要自動執行哪個檔案
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.1.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
  },
  "engines": {
    "node": "16.x.x"
  } 
  //添加一個key叫做engines，值為一個物件，其物件是用來設定版本號
  //其版本號必須與在app engine所設定的版本號相容
}
```

### Step4.建立一個server.js檔案

撰寫以下程式碼
```javascript
("use strict");
//引入各個模組
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();

const config = {
  method: "get",
  url: "https://yesno.wtf/api",
};

//對所有請求加入cors中介軟體
app.use(cors());

//當前端發送請求到此路由的時候回應要做的事情。
app.get("/", async (req, res) => {
//使用後端先行發送請求
  try {
    const response = await axios(config);
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

//如果未找到PORT的環境變數就選擇8080 port
const PORT = parseInt(process.env.PORT) || 8080;
//開啟該PORT的server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
```

### Step5.建立一個.gcloudignore檔案

建置一個.gcloudignore讓gcloud在部署的時候避免上傳至雲端
如下

```bash
# This file specifies files that are *not* uploaded to Google Cloud
# using gcloud. It follows the same syntax as .gitignore, with the addition of
# "#!include" directives (which insert the entries of the given .gitignore-style
# file at that point).
#
# For more information, run:
#   $ gcloud topic gcloudignore
#
.gcloudignore
# If you would like to upload your .git directory, .gitignore file or files
# from your .gitignore file, remove the corresponding line
# below:
.git
.gitignore

# Node.js dependencies:
node_modules/
```

### Step6.建立一個app.yaml檔案

建置一個yaml檔案，其名稱必須叫做app.yaml，主要用途是告訴app engine要執行的內容有哪些

```yaml
# [START gae_quickstart_yaml]
# 使用nodejs16的版本
# 實體使用F2
# 添加你想自定義的環境變數
runtime: nodejs16
instance_class: F2
env_variables:
  MY_VAR: "my value"
```

#### 細節參考資料

- 配置細節可以參考[app.yaml configuration file](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?hl=zh-cn&tab=node.js)
- standard環境的instance建置的細節可以參考[App Engine standard environment](https://cloud.google.com/appengine/docs/standard)
- standard vs flexiable差別可以參考
  - 可以參考[Choose an App Engine environment](https://cloud.google.com/appengine/docs/the-appengine-environments)
  - 亦可參考[淺談Google App Engine Standard與Flexible Environment的差別: GAE Standard V.S. Flexible Environment](http://andy51002000.blogspot.com/2020/03/google-app-engine-standardflexible.html)

## 部署應用程式專案

### Step1.打開Google Cloud SDK Shell

![](https://i.imgur.com/Q4Cacbe.png)

另外如果你有將gcloud添加到環境變數的話，亦可打開你常用的terminal即可使用gcloud指令

### Step2.移動到當前的資料夾

輸入CD空格"你的資料夾位置"

例如：<span class="red gray"> CD C:\Users\myname\YourProjectDocument</span>

如下圖

![](https://i.imgur.com/LGpD6D1.jpg)

### Step3.選擇專案部署

#### Step3.1列出所擁有的專案

輸入以下指令

<span class="red gray">gcloud projects list</span>

就能列出現有的專案內容

如下圖

![](https://i.imgur.com/LCN1ykh.png)

#### Step3.2查看目前指向的Project

我們可以用<span class="red gray">gcloud config get-value project</span>的指令，查看目前的指令指向哪個project

#### Step3.3設定指向的Project

輸入以下指令

<span class="red gray">gcloud config set project 你的PROJECT_ID名稱</span>

即可將當前部署等相關指令指向你要的project

### Step4.部署應用程式

輸入以下指令<span class="red gray">gcloud app deploy</span>

即可部署

接下來在遠端的Google Cloud將會使用你所寫的**app.yaml**檔案來做設定。

#### Step4.1設定location

如果是初次使用的話，接下來他會要你選擇app engine的伺服器位置

另外小括號的部分也列出了該地區的支援的服務有哪些

**以asia-eas1為例**就是
支援建置標準環境(standard)和(flexible)彈性環境

![](https://i.imgur.com/7V3HPGV.png)

#### Ste4.2 location考量要點

另外選擇地區要<span class="red">考量</span>的地方除了離你所在的地區最近以外，另外也要考量你所使用的<span class="red">服務在該地區是否有**提供**</span>。

如下圖

![](https://i.imgur.com/huWscSt.png)

> 更多location對應的服務內容可以參考以下網址
[Google Cloud 據點](https://cloud.google.com/about/locations#asia-pacific
)

#### Step4.3再次確認請求

接下來他會請求再次確認並且列出你的project細項

![](https://i.imgur.com/IwFXRXY.jpg)

#### Step4.4確認請求

輸入<span class="red">Y</span>按下Enter

![](https://i.imgur.com/Y7LjdAI.png)

等待建置完成後再按一次Enter

### 部署完畢-開啟網址

最後下方Terminal的訊息將會提示你網址

![](https://i.imgur.com/7tAfeJr.png)

另外也可以使用指令<span class="red gray">gcloud app browser</span>

就會自動開啟瀏覽器到該網址
最後應當可以看到拿到的資料
![](https://i.imgur.com/x3hzgid.png)

## 總結

本文僅撰寫基本的App Engine的使用，順道撰寫CORS的簡單App來解決前端在未開放CORS的API透過轉發使前端可以得到該資料

最後終於把這篇長文章打完了
<span class="rem40 ">🎉🎊🎆</span>

## 其他參考資料

- [Google App Engine Node.js Samples](https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/main/appengine)
裡面有包含Google App Engine的各種範例檔包含hello-world
- [Node.js Runtime Environment](https://cloud.google.com/appengine/docs/standard/nodejs/runtime)
  官方NodeJs部署教學
- [gcloud projects list-官方文件](https://cloud.google.com/sdk/gcloud/reference/projects/list)
  gcloud project的其他指令
- [GCP官方文件-configuration file](https://cloud.google.com/appengine/docs/standard/reference/app-yaml?tab=node.js)
  包含更多除了app.yam可配置的選項的文件
- [Google App Engine Instance Hours and Free Quotas](https://stackoverflow.com/questions/70979864/google-app-engine-instance-hours-and-free-quotas)
- [GCP官方文件-Standard環境提供的額度](https://cloud.google.com/appengine/docs/standard/quotas#Instances)
  其中也包含上下文也包含其他環境或服務的額度 
- [App Engine standard environment pricing](https://cloud.google.com/appengine/pricing#standard_instance_pricing)
- [GCP官方文件-超過額度的定價規則](https://cloud.google.com/appengine/pricing#standard_instance_pricing)
  該文件內容也包含計算機可以試算一下
