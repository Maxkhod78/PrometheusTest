/**
 * Data Transfer Object for User entities
 * Represents both request and response data for users
 */
class AddressDTO {
  /**
   * Create an AddressDTO instance
   * @param {string} street - Street address
   * @param {string} suite - Suite/apartment number
   * @param {string} city - City name
   * @param {string} zipcode - ZIP code
   * @param {object} geo - Geographic coordinates
   */
  constructor(street = '', suite = '', city = '', zipcode = '', geo = { lat: '', lng: '' }) {
    this.street = street;
    this.suite = suite;
    this.city = city;
    this.zipcode = zipcode;
    this.geo = geo;
  }

  /**
   * Create AddressDTO from JSON data
   * @param {object} json - JSON object containing address data
   * @returns {AddressDTO} New AddressDTO instance
   */
  static fromJson(json) {
    return new AddressDTO(
      json.street || '',
      json.suite || '',
      json.city || '',
      json.zipcode || '',
      json.geo || { lat: '', lng: '' }
    );
  }

  /**
   * Convert AddressDTO to JSON
   * @returns {object} JSON representation
   */
  toJson() {
    return {
      street: this.street,
      suite: this.suite,
      city: this.city,
      zipcode: this.zipcode,
      geo: this.geo
    };
  }
}

class CompanyDTO {
  /**
   * Create a CompanyDTO instance
   * @param {string} name - Company name
   * @param {string} catchPhrase - Company catch phrase
   * @param {string} bs - Company business description
   */
  constructor(name = '', catchPhrase = '', bs = '') {
    this.name = name;
    this.catchPhrase = catchPhrase;
    this.bs = bs;
  }

  /**
   * Create CompanyDTO from JSON data
   * @param {object} json - JSON object containing company data
   * @returns {CompanyDTO} New CompanyDTO instance
   */
  static fromJson(json) {
    return new CompanyDTO(
      json.name || '',
      json.catchPhrase || '',
      json.bs || ''
    );
  }

  /**
   * Convert CompanyDTO to JSON
   * @returns {object} JSON representation
   */
  toJson() {
    return {
      name: this.name,
      catchPhrase: this.catchPhrase,
      bs: this.bs
    };
  }
}

class UserDTO {
  /**
   * Create a UserDTO instance
   * @param {number} id - User ID
   * @param {string} name - User's full name
   * @param {string} username - User's username
   * @param {string} email - User's email address
   * @param {AddressDTO} address - User's address
   * @param {string} phone - User's phone number
   * @param {string} website - User's website
   * @param {CompanyDTO} company - User's company information
   */
  constructor(id = null, name = '', username = '', email = '', address = null, phone = '', website = '', company = null) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.email = email;
    this.address = address || new AddressDTO();
    this.phone = phone;
    this.website = website;
    this.company = company || new CompanyDTO();
  }

  /**
   * Create UserDTO from JSON data
   * @param {object} json - JSON object containing user data
   * @returns {UserDTO} New UserDTO instance
   */
  static fromJson(json) {
    return new UserDTO(
      json.id || null,
      json.name || '',
      json.username || '',
      json.email || '',
      json.address ? AddressDTO.fromJson(json.address) : null,
      json.phone || '',
      json.website || '',
      json.company ? CompanyDTO.fromJson(json.company) : null
    );
  }

  /**
   * Convert UserDTO to JSON for requests
   * @returns {object} JSON representation excluding null id for POST requests
   */
  toJson() {
    const result = {
      name: this.name,
      username: this.username,
      email: this.email,
      address: this.address.toJson(),
      phone: this.phone,
      website: this.website,
      company: this.company.toJson()
    };

    // Include id only if it exists (for PUT requests)
    if (this.id !== null) {
      result.id = this.id;
    }

    return result;
  }

  /**
   * Validate the UserDTO data
   * @returns {object} Validation result with isValid boolean and errors array
   */
  validate() {
    const errors = [];

    if (typeof this.name !== 'string' || this.name.trim().length === 0) {
      errors.push('name must be a non-empty string');
    }

    if (typeof this.username !== 'string' || this.username.trim().length === 0) {
      errors.push('username must be a non-empty string');
    }

    if (typeof this.email !== 'string' || this.email.trim().length === 0) {
      errors.push('email must be a non-empty string');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('email must be a valid email address');
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
   * Create a copy of the UserDTO with optional property overrides
   * @param {object} overrides - Properties to override
   * @returns {UserDTO} New UserDTO instance
   */
  copy(overrides = {}) {
    return new UserDTO(
      overrides.id !== undefined ? overrides.id : this.id,
      overrides.name !== undefined ? overrides.name : this.name,
      overrides.username !== undefined ? overrides.username : this.username,
      overrides.email !== undefined ? overrides.email : this.email,
      overrides.address !== undefined ? overrides.address : this.address,
      overrides.phone !== undefined ? overrides.phone : this.phone,
      overrides.website !== undefined ? overrides.website : this.website,
      overrides.company !== undefined ? overrides.company : this.company
    );
  }
}

module.exports = { UserDTO, AddressDTO, CompanyDTO };