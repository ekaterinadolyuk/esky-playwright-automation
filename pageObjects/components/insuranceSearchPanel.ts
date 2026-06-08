import { Locator, Page } from '@playwright/test'

export class InsuranceSearchPanel {
    protected readonly page: Page
    private readonly scope: Locator

    readonly countryInput: Locator
    readonly dateFromInput: Locator
    readonly dateToInput: Locator
    readonly passengersInput: Locator
    readonly submitButton: Locator

    constructor(page: Page) {
        this.page = page
        this.scope = this.page.locator('div[data-qsf-type="InsuranceQsf"]')
        this.countryInput = this.page.locator('#insurance-country')
        this.dateFromInput = this.scope.locator('input[id="dates_from"]')
        this.dateToInput = this.scope.locator('input[id="dates_to"]')
        this.passengersInput = this.page.locator('#insurance-pax')
        this.submitButton = this.scope.locator('button[type="submit"]')
    }
}
