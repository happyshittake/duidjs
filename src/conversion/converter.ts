/**
 * Currency converter for the duidjs library
 */

import { Currency } from '../currency';
import { Money } from '../money';
import { ExchangeRateProvider } from './exchange-rate';
import { InvalidCurrencyError } from '../errors';

/**
 * Class for converting money between currencies
 */
export class CurrencyConverter {
  /** The exchange rate provider */
  private exchangeRateProvider: ExchangeRateProvider;

  /**
   * Creates a new CurrencyConverter instance
   * 
   * @param exchangeRateProvider The exchange rate provider
   */
  constructor(exchangeRateProvider: ExchangeRateProvider) {
    this.exchangeRateProvider = exchangeRateProvider;
  }

  /**
   * Converts a Money instance to another currency
   * 
   * @param money The Money instance to convert
   * @param targetCurrency The target currency code or Currency instance
   * @returns A new Money instance in the target currency
   * @throws {InvalidCurrencyError} If the currency code is invalid or not supported
   */
  convert(money: Money, targetCurrency: Currency | string): Money {
    const sourceCurrency = money.currency;
    const targetCurrencyObj = typeof targetCurrency === 'string' 
      ? new Currency(targetCurrency) 
      : targetCurrency;
    
    // Check if the currencies are the same
    if (sourceCurrency.equals(targetCurrencyObj)) {
      return money;
    }
    
    // Check if the currencies are supported
    if (!this.exchangeRateProvider.supportsCurrency(sourceCurrency.code)) {
      throw new InvalidCurrencyError(`Source currency not supported: ${sourceCurrency.code}`);
    }
    
    if (!this.exchangeRateProvider.supportsCurrency(targetCurrencyObj.code)) {
      throw new InvalidCurrencyError(`Target currency not supported: ${targetCurrencyObj.code}`);
    }
    
    // Get the exchange rate
    const rate = this.exchangeRateProvider.getRate(sourceCurrency.code, targetCurrencyObj.code);
    
    // Convert the money
    return money.convert(targetCurrencyObj, rate);
  }

  /**
   * Converts a Money instance to multiple currencies
   * 
   * @param money The Money instance to convert
   * @param targetCurrencies The target currency codes or Currency instances
   * @returns A map of currency codes to converted Money instances
   * @throws {InvalidCurrencyError} If any currency code is invalid or not supported
   */
  convertToMultiple(
    money: Money,
    targetCurrencies: (Currency | string)[]
  ): Map<string, Money> {
    const result = new Map<string, Money>();
    
    for (const targetCurrency of targetCurrencies) {
      const converted = this.convert(money, targetCurrency);
      result.set(converted.currency.code, converted);
    }
    
    return result;
  }

  /**
   * Converts a Money instance to all supported currencies
   * 
   * @param money The Money instance to convert
   * @returns A map of currency codes to converted Money instances
   * @throws {InvalidCurrencyError} If the source currency is not supported
   */
  convertToAllSupported(money: Money): Map<string, Money> {
    const supportedCurrencies = this.exchangeRateProvider.getSupportedCurrencies();
    return this.convertToMultiple(money, supportedCurrencies);
  }

  /**
   * Gets the exchange rate provider
   * 
   * @returns The exchange rate provider
   */
  getExchangeRateProvider(): ExchangeRateProvider {
    return this.exchangeRateProvider;
  }

  /**
   * Sets a new exchange rate provider
   * 
   * @param provider The new exchange rate provider
   */
  setExchangeRateProvider(provider: ExchangeRateProvider): void {
    this.exchangeRateProvider = provider;
  }
}