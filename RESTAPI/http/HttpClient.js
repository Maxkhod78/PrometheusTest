const axios = require('axios');
const { getEnvironmentConfig } = require('../config/config');
const ConsoleLogger = require('../logger/ConsoleLogger');

/**
 * HTTP Client wrapper with configuration and logging
 * Provides a unified interface for making HTTP requests with automatic config injection
 */
class HttpClient {
  /**
   * Create an HttpClient instance
   * @param {object} config - Configuration object
   * @param {ILogger} logger - Logger instance
   */
  constructor(config = null, logger = null) {
    this.config = config || getEnvironmentConfig();
    this.logger = logger || new ConsoleLogger();

    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: this.config.headers
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (request) => {
        this.logger.debug(`Making ${request.method?.toUpperCase()} request to ${request.url}`, {
          headers: request.headers,
          data: request.data
        });
        return request;
      },
      (error) => {
        this.logger.error('Request error', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(`Received ${response.status} response from ${response.config.url}`, {
          status: response.status,
          headers: response.headers,
          dataSize: JSON.stringify(response.data).length
        });
        return response;
      },
      (error) => {
        this.logger.error(`HTTP Error: ${error.response?.status || 'Unknown'}`, error, {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a GET request
   * @param {string} url - Request URL
   * @param {object} config - Additional axios config
   * @returns {Promise} Axios response promise
   */
  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  /**
   * Make a POST request
   * @param {string} url - Request URL
   * @param {object} data - Request data
   * @param {object} config - Additional axios config
   * @returns {Promise} Axios response promise
   */
  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  /**
   * Make a PUT request
   * @param {string} url - Request URL
   * @param {object} data - Request data
   * @param {object} config - Additional axios config
   * @returns {Promise} Axios response promise
   */
  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  /**
   * Make a PATCH request
   * @param {string} url - Request URL
   * @param {object} data - Request data
   * @param {object} config - Additional axios config
   * @returns {Promise} Axios response promise
   */
  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }

  /**
   * Make a DELETE request
   * @param {string} url - Request URL
   * @param {object} config - Additional axios config
   * @returns {Promise} Axios response promise
   */
  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  /**
   * Make a HEAD request
   * @param {string} url - Request URL
   * @param {object} config - Additional axios config
   * @returns {Promise} Axios response promise
   */
  async head(url, config = {}) {
    return this.client.head(url, config);
  }

  /**
   * Make a OPTIONS request
   * @param {string} url - Request URL
   * @param {object} config - Additional axios config
   * @returns {Promise} Axios response promise
   */
  async options(url, config = {}) {
    return this.client.options(url, config);
  }

  /**
   * Set default headers for all requests
   * @param {object} headers - Headers to set
   */
  setDefaultHeaders(headers) {
    Object.assign(this.client.defaults.headers.common, headers);
    this.logger.debug('Updated default headers', headers);
  }

  /**
   * Set authorization header
   * @param {string} token - Authorization token
   * @param {string} type - Token type (Bearer, Basic, etc.)
   */
  setAuthorization(token, type = 'Bearer') {
    this.client.defaults.headers.common['Authorization'] = `${type} ${token}`;
    this.logger.debug('Set authorization header', { type });
  }

  /**
   * Clear authorization header
   */
  clearAuthorization() {
    delete this.client.defaults.headers.common['Authorization'];
    this.logger.debug('Cleared authorization header');
  }

  /**
   * Update base URL
   * @param {string} baseUrl - New base URL
   */
  setBaseUrl(baseUrl) {
    this.client.defaults.baseURL = baseUrl;
    this.logger.debug('Updated base URL', { baseUrl });
  }

  /**
   * Get current configuration
   * @returns {object} Current config
   */
  getConfig() {
    return {
      baseUrl: this.client.defaults.baseURL,
      timeout: this.client.defaults.timeout,
      headers: { ...this.client.defaults.headers.common }
    };
  }
}

module.exports = HttpClient;