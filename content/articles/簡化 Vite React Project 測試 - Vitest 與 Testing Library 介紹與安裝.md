---
title: 簡化 Vite React Project 測試 - Vitest 與 Testing Library 介紹與安裝
slug: 2024-04-23T13:31:00.000Z
date: 2024-04-23T13:31:00.000Z
tags: ["軟體測試"]
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
.mycode{
padding: 2px 4px;
color: #c7254e;
background-color: #f9f2f4;
border-radius: 4px;
font-size:0.9rem;
}
</style>

本文章是根據[React Testing Library with Jest / Vitest](https://www.udemy.com/course/react-testing-library/)的筆記加上搜尋相關文章和實作所構成

其內容包含以下

- 簡化 Vite React Project 測試 - Vitest 與 Testing Library 介紹與安裝
  - Why Vitest
    - React 專案的建置方式 - 從 CRA 到 Vite 的轉變
    - Vite 環境中的 Jest 測試支援
    - Vitest：Vite 專案的測試首選
- Test library 原則
  - 測試的核心原則
  - 關注結果而非實作
  - 模擬使用者行為
- Test libary vs Vitest
- jsdom 用途
- vite 安裝
- test 相關套件安裝
  - global 
  - environment
  - setupFiles
- 撰寫第一個測試檔案
- 在 pakcage.json 添加 test 腳本
- 避免 Vitest 全域變數引發的 Linting 錯誤
  - 添加 vitest/recommended
  - 更新 ESLint 規則
  - 最後 Eslint 檔案內容
- 參考資料

## Why Vitest

以下簡單介紹一下為什麼選擇 Vitest 作為專案的測試框架

### React 專案的建置方式 - 從 CRA 到 Vite 的轉變

以往常見的建立 React 專案方式是使用 CRA(Create React APP)，但近幾年[一些消息](https://www.freecodecamp.org/news/how-to-create-a-react-app-in-2024/)指出該專案已經被棄用了，截止今天為止上一次的更新是在兩年前

如下圖

![image](https://hackmd.io/_uploads/S1yMH73e0.png)

目前主流不使用 Next、Remix 等等的 Meta 框架會改用 Vite 來建立 React 的專案，在 Vite 建置工具當中是使用 ES 模組來進行撰寫，而著名的 Jest 則是使用 CommonJS 模組作為基礎，對於 ESM 的支援還不是很完善。

### Vite 環境中的 Jest 測試支援

在 Vite 建置環境中使用 Jest 來測試，[Jest 官方方案](https://jestjs.io/docs/getting-started#using-vite)的[vite-jest](https://www.npmjs.com/package/vite-jest)或是為了相容 Vite 的 ES build 環境所做的[jest-esbuild](https://www.npmjs.com/package/jest-esbuild)
他們的套件狀態仍然是不怎麼活躍。

如下圖
![image](https://hackmd.io/_uploads/HkP4w72lC.png)

### Vitest：Vite 專案的測試首選

以下節錄 Vitest 官方
> Vitest aims to position itself as the Test Runner of choice for Vite projects, and as a solid alternative even for projects not using Vite.

根據官方文中也指出若要建置測試環境的話，Vitest 對於 Vite 的支援是首選無誤，另外 Vitest 為了避免轉移成本，因此提供與 Jest 大量相同的 API，所以作為測試使用 Vite 建立專案的 React 應用程式，本文章將使用 Vitest 作為測試的運行者。

## Test library Core 

### 測試的核心原則

有了 Vitest 以外，Test library 的輔助來幫助我們以使用者為中心的方式來測試我們的 UI 元件，官方著名的原則如下
> [The more your tests resemble the way your software is used, the more confidence they can give you.](https://twitter.com/kentcdodds/status/977018512689455106)

### 關注結果而非實作

我們核心希望關心的是元件最後的結果，而非實作細節這也是 Test library 所提倡的方式，如果開發者為了效能或者可讀性重構的話，測試仍然有效，因為不影響最終結果。換句話說，也避免了元件和測試出現高耦合減少促進 codebase 的進展。

### 模擬使用者行為

另外更聚焦於元件的功能性可以反應預期的顯示訊息，而不是去處理元件內部狀態的改變。這樣更像是模擬使用者的實際行為。

## Test libary vs Vitest

| 特性         | Testing Library                                | Vitest                                                            |
| ------------ | :--------------------------------------------- | ----------------------------------------------------------------- |
| **類型**     | 測試工具庫                                     | 測試運行器                                                        |
| **主要用途** | 提供工具來測試 UI 元件、模擬用戶與 UI 的互動。 | 用於運行 JavaScript/TypeScript 的單元測試、整合測試和端對端測試。 |

## jsdom 用途

由於我們撰寫測試的時候可能需要撰寫只能在瀏覽器運行的 Javascript。例如使用到 localStorage 的 API，因此我們需要 jsdom 的輔助在 Node.js 的環境模擬瀏覽器的 API。
他使得開發者能夠在伺服器上執行那些本來需要在瀏覽器中才能運行的程式碼。

## vite 安裝

為了節省硬碟空間，筆者使用[pnpm](https://pnpm.io/zh-TW/)安裝，有興趣的人可以去官方網站研究
```bash
pnpm create vite@latest ./ --template react
```

執行完畢後 vite 幫我們開啟一個專案後，此時安裝相關套件命令如下

```bash
pnpm install
```

執行完畢後刪除相關的 css 和 assert 後

目前檔案如下

```bash
├── README.md
├── index.html
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js
```

將 app.jsx 重新撰寫程式碼如下

```jsx
import React from 'react'

const App = () => {
  return (
    <div>App</div>
  )
}
export default App
```

接下來在終端機輸入 pnpm run dev 即可看到最初始的畫面

## test 相關套件安裝

接下來我們需要安裝 test 相關的套件

```bash
pnpm add -D @testing-library/jest-dom @testing-library/react vitest eslint-plugin-vitest jest-dom
```

安裝完畢後到 vite.config.js 當中撰寫設定如下

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
    },
});
```

## global

設定 `globals: true` 主要是可以讓我們在撰寫測試程式碼時不需要每次都引入一些方法
例如 `describe`、`test`、`expect`

### environment

而`jsdom` 在這個設定則是用於需要 DOM API 或者在瀏覽器環境下運行的 JavaScript 功能的測試。

例如 localStorage 這是需要瀏覽器才能執行的程式碼，必須透過 jsdom 的的環境才能夠輔助我們執行。

```javascript
describe('localStorage tests', () => {
  it('should store and retrieve data from localStorage', () => {
    localStorage.setItem('key', 'value');
    const item = localStorage.getItem('key');
    expect(item).toEqual('value');
  });
});
```

> 更多說明可以參考以下連結
> [Vitest Config - Test environment ](https://vitest.dev/guide/environment)

### setupFiles

最後 setupFiles 也是同樣的道理，避免需要再每個測試檔案撰寫`
import "@testing-library/jest-dom"`

我們可以在 src 資料夾底下建立一個名為 setupTests.js 的檔案，裡面撰寫如下

```javascript
import "@testing-library/jest-dom";
```

之後到添加路徑位置在 vite.config.js 範例所示。

最後專案檔案與資料夾如下

```bash
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public
│   └── vite.svg
├── src
│   ├── App.jsx
│   ├── App.test.jsx
│   ├── main.jsx
│   └── setupTests.js
└── vite.config.js
```

## 撰寫第一個測試檔案

接下來撰寫第一個測試，App.test.jsx

```javascript
// 引入 React 測試庫用於渲染組件和操作測試範圍內的 DOM
import { render, screen } from '@testing-library/react';
// 引入要測試的 React 組件
import App from './App';  

// 使用 describe 函式定義一組相關的測試，這裡測試的是 'App' 組件
describe('App 元件', () => {
  // 使用 test 函式定義一個具體的測試，名稱為 'App'
  test('App', () => {
    // 使用 render 函式渲染 App 組件
    render(<App />);
    // 使用 screen 物件的 getByText 方法查找包含文字 'App' 的元素，並存放於 headingElement 變數中
    const headingElement = screen.getByText(/App/i);
  });
});
```

## 在 pakcage.json 添加 test 腳本

在 package.json 的 script 加入 test，其指令為`vitest --watch`，其中`--watch`表示隨時監控測試檔案如果有變化的話就會再次跑一次測試。

如下

```json
{
  "name": "react-vitest-library",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest --watch" //加上這一行
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^15.0.2",
    "@types/react": "^18.2.79",
    "@types/react-dom": "^18.2.25",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^9.0.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "eslint-plugin-vitest": "^0.5.3",
    "jsdom": "^24.0.0",
    "vite": "^5.2.9",
    "vitest": "^1.5.0"
  }
}
```

## 避免 Vitest 全域變數引發的 Linting 錯誤

為了避免在使用 `test` 和 `expect` 這兩個 Vitest 全域變數時，如果沒有先導入它們就會產生檢查錯誤，所以我們可以加入一些 eslint 設定

在.eslintrc.cjs 檔案中：

### 添加 vitest/recommended

將以下面的程式碼加入到 `extends` 陣列中：

```javascript
'plugin:vitest/recommended',
```

在文件最上方，導入 Vitest 插件：

```javascript
const vitest = require("eslint-plugin-vitest");
```

然後在 Top level 的 `module.exports` 物件中添加以下屬性/值：

```js
    globals: {
      ...vitest.environments.env.globals,
    },
```

### 更新 ESLint 規則

在.eslintrc.cjs 檔案的 `rules` 物件中添加以下代碼：

```js
    "no-unused-vars": "warn", // 警告，非錯誤
    "vitest/expect-expect": "off", // 測試撰寫時消除分散注意力的紅色波浪線
    "react/prop-types": "off", // 關閉屬性驗證
```

### 最後 Eslint 檔案內容

在.eslintrc.cjs 最後的檔案如下

```javascript
const vitest = require("eslint-plugin-vitest");

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:react-hooks/recommended",
      "plugin:vitest/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  rules: {
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
      ],
      "no-unused-vars": "warn",
      "vitest/expect-expect": "off",
      "react/prop-types": "off",
  },
  globals: {
      ...vitest.environments.env.globals,
  },
};

```

##### 參考資料

以下參考資料包含測試檔案範例和官方文件與觀看的部落格文章

- 建立 React App 相關
  - [如何在 2024 年創建 React 應用程式 - freeCodeCamp](https://www.freecodecamp.org/news/how-to-create-a-react-app-in-2024/)
  - [創建 Vite 專案](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
  - [Create React App Issue #13072 on GitHub](https://github.com/facebook/create-react-app/issues/13072)
- Jest
  - [Getting Started with Jest - 官方 Jest 文件](https://jestjs.io/docs/getting-started)
- Jest DOM
  - [jest-dom#custom-matchers](https://github.com/testing-library/jest-dom#custom-matchers)
- Vite 與 Jest 整合
  - [Vite Jest on npm](https://www.npmjs.com/package/vite-jest)
  - [Jest with Vite - Hung.dev 的部落格文章](https://hung.dev/posts/jest-vite)
  - [jest-esbuild on npm](https://www.npmjs.com/package/jest-esbuild)
- Vitest 測試工具
  - [Vitest Testing Library example](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib)
  - [Vitest environment](https://vitest.dev/guide/environment)
  - [Vitest ESLint plugin](https://www.npmjs.com/package/eslint-plugin-vitest)
