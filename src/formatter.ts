/**
 * Formatting utilities for the duidjs library
 */

import { Money } from './money';
import type { FormatOptions } from './currency';

/**
 * Extended format options for money formatting
 */
export interface ExtendedFormatOptions extends FormatOptions {
  /** Whether to show a plus sign for positive amounts */
  showPositiveSign?: boolean;
  /** Whether to show the currency name instead of the symbol */
  showCurrencyName?: boolean;
  /** Custom format for negative amounts (e.g., '(${amount})' or '-${amount}') */
  negativeFormat?: string;
  /** Custom format for positive amounts (e.g., '+${amount}' or '${amount}') */
  positiveFormat?: string;
}

/**
 * Formats a Money instance with extended options
 * 
 * @param money The Money instance to format
 * @param options Extended formatting options
 * @returns The formatted money string
 */
export function formatMoney(money: Money, options: ExtendedFormatOptions = {}): string {
  const {
    showPositiveSign = false,
    showCurrencyName = false,
    negativeFormat,
    positiveFormat,
    ...baseOptions
  } = options;

  // Get the base formatted amount
  let formatted = money.format({
    ...baseOptions,
    symbol: !showCurrencyName && (baseOptions.symbol !== false),
    code: showCurrencyName || baseOptions.code,
  });

  // Apply custom formatting for positive/negative amounts
  if (money.isNegative()) {
    if (negativeFormat) {
      // Replace ${amount} placeholder with the formatted amount (without the negative sign)
      formatted = negativeFormat.replace('${amount}', formatted.replace('-', ''));
    } else {
      // Ensure negative sign is at the beginning for financial formatting
      if (formatted.startsWith('$') || formatted.startsWith('€') || formatted.startsWith('£') ||
          formatted.startsWith('¥') || formatted.startsWith('₹')) {
        // Move negative sign before the currency symbol
        formatted = formatted.replace(/^([^\d-]+)-/, '-$1');
      }
    }
  } else {
    if (showPositiveSign && !money.isZero()) {
      formatted = '+' + formatted;
    }
    
    if (positiveFormat && !money.isZero()) {
      // Replace ${amount} placeholder with the formatted amount
      formatted = positiveFormat.replace('${amount}', formatted);
    }
  }

  return formatted;
}

/**
 * Formats a list of Money instances as a table
 * 
 * @param moneyList The list of Money instances to format
 * @param options Formatting options
 * @returns The formatted table as a string
 */
export function formatMoneyTable(
  moneyList: Money[],
  options: ExtendedFormatOptions = {}
): string {
  if (moneyList.length === 0) {
    return '';
  }

  // Format each money instance
  const formattedList = moneyList.map(money => formatMoney(money, options));
  
  // Find the maximum length
  const maxLength = Math.max(...formattedList.map(str => str.length));
  
  // Pad each string to align them
  const paddedList = formattedList.map(str => str.padStart(maxLength));
  
  return paddedList.join('\n');
}

/**
 * Formats a Money instance as an accounting string (negative values in parentheses)
 * 
 * @param money The Money instance to format
 * @param options Formatting options
 * @returns The formatted accounting string
 */
export function formatAccounting(money: Money, options: FormatOptions = {}): string {
  return formatMoney(money, {
    ...options,
    negativeFormat: '(${amount})',
  });
}

/**
 * Formats a Money instance for display in a financial context
 * 
 * @param money The Money instance to format
 * @param options Formatting options
 * @returns The formatted financial string
 */
export function formatFinancial(money: Money, options: FormatOptions = {}): string {
  return formatMoney(money, {
    ...options,
    showPositiveSign: true,
    useGrouping: true,
  });
}