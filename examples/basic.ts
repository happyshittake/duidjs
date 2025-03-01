/**
 * Basic usage examples for the duidjs library
 */

import {
  money,
  moneyFromString,
  moneyFromMinorUnits,
  moneyFromBigInt,
  zero,
  Currency,
  customCurrency,
  formatAccounting,
  formatFinancial,
  ExchangeRateProvider,
  CurrencyConverter,
} from '../src';

// Creating money instances
console.log('\n--- Creating Money Instances ---');

const price = money(19.99, 'USD');
console.log('Price:', price.format()); // $19.99

const tax = moneyFromString('1.99', 'USD');
console.log('Tax:', tax.format()); // $1.99

const cents = moneyFromMinorUnits(1099, 'USD');
console.log('From cents:', cents.format()); // $10.99

const bigintAmount = moneyFromBigInt(1099n, 'USD');
console.log('From BigInt:', bigintAmount.format()); // $10.99

const emptyWallet = zero('USD');
console.log('Zero amount:', emptyWallet.format()); // $0.00

// Using Currency instance
const eur = new Currency('EUR');
const euroPrice = money(19.99, eur);
console.log('Euro price:', euroPrice.format()); // €19.99

// Basic operations
console.log('\n--- Basic Operations ---');

const total = price.add(tax);
console.log('Addition:', `${price.format()} + ${tax.format()} = ${total.format()}`);

const difference = price.subtract(tax);
console.log('Subtraction:', `${price.format()} - ${tax.format()} = ${difference.format()}`);

const doubled = price.multiply(2);
console.log('Multiplication:', `${price.format()} * 2 = ${doubled.format()}`);

const half = price.divide(2);
console.log('Division:', `${price.format()} / 2 = ${half.format()}`);

const negative = price.negative();
console.log('Negation:', `${price.format()} → ${negative.format()}`);

const absolute = negative.absolute();
console.log('Absolute:', `${negative.format()} → ${absolute.format()}`);

// Comparison
console.log('\n--- Comparison ---');

console.log('price == tax:', price.equals(tax)); // false
console.log('price > tax:', price.greaterThan(tax)); // true
console.log('price < tax:', price.lessThan(tax)); // false
console.log('tax is zero:', tax.isZero()); // false
console.log('emptyWallet is zero:', emptyWallet.isZero()); // true

// Allocation and distribution
console.log('\n--- Allocation and Distribution ---');

const budget = money(100, 'USD');
const allocated = budget.allocate([1, 2, 3]);
console.log('Allocate $100 in ratio 1:2:3:');
allocated.forEach((amount, i) => {
  console.log(`  Part ${i + 1}: ${amount.format()}`);
});

const distributed = budget.distribute(3);
console.log('Distribute $100 into 3 equal parts:');
distributed.forEach((amount, i) => {
  console.log(`  Part ${i + 1}: ${amount.format()}`);
});

// Formatting
console.log('\n--- Formatting ---');

const amount = money(1234.56, 'USD');
const negativeAmount = money(-1234.56, 'USD');

console.log('Default:', amount.format());
console.log('No symbol:', amount.format({ symbol: false }));
console.log('With code:', amount.format({ code: true }));
console.log('No grouping:', amount.format({ useGrouping: false }));
console.log('Accounting format (positive):', formatAccounting(amount));
console.log('Accounting format (negative):', formatAccounting(negativeAmount));
console.log('Financial format (positive):', formatFinancial(amount));
console.log('Financial format (negative):', formatFinancial(negativeAmount));

// Currency conversion
console.log('\n--- Currency Conversion ---');

// Create exchange rate provider
const provider = new ExchangeRateProvider({
  baseCurrency: 'USD',
  rates: {
    EUR: 0.85,
    GBP: 0.75,
    JPY: 110.0,
  },
});

// Create converter
const converter = new CurrencyConverter(provider);

// Convert money
const usd = money(100, 'USD');
console.log('Original:', usd.format());

const eur2 = converter.convert(usd, 'EUR');
console.log('Converted to EUR:', eur2.format());

const gbp = converter.convert(usd, 'GBP');
console.log('Converted to GBP:', gbp.format());

const jpy = converter.convert(usd, 'JPY');
console.log('Converted to JPY:', jpy.format());

// Error handling
console.log('\n--- Error Handling ---');

try {
  // This will throw a CurrencyMismatchError
  const sum = usd.add(eur2);
  console.log('Sum:', sum.format());
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : String(error));
}

// Custom currencies
console.log('\n--- Custom Currencies ---');

// Create Bitcoin as a custom currency
const bitcoin = Currency.fromMetadata({
  code: 'BTC',
  name: 'Bitcoin',
  symbol: '₿',
  decimalPlaces: 8
});

const btcAmount = money(0.05, bitcoin);
console.log('Bitcoin amount:', btcAmount.format()); // ₿0.05000000

// Using utility function
const ethereum = customCurrency({
  code: 'ETH',
  name: 'Ethereum',
  symbol: 'Ξ',
  decimalPlaces: 18
});

const ethAmount = money(1.5, ethereum);
console.log('Ethereum amount:', ethAmount.format()); // Ξ1.500000000000000000

// Format with specific options
console.log('BTC with code:', btcAmount.format({ code: true, symbol: false })); // 0.05000000 BTC
console.log('ETH with 4 decimals:', ethAmount.format({ decimalPlaces: 4 })); // Ξ1.5000