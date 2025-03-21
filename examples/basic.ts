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
  CurrencyCode,
  customCurrency,
  formatAccounting,
  formatFinancial,
  formatMoney,
  formatMoneyTable,
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

// Ratio Calculation
console.log('\n--- Ratio Calculation ---');

const product = money(25, 'USD');
const cartTotal = money(100, 'USD');
console.log('Product ratio to total:', `${product.format()} / ${cartTotal.format()} = ${product.ratioTo(cartTotal)}`); // 0.25 (25%)

const taxAmount = money(5, 'USD');
const itemPrice = money(50, 'USD');
console.log('Tax rate:', `${taxAmount.format()} / ${itemPrice.format()} = ${taxAmount.ratioTo(itemPrice) * 100}%`); // 10%

const rent = money(1000, 'USD');
const expenses = money(2500, 'USD');
console.log('Rent portion of expenses:', `${rent.format()} / ${expenses.format()} = ${rent.ratioTo(expenses) * 100}%`); // 40%

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

// Basic formatting
console.log('Default:', amount.format());
console.log('No symbol:', amount.format({ symbol: false }));
console.log('With code:', amount.format({ code: true }));
console.log('No grouping:', amount.format({ useGrouping: false }));

// Enhanced formatting with formatMoney
console.log('\n--- Enhanced Formatting ---');
console.log('Show positive sign:', formatMoney(amount, { showPositiveSign: true }));
console.log('Show currency name:', formatMoney(amount, { showCurrencyName: true }));
console.log('Custom positive format:', formatMoney(amount, { positiveFormat: '+${amount}+' }));
console.log('Custom negative format:', formatMoney(negativeAmount, { negativeFormat: '(${amount})' }));

// Format money table
console.log('\n--- Format Money Table ---');
const tableValues = [
  money(1234.56, 'USD'),
  money(99.99, 'USD'),
  money(-500, 'USD')
];
console.log(formatMoneyTable(tableValues));

// Accounting and financial formatting
console.log('\n--- Specialized Formatting ---');
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

// Type-safe currency codes
console.log('\n--- Type-Safe Currency Codes ---');

// Using CurrencyCode enum with Currency.from()
const typeSafeUsd = Currency.from(CurrencyCode.USD);
console.log('Type-safe USD currency:', typeSafeUsd.code, typeSafeUsd.symbol);

// Using CurrencyCode enum directly with money functions
const yenAmount = money(10000, CurrencyCode.JPY);
console.log('Yen amount using enum:', yenAmount.format());

const rupiah = moneyFromString('50000', CurrencyCode.IDR);
console.log('Rupiah amount using enum:', rupiah.format());

// Comparing approaches
console.log('\nComparing approaches:');
console.log('String approach: money(100, "SGD")');
console.log('Type-safe approach: money(100, CurrencyCode.SGD)');