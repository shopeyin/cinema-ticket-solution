/**
 * Custom exception for invalid account IDs
 * @class
 * @extends Error
 */
export default class InvalidAccountIDException extends Error {
  /**
   * Creates a new InvalidAccountIDException
   * @param {string} message - The error message
   */
  constructor(message) {
    super(message);
    this.name = "InvalidAccountIDException";
  }
}
