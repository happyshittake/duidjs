/**
 * Currency class for the duidjs library
 */

import { ISO_CURRENCIES } from "./currencies/iso";
import type { CurrencyMetadata } from "./currencies/iso";
import { CurrencyCode } from "./currencies/codes";
import { InvalidCurrencyError } from "./errors";

/**
 * Options for formatting currency values
 */
export interface FormatOptions {
  /** Whether to include the currency symbol */
  symbol?: boolean;
  /** Whether to include the currency code */
  code?: boolean;
  /** The locale to use for formatting */
  locale?: string;
  /** The number of decimal places to display */
  decimalPlaces?: number;
  /** Whether to use grouping separators */
  useGrouping?: boolean;
}

/**
 * Currency class representing a monetary currency
 */
export class Currency {
  /** The ISO currency code (e.g., USD, EUR) */
  readonly code: string;
  /** The currency name (e.g., US Dollar, Euro) */
  readonly name: string;
  /** The currency symbol (e.g., $, €) */
  readonly symbol: string;
  /** The number of decimal places for the currency */
  readonly decimalPlaces: number;

  /**
   * Creates a new Currency instance
   *
   * @param code The ISO currency code
   * @throws {InvalidCurrencyError} If the currency code is invalid
   */
  constructor(code: string) {
    const upperCode = code.toUpperCase();
    const metadata = ISO_CURRENCIES[upperCode];

    if (!metadata) {
      throw new InvalidCurrencyError(`Invalid currency code: ${code}`);
    }

    this.code = metadata.code;
    this.name = metadata.name;
    this.symbol = metadata.symbol;
    this.decimalPlaces = metadata.decimalPlaces;
  }

  /**
   * Creates a Currency instance from an ISO currency code
   *
   * @param code The ISO currency code
   * @returns A new Currency instance
   * @throws {InvalidCurrencyError} If the currency code is invalid
   */
  static fromCode(code: string): Currency {
    return new Currency(code);
  }

  /**
   * Creates a Currency instance from a type-safe currency code
   *
   * @param code The currency code from CurrencyCode enum
   * @returns A new Currency instance
   * @throws {InvalidCurrencyError} If the currency code is invalid
   */
  static from(code: CurrencyCode): Currency {
    return new Currency(code);
  }

  /**
   * Creates a Currency instance from custom metadata
   *
   * @param metadata The currency metadata
   * @returns A new Currency instance
   * @throws {InvalidCurrencyError} If the metadata is invalid
   */
  static fromMetadata(metadata: CurrencyMetadata): Currency {
    // Validate metadata
    if (!metadata.code || typeof metadata.code !== 'string') {
      throw new InvalidCurrencyError('Currency code is required and must be a string');
    }
    
    if (!metadata.name || typeof metadata.name !== 'string') {
      throw new InvalidCurrencyError('Currency name is required and must be a string');
    }
    
    if (!metadata.symbol || typeof metadata.symbol !== 'string') {
      throw new InvalidCurrencyError('Currency symbol is required and must be a string');
    }
    
    if (typeof metadata.decimalPlaces !== 'number' ||
        metadata.decimalPlaces < 0 ||
        !Number.isInteger(metadata.decimalPlaces)) {
      throw new InvalidCurrencyError('decimalPlaces must be a non-negative integer');
    }
    
    // Create a new instance bypassing the ISO validation
    const currency = Object.create(Currency.prototype);
    currency.code = metadata.code.toUpperCase();
    currency.name = metadata.name;
    currency.symbol = metadata.symbol;
    currency.decimalPlaces = metadata.decimalPlaces;
    
    return currency;
  }

  /**
   * Checks if this currency is equal to another currency
   *
   * @param currency The currency to compare with
   * @returns True if the currencies are equal, false otherwise
   */
  equals(currency: Currency): boolean {
    return this.code === currency.code;
  }

  /**
   * Formats an amount according to this currency
   *
   * @param amount The amount to format (in major units)
   * @param options Formatting options
   * @returns The formatted amount as a string
   */
  format(
    amount: number | bigint | string,
    options: FormatOptions = {}
  ): string {
    const {
      symbol = true,
      code = false,
      locale = "en-US",
      decimalPlaces = this.decimalPlaces,
      useGrouping = true,
    } = options;

    // Convert amount to number for formatting
    let numAmount: number;
    if (typeof amount === "bigint") {
      // Convert BigInt to string first to avoid precision loss
      numAmount = Number(amount) / 10 ** this.decimalPlaces;
    } else if (typeof amount === "string") {
      numAmount = parseFloat(amount);
    } else {
      numAmount = amount;
    }

    // Format the number
    const formatter = new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      useGrouping,
    });

    const formattedAmount = formatter.format(numAmount);

    // Build the formatted string
    let result = "";

    if (symbol) {
      result += this.symbol;
    }

    result += formattedAmount;

    if (code) {
      result += ` ${this.code}`;
    }

    return result;
  }

  /**
   * Returns the factor to convert between major and minor units
   *
   * @returns The conversion factor as a BigInt
   */
  getDecimalFactor(): bigint {
    return BigInt(10) ** BigInt(this.decimalPlaces);
  }

  /**
   * Converts an amount from major units to minor units
   *
   * @param amount The amount in major units
   * @returns The amount in minor units as a BigInt
   */
  toMinorUnits(amount: number | string): bigint {
    const factor = this.getDecimalFactor();

    if (typeof amount === "number") {
      // Handle potential floating point precision issues
      const amountStr = amount.toFixed(this.decimalPlaces + 8);
      return this.toMinorUnits(amountStr);
    } else {
      // Parse string representation
      const [integerPart, fractionalPart = ""] = amount.split(".");

      // Pad or truncate fractional part to match decimal places
      const paddedFractionalPart = fractionalPart
        .padEnd(this.decimalPlaces, "0")
        .slice(0, this.decimalPlaces);

      // Combine parts and convert to BigInt
      return BigInt(integerPart + paddedFractionalPart);
    }
  }

  /**
   * Converts an amount from minor units to major units
   *
   * @param amount The amount in minor units as a BigInt
   * @returns The amount in major units as a string
   */
  toMajorUnits(amount: bigint): string {
    const factor = this.getDecimalFactor();

    if (this.decimalPlaces === 0) {
      return amount.toString();
    }

    const sign = amount < 0n ? "-" : "";
    const absAmount = amount < 0n ? -amount : amount;

    const integerPart = absAmount / factor;
    const fractionalPart = absAmount % factor;

    // Pad fractional part with leading zeros
    const paddedFractionalPart = fractionalPart
      .toString()
      .padStart(this.decimalPlaces, "0");

    return `${sign}${integerPart}.${paddedFractionalPart}`;
  }
}
