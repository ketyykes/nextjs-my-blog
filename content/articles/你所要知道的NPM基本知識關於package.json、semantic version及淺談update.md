---
title: 你所要知道的NPM基本知識關於package.json、semantic version及淺談update
slug: 2022-09-17T12:11:00.000Z
date: 2022-09-17T12:11:00.000Z
tags: ["Javascript","Node.js"]
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
.gray{
background-color:#d3d3d3;
}
</style>

npm全名**node package manager**


當下載node JS的時候安裝的時候，一直按下一步下一步會預選默認安裝NPM

以下是下載後安裝時會出現的圖

![](https://i.imgur.com/LifsgzY.png)

圖中四點依據重要程度及簡單說明一下

1. node js runtime Node Js執行(當然需要安裝)
2. Npm 套件管理工具 (NPM相關套件時所需)
3. 線上文件捷徑(不一定需要)
4. add to path (添加到環境變數主要使用cli執行node指令)

當安裝完畢的時候想要知道是否有下載npm成功的話，可以在
terminal輸入 npm -v(查看npm版本號)
也可以輸入node -v (查看node版本號)
藉由輸入指令得知所安裝的版本號等同於有安裝成功了

## npm的本質
包含兩個重要功能

1. registry/repostitory 模組倉庫
2. command line interface CLI介面

換句話說可以 <span class="red">用來載入第三方的module</span>


## 初始化npm 建立package.json檔案
<span class="red rem25">npm init</span> 大致上會問幾個問題
如下
```bash
package name: (你的package名稱)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to 你的檔案路徑
```

基本上如果沒有要特別設定的話，就是一直按<kbd>Enter</kbd><kbd>Enter</kbd><kbd>Enter</kbd>，這些日後可以在package.json檔案修改。

如果覺得建立的時候每次都要按下這些冗長的問題很麻煩的話，<span class="red rem25">npm init -y</span> 可以省略按Enter跳過步驟<span class="rem25 gray">啟用預設值</span>
最後就會產生一個package.json如下
```json
{
  "name": "你的專案名字",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

以下就安裝部分分為全域安裝和區域安裝

## 全域安裝

全域安裝加入-g 表示全域安裝package，全域的package會安裝在系統中的一個位置(取決於你的設置)

### 為何需要全域安裝?

通常會是該module安裝cli指令集，讓其他專案也可以使用該指令集，例如輸入

使用方法加入`-g`可以安裝在這台電腦裏面
以**gulp**為例(一個任務自動化管理工具)
<span class="red rem25">`npm install -g gulp-cli`</span>
安裝完**gulp**就可以在cli介面輸入**gulp**擁有的指令集進行編譯sass或者整合header和footer構成html或者css之類的事情，例如輸入gulp --tasks、gulp build之類的指令。


### 查看全域安裝的module
可以輸入<span class="red rem25">npm -g list</span>來看你所有安裝的全域環境的module

由於pakcage會形成一個dependency tree，透過限制深度，例如想要列出所安裝的pakckage不包含他們的依賴項時
就可以輸入
<span class="red rem25">npm list -g --depth 0</span>

> 列出全域安裝且深度是0的專案內容


## 區域安裝

通常安裝方式的指令是<span class="red rem25">`npm install "module名字"`</span>
也可以簡寫成 <span class="red rem25">`npm i "module名字"`</span>
例如 `npm i express`、`npm i bootstrap`

### 示範安裝bootstrap
以安裝bootstrp為例
輸入`npm init` 然後數個 <kbd>**Enter**</kbd> 然後
`npm i bootstrap`
最後安裝完成查看<span class="rem25 gray">**package.json**</span>會看到如第11行
<span class="gray">**dependencies**</span>增加了`"bootstrap": "^5.0.2"`
也就是<span class="red">`這個project必須有bootstrap這個module才不會運行異常`</span>

```javascript
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bootstrap": "^5.0.2"
  }
}

