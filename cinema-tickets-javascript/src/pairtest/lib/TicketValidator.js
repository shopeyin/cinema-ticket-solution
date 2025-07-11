import InvalidPurchaseException from "./InvalidPurchaseException.js";

export default class TicketValidator {
  static validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException(`Invalid account ID: ${accountId}`);
    }
  }

  static validatePrices(prices) {
    for (const [type, price] of Object.entries(prices)) {
      if (typeof price !== "number" || price < 0) {
        throw new TypeError(
          `Invalid price for ${type}: must be a non-negative number.`
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

    if (childCount > 0 && adultCount === 0) {
      throw new InvalidPurchaseException(
        "Child tickets cannot be purchased without an adult."
      );
    }

    if (infantCount > adultCount) {
      throw new InvalidPurchaseException(
        "Each infant must have a corresponding adult."
      );
    }
  }
}
