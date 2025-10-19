/**
 * Configuration module for the test framework
 * Manages base URLs, headers, timeouts, and other global settings
 */

const config = {
  // Base URL for the API
  baseUrl: 'https://jsonplaceholder.typicode.com',

  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'ModularTestFramework/1.0.0'
  },

  // Request timeout in milliseconds
  timeout: 10000,

  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000
  },

  // Environment-specific configurations
  environments: {
    development: {
      baseUrl: 'https://jsonplaceholder.typicode.com',
      timeout: 15000
    },
    staging: {
      baseUrl: 'https://jsonplaceholder-staging.typicode.com',
      timeout: 10000
    },
    production: {
      baseUrl: 'https://jsonplaceholder.typicode.com',
      timeout: 5000
    }
  }
};

/**
 * Get configuration for a specific environment
 * @param {string} environment - The environment name (development, staging, production)
 * @returns {object} Environment-specific configuration merged with base config
 */
function getEnvironmentConfig(environment = 'development') {
  const envConfig = config.environments[environment] || config.environments.development;

  return {
    ...config,
    ...envConfig,
    headers: {
      ...config.headers,
      ...envConfig.headers
    }
  };
}

/**
 * Get the current environment from environment variables or default to development
 * @returns {string} Current environment name
 */
function getCurrentEnvironment() {
  return process.env.NODE_ENV || process.env.TEST_ENV || 'development';
}

module.exports = {
  config,
  getEnvironmentConfig,
  getCurrentEnvironment
};