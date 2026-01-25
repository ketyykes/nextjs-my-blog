---
title: TypeScript 開發者必學：Zod 資料驗證完整教學
slug: 2023-07-19T13:31:00.000Z
date: 2023-07-19T13:31:00.000Z
tags: ["Typescript"]
---

## 前言

TypeScript 作為靜態型別檢查的工具，在撰寫程式碼時可以透過編輯器的輔助幫你檢查可能的型別錯誤。但當程式在執行時需要進行資料驗證時，就得仰賴 Zod 這種動態型別檢查工具了。

### 實際應用場景

- **使用者表單驗證**：當使用者輸入表單內容時，我們希望符合特定的資料格式或型別
- **API 資料驗證**：後端從 API 回傳到客戶端的資料需要即時做型別檢查
- **外部資料處理**：處理來自不同來源且格式不確定的資料

## Zod 簡介

以下內容取自官方文件的中文翻譯
Zod 是一個以 TypeScript 為主的巢狀結構宣告和驗證程式庫。我們使用「模式」(Schema) 這個詞來廣義指代任何資料類型，從簡單的字串到複雜的巢狀物件。
Zod 的設計目標是盡可能對開發人員友好。它的目標是消除重複的型別宣告。使用 Zod 你只需宣告一次驗證器，Zod 將自動推斷出靜態的 TypeScript 型別。
它很容易將較簡單的型別組合成複雜的資料結構。

### 主要特點

- **零相依性**：不需要額外的套件
- **輕量化**：經壓縮後僅佔 8KB
- **不可變性**：函式會回傳新的實例
- **鏈式語法**：簡潔、可鏈式的語法介面
- **型別推斷**：自動推斷靜態 TypeScript 型別
- **跨平台**：在 Node.js 和所有現代瀏覽器中運作
- **純 JavaScript 相容**：不需要使用 TypeScript 也能運作
- **functional method**：著重於資料解析而非單純驗證

## 安裝與設定

### 安裝指令

依據你的管理套件安裝 zod，在終端機輸入以下指令

```bash
npm install zod       # npm
yarn add zod          # yarn
bun add zod           # bun
pnpm add zod          # pnpm
```

### 環境需求

- TypeScript 4.5 以上版本
- tsconfig.json 必須開啟 strict 選項

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

