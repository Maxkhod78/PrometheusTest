/**
 * Test utilities and helper functions for the modular test framework
 */

const fs = require('fs');
const path = require('path');

/**
 * Load test data from JSON file
 * @param {string} filename - Name of the JSON file in the data directory
 * @returns {object|array} Parsed JSON data
 */
function loadTestData(filename) {
  const filePath = path.join(__dirname, '../data', filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found: ${filePath}`);
  }

  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
}

/**
 * Generate random test data for posts
 * @param {object} overrides - Properties to override in the generated data
 * @returns {object} Random post data
 */
function generateRandomPostData(overrides = {}) {
  const titles = [
    'Test Post Title',
    'Another Test Post',
    'Sample Content',
    'Random Post',
    'Generated Test Data'
  ];

  const bodies = [
    'This is a test post body with some content.',
    'Another test post with different content.',
    'Sample post content for testing purposes.',
    'Random content generated for test cases.',
    'Test data body with various information.'
  ];

  return {
    userId: Math.floor(Math.random() * 10) + 1,
    title: titles[Math.floor(Math.random() * titles.length)],
    body: bodies[Math.floor(Math.random() * bodies.length)],
    ...overrides
  };
}

/**
 * Generate random test data for comments
 * @param {number} postId - Post ID the comment belongs to
 * @param {object} overrides - Properties to override
 * @returns {object} Random comment data
 */
function generateRandomCommentData(postId, overrides = {}) {
  const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
  const emails = [
    'john@example.com',
    'jane@example.com',
    'bob@example.com',
    'alice@example.com',
    'charlie@example.com'
  ];

  return {
    postId: postId || Math.floor(Math.random() * 100) + 1,
    name: names[Math.floor(Math.random() * names.length)],
    email: emails[Math.floor(Math.random() * emails.length)],
    body: 'This is a test comment with some content for testing purposes.',
    ...overrides
  };
}

/**
 * Wait for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param {function} fn - Function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise} Result of the function call
 */
async function retryWithBackoff(fn, maxAttempts = 3, initialDelay = 1000) {
  let attempt = 1;

  while (attempt <= maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      const delayMs = initialDelay * Math.pow(2, attempt - 1);
      await delay(delayMs);
      attempt++;
    }
  }
}

/**
 * Validate response against a schema
 * @param {object} response - HTTP response object
 * @param {object} schema - Schema to validate against
 * @returns {object} Validation result
 */
function validateResponseSchema(response, schema) {
  const errors = [];
  const data = response.data;

  function validateObject(obj, schemaObj, path = '') {
    for (const key in schemaObj) {
      const fullPath = path ? `${path}.${key}` : key;

      if (!(key in obj)) {
        errors.push(`Missing property: ${fullPath}`);
        continue;
      }

      const expectedType = schemaObj[key];
      const actualValue = obj[key];
      const actualType = typeof actualValue;

      if (expectedType === 'array' && !Array.isArray(actualValue)) {
        errors.push(`Property ${fullPath} should be an array, got ${actualType}`);
      } else if (expectedType !== 'array' && actualType !== expectedType) {
        errors.push(`Property ${fullPath} should be ${expectedType}, got ${actualType}`);
      } else if (expectedType === 'object' && actualValue !== null) {
        validateObject(actualValue, schemaObj[key], fullPath);
      }
    }
  }

  validateObject(data, schema);

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create test data fixtures for consistent testing
 * @returns {object} Test fixtures
 */
function createTestFixtures() {
  return {
    validPost: {
      userId: 1,
      title: 'Test Post',
      body: 'This is a test post body'
    },

    invalidPost: {
      userId: 'invalid',
      title: '',
      body: null
    },

    validComment: {
      postId: 1,
      name: 'Test User',
      email: 'test@example.com',
      body: 'This is a test comment'
    },

    postSchema: {
      id: 'number',
      userId: 'number',
      title: 'string',
      body: 'string'
    },

    commentSchema: {
      id: 'number',
      postId: 'number',
      name: 'string',
      email: 'string',
      body: 'string'
    }
  };
}

/**
 * Clean up test data (for JSONPlaceholder, this is a no-op since it doesn't persist)
 * @param {Array} createdIds - Array of created resource IDs
 * @returns {Promise} Cleanup promise
 */
async function cleanupTestData(createdIds) {
  // JSONPlaceholder doesn't actually persist data, so cleanup is not needed
  // In a real API, this would delete the created resources
  return Promise.resolve();
}

module.exports = {
  loadTestData,
  generateRandomPostData,
  generateRandomCommentData,
  delay,
  retryWithBackoff,
  validateResponseSchema,
  createTestFixtures,
  cleanupTestData
};