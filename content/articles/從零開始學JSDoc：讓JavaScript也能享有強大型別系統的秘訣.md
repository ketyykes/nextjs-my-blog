---
title: 從零開始學 JSDoc：讓 JavaScript 也能享有強大型別系統的秘訣
slug: 2025-04-02T07:58:37.000Z
date: 2025-04-02T07:58:37.000Z
tags: ["Jsdoc","Javascript"]
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
font-size: 90%;
color: #c7254e;
background-color: #f9f2f4;
border-radius: 4px;
}
</style>


## 一、JSDoc 是什麼？

JSDoc 是一種用來為 JavaScript 程式碼撰寫註解的標準格式，透過特定的標記（如 @param、@returns 等）來描述函式、變數、物件或類別的用途、參數與回傳值等資訊。這種寫法不僅能夠提升程式碼的可讀性與維護性，也能配合工具自動產生文件，讓團隊成員快速了解程式碼的設計意圖與使用方式。即使在使用 TypeScript 時，JSDoc 依然能輔助補充說明與生成補完提示，是開發流程中常見且實用的文件化工具之一。

### 優點統整如下

- ✅ **提升可讀性**：透過標準化註解讓他人（或未來的自己）更容易理解程式碼用途與邏輯。
- ✅ **自動生成文件**：可搭配像是 jsdoc 工具自動產生 API 文件，節省手動撰寫說明的時間。
- ✅ **加強 IDE 支援**：許多編輯器（如 VS Code）能根據 JSDoc 註解提供更好的自動補全與提示。
- ✅ **補充型別資訊**：即使在 JavaScript 專案中，也能透過 JSDoc 提供型別註解，提升開發時的靜態檢查能力。
- ✅ **有助於團隊協作**：統一的註解風格能讓團隊成員更快理解彼此的程式碼設計。
- ✅ **支援 TypeScript 專案**：即使使用 TypeScript，JSDoc 仍可補充說明、強化文件說明與補完。

## 二、如何開始使用 JSDoc？

### 在 IDE 中快速建立 JSDoc 註解

- 在 IDE 裡面輸入 `/` 接著輸入兩個星號 `**`，會自動提示完成註解區塊結尾 `*/`
- 按下 `Enter` 後，每行會自動加入星號 `*`

### IDE 中顯示註解說明

- 在編輯器中，將滑鼠游標移動到變數或函式上方，即可顯示當初撰寫的註解說明。
- 如果註解內容需要換行，記得要按下 `Enter` 空一行後，編輯器才會正確顯示換行效果

### 特殊標籤的使用（透過 `@`）

輸入 `@` 就能叫出 IDE 的特殊註解提示，特殊註解例如：

- `@description`：功能的敘述說明
- `@param`：函式參數的描述
- `@returns` 或 `@return`：函式回傳值的描述
- `@example`：程式碼範例的說明

## 三、啟用型別檢查

### VSCode 設定

若希望在不修改任何程式碼的情況下，啟用 **所有 JavaScript 檔案的型別檢查**，只需在 VSCode 的「使用者設定」或「工作區設定」中加入以下設定：

```json
"js/ts.implicitProjectConfig.checkJs": true
```

這會針對 **未被 `jsconfig.json` 或 `tsconfig.json` 專案管理的 JavaScript 檔案** 開啟型別檢查。

### `jsconfig.json` 設定

在純 JavaScript 專案內，可以透過建立 `jsconfig.json` 來進行全專案層級的設定，這個檔案是提供給 VS Code 或其他支援的編輯器用來了解專案結構與 JavaScript 行為的設定檔。

#### 基本範例

```json
{
  "compilerOptions": {
    "checkJs": true,       // ✅ 啟用所有 .js 檔案的型別檢查
    "noEmit": true,        // ✅ 不輸出編譯結果（只做型別檢查用）
    "allowJs": true        // ✅ 允許處理 JavaScript 檔案（必要）
  },
  "exclude": ["node_modules"]
}
```

以下為說明

| 選項      | 說明                                                                |
| --------- | ------------------------------------------------------------------- |
| `checkJs` | ✅ 啟用 JavaScript 檔案的型別檢查功能。這是讓 JSDoc 生效的關鍵設定。 |
| `allowJs` | ✅ 允許專案內含 JavaScript 檔案（必開）。                            |
| `noEmit`  | ✅ 僅檢查，不輸出 `.js` 或 `.d.ts` 等產出。                          |
| `exclude` | ❌ 排除不需要被處理的資料夾，例如 `node_modules`。                   |

