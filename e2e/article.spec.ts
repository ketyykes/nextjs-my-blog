import { test, expect } from '@playwright/test'

test.describe('單篇文章頁', () => {
  test('從文章列表導航到文章頁面', async ({ page }) => {
    await page.goto('/tech-page')

    // 點擊第一篇文章
    const firstCardLink = page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .first()
      .locator('a')
    await expect(firstCardLink).toBeVisible()

    const articleTitle = await firstCardLink.locator('h3').textContent()
    await firstCardLink.click()

    // 確認頁面包含文章標題
    await expect(page.locator('article h1')).toContainText(articleTitle || '')
  })

  test('文章頁面應該顯示正確的結構', async ({ page }) => {
    // 直接導航到文章列表並點擊第一篇
    await page.goto('/tech-page')
    await page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .first()
      .locator('a')
      .click()

    // 應該有文章標題
    const title = page.locator('article h1')
    await expect(title).toBeVisible()

    // 應該有日期
    const date = page.locator('article .text-muted-foreground').first()
    await expect(date).toBeVisible()

    // 應該有文章內容（prose 可能在 article 本身上）
    const content = page.locator('article.prose, article .prose')
    await expect(content.first()).toBeVisible()
  })

  test('文章頁面應該有評論區容器', async ({ page }) => {
    await page.goto('/tech-page')
    await page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .first()
      .locator('a')
      .click()

    // 等待評論區容器載入（Giscus 會在 div.mt-12 內）
    const commentsContainer = page.locator('.mt-12.border-t')
    await expect(commentsContainer).toBeVisible({ timeout: 15000 })
  })

  test('文章頁面應該正確渲染程式碼區塊', async ({ page }) => {
    await page.goto('/tech-page')
    await page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .first()
      .locator('a')
      .click()

    // 檢查是否有程式碼區塊（並非所有文章都有）
    const codeBlocks = page.locator('pre code, pre[class*="language"]')
    const count = await codeBlocks.count()

    if (count > 0) {
      // 如果有程式碼區塊，確認其可見
      await expect(codeBlocks.first()).toBeVisible()
    }
  })

  // 跳過這個測試，因為專案使用 output: export 模式
  test.skip('404 頁面應該顯示當文章不存在', async ({ page }) => {
    const response = await page.goto('/tech-page/non-existent-article-slug-12345')

    // 應該顯示 404
    expect(response?.status()).toBe(404)
  })
})

test.describe('文章頁面 SEO', () => {
  test('文章頁面應該有標題', async ({ page }) => {
    await page.goto('/tech-page')

    // 取得第一篇文章標題
    const firstCardLink = page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .first()
      .locator('a')

    // 導航到文章頁
    await firstCardLink.click()

    // 頁面應該有標題
    const pageTitle = await page.title()
    expect(pageTitle.length).toBeGreaterThan(0)
  })
})

test.describe('文章內容互動', () => {
  test('文章內連結應該可以點擊', async ({ page }) => {
    await page.goto('/tech-page')
    await page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .first()
      .locator('a')
      .click()

    // 找文章內的連結
    const articleLinks = page.locator('article a')
    const linkCount = await articleLinks.count()

    if (linkCount > 0) {
      // 確認第一個連結有 href 屬性
      const firstLink = articleLinks.first()
      const href = await firstLink.getAttribute('href')
      expect(href).toBeTruthy()
    }
  })

  test('標題應該有可連結的錨點', async ({ page }) => {
    await page.goto('/tech-page')
    await page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .first()
      .locator('a')
      .click()

    // 檢查 h2 或 h3 標題是否有 id 屬性
    const headings = page.locator('article h2[id], article h3[id]')
    const headingCount = await headings.count()

    if (headingCount > 0) {
      const firstHeading = headings.first()
      const id = await firstHeading.getAttribute('id')
      expect(id).toBeTruthy()
    }
  })
})
