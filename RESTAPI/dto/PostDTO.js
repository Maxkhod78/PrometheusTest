/**
 * Data Transfer Object for Post entities
 * Represents both request and response data for posts
 */
class PostDTO {
  /**
   * Create a PostDTO instance
   * @param {number} id - Post ID
   * @param {number} userId - User ID who created the post
   * @param {string} title - Post title
   * @param {string} body - Post content
   */
  constructor(id = null, userId = null, title = '', body = '') {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.body = body;
  }

  /**
   * Create PostDTO from JSON data
   * @param {object} json - JSON object containing post data
   * @returns {PostDTO} New PostDTO instance
   */
  static fromJson(json) {
    return new PostDTO(
      json.id || null,
      json.userId || null,
      json.title || '',
      json.body || ''
    );
  }

  /**
   * Convert PostDTO to JSON for requests
   * @returns {object} JSON representation excluding null id for POST requests
   */
  toJson() {
    const result = {
      userId: this.userId,
      title: this.title,
      body: this.body
    };

    // Include id only if it exists (for PUT requests)
    if (this.id !== null) {
      result.id = this.id;
    }

    return result;
  }

  /**
   * Validate the PostDTO data
   * @returns {object} Validation result with isValid boolean and errors array
   */
  validate() {
    const errors = [];

    if (this.userId !== null && (typeof this.userId !== 'number' || this.userId <= 0)) {
      errors.push('userId must be a positive number');
    }

    if (typeof this.title !== 'string' || this.title.trim().length === 0) {
      errors.push('title must be a non-empty string');
    }

    if (typeof this.body !== 'string' || this.body.trim().length === 0) {
      errors.push('body must be a non-empty string');
    }

    if (this.id !== null && (typeof this.id !== 'number' || this.id <= 0)) {
      errors.push('id must be a positive number if provided');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a copy of the PostDTO with optional property overrides
   * @param {object} overrides - Properties to override
   * @returns {PostDTO} New PostDTO instance
   */
  copy(overrides = {}) {
    return new PostDTO(
      overrides.id !== undefined ? overrides.id : this.id,
      overrides.userId !== undefined ? overrides.userId : this.userId,
      overrides.title !== undefined ? overrides.title : this.title,
      overrides.body !== undefined ? overrides.body : this.body
    );
  }
}

module.exports = PostDTO;