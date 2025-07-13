
import InvalidPurchaseException from "../errorException/InvalidPurchaseException.js";


export default class TicketRulesValidator {

  static validateTicket(params) {
    const { adultCount, childCount, infantCount, totalTickets } = params;
    {
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
}
