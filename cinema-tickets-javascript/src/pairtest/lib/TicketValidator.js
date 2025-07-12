import InvalidAccountIDException from "./InvalidAccountException.js";
import InvalidPurchaseException from "./InvalidPurchaseException.js";

export default class TicketValidator {
  static validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidAccountIDException(`Invalid account ID: ${accountId}`);
    }
  }

  static validatePrices(prices) {
    for (const [type, price] of Object.entries(prices)) {
      if (!Number.isInteger(price) || price < 0) {
        throw new TypeError(
          `Invalid price for ${type}: must be a non-negative integer.`
        );
      }
    }
  }

  static validateTicketRules({
    adultCount,
    childCount,
    infantCount,
    totalTickets,
  }) {
    const calculatedTotal = adultCount + childCount + infantCount;
    if (totalTickets !== calculatedTotal) {
      throw new InvalidPurchaseException(
        `Ticket count mismatch: expected ${calculatedTotal} but got ${totalTickets}`
      );
    }
    if (totalTickets > 25) {
      throw new InvalidPurchaseException(
        "Cannot purchase more than 25 tickets at a time."
      );
    }

    if (adultCount < 1) {
      throw new InvalidPurchaseException(
        "At least one adult ticket must be purchased."
      );
    }

    if (infantCount > adultCount) {
      throw new InvalidPurchaseException(
        "Each infant must have a corresponding adult."
      );
    }
  }
}
