import { describe, expect, it } from "bun:test";
import { Currency, ISO_CURRENCIES, InvalidCurrencyError } from "../src";

describe("Currency", () => {
  describe("Creation", () => {
    it("should create currency from code", () => {
      const usd = new Currency("USD");
      
      expect(usd.code).toBe("USD");
      expect(usd.name).toBe("US Dollar");
      expect(usd.symbol).toBe("$");
      expect(usd.decimalPlaces).toBe(2);
    });

    it("should create currency from lowercase code", () => {
      const usd = new Currency("usd");
      
      expect(usd.code).toBe("USD");
    });

    it("should throw on invalid currency code", () => {
      expect(() => new Currency("XYZ")).toThrow(InvalidCurrencyError);
    });

    it("should create currency using static method", () => {
      const usd = Currency.fromCode("USD");
      
      expect(usd.code).toBe("USD");
      expect(usd.name).toBe("US Dollar");
    });
  });

  describe("ISO Currencies", () => {
    it("should have common currencies defined", () => {
      const commonCurrencies = ["USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD"];
      
      for (const code of commonCurrencies) {
        expect(ISO_CURRENCIES[code]).toBeDefined();
      }
    });

    it("should have correct metadata for currencies", () => {
      expect(ISO_CURRENCIES["USD"].name).toBe("US Dollar");
      expect(ISO_CURRENCIES["EUR"].symbol).toBe("€");
      expect(ISO_CURRENCIES["JPY"].decimalPlaces).toBe(0);
      expect(ISO_CURRENCIES["BHD"].decimalPlaces).toBe(3);
    });
  });

  describe("Equality", () => {
    it("should check equality between currencies", () => {
      const usd1 = new Currency("USD");
      const usd2 = new Currency("USD");
      const eur = new Currency("EUR");
      
      expect(usd1.equals(usd2)).toBe(true);
      expect(usd1.equals(eur)).toBe(false);
    });
  });

  describe("Formatting", () => {
    it("should format amount according to currency", () => {
      const usd = new Currency("USD");
      const formatted = usd.format(1234.56);
      
      expect(formatted).toBe("$1,234.56");
    });

    it("should format with custom options", () => {
      const usd = new Currency("USD");
      const formatted = usd.format(1234.56, {
        symbol: false,
        code: true,
        useGrouping: false,
      });
      
      expect(formatted).toBe("1234.56 USD");
    });

    it("should format with different locales", () => {
      const eur = new Currency("EUR");
      
      // Different locales format numbers differently
      const enUS = eur.format(1234.56, { locale: "en-US" });
      const frFR = eur.format(1234.56, { locale: "fr-FR" });
      
      // We can't assert exact strings due to locale differences,
      // but we can check that they contain the currency symbol
      expect(enUS).toContain("€");
      expect(frFR).toContain("€");
    });

    it("should handle different decimal places", () => {
      const jpy = new Currency("JPY");
      const bhd = new Currency("BHD");
      
      expect(jpy.format(1000)).toBe("¥1,000");
      expect(bhd.format(1.234)).toBe(".د.ب1.234");
    });
  });

  describe("Conversion methods", () => {
    it("should convert between major and minor units", () => {
      const usd = new Currency("USD");
      
      // Major to minor
      expect(usd.toMinorUnits(10.99)).toBe(1099n);
      expect(usd.toMinorUnits("10.99")).toBe(1099n);
      
      // Minor to major
      expect(usd.toMajorUnits(1099n)).toBe("10.99");
    });

    it("should handle currencies with different decimal places", () => {
      const jpy = new Currency("JPY"); // 0 decimal places
      const bhd = new Currency("BHD"); // 3 decimal places
      
      // Major to minor
      expect(jpy.toMinorUnits(1000)).toBe(1000n);
      expect(bhd.toMinorUnits(1.234)).toBe(1234n);
      
      // Minor to major
      expect(jpy.toMajorUnits(1000n)).toBe("1000");
      expect(bhd.toMajorUnits(1234n)).toBe("1.234");
    });

    it("should get decimal factor", () => {
      const usd = new Currency("USD");
      const jpy = new Currency("JPY");
      const bhd = new Currency("BHD");
      
      expect(usd.getDecimalFactor()).toBe(100n);
      expect(jpy.getDecimalFactor()).toBe(1n);
      expect(bhd.getDecimalFactor()).toBe(1000n);
    });
  });
});