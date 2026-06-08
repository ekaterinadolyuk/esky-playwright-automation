import { Locator, Page } from '@playwright/test'
import { SearchPanel } from './searchPanel'

export class HomeSearchPanel extends SearchPanel {
    readonly departureInput: Locator
    readonly arrivalInput: Locator
    readonly dateFromInput: Locator
    readonly dateToInput: Locator
    readonly passengersInput: Locator
    readonly submitButton: Locator

    readonly roundTripRadio: Locator
    readonly oneWayRadio: Locator

    readonly departureAlert: Locator
    readonly arrivalAlert: Locator
    readonly dateFromAlert: Locator
    readonly dateToAlert: Locator
    readonly passengersAlert: Locator

    private readonly nextMonthButton: Locator
    private readonly visibleMonthViews: Locator
    private readonly visibleHeaderTitles: Locator
    private readonly adultsPlusButton: Locator
    private readonly adultsMinusButton: Locator
    private readonly swapDirectionButton: Locator
    private readonly departureClearButton: Locator
    private readonly departureAutocompleteOptions: Locator
    private readonly arrivalAutocompleteOptions: Locator

    constructor(page: Page) {
        super(page)
        this.departureInput = this.page.locator('#qsf-departure')
        this.arrivalInput = this.page.locator('#qsf-arrival')
        this.dateFromInput = this.page.locator('div[data-qsf-type="FlightsQsf"] #dates_from')
        this.dateToInput = this.page.locator('div[data-qsf-type="FlightsQsf"] #dates_to')
        this.passengersInput = this.page.locator('#qsf-pax')
        this.submitButton = this.page.locator('form[data-track-scope="Flights"] button[type="submit"]')

        this.roundTripRadio = this.page.getByLabel('W obie strony')
        this.oneWayRadio = this.page.getByLabel('W jedną stronę')

        this.departureAlert = this.page.locator("div[class*='departureInput'] [role='alert']")
        this.arrivalAlert = this.page.locator("div[class*='arrivalInput'] [role='alert']")
        this.dateFromAlert = this.page.locator("div[class*='dateFromInput'] [role='alert']")
        this.dateToAlert = this.page.locator("div[class*='dateToInput'] [role='alert']")
        this.passengersAlert = this.page.locator("div[class*='passengers'] [role='alert']")

        this.nextMonthButton = this.page.locator('div[data-track="NextMonth"] button:visible').last()
        this.visibleMonthViews = this.page.locator("div[class*='horizontalView']:visible")
        this.visibleHeaderTitles = this.page.locator("div[class*='calendarHeaderTitle']:visible")
        this.adultsPlusButton = this.page.locator('[data-track="AdultsPlus"]')
        this.adultsMinusButton = this.page.locator('[data-track="AdultsMinus"]')
        this.swapDirectionButton = this.page.locator('button[data-track="SwapDirection"]')
        this.departureClearButton = this.page.locator('button[data-track="DepartureClear"]')
        this.departureAutocompleteOptions = this.page.locator('#autocomplete-departure [data-track="SelectDepartureMultiport"]')
        this.arrivalAutocompleteOptions = this.page.locator('#autocomplete-arrival [data-track="SelectDestinationMultiport"]')
    }

    private calendarDay(monthView: Locator, day: number): Locator {
        return monthView
            .locator('[data-track="Day"]')
            .filter({ hasText: String(day) })
    }

    private classTypeOption(classType: string): Locator {
        return this.page.locator(`[data-track="${classType}"]`)
    }

    private async selectDate(date: Date) {
        const polishMonths = [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
        ]

        const expectedHeader = `${polishMonths[date.getUTCMonth()]} ${date.getUTCFullYear()}`

        for (let i = 0; i < 12; i++) {
            const leftHeaderText = (await this.visibleHeaderTitles.first().innerText()).trim()
            if (leftHeaderText === expectedHeader) {
                await this.calendarDay(this.visibleMonthViews.first(), date.getUTCDate()).click()
                return
            }

            const rightHeaderText = (await this.visibleHeaderTitles.last().innerText()).trim()
            if (rightHeaderText === expectedHeader) {
                await this.calendarDay(this.visibleMonthViews.last(), date.getUTCDate()).click()
                return
            }

            await this.nextMonthButton.click()
        }
    }

    async fillInDateRange(dateFrom: Date, dateTo: Date) {
        await this.dateFromInput.click()
        await this.selectDate(dateFrom)
        await this.selectDate(dateTo)
    }

    async fillInPassangers(adults: number, classType: string) {
        await this.passengersInput.click()

        if (adults === 0) {
            await this.adultsMinusButton.click()
        }

        for (let i = 1; i < adults; i++) {
            await this.adultsPlusButton.click()
        }

        await this.classTypeOption(classType).click()
    }

    private async fillDeparture(origin: string) {
        await this.departureInput.click()
        await this.departureInput.fill(origin)
        await this.departureAutocompleteOptions
            .filter({ hasText: new RegExp(origin) })
            .first()
            .click()
    }

    private async fillArrival(destination: string) {
        await this.arrivalInput.click()
        await this.arrivalInput.fill(destination)
        await this.arrivalAutocompleteOptions
            .filter({ hasText: new RegExp(destination) })
            .first()
            .click()
    }

    async searchFlights(
        origin: string,
        destination: string,
        dateFrom: Date,
        dateTo: Date,
        adults: number,
        classType: string,
    ) {
        await this.fillDeparture(origin)
        await this.fillArrival(destination)
        await this.fillInDateRange(dateFrom, dateTo)
        await this.fillInPassangers(adults, classType)
        await this.clickSubmit()
    }

    async switchOfDestinationAndOriginPoints(origin: string, destination: string) {
        await this.fillDeparture(origin)
        await this.fillArrival(destination)
        await this.swapDirectionButton.click()
    }

    async clearDepartureField() {
        await this.departureClearButton.click()
    }

    async clearPassengersField(adults: number) {
        await this.passengersInput.click()

        for (let i = adults; i > 0; i--) {
            await this.adultsMinusButton.click()
        }
    }
}
