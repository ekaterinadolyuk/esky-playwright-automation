import { Page } from '@playwright/test'

export class BasePagePart {
    protected readonly page: Page

    constructor(page: Page) {
        this.page = page
    }
}