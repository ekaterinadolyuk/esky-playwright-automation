import { Page } from '@playwright/test'
import { HomePage } from './homePage'
import { SearchResultsPage } from './searchResultsPage'


export class PagesManager {
    readonly homePage: HomePage
    readonly searchResultsPage: SearchResultsPage

    constructor(page: Page) {
        this.homePage = new HomePage(page)
        this.searchResultsPage = new SearchResultsPage(page)
    }
}