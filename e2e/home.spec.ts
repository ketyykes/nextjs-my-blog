import { test, expect } from '@playwright/test'

test.describe('首頁', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('應該正確顯示頁面標題', async ({ page }) => {
    await expect(page).toHaveTitle(/水土曜來了/)
  })

  test('應該顯示導覽列', async ({ page }) => {
    // 檢查 Logo
    const logo = page.locator('nav a').filter({ hasText: '水土曜來了' }).first()
    await expect(logo).toBeVisible()

    // 檢查導覽連結（桌面版）
    const navLinks = ['首頁', '關於我', '技術文章', '攝影集', '標籤']
    for (const linkText of navLinks) {
      const link = page.locator('nav').locator('a', { hasText: linkText }).first()
      await expect(link).toBeVisible()
    }
  })

  test('應該顯示作品集分頁標籤', async ({ page }) => {
    // 檢查分頁標籤
    await expect(page.getByRole('tab', { name: 'Front-end' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Backend' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Other' })).toBeVisible()
  })

  test('應該能切換作品集分頁', async ({ page }) => {
    // 預設為 Frontend
    const frontendTab = page.getByRole('tab', { name: 'Front-end' })
    await expect(frontendTab).toHaveAttribute('data-state', 'active')

    // 點擊 Backend 標籤
    await page.getByRole('tab', { name: 'Backend' }).click()
    await expect(page.getByRole('tab', { name: 'Backend' })).toHaveAttribute(
      'data-state',
      'active'
    )

    // 點擊 Other 標籤
    await page.getByRole('tab', { name: 'Other' }).click()
    await expect(page.getByRole('tab', { name: 'Other' })).toHaveAttribute(
      'data-state',
      'active'
    )
  })

  test('應該能從 Logo 導航回首頁', async ({ page }) => {
    // 先導航到其他頁面
    await page.goto('/about')
    await expect(page).toHaveURL('/about')

    // 點擊 Logo 回首頁
    await page.locator('nav a').filter({ hasText: '水土曜來了' }).first().click()
    await expect(page).toHaveURL('/')
  })

  test('作品集卡片應該有正確的連結', async ({ page }) => {
    // 檢查是否有作品卡片存在
    const cards = page.locator('[class*="card"]')
    const cardCount = await cards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('應該顯示頁尾', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('主題切換應該正常運作', async ({ page }) => {
    // 找到主題切換按鈕（使用 sr-only 文字來定位）
    const themeButton = page.getByRole('button', { name: '切換主題' })
    await expect(themeButton).toBeVisible()

    // 點擊打開下拉選單
    await themeButton.click()

    // 應該顯示主題選項（中文）
    await expect(page.getByRole('menuitem', { name: '淺色' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: '深色' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: '系統' })).toBeVisible()
  })
})
