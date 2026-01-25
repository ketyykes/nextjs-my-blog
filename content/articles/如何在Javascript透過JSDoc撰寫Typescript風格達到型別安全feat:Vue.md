---
title: 如何在 Javascript 透過 JSDoc 撰寫 Typescript 風格達到型別安全 feat:Vue
slug: 2025-04-16T09:55:00.000Z
date: 2025-04-16T09:55:00.000
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


## 引言

由於歷史因素、早期系統架構，或是團隊的關係，許多開發團隊即使想採用 TypeScript，往往也難以跨越技術負擔與轉換成本。然而，想達成型別安全並提升程式碼品質，並非只能透過 TypeScript。

藉由善用 JSDoc，我們就能在既有的 JavaScript 專案中逐步實現型別檢查，不僅能以最小的成本改善開發效率，也能避免大規模重構的困擾。

本文將透過實務案例，帶你掌握如何在不改變現有架構的前提下，逐步享受到媲美 TypeScript 的型別安全與開發體驗。

## 什麼是 JSDoc 

JSDoc 是一種針對 JavaScript 所設計的註解標準，讓開發者可以透過特定的註解語法，在程式碼中標示變數、函式、參數、回傳值等的型別與用途。

這些註解不僅能作為開發文件的來源，也能搭配現代編輯器或工具（如 VS Code、TypeScript 編譯器）提供自動補全、錯誤提示與靜態分析等功能。簡單來說，JSDoc 是讓純 JavaScript 專案也能擁有接近 TypeScript 的型別提示體驗，有效提升程式碼的可讀性與維護性。

以下是簡單的範例

```javascript
/**
 * 計算兩個數字的總和
 * @param {number} a - 第一個數字
 * @param {number} b - 第二個數字
 * @returns {number} 總和
 */
function add(a, b) {
  return a + b;
}
```

透過撰寫 JSDoc 格式，可以在 IDE 當中透過游標移到該函式當中得到相關註解如下圖

