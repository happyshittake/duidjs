/**
 * Currency class for the duidjs library
 */

import { CurrencyCode } from "./currencies/codes";
import type { CurrencyMetadata } from "./currencies/iso";
import { ISO_CURRENCIES } from "./currencies/iso";
import { InvalidCurrencyError } from "./errors";
import { RoundingConfig, RoundingMode, round as roundValue } from "./rounding";
import { bigintToNumber, decimalToBigInt } from "./utils";

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
    if (!metadata.code || typeof metadata.code !== "string") {
      throw new InvalidCurrencyError(
        "Currency code is required and must be a string"
      );
    }

    if (!metadata.name || typeof metadata.name !== "string") {
      throw new InvalidCurrencyError(
        "Currency name is required and must be a string"
      );
    }

    if (!metadata.symbol || typeof metadata.symbol !== "string") {
      throw new InvalidCurrencyError(
        "Currency symbol is required and must be a string"
      );
    }

    if (
      typeof metadata.decimalPlaces !== "number" ||
      metadata.decimalPlaces < 0 ||
      !Number.isInteger(metadata.decimalPlaces)
    ) {
      throw new InvalidCurrencyError(
        "decimalPlaces must be a non-negative integer"
      );
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
      numAmount = bigintToNumber(amount, decimalPlaces + 4);
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
  getDecimalFactor(addMorePrecision: bigint = 0n): bigint {
    return BigInt(10) ** (BigInt(this.decimalPlaces) + addMorePrecision);
  }

  /**
   * Rounds an amount according to this currency's decimal places
   *
   * @param amount The amount to round
   * @param mode The rounding mode to use (defaults to global default)
   * @returns The rounded amount as a string
   */
  round(
    amount: number | string,
    mode: RoundingMode = RoundingConfig.defaultRoundingMode
  ): string {
    return roundValue(amount, this.decimalPlaces, mode);
  }

  /**
   * Converts an amount from major units to minor units
   *
   * @param amount The amount in major units
   * @param mode The rounding mode to use (defaults to global default)
   * @returns The amount in minor units as a BigInt
   */
  toMinorUnits(amount: number | string): bigint {
    return decimalToBigInt(amount, this.decimalPlaces + 4);
  }

  /**
   * Converts an amount from minor units to major units
   *
   * @param amount The amount in minor units as a BigInt
   * @param mode Optional rounding mode to use
   * @returns The amount in major units as a string
   */
  toMajorUnits(amount: bigint): string {
    return bigintToNumber(amount, this.decimalPlaces + 4).toString();
  }
}
