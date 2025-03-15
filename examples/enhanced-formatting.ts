import {
  money,
  moneyFromString,
  formatMoney,
  formatAccounting,
  formatFinancial,
  formatMoneyTable,
  ExtendedFormatOptions,
  RoundingMode,
  customCurrency
} from "../src";

// Basic formatting examples
console.log("Basic Formatting Examples");
console.log("========================");

const amount = money(1234.56, 'USD');
const negative = money(-1234.56, 'USD');

console.log(`Default formatting: ${amount.format()}`); // "$1,234.56"
console.log(`Negative amount: ${negative.format()}`); // "-$1,234.56"

// Format options
console.log("\nFormat Options:");
console.log(`Without symbol: ${amount.format({ symbol: false })}`); // "1,234.56"
console.log(`With currency code: ${amount.format({ code: true })}`); // "$1,234.56 USD"
console.log(`Without digit grouping: ${amount.format({ useGrouping: false })}`); // "$1234.56"
console.log(`Custom decimal places: ${amount.format({ decimalPlaces: 3 })}`); // "$1,234.560"
console.log(`Custom locale: ${amount.format({ locale: 'de-DE' })}`); // "$1.234,56"

// Formatting with different rounding modes
console.log("\nFormatting with Rounding Modes:");
const preciseAmount = money(1.98765, 'USD');
console.log(`Default rounding: ${preciseAmount.format()}`); // "$1.99" (default rounding)
console.log(`FLOOR rounding: ${preciseAmount.format({}, RoundingMode.FLOOR)}`); // "$1.98"
console.log(`CEILING rounding: ${preciseAmount.format({}, RoundingMode.CEILING)}`); // "$1.99"
console.log(`HALF_EVEN rounding: ${preciseAmount.format({}, RoundingMode.HALF_EVEN)}`); // "$1.99"
console.log(`No rounding: ${preciseAmount.format({}, RoundingMode.NONE)}`); // "$1.98765"

// Enhanced formatting functions
console.log("\nEnhanced Formatting Functions");
console.log("============================");

// formatMoney with extended options
console.log("\nformatMoney with extended options:");
const options: ExtendedFormatOptions = {
  showPositiveSign: true,
  code: true,
  useGrouping: true
};
console.log(`With positive sign: ${formatMoney(amount, options)}`); // "+$1,234.56 USD"

// Show currency name
console.log(`\nShow currency name instead of symbol:`);
console.log(formatMoney(amount, {
  showCurrencyName: true,
  symbol: false
})); // "1,234.56 US Dollar"

// Custom format for negative amounts
console.log(`\nCustom format for negative amounts:`);
console.log(formatMoney(negative, {
  negativeFormat: '(${amount})'
})); // "($1,234.56)"

// Custom format for positive amounts
console.log(`\nCustom format for positive amounts:`);
console.log(formatMoney(amount, {
  positiveFormat: '✓ ${amount}'
})); // "✓ $1,234.56"

// Accounting format (negative in parentheses)
console.log("\nAccounting Format:");
console.log(`Positive: ${formatAccounting(amount)}`); // "$1,234.56"
console.log(`Negative: ${formatAccounting(negative)}`); // "($1,234.56)"

// Financial format (with sign)
console.log("\nFinancial Format:");
console.log(`Positive: ${formatFinancial(amount)}`); // "+$1,234.56"
console.log(`Negative: ${formatFinancial(negative)}`); // "-$1,234.56"

// Formatting a table of money values (aligned columns)
console.log("\nTable Formatting:");
const values = [
  money(1234.56, 'USD'),
  money(99.99, 'USD'),
  money(-500, 'USD')
];

console.log("Default table formatting:");
console.log(formatMoneyTable(values));
// "$1,234.56
//    $99.99
//  -$500.00"

// Table with custom options
console.log("\nTable with custom options:");
console.log(formatMoneyTable(values, {
  showPositiveSign: true,
  negativeFormat: '(${amount})'
}));
// "+$1,234.56
//    +$99.99
//   ($500.00)"

// Formatting custom currencies
console.log("\nFormatting Custom Currencies");
console.log("===========================");

// Bitcoin with 8 decimal places
const bitcoin = customCurrency({
  code: 'BTC',
  name: 'Bitcoin',
  symbol: '₿',
  decimalPlaces: 8
});

const btcAmount = money(0.12345678, bitcoin);
console.log(`\nBitcoin amount (8 decimals):`);
console.log(`Default format: ${btcAmount.format()}`); // "₿0.12345678"
console.log(`With fewer decimals: ${btcAmount.format({ decimalPlaces: 4 })}`); // "₿0.1235"
console.log(`With code: ${btcAmount.format({ code: true })}`); // "₿0.12345678 BTC"

// Enhanced options with bitcoin
console.log(`\nBitcoin with enhanced formatting:`);
console.log(formatMoney(btcAmount, {
  showCurrencyName: true,
  symbol: false,
  useGrouping: false
})); // "0.12345678 Bitcoin"

// Ethereum with 18 decimal places (showing truncation)
const ethereum = customCurrency({
  code: 'ETH',
  name: 'Ethereum',
  symbol: 'Ξ',
  decimalPlaces: 18
});

const ethAmount = money(1.23456789012345678, ethereum);
console.log(`\nEthereum amount (18 decimals):`);
console.log(`Full precision: ${ethAmount.format({}, RoundingMode.NONE)}`); // All 18 decimals
console.log(`Limited to 6 decimals: ${ethAmount.format({ decimalPlaces: 6 })}`); // "Ξ1.234568"

// Mixed currency table
console.log("\nMixed Currency Table:");
const mixedValues = [
  money(1234.56, 'USD'),
  btcAmount,
  ethAmount,
  money(500, 'EUR')
];

// Format each with its own currency
console.log(mixedValues.map(m => m.format()).join('\n'));

// Using formatFinancial with different money values that use different rounding
console.log("\nFormatFinancial with Different Rounding Applied:");
// First create money with specific rounding applied using moneyFromString
const halfUpAmount = moneyFromString(preciseAmount.getAmount(RoundingMode.HALF_UP), 'USD');
const floorAmount = moneyFromString(preciseAmount.getAmount(RoundingMode.FLOOR), 'USD');
const noneAmount = moneyFromString(preciseAmount.getAmount(RoundingMode.NONE), 'USD');

console.log(`HALF_UP: ${formatFinancial(halfUpAmount)}`);
console.log(`FLOOR: ${formatFinancial(floorAmount)}`);
console.log(`NONE: ${formatFinancial(noneAmount)}`);

// Using formatAccounting with pre-rounded values
console.log("\nFormatAccounting with Pre-rounded Values:");
const halfUpNeg = moneyFromString(negative.getAmount(RoundingMode.HALF_UP), 'USD');
const ceilingNeg = moneyFromString(negative.getAmount(RoundingMode.CEILING), 'USD');

console.log(`HALF_UP: ${formatAccounting(halfUpNeg)}`);
console.log(`CEILING: ${formatAccounting(ceilingNeg)}`);

// Complex formatting example
console.log("\nComplex Formatting Example:");
const complexOptions: ExtendedFormatOptions = {
  symbol: true,
  code: true,
  useGrouping: true,
  decimalPlaces: 4,
  locale: 'en-US',
  showPositiveSign: true,
  showCurrencyName: false,
  positiveFormat: '${amount}+',
  negativeFormat: '(${amount})'
};

console.log(`Positive: ${formatMoney(amount, complexOptions)}`);
console.log(`Negative: ${formatMoney(negative, complexOptions)}`);