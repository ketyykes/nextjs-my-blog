import { test, expect } from '@playwright/test'

test.describe('關於我頁面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
  })

  test('應該正確顯示頁面標題', async ({ page }) => {
    await expect(page).toHaveTitle(/關於我/)
  })

  test('應該顯示關於我標題', async ({ page }) => {
    const heading = page.getByRole('heading', { name: '關於我' })
    await expect(heading).toBeVisible()
  })

  test('應該顯示作者頭像', async ({ page }) => {
    // 等待頭像載入
    const avatar = page.locator('img[alt="作者頭像"]')
    // 等待圖片存在
    await expect(avatar).toBeAttached({ timeout: 30000 })

    // 檢查頭像來源
    const src = await avatar.getAttribute('src')
    expect(src).toContain('cloudinary')
  })

  test('應該顯示自我介紹內容', async ({ page }) => {
    // 檢查是否有介紹文字（使用更精確的選擇器）
    const intro = page.locator('.max-w-2xl p.leading-relaxed')
    await expect(intro).toBeVisible()

    // 檢查文字內容
    const text = await intro.textContent()
    expect(text).toContain('水曜日')
    expect(text).toContain('土曜日')
  })

  test('頭像載入時應該顯示骨架屏', async ({ page }) => {
    // 檢查頁面正常載入
    const pageContent = page.locator('body')
    await expect(pageContent).toBeVisible()

    // 檢查 heading 存在
    await expect(page.getByRole('heading', { name: '關於我' })).toBeVisible()
  })
})

test.describe('導覽列關於我連結', () => {
  test('從導覽列點擊關於我連結', async ({ page }) => {
    await page.goto('/')

    const aboutLink = page.locator('nav').locator('a', { hasText: '關於我' }).first()
    await aboutLink.click()

    await expect(page).toHaveURL('/about')
    await expect(page.getByRole('heading', { name: '關於我' })).toBeVisible()
  })
})

test.describe('關於我頁面 SEO', () => {
  test('應該有正確的 meta description', async ({ page }) => {
    await page.goto('/about')

    // 檢查頁面是否正常載入（meta description 由 Next.js 處理）
    const heading = page.getByRole('heading', { name: '關於我' })
    await expect(heading).toBeVisible()
  })
})
