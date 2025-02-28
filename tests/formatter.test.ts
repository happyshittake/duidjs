import { describe, expect, it } from "bun:test";
import {
  Money,
  money,
  formatMoney,
  formatMoneyTable,
  formatAccounting,
  formatFinancial,
} from "../src";

describe("Formatter", () => {
  describe("formatMoney", () => {
    it("should format money with extended options", () => {
      const m = money(1234.56, "USD");
      
      const formatted = formatMoney(m, {
        showPositiveSign: true,
        useGrouping: true,
      });
      
      expect(formatted).toBe("+$1,234.56");
    });

    it("should format with currency name", () => {
      const m = money(1234.56, "USD");
      
      const formatted = formatMoney(m, {
        showCurrencyName: true,
        symbol: false,
      });
      
      expect(formatted).toBe("1,234.56 USD");
    });

    it("should format with custom negative format", () => {
      const m = money(-1234.56, "USD");
      
      const formatted = formatMoney(m, {
        negativeFormat: "(${amount})",
      });
      
      expect(formatted).toBe("($1,234.56)");
    });

    it("should format with custom positive format", () => {
      const m = money(1234.56, "USD");
      
      const formatted = formatMoney(m, {
        positiveFormat: "+${amount}",
      });
      
      expect(formatted).toBe("+$1,234.56");
    });
  });

  describe("formatMoneyTable", () => {
    it("should format a list of money as a table", () => {
      const moneyList = [
        money(1234.56, "USD"),
        money(789.01, "USD"),
        money(-45.67, "USD"),
      ];
      
      const table = formatMoneyTable(moneyList);
      const lines = table.split("\n");
      
      expect(lines.length).toBe(3);
      expect(lines[0]).toBe("$1,234.56");
      expect(lines[1]).toBe("  $789.01");
      expect(lines[2]).toBe("  -$45.67");
    });

    it("should format an empty list", () => {
      const table = formatMoneyTable([]);
      expect(table).toBe("");
    });

    it("should format with custom options", () => {
      const moneyList = [
        money(1234.56, "USD"),
        money(-45.67, "USD"),
      ];
      
      const table = formatMoneyTable(moneyList, {
        negativeFormat: "(${amount})",
        symbol: false,
        code: true,
      });
      
      const lines = table.split("\n");
      
      expect(lines.length).toBe(2);
      expect(lines[0]).toBe("1,234.56 USD");
      expect(lines[1]).toBe(" (45.67 USD)");
    });
  });

  describe("formatAccounting", () => {
    it("should format positive values normally", () => {
      const m = money(1234.56, "USD");
      const formatted = formatAccounting(m);
      
      expect(formatted).toBe("$1,234.56");
    });

    it("should format negative values in parentheses", () => {
      const m = money(-1234.56, "USD");
      const formatted = formatAccounting(m);
      
      expect(formatted).toBe("($1,234.56)");
    });

    it("should format with custom options", () => {
      const m = money(-1234.56, "USD");
      const formatted = formatAccounting(m, {
        symbol: false,
        code: true,
      });
      
      expect(formatted).toBe("(1,234.56 USD)");
    });
  });

  describe("formatFinancial", () => {
    it("should format with positive sign", () => {
      const m = money(1234.56, "USD");
      const formatted = formatFinancial(m);
      
      expect(formatted).toBe("+$1,234.56");
    });

    it("should format negative values with negative sign", () => {
      const m = money(-1234.56, "USD");
      const formatted = formatFinancial(m);
      
      expect(formatted).toBe("-$1,234.56");
    });

    it("should format with custom options", () => {
      const m = money(1234.56, "USD");
      const formatted = formatFinancial(m, {
        symbol: false,
        code: true,
      });
      
      expect(formatted).toBe("+1,234.56 USD");
    });
  });
});