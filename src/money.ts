/**
 * Money class for the duidjs library
 */

import { Currency } from './currency';
import type { FormatOptions } from './currency';
import {
  AllocationError,
  CurrencyMismatchError,
  InvalidAmountError,
  InvalidOperationError,
} from './errors';

/**
 * Money class representing a monetary amount in a specific currency
 */
export class Money {
  /** The amount in minor units (e.g., cents) stored as a BigInt */
  readonly amount: bigint;
  /** The currency of the money */
  readonly currency: Currency;

  /**
   * Creates a new Money instance
   * 
   * @param amount The amount in minor units (e.g., cents) as a BigInt
   * @param currency The currency
   */
  private constructor(amount: bigint, currency: Currency) {
    this.amount = amount;
    this.currency = currency;
  }

  /**
   * Creates a Money instance from a floating-point amount
   * 
   * @param amount The amount in major units (e.g., dollars) as a floating-point number
   * @param currency The currency code or Currency instance
   * @returns A new Money instance
   * @throws {InvalidCurrencyError} If the currency code is invalid
   * @throws {InvalidAmountError} If the amount is invalid
   */
  static fromFloat(amount: number, currency: Currency | string): Money {
    if (isNaN(amount) || !isFinite(amount)) {
      throw new InvalidAmountError(`Invalid amount: ${amount}`);
    }

    const currencyObj = typeof currency === 'string' ? new Currency(currency) : currency;
    const amountInMinorUnits = currencyObj.toMinorUnits(amount);
    
    return new Money(amountInMinorUnits, currencyObj);
  }

  /**
   * Creates a Money instance from an integer amount
   * 
   * @param amount The amount in minor units (e.g., cents) as an integer
   * @param currency The currency code or Currency instance
   * @returns A new Money instance
   * @throws {InvalidCurrencyError} If the currency code is invalid
   * @throws {InvalidAmountError} If the amount is invalid
   */
  static fromInt(amount: number, currency: Currency | string): Money {
    if (!Number.isInteger(amount)) {
      throw new InvalidAmountError(`Amount must be an integer: ${amount}`);
    }

    const currencyObj = typeof currency === 'string' ? new Currency(currency) : currency;
    
    return new Money(BigInt(amount), currencyObj);
  }

  /**
   * Creates a Money instance from a string amount
   * 
   * @param amount The amount in major units (e.g., dollars) as a string
   * @param currency The currency code or Currency instance
   * @returns A new Money instance
   * @throws {InvalidCurrencyError} If the currency code is invalid
   * @throws {InvalidAmountError} If the amount is invalid
   */
  static fromString(amount: string, currency: Currency | string): Money {
    if (!/^-?\d+(\.\d+)?$/.test(amount)) {
      throw new InvalidAmountError(`Invalid amount format: ${amount}`);
    }

    const currencyObj = typeof currency === 'string' ? new Currency(currency) : currency;
    const amountInMinorUnits = currencyObj.toMinorUnits(amount);
    
    return new Money(amountInMinorUnits, currencyObj);
  }

  /**
   * Creates a Money instance from a BigInt amount
   * 
   * @param amount The amount in minor units (e.g., cents) as a BigInt
   * @param currency The currency code or Currency instance
   * @returns A new Money instance
   * @throws {InvalidCurrencyError} If the currency code is invalid
   */
  static fromBigInt(amount: bigint, currency: Currency | string): Money {
    const currencyObj = typeof currency === 'string' ? new Currency(currency) : currency;
    
    return new Money(amount, currencyObj);
  }

  /**
   * Creates a zero Money instance
   * 
   * @param currency The currency code or Currency instance
   * @returns A new Money instance with zero amount
   * @throws {InvalidCurrencyError} If the currency code is invalid
   */
  static zero(currency: Currency | string): Money {
    const currencyObj = typeof currency === 'string' ? new Currency(currency) : currency;
    
    return new Money(0n, currencyObj);
  }

