// @ts-check
import { TICKET_PRICES } from "./pairtest/lib/ticketPrices.js";
import TicketTypeRequest from "./pairtest/lib/TicketTypeRequest.js";
import TicketService from "./pairtest/TicketService.js";
import TicketPaymentService from "./thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "./thirdparty/seatbooking/SeatReservationService.js";

// export const PRICES = {
//   INFANT: "a",
//   CHILD: 15,
//   ADULT: 25,
// };

// Inject dependencies
const paymentService = new TicketPaymentService();
const reservationService = new SeatReservationService();

const ticketService = new TicketService(
  paymentService,
  reservationService,
  TICKET_PRICES
);

const tickets = [
  new TicketTypeRequest("ADULT", 2),
  new TicketTypeRequest("CHILD", 1),
  new TicketTypeRequest("INFANT", 1),
];

try {
  const { totalAmount, totalSeats, totalTickets } =
    ticketService.purchaseTickets(1, ...tickets);

  console.log("✅ Tickets purchased successfully!");
  console.log("💰 Total amount to pay:", totalAmount);
  console.log("🪑 Total SEATS to reserve:", totalSeats);
  console.log(" Total TICKETS to reserve:", totalTickets);
} catch (error) {
  console.error(
    "\n===================== ❌ An error occurred ====================="
  );
  console.error("• Name   :", error.name || "UnknownError");
  console.error("• Message:", error.message || "No error message provided");
  console.error("• Stack  :\n", error.stack || "No stack trace available");
  console.error("=================================================\n");
}
