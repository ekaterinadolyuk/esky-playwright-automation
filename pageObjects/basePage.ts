import { Locator, Page } from '@playwright/test'

export class BasePage {
    protected readonly page: Page
    private readonly cookieBanner: Locator

    constructor(page: Page) {
        this.page = page
        this.cookieBanner = this.page.getByTestId('uc-accept-all-button')
    }

    async waitForLoaded() {
        await this.page.waitForLoadState('domcontentloaded')
    }

    async acceptCookies() {
        try {
            await this.cookieBanner.waitFor({ state: 'visible' })
            await this.cookieBanner.click()
            await this.cookieBanner.waitFor({ state: 'detached' })
        } catch {
            // Banner did not appear — no action needed
        }
    }
}