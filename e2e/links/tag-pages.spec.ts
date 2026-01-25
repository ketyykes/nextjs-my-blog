import { test, expect } from '@playwright/test'
import { checkPageLoads, collectAllLinks } from '../helpers/link-checker'

/**
 * 標籤頁面連結測試
 *
 * 驗證：
 * - /tags (標籤總覽頁面)
 * - /tags/{tag-name} (各標籤的文章列表)
 * - 標籤頁面的文章連結
 */

test.describe('標籤總覽頁面測試', () => {
  test('標籤總覽頁面應該回傳 HTTP 200', async ({ page }) => {
    await checkPageLoads(page, '/tags')
  })

  test('標籤總覽頁面應該顯示標籤列表', async ({ page }) => {
    await page.goto('/tags')

    // 應該有標籤連結
    const tags = page.locator('.flex.flex-wrap a[href^="/tags/"]')
    await expect(tags.first()).toBeVisible()

    const count = await tags.count()
    expect(count).toBeGreaterThan(0)

    console.log(`\n標籤總覽頁面共有 ${count} 個標籤`)
  })

  test('每個標籤應該顯示文章數量', async ({ page }) => {
    await page.goto('/tags')

    const firstTag = page.locator('.flex.flex-wrap a[href^="/tags/"]').first()
    const tagText = await firstTag.textContent()

    // 格式應該是 "標籤名 (數量)"
    expect(tagText).toMatch(/\(\d+\)/)
  })
})

test.describe('標籤連結收集與驗證', () => {
  test('收集所有標籤連結', async ({ page }) => {
    await page.goto('/tags')

    const tagLinks = await collectAllLinks(page, '.flex.flex-wrap a[href^="/tags/"]')

    expect(tagLinks.length).toBeGreaterThan(0)

    console.log(`\n收集到 ${tagLinks.length} 個標籤連結:`)
    console.log(tagLinks.slice(0, 10).join('\n'))
    if (tagLinks.length > 10) {
      console.log(`... 還有 ${tagLinks.length - 10} 個`)
    }
  })

  test('大部分標籤頁面應該可訪問', async ({ page }) => {
    await page.goto('/tags')

    const tagLinks = await collectAllLinks(page, '.flex.flex-wrap a[href^="/tags/"]')
    const results: { tag: string; status: number | null }[] = []

    for (const link of tagLinks) {
      const response = await page.goto(link)
      results.push({ tag: link, status: response?.status() ?? null })
    }

    // 統計結果
    const successTags = results.filter((r) => r.status === 200)
    const failedTags = results.filter((r) => r.status !== 200)
    const successRate = (successTags.length / results.length) * 100

    console.log(`\n標籤頁面驗證結果:`)
    console.log(`總數: ${results.length}`)
    console.log(`成功: ${successTags.length}`)
    console.log(`失敗: ${failedTags.length}`)
    console.log(`成功率: ${successRate.toFixed(1)}%`)

    if (failedTags.length > 0) {
      console.log('失敗的標籤:', failedTags.map((t) => t.tag))
    }

    // 至少 90% 的標籤頁面應該可訪問
    expect(
      successRate,
      `標籤頁面成功率 ${successRate.toFixed(1)}% 低於 90%`
    ).toBeGreaterThanOrEqual(90)
  })
})

