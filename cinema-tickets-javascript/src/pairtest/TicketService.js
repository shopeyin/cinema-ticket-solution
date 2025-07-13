// @ts-check
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import AccountValidator from "./lib/validators/AccountValidator.js";
import PriceValidator from "./lib/validators/PriceValidator.js";
import TicketRulesValidator from "./lib/validators/TicketRulesValidator.js";

/**
 * Main service for handling ticket purchases
 * @class
 */
export default class TicketService {
  #paymentService;
  #reservationService;
  #ticketPrices;

  /**
   * Creates a new TicketService instance
   * @param {TicketPaymentService} paymentService 
   * @param {SeatReservationService} reservationService 
   * @param {TicketPrices} ticketPrices
   * @throws {TypeError} If ticket prices are invalid
   */
  constructor(paymentService, reservationService, ticketPrices) {
    PriceValidator.validatePrice(ticketPrices);
    this.#paymentService = paymentService;
    this.#reservationService = reservationService;
    this.#ticketPrices = ticketPrices;
  }

  /**
   * Purchases tickets and handles payment and seat reservation
   * @param {number} accountId
   * @param {...TicketTypeRequest} ticketTypeRequests
    @returns {{ totalAmount: number, totalSeats: number, totalTickets: number }}
   * @throws {InvalidPurchaseException}
   * @throws {TypeError}
   */

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

  /**
   * @param {Array<TicketTypeRequest>} ticketRequests
    *  * @returns {{
  *   totalAmount: number,
  *   totalSeats: number,
  *   totalTickets: number,
  *   adultCount: number,
  *   childCount: number,
  *   infantCount: number
  * }}
   */

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
