import InvalidAccountIDException from "../src/pairtest/lib/InvalidAccountException";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException";
import TicketValidator from "../src/pairtest/lib/TicketValidator";

describe("TicketValidator", () => {
  describe("validateAccountId", () => {
    it("should accept positive integer account IDs", () => {
      expect(() => TicketValidator.validateAccountId(1)).not.toThrow();
      expect(() => TicketValidator.validateAccountId(100)).not.toThrow();
    });

    it("should reject non-integer account IDs", () => {
      expect(() => TicketValidator.validateAccountId("1")).toThrow(
        InvalidAccountIDException
      );
      expect(() => TicketValidator.validateAccountId(1.5)).toThrow(
        InvalidAccountIDException
      );
      expect(() => TicketValidator.validateAccountId(null)).toThrow(
        InvalidAccountIDException
      );
    });

    it("should reject zero or negative account IDs", () => {
      expect(() => TicketValidator.validateAccountId(0)).toThrow(
        InvalidAccountIDException
      );
      expect(() => TicketValidator.validateAccountId(-1)).toThrow(
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

      expect(() => TicketValidator.validatePrices(invalidPrices)).toThrow(
        "must be a non-negative integer"
      );
    });

    it("should accept valid integer prices", () => {
      const validPrices = {
        ADULT: 20,
        CHILD: 10,
        INFANT: 0,
      };

      expect(() => TicketValidator.validatePrices(validPrices)).not.toThrow();
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
              TicketValidator.validateTicketRules(testCase)
            ).not.toThrow();
          });
        });
      });

      describe("invalid cases", () => {
        it("should reject mismatched ticket counts", () => {
          const invalidCases = [
            { adultCount: 2, childCount: 1, infantCount: 1, totalTickets: 1 },
            { adultCount: 1, childCount: 1, infantCount: 0, totalTickets: 1 },
            { adultCount: 0, childCount: 0, infantCount: 0, totalTickets: 1 },
          ];

          invalidCases.forEach((testCase) => {
            const calculatedTotal =
              testCase.adultCount + testCase.childCount + testCase.infantCount;
            expect(() => TicketValidator.validateTicketRules(testCase)).toThrow(
              new InvalidPurchaseException(
                `Ticket count mismatch: expected ${calculatedTotal} but got ${testCase.totalTickets}`
              )
            );
          });
        });

        it("should reject more than 25 tickets", () => {
          expect(() =>
            TicketValidator.validateTicketRules({
              adultCount: 26,
              childCount: 0,
              infantCount: 0,
              totalTickets: 26,
            })
          ).toThrow("Cannot purchase more than 25 tickets at a time.");
        });

        it("should reject purchases with no adults", () => {
          expect(() =>
            TicketValidator.validateTicketRules({
              adultCount: 0,
              childCount: 1,
              infantCount: 0,
              totalTickets: 1,
            })
          ).toThrow("At least one adult ticket must be purchased.");
        });
       

        it("should reject infants exceeding adults", () => {
          expect(() =>
            TicketValidator.validateTicketRules({
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
