import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketValidator from "./lib/TicketValidator.js";

export default class TicketService {
  #paymentService;
  #reservationService;
  #ticketPrices;

  constructor(paymentService, reservationService, ticketPrices) {
    TicketValidator.validatePrices(ticketPrices);

    this.#paymentService = paymentService;
    this.#reservationService = reservationService;
    this.#ticketPrices = ticketPrices;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    TicketValidator.validateAccountId(accountId);

    const {
      totalAmount,
      totalSeats,
      totalTickets,
      adultCount,
      childCount,
      infantCount,
    } = this.#calculateTotals(ticketTypeRequests);

    TicketValidator.validateTicketRules({
      adultCount,
      childCount,
      infantCount,
      totalTickets,
    });

    this.#paymentService.makePayment(accountId, totalAmount);
    this.#reservationService.reserveSeat(accountId, totalSeats);

    return { totalAmount, totalSeats };
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

      if (!this.#ticketPrices.hasOwnProperty(type)) {
        throw new InvalidPurchaseException(`Unknown ticket type: ${type}`);
      }

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