> [Zod-Requirements](https://zod.dev/?id=requirements)

## 基本驗證方法

### parse() 驗證

`parse()` 會直接回傳驗證後的資料，若驗證失敗則拋出錯誤。

```typescript
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number().positive(),
  email: z.string().email(),
});

const userData = {
  name: "John",
  age: 25,
  email: "john@example.com",
};

try {
  const user = userSchema.parse(userData);
  console.log(user); // 回傳深拷貝的資料
} catch (error) {
  console.error(error);
}
```

**注意**：`parse()` 回傳的是深拷貝（deep clone）的資料。這代表 Zod 會複製一份完整的物件資料，而不是直接回傳原始物件的參考。例如當我們驗證 userData 物件時，parse() 會回傳一個全新的物件副本，確保原始資料不會被修改。

> [zod-Schema methods-parse]([https://zod.dev/?id=schema-methods](https://zod.dev/?id=parse))
> IMPORTANT: The value returned by .parse is a deep clone of the variable you passed in.

我們嘗試著帶入不符合 Schema 的的內容

```typescript
const userData = {
    name: 'John',
    age: 25,
    email: 'john',
};
```

如下圖
就會跳出紅字的錯誤

![](https://hackmd.io/_uploads/By6dCImon.png)


#### 加入驗證訊息的範例

常用的情形會建立一個 z.object 的物件，裡面使用 primitie 的方式，

如下面程式碼範例可以使用.min()，在參數的部分第一個參數帶入 3，表示至少需要三個字，第二個參數則是錯誤訊息，另外一個範例是使用.url() 表示網站的格式。

```typescript
const userSchema = z.object({
  name: z.string().min(3, "名字至少需要 3 個字"),
  website: z.string().url("網站連結格式不正確"),
});
```

> 更多可以參考官方文件官方文件[zod-doc-string](https://zod.dev/?id=strings)

### safeParse() 驗證

#### safeParse() 基本說明

`safeParse()` 不會拋出錯誤，而是回傳包含驗證結果的物件。與 `parse()` 的差別在於，`safeParse()` 不會造成錯誤並且會回傳一個物件，這個物件包含了成功與否的布林值（success）以及資料（data）。當驗證成功時，success 為 true 且可以從 data 取得驗證後的資料。

#### 驗證成功範例

```typescript
//以上省略
const userData = {
        name: 'John',
        age: 25,
        email: 'john@example.com',
    };

const result = userSchema.safeParse(userData);
console.log(result);
```

回傳如下圖

![](https://hackmd.io/_uploads/Hyv9rvQs2.png)

#### 驗證失敗範例與錯誤處理

```typescript
//以上省略
const userData = {
    name: 'John',
    age: 25,
    email: 'john',
};

const result = userSchema.safeParse(userData);
console.log(result);
if (result.success) {
    const user = result.data;
    console.log(user);
} else {
    const validationErrors = result.error.issues;
    console.error(validationErrors);
}
```

當驗證失敗時，safeParse() 會回傳一個物件，其中：
- success 屬性會是 false
- error 屬性會包含詳細的錯誤資訊，例如哪些欄位驗證失敗以及原因

如下圖所示，email 欄位因為格式不正確而驗證失敗：

![](https://hackmd.io/_uploads/H1ZMLPXi3.png)

#### safeParse() 使用總結

因此我們可以使用 safeParse() 函式來進行資料驗證，並搭配 if-else 條件判斷來處理不同的結果：

- 當驗證成功時 (success 為 true)，我們可以從 result.data 取得驗證後的資料
- 當驗證失敗時 (success 為 false)，我們可以從 result.error.issues 取得詳細的錯誤訊息

這樣的寫法比起直接使用 parse() 更安全且更容易處理錯誤情況。

### z.infer 型別推斷

透過 `z.infer` 從 schema 推斷對應的 TypeScript 型別。

```typescript
const userSchema = z.object({
  name: z.string(),
  age: z.number().positive(),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>;
// 等同於 type User = { name: string; age: number; email: string; }

const user: User = {
  name: "John",
  age: 25,
  email: "john@example.com",
};
```

## 基本型別驗證

了解了如何使用 `z.infer` 從 schema 推斷型別後，讓我們深入探討 Zod 提供的各種基本型別驗證方法。這些驗證器是構建複雜 schema 的基石，掌握它們能讓你更有效地進行資料驗證。

### 字面量型別（Literals）

```typescript
const myLiteral = z.literal('我的字');
myLiteral.parse('我的字'); // 成功
// myLiteral.parse('其他字'); // 失敗
```

### 字串（String）驗證

#### 常用驗證方法

| 語法                  | 說明                      |
| --------------------- | ------------------------- |
| `.max(5)`             | 字符串長度不超過 5 個字符 |
| `.min(5)`             | 字符串長度不少於 5 個字符 |
| `.length(5)`          | 字符串長度等於 5          |
| `.email()`            | 有效的電子郵件地址        |
| `.url()`              | 有效的 URL                |
| `.uuid()`             | 有效的 UUID               |
| `.regex(regex)`       | 符合正則表達式            |
| `.includes(string)`   | 包含特定子字符串          |
| `.startsWith(string)` | 以特定字符串開頭          |
| `.endsWith(string)`   | 以特定字符串結尾          |
| `.datetime()`         | 有效的 ISO 8601 日期時間  |
| `.ip()`               | 有效的 IP 地址            |

#### 範例

```typescript
// 長度限制
const limitedString = z.string().min(3).max(10);

// 正則表達式
const patternString = z.string().regex(/^[a-zA-Z]+$/);

// ISO 日期時間
const datetime = z.string().datetime();
datetime.parse("2020-01-01T00:00:00Z"); // 成功

// IP 地址
const ip = z.string().ip();
ip.parse("192.168.1.1"); // 成功
ip.parse("84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003"); // 成功

// 自訂錯誤訊息
const nameSchema = z.string().min(3, "名字至少需要 3 個字");
const websiteSchema = z.string().url("網站連結格式不正確");
```

### 數字（Number）驗證

| 語法                          | 說明             |
| ----------------------------- | ---------------- |
| `.gte(value)` / `.min(value)` | 大於或等於指定值 |
| `.lt(value)`                  | 小於指定值       |
| `.lte(value)` / `.max(value)` | 小於或等於指定值 |
| `.int()`                      | 整數             |
| `.positive()`                 | 大於 0           |
| `.nonnegative()`              | 大於或等於 0     |
| `.negative()`                 | 小於 0           |

```typescript
const ageSchema = z.number().int().positive().max(120);
const scoreSchema = z.number().min(0).max(100);
```

### 其他基本型別

```typescript
// 布林值
const boolSchema = z.boolean();

// 大整數
const bigintSchema = z.bigint();

// 日期
const dateSchema = z.date();

// NaN
const nanSchema = z.nan();
```

## TypeScript 常見型別

### 列舉（Enum）

#### Zod 列舉

```typescript
const languageSchema = z.enum(["html", "css", "javascript"]);

const userSchema = z.object({
  name: z.string(),
  language: languageSchema,
});
```

#### 原生 TypeScript 列舉

```typescript
enum Language {
  HTML = "html",
  CSS = "css",
  JavaScript = "javascript",
}

const userSchema = z.object({
  name: z.string(),
  language: z.nativeEnum(Language),
});
```

### 元組（Tuple）

```typescript
// 基本元組
const basicTuple = z.tuple([z.string(), z.number(), z.boolean()]);
basicTuple.parse(['OpenAI', 42, true]); // 成功

// 含 Rest 參數的元組
const variadicTuple = z.tuple([z.string()]).rest(z.number());
variadicTuple.parse(['OpenAI', 42, 2023]); // 成功
```

### 聯合型別（Union）

```typescript
const stringOrNumber = z.union([z.string(), z.number()]);
stringOrNumber.parse('Hello'); // 成功
stringOrNumber.parse(123); // 成功

// 使用 or 方法
const stringOrNumberAlt = z.string().or(z.number());
```

## 進階功能與實用方法

### 可選值處理

在 Zod 中的 nullable()、nullish() 和 optional() 都是用來處理可選值或空值的方法，但它們各自的作用和使用場景有所不同：

```typescript
// 可選（undefined）
const optionalString = z.string().optional();

// 可為空（null）
const nullableString = z.string().nullable();

// 可為空或未定義（null | undefined）
const nullishString = z.string().nullish();

// 預設值
const stringWithDefault = z.string().default("預設值");
```

### 物件操作

#### partial() - 部分屬性

```typescript
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const PartialUserSchema = UserSchema.partial();
// 所有屬性都變成可選
PartialUserSchema.parse({}); // 成功
```

#### pick() 和 omit() - 挑選與忽略

```typescript
const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
  city: z.string(),
});

// 只保留指定屬性
const PickedUserSchema = UserSchema.pick({ name: true, age: true });

// 排除指定屬性
const OmittedUserSchema = UserSchema.omit({ city: true });
```

#### catchall() - 捕獲額外屬性

```typescript
const schemaWithCatchall = z.object({
  name: z.string(),
  age: z.number(),
}).catchall(z.any());

// 可以接受任何額外的屬性
schemaWithCatchall.parse({
  name: "John",
  age: 30,
  extraField: "任何值"
}); // 成功
```

#### 嚴格模式與通過模式

```typescript
// 嚴格模式：不允許額外屬性
const strictSchema = z.object({
  name: z.string(),
}).strict();

// 通過模式：保留額外屬性
const passthroughSchema = z.object({
  name: z.string(),
}).passthrough();
```

### 陣列驗證

```typescript
// 字串陣列
const stringArray = z.array(z.string());

// 限制陣列長度
const limitedArray = z.array(z.string()).min(1).max(5);

// 非空陣列
const nonEmptyArray = z.array(z.string()).nonempty();
```

### 深度部分（deepPartial）

```typescript
const nestedSchema = z.object({
  user: z.object({
    name: z.string(),
    profile: z.object({
      age: z.number(),
    }),
  }),
});

const deepPartialSchema = nestedSchema.deepPartial();
// 所有層級的屬性都變成可選
```

## 實際應用範例

### 表單驗證

```typescript
const registrationSchema = z.object({
  username: z.string()
    .min(3, "使用者名稱至少需要 3 個字符")
    .max(20, "使用者名稱不能超過 20 個字符"),
  email: z.string()
    .email("請輸入有效的電子郵件地址"),
  password: z.string()
    .min(8, "密碼至少需要 8 個字符")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密碼必須包含大小寫字母和數字"),
  age: z.number()
    .int("年齡必須是整數")
    .min(18, "年齡必須大於 18 歲")
    .max(120, "年齡不能超過 120 歲"),
  website: z.string()
    .url("請輸入有效的網站連結")
    .optional(),
});

// 使用範例
function validateRegistration(data: unknown) {
  const result = registrationSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      errors: result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    };
  }
}
```

## 總結
Zod 是驗證程式庫，提供型別安全保障。透過核心功能，可以建立資料驗證機制：

- **驗證**：使用 `parse()` 和 `safeParse()` 進行資料驗證
- **型別推斷**：使用 `z.infer` 建立 TypeScript 型別
- **驗證器**：支援字串、數字、日期等型別驗證
- **功能**：部分屬性、聯合型別、錯誤訊息等
- **方法**：`optional()`、`nullable()`、`default()` 等處理情況

使用 Zod 可以確保資料完整性和一致性，適合用於表單驗證、API 資料處理和資料源型別檢查。

##### 其他參考資料

- [Runtime Type Safety with Zod](https://blog.testdouble.com/posts/2023-01-30-zod-runtime-type-safety/)
- [Schema validation in TypeScript using Zod](https://blog.logrocket.com/schema-validation-typescript-zod/)
