import { Page, expect } from '@playwright/test'
import { BasePagePart } from './basePagePart'
import { HomePagePart } from './homePagePart'
import { SearchFlightPart } from './searchFlightPart'


export class PagesPartManager {
    readonly homePagePart: HomePagePart
    readonly searchFlightPart: SearchFlightPart

    constructor(page: Page) {
        this.homePagePart = new HomePagePart(page)
        this.searchFlightPart = new SearchFlightPart(page)
    }
}