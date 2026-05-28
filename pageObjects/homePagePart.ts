import { BasePagePart } from './basePagePart'
import { Page } from '@playwright/test'

export class HomePagePart extends BasePagePart {
    private readonly cookieBanner

    constructor(page: Page) {
        super(page)
        this.cookieBanner = this.page.getByTestId('uc-accept-all-button')
    }

    async navigateTo() {
        await this.page.goto('https://www.esky.pl/');
    }

    async acceptCookies() {
        try {
            await this.cookieBanner.waitFor({ state: 'visible', timeout: 2000 })
            await this.cookieBanner.click()
        } catch {
            // Banner did not appear — no action needed
        }
    }

    
}