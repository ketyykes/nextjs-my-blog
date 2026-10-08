# TODO: 首頁改版計畫

## 現況

- 原首頁（作品集）已搬遷至 `/portfolio`
- 新首頁 (`/`) 目前為佔位頁面
- 導覽列已新增「作品集」連結

## 設計方向（待決定）

> 目標：打造一個「炫泡」的首頁，給訪客留下深刻印象

### 可能的方向

- [ ] **Hero 動態效果** — 粒子動畫、漸層流動、打字機效果
- [ ] **3D 互動元素** — Three.js / React Three Fiber 場景
- [ ] **滾動驅動動畫** — Framer Motion / GSAP 滾動敘事
- [ ] **Bento Grid 佈局** — 現代化多區塊卡片式首頁
- [ ] **互動式自我介紹** — 動態時間軸 / 技能樹
- [ ] **最新文章精選** — 動態卡片輪播或瀑布流

## 實作清單

### Phase 1: 設計確認

- [ ] 決定首頁設計方向與風格
- [ ] 確認需要展示的內容區塊（自介、精選文章、作品集預覽、技術棧等）
- [ ] 選定動畫/互動方案與對應套件

### Phase 2: 基礎架構

- [ ] 安裝必要的動畫/3D 套件
- [ ] 建立首頁區塊元件結構 (`src/components/home/`)
- [ ] 實作 Hero Section
- [ ] 實作各內容區塊

### Phase 3: 動畫與互動

- [ ] 加入入場動畫與過場效果
- [ ] 實作滾動驅動互動
- [ ] 深色/淺色模式適配
- [ ] 響應式設計（手機/平板/桌面）

### Phase 4: 優化與測試

- [ ] 效能優化（lazy load、動態 import）
- [ ] Core Web Vitals 確認（LCP < 2.5s, CLS < 0.1）
- [ ] 無障礙（a11y）檢查
- [ ] E2E 測試更新
- [ ] 單元測試撰寫

## 受影響的檔案

- `src/app/page.tsx` — 新首頁（待實作）
- `src/app/portfolio/page.tsx` — 原首頁內容（已搬遷）
- `src/components/layout/navbar.tsx` — 已新增「作品集」連結
- `src/components/layout/banner.tsx` — Banner 路徑已更新
- `e2e/home.spec.ts` — 需更新首頁 E2E 測試
- `e2e/links/static-pages.spec.ts` — 需更新靜態頁面測試
- `e2e/links/navigation.spec.ts` — 需更新導覽測試
