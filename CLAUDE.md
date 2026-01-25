# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

「水土曜來了」技術部落格的 Next.js 15 版本，從 Gatsby 5 遷移而來。包含 120+ 篇技術文章，主題涵蓋 JavaScript、React、D3.js、TypeScript、AI/LLM 等。

## 開發指令

```bash
pnpm dev                # 開發伺服器 (Turbopack)
pnpm build              # 建置正式版本
pnpm lint               # ESLint 檢查
pnpm format             # Prettier 格式化

# 單元測試 (Vitest)
pnpm test               # 監聽模式
pnpm test:run           # 單次執行
pnpm test:coverage      # 覆蓋率報告

# E2E 測試 (Playwright)
pnpm test:e2e           # 執行 E2E 測試
pnpm test:e2e:ui        # 互動式 UI 模式
pnpm test:e2e:report    # 查看測試報告

# 新增 shadcn/ui 元件
npx shadcn@latest add [component-name]
```

## 架構概覽

### 技術堆疊

- **框架**: Next.js 15 (App Router) + React 19
- **樣式**: Tailwind CSS v4 + shadcn/ui (New York style)
- **內容管理**: Content Collections + Shiki 語法高亮
- **測試**: Vitest (單元) + Playwright (E2E)
- **表單**: react-hook-form + zod

### 路由結構

| 路徑 | 說明 |
|------|------|
| `/` | 首頁 (作品集展示) |
| `/tech-page` | 文章列表 (分頁) |
| `/tech-page/[slug]` | 單篇文章 |
| `/tags` | 標籤總覽 |
| `/tags/[tag]` | 標籤文章列表 |
| `/photo` | 攝影集 |
| `/about` | 關於頁面 |

### 元件架構

```
src/components/
├── ui/           # shadcn/ui 基礎元件 (button, card, dialog...)
├── article/      # 文章相關 (ArticleCard, Pager, GiscusComments, MermaidRenderer)
├── layout/       # 佈局元件 (Header, Navbar, Banner, Footer)
├── search/       # 搜尋功能 (SearchCommand 使用 cmdk)
├── portfolio/    # 作品集 (PortfolioTabs, PortfolioCard)
├── photo/        # 攝影集 (PhotoAlbum)
└── shared/       # 共用元件 (ThemeProvider, ThemeToggle, LoadingProgress)
```

每個元件目錄都有 `index.ts` 統一匯出，使用方式：
```typescript
import { ArticleCard, Pager } from '@/components/article'
import { Header, Footer } from '@/components/layout'
```

### 內容管理 (Content Collections)

文章存放於 `content/articles/*.md`，Frontmatter 格式：

```yaml
---
title: "文章標題"
date: "YYYY-MM-DD"
tags: ["React", "TypeScript"]
---
```

- Slug 由檔名自動生成（支援中文，見 `content-collections.ts` 的 `slugify` 函式）
- 語法高亮使用 Shiki (one-dark-pro 主題)
- 文章 HTML 由 `compileMarkdown` 在建置時生成

### 測試架構

**單元測試** (`src/**/__tests__/*.test.tsx`)
- 使用 Vitest + React Testing Library
- happy-dom 作為測試環境
- 覆蓋率門檻：98%
- 排除：shadcn/ui 元件、App Router 頁面

**E2E 測試** (`e2e/*.spec.ts`)
- 使用 Playwright (Chromium)
- 自動啟動開發伺服器
- 測試涵蓋：首頁、文章列表、搜尋、標籤、攝影集、關於頁

## 重要設定

- **路徑別名**: `@/*` → `./src/*`
- **shadcn/ui**: New York style, Slate 主題, CSS Variables 啟用
- **TypeScript**: 嚴格模式
- **Prettier**: 無分號、單引號、Tailwind 類別排序

## 第三方服務

- **圖片**: Cloudinary（需設定 image loader）
- **留言**: Giscus（連結 GitHub Discussions）
- **部署**: Netlify

## 注意事項

1. **Mermaid 圖表**: 客戶端渲染，使用 `MermaidRenderer` 元件搭配 useEffect
2. **深色模式**: 透過 `next-themes` 的 `ThemeProvider` 實現
3. **搜尋功能**: 使用 cmdk 實現命令面板式搜尋 (Cmd+K)
4. **分頁邏輯**: 每頁 10 篇文章
