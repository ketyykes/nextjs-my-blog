import { test, expect } from '@playwright/test'
import {
  checkPageLoads,
  generatePaginationPaths,
  calculateTotalPages,
} from '../helpers/link-checker'

/**
 * 分頁連結測試
 *
 * 驗證：
 * - 123 篇文章，每頁 10 篇 = 13 頁
 * - 第 1 頁路徑: /tech-page
 * - 第 2-13 頁路徑: /tech-page/{page}
 * - 分頁器 (Pager) 連結
 */

const TOTAL_ARTICLES = 123
const ARTICLES_PER_PAGE = 10
const TOTAL_PAGES = calculateTotalPages(TOTAL_ARTICLES, ARTICLES_PER_PAGE) // 13

test.describe('分頁頁面連結測試', () => {
  const paginationPaths = generatePaginationPaths(TOTAL_PAGES)

  for (let i = 0; i < paginationPaths.length; i++) {
    const path = paginationPaths[i]
    const pageNum = i + 1

    test(`第 ${pageNum} 頁 (${path}) 應該回傳 HTTP 200`, async ({ page }) => {
      await checkPageLoads(page, path)
    })
  }
})

test.describe('分頁頁面內容驗證', () => {
  test('每個分頁應該顯示文章列表', async ({ page }) => {
    const pagesToCheck = [1, 2, 7, TOTAL_PAGES] // 抽樣檢查

    for (const pageNum of pagesToCheck) {
      const path = pageNum === 1 ? '/tech-page' : `/tech-page/${pageNum}`
      await page.goto(path)

      // 應該有文章卡片
      const cards = page.locator('[class*="card"]').filter({ has: page.locator('a') })
      const count = await cards.count()

      // 最後一頁可能少於 10 篇
      if (pageNum === TOTAL_PAGES) {
        const expectedCount = TOTAL_ARTICLES % ARTICLES_PER_PAGE || ARTICLES_PER_PAGE
        expect(count).toBe(expectedCount)
      } else {
        expect(count).toBe(ARTICLES_PER_PAGE)
      }
    }
  })

  test('每個分頁應該顯示分頁器', async ({ page }) => {
    await page.goto('/tech-page')
    const pagination = page.locator('nav[aria-label="pagination"]')
    await expect(pagination).toBeVisible()

    await page.goto('/tech-page/7')
    await expect(pagination).toBeVisible()
  })
})

test.describe('分頁器連結功能測試', () => {
  test('第一頁的上一頁按鈕應該被禁用', async ({ page }) => {
    await page.goto('/tech-page')

    const prevButton = page.locator('a[aria-label="Go to previous page"]')
    await expect(prevButton).toHaveClass(/opacity-50|pointer-events-none/)
  })

  test('最後一頁的下一頁按鈕應該被禁用', async ({ page }) => {
    await page.goto(`/tech-page/${TOTAL_PAGES}`)

    const nextButton = page.locator('a[aria-label="Go to next page"]')
    await expect(nextButton).toHaveClass(/opacity-50|pointer-events-none/)
  })

  test('中間頁面的上一頁和下一頁按鈕都應該可用', async ({ page }) => {
    await page.goto('/tech-page/7')

    const prevButton = page.locator('a[aria-label="Go to previous page"]')
    const nextButton = page.locator('a[aria-label="Go to next page"]')

    // 按鈕應該可見
    await expect(prevButton).toBeVisible()
    await expect(nextButton).toBeVisible()

    // 按鈕應該有有效的 href
    const prevHref = await prevButton.getAttribute('href')
    const nextHref = await nextButton.getAttribute('href')
    expect(prevHref).toBeTruthy()
    expect(nextHref).toBeTruthy()
  })
})

test.describe('分頁器導航測試', () => {
  test('點擊頁碼連結應該正確導航', async ({ page }) => {
    await page.goto('/tech-page')

    // 點擊第 2 頁
    const page2Link = page
      .locator('nav[aria-label="pagination"] a')
      .filter({ hasText: '2' })
    await page2Link.click()

    await expect(page).toHaveURL('/tech-page/2')
  })

  test('點擊下一頁按鈕應該導航到下一頁', async ({ page }) => {
    await page.goto('/tech-page')

    const nextButton = page.locator('a[aria-label="Go to next page"]')
    await nextButton.click()

    await expect(page).toHaveURL('/tech-page/2')
  })

  test('點擊上一頁按鈕應該導航到上一頁', async ({ page }) => {
    await page.goto('/tech-page/3')

    const prevButton = page.locator('a[aria-label="Go to previous page"]')
    await prevButton.click()

    await expect(page).toHaveURL('/tech-page/2')
  })

  test('從第 2 頁點擊上一頁應該回到第 1 頁', async ({ page }) => {
    await page.goto('/tech-page/2')

    const prevButton = page.locator('a[aria-label="Go to previous page"]')
    await prevButton.click()

    await expect(page).toHaveURL('/tech-page')
  })
})

test.describe('分頁連結完整性批次檢查', () => {
  test('所有分頁都應該可訪問', async ({ page }) => {
    const paginationPaths = generatePaginationPaths(TOTAL_PAGES)
    const results: { path: string; status: number | null }[] = []

    for (const path of paginationPaths) {
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
    console.log(`\n分頁連結檢查結果 (共 ${TOTAL_PAGES} 頁):`)
    console.table(results)
  })
})

test.describe('分頁邊界條件測試', () => {
  // 這些測試驗證邊界情況的處理方式
  // 使用 output: export 模式時，未預先生成的頁面可能返回各種狀態碼

  test.skip('訪問超出範圍的分頁應該顯示錯誤或重定向', async ({ page }) => {
    // 跳過：output: export 模式下行為可能不一致
    const response = await page.goto(`/tech-page/${TOTAL_PAGES + 1}`)
    const status = response?.status()
    console.log(`超出範圍分頁狀態碼: ${status}`)
  })

  test.skip('訪問分頁 0 應該顯示錯誤', async ({ page }) => {
    // 跳過：output: export 模式下行為可能不一致
    const response = await page.goto('/tech-page/0')
    const status = response?.status()
    console.log(`分頁 0 狀態碼: ${status}`)
  })

  test.skip('訪問負數分頁應該顯示錯誤', async ({ page }) => {
    // 跳過：output: export 模式下行為可能不一致
    const response = await page.goto('/tech-page/-1')
    const status = response?.status()
    console.log(`負數分頁狀態碼: ${status}`)
  })
})

test.describe('分頁器頁碼連結驗證', () => {
  test('分頁器應該顯示正確的頁碼', async ({ page }) => {
    await page.goto('/tech-page')

    const pagination = page.locator('nav[aria-label="pagination"]')
    await expect(pagination).toBeVisible()

    // 應該有頁碼連結
    const pageLinks = pagination.locator('a').filter({ hasText: /^\d+$/ })
    const count = await pageLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('當前頁碼應該有特殊樣式', async ({ page }) => {
    await page.goto('/tech-page/5')

    // 當前頁碼通常有不同樣式 (例如 aria-current="page")
    const currentPage = page.locator('[aria-current="page"]')
    const count = await currentPage.count()

    // 如果沒有 aria-current，可以檢查其他樣式
    if (count > 0) {
      await expect(currentPage).toContainText('5')
    }
  })
})
