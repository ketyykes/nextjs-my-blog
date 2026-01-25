---
title: ESLint 9.0：扁平化配置如何改變開發流程
slug: 2024-12-25T07:45:23.000Z
date: 2024-12-25T07:45:23.000Z
tags: ["Eslint","Javascript"]
---

## 一、傳統配置的問題

舊版 ESLint 的配置方式存在以下問題：

- 支援多種副檔名：`.eslintrc`、`.eslintrc.js`、`.eslintrc.json`，甚至 `package.json`
- 基於隱式（implicit）的 `extends`，如繼承多層規則，可能導致繼承樹非常複雜
- 插件系統基於 npm 套件，若插件停止維護，需自行尋找替代方案

這些問題讓傳統配置方式不夠靈活，且難以追溯來源。

## 二、扁平化配置的優勢

新版 ESLint 引入扁平化配置，核心改進包括：

1. **單一配置檔案**
   - 使用 `eslint.config.js` 或 `.cjs`、`.mjs` 格式
2. **顯式引入（Explicit Import）**
   - 規則與插件基於 `import` 物件的形式，提升可控性
3. **靈活的插件命名**
   - 透過 Javascript import 物件方式引入後重新命名插件，方便替換棄用的 plugin，例如將已停維護的 `eslint-plugin-node` 替換為 `eslint-plugin-n`
4. **高組合性**
   - 僅輸出單一陣列，結構更簡單且易於追蹤
5. **完全控制權**
   - 配置檔案基於 JavaScript，可動態調整規則與繼承和 overwrite
6. **更高效的共享配置**
   - 可透過工廠函式動態生成配置，提升可重用性

## 三、扁平化配置歷程

- **2019 年**：開始規劃
- **2022 年中**：8.21 版本推出實驗性功能
- **8.45 版本**：扁平化配置成為穩定功能
- **9.0 版本**：扁平化配置成為預設配置方式

## 四、工具與生態系統

### 1. 遷移工具

- 使用官方工具 `@eslint/migrate-config`
- 自動加入相容性運行時所需的 library

```bash
npx @eslint/migrate-config .eslintrc.json
```

### 2. 視覺化工具

- 使用 `eslint --inspect-config` 命令啟動伺服器
- 功能：
  - 確認每個規則是來自哪個插件（plugin）。
  - 檢視哪些規則尚未被使用或使已經被使用。
  - 搜尋特定檔案使用的相關配置。
  - 規則在特定條件下如何被啟用或應用 (overloaded)。

### 3. 第三方工具

- `eslint-typegen`：支援自動完成和類型生成

#### 補充說明  規則在特定條件下如何被啟用 (overloaded)

ESLint 的扁平化配置支持根據檔案類型或特定條件動態加載規則。例如，當處理 `.md`（Markdown）副檔名的檔案時，可以設定不檢查未使用的變數（`no-unused-vars`）等規則，以避免對 Markdown 檔案不必要的檢查。同樣的，你可以針對其他檔案類型（如 `.js` 或 `.vue`），指定不同的規則，達到更加靈活且有針對性的配置方式，讓 Linter 更符合專案需求。

## 五、配置範例對比

### 1. 傳統配置

```json
{
  "extends": [
    "@antfu/eslint-config",
    "@antfu/eslint-config-ts",
    "@antfu/eslint-config-vue",
    "@antfu/eslint-config-vue-ts"
    // ...需要提供所有的組合，換句話說需要相當理解你的 extend 所做的配置。
  ],
  "rules": {
    // 為了修改一項設定檔需要非常的多的手動覆蓋
    "indent": ["error", 4],
    "@typescript-eslint/indent": ["error", 4],
    "jsx-indent": ["error", 4],
    "vue/indent": ["error", 4]
  }
}
```

### 2. 扁平化配置

```typescript
import antfu from '@antfu/eslint-config'

// 新型的配置簡化了方式
export default antfu({
  vue: true,
  typescript: true,
  stylistic: {
    indent: 4
  }
})
```

## 六、ESLint 的多元功能

### 1. 格式化工具

- **ESLint 也可以是格式化工具**  
  許多專案從一開始就以 ESLint 作為格式化工具使用，這並非新鮮事。

