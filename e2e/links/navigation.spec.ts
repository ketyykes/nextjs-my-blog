import { test, expect } from '@playwright/test'
import { checkLinkNavigation } from '../helpers/link-checker'

/**
 * 導航連結測試
 *
 * 驗證 Navbar 中所有導航連結：
 * - Logo 連結
 * - 首頁
 * - 關於我
 * - 技術文章
 * - 攝影集
 * - 標籤
 * - 筆記站 (外部連結)
 */

const internalNavLinks = [
  { text: '首頁', href: '/', expectedUrl: '/' },
  { text: '關於我', href: '/about', expectedUrl: '/about' },
  { text: '技術文章', href: '/tech-page', expectedUrl: '/tech-page' },
  { text: '攝影集', href: '/photo', expectedUrl: '/photo' },
  { text: '標籤', href: '/tags', expectedUrl: '/tags' },
]

const externalNavLinks = [
  { text: '筆記站', href: 'https://note.wedsatcoming.com' },
]

test.describe('Navbar 內部連結測試', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  for (const { text, expectedUrl } of internalNavLinks) {
    test(`點擊「${text}」應該導航到 ${expectedUrl}`, async ({ page }) => {
      const navLink = page.locator('nav').locator('a', { hasText: text }).first()
      await checkLinkNavigation(page, navLink, expectedUrl)
    })
  }
})

test.describe('Logo 連結測試', () => {
  test('從其他頁面點擊 Logo 應該回到首頁', async ({ page }) => {
    // 先導航到其他頁面
    await page.goto('/about')

    // 點擊 Logo（通常是第一個 nav 內的連結或包含網站名稱的連結）
    const logo = page.locator('nav a').first()
    await logo.click()

    await expect(page).toHaveURL('/')
  })

  test('Logo 連結應該指向首頁', async ({ page }) => {
    await page.goto('/')

    // 找到 Logo 連結
    const logo = page.locator('nav a').first()
    const href = await logo.getAttribute('href')

    expect(href).toBe('/')
  })
})

test.describe('Navbar 外部連結測試', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  for (const { text, href } of externalNavLinks) {
    test(`「${text}」連結應該指向正確的外部 URL`, async ({ page }) => {
      const navLink = page.locator('nav').locator('a', { hasText: text }).first()
      await expect(navLink).toBeVisible()

      const linkHref = await navLink.getAttribute('href')
      expect(linkHref).toBe(href)
    })

    test(`「${text}」連結應該在新分頁開啟`, async ({ page }) => {
      const navLink = page.locator('nav').locator('a', { hasText: text }).first()
      const target = await navLink.getAttribute('target')

      // 外部連結應該有 target="_blank"
      expect(target).toBe('_blank')
    })

    test(`「${text}」連結應該有安全屬性`, async ({ page }) => {
      const navLink = page.locator('nav').locator('a', { hasText: text }).first()
      const rel = await navLink.getAttribute('rel')

      // 外部連結應該有 noopener 或 noreferrer
      expect(rel).toMatch(/noopener|noreferrer/)
    })
  }
})

test.describe('跨頁面導航測試', () => {
  const navigationPaths = [
    { from: '/', to: '/tech-page', linkText: '技術文章' },
    { from: '/tech-page', to: '/tags', linkText: '標籤' },
    { from: '/tags', to: '/about', linkText: '關於我' },
    { from: '/about', to: '/photo', linkText: '攝影集' },
    { from: '/photo', to: '/', linkText: '首頁' },
  ]

  for (const { from, to, linkText } of navigationPaths) {
    test(`從 ${from} 導航到 ${to}`, async ({ page }) => {
      await page.goto(from)

      const navLink = page.locator('nav').locator('a', { hasText: linkText }).first()
      await navLink.click()

      await expect(page).toHaveURL(to)
    })
  }
})

test.describe('Navbar 連結完整性檢查', () => {
  test('所有導航連結都應該有有效的 href 屬性', async ({ page }) => {
    await page.goto('/')

    // 使用更精確的選擇器：主導航列 (fixed header nav)
    const mainNav = page.locator('nav.fixed, header nav').first()
    const navLinks = mainNav.locator('a')
    const count = await navLinks.count()

    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href')
      expect(href, `第 ${i + 1} 個導航連結缺少 href 屬性`).toBeTruthy()
    }
  })

  test('Navbar 應該在所有頁面都可見', async ({ page }) => {
    const pages = ['/', '/about', '/tech-page', '/tags', '/photo']

    for (const path of pages) {
      await page.goto(path)
      // 使用更精確的選擇器：排除分頁器 nav
      const mainNav = page.locator('nav.fixed, header nav').first()
      await expect(mainNav, `Navbar 在 ${path} 頁面不可見`).toBeVisible()
    }
  })
})

test.describe('文章卡片連結測試', () => {
  test('文章列表頁的文章卡片連結應該正確', async ({ page }) => {
    await page.goto('/tech-page')

    // 取得所有文章卡片連結
    const cardLinks = page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .locator('a')

    const count = await cardLinks.count()
    expect(count).toBeGreaterThan(0)

    // 檢查第一個連結的格式
    const firstHref = await cardLinks.first().getAttribute('href')
    expect(firstHref).toMatch(/^\/tech-page\//)
  })

  test('點擊文章卡片應該導航到文章頁面', async ({ page }) => {
    await page.goto('/tech-page')

    const firstCardLink = page
      .locator('[class*="card"]')
      .filter({ has: page.locator('a') })
      .first()
      .locator('a')

    const href = await firstCardLink.getAttribute('href')
    await firstCardLink.click()

    await expect(page).toHaveURL(href!)
  })
})
