import { test, expect } from '@playwright/test'
import { PagesManager } from '../pageObjects/pagesManager'
import { flightSearch } from '../data/testData'

test.describe('Search flight functionality checks', () => {

    let pages: PagesManager

    test.beforeEach(async ({ page }) => {
        pages = new PagesManager(page)
        await pages.homePage.navigateTo()
    })

    test('Search flight check', async () => {
        await pages.homePage.searchPanel.searchFlights(
            flightSearch.origin,
            flightSearch.destination,
            flightSearch.dateFrom,
            flightSearch.dateTo,
            flightSearch.adults,
            flightSearch.classType,
        )
        await pages.searchResultsPage.waitForLoaded()

        const resultsPanel = pages.searchResultsPage.searchPanel
        await expect(resultsPanel.departureInput).toHaveValue(new RegExp(flightSearch.origin))
        await expect(resultsPanel.arrivalInput).toHaveValue(new RegExp(flightSearch.destination))

        const formatPolishDate = (d: Date) => new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d)
        await expect(resultsPanel.dateFromInput).toHaveValue(formatPolishDate(flightSearch.dateFrom))
        await expect(resultsPanel.dateToInput).toHaveValue(formatPolishDate(flightSearch.dateTo))

        const typesOfClasses: Record<string, string> = {
            'ClassEconomy': 'ekon',
            'ClassPremiumEconomy': 'prem',
            'ClassBusiness': 'bizn',
            'ClassFirst': 'kl',
        }

        const expectedClass = typesOfClasses[flightSearch.classType]
        await expect(resultsPanel.passengersInput).toHaveValue(`${flightSearch.adults} os., ${expectedClass}.`)
    })

    test('Switching destination and origin fields functionality works correctly', async () => {
        await pages.homePage.searchPanel.switchOfDestinationAndOriginPoints(flightSearch.origin, flightSearch.destination)
        await expect(pages.homePage.searchPanel.departureInput).toHaveValue(new RegExp(flightSearch.destination))
        await expect(pages.homePage.searchPanel.arrivalInput).toHaveValue(new RegExp(flightSearch.origin))
    })

    test('Validation errors are displayed correctly when searching with empty values', async () => {
        const homePanel = pages.homePage.searchPanel
        await homePanel.clearDepartureField()
        await homePanel.clearPassengersField(1)
        await homePanel.clickSubmit()

        await expect(homePanel.departureAlert).toHaveText('Wpisz miejsce wylotu')
        await expect(homePanel.arrivalAlert).toHaveText('Wpisz miejsce przylotu')
        await expect(homePanel.dateFromAlert).toHaveText('Wybierz datę')
        await expect(homePanel.dateToAlert).toHaveText('Wybierz datę')
        await expect(homePanel.passengersAlert).toHaveText('Wybierz liczbę osób')
    })

    test('Search results contain \'Najleprze\' and \'Najtańsze\' badges', async () => {
        await pages.homePage.searchPanel.searchFlights(
            flightSearch.origin,
            flightSearch.destination,
            flightSearch.dateFrom,
            flightSearch.dateTo,
            flightSearch.adults,
            flightSearch.classType,
        )
        await pages.searchResultsPage.waitForLoaded()

        await expect(pages.searchResultsPage.bestBadge).toHaveText('Najleprze')
        await expect(pages.searchResultsPage.cheapestBadge).toHaveText('Najtańsze')
    })

})
