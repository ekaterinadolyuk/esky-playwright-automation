import { test, expect} from '@playwright/test'
import { PagesPartManager } from '../pageObjects/pagesPartManager'

test.describe('Navigation UI elements checks', () => {

  let pagesPartManagerInstance: PagesPartManager

  test.beforeEach(async ({page}) => {
    pagesPartManagerInstance = new PagesPartManager(page)
    await pagesPartManagerInstance.homePagePart.navigateTo()
    await pagesPartManagerInstance.homePagePart.acceptCookies()
  })

  test('Navigation elements present on homepage', async ({page}) => {
    await expect(page.locator('div[data-track-scope="Tab"] button[data-track="FlightsQsf"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Lot+Hotel' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ubezpieczenia' })).toBeVisible()

    await expect(page.locator('div[data-track-scope="Tab"]').getByRole('link', { name: 'Wakacje' })).toBeVisible()
    await expect(page.locator('div[data-track-scope="Tab"]').getByRole('link', { name: 'City break'})).toBeVisible()
    await expect(page.locator('div[data-track-scope="Tab"]').getByRole('link', { name: 'Hotele' })).toBeVisible()
  })

  test('Navigation items lead to proper locations', async ({page}) => {

    await page.getByRole('button', { name: 'Lot+Hotel' }).click()
    await expect(page.getByLabel('W obie strony')).toBeHidden()
    await expect(page.getByLabel('W jedną stronę')).toBeHidden()

    await page.locator('div[data-track-scope="Tab"] button').first().click()
    await expect(page.getByLabel('W obie strony')).toBeVisible()
    await expect(page.getByLabel('W jedną stronę')).toBeVisible()

    await page.locator('button[data-track="InsuranceQsf"]').click()
    await expect(page.locator('#insurance-country')).toBeVisible()
    await expect(page.locator('div[data-qsf-type="InsuranceQsf"] input[id="dates_from"]')).toBeVisible()
    await expect(page.locator('div[data-qsf-type="InsuranceQsf"] input[id="dates_to"]')).toBeVisible()
    await expect(page.locator('#insurance-pax')).toBeVisible()
    await expect(page.locator('div[data-qsf-type="InsuranceQsf"] button[type="submit"]')).toBeVisible()

    await page.locator('div[data-track-scope="Tab"]').getByRole('link', { name: 'Wakacje' }).click()
    await expect(page).toHaveURL(/wakacje/)
    await pagesPartManagerInstance.homePagePart.navigateTo()

    await page.locator('div[data-track-scope="Tab"]').getByRole('link', { name: 'City break' }).click()
    await expect(page).toHaveURL(/city-break/)
    await pagesPartManagerInstance.homePagePart.navigateTo()

    await page.locator('div[data-track-scope="Tab"]').getByRole('link', { name: 'Hotele' }).click()
    await expect(page).toHaveURL(/noclegi/)
  })
});
