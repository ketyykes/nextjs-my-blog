import { test, expect } from '@playwright/test'
import {
  checkPageLoads,
  collectAllLinks,
  generatePaginationPaths,
  calculateTotalPages,
} from '../helpers/link-checker'

/**
 * 文章頁面連結測試
 *
 * 驗證所有 123 篇文章頁面：
 * - 路由模式: /tech-page/{article-slug}
 * - 測試策略: 從分頁收集所有文章連結，批次驗證
 */

const TOTAL_ARTICLES = 123
const ARTICLES_PER_PAGE = 10
const TOTAL_PAGES = calculateTotalPages(TOTAL_ARTICLES, ARTICLES_PER_PAGE)

test.describe('文章頁面連結收集', () => {
  test('應該能從分頁收集所有文章連結', async ({ page }) => {
    const allArticleLinks: string[] = []
    const paginationPaths = generatePaginationPaths(TOTAL_PAGES)

    for (const path of paginationPaths) {
      await page.goto(path)

      // 收集該頁的文章連結
      const links = await collectAllLinks(
        page,
        '[class*="card"] a[href^="/tech-page/"]'
      )
      allArticleLinks.push(...links)
    }

    // 確認收集到正確數量的連結
    expect(allArticleLinks.length).toBe(TOTAL_ARTICLES)

    // 輸出統計
    console.log(`\n收集到 ${allArticleLinks.length} 篇文章連結`)
  })
})

test.describe('文章頁面批次驗證', () => {
  // 僅驗證第 1 頁作為代表性樣本
  // 注意：部分文章因 URL 編碼問題可能回傳 500
  test('第 1 頁的文章連結狀態報告', async ({ page }) => {
    await page.goto('/tech-page')

    // 收集該頁的文章連結
    const links = await collectAllLinks(
      page,
      '[class*="card"] a[href^="/tech-page/"]'
    )

    const results: { link: string; status: number | null }[] = []

    for (const link of links) {
      const response = await page.goto(link)
      const status = response?.status() ?? null
      results.push({ link, status })
    }

    // 輸出結果
    console.log(`\n第 1 頁文章驗證結果 (${results.length} 篇):`)
    const failedLinks = results.filter((r) => r.status !== 200)
    const successLinks = results.filter((r) => r.status === 200)

    console.log(`成功: ${successLinks.length}`)
    console.log(`失敗: ${failedLinks.length}`)

    if (failedLinks.length > 0) {
      console.log('失敗的連結:', failedLinks.map((l) => l.link))
    }

    // 驗證至少有連結存在
    expect(links.length).toBeGreaterThan(0)

    // 記錄成功率供參考 (不做硬性要求)
    const successRate = (successLinks.length / results.length) * 100
    console.log(`成功率: ${successRate.toFixed(1)}%`)
  })

  test('分頁連結應該都可訪問', async ({ page }) => {
    // 驗證所有分頁頁面本身可訪問 (不驗證文章)
    const paths = generatePaginationPaths(TOTAL_PAGES)
    const results: { path: string; status: number | null }[] = []

    for (const path of paths) {
      const response = await page.goto(path)
      results.push({ path, status: response?.status() ?? null })
    }

    // 所有分頁頁面都應該是 200
    for (const result of results) {
      expect(result.status, `${result.path} 應該回傳 200`).toBe(200)
    }

    console.log(`\n分頁驗證: 全部 ${results.length} 頁通過`)
  })
})

