import { describe, expect, it } from "bun:test";
import {
  Currency,
  ISO_CURRENCIES,
  InvalidCurrencyError,
  customCurrency,
  Money,
  CurrencyCode,
  money,
  moneyFromString,
  moneyFromMinorUnits,
  moneyFromBigInt,
  zero
} from "../src";
import type { CurrencyMetadata } from "../src";

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

  describe("Custom Currencies", () => {
    it("should create currency from metadata using fromMetadata", () => {
      const btc = Currency.fromMetadata({
        code: 'BTC',
        name: 'Bitcoin',
        symbol: '₿',
        decimalPlaces: 8
      });
      
      expect(btc.code).toBe("BTC");
      expect(btc.name).toBe("Bitcoin");
      expect(btc.symbol).toBe("₿");
      expect(btc.decimalPlaces).toBe(8);
    });

    it("should create currency using type-safe enum with from method", () => {
      const usd = Currency.from(CurrencyCode.USD);
      
      expect(usd.code).toBe("USD");
      expect(usd.name).toBe("US Dollar");
      expect(usd.symbol).toBe("$");
      expect(usd.decimalPlaces).toBe(2);
      
      const jpy = Currency.from(CurrencyCode.JPY);
      expect(jpy.code).toBe("JPY");
      expect(jpy.decimalPlaces).toBe(0);
    });
    
    it("should work with money functions directly using CurrencyCode enum", () => {
      // With money function
      const euros = money(15.99, CurrencyCode.EUR);
      expect(euros.currency.code).toBe("EUR");
      expect(euros.format()).toBe("€15.99");
      
      // With moneyFromString function
      const pounds = moneyFromString("29.99", CurrencyCode.GBP);
      expect(pounds.currency.code).toBe("GBP");
      expect(pounds.format()).toBe("£29.99");
      
      // With moneyFromMinorUnits function
      const cents = moneyFromMinorUnits(5099, CurrencyCode.USD);
      expect(cents.currency.code).toBe("USD");
      expect(cents.format()).toBe("$50.99");
      
      // With moneyFromBigInt function
      const yen = moneyFromBigInt(5000n, CurrencyCode.JPY);
      expect(yen.currency.code).toBe("JPY");
      expect(yen.format()).toBe("¥5,000");
      
      // With zero function
      const zeroRupees = zero(CurrencyCode.INR);
      expect(zeroRupees.currency.code).toBe("INR");
      expect(zeroRupees.isZero()).toBe(true);
      expect(zeroRupees.format()).toBe("₹0.00");
    });

    it("should create currency from metadata using customCurrency function", () => {
      const eth = customCurrency({
        code: 'ETH',
        name: 'Ethereum',
        symbol: 'Ξ',
        decimalPlaces: 18
      });
      
      expect(eth.code).toBe("ETH");
      expect(eth.name).toBe("Ethereum");
      expect(eth.symbol).toBe("Ξ");
      expect(eth.decimalPlaces).toBe(18);
    });

    it("should require valid metadata properties", () => {
      // Missing required properties
      expect(() =>
        Currency.fromMetadata({
          code: 'BTC',
          name: '', // Empty string
          symbol: '₿',
          decimalPlaces: 8
        })
      ).toThrow(InvalidCurrencyError);

      expect(() =>
        Currency.fromMetadata({
          code: 'BTC',
          name: 'Bitcoin',
          symbol: '', // Empty string
          decimalPlaces: 8
        })
      ).toThrow(InvalidCurrencyError);
      
      // Invalid decimal places
      expect(() =>
        Currency.fromMetadata({
          code: 'BTC',
          name: 'Bitcoin',
          symbol: '₿',
          decimalPlaces: -1 // Negative value
        })
      ).toThrow(InvalidCurrencyError);

      expect(() =>
        Currency.fromMetadata({
          code: 'BTC',
          name: 'Bitcoin',
          symbol: '₿',
          decimalPlaces: 1.5 // Non-integer value
        })
      ).toThrow(InvalidCurrencyError);
    });

    it("should work with Money operations", () => {
      const btc = Currency.fromMetadata({
        code: 'BTC',
        name: 'Bitcoin',
        symbol: '₿',
        decimalPlaces: 8
      });
      
      const amount = Money.fromFloat(0.5, btc);
      expect(amount.format()).toBe("₿0.50000000");
      
      const doubled = amount.multiply(2);
      expect(doubled.format()).toBe("₿1.00000000");
      
      // Conversion between major and minor units
      // Use string to avoid floating point precision issues
      expect(btc.toMinorUnits("1.12345678")).toBe(112345678n);
      expect(btc.toMajorUnits(112345678n)).toBe("1.12345678");
    });

    it("should properly format custom currency amounts", () => {
      const doge = Currency.fromMetadata({
        code: 'DOGE',
        name: 'Dogecoin',
        symbol: 'Ð',
        decimalPlaces: 8
      });
      
      // Test formatting with different options
      expect(doge.format(1234.56789012)).toBe("Ð1,234.56789012");
      
      const formattedWithOptions = doge.format(1234.56789012, {
        symbol: false,
        code: true,
        useGrouping: false,
        decimalPlaces: 4
      });
      
      expect(formattedWithOptions).toBe("1234.5679 DOGE");
    });
  });
});