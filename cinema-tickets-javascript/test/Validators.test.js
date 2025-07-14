import InvalidAccountIDException from "../src/pairtest/lib/errorException/InvalidAccountIDException";
import InvalidPurchaseException from "../src/pairtest/lib/errorException/InvalidPurchaseException";
import AccountValidator from "../src/pairtest/lib/validators/AccountValidator";
import PriceValidator from "../src/pairtest/lib/validators/PriceValidator";
import TicketRulesValidator from "../src/pairtest/lib/validators/TicketRulesValidator";

describe("Validators", () => {
  describe("validateAccountId", () => {
    it("should accept positive integer account IDs", () => {
      expect(() => AccountValidator.validateAccountId(1)).not.toThrow();
      expect(() => AccountValidator.validateAccountId(100)).not.toThrow();
    });

    it("should reject non-integer account IDs", () => {
      expect(() => AccountValidator.validateAccountId("1")).toThrow(
        InvalidAccountIDException
      );
      expect(() => AccountValidator.validateAccountId(1.5)).toThrow(
        InvalidAccountIDException
      );
      expect(() => AccountValidator.validateAccountId(null)).toThrow(
        InvalidAccountIDException
      );
    });

    it("should reject zero or negative account IDs", () => {
      expect(() => AccountValidator.validateAccountId(0)).toThrow(
        InvalidAccountIDException
      );
      expect(() => AccountValidator.validateAccountId(-1)).toThrow(
        InvalidAccountIDException
      );
    });
  });
  describe("validatePrices", () => {
    it("should throw for non-integer prices", () => {
      const invalidPrices = {
        ADULT: 20,
        CHILD: "10",
        INFANT: null,
      };

      expect(() => PriceValidator.validatePrice(invalidPrices)).toThrow(
        "must be a non-negative integer"
      );
    });

    it("should accept valid integer prices", () => {
      const validPrices = {
        ADULT: 20,
        CHILD: 10,
        INFANT: 0,
      };

      expect(() => PriceValidator.validatePrice(validPrices)).not.toThrow();
    });
  });

  describe("TicketValidator", () => {
    describe("validateTicketRules", () => {
      describe("valid cases", () => {
        it("should accept valid ticket combinations", () => {
          const validCases = [
            { adultCount: 1, childCount: 0, infantCount: 0, totalTickets: 1 },
            { adultCount: 2, childCount: 1, infantCount: 1, totalTickets: 4 },
            { adultCount: 1, childCount: 1, infantCount: 0, totalTickets: 2 },
            { adultCount: 1, childCount: 0, infantCount: 1, totalTickets: 2 },
            {
              adultCount: 10,
              childCount: 10,
              infantCount: 5,
              totalTickets: 25,
            },
          ];

          validCases.forEach((testCase) => {
            expect(() =>
              TicketRulesValidator.validateTicket(testCase)
            ).not.toThrow();
          });
        });
      });

      describe("invalid cases", () => {
        it("should reject negative ticket counts", () => {
          const negativeCases = [
            { adultCount: -1, childCount: 0, infantCount: 0, totalTickets: -1 },
            { adultCount: 0, childCount: -2, infantCount: 0, totalTickets: -2 },
            { adultCount: -1, childCount: -1, infantCount: -1, totalTickets: -3 },
          ];

          negativeCases.forEach((testCase) => {
            expect(() => TicketRulesValidator.validateTicket(testCase)).toThrow(
              "Ticket quantities must be zero or greater. Negative values are not allowed"
            );
          });
        });
        it("should reject mismatched ticket counts", () => {
          const invalidCases = [
            { adultCount: 2, childCount: 1, infantCount: 1, totalTickets: 1 },
            { adultCount: 1, childCount: 1, infantCount: 0, totalTickets: 1 },
            { adultCount: 0, childCount: 0, infantCount: 0, totalTickets: 1 },
          ];

          invalidCases.forEach((testCase) => {
            const calculatedTotal =
              testCase.adultCount + testCase.childCount + testCase.infantCount;
            expect(() => TicketRulesValidator.validateTicket(testCase)).toThrow(
              new InvalidPurchaseException(
                `Ticket count mismatch: expected ${calculatedTotal} but got ${testCase.totalTickets}`
              )
            );
          });
        });

        it("should reject more than 25 tickets", () => {
          expect(() =>
            TicketRulesValidator.validateTicket({
              adultCount: 26,
              childCount: 0,
              infantCount: 0,
              totalTickets: 26,
            })
          ).toThrow("Cannot purchase more than 25 tickets at a time.");
        });

        it("should reject purchases with no adults", () => {
          expect(() =>
            TicketRulesValidator.validateTicket({
              adultCount: 0,
              childCount: 1,
              infantCount: 0,
              totalTickets: 1,
            })
          ).toThrow("At least one adult ticket must be purchased.");
        });

        it("should reject infants exceeding adults", () => {
          expect(() =>
            TicketRulesValidator.validateTicket({
              adultCount: 1,
              childCount: 0,
              infantCount: 2,
              totalTickets: 3,
            })
          ).toThrow("Each infant must have a corresponding adult.");
        });
      });
    });
  });
});
