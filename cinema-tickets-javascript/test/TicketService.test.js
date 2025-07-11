import { jest } from "@jest/globals";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException";
import { TICKET_PRICES } from "../src/pairtest/lib/ticketPrices";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import TicketService from "../src/pairtest/TicketService";

// Mocks
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

    it("should throw error when accountId is invalid", () => {
      expect(() => {
        ticketService.purchaseTickets(0, new TicketTypeRequest("ADULT", 1));
      }).toThrow(InvalidPurchaseException);

      expect(() => {
        ticketService.purchaseTickets(-1, new TicketTypeRequest("ADULT", 1));
      }).toThrow(InvalidPurchaseException);

      expect(() => {
        ticketService.purchaseTickets(
          "invalid",
          new TicketTypeRequest("ADULT", 1)
        );
      }).toThrow(InvalidPurchaseException);
    });

    it("should throw error when more than 25 tickets are requested", () => {
      expect(() => {
        ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 26));
      }).toThrow(InvalidPurchaseException);
    });

    it("should throw error when no adult tickets are purchased", () => {
      expect(() => {
        ticketService.purchaseTickets(1, new TicketTypeRequest("ADULT", 0));
      }).toThrow(InvalidPurchaseException);
    });

    it("should throw error when child tickets are purchased without an adult", () => {
      expect(() => {
        ticketService.purchaseTickets(1, new TicketTypeRequest("CHILD", 1));
      }).toThrow(InvalidPurchaseException);
    });

    it("should throw error when infant tickets is more than adult tickets", () => {
      expect(() => {
        ticketService.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 1),
          new TicketTypeRequest("INFANT", 2)
        );
      }).toThrow(InvalidPurchaseException);
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
  });
});
