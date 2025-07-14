export default class TicketService {
  #paymentService;
  #reservationService;
  #calculator;
  #accountValidator;
  #ticketRulesValidator;

  constructor({
    paymentService,
    reservationService,
    calculator,
    accountValidator,
    priceValidator,
    ticketRulesValidator,
    ticketPrices,
  }) {
    priceValidator.validatePrice(ticketPrices);

    this.#paymentService = paymentService;
    this.#reservationService = reservationService;
    this.#calculator = calculator;
    this.#accountValidator = accountValidator;
    this.#ticketRulesValidator = ticketRulesValidator;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    this.#accountValidator.validateAccountId(accountId);

    const totals = this.#calculator.calculate(ticketTypeRequests);

    this.#ticketRulesValidator.validateTicket({
      adultCount: totals.adultCount,
      childCount: totals.childCount,
      infantCount: totals.infantCount,
      totalTickets: totals.totalTickets,
    });

    this.#paymentService.makePayment(accountId, totals.totalAmount);
    this.#reservationService.reserveSeat(accountId, totals.totalSeats);

    return {
      totalAmount: totals.totalAmount,
      totalSeats: totals.totalSeats,
      totalTickets: totals.totalTickets,
    };
  }
}
