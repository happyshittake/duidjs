import { describe, expect, it } from "bun:test";
import {
  Money,
  Currency,
  money,
  ExchangeRateProvider,
  CurrencyConverter,
  InvalidCurrencyError,
} from "../src";

describe("Conversion", () => {
  describe("ExchangeRateProvider", () => {
    it("should create exchange rate provider", () => {
      const provider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
          GBP: 0.75,
          JPY: 110.0,
        },
      });
      
      expect(provider.baseCurrency).toBe("USD");
      expect(provider.supportsCurrency("USD")).toBe(true);
      expect(provider.supportsCurrency("EUR")).toBe(true);
      expect(provider.supportsCurrency("GBP")).toBe(true);
      expect(provider.supportsCurrency("JPY")).toBe(true);
    });

    it("should get exchange rate", () => {
      const provider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
          GBP: 0.75,
          JPY: 110.0,
        },
      });
      
      // Direct rates
      expect(provider.getRate("USD", "EUR")).toBe(0.85);
      expect(provider.getRate("USD", "GBP")).toBe(0.75);
      expect(provider.getRate("USD", "JPY")).toBe(110.0);
      
      // Base currency to itself
      expect(provider.getRate("USD", "USD")).toBe(1.0);
      
      // Cross rates
      expect(provider.getRate("EUR", "GBP")).toBeCloseTo(0.75 / 0.85, 5);
      expect(provider.getRate("JPY", "EUR")).toBeCloseTo(0.85 / 110.0, 5);
    });

    it("should get supported currencies", () => {
      const provider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
          GBP: 0.75,
        },
      });
      
      const currencies = provider.getSupportedCurrencies();
      expect(currencies).toContain("USD");
      expect(currencies).toContain("EUR");
      expect(currencies).toContain("GBP");
      expect(currencies.length).toBe(3);
    });

    it("should update rates", () => {
      const provider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
          GBP: 0.75,
        },
      });
      
      provider.updateRate("EUR", 0.9);
      expect(provider.getRate("USD", "EUR")).toBe(0.9);
      
      provider.updateRates({
        EUR: 0.95,
        GBP: 0.8,
        JPY: 115.0,
      });
      
      expect(provider.getRate("USD", "EUR")).toBe(0.95);
      expect(provider.getRate("USD", "GBP")).toBe(0.8);
      expect(provider.getRate("USD", "JPY")).toBe(115.0);
    });

    it("should change base currency", () => {
      const usdProvider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
          GBP: 0.75,
        },
      });
      
      const eurProvider = usdProvider.withBaseCurrency("EUR");
      
      expect(eurProvider.baseCurrency).toBe("EUR");
      expect(eurProvider.getRate("EUR", "USD")).toBeCloseTo(1 / 0.85, 5);
      expect(eurProvider.getRate("EUR", "GBP")).toBeCloseTo(0.75 / 0.85, 5);
    });

    it("should throw on unknown currency", () => {
      const provider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
        },
      });
      
      expect(() => provider.getRate("USD", "XYZ")).toThrow(InvalidCurrencyError);
      expect(() => provider.getRate("XYZ", "USD")).toThrow(InvalidCurrencyError);
    });
  });

  describe("CurrencyConverter", () => {
    it("should convert money between currencies", () => {
      const provider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
          GBP: 0.75,
          JPY: 110.0,
        },
      });
      
      const converter = new CurrencyConverter(provider);
      
      const usd = money(100, "USD");
      const eur = converter.convert(usd, "EUR");
      
      expect(eur.currency.code).toBe("EUR");
      expect(eur.getAmount()).toBe("85");
    });

    it("should handle different decimal places", () => {
      const provider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          JPY: 110.0,
        },
      });
      
      const converter = new CurrencyConverter(provider);
      
      const usd = money(1, "USD");
      const jpy = converter.convert(usd, "JPY");
      
      expect(jpy.currency.code).toBe("JPY");
      expect(jpy.getAmount()).toBe("110");
    });

    it("should convert to multiple currencies", () => {
      const provider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
          GBP: 0.75,
          JPY: 110.0,
        },
      });
      
      const converter = new CurrencyConverter(provider);
      
      const usd = money(100, "USD");
      const converted = converter.convertToMultiple(usd, ["EUR", "GBP"]);
      
      expect(converted.size).toBe(2);
      expect(converted.get("EUR")?.getAmount()).toBe("85");
      expect(converted.get("GBP")?.getAmount()).toBe("75");
    });

    it("should convert to all supported currencies", () => {
      const provider = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
          GBP: 0.75,
        },
      });
      
      const converter = new CurrencyConverter(provider);
      
      const usd = money(100, "USD");
      const converted = converter.convertToAllSupported(usd);
      
      expect(converted.size).toBe(3); // USD, EUR, GBP
      expect(converted.get("USD")?.getAmount()).toBe("100");
      expect(converted.get("EUR")?.getAmount()).toBe("85");
      expect(converted.get("GBP")?.getAmount()).toBe("75");
    });

    it("should update exchange rate provider", () => {
      const provider1 = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.85,
        },
      });
      
      const provider2 = new ExchangeRateProvider({
        baseCurrency: "USD",
        rates: {
          EUR: 0.9,
        },
      });
      
      const converter = new CurrencyConverter(provider1);
      
      const usd = money(100, "USD");
      const eur1 = converter.convert(usd, "EUR");
      expect(eur1.getAmount()).toBe("85");
      
      converter.setExchangeRateProvider(provider2);
      
      const eur2 = converter.convert(usd, "EUR");
      expect(eur2.getAmount()).toBe("90");
    });
  });
});