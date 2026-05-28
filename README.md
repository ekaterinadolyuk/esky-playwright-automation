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
npx playwright test tests/searchFlight.spec.ts   # run one file
npx playwright test --headed              # show the browser
npx playwright test --ui                  # interactive UI mode
npx playwright show-report                # open the last HTML report
```
