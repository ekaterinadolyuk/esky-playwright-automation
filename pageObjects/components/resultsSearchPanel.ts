import { Locator, Page } from '@playwright/test'
import { SearchPanel } from './searchPanel'

export class ResultsSearchPanel extends SearchPanel {
    readonly departureInput: Locator
    readonly arrivalInput: Locator
    readonly dateFromInput: Locator
    readonly dateToInput: Locator
    readonly passengersInput: Locator
    readonly submitButton: Locator

    constructor(page: Page) {
        super(page)
        this.departureInput = this.page.locator('#from')
        this.arrivalInput = this.page.locator('#to')
        this.dateFromInput = this.page.locator('#departureDate')
        this.dateToInput = this.page.locator('#returnDate')
        this.passengersInput = this.page.locator('#passengersInput')
        this.submitButton = this.page
            .locator('form')
            .filter({ has: this.departureInput })
            .locator('button[type="submit"]')
    }
}
