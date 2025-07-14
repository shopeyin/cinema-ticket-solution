

export default class TicketCalculator {
    constructor(ticketPrices) {
      this.ticketPrices = ticketPrices;
    }
  
    calculate(ticketRequests) {
      let totalAmount = 0;
      let totalSeats = 0;
      let totalTickets = 0;
      let adultCount = 0;
      let childCount = 0;
      let infantCount = 0;
  
      for (const ticket of ticketRequests) {
        const type = ticket.getTicketType();
        const count = ticket.getNoOfTickets();
  
        totalAmount += count * this.ticketPrices[type];
    
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
  