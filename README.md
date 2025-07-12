# Cinema Ticket Purchasing System

A Node.js implementation of a ticket service adhering to DWP's business rules for cinema ticket purchases.

## Implementation Overview

- **Core Logic**: Processes ticket purchases while enforcing all business rules
- **Services**: Integrates with payment and seat reservation systems
- **Validation**: Strict input checking and error handling

## Business Rules Enforced

✔ Maximum 25 tickets per transaction  
✔ Infant tickets (free, no seat) require Adult tickets  
✔ Child tickets require at least one Adult ticket  
✔ Correct pricing: Adult (£25), Child (£15), Infant (£0)  
✔ Proper seat allocation (Infants don't occupy seats)
