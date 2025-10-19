const { expect } = require('chai');

/**
 * Fluent assertion helpers for API testing
 * Provides chainable assertions for HTTP responses
 */
class FluentAssertions {
  /**
   * Create a FluentAssertions instance
   * @param {object} actual - The actual response object to assert against
   */
  constructor(actual) {
    this.actual = actual;
  }

  /**
   * Assert that the response has a specific status code
   * @param {number} expectedStatus - Expected HTTP status code
   * @returns {FluentAssertions} This instance for chaining
   */
  toHaveStatus(expectedStatus) {
    expect(this.actual.status).to.equal(expectedStatus, `Expected status ${expectedStatus}, but got ${this.actual.status}`);
    return this;
  }

  /**
   * Assert that the response status is in a range (e.g., 2xx for success)
   * @param {number} minStatus - Minimum status code
   * @param {number} maxStatus - Maximum status code
   * @returns {FluentAssertions} This instance for chaining
   */
  toHaveStatusInRange(minStatus, maxStatus) {
    expect(this.actual.status).to.be.within(minStatus, maxStatus,
      `Expected status between ${minStatus}-${maxStatus}, but got ${this.actual.status}`);
    return this;
  }

  /**
   * Assert that the response has a body
   * @returns {FluentAssertions} This instance for chaining
   */
  toHaveBody() {
    expect(this.actual.data).to.not.be.undefined;
    expect(this.actual.data).to.not.be.null;
    return this;
  }

  /**
   * Assert that the response body is empty
   * @returns {FluentAssertions} This instance for chaining
   */
  toHaveEmptyBody() {
    expect(this.actual.data).to.be.oneOf([null, undefined, '', []]);
    return this;
  }

  /**
   * Assert that the response body has a specific property
   * @param {string} property - Property name to check
   * @returns {FluentAssertions} This instance for chaining
   */
  toHaveProperty(property) {
    expect(this.actual.data).to.have.property(property);
    return this;
  }

  /**
   * Assert that the response body has multiple properties
   * @param {string[]} properties - Array of property names
   * @returns {FluentAssertions} This instance for chaining
   */
  toHaveProperties(properties) {
    properties.forEach(prop => {
      expect(this.actual.data).to.have.property(prop);
    });
    return this;
  }

  /**
   * Assert that the response body matches a schema (basic structure check)
   * @param {object} schema - Expected schema structure
   * @returns {FluentAssertions} This instance for chaining
   */
  toMatchSchema(schema) {
    Object.keys(schema).forEach(key => {
      expect(this.actual.data).to.have.property(key);
      if (typeof schema[key] === 'object' && schema[key] !== null) {
        expect(this.actual.data[key]).to.be.an(typeof schema[key]);
      }
    });
    return this;
  }

  /**
   * Assert that the response body is an array
   * @returns {FluentAssertions} This instance for chaining
   */
  toBeArray() {
    expect(this.actual.data).to.be.an('array');
    return this;
  }

  /**
   * Assert that the response body is an array with specific length
   * @param {number} length - Expected array length
   * @returns {FluentAssertions} This instance for chaining
   */
  toHaveLength(length) {
    expect(this.actual.data).to.have.lengthOf(length);
    return this;
  }

  /**
   * Assert that the response body is an object
   * @returns {FluentAssertions} This instance for chaining
   */
  toBeObject() {
    expect(this.actual.data).to.be.an('object');
    return this;
  }

  /**
   * Assert that the response has specific headers
   * @param {string} headerName - Header name
   * @param {string} headerValue - Expected header value
   * @returns {FluentAssertions} This instance for chaining
   */
  toHaveHeader(headerName, headerValue) {
    expect(this.actual.headers).to.have.property(headerName.toLowerCase());
    if (headerValue !== undefined) {
      expect(this.actual.headers[headerName.toLowerCase()]).to.equal(headerValue);
    }
    return this;
  }

  /**
   * Assert that the response contains specific JSON data
   * @param {object} expectedData - Expected JSON structure
   * @returns {FluentAssertions} This instance for chaining
   */
  toContain(expectedData) {
    expect(this.actual.data).to.deep.include(expectedData);
    return this;
  }

  /**
   * Assert that the response body equals expected data
   * @param {object} expectedData - Expected data
   * @returns {FluentAssertions} This instance for chaining
   */
  toEqual(expectedData) {
    expect(this.actual.data).to.deep.equal(expectedData);
    return this;
  }

  /**
   * Assert that the response time is within acceptable limits
   * @param {number} maxTime - Maximum response time in milliseconds
   * @returns {FluentAssertions} This instance for chaining
   */
  toRespondWithin(maxTime) {
    // Note: This would require timing data from the HTTP client
    // For now, we'll assume response time is available in the response object
    if (this.actual.responseTime !== undefined) {
      expect(this.actual.responseTime).to.be.below(maxTime);
    }
    return this;
  }

  /**
   * Chainable method for fluent API
   * @returns {FluentAssertions} This instance for chaining
   */
  and() {
    return this;
  }

  /**
   * Get the actual response for further custom assertions
   * @returns {object} The actual response object
   */
  getActual() {
    return this.actual;
  }
}

/**
 * Factory function to create fluent assertions
 * @param {object} response - HTTP response object
 * @returns {FluentAssertions} Fluent assertions instance
 */
function expectResponse(response) {
  return new FluentAssertions(response);
}

module.exports = {
  FluentAssertions,
  expectResponse
};