  /**
   * Adds another Money instance to this one
   * 
   * @param money The Money instance to add
   * @returns A new Money instance with the sum
   * @throws {CurrencyMismatchError} If the currencies don't match
   */
  add(money: Money): Money {
    this.assertSameCurrency(money);
    
    return new Money(this.amount + money.amount, this.currency);
  }

  /**
   * Subtracts another Money instance from this one
   * 
   * @param money The Money instance to subtract
   * @returns A new Money instance with the difference
   * @throws {CurrencyMismatchError} If the currencies don't match
   */
  subtract(money: Money): Money {
    this.assertSameCurrency(money);
    
    return new Money(this.amount - money.amount, this.currency);
  }

  /**
   * Multiplies this Money instance by a multiplier
   * 
   * @param multiplier The multiplier
   * @returns A new Money instance with the product
   * @throws {InvalidAmountError} If the multiplier is invalid
   */
  multiply(multiplier: number | bigint): Money {
    if (typeof multiplier === 'number') {
      if (isNaN(multiplier) || !isFinite(multiplier)) {
        throw new InvalidAmountError(`Invalid multiplier: ${multiplier}`);
      }
      
      // Convert to string to avoid floating point precision issues
      const multiplierStr = multiplier.toString();
      
      // Check if it's an integer
      if (Number.isInteger(multiplier)) {
        return new Money(this.amount * BigInt(multiplier), this.currency);
      }
      
      // For decimal multipliers, we need to handle the decimal places
      const [integerPart, fractionalPart = ''] = multiplierStr.split('.');
      const scale = BigInt(10 ** fractionalPart.length);
      
      const scaledAmount = this.amount * (BigInt(integerPart) * scale + BigInt(fractionalPart));
      const result = scaledAmount / scale;
      
      return new Money(result, this.currency);
    } else {
      // BigInt multiplier
      return new Money(this.amount * multiplier, this.currency);
    }
  }

  /**
   * Divides this Money instance by a divisor
   * 
   * @param divisor The divisor
   * @returns A new Money instance with the quotient
   * @throws {InvalidAmountError} If the divisor is invalid or zero
   */
  divide(divisor: number | bigint): Money {
    if (typeof divisor === 'number') {
      if (isNaN(divisor) || !isFinite(divisor) || divisor === 0) {
        throw new InvalidAmountError(`Invalid divisor: ${divisor}`);
      }
      
      // Convert to string to avoid floating point precision issues
      const divisorStr = divisor.toString();
      
      // Check if it's an integer
      if (Number.isInteger(divisor)) {
        return new Money(this.amount / BigInt(divisor), this.currency);
      }
      
      // For decimal divisors, we need to handle the decimal places
      const [integerPart, fractionalPart = ''] = divisorStr.split('.');
      const scale = BigInt(10 ** fractionalPart.length);
      
      const scaledDivisor = BigInt(integerPart) * scale + BigInt(fractionalPart);
      const scaledAmount = this.amount * scale;
      const result = scaledAmount / scaledDivisor;
      
      return new Money(result, this.currency);
    } else {
      // BigInt divisor
      if (divisor === 0n) {
        throw new InvalidAmountError('Division by zero');
      }
      
      return new Money(this.amount / divisor, this.currency);
    }
  }

  /**
   * Allocates the money amount according to a list of ratios
   * 
   * @param ratios The list of ratios
   * @returns A list of Money instances with allocated amounts
   * @throws {AllocationError} If the ratios are invalid
   */
  allocate(ratios: number[]): Money[] {
    if (ratios.length === 0) {
      throw new AllocationError('Cannot allocate to empty ratios');
    }
    
    if (ratios.some(ratio => ratio < 0)) {
      throw new AllocationError('Cannot allocate to negative ratios');
    }
    
    const total = ratios.reduce((sum, ratio) => sum + ratio, 0);
    
    if (total === 0) {
      throw new AllocationError('Cannot allocate to zero ratios');
    }
    
    const remainder = this.amount;
    let remainingAmount = remainder;
    const results: Money[] = [];
    
    // Calculate the amount for each ratio
    for (let i = 0; i < ratios.length; i++) {
      const ratio = ratios[i];
      const share = (this.amount * BigInt(Math.round(ratio * 1000))) / BigInt(Math.round(total * 1000));
      
      results.push(new Money(share, this.currency));
      remainingAmount -= share;
    }
    
    // Distribute any remaining amount
    for (let i = 0; i < remainingAmount; i++) {
      results[i] = new Money(results[i].amount + 1n, this.currency);
    }
    
    return results;
  }

