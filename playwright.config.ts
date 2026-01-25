import { defineConfig, devices } from '@playwright/test'

/**
 * E2E 測試設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* 平行執行測試 */
  fullyParallel: true,
  /* 禁止只跑 test.only */
  forbidOnly: !!process.env.CI,
  /* CI 環境重試失敗測試 */
  retries: process.env.CI ? 2 : 0,
  /* CI 環境使用單一 worker */
  workers: process.env.CI ? 1 : undefined,
  /* 報告輸出格式 */
  reporter: 'html',
  /* 共用設定 */
  use: {
    /* 基礎 URL */
    baseURL: 'http://localhost:3000',
    /* 截圖設定 */
    screenshot: 'only-on-failure',
    /* 追蹤設定 */
    trace: 'on-first-retry',
  },

  /* 瀏覽器設定 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* 啟動開發伺服器 */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
