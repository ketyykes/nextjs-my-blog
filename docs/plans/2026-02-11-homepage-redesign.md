# 首頁改版設計文件

> 日期：2026-02-11
> 狀態：已確認，待實作

## 設計概要

將部落格首頁打造為沉浸式互動體驗，以全螢幕 3D 星空場景為核心，搭配滾動觸發動畫的多區塊故事式佈局。

## 滾動流程

```
[全螢幕 3D 星空 Hero — 土星 + 標題 + CTA]
        ↓ 滾動
[導航卡片 — 4 張毛玻璃卡片]
        ↓ 滾動
[精選文章 — 最新 3-6 篇文章卡片]
        ↓ 滾動
[CTA — 行動呼籲按鈕]
        ↓
[Footer]
```

## 技術架構

### 新增套件

- `@react-three/fiber` — React Three.js 渲染器
- `@react-three/drei` — 3D 工具元件（Stars, Float, OrbitControls 等）
- `@react-three/postprocessing` — 後處理特效（Bloom 光暈）

### 已有套件（直接使用）

- `framer-motion` v12 — 滾動觸發動畫、入場動畫
- `lucide-react` — 圖示
- `tailwind-merge` + `clsx` — 樣式工具

### 元件結構

```
src/components/home/
├── index.ts                  # 統一匯出
├── hero-section.tsx          # 全螢幕 3D 星空 + 標題疊層
├── star-field.tsx            # Three.js 星空場景（Canvas）
├── saturn-model.tsx          # 土星 3D 模型
├── navigation-cards.tsx      # 導航卡片區塊
├── featured-articles.tsx     # 精選文章區塊
└── cta-section.tsx           # 最終 CTA 區塊
```

所有 3D 元件使用 `next/dynamic` 搭配 `ssr: false` 動態載入。

## Section 1：Hero（全螢幕 3D 星空）

### 視覺效果

**暗色模式**：
- 深邃宇宙背景（接近黑色，帶微微深藍）
- 數百顆星星粒子，有大小和亮度差異，微微閃爍
- 一顆土星（帶光環），緩慢自轉，位於場景偏右
- 淡紫藍色星雲霧氣
- Bloom 後處理讓亮點發光
- 偶爾飛過的流星

**亮色模式**：
- 柔和淺藍漸層天空
- 粒子變成金色/銀色光點
- 土星保留，改為水彩質感，帶柔和陰影和光環
- 星雲變成輕盈白色雲霧
- 整體氛圍：夢幻、輕柔

### 互動

- 滑鼠移動 → 星空視角微幅跟隨（parallax，約 ±5 度）
- 土星持續緩慢旋轉

### 文字疊層（HTML overlay）

- 主標題「水土曜來了」— 大字，帶微發光效果
- 副標題「前端開發 ・ 技術筆記 ・ 攝影記錄」
- CTA 按鈕「開始探索 ↓」— 點擊平滑滾動到下一區塊
- 底部滾動提示箭頭動畫（輕輕彈跳）

## Section 2：導航卡片

### 觸發方式

向下滾動離開 Hero 後，卡片依序從下方淡入 + 上滑進場（staggered animation）。

### 卡片內容

| 卡片     | 連結         | 圖示         | 簡述                              |
|----------|-------------|-------------|----------------------------------|
| 技術文章 | `/tech-page` | `FileText`  | 120+ 篇前端、React、TypeScript 筆記 |
| 作品集   | `/portfolio` | `Briefcase` | Side projects 與實作作品展示        |
| 攝影集   | `/photo`     | `Camera`    | 街拍、旅行、日常攝影記錄            |
| 關於我   | `/about`     | `User`      | 自我介紹與聯絡方式                  |

### 卡片設計

- 毛玻璃效果（`backdrop-blur` + 半透明背景）
- 懸浮時：微上移 + 放大 + 邊框發光
- 圖示帶漸層色或主題色
- 2x2 Grid 佈局（手機 1 欄）

## Section 3：精選文章

### 觸發方式

滾動觸發，卡片交錯從下方浮入（staggered fade-up）。

### 內容

- 區塊標題「精選文章」+ 副標題
- 最新 3-6 篇文章卡片
- 底部「查看全部文章 →」連結到 `/tech-page`

### 卡片設計

- 3 欄 Grid（平板 2 欄、手機 1 欄）
- 包含：文章標題、日期、標籤（1-2 個）
- 懸浮效果：微上移 + 陰影加深 + 邊框色變化
- 風格與現有 `ArticleCard` 一致，加上動畫

## Section 4：CTA

### 設計

- 標題「準備好探索了嗎？」
- 兩個按鈕並排：
  - **主按鈕**「閱讀技術文章」→ `/tech-page`
  - **次按鈕**「瀏覽攝影集」→ `/photo`
- 進場動畫：fade-in + 微微放大
- 背景可有輕量的 2D 星點裝飾

## 深色/亮色模式策略

| 元素       | 暗色模式                  | 亮色模式                    |
|-----------|--------------------------|----------------------------|
| 星空背景   | 深邃黑藍                  | 柔和淺藍漸層                |
| 星星粒子   | 白色，明亮閃爍             | 金色/銀色光點               |
| 土星       | 發光星體質感               | 水彩質感，帶柔和陰影         |
| 星雲       | 紫藍色光暈                 | 半透明白色雲霧              |
| 卡片       | 深色毛玻璃                 | 淺色毛玻璃                  |
| 文字       | 白色/淺色                  | 深色                       |

## 效能考量

- 3D 場景使用 `next/dynamic` + `ssr: false`
- Canvas 搭配 `frameloop="demand"` 或視口外暫停
- 圖片使用 lazy loading
- framer-motion 動畫使用 `whileInView` + `viewport={{ once: true }}`
- 首屏 LCP 目標 < 2.5s

## 受影響的檔案

- `src/app/page.tsx` — 新首頁（組合所有區塊）
- `src/components/home/*` — 全部新增
- `package.json` — 新增 3 個 R3F 套件
- `e2e/home.spec.ts` — 需更新
- `e2e/links/static-pages.spec.ts` — 需更新
- `e2e/links/navigation.spec.ts` — 需更新
