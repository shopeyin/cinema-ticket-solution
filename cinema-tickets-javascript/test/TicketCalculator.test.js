import TicketCalculator from "../src/pairtest/lib/TicketCalculator";

describe("TicketCalculator", () => {
  const ticketPrices = {
    ADULT: 20,
    CHILD: 10,
    INFANT: 0,
  };

  const MockTicketRequest = (type, count) => ({
    getTicketType: () => type,
    getNoOfTickets: () => count,
  });

  it("should correctly calculate totals for a mix of tickets", () => {
    const ticketRequests = [
      MockTicketRequest("ADULT", 2),
      MockTicketRequest("CHILD", 3),
      MockTicketRequest("INFANT", 1),
    ];

    const calculator = new TicketCalculator(ticketPrices);
    const result = calculator.calculate(ticketRequests);

    expect(result).toEqual({
      totalAmount: 70,
      totalSeats: 5,
      totalTickets: 6,
      adultCount: 2,
      childCount: 3,
      infantCount: 1,
    });
  });

  it("should return zeros for empty ticket list", () => {
    const calculator = new TicketCalculator(ticketPrices);
    const result = calculator.calculate([]);

    expect(result).toEqual({
      totalAmount: 0,
      totalSeats: 0,
      totalTickets: 0,
      adultCount: 0,
      childCount: 0,
      infantCount: 0,
    });
  });

  it("should handle only infant tickets correctly", () => {
    const ticketRequests = [MockTicketRequest("INFANT", 2)];

    const calculator = new TicketCalculator(ticketPrices);
    const result = calculator.calculate(ticketRequests);

    expect(result).toEqual({
      totalAmount: 0,
      totalSeats: 0,
      totalTickets: 2,
      adultCount: 0,
      childCount: 0,
      infantCount: 2,
    });
  });
});
