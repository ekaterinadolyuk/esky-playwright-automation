# esky-playwright-automation

Playwright UI tests for [esky.pl](https://www.esky.pl/).

## Install

```bash
npm install
npx playwright install
```

## Run tests

```bash
npm test                                  # run all tests

```

## Test cases

1. navigation.spec.ts with 'Navigation UI elements checks' test suite contains the following test cases:
 - Navigation elements present on homepage
 - Navigation items lead to proper locations

2. searchFlight.spec.ts 'Search flight functionality checks' test suite contains the following test cases:
 - Search flight check
 - Switching destination and origin fields functionality works correctly
 - Validation errors are displayed correctly when searching with empty values
 - Search results contain 'Najleprze' and 'Najtańsze' badges