### 針對單一檔案啟用或停用型別檢查

除了設定 jsconfig.json 和 針對 VSCode 設定 implicitProjectConfig 以外，若想要針對 **單一 JavaScript 檔案**啟用或停用型別檢查，可以加上註解來完成

#### 啟用型別檢查（@ts-check）

若希望讓某個 `.js` 檔案啟用 TypeScript 型別檢查，可以在檔案最上方加上：

```javascript
// @ts-check
```

### 排除型別檢查

如果有設定 jsconfig.json 啟用型別檢查，但有時候可能不希望某個檔案或某段程式碼被檢查，這時可以使用以下方式：

#### 停用整個檔案的型別檢查（@ts-nocheck）

在檔案最上方加上：

```javascript
// @ts-nocheck
```

這會 **完全停用該檔案的型別檢查**，即使裡面有使用 `@ts-check` 也不會生效。

#### 忽略特定一行的型別錯誤（@ts-ignore）

若已經啟用型別檢查，但只希望忽略某一行的錯誤檢查，可以在該行的上方加上：

```javascript
// @ts-ignore
```

### 統整比較優先級

以下是這幾個設定在 Visual Studio Code 與 TypeScript 或 Javascript 檔案中，對「是否進行型別檢查」的優先順序與簡要說明。

1. **`// @ts-nocheck`（檔案層級，強制關閉檢查）**
   - 當檔案頂端有 `// @ts-nocheck` 時，無論其他設定如何，這支檔案都不會進行型別檢查。
   - 如果同一支檔案同時出現 `// @ts-nocheck` 與 `// @ts-check`，會以後面撰寫的型別設定覆蓋前面
2. **`// @ts-check`（檔案層級，強制開啟檢查）**
    - 當檔案頂端有 `// @ts-check` 時，該檔案會啟用型別檢查，即使其他設定關閉了全域檢查，也會以這個註解為準。
3. **`// @ts-ignore`**（行層級，忽略下一行錯誤）
若你想要「只忽略某一行的型別檢查錯誤」，可以在那一行的上一行加上 `// @ts-ignore`，會對該行的錯誤檢查進行忽略。
4. **`jsconfig.json`（專案層級）**
   - 當專案中存在 `jsconfig.json` 並且裡面設定了 `"checkJs": true`（或其他相關設定）時，則整個專案的 `.js` 檔案都會被啟用檢查。
   - 不過若檔案本身有 `// @ts-nocheck` 或 `// @ts-check`，還是會以檔案註解為主。
5. **VS Code 使用者設定 `"js/ts.implicitProjectConfig.checkJs": true"`（編輯器層級）**  
   - 如果專案本身沒有 `jsconfig.json` 或未設定檢查，而你又在 VS Code 的「使用者設定」或「工作區設定」中設置了 `"js/ts.implicitProjectConfig.checkJs": true`，則預設會對所有 `.js` 檔案進行檢查。  
   - 一旦有專案設定 (`jsconfig.json`) 或檔案註解，則會以那些更高層級的設定為主。

### 簡易結論

- **最高優先權**：註解 (`// @ts-ignore`)
- **次高優先權**：檔案註解 (`// @ts-nocheck` 或 `// @ts-check`)
- **中間優先權**：專案層級設定 (`jsconfig.json` 或 `tsconfig.json`)
- **最低優先權**：VS Code 的使用者設定 (`"js/ts.implicitProjectConfig.checkJs"`) 

## 三、常用的 JSDoc 標籤（Tags）介紹與範例

| **標籤**        | **用途**                                       |
| --------------- | ---------------------------------------------- |
| **@param**      | 描述函式的參數                                 |
| **@return**     | 描述函式回傳的資料                             |
| **@example**    | 提供範例程式碼或使用方式                       |
| **@deprecated** | 標示此函式或功能已被廢棄                       |
| **@typedef**    | 宣告一個自訂型別，通常用於描述陣列或物件的結構 |
| **@property**   | 用於在 typedef 中詳細描述物件屬性              |
| **@see**        | 提供相關文件或連結參考                         |
| **@link**       | 在註解文字中插入可以點擊的連結                 |
| **@type**       | 用於宣告一個變數或屬性的型別                   |

範例如下