- **使用專用格式化工具的爭議**  
  有人建議使用專用的格式化工具如 Prettier 或 dprint，但實際上取決於維護需求。

- **ESLint Stylistic 專案**  
  - ESLint 和 TypeScript ESLint 團隊已從核心中棄用風格規則。  
  - 新的 ESLint Stylistic 專案由社區繼續維護這些規則，支援 JS、TS 和 JSX。

- **為什麼繼續使用 ESLint 作為格式化工具**  
  - 比 Prettier 更靈活且可定制，適合高需求的專案。

- **VS Code 範例設定**  
  - 使用 `editor.codeActionOnSave` 在保存時自動修復 ESLint 錯誤。
  - 使用 `eslint.rules.customizations` 靜默風格規則，使其更像格式化工具。

### 2. 遷移工具

- **Codemod 工具的應用**  
  - ESLint 的規則是一個函式，可以接收程式碼和 AST，報告錯誤並提供修復建議。  
  - 可用作 Codemod 工具，進行程式碼轉換。

- **範例：`eslint-plugin-command`**  
  - 支援基於註解的程式碼轉換，例如：
    - `to-function`：將箭頭函數轉換為函數聲明。
    - `to-arrow`：將函數聲明轉換回箭頭函數。
    - `keep-sorted`：對陣列或物件進行排序。
    - `keep-unique`：確保陣列內元素唯一。

- **學習 AST 撰寫自訂 Codemod**  
  瞭解 AST，可以撰寫一次性 Codemod 規則來遷移 library。

### 3. 跨語言支持

ESLint 支援多種語言，以下是支援語言與對應外掛及維護者的列表：

| 語言       | 外掛                                                                       | 維護者                                                |
| ---------- | -------------------------------------------------------------------------- | :---------------------------------------------------- |
| Markdown   | [`@eslint/markdown`](https://github.com/eslint/markdown)                   | {@eslint}                                             |
| CSS        | [`@eslint/css`](https://github.com/eslint/css)                             | {@eslint}                                             |
| TypeScript | [`@typescript-eslint`](https://typescript-eslint.io)                       | {@typescript-eslint} {@bradzacher} {@JoshuaKGoldberg} |
| Vue        | [`eslint-plugin-vue`](https://github.com/vuejs/eslint-plugin-vue)          | {@ota-meshi} {@vuejs}                                 |
| Svelte     | [`eslint-plugin-svelte`](https://github.com/sveltejs/eslint-plugin-svelte) | {@ota-meshi} {@sveltejs}                              |
| Astro      | [`eslint-plugin-astro`](https://github.com/ota-meshi/eslint-plugin-astro)  | {@ota-meshi}                                          |
| JSON       | [`eslint-plugin-jsonc`](https://github.com/ota-meshi/eslint-plugin-jsonc)  | {@ota-meshi}                                          |
| YAML       | [`eslint-plugin-yml`](https://github.com/ota-meshi/eslint-plugin-yaml)     | {@ota-meshi}                                          |
| TOML       | [`eslint-plugin-toml`](https://github.com/ota-meshi/eslint-plugin-toml)    | {@ota-meshi}                                          |
| GraphQL    | [`graphql-eslint`](https://github.com/dimaMachina/graphql-eslint)          | {@dimaMachina}                                        |
| HTML       | [`html-eslint`](https://github.com/yeonjuan/html-eslint)                   | {@yeonjuan}                                           |
| MDX        | [`eslint-mdx`](https://github.com/mdx-js/eslint-mdx)                       | {@JounQin}                                            |
| 其他格式   | [`eslint-plugin-format`](https://github.com/antfu/eslint-plugin-format)    | {@antfu}                                              |

ESLint 的強大功能使其超越了一般的 Linter，不僅能進行程式碼檢查，還能作為格式化工具和遷移工具，並支援多語言。

##### 相關資源

- [官方配置工具](https://eslint.org/blog/2024/04/eslint-config-inspector/)
- [扁平化配置指南](https://eslint.org/blog/2023/10/flat-config-rollout-plans/)
- [GitHub - eslint/config-inspector](https://github.com/eslint/config-inspector/)
- [web conf - 投影片](https://talks.antfu.me/2024/webconf-tw/)
