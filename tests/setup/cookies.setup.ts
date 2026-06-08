import { test as setup } from '@playwright/test'
import { STORAGE_STATE } from './storageState'
import { PagesManager } from '../../pageObjects/pagesManager'

setup('accept cookies and save storage state', async ({ page }) => {
  const pagesManager = new PagesManager(page)
  await pagesManager.homePage.navigateTo()
  await pagesManager.homePage.acceptCookies()
  await page.context().storageState({ path: STORAGE_STATE })
})
