import { test, expect } from '@playwright/test'

test.describe('標籤總覽頁', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tags')
  })

  test('應該正確顯示頁面標題', async ({ page }) => {
    await expect(page).toHaveTitle(/標籤/)
  })

  test('應該顯示標籤總覽標題', async ({ page }) => {
    const heading = page.getByRole('heading', { name: '標籤總覽' })
    await expect(heading).toBeVisible()
  })

  test('應該顯示標籤列表', async ({ page }) => {
    // 標籤連結
    const tags = page.locator('.flex.flex-wrap a')
    await expect(tags.first()).toBeVisible()
    const tagCount = await tags.count()
    expect(tagCount).toBeGreaterThan(0)
  })

  test('標籤應該顯示文章數量', async ({ page }) => {
    // 標籤應該包含數量，格式為 "TagName (數量)"
    const firstTag = page.locator('.flex.flex-wrap a').first()
    const tagText = await firstTag.textContent()
    expect(tagText).toMatch(/\(\d+\)/)
  })

  test('點擊標籤應該導航到標籤文章頁', async ({ page }) => {
    const firstTag = page.locator('.flex.flex-wrap a').first()
    await firstTag.click()

    // URL 應該變為 /tags/標籤名稱
    await expect(page).toHaveURL(/\/tags\//)
  })
})

test.describe('標籤文章列表頁', () => {
  test('從標籤頁導航到標籤文章列表', async ({ page }) => {
    await page.goto('/tags')

    // 點擊第一個標籤
    const firstTag = page.locator('.flex.flex-wrap a').first()

    await firstTag.click()

    // 等待頁面載入完成
    await page.waitForLoadState('networkidle')

    // 應該顯示標籤標題（包含「標籤：」前綴）
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
  })

  test('標籤文章列表應該顯示文章數量', async ({ page }) => {
    await page.goto('/tags')

    // 點擊第一個標籤
    await page.locator('.flex.flex-wrap a').first().click()

    // 等待頁面載入完成
    await page.waitForLoadState('networkidle')

    // 應該顯示文章數量資訊
    const countText = page.locator('.text-muted-foreground').filter({ hasText: /篇文章/ })
    await expect(countText).toBeVisible()
  })

  test('標籤文章列表應該顯示文章', async ({ page }) => {
    await page.goto('/tags')

    // 點擊第一個標籤
    await page.locator('.flex.flex-wrap a').first().click()

    // 等待頁面載入完成
    await page.waitForLoadState('networkidle')

    // 應該有 heading 顯示
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()

    // 檢查 space-y-4 容器存在
    const container = page.locator('.space-y-4')
    await expect(container).toBeVisible()
  })

  test('從標籤文章列表點擊文章應該導航到文章頁', async ({ page }) => {
    await page.goto('/tags')

    // 點擊第一個標籤
    await page.locator('.flex.flex-wrap a').first().click()

    // 等待頁面載入完成
    await page.waitForLoadState('networkidle')

    // 點擊第一篇文章（使用更通用的選擇器）
    const firstArticleLink = page.locator('.space-y-4 a').first()
    await expect(firstArticleLink).toBeVisible()
    await firstArticleLink.click()

    // 應該導航到文章頁
    await expect(page).toHaveURL(/\/tech-page\//)
  })

  // 跳過這個測試，因為專案使用 output: export 模式
  test.skip('不存在的標籤應該顯示 404', async ({ page }) => {
    const response = await page.goto('/tags/non-existent-tag-12345')

    // 應該顯示 404
    expect(response?.status()).toBe(404)
  })
})

test.describe('導覽列標籤連結', () => {
  test('從導覽列點擊標籤連結', async ({ page }) => {
    await page.goto('/')

    const tagsLink = page.locator('nav').locator('a', { hasText: '標籤' }).first()
    await tagsLink.click()

    await expect(page).toHaveURL('/tags')
    await expect(page.getByRole('heading', { name: '標籤總覽' })).toBeVisible()
  })
})
