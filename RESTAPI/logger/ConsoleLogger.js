const ILogger = require('./ILogger');

/**
 * Console-based logger implementation
 * Logs messages to the console with timestamps and colors
 */
class ConsoleLogger extends ILogger {
  /**
   * Create a ConsoleLogger instance
   * @param {object} options - Logger options
   * @param {boolean} options.enableColors - Whether to use colors in output
   * @param {boolean} options.enableTimestamps - Whether to include timestamps
   * @param {string} options.level - Minimum log level (debug, info, warn, error)
   */
  constructor(options = {}) {
    super();
    this.enableColors = options.enableColors !== false;
    this.enableTimestamps = options.enableTimestamps !== false;
    this.level = options.level || 'debug';
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  /**
   * Get current timestamp string
   * @returns {string} Formatted timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Get color code for log level
   * @param {string} level - Log level
   * @returns {string} ANSI color code
   */
  getColor(level) {
    if (!this.enableColors) return '';

    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m'  // Red
    };

    return colors[level] || '';
  }

  /**
   * Get reset color code
   * @returns {string} ANSI reset code
   */
  getResetColor() {
    return this.enableColors ? '\x1b[0m' : '';
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {object} meta - Additional metadata
   * @returns {string} Formatted log message
   */
  formatMessage(level, message, meta = {}) {
    let formatted = '';

    if (this.enableTimestamps) {
      formatted += `[${this.getTimestamp()}] `;
    }

    formatted += `${level.toUpperCase()}: ${message}`;

    if (Object.keys(meta).length > 0) {
      formatted += ` ${JSON.stringify(meta)}`;
    }

    return formatted;
  }

  /**
   * Check if log level should be output
   * @param {string} level - Log level to check
   * @returns {boolean} True if level should be logged
   */
  shouldLog(level) {
    return this.levels[level] >= this.levels[this.level];
  }

  /**
   * Log an info message
   * @param {string} message - The message to log
   * @param {object} meta - Additional metadata
   */
  info(message, meta = {}) {
    if (this.shouldLog('info')) {
      const formatted = this.formatMessage('info', message, meta);
      console.log(`${this.getColor('info')}${formatted}${this.getResetColor()}`);
    }
  }

  /**
   * Log a warning message
   * @param {string} message - The message to log
   * @param {object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    if (this.shouldLog('warn')) {
      const formatted = this.formatMessage('warn', message, meta);
      console.warn(`${this.getColor('warn')}${formatted}${this.getResetColor()}`);
    }
  }

  /**
   * Log an error message
   * @param {string} message - The message to log
   * @param {Error} error - The error object
   * @param {object} meta - Additional metadata
   */
  error(message, error = null, meta = {}) {
    if (this.shouldLog('error')) {
      const formatted = this.formatMessage('error', message, meta);
      console.error(`${this.getColor('error')}${formatted}${this.getResetColor()}`);

      if (error) {
        console.error(`${this.getColor('error')}${error.stack}${this.getResetColor()}`);
      }
    }
  }

  /**
   * Log a debug message
   * @param {string} message - The message to log
   * @param {object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    if (this.shouldLog('debug')) {
      const formatted = this.formatMessage('debug', message, meta);
      console.log(`${this.getColor('debug')}${formatted}${this.getResetColor()}`);
    }
  }

  /**
   * Log a general message with specified level
   * @param {string} level - Log level (info, warn, error, debug)
   * @param {string} message - The message to log
   * @param {object} meta - Additional metadata
   */
  log(level, message, meta = {}) {
    switch (level.toLowerCase()) {
      case 'info':
        this.info(message, meta);
        break;
      case 'warn':
        this.warn(message, meta);
        break;
      case 'error':
        this.error(message, null, meta);
        break;
      case 'debug':
        this.debug(message, meta);
        break;
      default:
        this.info(message, meta);
    }
  }
}

module.exports = ConsoleLogger;