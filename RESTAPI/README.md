# Modular Test Framework

A modular, config-driven test framework for REST API testing built with Jest, Axios, and Chai. This framework provides a structured approach to testing REST APIs with support for multiple environments, fluent assertions, data-driven testing, and comprehensive logging.

## Overview

This test framework is designed to test REST APIs using JSONPlaceholder (https://jsonplaceholder.typicode.com) as the target API. It implements a modular architecture with separate components for configuration, data transfer objects (DTOs), HTTP client, assertions, logging, and test utilities.

## Scope of Tests

The framework tests REST API endpoints with the following coverage:

### API Endpoints Tested
- **Posts API** (`/posts`) - CRUD operations for blog posts
- **Comments API** (`/comments`) - Comment management
- **Users API** (`/users`) - User data operations

### HTTP Methods Covered
- **GET** - Retrieve resources (single, multiple, filtered)
- **POST** - Create new resources
- **PUT** - Update existing resources
- **DELETE** - Remove resources

### Test Categories
1. **Positive Tests** - Valid operations and expected behaviors
2. **Negative Tests** - Error conditions, invalid inputs, edge cases
3. **Data-Driven Tests** - Parameterized testing with external data sources

## Test Scenarios

### Positive Test Scenarios

#### GET Operations
1. Retrieve all posts
2. Retrieve post by ID
3. Filter posts by user ID using query parameters

#### POST Operations
1. Create new post with complete data
2. Create post with nested/custom data
3. Create post with custom headers

#### PUT Operations
1. Update existing post completely
2. Update partial post data
3. Update post with different user association

#### DELETE Operations
1. Delete existing post
2. Delete non-existent post (graceful handling)
3. Delete with authentication headers

### Negative Test Scenarios

#### Invalid Requests
1. GET with non-existent resource ID (404)
2. POST with malformed JSON data
3. PUT on non-existent resource
4. Invalid query parameters

#### Edge Cases
1. Empty request bodies
2. Large request payloads
3. Invalid data types
4. Concurrent operations
5. Network timeouts
6. Invalid base URLs

#### Data Validation
1. Missing required fields
2. Invalid field types
3. Special characters and encoding
4. Boundary value testing

### Data-Driven Test Scenarios

#### Parameterized Creation
- Create posts with various data combinations from JSON files
- Test different user IDs, titles, and content lengths
- Validate special characters and encoding

#### Bulk Operations
- Create multiple resources for testing
- Retrieve and validate created resources
- Update resources with different data sets
- Delete multiple resources

#### Query Testing
- Filter by different user IDs
- Validate result counts and data integrity
- Test query parameter combinations

## Execution Paths

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

```

### Test File Structure
```
tests/
├── posts.test.js          # Posts API tests
├── negative.test.js       # Negative test cases
├── data-driven.test.js    # Parameterized tests
├── comments.test.js       # Comments API tests (planned)
└── users.test.js          # Users API tests (planned)
```

### Test Execution Flow
1. Load configuration based on environment
2. Initialize HTTP client with base URL and headers
3. Load test data from JSON files (for data-driven tests)
4. Execute test suites in order
5. Generate coverage and test reports

## Parameters

### Configuration Parameters

#### Base Configuration (`config/config.js`)
```javascript
{
  baseUrl: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'ModularTestFramework/1.0.0'
  },
  timeout: 10000,
  retry: {
    attempts: 3,
    delay: 1000
  }
}
```

#### Environment-Specific Settings
- **Development**: Default settings with extended timeout (15s)
- **Staging**: Staging API endpoint with standard timeout (10s)
- **Production**: Production API endpoint with minimal timeout (5s)

### Test Data Parameters

#### External Data Files
- `data/test-data.json` - Test data for data-driven tests
- `data/negative-cases.json` - Negative test scenarios (planned)

#### Runtime Parameters
- Custom headers for individual requests
- Query parameters for filtering
- Request body data for POST/PUT operations
- Authentication tokens (when required)

## Environments

### Development Environment
```bash
NODE_ENV=development npm test
```
- **Base URL**: https://jsonplaceholder.typicode.com
- **Timeout**: 15000ms
- **Retry**: 3 attempts with 1s delay
- **Logging**: Detailed console output

### Staging Environment
```bash
NODE_ENV=staging npm test
```
- **Base URL**: https://jsonplaceholder-staging.typicode.com
- **Timeout**: 10000ms
- **Retry**: 3 attempts with 1s delay
- **Logging**: Standard console output

### Production Environment
```bash
NODE_ENV=production npm test
```
- **Base URL**: https://jsonplaceholder.typicode.com
- **Timeout**: 5000ms
- **Retry**: 3 attempts with 1s delay
- **Logging**: Minimal console output

## Project Structure

```
modular-test-framework/
├── config/
│   └── config.js              # Environment configurations
├── dto/
│   ├── PostDTO.js            # Post data transfer object
│   ├── CommentDTO.js         # Comment data transfer object
│   └── UserDTO.js            # User data transfer object
├── logger/
│   ├── ILogger.js            # Logger interface
│   └── ConsoleLogger.js      # Console logger implementation
├── http/
│   └── HttpClient.js         # Axios-based HTTP client
├── assertions/
│   └── FluentAssertions.js   # Chai-based fluent assertions
├── tests/
│   ├── posts.test.js         # Posts API test suite
│   ├── negative.test.js      # Negative test cases
│   └── data-driven.test.js   # Parameterized tests
├── data/
│   ├── test-data.json        # Test data for data-driven tests
│   └── negative-cases.json   # Negative test data (planned)
├── utils/
│   └── test-utils.js         # Test helper utilities
├── package.json
├── jest.config.js
└── README.md
```

## Dependencies

- **Jest** (^29.7.0) - Testing framework
- **Axios** (^1.6.0) - HTTP client
- **Chai** (^4.3.10) - Assertion library

## Test Results

Tests generate coverage reports and can be run with:
```bash
npm run test:coverage
```

Coverage includes:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## Contributing

1. Add new test cases following the existing patterns
2. Update test data in JSON files for data-driven tests
3. Add new DTOs for additional API resources
4. Extend fluent assertions for new validation needs
5. Update configuration for new environments

## Future Enhancements

- Add more API endpoints (comments, users)
- Implement authentication testing
- Add performance/load testing capabilities
- Integrate with CI/CD pipelines
- Add test reporting and dashboards