// @ts-check
import InvalidAccountIDException from "../errorException/InvalidAccountIDException.js";

/**
 * Validator for account IDs
 * @class
 * @implements {AccountValidator}
 */
export default class AccountValidator {
  /**
   * Validates an account ID
   * @param {number} accountId
   * @throws {InvalidAccountIDException}
   */
  static validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidAccountIDException(`Invalid account ID: ${accountId}`);
    }
  }
}