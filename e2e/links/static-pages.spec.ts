import { test, expect } from '@playwright/test'
import { checkPageLoads, checkPageWithTitle } from '../helpers/link-checker'

/**
 * 靜態頁面連結測試
 *
 * 驗證 5 個靜態頁面：
 * - / (首頁)
 * - /about (關於我)
 * - /tech-page (技術文章列表)
 * - /tags (標籤總覽)
 * - /photo (攝影集)
 */

const staticPages = [
  { path: '/', name: '首頁', expectedTitle: /水土曜來了/ },
  { path: '/about', name: '關於我', expectedTitle: /關於我/ },
  { path: '/tech-page', name: '技術文章列表', expectedTitle: /技術文章/ },
  { path: '/tags', name: '標籤總覽', expectedTitle: /標籤/ },
  { path: '/photo', name: '攝影集', expectedTitle: /攝影/ },
]

test.describe('靜態頁面連結測試', () => {
  for (const { path, name, expectedTitle } of staticPages) {
    test(`${name} (${path}) 應該回傳 HTTP 200`, async ({ page }) => {
      await checkPageLoads(page, path)
    })

    test(`${name} (${path}) 應該有正確的頁面標題`, async ({ page }) => {
      await checkPageWithTitle(page, path, expectedTitle)
    })
  }
})

test.describe('靜態頁面內容驗證', () => {
  test('首頁應該顯示作品集標籤頁', async ({ page }) => {
    await page.goto('/')

    // 應該有作品集相關內容
    const tabsOrContent = page.locator('[role="tablist"], .grid')
    await expect(tabsOrContent.first()).toBeVisible()
  })

  test('關於我頁面應該顯示個人介紹', async ({ page }) => {
    await page.goto('/about')

    // 應該有標題
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('技術文章列表應該顯示文章卡片', async ({ page }) => {
    await page.goto('/tech-page')

    // 應該有文章卡片
    const cards = page.locator('[class*="card"]')
    await expect(cards.first()).toBeVisible()
  })

  test('標籤總覽應該顯示標籤列表', async ({ page }) => {
    await page.goto('/tags')

    // 應該有標籤連結
    const tags = page.locator('.flex.flex-wrap a')
    await expect(tags.first()).toBeVisible()
  })

  test('攝影集頁面應該正確載入', async ({ page }) => {
    await page.goto('/photo')

    // 應該有頁面內容 (可能是 h1 或其他主要元素)
    const content = page.locator('main, .container, article').first()
    await expect(content).toBeVisible()
  })
})

test.describe('靜態頁面 HTTP 狀態碼批次檢查', () => {
  test('所有靜態頁面都應該可訪問', async ({ page }) => {
    const results: { path: string; status: number | null }[] = []

    for (const { path } of staticPages) {
      const response = await page.goto(path)
      results.push({ path, status: response?.status() ?? null })
    }

    // 驗證所有頁面都是 200
    for (const result of results) {
      expect(
        result.status,
        `${result.path} 應該回傳 200，實際回傳 ${result.status}`
      ).toBe(200)
    }

    // 輸出結果摘要
    console.log('\n靜態頁面檢查結果:')
    console.table(results)
  })
})