```

### 觀察package.json

剛剛我們安裝了bootstrap，我們再安裝express輸入`npm i express`
這時候打開package.json會看到dependencies多了express，換句話說透過**npm安裝模組**會加入到package.json的檔案中，**成為該專案的依賴項**。

```javascript
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bootstrap": "^5.0.2",
    "express": "^4.17.1"
  
}

```

## 什麼是package.json

上一個部分觀察到**package.json**會加入專案的依賴項，每個專案通常都會有一個**package.json**
**package.json**通常包含許多資訊例如
<span class="gray">專案名稱、版本、作者、 github repo</span>

從其他github下載下來的檔案可以藉由**package.json**來了解所需的**module**然後<span class="red">透過npm install自動去npm的庫安裝所需清單</span>

這邊可以歸類以下點

- 做為一個描述檔案及專案所需依賴的package
- 使用語義化版本(semantic versioning)規則指定專案依賴pakcage的版本
- 易於與開發者分享、重複使用


### -save該輸入嗎？什麼是-dev

或許你會看到有些網路上的文章所輸入的是`npm install --save '套件名稱'`，有些卻沒有--save，這是因為
在npm5.0.0以前在安裝套件的時候必須打`--save`才能安裝
例如<span class="red">`npm install --save boostrap`</span>

在npm **5版之後可以省略--save**因此只要打`npm install boostrap`

如果這個套件只有在測試的時候，而非實際上架部署才會需要用到的套件的化，可以打
<span class="red">`npm install sass --save-dev`</span>

另外--save-dev也有簡寫，可以打`-D`來替代`-dev`如下
`npm i sass -D`

## 相互依賴的node_module

如果你已經安裝了某個套件例如express，嘗試著打開node_modules這個資料夾
可以看到產生的東西這麼多內容如下

![](https://i.imgur.com/PNlTzE5.png)


express這個modules也仰賴其他modules，因此打開裡面的**package-lock.json**，可以看到在初次安裝的時候鎖定的版本號，並且也能從中得知express仰賴其他的modules

```javascript
 "node_modules/body-parser": {
      "version": "1.19.0",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.19.0.tgz",
      "integrity": "sha512-dhEPs72UPbDnAQJ9ZKMNTP6ptJaionhP5cBb541nXPlW60Jepo9RV/a4fX4XWW9CuFNK22krhrj1+rgzifNCsw==",
      "dependencies": {
        "bytes": "3.1.0",
        "content-type": "~1.0.4",
        "debug": "2.6.9",
        "depd": "~1.1.2",
        "http-errors": "1.7.2",
        "iconv-lite": "0.4.24",
        "on-finished": "~2.3.0",
        "qs": "6.7.0",
        "raw-body": "2.4.0",
        "type-is": "~1.6.17"
      },
```

所以有個迷因圖**node_module比黑洞的重力場還要重**
如下圖

![](https://i.redd.it/tfugj4n3l6ez.png)
> 圖片來源 [Heaviest Objects In The Universe-reddit](https://www.reddit.com/r/ProgrammerHumor/comments/6s0wov/heaviest_objects_in_the_universe/)



## 解除安裝

前面提到的都是安裝
想當然而也可以解除安裝一些不再需要用到的套件

輸入<span class="red rem25">`npm uninstall "module名字"`</span>

例如`輸入npm uninstall express`和`npm uninstall bootstrap`

打開node_modules資料夾就只會剩下大致如下
```bash
├─node_modules
│  │  .package-lock.json
│  │
│  └─.bin
```

## [semantic version語義化版本](https://docs.npmjs.com/about-semantic-versioning)
你可能覺得奇怪
為什麼版本號不是十進位的
![](https://soshace.com/wp-content/uploads/2020/08/cover-700x400.png)

> 圖片來源[Setting Up Automated Semantic Versioning For Your NodeJS Project](https://soshace.com/setting-up-automated-semantic-versioning-for-your-nodejs-project/)

因為版本號具有語意
例如**2.3.12**第一個主要版本是**2**，代表如果版本**3**是不會向下相容，而且具有大規模的變化，因此也會造成以前撰寫的code出現問題。

第二個版本號3是有新增新的特色並且具備向下相容
理論上(ideally)是不會毀壞以前的code

第三個版本號只是修改一些小bug而已
是不會毀壞以前的code

例如原先是1.2.15在更改大版本號的時候就會變成2.0.0

更改次要版本號的時候例如1.2.15下個版本就會變成1.3.0

### package-lock.json版本號
其實用一句話來概括很簡單，就是鎖定安裝時的包的版本號，並且需要上傳到git，以保證其他人在npm install時大家的依賴能保證一致

一般的package.json只能鎖定大版本號，由於開發者撰寫版本號的時候也可能不遵守具有語意的版本號編寫方式，在不同時間下載npm也可能造成版本不同，所以就可能造成程式出問題。

### package.json的內容更新模式
也許你會看到^4.1.0在package.json

^符號表意思是如果你從其他github下載下來後 再<span class="red">npm install</span>就會自動更新到最新的次要版本 例如網路上有4.2.1版本的時候就會選擇安裝這個版本

~表示會安裝到最新的patch版本號
例如4.19.5 網路上有4.19.10就會安裝到4.19.10這個版本 不會影響minor 版本

### 查看當前專案安裝的module和版本號指令
你可以輸入<span class="red rem25">npm list</span>來列出你所安裝的所有module和版本號
![](https://i.imgur.com/3pG7ECt.png)

### 列出該module所有版本號指令
輸入<span class="red rem25">npm view "module" versios</span>列出所有版本名字

## 更新pakcage

當你輸入<span class="red">npm update</span>會<span class="gray rem25">自動把所有的依賴安裝到最新的版本</span>，但只有更新到最新相容的版本號，所以如果5.0.0被發布的時候 他並不會被更新到5.0.0

**但也會造成可能有些套件並不想更新的套件也會一併更新**

### 指定某個套件安裝最新版本
如果想要手動安裝最新的主要版本則輸入
<span class="red">npm install chalk@latest</span>就是npm安裝最後的版本

### 指定安裝某個主要版本
指定安裝<span class="red">npm install chalk@2</span>
就會安裝最新的主要版本是2的module 也就是2.X.X

###  列出尚未更新到最新版本的依賴
使用 <span class="red">npm outdated</span> 可以幫助我們列出有哪些還沒有升級到最新版本的依賴

### 選擇性的更新你所要的套件
另外為了方便選擇更新我們要更新的套件可以安裝以下套件

<span class="red">npm install -g npm-check</span>

安裝完畢後可以輸入<span class="red">npm-check</span>還有<span class="red">npm-check -u </span>就可以用打勾的方式更新

> 更多可以參照[官方npm-check介紹](https://www.npmjs.com/package/npm-check)

### module與仰賴其他module密不可分

由於許多module也依賴其他module，因此如果遇到<span class="red">更新</span>的時候很可能<span class="red">造成整個module壞掉</span>，`更新的時候需要三思阿`


### 資料參考來源
* [NPM套件管理器常用命令與原理](https://hackmd.io/@monkenWu/rJNJhG4X4)
* [前端工程化（一）NPM如何管理依賴包版本？](https://www.gushiciku.cn/pl/paOr/zh-tw)
* [NPM Install 到底做了些什麼](https://ithelp.ithome.com.tw/articles/10191783)
* [NPM是什麼？了解Node Package Manager套件管理機制](https://tw.alphacamp.co/blog/npm-node-package-manager)
* [package-lock.json 有什麼用](https://ithelp.ithome.com.tw/articles/10191888)
* [[BE] 請說明一下 npm 的套件管理機制。](https://ithelp.ithome.com.tw/articles/10226839)
* [[NodeJs] npm --save 到底是什麼? --save-dev 不一樣嗎?：](https://medium.com/itsems-frontend/nodejs-npm-dependencies-devdependencies-8934f641c8ef)
* [NPM官方文件](https://docs.npmjs.com/cli/v8/commands)
* [How to Check Your Globally Installed npm Packages](https://betterprogramming.pub/how-to-check-your-globally-installed-npm-packages-32a14469b95a)

