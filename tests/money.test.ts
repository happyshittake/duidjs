import { describe, expect, it } from "bun:test";
import {
  Money,
  Currency,
  money,
  moneyFromString,
  moneyFromMinorUnits,
  moneyFromBigInt,
  zero,
  formatMoney,
  formatAccounting,
  CurrencyMismatchError,
  InvalidAmountError,
  InvalidOperationError,
  RoundingMode,
} from "../src";

describe("Money", () => {
  describe("Creation", () => {
    it("should create money from float", () => {
      const m = money(10.99, "USD");
      expect(m.getAmount()).toBe("10.99");
      expect(m.currency.code).toBe("USD");
    });

    it("should create money from string", () => {
      const m = moneyFromString("10.99", "USD");
      expect(m.getAmount()).toBe("10.99");
      expect(m.currency.code).toBe("USD");
    });

    it("should create money from minor units", () => {
      const m = moneyFromMinorUnits(1099, "USD");
      expect(m.getAmount()).toBe("10.99");
      expect(m.currency.code).toBe("USD");
    });

    it("should create money from BigInt", () => {
      const m = moneyFromBigInt(1099n, "USD");
      expect(m.getAmount()).toBe("10.99");
      expect(m.currency.code).toBe("USD");
    });

    it("should create zero money", () => {
      const m = zero("USD");
      expect(m.getAmount()).toBe("0.00");
      expect(m.currency.code).toBe("USD");
    });

    it("should handle different decimal places", () => {
      // JPY has 0 decimal places
      const yen = money(1000, "JPY");
      expect(yen.getAmount()).toBe("1000");
      
      // BHD has 3 decimal places
      const dinar = money(1.234, "BHD");
      expect(dinar.getAmount()).toBe("1.234");
    });
  });

  describe("Operations", () => {
    it("should add money", () => {
      const a = money(10.5, "USD");
      const b = money(4.75, "USD");
      const result = a.add(b);
      
      expect(result.getAmount()).toBe("15.25");
      expect(result.currency.code).toBe("USD");
    });

    it("should subtract money", () => {
      const a = money(10.5, "USD");
      const b = money(4.75, "USD");
      const result = a.subtract(b);
      
      expect(result.getAmount()).toBe("5.75");
      expect(result.currency.code).toBe("USD");
    });

    it("should multiply money by number", () => {
      const m = money(10.5, "USD");
      const result = m.multiply(3);
      
      expect(result.getAmount()).toBe("31.50");
      expect(result.currency.code).toBe("USD");
    });

    it("should multiply money by decimal", () => {
      const m = money(10, "USD");
      const result = m.multiply(0.1);
      
      expect(result.getAmount()).toBe("1.00");
      expect(result.currency.code).toBe("USD");
    });

    it("should divide money by number", () => {
      const m = money(10.5, "USD");
      const result = m.divide(3);
      
      expect(result.getAmount()).toBe("3.50");
      expect(result.currency.code).toBe("USD");
    });
    
    it("should respect rounding when dividing", () => {
      // Test with 3 decimal places (BHD)
      const m1 = money(10, "BHD");
      const result1 = m1.divide(7);
      expect(result1.getAmount()).toBe("1.429"); // Rounded to 3 decimal places
      expect(result1.getAmountInMinorUnits()).toBe(1429n);
      
      // Test with 2 decimal places (USD)
      const m2 = money(10, "USD");
      const result2 = m2.divide(7);
      expect(result2.getAmount()).toBe("1.43"); // Rounded to 2 decimal places
      expect(result2.getAmountInMinorUnits()).toBe(143n);
      
      // Test with different rounding modes
      const m3 = money(10, "USD");
      const result3 = m3.divide(7, RoundingMode.FLOOR);
      expect(result3.getAmount()).toBe("1.42"); // Floor rounding
      
      const m4 = money(10, "USD");
      const result4 = m4.divide(7, RoundingMode.CEILING);
      expect(result4.getAmount()).toBe("1.43"); // Ceiling rounding
    });

    it("should calculate ratio between money values", () => {
      const a = money(25, "USD");
      const b = money(100, "USD");
      const ratio = a.ratioTo(b);
      
      expect(ratio).toBeCloseTo(0.25);
    });

    it("should calculate ratio with decimal precision", () => {
      const a = money(1, "USD");
      const b = money(3, "USD");
      const ratio = a.ratioTo(b);
      
      expect(ratio).toBeCloseTo(0.3333333, 6);
    });

    it("should handle zero numerator in ratio", () => {
      const a = money(0, "USD");
      const b = money(100, "USD");
      const ratio = a.ratioTo(b);
      
      expect(ratio).toBe(0);
    });

    it("should get absolute value", () => {
      const m = money(-10.5, "USD");
      const result = m.absolute();
      
      expect(result.getAmount()).toBe("10.50");
      expect(result.currency.code).toBe("USD");
    });

    it("should get negative value", () => {
      const m = money(10.5, "USD");
      const result = m.negative();
      
      expect(result.getAmount()).toBe("-10.50");
      expect(result.currency.code).toBe("USD");
    });
  });

  describe("Comparison", () => {
    it("should check equality", () => {
      const a = money(10.5, "USD");
      const b = money(10.5, "USD");
      const c = money(10.51, "USD");
      
      expect(a.equals(b)).toBe(true);
      expect(a.equals(c)).toBe(false);
    });

    it("should compare money", () => {
      const a = money(10.5, "USD");
      const b = money(10.6, "USD");
      
      expect(a.lessThan(b)).toBe(true);
      expect(a.greaterThan(b)).toBe(false);
      expect(a.lessThanOrEqual(b)).toBe(true);
      expect(b.greaterThanOrEqual(a)).toBe(true);
    });

    it("should check if money is zero", () => {
      const a = money(0, "USD");
      const b = money(10.5, "USD");
      
      expect(a.isZero()).toBe(true);
      expect(b.isZero()).toBe(false);
    });

    it("should check if money is positive", () => {
      const a = money(10.5, "USD");
      const b = money(-10.5, "USD");
      
      expect(a.isPositive()).toBe(true);
      expect(b.isPositive()).toBe(false);
    });

    it("should check if money is negative", () => {
      const a = money(10.5, "USD");
      const b = money(-10.5, "USD");
      
      expect(a.isNegative()).toBe(false);
      expect(b.isNegative()).toBe(true);
    });
  });

  describe("Allocation", () => {
    it("should allocate money according to ratios", () => {
      const m = money(10, "USD");
      const allocated = m.allocate([1, 1, 1]);
      
      expect(allocated.length).toBe(3);
      expect(allocated[0].getAmount()).toBe("3.34");
      expect(allocated[1].getAmount()).toBe("3.33");
      expect(allocated[2].getAmount()).toBe("3.33");
      
      // Sum should equal original amount
      const sum = allocated.reduce((acc, val) => acc.add(val), zero("USD"));
      expect(sum.equals(m)).toBe(true);
    });

    it("should distribute money into equal parts", () => {
      const m = money(10, "USD");
      const distributed = m.distribute(3);
      
      expect(distributed.length).toBe(3);
      expect(distributed[0].getAmount()).toBe("3.34");
      expect(distributed[1].getAmount()).toBe("3.33");
      expect(distributed[2].getAmount()).toBe("3.33");
      
      // Sum should equal original amount
      const sum = distributed.reduce((acc, val) => acc.add(val), zero("USD"));
      expect(sum.equals(m)).toBe(true);
    });
  });

  describe("Formatting", () => {
    it("should format money with default options", () => {
      const m = money(1234.56, "USD");
      const formatted = m.format();
      
      expect(formatted).toBe("$1,234.56");
    });

    it("should format money with custom options", () => {
      const m = money(1234.56, "USD");
      const formatted = m.format({
        symbol: false,
        code: true,
        useGrouping: false,
      });
      
      expect(formatted).toBe("1234.56 USD");
    });

    it("should format money as accounting", () => {
      const positive = money(1234.56, "USD");
      const negative = money(-1234.56, "USD");
      
      expect(formatAccounting(positive)).toBe("$1,234.56");
      expect(formatAccounting(negative)).toBe("($1,234.56)");
    });
  });

  describe("Error handling", () => {
    it("should throw on currency mismatch", () => {
      const usd = money(10, "USD");
      const eur = money(10, "EUR");
      
      expect(() => usd.add(eur)).toThrow(CurrencyMismatchError);
      expect(() => usd.subtract(eur)).toThrow(CurrencyMismatchError);
      expect(() => usd.greaterThan(eur)).toThrow(CurrencyMismatchError);
      expect(() => usd.ratioTo(eur)).toThrow(CurrencyMismatchError);
    });

    it("should throw on invalid amount", () => {
      expect(() => money(NaN, "USD")).toThrow(InvalidAmountError);
      expect(() => money(Infinity, "USD")).toThrow(InvalidAmountError);
    });
    
    it("should throw on division by zero in ratioTo", () => {
      const a = money(10, "USD");
      const zero = money(0, "USD");
      
      expect(() => a.ratioTo(zero)).toThrow(InvalidOperationError);
    });
  });
});