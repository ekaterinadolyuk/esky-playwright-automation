import { Locator, Page } from '@playwright/test'
import { BasePage } from './basePage'
import { ResultsSearchPanel } from './components/resultsSearchPanel'

export class SearchResultsPage extends BasePage {
    readonly searchPanel: ResultsSearchPanel
    readonly bestBadge: Locator
    readonly cheapestBadge: Locator

    constructor(page: Page) {
        super(page)
        this.searchPanel = new ResultsSearchPanel(page)
        this.bestBadge = this.page.locator('#best')
        this.cheapestBadge = this.page.locator('#cheapest')
    }
}
