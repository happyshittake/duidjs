/**
 * Exchange rate management for the duidjs library
 */

import { InvalidCurrencyError, InvalidAmountError } from '../errors';

/**
 * Interface for exchange rate data
 */
export interface ExchangeRateData {
  /** The base currency code */
  baseCurrency: string;
  /** Map of currency codes to their exchange rates */
  rates: Record<string, number>;
  /** The timestamp of the exchange rate data */
  timestamp?: Date;
}

/**
 * Class for managing exchange rates
 */
export class ExchangeRateProvider {
  /** The base currency code */
  readonly baseCurrency: string;
  /** Map of currency codes to their exchange rates */
  private rates: Map<string, number>;
  /** The timestamp of the exchange rate data */
  readonly timestamp?: Date;

  /**
   * Creates a new ExchangeRateProvider instance
   * 
   * @param data The exchange rate data
   */
  constructor(data: ExchangeRateData) {
    this.baseCurrency = data.baseCurrency.toUpperCase();
    this.rates = new Map(Object.entries(data.rates).map(([code, rate]) => [code.toUpperCase(), rate]));
    this.timestamp = data.timestamp;
    
    // Add the base currency with rate 1.0
    this.rates.set(this.baseCurrency, 1.0);
  }

  /**
   * Gets the exchange rate from one currency to another
   * 
   * @param from The source currency code
   * @param to The target currency code
   * @returns The exchange rate
   * @throws {InvalidCurrencyError} If either currency code is invalid
   */
  getRate(from: string, to: string): number {
    const fromCode = from.toUpperCase();
    const toCode = to.toUpperCase();
    
    const fromRate = this.rates.get(fromCode);
    const toRate = this.rates.get(toCode);
    
    if (fromRate === undefined) {
      throw new InvalidCurrencyError(`Unknown currency: ${from}`);
    }
    
    if (toRate === undefined) {
      throw new InvalidCurrencyError(`Unknown currency: ${to}`);
    }
    
    // Calculate the cross rate
    return toRate / fromRate;
  }

  /**
   * Checks if a currency is supported by this provider
   * 
   * @param currency The currency code
   * @returns True if the currency is supported, false otherwise
   */
  supportsCurrency(currency: string): boolean {
    return this.rates.has(currency.toUpperCase());
  }

  /**
   * Gets all supported currency codes
   * 
   * @returns An array of supported currency codes
   */
  getSupportedCurrencies(): string[] {
    return Array.from(this.rates.keys());
  }

  /**
   * Updates the exchange rate for a currency
   * 
   * @param currency The currency code
   * @param rate The new exchange rate
   * @throws {InvalidCurrencyError} If the currency code is invalid
   * @throws {InvalidAmountError} If the rate is invalid
   */
  updateRate(currency: string, rate: number): void {
    const code = currency.toUpperCase();
    
    if (isNaN(rate) || !isFinite(rate) || rate <= 0) {
      throw new InvalidAmountError(`Invalid exchange rate: ${rate}`);
    }
    
    this.rates.set(code, rate);
  }

  /**
   * Updates multiple exchange rates
   * 
   * @param rates Map of currency codes to their exchange rates
   * @throws {InvalidAmountError} If any rate is invalid
   */
  updateRates(rates: Record<string, number>): void {
    for (const [currency, rate] of Object.entries(rates)) {
      this.updateRate(currency, rate);
    }
  }

  /**
   * Creates a new ExchangeRateProvider with the base currency changed
   * 
   * @param newBaseCurrency The new base currency code
   * @returns A new ExchangeRateProvider instance
   * @throws {InvalidCurrencyError} If the currency code is invalid
   */
  withBaseCurrency(newBaseCurrency: string): ExchangeRateProvider {
    const code = newBaseCurrency.toUpperCase();
    
    if (!this.supportsCurrency(code)) {
      throw new InvalidCurrencyError(`Unknown currency: ${newBaseCurrency}`);
    }
    
    const baseRate = this.rates.get(code)!;
    const newRates: Record<string, number> = {};
    
    // Recalculate all rates relative to the new base currency
    for (const [currency, rate] of this.rates.entries()) {
      if (currency !== code) {
        newRates[currency] = rate / baseRate;
      }
    }
    
    return new ExchangeRateProvider({
      baseCurrency: code,
      rates: newRates,
      timestamp: this.timestamp,
    });
  }
}