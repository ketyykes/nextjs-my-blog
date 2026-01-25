---
title: create-react-app內容、優點、缺點、是否eject評估
slug: 2022-10-08T07:49:37.000Z
date: 2022-10-08T07:49:37.000Z
tags: ["React"]
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
background-color:#D3D3D3;
}
.bdrs{
  border-radius: 4px;
}
@media (max-width: 576px) {
  .rem25{
    font-size:2rem;
  }
  .rem40{
    font-size:3.0rem;
  }
  .rem50{
    font-size:3.5rem;
  }
}
.red {
color:red;
}
.blue{
color:blue;
}
.code{
background-color:#f7f7f7;
padding :4px;
font-size:0.9rem;
font-weight:700;
}

</style>

先前提到撰寫一個react的應用程式就會需要以下步驟

* 安裝react和reactDOM
* 安裝webpack和webpack-cli
* 安裝bebal、scss等等的編譯器
* 設定webpack參數

因此也衍生了簡化這些步驟的[Tool chains](https://reactjs.org/docs/create-a-new-react-app.html#recommended-toolchains)，其中create-react-app作為官方推薦的工具鏈之一其優點包含以下
- Less to Learn
  - 專注在react開發而不需擔心webpack、babel和依賴項設定
- Only One Dependency
  - 只有一個依賴項react-scripts，因此也讓維護升級更容易。
- No Lock-In
  - 非強制鎖定配置，如果想要進階配置的化可以eject撰寫config檔案(備註)

> 備註：但是如果`使用eject指令後就會失去只有一個react-script的依賴項`，必須自行決定想要的升級項目，也要顧慮升級A項目會導致B項目出現問題。

## 開始使用create-react-app

依據官方指令只需要輸入以下指令就能建立一個"your project name"

- <span class="red code">npx create-react-app "your project name"</span>
- <span class="red code">cd "your project name"</span>
- <span class="red code">npm start</span>

另外如果你使用terminal已經cd到該資料夾了話，可以改用以下指令

- <span class="red code">npx create-react-app ./</span>
- <span class="red code">npm start</span>

這時候輸入<span class="red code">npm start</span>應當會開啟一個<span class="red">`http://localhost:3000/`</span>的server

如下圖

![](https://i.imgur.com/8fWfUxh.png)

對！就是這麼簡單，~~所以今天就講解完畢了，當然還沒沒~~

## create-react-app缺點

- 難以自定義配置
- [代碼膨脹](https://zh.wikipedia.org/zh-tw/%E4%BB%A3%E7%A0%81%E8%86%A8%E8%83%80)
- 過多的抽象化(備註)

> 備註：如果讀過先前未曾讀過從0開始安裝**webpack**和**react**的話，而使用**create-react-app**的話，可以參考這篇[Modern JavaScript Explained For Dinosaurs](https://medium.com/the-node-js-collection/modern-javascript-explained-for-dinosaurs-f695e9747b70)，理解現代化網頁的歷程。

## eject包含了什麼
透過以下的方式來理解上面講述的重點
我們嘗試著<span class="red code">npm run eject</span>來暴露自定義設定檔

在package.json檔案能發現他所擁有的依賴項包含以下

```javascript
{
  "name": "project-name",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@babel/core": "^7.16.0",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.3",
    "@svgr/webpack": "^5.5.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "babel-jest": "^27.4.2",
    "babel-loader": "^8.2.3",
    "babel-plugin-named-asset-import": "^0.3.8",
    "babel-preset-react-app": "^10.0.1",
    "bfj": "^7.0.2",
    "browserslist": "^4.18.1",
    "camelcase": "^6.2.1",
    "case-sensitive-paths-webpack-plugin": "^2.4.0",
    "css-loader": "^6.5.1",
    "css-minimizer-webpack-plugin": "^3.2.0",
    "dotenv": "^10.0.0",
    "dotenv-expand": "^5.1.0",
    "eslint": "^8.3.0",
    "eslint-config-react-app": "^7.0.1",
    "eslint-webpack-plugin": "^3.1.1",
    "file-loader": "^6.2.0",
    "fs-extra": "^10.0.0",
    "html-webpack-plugin": "^5.5.0",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^27.4.3",
    "jest-resolve": "^27.4.2",
    "jest-watch-typeahead": "^1.0.0",
    "mini-css-extract-plugin": "^2.4.5",
    "postcss": "^8.4.4",
    "postcss-flexbugs-fixes": "^5.0.2",
    "postcss-loader": "^6.2.1",
    "postcss-normalize": "^10.0.1",
    "postcss-preset-env": "^7.0.1",
    "prompts": "^2.4.2",
    "react": "^18.2.0",
    "react-app-polyfill": "^3.0.0",
    "react-dev-utils": "^12.0.1",
    "react-dom": "^18.2.0",
    "react-refresh": "^0.11.0",
    "resolve": "^1.20.0",
    "resolve-url-loader": "^4.0.0",
    "sass-loader": "^12.3.0",
    "semver": "^7.3.5",
    "source-map-loader": "^3.0.0",
    "style-loader": "^3.3.1",
    "tailwindcss": "^3.0.2",
    "terser-webpack-plugin": "^5.2.5",
    "web-vitals": "^2.1.4",
    "webpack": "^5.64.4",
    "webpack-dev-server": "^4.6.0",
    "webpack-manifest-plugin": "^4.0.2",
    "workbox-webpack-plugin": "^6.4.1"
  },
}
```

另外也會多了資料夾和檔案如下圖

![](https://i.imgur.com/Vf01mkL.png)

我們可以得知首先要管理這麼多的套件是過於複雜，更新某個套件的時候必須考慮其他套件是否會影響，另外像是如果你未曾使用sass，它預先載入了**sass-loader**的套件，也會造成無用的程式碼在該專案中。

這裡列出以下避免在CRA應用程式的一些替代方案
- [customize-cra](https://github.com/arackaf/customize-cra)
- [react-app-rewired](https://www.npmjs.com/package/react-app-rewired)
- [craco](https://github.com/dilanx/craco)
- [react-super-scripts](https://www.npmjs.com/package/react-super-scripts)

他們提供了一些項是覆寫的方式修改設定檔。

## 是否該eject你的create-reae-app?

以下提及不該eject的幾項重點

- eject是一個**one-way process**(單向過程)不可逆的反應
- 失去**react-script**的易維護性
- 你的**eject**會讓project複雜化恐致影響團隊

在考慮eject的時候應當觀看以下解決方案及問問以下問題

- 是否僅對CRA一些小調整
- 評估eject的價值與管理建構專案的複雜度成本衡量
- CRA的repo是否已經有類似解決方案了?

## 小結
我們今天講述了如何安裝<span class="red">create-react-app</span>以及其優缺點和使用CRA後的替代方案，如果對於Create-React-App做了什麼有興趣的話可以參考這篇[What Does Create-React-App Actually Do?](https://levelup.gitconnected.com/what-does-create-react-app-actually-do-73c899443d61)，希望以上內容有幫助到大家!

##### 參考資料
- [Don’t eject your Create React App](https://medium.com/curated-by-versett/dont-eject-your-create-react-app-b123c5247741)
- [Modern JavaScript Explained For Dinosaurs](https://medium.com/the-node-js-collection/modern-javascript-explained-for-dinosaurs-f695e9747b70)
- [Don't use create-react-app: How you can set up your own reactjs boilerplate.](https://dev.to/nikhilkumaran/don-t-use-create-react-app-how-you-can-set-up-your-own-reactjs-boilerplate-43l0)
- [Everything You Need to know About Create React App](https://www.dotnettricks.com/learn/react/create-react-app)
