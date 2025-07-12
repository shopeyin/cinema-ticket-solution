export default class PriceValidator {
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
