import { test, expect } from '@playwright/test'

test.describe('攝影集頁面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/photo')
  })

  test('應該正確顯示頁面標題', async ({ page }) => {
    await expect(page).toHaveTitle(/攝影集/)
  })

  test('應該顯示攝影集標題', async ({ page }) => {
    const heading = page.getByRole('heading', { name: '攝影集' })
    await expect(heading).toBeVisible()
  })

  test('應該顯示載入進度或圖片容器', async ({ page }) => {
    // 頁面應該有進度條或圖片容器
    const pageContent = page.locator('body')
    await expect(pageContent).toBeVisible()

    // 檢查是否有圖片元素
    const images = page.locator('img[alt*="Instagram"]')
    // 圖片可能需要時間載入，所以只檢查元素存在
    await expect(images.first()).toBeAttached({ timeout: 60000 })
  })

  test('應該有圖片元素', async ({ page }) => {
    // 等待圖片元素存在
    const images = page.locator('img[alt*="Instagram"]')
    await expect(images.first()).toBeAttached({ timeout: 60000 })

    // 檢查至少有一張圖片
    const count = await images.count()
    expect(count).toBeGreaterThan(0)
  })

  test('圖片應該從 Cloudinary 載入', async ({ page }) => {
    // 等待圖片載入
    const images = page.locator('img[alt*="Instagram"]')
    await expect(images.first()).toBeAttached({ timeout: 60000 })

    // 檢查圖片 src 是否來自 Cloudinary
    const src = await images.first().getAttribute('src')
    expect(src).toContain('cloudinary')
  })

  test('應該有瀑布流容器元素', async ({ page }) => {
    // 等待容器出現（可能是隱藏的直到圖片載入完成）
    const container = page.locator('[class*="columns"]')
    await expect(container).toBeAttached({ timeout: 60000 })
  })
})

test.describe('導覽列攝影集連結', () => {
  test('從導覽列點擊攝影集連結', async ({ page }) => {
    await page.goto('/')

    const photoLink = page.locator('nav').locator('a', { hasText: '攝影集' }).first()
    await photoLink.click()

    await expect(page).toHaveURL('/photo')
    await expect(page.getByRole('heading', { name: '攝影集' })).toBeVisible()
  })
})

test.describe('攝影集頁面響應式設計', () => {
  test('手機版應該正常顯示', async ({ page }) => {
    // 設定為手機視窗
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/photo')

    // 頁面應該正常載入
    await expect(page.getByRole('heading', { name: '攝影集' })).toBeVisible()
  })

  test('桌面版應該正常顯示', async ({ page }) => {
    // 設定為桌面視窗
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/photo')

    // 頁面應該正常載入
    await expect(page.getByRole('heading', { name: '攝影集' })).toBeVisible()
  })
})
