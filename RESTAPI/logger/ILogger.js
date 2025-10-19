/**
 * Logger Interface
 * Defines the contract for logging implementations
 */
class ILogger {
  /**
   * Log an info message
   * @param {string} message - The message to log
   * @param {object} meta - Additional metadata
   */
  info(message, meta = {}) {
    throw new Error('info method must be implemented by logger implementation');
  }

  /**
   * Log a warning message
   * @param {string} message - The message to log
   * @param {object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    throw new Error('warn method must be implemented by logger implementation');
  }

  /**
   * Log an error message
   * @param {string} message - The message to log
   * @param {Error} error - The error object
   * @param {object} meta - Additional metadata
   */
  error(message, error = null, meta = {}) {
    throw new Error('error method must be implemented by logger implementation');
  }

  /**
   * Log a debug message
   * @param {string} message - The message to log
   * @param {object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    throw new Error('debug method must be implemented by logger implementation');
  }

  /**
   * Log a general message with specified level
   * @param {string} level - Log level (info, warn, error, debug)
   * @param {string} message - The message to log
   * @param {object} meta - Additional metadata
   */
  log(level, message, meta = {}) {
    throw new Error('log method must be implemented by logger implementation');
  }
}

module.exports = ILogger;