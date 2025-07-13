import InvalidAccountIDException from "../errorException/InvalidAccountIDException.js";

export default class AccountValidator {

  static validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidAccountIDException(`Invalid account ID: ${accountId}`);
    }
  }
}
