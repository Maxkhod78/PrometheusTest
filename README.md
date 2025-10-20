# PrometheusTest

A collection of testing projects demonstrating automated testing capabilities for REST API testing and SDET (Software Development Engineer in Test) automation.

## Projects

### REST API Testing Framework

This project contains a modular, config-driven test framework for REST API testing built with Jest, Axios, and Chai. It provides a structured approach to testing REST APIs with support for multiple environments, fluent assertions, data-driven testing, and comprehensive logging.

The framework tests REST API endpoints including Posts, Comments, and Users APIs with full CRUD operations, positive and negative test scenarios, and data-driven testing.

For detailed documentation, including setup, test scenarios, and project structure, see [`RESTAPI/README.md`](RESTAPI/README.md).

### SDET Automation Tests

This project contains automated tests for verifying the presence of Senior SDET job postings on the Prometheus Group careers page using Playwright. It focuses on end-to-end testing of job search functionality, including Google search navigation and job posting verification.

The test suite handles potential CAPTCHA or rate limiting issues and generates reports for test results.

For detailed documentation, including configuration, running tests, and dependencies, see [`SDET/README.md`](SDET/README.md).

## Getting Started

Each subproject has its own setup and execution instructions. Refer to the respective README files for detailed guidance.

- [REST API Testing Framework Setup](RESTAPI/README.md#execution-paths)
- [SDET Automation Tests Setup](SDET/README.md#running-tests)