```javascript
/**
 * @typedef {object} Config
 * @property {string} url - API 網址
 * @property {number} timeout - 請求逾時時間（單位：毫秒）
 * 
 * 這裡定義了一個名為 Config 的自訂型別，用來儲存相關設定。
 */

/**
 * 使用 @type 將此變數定義為一個 Config 物件
 * @type {Config}
 */
let defaultConfig = {
  url: "https://example.com",
  timeout: 3000
};

/**
 * 一個已被宣告為「不建議使用」的函式，示範 @deprecated 標籤。
 *
 * @deprecated 此函式在未來的版本將被移除，請改用 {@link fetchData}。
 * @param {Config} config - 請求的相關設定
 * @return {Promise<string>} 回傳一個 Promise，最終含有此舊版函式的請求結果
 * @example
 * // 範例：
 * deprecatedFetchData(defaultConfig).then((result) => {
 *   console.log(result);
 * });
 * @see https://developer.mozilla.org/  // 參考文件
 */
async function deprecatedFetchData(config) {
  // 這裡可以放置實際的非同步請求，暫時以字串回傳模擬。
  return Promise.resolve("這是一個舊的請求方式，請盡快轉換到新的函式。");
}

/**
 * 建議使用的新函式，示範 @param、@return、@example、@link 與 @see 之間如何關聯。
 *
 * @param {Config} config - 請求的相關設定
 * @return {Promise<string>} 回傳一個 Promise，最終含有此新函式的請求結果
 * @example
 * // 範例：
 * fetchData(defaultConfig).then((result) => {
 *   console.log(result);
 * });
 * @see {@link https://developer.mozilla.org/|MDN Documentation}  // 也可以使用 link 連到 MDN
 */
async function fetchData(config) {
  // 這裡可以放置實際的非同步請求，暫時以字串回傳模擬。
  return Promise.resolve("這是一個新的請求方式。");
}
```

## 四、其他用法

### 透過 Markdown 增強說明內容

- 說明與範例中可直接使用 Markdown 語法，甚至可包含程式碼範例並加上語法 highlight。
- 用 ` ```js ` 包住程式碼，讓其更清楚易讀。
- 也可以使用 Markdown 其他符號，如刪除線 `~文字~` 等。

**範例**：

```javascript
/**
 * @description
 * 基本用法範例：
 * 
 * **使用方法：**
 * ```js
 * import { age, setAge } from "./index.js";
 * 
 * setAge(25); // 設定 age 為 25
 * console.log(age); // 輸出 25
 * ```
 *
 * **其他注意事項：**
 * - 可以使用刪除線 ~刪除文字~ 示範 Markdown 語法。
 * - 使用 **粗體文字** 強調重要資訊。
 */
export let age = 0;

export function setAge(newAge) {
	age = newAge;
}
```js
 * import { age, setAge } from "./index.js";
 * 
 * setAge(25); // 設定 age 為 25
 * console.log(age); // 輸出 25
 * ```
 */
export let age = 0;

export function setAge(newAge) {
	age = newAge;
}
```

### namespace 命名空間

由於 JSDoc 是全域可用的工具，為了避免型別名稱衝突，可以透過 `@namespace` 定義命名空間，將不同模組或功能的相關型別群組起來。

**使用 namespace 的好處**：

- 有效組織相關的型別和物件
- 避免型別名稱發生衝突
- 提升程式碼的可讀性與管理性

**實際使用範例**：

```javascript
/**
 * @namespace Models
 */

/**
 * @typedef {Object} Models.User
 * @property {string} name - 使用者名稱
 * @property {number} age - 使用者年齡
 */

/**
 * @namespace API
 */

/**
 * @typedef {Object} API.User
 * @property {string} id - 使用者 ID
 * @property {string} email - 使用者電子郵件
 */

// 使用方式
/** @type {Models.User} */
const userModel = { name: "Alice", age: 30 };

/** @type {API.User} */
const userAPI = { id: "123", email: "alice@example.com" };
```

透過以上方式使用 `Models.User` 與 `API.User`，就可以清楚區別並避免衝突。

##### 其他參考資料

- [JSDoc as an alternative TypeScript syntax](https://alexharri.com/blog/jsdoc-as-an-alternative-typescript-syntax)
- [Working with JavaScript](https://code.visualstudio.com/docs/nodejs/working-with-javascript)
- [JavaScript 如何拆分 JSDoc 以及虛擬加載 TypeScript 定義檔](https://medium.com/codememo/%E8%99%9B%E6%93%AC%E5%8A%A0%E8%BC%89-typescript-jsdoc-%E5%AE%9A%E7%BE%A9%E6%AA%94%E8%87%B3-javascript-b01f87acf3e0)