test.describe('標籤文章列表頁面測試', () => {
  test('標籤文章列表應該顯示標題', async ({ page }) => {
    await page.goto('/tags')

    // 點擊第一個標籤
    const firstTag = page.locator('.flex.flex-wrap a[href^="/tags/"]').first()
    await firstTag.click()

    // 等待頁面載入
    await page.waitForLoadState('networkidle')

    // 檢查頁面是否正常載入 (不是錯誤頁面)
    const url = page.url()
    if (url.includes('/tags/')) {
      // 應該有 h1 標題或主要內容
      const heading = page.getByRole('heading', { level: 1 })
      const headingCount = await heading.count()

      if (headingCount > 0) {
        await expect(heading).toBeVisible()
      } else {
        // 如果沒有 h1，至少應該有內容
        const content = page.locator('main, .container')
        await expect(content.first()).toBeVisible()
      }
    }
  })

  test('標籤文章列表應該顯示文章數量', async ({ page }) => {
    await page.goto('/tags')
    await page.locator('.flex.flex-wrap a[href^="/tags/"]').first().click()

    // 應該顯示文章數量
    const countText = page.locator('.text-muted-foreground').filter({ hasText: /篇/ })
    await expect(countText).toBeVisible()
  })

  test('標籤文章列表應該有文章連結', async ({ page }) => {
    await page.goto('/tags')
    await page.locator('.flex.flex-wrap a[href^="/tags/"]').first().click()

    // 等待頁面載入
    await page.waitForLoadState('networkidle')

    // 應該有文章連結
    const articleLinks = page.locator('a[href^="/tech-page/"]')
    const count = await articleLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('從標籤頁面點擊文章應該正確導航', async ({ page }) => {
    await page.goto('/tags')
    await page.locator('.flex.flex-wrap a[href^="/tags/"]').first().click()
    await page.waitForLoadState('networkidle')

    // 點擊第一篇文章
    const firstArticle = page.locator('a[href^="/tech-page/"]').first()
    await expect(firstArticle).toBeVisible()

    const articleUrl = await firstArticle.getAttribute('href')
    await firstArticle.click()

    await expect(page).toHaveURL(articleUrl!)
  })
})

test.describe('標籤頁面批次驗證', () => {
  test('批次驗證前 5 個標籤頁面', async ({ page }) => {
    await page.goto('/tags')

    const tagLinks = await collectAllLinks(page, '.flex.flex-wrap a[href^="/tags/"]')
    // 只取前 5 個減少測試時間
    const sampleLinks = tagLinks.slice(0, 5)

    const results: {
      tag: string
      status: number | null
      hasTitle: boolean
      articleCount: number
    }[] = []

    for (const link of sampleLinks) {
      const response = await page.goto(link)
      const status = response?.status() ?? null

      // 如果頁面載入失敗，跳過進一步檢查
      if (status !== 200) {
        results.push({ tag: link, status, hasTitle: false, articleCount: 0 })
        continue
      }

      const hasTitle = (await page.title()).length > 0

      // 計算文章數量
      const articles = page.locator('a[href^="/tech-page/"]')
      const articleCount = await articles.count()

      results.push({ tag: link, status, hasTitle, articleCount })
    }

    // 輸出結果
    console.log('\n標籤頁面批次驗證結果:')
    console.table(results)

    // 統計成功率
    const successCount = results.filter((r) => r.status === 200).length
    const successRate = (successCount / results.length) * 100

    // 至少 80% 應該成功
    expect(
      successRate,
      `成功率 ${successRate.toFixed(1)}% 低於 80%`
    ).toBeGreaterThanOrEqual(80)
  })
})

test.describe('標籤連結格式驗證', () => {
  test('標籤連結應該使用正確的格式', async ({ page }) => {
    await page.goto('/tags')

    const tagLinks = await collectAllLinks(page, '.flex.flex-wrap a[href^="/tags/"]')

    for (const link of tagLinks) {
      // 應該以 /tags/ 開頭
      expect(link).toMatch(/^\/tags\//)

      // 標籤名不應該為空
      const tagName = link.replace('/tags/', '')
      expect(tagName.length).toBeGreaterThan(0)

      // 應該是 URL 編碼的格式（可能包含中文）
      expect(link).not.toMatch(/\s/)
    }
  })
})

test.describe('標籤頁面導航流程測試', () => {
  test('完整的標籤導航流程', async ({ page }) => {
    // 1. 從首頁開始
    await page.goto('/')

    // 2. 導航到標籤總覽
    await page.goto('/tags')
    await expect(page).toHaveURL('/tags')

    // 3. 點擊一個已知可用的標籤 (JavaScript 是常用標籤)
    const jsTag = page.locator('a[href="/tags/javascript"]')
    await jsTag.click()
    await expect(page).toHaveURL('/tags/javascript')

    // 4. 點擊該標籤下的文章
    await page.waitForLoadState('networkidle')
    const firstArticle = page.locator('a[href^="/tech-page/"]').first()
    await expect(firstArticle).toBeVisible()

    const articleUrl = await firstArticle.getAttribute('href')
    await firstArticle.click()
    await expect(page).toHaveURL(articleUrl!)

    // 5. 返回標籤總覽 (使用直接導航)
    await page.goto('/tags')
    await expect(page).toHaveURL('/tags')

    console.log('\n完整標籤導航流程測試通過')
  })
})

test.describe('標籤文章列表內容驗證', () => {
  test('標籤頁面的文章應該包含該標籤', async ({ page }) => {
    await page.goto('/tags')

    // 取得第一個標籤的名稱
    const firstTag = page.locator('.flex.flex-wrap a[href^="/tags/"]').first()
    const tagText = await firstTag.textContent()
    const tagName = tagText?.replace(/\s*\(\d+\)$/, '')

    // 導航到該標籤頁面
    await firstTag.click()
    await page.waitForLoadState('networkidle')

    // 標題應該包含標籤名稱
    const heading = page.getByRole('heading', { level: 1 })
    const headingText = await heading.textContent()

    expect(headingText).toContain(tagName)
  })
})
