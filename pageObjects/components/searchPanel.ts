import { Locator, Page } from '@playwright/test'

export abstract class SearchPanel {
    protected readonly page: Page

    abstract readonly departureInput: Locator
    abstract readonly arrivalInput: Locator
    abstract readonly dateFromInput: Locator
    abstract readonly dateToInput: Locator
    abstract readonly passengersInput: Locator
    abstract readonly submitButton: Locator

    constructor(page: Page) {
        this.page = page
    }

    async clickSubmit() {
        await this.submitButton.click()
    }
}
