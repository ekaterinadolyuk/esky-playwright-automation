import { Page } from 'playwright'
import { BasePagePart } from './basePagePart'

export class SearchFlightPart extends BasePagePart {
    private readonly searchInputDepaturePoint
    private readonly searchInputArrivalPoint
    private readonly searchInputDateFrom
    //private readonly searchInputDateTo
    private readonly searchInputPassengersInfo
    private readonly searchButton

    constructor(page:Page) {
        super(page)
        this.searchInputDepaturePoint = this.page.locator('#qsf-departure')
        this.searchInputArrivalPoint = this.page.locator('#qsf-arrival')
        this.searchInputDateFrom = this.page.locator('div[data-qsf-type="FlightsQsf"] #dates_from')
        //this.searchInputDateTo = this.page.locator('#dates_to')
        this.searchInputPassengersInfo = this.page.locator('#qsf-pax')
        this.searchButton = this.page.locator('form[data-track-scope="Flights"] button[type="submit"]')
    }

    async fillInDateRange(dateFrom: Date, dateTo: Date) {
        await this.searchInputDateFrom.click()

        const polishMonths = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
        
        const expectedHeaderMonthTextFrom = `${polishMonths[dateFrom.getUTCMonth()]} ${dateFrom.getUTCFullYear()}`

        for (let i = 0; i < 12; i++) {
            const leftHeaderText = await this.page
                .locator("div[class*='calendarHeaderTitle'] div")
                .first()
                .innerText()

            if(leftHeaderText.trim() === expectedHeaderMonthTextFrom) {
                await this.page
                    .locator("div[class*='calendarMonthView']").first()
                    .locator("div[class*='dayNumber']")
                    .filter({ hasText: String(dateFrom.getUTCDate()) })
                    .click()
                break;
            }

            const rightHeaderText = await this.page
                .locator("div[class*='calendarHeaderTitle'] div")
                .last()
                .innerText()

            if(rightHeaderText.trim() === expectedHeaderMonthTextFrom) {
                await this.page
                    .locator("div[class*='calendarMonthView']").last()
                    .locator("div[class*='dayNumber']")
                    .filter({ hasText: String(dateFrom.getUTCDate()) })
                    .click()
                break;
            }

            await this.page.locator('form[data-track-scope="Flights"] div[data-track="NextMonth"] button').click()
        }

        const expectedHeaderMonthTextTo = `${polishMonths[dateTo.getUTCMonth()]} ${dateTo.getUTCFullYear()}`

        for (let i = 0; i < 12; i++) {
            const leftHeaderText = await this.page
                .locator("div[class*='calendarHeaderTitle'] div")
                .first()
                .innerText()

            if(leftHeaderText.trim() === expectedHeaderMonthTextTo) {
                await this.page
                    .locator("div[class*='calendarMonthView']").first()
                    .locator("div[class*='dayNumber']")
                    .filter({ hasText: String(dateTo.getUTCDate()) })
                    .click()
                break;
            }

            const rightHeaderText = await this.page
                .locator("div[class*='calendarHeaderTitle'] div")
                .last()
                .innerText()

            if(rightHeaderText.trim() === expectedHeaderMonthTextTo) {
                await this.page
                    .locator("div[class*='calendarMonthView']").last()
                    .locator("div[class*='dayNumber']")
                    .filter({ hasText: String(dateTo.getUTCDate()) })
                    .click()
                break;
            }

            await this.page.locator('form[data-track-scope="Flights"] div[data-track="NextMonth"] button').click()
        }
    }

    async fillInPassangers(adults: number, classType: string) {
        await this.searchInputPassengersInfo.click()

        if(adults === 0) {
            await this.page.locator('[data-track="AdultsMinus"]').click()
        }

        for(let i=1; i < adults; i++) {
            await this.page.locator('[data-track="AdultsPlus"]').click()
        }

        await this.page
            .locator(`[data-track="${classType}"]`)
            .click()
    }

    async searchButtonClick() {
        await this.searchButton.click()
    }

    async searchFlights(origin: string, destination: string, dateFrom: Date, dateTo: Date, adult: number, classType: string) {
        // Fill departure
        await this.searchInputDepaturePoint.click()
        await this.searchInputDepaturePoint.fill(origin)
        await this.page.locator('#autocomplete-departure [data-track="SelectDepartureMultiport"]').filter({ hasText: new RegExp(origin) }).first().click()

        // Fill arrival
        await this.searchInputArrivalPoint.click()
        await this.searchInputArrivalPoint.fill(destination)
        await this.page.locator('#autocomplete-arrival [data-track="SelectDestinationMultiport"]').filter({ hasText: new RegExp(destination) }).first().click()


        // Fill dates
        await this.fillInDateRange(dateFrom, dateTo)

        // Fill passengers
        await this.fillInPassangers(adult, classType)

        // Submit and wait for the results page to load in the same tab
        await this.searchButtonClick()
        await this.page.waitForLoadState('domcontentloaded')
        // Wait for a results-page element to confirm landing on the right page
        await this.page.locator('#from').waitFor({ state: 'visible', timeout: 30000 })
    }

    async switchOfDestinationAndOriginPoints(origin: string, destination: string) {
        await this.searchInputDepaturePoint.click()
        await this.searchInputDepaturePoint.fill(origin)
        await this.page.locator('#autocomplete-departure [data-track="SelectDepartureMultiport"]').filter({ hasText: new RegExp(origin) }).first().click()

        await this.searchInputArrivalPoint.click()
        await this.searchInputArrivalPoint.fill(destination)
        await this.page.locator('#autocomplete-arrival [data-track="SelectDestinationMultiport"]').filter({ hasText: new RegExp(destination) }).first().click()

        await this.page.locator('button[data-track="SwapDirection"]').click()
    }

    async clearDepartureField() {
        await this.page.locator('button[data-track="DepartureClear"]').click()
    }

    async clearPassengersField(adults: number) {
        await this.searchInputPassengersInfo.click()

        for(let i= adults; i > 0; i--) {
            await this.page.locator('[data-track="AdultsMinus"]').click()
        }
    }
}