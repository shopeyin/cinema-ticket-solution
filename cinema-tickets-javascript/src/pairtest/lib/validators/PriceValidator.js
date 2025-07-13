// @ts-check

/**
 * Validator for ticket prices
 * @class
 */
export default class PriceValidator {
  /**
   * Validates ticket prices
   * @static
   * @param {TicketPrices} prices
   * @throws {TypeError}
   */
  static validatePrice(prices) {
    for (const [type, price] of Object.entries(prices)) {
      if (!Number.isInteger(price) || price < 0) {
        throw new TypeError(
          `Invalid price for ${type}: must be a non-negative integer.`
        );
      }
    }
  }
}
