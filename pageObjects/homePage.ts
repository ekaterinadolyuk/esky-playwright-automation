import { Page } from '@playwright/test'
import { BasePage } from './basePage'
import { HomeSearchPanel } from './components/homeSearchPanel'
import { InsuranceSearchPanel } from './components/insuranceSearchPanel'
import { NavigationTabs } from './components/navigationTabs'

export class HomePage extends BasePage {
    readonly searchPanel: HomeSearchPanel
    readonly insuranceSearchPanel: InsuranceSearchPanel
    readonly navigationTabs: NavigationTabs

    constructor(page: Page) {
        super(page)
        this.searchPanel = new HomeSearchPanel(page)
        this.insuranceSearchPanel = new InsuranceSearchPanel(page)
        this.navigationTabs = new NavigationTabs(page)
    }

    async navigateTo() {
        await this.page.goto('/')
    }
}
