import { Locator, Page } from '@playwright/test'

export class NavigationTabs {
    protected readonly page: Page
    private readonly scope: Locator

    readonly flightsTab: Locator
    readonly lotHotelTab: Locator
    readonly insuranceTab: Locator
    readonly wakacjeLink: Locator
    readonly cityBreakLink: Locator
    readonly hoteleLink: Locator

    constructor(page: Page) {
        this.page = page
        this.scope = this.page.locator('div[data-track-scope="Tab"]')
        this.flightsTab = this.scope.locator('button[data-track="FlightsQsf"]')
        this.lotHotelTab = this.scope.getByRole('button', { name: 'Lot+Hotel' })
        this.insuranceTab = this.scope.locator('button[data-track="InsuranceQsf"]')
        this.wakacjeLink = this.scope.getByRole('link', { name: 'Wakacje' })
        this.cityBreakLink = this.scope.getByRole('link', { name: 'City break' })
        this.hoteleLink = this.scope.getByRole('link', { name: 'Hotele' })
    }
}
