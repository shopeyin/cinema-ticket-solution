// import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
// import TicketValidator from "./lib/TicketValidator.js";
// import AccountValidator from "./lib/AccountValidator.js";
// import PriceValidator from "./lib/PriceValidator.js";

import AccountValidator from "./lib/validators/AccountValidator.js";
import PriceValidator from "./lib/validators/PriceValidator.js";
import TicketRulesValidator from "./lib/validators/TicketRulesValidator.js";

export default class TicketService {
  #paymentService;
  #reservationService;
  #ticketPrices;

  constructor(paymentService, reservationService, ticketPrices) {
    PriceValidator.validatePrice(ticketPrices);

    this.#paymentService = paymentService;
    this.#reservationService = reservationService;
    this.#ticketPrices = ticketPrices;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    AccountValidator.validateAccountId(accountId);
    const {
      totalAmount,
      totalSeats,
      totalTickets,
      adultCount,
      childCount,
      infantCount,
    } = this.#calculateTotals(ticketTypeRequests);

    TicketRulesValidator.validateTicket({
      adultCount,
      childCount,
      infantCount,
      totalTickets,
    });

    this.#paymentService.makePayment(accountId, totalAmount);
    this.#reservationService.reserveSeat(accountId, totalSeats);

    return { totalAmount, totalSeats, totalTickets };
  }

  #calculateTotals(ticketRequests) {
    let totalAmount = 0;
    let totalSeats = 0;
    let totalTickets = 0;
    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;

    for (const ticket of ticketRequests) {
      const type = ticket.getTicketType();
      const count = ticket.getNoOfTickets();

      totalAmount += count * this.#ticketPrices[type];

      switch (type) {
        case "ADULT":
          totalSeats += count;
          adultCount += count;
          break;
        case "CHILD":
          totalSeats += count;
          childCount += count;
          break;
        case "INFANT":
          infantCount += count;
          break;
      }

      totalTickets += count;
    }

    return {
      totalAmount,
      totalSeats,
      totalTickets,
      adultCount,
      childCount,
      infantCount,
    };
  }
}
