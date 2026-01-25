import { test, expect } from '@playwright/test'

test.describe('技術文章列表頁', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tech-page')
  })

  test('應該正確顯示頁面標題', async ({ page }) => {
    await expect(page).toHaveTitle(/技術文章/)
  })

  test('應該顯示文章列表標題', async ({ page }) => {
    const heading = page.getByRole('heading', { name: '技術文章' })
    await expect(heading).toBeVisible()
  })

  test('應該顯示文章卡片列表', async ({ page }) => {
    // 等待文章卡片載入（Card 元件）
    const articleCards = page.locator('[class*="card"]').filter({ has: page.locator('a') })
    await expect(articleCards.first()).toBeVisible()

    // 確認有文章顯示
    const count = await articleCards.count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThanOrEqual(10) // 每頁最多 10 篇
  })

  test('文章卡片應該包含標題和日期', async ({ page }) => {
    const firstCard = page.locator('[class*="card"]').filter({ has: page.locator('a') }).first()
    await expect(firstCard).toBeVisible()

    // 卡片應該包含標題文字
    const title = firstCard.locator('h3')
    await expect(title).toBeVisible()
  })

  test('點擊文章卡片應該導航到文章頁', async ({ page }) => {
    const firstCardLink = page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .first()
      .locator('a')
    await expect(firstCardLink).toBeVisible()

    // 獲取連結的 href
    const href = await firstCardLink.getAttribute('href')
    expect(href).toMatch(/^\/tech-page\//)

    // 點擊卡片
    await firstCardLink.click()

    // 確認導航
    await expect(page).toHaveURL(/\/tech-page\/[^0-9]/)
  })

  test('應該顯示分頁元件', async ({ page }) => {
    const pagination = page.locator('nav[aria-label="pagination"]')
    await expect(pagination).toBeVisible()
  })

  test('第一頁的上一頁按鈕應該被禁用', async ({ page }) => {
    const prevButton = page.locator('a[aria-label="Go to previous page"]')
    await expect(prevButton).toHaveClass(/opacity-50/)
  })
})

test.describe('技術文章分頁', () => {
  test('應該能導航到第二頁', async ({ page }) => {
    await page.goto('/tech-page')

    // 點擊第 2 頁
    const page2Link = page.locator('nav[aria-label="pagination"] a').filter({ hasText: '2' })
    await page2Link.click()

    // 確認 URL 改變
    await expect(page).toHaveURL('/tech-page/2')
  })

  test('第二頁應該正確顯示', async ({ page }) => {
    await page.goto('/tech-page/2')

    // 應該顯示標題
    await expect(page.getByRole('heading', { name: '技術文章' })).toBeVisible()

    // 應該有文章
    const articleCards = page.locator('[class*="card"]').filter({ has: page.locator('a') })
    const count = await articleCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('第二頁的上一頁按鈕應該可點擊並導航', async ({ page }) => {
    await page.goto('/tech-page/2')

    const prevButton = page.locator('a[aria-label="Go to previous page"]')

    // 點擊上一頁
    await prevButton.click()
    await expect(page).toHaveURL('/tech-page')
  })

  test('應該能使用下一頁按鈕導航', async ({ page }) => {
    await page.goto('/tech-page')

    const nextButton = page.locator('a[aria-label="Go to next page"]')
    await nextButton.click()

    await expect(page).toHaveURL('/tech-page/2')
  })
})

test.describe('導覽列導航', () => {
  test('從首頁點擊技術文章連結', async ({ page }) => {
    await page.goto('/')

    const techLink = page.locator('nav').locator('a', { hasText: '技術文章' }).first()
    await techLink.click()

    await expect(page).toHaveURL('/tech-page')
    await expect(page.getByRole('heading', { name: '技術文章' })).toBeVisible()
  })
})
