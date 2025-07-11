import { TICKET_PRICES } from "./pairtest/lib/ticketPrices.js";
import TicketTypeRequest from "./pairtest/lib/TicketTypeRequest.js";
import TicketService from "./pairtest/TicketService.js";
import TicketPaymentService from "./thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "./thirdparty/seatbooking/SeatReservationService.js";

// Inject dependencies
const paymentService = new TicketPaymentService();
const reservationService = new SeatReservationService();

const ticketService = new TicketService(
  paymentService,
  reservationService,
  TICKET_PRICES
);

// Valid purchase
const t1 = new TicketTypeRequest("ADULT", 2);
const t2 = new TicketTypeRequest("CHILD", 1);
const t3 = new TicketTypeRequest("INFANT", 1);

//NO ADULT
// const t1 = new TicketTypeRequest("CHILD", 3);
// const t2 = new TicketTypeRequest("INFANT", 1);

//More than 25 tickets
// const t1 = new TicketTypeRequest("ADULT", 2);
// const t2 = new TicketTypeRequest("CHILD", 2);
// const t3 = new TicketTypeRequest("INFANT", 32);

// INVALID ID
//const t1 = new TicketTypeRequest("ADULT", 1);

// ONLY ADULTS
//const t1 = new TicketTypeRequest('ADULT', 3);

//ONLY INFANT
//const t10 = new TicketTypeRequest("INFANT", 2);

//ONLY CHILD
//const t1 = new TicketTypeRequest("CHILD", 2);
try {
  const { totalAmount, totalSeats } = ticketService.purchaseTickets(
    1,
    t1,
    t2,
    t3
  );

  console.log("✅ Tickets purchased successfully!");
  console.log("💰 Total amount to pay:", totalAmount); // e.g. 2*25 + 1*15 = 65
  console.log("🪑 Total seats to reserve:", totalSeats);

  //   // NO ADULT
  //ticketService.purchaseTickets(1, t1, t2);
  //MORE than 25 tickets
  //   const { totalAmount, totalSeats } = ticketService.purchaseTickets(
  //     1,
  //     t1,
  //     t2,
  //     t3
  //   );
  //   console.log("💰 Total amount to pay:", totalAmount);
  // console.log("🪑 Total seats to reserve:", totalSeats);

  //INVALID ID
  //ticketService.purchaseTickets("a", t1);

  //ONLY ADULTS
  //   ticketService.purchaseTickets(10, t1);
  //   console.log("✅ Tickets purchased successfully!");
  //ONLY INFANT
  // ticketService.purchaseTickets(1, t10); // ❌ Should fail
  //ONLY CHILD
  //ticketService.purchaseTickets(1, t1); // ❌ Should fail
} catch (error) {
  console.error(
    "\n===================== ❌ An error occurred ====================="
  );

  console.error("• Name   :", error.name || "UnknownError");
  console.error("• Message:", error.message || "No error message provided");
  console.error("• Stack  :\n", error.stack || "No stack trace available");
  console.error("=================================================\n");
}