![image](https://hackmd.io/_uploads/B1mvwSs0kx.png)

這樣在實際使用函式的時候就能夠得到型別提示，倘若我們實際代入非期望的型別呢？

如下圖，代入字串型別並沒有任何的提示錯誤

![image](https://hackmd.io/_uploads/SyuhKriAke.png)

若我們希望可以在編輯器當中得到相對應的提示，以 Visual Studio Code 為例，在不修改任何程式碼的情況下，啟用 **所有 JavaScript 檔案的型別檢查**，只需在 VSCode 的「使用者設定」或「工作區設定」中加入以下設定：

```json
"js/ts.implicitProjectConfig.checkJs": true
```

如下圖

![image](https://hackmd.io/_uploads/H1gUYSiRkx.png)


啟用後，這會針對 **未被 `jsconfig.json` 或 `tsconfig.json` 專案管理的 JavaScript 檔案** 開啟型別檢查。

如下圖

![image](https://hackmd.io/_uploads/ByqrhBoRkl.png)

當我們已經了解如何透過設定開啟編輯器對 JavaScript 檔案的型別檢查功能後，下一步就可以進一步優化整體開發體驗。更好的做法是建立一份專案層級的設定檔，來統一管理型別檢查與模組解析等行為。

接下來，我們將介紹 jsconfig.json，他是一個專為 JavaScript 專案設計的設定檔案，能有效整合 JSDoc 型別提示、自動補全與路徑管理等功能，是讓純 JavaScript 專案更接近 TypeScript 開發體驗。


## 什麼是 jsconfig.json 

在上一個部分我們提到 `jsconfig.json`，其實它與熟悉 TypeScript 的開發者常見的 `tsconfig.json` 十分類似。如果你曾經寫過 TypeScript，相信對於 `tsconfig.json` 的用途並不陌生：它是用來設定 TypeScript 編譯器行為的核心檔案。

而對於純 JavaScript 專案來說，`jsconfig.json` 就扮演類似的角色。`jsconfig.json` 是專門為 JavaScript 專案設計的設定檔，用來告訴編輯器（例如 VS Code）如何理解專案的結構並且能啟用 IntelliSense 自動提示、JSDoc 型別檢查與路徑別名等功能，讓純 JavaScript 開發體驗更接近 TypeScript。它特別適合與 JSDoc 搭配使用，在不重構為 TypeScript 的情況下，也能提升專案的可維護性。


### 建立 jsconfig.json 

要在專案中啟用型別檢查與更完善的編輯器支援，只需要在專案根目錄建立一個名為 jsconfig.json 的檔案，撰寫以下最基本的設定：

```json
{
  "compilerOptions": {
    "checkJs": true
  },
  "include": ["./"]
}
```

### 說明：
- `"checkJs": true`：啟用對 `.js` 檔案的型別檢查（搭配 JSDoc 使用效果更佳）。
- `"include": ["./"]`：指定要包含進型別檢查的檔案範圍，這裡是整個專案資料夾。

這份簡單的 `jsconfig.json` 只需在專案根目錄新增並儲存該檔案，編輯器便會自動套用設定，能讓 VS Code 等編輯器啟用 IntelliSense、自動補全與錯誤提示，為 JavaScript 專案帶來基本的型別安全。

## Typescript 風格的 Jsdoc 

通常需要撰寫型別的情況在函式所需帶入的參數，因此我們可以使用 typescript 風格簡化撰寫模式
範例如下

### 有參數、無回傳值
```javascript
/** @type {(dog: Dog) => void} */
const printDogInfo = (dog) => {
  console.log(dog.name);
};
```

### 有參數、有回傳值
```javascript
/** @type {(weight: number, height: number) => number} */
const calculateBMI = (weight, height) => weight / (height * height);
```

### 物件陣列型別
```javascript
/** @type {string[]} */
const dogNames = ['小黑', '球球', '毛毛'];
```

### 物件型別
```javascript
/** @type {{ id: string, name: string, age?: number }} */
const dog = { id: 'd1', name: '球球' };
```

如圖當滑鼠移到 Dog 的參數的時候，就能夠看到所需要帶入的型別

![image](https://hackmd.io/_uploads/BkYXOmXkxe.png)


## 使用.d.ts

當你在 JavaScript 專案中搭配 JSDoc 可以使用 `.d.ts`（**TypeScript 宣告檔案**）
將型別獨立成一個檔案後再使用 `@typedef` 或 `@type` 搭配 `import()` 來引入 `.d.ts` 檔案中定義的型別，好處是可以集中管理型別定義、避免重複撰寫型別註解、提升維護性。

例如有一個檔案叫做 types.d.ts

內容如下
```typescript
// types.d.ts
export interface User {
  name: string;
  age: number;
}
```

### 使用單行 import() 引入型別（適合引入單一型別）

如果只需要引入一個型別，可以在實際使用的地方使用`@typedef` 或 `@type`  搭配`import()`方式引入如下

```javascript
/** @typedef {import('./types').User} User */

/** @type {User} */
const user = { name: 'Danny', age: 30 }
```

### 使用多行 @import 引入型別（適合引入多個型別）

如果一次要引入多個型別，可以使用 @import 的多行方式，範例如下

```javascript
/** @import {
 *   Animal,
 *   UpdateAnimalPayload,
 *   UpdateAnimalSuccessResponse,
 *   QueryAnimalApiResponse,
 *   DeleteAnimalApiSuccessResponse,
 *   DeleteAnimalPayload
 * } from "@/types/animal.d" */

```

## 結合套件型別撰寫 JSDoc 註解（以 Axios 為例）

我們同樣可以像在撰寫 TypeScript 一樣，引入套件所提供的型別，來提升程式碼的可讀性與開發體驗。

以 axios 為例使用 `AxiosResponse`

```javascript
import axios from 'axios';
/** @import {AxiosResponse , AxiosError} from "axios" */

/**
 * @typedef {{ id: number, name: string, active: boolean }} ApiData
 */

/**
 * @type {(userId: number) => Promise<AxiosResponse<ApiData>>}
 */
const fetchUser = async (userId) => {
  return await axios.get(`/api/user/${userId}`);
};

// 範例使用
fetchUser(1).then((res) => {
  console.log(res.data.name); // 這裡會有 IntelliSense 提示
});
```

## 使用型別守衛避免執行錯誤

### 什麼是型別守衛

當我們在撰寫 JavaScript 經常會遇到某個變數可能具有多種型別的情境。**型別守衛（Type Guard）**是一種讓程式在執行期間根據條件判斷「實際型別」的方法，幫助編輯器進行**型別縮小（Type Narrowing）**。這能讓我們在 if 判斷內，更安全地使用特定型別的屬性，避免出現錯誤。

最常見的型別守衛寫法，是使用 `typeof`、`instanceof` 或 `in` 關鍵字；而在 JSDoc 或 TypeScript 中，還可以寫成自訂函式，透過 `value is SomeType` 這種語法讓編輯器「知道」該變數是什麼型別。這種技巧對於混合型別資料（例如 API 回傳的成功與失敗格式）特別有用。

### 實際範例

下面示範 **純 JavaScript + JSDoc** 的「Axios 型別守衛」

```javascript
import axios from 'axios'

/**
 * @typedef {{ message: string }} SuccessResult   成功回傳的資料結構
 * @typedef {{ errorCode: number }} FailResult    失敗回傳的資料結構
 * @typedef {SuccessResult | FailResult} ApiResult
 */


/* 型別守衛：判斷是否為 SuccessResult */


/**
 * 判斷 Axios 回應是否為 SuccessResult
 * @type {(res: import('axios').AxiosResponse<ApiResult>) =>
 *        res is import('axios').AxiosResponse<SuccessResult>}
 */

const isSuccess = (res) => 'message' in res.data

/* 呼叫 API：回傳 Promise<AxiosResponse<ApiResult>> */

/**
 * @type {(id: number) => Promise<import('axios').AxiosResponse<ApiResult>>}
 */
const removeItem = async (id) => {
  return axios.delete(`/api/item/${id}`)
}

/* 使用範例 */

/**
 * @type {(id: number) => Promise<void>}
 */
const confirmHandler = async (itemId) => {
  const res = await removeItem(itemId)

  if (isSuccess(res)) {
    // 這裡 res.data 會被縮小成 SuccessResult
    console.log('✅ 刪除成功：', res.data.message)
  } else {
    // 這裡 res.data 會被縮小成 FailResult
    console.log('❌ 刪除失敗，錯誤碼：', res.data.errorCode)
  }
}
```

#### 重點說明

1. **`isSuccess` 型別守衛**  
   - 利用 `in` 判斷 `res.data` 裡是否有 `message` 這個屬性，就能在 `if` 區塊內讓編輯器正確推斷型別。
2.  **使用 is 自訂型別守衛**
- **`value is SomeType` 是「使用者自訂型別守衛」語法**  
  - 放在函式的回傳型別宣告中，專門給編輯器判斷用。
- **型別窄化機制**  
  - 若函式回傳 `true`，型別系統就把傳入的參數 `value` 視為 `SomeType`。  
  - 例如 `if (isSuccess(res))` 區塊內，`res.data` 會被推斷成 `SuccessResult`，可安全存取 `message`。

> 更詳細可以參考 [Using type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

## 在 vue 當中撰寫 typescript 風格的 jsdoc 

以下示範如何在 **Vue 3 `<script setup>`** 中，使用 **TypeScript 風格的 JSDoc** 來為 `defineProps` 的單一屬性標註型別。

```html
<script setup>
/**
 * 定義元件的屬性型別
 */
const props = defineProps({
  items: {
    /** @type {import('vue').PropType<(File & { previewURL?: string })[]>} */
    type: Array,
    default: () => [],
  },
  selectedButton: {
    type: String,
    default: '全部',
  },
})
</script>
```

## 何時建議撰寫型別？

適時撰寫型別能讓團隊成員（或未來的自己）更容易閱讀與理解程式碼，帶來 **可讀性** 與 **可維護性** 的長期紅利。以下是三種特別建議撰寫型別的情境：

1. **複雜資料結構**  
   - 具有巢狀屬性、可選欄位，或需跨多支函式重複使用時，用 `type` 或 `interface` 把結構「命名」起來。  
2. **API 請求／回應**  
   - 從後端拿到的 JSON 通常欄位眾多，若不事先定義型別，很容易在程式碼各處「手打」屬性名稱而出錯。 
3. **函式的帶入參數與回傳值**  
   - 尤其是工具函式或封裝過的函式能夠提供，「函式名稱 + 參數型別與順序 + 回傳型別」的介面規格，讓人知道要怎麼正確呼叫這支函式。


### 複雜的資料結構範例

```typescript
export type Animal = {
  id: number
  name: string
  species: AnimalSpecies          // 自訂列舉
  gender?: AnimalGender           // 自訂列舉
  birth?: Date
  note?: string
  createdAt?: Date
  updatedAt?: Date
}
```

### API 請求／回應 範例

```typescript
/* ===== 核心資料結構 ===== */
export type Animal = {
  id: number
  name: string
  species: AnimalSpecies          // 自訂列舉
  gender?: AnimalGender           // 自訂列舉
  birth?: Date
  note?: string
  createdAt?: Date
  updatedAt?: Date
}

/* ===== 請求 Payload ===== */
export type CreateAnimalPayload = Omit<
  Animal,
  'id' | 'createdAt' | 'updatedAt'
>

export type UpdateAnimalPayload = Omit<
  Animal,
  'createdAt' | 'updatedAt'
>

/* ===== 回應 Response ===== */
export type ApiMsg<T extends string> = { message: T }

export type CreateAnimalFail   = ApiMsg<'名稱重複'>
export type UpdateAnimalSuccess = ApiMsg<'修改成功'>

export type DeleteAnimalSuccess = ApiMsg<'刪除成功'>
export type DeleteAnimalPayload = { id: number }

/* =====  API 綜合型別 ===== */
export type QueryAnimalFail    = AxiosError<any, any>
export type QueryAnimalSuccess = AxiosResponse<Animal[]>

export type QueryAnimalResponse =
  | QueryAnimalFail
  | QueryAnimalSuccess

export type DeleteAnimalResponse = AxiosResponse<
  DeleteAnimalSuccess,
  DeleteAnimalPayload
>
```

### 函式的帶入參數與回傳值範例

```javascript
/**
 * 建立動物資料
 * @type {(payload: CreateAnimalPayload) => Promise<AxiosResponse<Animal>>}
 */
const createAnimal = async (payload) => {
  return axios.post('/api/animals', payload);
};
```

#### 參考資料

- [Typescript 官方文件 - JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Using type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)