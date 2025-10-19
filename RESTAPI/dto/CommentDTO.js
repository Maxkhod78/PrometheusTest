/**
 * Data Transfer Object for Comment entities
 * Represents both request and response data for comments
 */
class CommentDTO {
  /**
   * Create a CommentDTO instance
   * @param {number} id - Comment ID
   * @param {number} postId - Post ID the comment belongs to
   * @param {string} name - Commenter's name
   * @param {string} email - Commenter's email
   * @param {string} body - Comment content
   */
  constructor(id = null, postId = null, name = '', email = '', body = '') {
    this.id = id;
    this.postId = postId;
    this.name = name;
    this.email = email;
    this.body = body;
  }

  /**
   * Create CommentDTO from JSON data
   * @param {object} json - JSON object containing comment data
   * @returns {CommentDTO} New CommentDTO instance
   */
  static fromJson(json) {
    return new CommentDTO(
      json.id || null,
      json.postId || null,
      json.name || '',
      json.email || '',
      json.body || ''
    );
  }

  /**
   * Convert CommentDTO to JSON for requests
   * @returns {object} JSON representation excluding null id for POST requests
   */
  toJson() {
    const result = {
      postId: this.postId,
      name: this.name,
      email: this.email,
      body: this.body
    };

    // Include id only if it exists (for PUT requests)
    if (this.id !== null) {
      result.id = this.id;
    }

    return result;
  }

  /**
   * Validate the CommentDTO data
   * @returns {object} Validation result with isValid boolean and errors array
   */
  validate() {
    const errors = [];

    if (this.postId !== null && (typeof this.postId !== 'number' || this.postId <= 0)) {
      errors.push('postId must be a positive number');
    }

    if (typeof this.name !== 'string' || this.name.trim().length === 0) {
      errors.push('name must be a non-empty string');
    }

    if (typeof this.email !== 'string' || this.email.trim().length === 0) {
      errors.push('email must be a non-empty string');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('email must be a valid email address');
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
   * Simple email validation
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Create a copy of the CommentDTO with optional property overrides
   * @param {object} overrides - Properties to override
   * @returns {CommentDTO} New CommentDTO instance
   */
  copy(overrides = {}) {
    return new CommentDTO(
      overrides.id !== undefined ? overrides.id : this.id,
      overrides.postId !== undefined ? overrides.postId : this.postId,
      overrides.name !== undefined ? overrides.name : this.name,
      overrides.email !== undefined ? overrides.email : this.email,
      overrides.body !== undefined ? overrides.body : this.body
    );
  }
}

module.exports = CommentDTO;