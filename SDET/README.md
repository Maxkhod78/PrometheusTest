# PrometheusSrSDETPosting

This project contains automated tests for verifying the presence of Senior SDET job postings on the Prometheus Group careers page using Playwright.

## Scope of Testing

The test suite focuses on end-to-end testing of the job search functionality:

- Searching for "Prometheus Group" on Google
- Navigating to the Prometheus Group careers page
- Verifying the presence of the Senior SDET job posting
- Handling potential CAPTCHA or rate limiting issues during search

The primary test case is `Prometheus Group Senior SDET Job Search Test` located in `tests/prometheus-sdet-test.spec.js`.

## Variables

The project uses the following configuration variables (defined in `playwright.config.js`):

- **Test Timeout**: 60 seconds per test
- **Test Directory**: `./tests`
- **Browser**: Chromium (Desktop Chrome)
- **Headless Mode**: Disabled for development (set to `false`)
- **Viewport**: 1920x1080
- **Locale**: en-US
- **Timezone**: America/New_York
- **Retries**: 2 on CI, 0 locally
- **Workers**: 1 on CI, undefined locally

Environment variables:
- `CI`: Enables CI-specific settings when set

## Path of Testing

- **Test Files**: Located in the `tests/` directory
- **Page Objects**: Located in the `page-objects/` directory
- **Configuration**: `playwright.config.js`
- **Reports**: Generated in `playwright-report/` directory
- **Test Results**: Stored in `test-results/` directory

## Running Tests

To run the tests:

```bash
npx playwright test
```

To run in headed mode (visible browser):

```bash
npx playwright test --headed
```

To generate HTML report:

```bash
npx playwright show-report
```

## Dependencies

- @playwright/test: ^1.56.1