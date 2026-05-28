import { test, expect} from '@playwright/test'
import { PagesPartManager } from '../pageObjects/pagesPartManager'
import { flightSearch } from '../data/testData'

test.describe('Search flight functionality checks', () => {

    let pagesPartManagerInstance: PagesPartManager

    test.beforeEach(async ({page}) => {
        pagesPartManagerInstance = new PagesPartManager(page)
        await pagesPartManagerInstance.homePagePart.navigateTo()
        await pagesPartManagerInstance.homePagePart.acceptCookies()
    })

    test('Search flight check', async({page}) => {
        await pagesPartManagerInstance.searchFlightPart.searchFlights(flightSearch.origin, flightSearch.destination, flightSearch.dateFrom, flightSearch.dateTo, flightSearch.adults, flightSearch.classType)
        await expect(page.locator('#from')).toHaveValue(new RegExp(flightSearch.origin))
        await expect(page.locator('#to')).toHaveValue(new RegExp(flightSearch.destination))

        const formatPolishDate = (d: Date) => new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d)
        await expect(page.locator('#departureDate')).toHaveValue(formatPolishDate(flightSearch.dateFrom))
        await expect(page.locator('#returnDate')).toHaveValue(formatPolishDate(flightSearch.dateTo))

        const typesOfClasses: Record<string,string> = {
            "ClassEconomy":"ekon",
            "ClassPremiumEconomy":"prem",
            "ClassBusiness":"bizn",
            "ClassFirst":"kl",
        }

        let expectedClass = typesOfClasses[flightSearch.classType]

        await expect(page.locator('#passengersInput')).toHaveValue(`${flightSearch.adults} os., ${expectedClass}.`)
    })

    test('Switching destination and origin fields functionality works correctly', async({page}) => {
        await pagesPartManagerInstance.searchFlightPart.switchOfDestinationAndOriginPoints(flightSearch.origin, flightSearch.destination)
        await expect(page.locator('#qsf-departure')).toHaveValue(new RegExp(flightSearch.destination))
        await expect(page.locator('#qsf-arrival')).toHaveValue(new RegExp(flightSearch.origin))
    })

    test('Validation errors are displayed correctly when searching with empty values', async({page}) => {
        await pagesPartManagerInstance.searchFlightPart.clearDepartureField()
        await pagesPartManagerInstance.searchFlightPart.clearPassengersField(1)
        await pagesPartManagerInstance.searchFlightPart.searchButtonClick()

        await expect(page.locator("div[class*='departureInput'] [role='alert']")).toHaveText('Wpisz miejsce wylotu')
        await expect(page.locator("div[class*='arrivalInput'] [role='alert']")).toHaveText('Wpisz miejsce przylotu')
        await expect(page.locator("div[class*='dateFromInput'] [role='alert']")).toHaveText('Wybierz datę')
        await expect(page.locator("div[class*='dateToInput'] [role='alert']")).toHaveText('Wybierz datę')
        await expect(page.locator("div[class*='passengers'] [role='alert']")).toHaveText('Wybierz liczbę osób')
    })

    test('Search results contain \'Najleprze\' and \'Najtańsze\' badges', async({page}) => {
        await pagesPartManagerInstance.searchFlightPart.searchFlights(flightSearch.origin, flightSearch.destination, flightSearch.dateFrom, flightSearch.dateTo, flightSearch.adults, flightSearch.classType)

        await page.waitForLoadState('domcontentloaded')
        await page.locator('#best').waitFor({ state: 'visible', timeout: 30000 })
        await page.locator('#cheapest').waitFor({ state: 'visible', timeout: 30000 })

        await expect(page.locator('#best')).toHaveText('Najleprze')
        await expect(page.locator('#cheapest')).toHaveText('Najtańsze')
    })

})