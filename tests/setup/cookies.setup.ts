import { test as setup, expect } from '@playwright/test'
import { STORAGE_STATE } from './storageState'

setup('accept cookies and save storage state', async ({ page }) => {
  await page.goto('https://www.esky.pl/')
  const banner = page.getByTestId('uc-accept-all-button')
  await banner.waitFor({ state: 'visible', timeout: 60000 })
  await banner.click()
  await expect(banner).toBeHidden()
  await page.context().storageState({ path: STORAGE_STATE })
})
