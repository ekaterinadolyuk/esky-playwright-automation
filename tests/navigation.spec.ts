import { test, expect } from '@playwright/test'
import { PagesManager } from '../pageObjects/pagesManager'

test.describe('Navigation UI elements checks', () => {

  let pagesManagerInstance: PagesManager

  test.beforeEach(async ({ page }) => {
    pagesManagerInstance = new PagesManager(page)
    await pagesManagerInstance.homePage.navigateTo()
  })

  test('Navigation elements present on homepage', async () => {
    const tabs = pagesManagerInstance.homePage.navigationTabs

    await expect(tabs.flightsTab).toBeVisible()
    await expect(tabs.lotHotelTab).toBeVisible()
    await expect(tabs.insuranceTab).toBeVisible()
    await expect(tabs.wakacjeLink).toBeVisible()
    await expect(tabs.cityBreakLink).toBeVisible()
    await expect(tabs.hoteleLink).toBeVisible()
  })

  test('Navigation items lead to proper locations', async ({ page }) => {
    const homePage = pagesManagerInstance.homePage
    const tabs = homePage.navigationTabs
    const flightPanel = homePage.searchPanel
    const insurancePanel = homePage.insuranceSearchPanel

    await tabs.lotHotelTab.click()
    await expect(flightPanel.roundTripRadio).toBeHidden()
    await expect(flightPanel.oneWayRadio).toBeHidden()

    await tabs.flightsTab.click()
    await expect(flightPanel.roundTripRadio).toBeVisible()
    await expect(flightPanel.oneWayRadio).toBeVisible()

    await tabs.insuranceTab.click()
    await expect(insurancePanel.countryInput).toBeVisible()
    await expect(insurancePanel.dateFromInput).toBeVisible()
    await expect(insurancePanel.dateToInput).toBeVisible()
    await expect(insurancePanel.passengersInput).toBeVisible()
    await expect(insurancePanel.submitButton).toBeVisible()

    await tabs.wakacjeLink.click()
    await expect(page).toHaveURL(/wakacje/)
    await homePage.navigateTo()

    await tabs.cityBreakLink.click()
    await expect(page).toHaveURL(/city-break/)
    await homePage.navigateTo()

    await tabs.hoteleLink.click()
    await expect(page).toHaveURL(/noclegi/)
  })
})
