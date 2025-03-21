import { describe, expect, it } from "bun:test";
import {
  Currency,
  money,
  moneyFromString,
  RoundingConfig,
  RoundingMode,
} from "../src";

describe("Rounding", () => {
  it("should use NONE as default rounding mode", () => {
    // Test with 2 decimal places (USD)
    const m1 = money(1.985, "USD");
    expect(m1.getAmount()).toBe("1.985");

    const m2 = money(1.984, "USD");
    expect(m2.getAmount()).toBe("1.984");

    // Test with division that produces repeating decimals
    const m3 = money(100 / 3, "USD");
    expect(m3.getAmount()).toBe("33.333333");
  });

  it("should respect custom rounding modes", () => {
    // Test FLOOR rounding
    const m1 = money(1.989, "USD");
    expect(m1.getAmount(RoundingMode.FLOOR)).toBe("1.98");

    // Test CEILING rounding
    const m2 = money(1.981, "USD");
    expect(m2.getAmount(RoundingMode.CEILING)).toBe("1.99");

    // Test HALF_DOWN rounding
    const m3 = money(1.985, "USD");
    expect(m3.getAmount(RoundingMode.HALF_DOWN)).toBe("1.98");

    const m4 = money(1.986, "USD");
    expect(m4.getAmount(RoundingMode.HALF_DOWN)).toBe("1.99");
  });

  it("should allow changing the default rounding mode globally", () => {
    // Save original default
    const originalDefault = RoundingConfig.defaultRoundingMode;

    try {
      // Change default to FLOOR
      RoundingConfig.setDefaultRoundingMode(RoundingMode.FLOOR);

      const m1 = money(1.989, "USD");
      expect(m1.getAmount()).toBe("1.98");

      // Change default to CEILING
      RoundingConfig.setDefaultRoundingMode(RoundingMode.CEILING);

      const m2 = money(1.981, "USD");
      expect(m2.getAmount()).toBe("1.99");
    } finally {
      // Restore original default
      RoundingConfig.setDefaultRoundingMode(originalDefault);
    }
  });

  it("should handle different decimal places correctly", () => {
    // JPY (0 decimal places)
    const m1 = money(1999.5, "JPY");
    expect(m1.getAmount()).toBe("1999.5");

    // BHD (3 decimal places)
    const m2 = money(1.9995, "BHD");
    expect(m2.getAmount()).toBe("1.9995");
  });

  it("should handle the specific examples from requirements", () => {
    // Example: 1.985 with 2 decimal places should be 1.985 with NONE mode
    const m1 = money(1.985, "USD");
    expect(m1.getAmount()).toBe("1.985");
    // Minor units still reflect the stored value
    expect(m1.getAmountInMinorUnits()).toBe(1985000n);

    // Example: 100/3 = 33.33333... with NONE mode preserves all decimal places
    const m2 = money(100 / 3, "USD");
    expect(m2.getAmount()).toBe("33.333333");
    // Minor units still reflect the stored value
    expect(m2.getAmountInMinorUnits()).toBe(33333333n);
  });

  it("should handle string amounts correctly", () => {
    const m1 = moneyFromString("1.985", "USD");
    expect(m1.getAmount()).toBe("1.985");

    const m2 = moneyFromString("1.984", "USD");
    expect(m2.getAmount()).toBe("1.984");
  });

  it("should apply rounding when using Currency.round method directly", () => {
    const usd = new Currency("USD");

    expect(usd.round(1.985)).toBe("1.985");
    expect(usd.round(1.984)).toBe("1.984");
    expect(usd.round(1.985, RoundingMode.FLOOR)).toBe("1.98");
    expect(usd.round(1.985, RoundingMode.CEILING)).toBe("1.99");
  });

  it("should handle negative numbers correctly", () => {
    // NONE (default)
    const m1 = money(-1.985, "USD");
    expect(m1.getAmount()).toBe("-1.985");

    const m2 = money(-1.984, "USD");
    expect(m2.getAmount()).toBe("-1.984");

    // FLOOR
    const m3 = money(-1.985, "USD");
    expect(m3.getAmount(RoundingMode.FLOOR)).toBe("-1.99");

    // CEILING
    const m4 = money(-1.985, "USD");
    expect(m4.getAmount(RoundingMode.CEILING)).toBe("-1.98");
  });

  it("should handle UP and DOWN rounding modes", () => {
    // UP (away from zero)
    const m1 = money(1.001, "USD");
    expect(m1.getAmount(RoundingMode.UP)).toBe("1.01");

    const m2 = money(-1.001, "USD");
    expect(m2.getAmount(RoundingMode.UP)).toBe("-1.01");

    // DOWN (towards zero)
    const m3 = money(1.009, "USD");
    expect(m3.getAmount(RoundingMode.DOWN)).toBe("1");

    const m4 = money(-1.009, "USD");
    expect(m4.getAmount(RoundingMode.DOWN)).toBe("-1");
  });

  it("should handle HALF_EVEN (banker's rounding) correctly", () => {
    // Round to even for ties
    const m1 = money(1.985, "USD");
    expect(m1.getAmount(RoundingMode.HALF_EVEN)).toBe("1.98"); // Rounds to 1.98 (even)

    const m2 = money(1.975, "USD");
    expect(m2.getAmount(RoundingMode.HALF_EVEN)).toBe("1.98"); // Rounds to 1.98 (even)

    const m3 = money(1.965, "USD");
    expect(m3.getAmount(RoundingMode.HALF_EVEN)).toBe("1.96"); // Rounds to 1.96 (even)

    const m4 = money(1.955, "USD");
    expect(m4.getAmount(RoundingMode.HALF_EVEN)).toBe("1.96"); // Rounds to 1.96 (even)
  });

  it("should preserve decimal places + 4 precision", () => {
    // Test with exact decimal representation
    const m1 = money(1.98765, "USD");
    expect(m1.getAmount()).toBe("1.98765");

    // Test with division that produces repeating decimals
    const m2 = money(100 / 3, "USD");
    // This should preserve all decimal places from the division
    expect(m2.getAmount()).toBe("33.333333");

    // Test with string amount
    const m3 = moneyFromString("1.98765", "USD");
    expect(m3.getAmount()).toBe("1.98765");
  });

  it("should handle NONE mode with different decimal places", () => {
    // JPY (0 decimal places)
    const m1 = money(1999.5, "JPY");
    expect(m1.getAmount()).toBe("1999.5");

    // BHD (3 decimal places)
    const m2 = money(1.9995, "BHD");
    expect(m2.getAmount()).toBe("1.9995");
  });

  it("should handle negative numbers with NONE mode", () => {
    const m1 = money(-1.98765, "USD");
    expect(m1.getAmount(RoundingMode.NONE)).toBe("-1.98765");

    const m2 = money(-100 / 3, "USD");
    expect(m2.getAmount(RoundingMode.NONE)).toBe("-33.333333");
  });

  it("should allow specifying different rounding modes in getAmount", () => {
    // Create money with default rounding (now NONE)
    const m = money(1.98765, "USD");

    // Get amount with different rounding modes
    expect(m.getAmount()).toBe("1.98765"); // Default rounding (NONE)
    expect(m.getAmount(RoundingMode.FLOOR)).toBe("1.98");

    // Create a new instance with the exact value we need for HALF_UP test
    const mHalfUp = money(1.985, "USD");
    expect(mHalfUp.getAmount(RoundingMode.HALF_UP)).toBe("1.99"); // HALF_UP rounding

    // Create money with explicit HALF_UP rounding
    const m2 = money(1.98765, "USD");
    expect(m2.getAmount(RoundingMode.HALF_UP)).toBe("1.99");
    expect(m2.getAmount(RoundingMode.CEILING)).toBe("1.99");
  });

  it("should preserve all decimal places in add and subtract operations with NONE mode", () => {
    // Test addition
    const m1 = money(10.123, "USD");
    const m2 = money(5.456, "USD");
    const added = m1.add(m2);
    expect(added.getAmount(RoundingMode.NONE)).toBe("15.579");

    // Test subtraction
    const subtracted = m1.subtract(m2);
    expect(subtracted.getAmount(RoundingMode.NONE)).toBe("4.667");
  });

  it("should preserve all decimal places in multiply and divide operations with NONE mode", () => {
    // Test multiplication
    const m1 = money(10, "USD");
    const multiplied = m1.multiply(3.33333);
    expect(multiplied.getAmount(RoundingMode.NONE)).toBe("33.3333");

    // Test division
    const m2 = money(100, "USD");
    const divided = m2.divide(3);
    expect(divided.getAmount(RoundingMode.NONE)).toBe("33.333333");
  });

  it("should apply NONE mode when using Currency.round method directly", () => {
    const usd = new Currency("USD");

    expect(usd.round(1.98765, RoundingMode.NONE)).toBe("1.98765");
    expect(usd.round(100 / 3, RoundingMode.NONE)).toBe("33.333333333333336");
  });
});
