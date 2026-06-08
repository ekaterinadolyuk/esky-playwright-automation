import { defineConfig, devices } from '@playwright/test'
import { STORAGE_STATE } from './tests/setup/storageState'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://www.esky.pl/',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
      timeout: 60000,
    },
    {
      name: 'chromium',
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'],
    },
  ],
});
