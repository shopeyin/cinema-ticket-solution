import { jest } from "@jest/globals";
import { TICKET_PRICES } from "../src/pairtest/lib/ticketPrices";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import TicketService from "../src/pairtest/TicketService";

import InvalidPurchaseException from "../src/pairtest/lib/errorHandling/InvalidPurchaseException";
import InvalidAccountIDException from "../src/pairtest/lib/errorHandling/InvalidAccountIDException";

// Mock Serices
const mockPaymentService = {
  makePayment: jest.fn(),
};

const mockReservationService = {
  reserveSeat: jest.fn(),
};

describe("TicketService", () => {
  let ticketService;

  beforeEach(() => {
    jest.clearAllMocks();

    ticketService = new TicketService(
      mockPaymentService,
      mockReservationService,
      TICKET_PRICES
    );
  });

  describe("purchaseTickets", () => {
    it("should successfully purchase valid adult tickets", () => {
      const accountId = 1;
      const ticketType = "ADULT";
      const numberOfAdultTickets = 2;

      const result = ticketService.purchaseTickets(
        accountId,
        new TicketTypeRequest(ticketType, numberOfAdultTickets)
      );

      expect(result.totalAmount).toBe(
        numberOfAdultTickets * TICKET_PRICES.ADULT
      );
      expect(result.totalSeats).toBe(numberOfAdultTickets);

      expect(mockPaymentService.makePayment).toHaveBeenCalledWith(
        accountId,
        result.totalAmount
      );

      expect(mockReservationService.reserveSeat).toHaveBeenCalledWith(
        accountId,
        result.totalSeats
      );
    });

    it("should successfully purchase a mix of adult, child and infant tickets", () => {
      const numberOfAdultsTickets = 2;
      const numberOfChildTickets = 1;
      const numberOfInfantTickets = 1;

      const result = ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", numberOfAdultsTickets),
        new TicketTypeRequest("CHILD", numberOfChildTickets),
        new TicketTypeRequest("INFANT", numberOfInfantTickets)
      );

      expect(result.totalAmount).toBe(
        numberOfAdultsTickets * TICKET_PRICES.ADULT +
          numberOfChildTickets * TICKET_PRICES.CHILD +
          numberOfInfantTickets * TICKET_PRICES.INFANT
      );
      expect(result.totalSeats).toBe(3);
    });

    it("should throw error for unknown ticket type", () => {
      const invalidTicket = {
        getTicketType: () => "CIVIL SERVANT",
        getNoOfTickets: () => 1,
      };

      expect(() => {
        ticketService.purchaseTickets(1, invalidTicket);
      }).toThrow(InvalidPurchaseException);
    });

    it("should throw error when ticket count is zero or negative", () => {
      expect(() => {
        ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 0));
      }).toThrow(InvalidPurchaseException);
      expect(() => {
        ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", -1));
      }).toThrow(InvalidPurchaseException);
    });
    it("should not call payment or reservation services when Account Id is invalid", () => {
      expect(() => {
        ticketService.purchaseTickets(0, new TicketTypeRequest("ADULT", 1));
      }).toThrow(InvalidAccountIDException);

      expect(mockPaymentService.makePayment).not.toHaveBeenCalled();
      expect(mockReservationService.reserveSeat).not.toHaveBeenCalled();
    });

    it("should handle exactly 20 tickets correctly", () => {
      const result = ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 20)
      );
      expect(result.totalAmount).toBe(20 * TICKET_PRICES.ADULT);
      expect(result.totalSeats).toBe(20);
    });
    it("should not reserve seats for infant tickets", () => {
      const result = ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("INFANT", 1)
      );
      expect(result.totalSeats).toBe(1);
    });

    it("should merge duplicate ticket types into a single total", () => {
      const result = ticketService.purchaseTickets(
        1,
        new TicketTypeRequest("ADULT", 1),
        new TicketTypeRequest("ADULT", 1)
      );
      expect(result.totalSeats).toBe(2);
      expect(result.totalAmount).toBe(2 * TICKET_PRICES.ADULT);
    });
  });
});