  /**
   * Distributes the money amount into a specified number of parts
   * 
   * @param n The number of parts
   * @returns A list of Money instances with distributed amounts
   * @throws {InvalidOperationError} If n is invalid
   */
  distribute(n: number): Money[] {
    if (!Number.isInteger(n) || n <= 0) {
      throw new InvalidOperationError(`Invalid distribution count: ${n}`);
    }
    
    const distribution = Array(n).fill(this.amount / BigInt(n));
    const remainder = this.amount % BigInt(n);
    
    // Distribute the remainder
    for (let i = 0; i < remainder; i++) {
      distribution[i] += 1n;
    }
    
    return distribution.map(amount => new Money(amount, this.currency));
  }

  /**
   * Returns the absolute value of this Money instance
   * 
   * @returns A new Money instance with the absolute amount
   */
  absolute(): Money {
    if (this.amount < 0n) {
      return this.negative();
    }
    
    return this;
  }

  /**
   * Returns the negative value of this Money instance
   * 
   * @returns A new Money instance with the negated amount
   */
  negative(): Money {
    return new Money(-this.amount, this.currency);
  }

  /**
   * Checks if this Money instance is equal to another
   * 
   * @param money The Money instance to compare with
   * @returns True if the instances are equal, false otherwise
   */
  equals(money: Money): boolean {
    if (!this.currency.equals(money.currency)) {
      return false;
    }
    
    return this.amount === money.amount;
  }

  /**
   * Checks if this Money instance is greater than another
   * 
   * @param money The Money instance to compare with
   * @returns True if this instance is greater, false otherwise
   * @throws {CurrencyMismatchError} If the currencies don't match
   */
  greaterThan(money: Money): boolean {
    this.assertSameCurrency(money);
    
    return this.amount > money.amount;
  }

  /**
   * Checks if this Money instance is greater than or equal to another
   * 
   * @param money The Money instance to compare with
   * @returns True if this instance is greater or equal, false otherwise
   * @throws {CurrencyMismatchError} If the currencies don't match
   */
  greaterThanOrEqual(money: Money): boolean {
    this.assertSameCurrency(money);
    
    return this.amount >= money.amount;
  }

  /**
   * Checks if this Money instance is less than another
   * 
   * @param money The Money instance to compare with
   * @returns True if this instance is less, false otherwise
   * @throws {CurrencyMismatchError} If the currencies don't match
   */
  lessThan(money: Money): boolean {
    this.assertSameCurrency(money);
    
    return this.amount < money.amount;
  }

  /**
   * Checks if this Money instance is less than or equal to another
   * 
   * @param money The Money instance to compare with
   * @returns True if this instance is less or equal, false otherwise
   * @throws {CurrencyMismatchError} If the currencies don't match
   */
  lessThanOrEqual(money: Money): boolean {
    this.assertSameCurrency(money);
    
    return this.amount <= money.amount;
  }

  /**
   * Checks if this Money instance is zero
   * 
   * @returns True if the amount is zero, false otherwise
   */
  isZero(): boolean {
    return this.amount === 0n;
  }

  /**
   * Checks if this Money instance is positive
   * 
   * @returns True if the amount is positive, false otherwise
   */
  isPositive(): boolean {
    return this.amount > 0n;
  }

  /**
   * Checks if this Money instance is negative
   * 
   * @returns True if the amount is negative, false otherwise
   */
  isNegative(): boolean {
    return this.amount < 0n;
  }

