import { Page, expect } from '@playwright/test'

/**
 * 連結檢查共用工具
 */

/**
 * 檢查頁面是否正常載入 (HTTP 200)
 */
export async function checkPageLoads(
  page: Page,
  path: string,
  options?: { timeout?: number }
) {
  const response = await page.goto(path, { timeout: options?.timeout ?? 30000 })
  expect(response?.status()).toBe(200)
  return response
}

/**
 * 檢查頁面載入且有標題
 */
export async function checkPageWithTitle(
  page: Page,
  path: string,
  expectedTitle?: string | RegExp
) {
  await checkPageLoads(page, path)
  if (expectedTitle) {
    await expect(page).toHaveTitle(expectedTitle)
  } else {
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)
  }
}

/**
 * 檢查連結是否可點擊並導航正確
 */
export async function checkLinkNavigation(
  page: Page,
  linkLocator: ReturnType<Page['locator']>,
  expectedUrl: string | RegExp
) {
  await expect(linkLocator).toBeVisible()
  await linkLocator.click()
  await expect(page).toHaveURL(expectedUrl)
}

/**
 * 收集頁面上所有連結的 href
 */
export async function collectAllLinks(
  page: Page,
  selector: string
): Promise<string[]> {
  const links = page.locator(selector)
  const count = await links.count()
  const hrefs: string[] = []

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href')
    if (href) {
      hrefs.push(href)
    }
  }

  return hrefs
}

/**
 * 批次檢查多個路徑是否可訪問
 */
export async function batchCheckPages(
  page: Page,
  paths: string[]
): Promise<{ path: string; status: number | null; error?: string }[]> {
  const results: { path: string; status: number | null; error?: string }[] = []

  for (const path of paths) {
    try {
      const response = await page.goto(path, { timeout: 30000 })
      results.push({ path, status: response?.status() ?? null })
    } catch (error) {
      results.push({
        path,
        status: null,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return results
}

/**
 * 計算總分頁數
 */
export function calculateTotalPages(
  totalArticles: number,
  articlesPerPage: number = 10
): number {
  return Math.ceil(totalArticles / articlesPerPage)
}

/**
 * 產生分頁路徑陣列
 */
export function generatePaginationPaths(
  totalPages: number,
  basePath: string = '/tech-page'
): string[] {
  const paths: string[] = [basePath] // 第一頁是 /tech-page

  for (let i = 2; i <= totalPages; i++) {
    paths.push(`${basePath}/${i}`)
  }

  return paths
}
