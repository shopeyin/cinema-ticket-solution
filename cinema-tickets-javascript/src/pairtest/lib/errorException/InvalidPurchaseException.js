/**
 * Custom exception for invalid ticket purchases
 * @class
 * @extends Error
 */
export default class InvalidPurchaseException extends Error {
  /**
   * Creates a new InvalidPurchaseException
   * @param {string} message - The error message
   */
  constructor(message) {
    super(message);
    this.name = "InvalidPurchaseException";
  }
}
