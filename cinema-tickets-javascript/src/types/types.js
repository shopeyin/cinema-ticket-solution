// @ts-check

/**
 * * Ticket price structure definition
 * @typedef {Object} TicketPrices
 * @property {number} INFANT 
 * @property {number} CHILD 
 * @property {number} ADULT 
 */

/**
 * @typedef {Object} TotalsResult
 * @property {number} totalAmount
 * @property {number} totalSeats
 * @property {number} totalTickets
 * @property {number} adultCount
 * @property {number} childCount
 * @property {number} infantCount
 */

/**
 * Account validator 
 * @typedef {Object} AccountValidator
* @property {function(number): void} validateAccountId

 */


/**
 * Result returned after a ticket purchase
 * @typedef {Object} PurchaseResult
 * @property {number} totalAmount 
 * @property {number} totalSeats 
 * @property {number} totalTickets 
 */


/**
 * Parameters for validating ticket rules
 * @typedef {Object} TicketValidationParams
 * @property {number} adultCount 
 * @property {number} childCount 
 * @property {number} infantCount 
 * @property {number} totalTickets 
 */

/**
 * Custom error for invalid account IDs
 * @typedef {Error} InvalidAccountIDException
 * @property {string} message - Error message
 */


// export {}; 