// @ts-check
import InvalidAccountIDException from "../errorException/InvalidAccountIDException.js";

/**
 * Validator for account IDs
 * @class
 */
export default class AccountValidator {
  /**
   * Validates an account ID
   * @static
   * @param {number} accountId 
   * @throws {InvalidAccountIDException} 
   */
  static validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidAccountIDException(`Invalid account ID: ${accountId}`);
    }
  }
}
