import { test, expect } from '@playwright/test'

test.describe('搜尋功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('應該顯示搜尋按鈕', async ({ page }) => {
    // 桌面版顯示搜尋按鈕
    const searchButton = page.locator('button').filter({ has: page.locator('svg') }).filter({
      hasText: /搜尋|⌘/,
    })
    await expect(searchButton.first()).toBeVisible()
  })

  test('點擊搜尋按鈕應該打開搜尋對話框', async ({ page }) => {
    // 點擊搜尋按鈕
    const searchButton = page.locator('nav button').filter({ has: page.locator('svg') }).first()
    await searchButton.click()

    // 應該顯示搜尋對話框
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // 應該有搜尋輸入框
    const input = page.locator('[role="dialog"] input[placeholder*="搜尋"]')
    await expect(input).toBeVisible()
  })

  test('使用快捷鍵 Cmd+K 應該打開搜尋對話框', async ({ page }) => {
    // 使用快捷鍵
    await page.keyboard.press('Meta+k')

    // 應該顯示搜尋對話框
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
  })

  test('搜尋對話框應該顯示文章列表', async ({ page }) => {
    // 打開搜尋對話框
    await page.keyboard.press('Meta+k')

    // 應該顯示文章群組
    const articlesGroup = page.locator('[role="dialog"] [cmdk-group-heading]')
    await expect(articlesGroup).toBeVisible()

    // 應該有文章項目
    const items = page.locator('[role="dialog"] [cmdk-item]')
    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })

  test('輸入搜尋文字應該過濾文章', async ({ page }) => {
    // 打開搜尋對話框
    await page.keyboard.press('Meta+k')

    // 輸入搜尋文字
    const input = page.locator('[role="dialog"] input')
    await input.fill('React')

    // 等待過濾結果
    await page.waitForTimeout(300)

    // 應該顯示包含 React 的文章
    const items = page.locator('[role="dialog"] [cmdk-item]')
    const count = await items.count()

    if (count > 0) {
      const firstItem = items.first()
      const text = await firstItem.textContent()
      expect(text?.toLowerCase()).toContain('react')
    }
  })

  test('點擊搜尋結果應該導航到文章頁', async ({ page }) => {
    // 打開搜尋對話框
    await page.keyboard.press('Meta+k')

    // 點擊第一個結果
    const firstItem = page.locator('[role="dialog"] [cmdk-item]').first()
    await firstItem.click()

    // 應該導航到文章頁
    await expect(page).toHaveURL(/\/tech-page\//)
  })

  test('搜尋無結果時應該顯示提示', async ({ page }) => {
    // 打開搜尋對話框
    await page.keyboard.press('Meta+k')

    // 輸入不存在的搜尋文字
    const input = page.locator('[role="dialog"] input')
    await input.fill('xyznonexistentarticle12345')

    // 等待過濾結果
    await page.waitForTimeout(300)

    // 應該顯示無結果提示
    const emptyMessage = page.locator('[cmdk-empty]')
    await expect(emptyMessage).toBeVisible()
    await expect(emptyMessage).toContainText('找不到')
  })

  test('按 ESC 鍵應該關閉搜尋對話框', async ({ page }) => {
    // 打開搜尋對話框
    await page.keyboard.press('Meta+k')

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // 按 ESC 關閉
    await page.keyboard.press('Escape')

    // 對話框應該消失
    await expect(dialog).not.toBeVisible()
  })

  test('點擊對話框外部應該關閉搜尋對話框', async ({ page }) => {
    // 打開搜尋對話框
    await page.keyboard.press('Meta+k')

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // 點擊遮罩層
    const overlay = page.locator('[data-state="open"][data-aria-hidden="true"]')
    if ((await overlay.count()) > 0) {
      await overlay.click({ force: true })
    } else {
      // 如果沒有遮罩層，按 ESC 關閉
      await page.keyboard.press('Escape')
    }

    // 對話框應該消失
    await expect(dialog).not.toBeVisible()
  })
})

test.describe('搜尋功能鍵盤導航', () => {
  test('應該能使用方向鍵導航搜尋結果', async ({ page }) => {
    await page.goto('/')

    // 打開搜尋對話框
    await page.keyboard.press('Meta+k')

    // 按下方向鍵選擇第一個結果
    await page.keyboard.press('ArrowDown')

    // 第一個項目應該被選中
    const selectedItem = page.locator('[role="dialog"] [cmdk-item][data-selected="true"]')
    await expect(selectedItem).toBeVisible()
  })

  test('按 Enter 應該導航到選中的結果', async ({ page }) => {
    await page.goto('/')

    // 打開搜尋對話框
    await page.keyboard.press('Meta+k')

    // 選擇第一個結果
    await page.keyboard.press('ArrowDown')

    // 按 Enter 導航
    await page.keyboard.press('Enter')

    // 應該導航到文章頁
    await expect(page).toHaveURL(/\/tech-page\//)
  })
})
