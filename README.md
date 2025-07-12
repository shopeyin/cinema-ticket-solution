# 🎟️ Cinema Ticket Service

A Node.js implementation of a cinema ticket service adhering to DWP's business rules for safe and consistent ticket purchases.

---

## 📦 Project Overview

This service handles ticket purchasing logic for a cinema booking system. It validates ticket requests and integrates with payment and seat reservation systems while strictly enforcing the following business rules.

---

## ✅ Business Rules Enforced

- Maximum of **25 tickets** per transaction  
- **At least 1 adult ticket** is required for any purchase  
- **Child tickets** must be accompanied by **at least 1 adult ticket**  
- **Each infant** must be paired with **one adult** (infants do not require a seat)  
- Ticket pricing:
  - Adult: £25  
  - Child: £15  
  - Infant: £0  

---

## 🗂️ Project Structure
cinema-ticket-solution/
├── cinema-tickets-javascript/
│ ├── src/
│ │ ├── lib/
│ │ ├── thirdparty/
│ │ ├── TicketService.js
│ │ └── index.js <-- Entry point
│ ├── tests/ <-- (If tests exist)
│ ├── package.json
│ └── README.md


---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/shopeyin/cinema-ticket-solution.git
cd cinema-ticket-solution/cinema-tickets-javascript

2. Install dependencies

```bash
npm install

▶️ Running the Service
cd src
node index.js


🧪 Running Tests
1. Install Jest (if not already)
npm install --save-dev jest

2. Add a test script in package.json

"scripts": {
  "test": "jest"
}

3. Run the tests
npm test