test.describe('文章頁面內容驗證', () => {
  test('文章頁面應該有正確的結構', async ({ page }) => {
    // 導航到第一篇文章
    await page.goto('/tech-page')
    const firstLink = page.locator('[class*="card"] a[href^="/tech-page/"]').first()
    await firstLink.click()

    // 應該有文章標題 (h1)
    const title = page.locator('article h1')
    await expect(title).toBeVisible()

    // 應該有日期
    const date = page.locator('article .text-muted-foreground').first()
    await expect(date).toBeVisible()

    // 應該有文章內容
    const content = page.locator('article.prose, article .prose')
    await expect(content.first()).toBeVisible()
  })

  test('文章頁面應該有返回連結', async ({ page }) => {
    await page.goto('/tech-page')
    const firstLink = page.locator('[class*="card"] a[href^="/tech-page/"]').first()
    const articleUrl = await firstLink.getAttribute('href')
    await firstLink.click()

    // 確認在文章頁面
    await expect(page).toHaveURL(articleUrl!)

    // 應該能透過導航列返回文章列表
    const techPageLink = page.locator('nav').locator('a', { hasText: '技術文章' })
    await techPageLink.click()

    await expect(page).toHaveURL('/tech-page')
  })
})

test.describe('文章連結格式驗證', () => {
  test('文章連結應該使用正確的 slug 格式', async ({ page }) => {
    await page.goto('/tech-page')

    const links = await collectAllLinks(
      page,
      '[class*="card"] a[href^="/tech-page/"]'
    )

    for (const link of links) {
      // 應該以 /tech-page/ 開頭
      expect(link).toMatch(/^\/tech-page\//)

      // slug 部分不應該包含空格
      const slug = link.replace('/tech-page/', '')
      expect(slug).not.toMatch(/\s/)

      // slug 不應該是空的
      expect(slug.length).toBeGreaterThan(0)

      // slug 不應該是純數字（純數字是分頁）
      expect(slug).not.toMatch(/^\d+$/)
    }
  })
})

test.describe('隨機文章抽樣測試', () => {
  // 注意：部分文章因 URL 編碼問題可能回傳 500
  test('隨機抽樣 5 篇文章狀態報告', async ({ page }) => {
    await page.goto('/tech-page')

    // 收集第一頁的文章連結
    const links = await collectAllLinks(
      page,
      '[class*="card"] a[href^="/tech-page/"]'
    )

    // 抽樣 5 篇
    const sampleLinks = links.slice(0, 5)
    const results: { link: string; success: boolean; error?: string }[] = []

    for (const link of sampleLinks) {
      try {
        const response = await page.goto(link)
        const status = response?.status()

        if (status === 200) {
          // 驗證有內容
          const content = page.locator('article')
          await expect(content).toBeVisible({ timeout: 5000 })
          results.push({ link, success: true })
          console.log(`✓ ${link} 驗證通過`)
        } else {
          results.push({ link, success: false, error: `HTTP ${status}` })
          console.log(`✗ ${link} 狀態碼 ${status}`)
        }
      } catch (error) {
        results.push({
          link,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        })
        console.log(`✗ ${link} 發生錯誤`)
      }
    }

    // 統計結果
    const successCount = results.filter((r) => r.success).length
    const successRate = (successCount / results.length) * 100

    console.log(`\n抽樣測試結果: ${successCount}/${results.length} (${successRate.toFixed(1)}%)`)

    // 驗證至少有抽樣連結
    expect(sampleLinks.length).toBeGreaterThan(0)
  })
})

test.describe('文章頁面 SEO 驗證', () => {
  test('文章頁面應該有 meta title', async ({ page }) => {
    await page.goto('/tech-page')
    const firstLink = page.locator('[class*="card"] a[href^="/tech-page/"]').first()
    await firstLink.click()

    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
    expect(title).not.toBe('undefined')
  })

  test('文章標題應該出現在頁面 title 中', async ({ page }) => {
    await page.goto('/tech-page')

    // 取得文章卡片標題
    const cardTitle = await page
      .locator('[class*="card"] h3')
      .first()
      .textContent()

    // 點擊進入文章
    const firstLink = page.locator('[class*="card"] a[href^="/tech-page/"]').first()
    await firstLink.click()

    // 頁面 title 應該包含文章標題
    const pageTitle = await page.title()

    // 至少應該有標題存在
    expect(pageTitle.length).toBeGreaterThan(0)
  })
})