  /**
   * Converts this Money instance to another currency
   * 
   * @param currency The target currency code or Currency instance
   * @param exchangeRate The exchange rate from this currency to the target currency
   * @returns A new Money instance in the target currency
   * @throws {InvalidCurrencyError} If the currency code is invalid
   * @throws {InvalidAmountError} If the exchange rate is invalid
   */
  convert(currency: Currency | string, exchangeRate: number | bigint): Money {
    const targetCurrency = typeof currency === 'string' ? new Currency(currency) : currency;
    
    if (typeof exchangeRate === 'number') {
      if (isNaN(exchangeRate) || !isFinite(exchangeRate) || exchangeRate <= 0) {
        throw new InvalidAmountError(`Invalid exchange rate: ${exchangeRate}`);
      }
      
      // Convert to string to avoid floating point precision issues
      const rateStr = exchangeRate.toString();
      const [integerPart, fractionalPart = ''] = rateStr.split('.');
      const scale = BigInt(10 ** fractionalPart.length);
      
      const scaledRate = BigInt(integerPart) * scale + BigInt(fractionalPart);
      const scaledAmount = this.amount * scaledRate;
      
      // Adjust for decimal places difference between currencies
      const decimalPlacesDiff = this.currency.decimalPlaces - targetCurrency.decimalPlaces;
      let convertedAmount: bigint;
      
      if (decimalPlacesDiff > 0) {
        // Source currency has more decimal places, divide
        convertedAmount = scaledAmount / (scale * BigInt(10 ** decimalPlacesDiff));
      } else if (decimalPlacesDiff < 0) {
        // Target currency has more decimal places, multiply
        convertedAmount = scaledAmount * BigInt(10 ** -decimalPlacesDiff) / scale;
      } else {
        // Same number of decimal places
        convertedAmount = scaledAmount / scale;
      }
      
      return new Money(convertedAmount, targetCurrency);
    } else {
      // BigInt exchange rate
      if (exchangeRate <= 0n) {
        throw new InvalidAmountError('Exchange rate must be positive');
      }
      
      const convertedAmount = this.amount * exchangeRate;
      
      // Adjust for decimal places difference between currencies
      const decimalPlacesDiff = this.currency.decimalPlaces - targetCurrency.decimalPlaces;
      let adjustedAmount: bigint;
      
      if (decimalPlacesDiff > 0) {
        // Source currency has more decimal places, divide
        adjustedAmount = convertedAmount / BigInt(10 ** decimalPlacesDiff);
      } else if (decimalPlacesDiff < 0) {
        // Target currency has more decimal places, multiply
        adjustedAmount = convertedAmount * BigInt(10 ** -decimalPlacesDiff);
      } else {
        // Same number of decimal places
        adjustedAmount = convertedAmount;
      }
      
      return new Money(adjustedAmount, targetCurrency);
    }
  }

  /**
   * Formats this Money instance as a string
   * 
   * @param options Formatting options
   * @returns The formatted money string
   */
  format(options: FormatOptions = {}): string {
    const amount = this.getAmount();
    return this.currency.format(amount, options);
  }

  /**
   * Gets the amount in major units (e.g., dollars)
   * 
   * @returns The amount in major units as a string
   */
  getAmount(): string {
    return this.currency.toMajorUnits(this.amount);
  }

  /**
   * Gets the amount in minor units (e.g., cents)
   * 
   * @returns The amount in minor units as a BigInt
   */
  getAmountInMinorUnits(): bigint {
    return this.amount;
  }

  /**
   * Asserts that another Money instance has the same currency as this one
   * 
   * @param money The Money instance to check
   * @throws {CurrencyMismatchError} If the currencies don't match
   */
  private assertSameCurrency(money: Money): void {
    if (!this.currency.equals(money.currency)) {
      throw new CurrencyMismatchError(
        `Currency mismatch: ${this.currency.code} and ${money.currency.code}`
      );
    }
  }
}