# DuidJS

A TypeScript library for handling money operations with precision using BigInt.

## Features

- 💰 **Precise Money Representation**: Uses BigInt for accurate decimal arithmetic without floating-point errors
- 🌍 **Currency Support**: Comprehensive ISO currency definitions with proper handling of different decimal places
- 🧮 **Money Operations**: Addition, subtraction, multiplication, division, and comparison
- 💱 **Currency Conversion**: Convert between different currencies with exchange rates
- 📊 **Allocation/Distribution**: Split money into parts based on ratios or equal distribution
- 🖨️ **Formatting**: Format money values according to locale and custom options
- 🔄 **Immutability**: All operations return new instances, preserving the original values

## Installation

```bash
# Using npm
npm install duidjs

# Using yarn
yarn add duidjs

# Using bun
bun add duidjs
```

## Usage

### Basic Usage

```typescript
import { money, Currency } from 'duidjs';

// Create money instances
const price = money(19.99, 'USD');
const tax = money(1.99, 'USD');

// Perform operations
const total = price.add(tax);
console.log(total.format()); // "$21.98"

// Check conditions
if (total.greaterThan(money(20, 'USD'))) {
  console.log('Total is greater than $20');
}
```

### Creating Money Instances

```typescript
import {
  money,
  moneyFromString,
  moneyFromMinorUnits,
  moneyFromBigInt,
  zero,
  Currency,
  CurrencyCode
} from 'duidjs';

// From floating-point (dollars)
const a = money(10.99, 'USD');

// From string (dollars)
const b = moneyFromString('10.99', 'USD');

// From integer minor units (cents)
const c = moneyFromMinorUnits(1099, 'USD');

// From BigInt minor units (cents)
const d = moneyFromBigInt(1099n, 'USD');

// Zero amount
const e = zero('USD');

// Using Currency instance
const usd = new Currency('USD');
const f = money(10.99, usd);

// Using type-safe currency code from the CurrencyCode enum
import { CurrencyCode } from 'duidjs';
const g = money(10.99, CurrencyCode.USD);
```

### Creating Custom Currencies

DuidJS supports creating custom currencies that aren't part of the standard ISO currency list. This is useful for cryptocurrencies, loyalty points, in-game currencies, or any other monetary value that doesn't fit standard currencies.

There are two ways to create custom currencies:

#### Method 1: Using Currency.fromMetadata()

```typescript
import { Currency, money } from 'duidjs';

// Create Bitcoin as a custom currency
const bitcoin = Currency.fromMetadata({
  code: 'BTC',
  name: 'Bitcoin',
  symbol: '₿',
  decimalPlaces: 8  // Bitcoin has 8 decimal places (satoshis)
});

// Use the custom currency
const btcAmount = money(0.05, bitcoin);
console.log(btcAmount.format()); // ₿0.05000000
```

#### Method 2: Using customCurrency() utility function

```typescript
import { customCurrency, money } from 'duidjs';

// Create Ethereum as a custom currency
const ethereum = customCurrency({
  code: 'ETH',
  name: 'Ethereum',
  symbol: 'Ξ',
  decimalPlaces: 18  // Ethereum has 18 decimal places (wei)
});

// Use the custom currency
const ethAmount = money(1.5, ethereum);
console.log(ethAmount.format()); // Ξ1.500000000000000000

// Format with fewer decimal places for display
console.log(ethAmount.format({ decimalPlaces: 4 })); // Ξ1.5000
```

Both methods require the following parameters:

- `code`: A unique identifier for the currency (e.g., 'BTC')
- `name`: Human-readable name (e.g., 'Bitcoin')
- `symbol`: The currency symbol (e.g., '₿')
- `decimalPlaces`: Number of decimal places (e.g., 8 for Bitcoin, 18 for Ethereum)

### Money Operations

```typescript
import { money } from 'duidjs';

const a = money(10.99, 'USD');
const b = money(5.99, 'USD');

// Addition
const sum = a.add(b);
console.log(sum.getAmount()); // "16.98"

// Subtraction
const diff = a.subtract(b);
console.log(diff.getAmount()); // "5.00"

// Multiplication
const product = a.multiply(3);
console.log(product.getAmount()); // "32.97"

// Division
const quotient = a.divide(2);
console.log(quotient.getAmount()); // "5.50"

// Absolute value
const negative = money(-10.99, 'USD');
const abs = negative.absolute();
console.log(abs.getAmount()); // "10.99"

// Negation
const negated = a.negative();
console.log(negated.getAmount()); // "-10.99"
```

### Comparison

```typescript
import { money } from 'duidjs';

const a = money(10.99, 'USD');
const b = money(5.99, 'USD');
const c = money(10.99, 'USD');

// Equality
console.log(a.equals(c)); // true
console.log(a.equals(b)); // false

// Comparison
console.log(a.greaterThan(b)); // true
console.log(a.lessThan(b)); // false
console.log(a.greaterThanOrEqual(c)); // true

// State checks
console.log(a.isZero()); // false
console.log(a.isPositive()); // true
console.log(a.isNegative()); // false
```

### Allocation and Distribution

```typescript
import { money } from 'duidjs';

const total = money(10, 'USD');

// Allocate according to ratios
const allocated = total.allocate([1, 2, 3]);
console.log(allocated.map(m => m.getAmount())); 
// ["1.67", "3.33", "5.00"]

// Distribute into equal parts
const distributed = total.distribute(3);
console.log(distributed.map(m => m.getAmount())); 
// ["3.34", "3.33", "3.33"]
```

### Formatting

DuidJS offers flexible formatting options for displaying monetary values, from basic to complex presentation formats.

#### Basic Formatting

```typescript
import { money } from 'duidjs';

const amount = money(1234.56, 'USD');

// Default formatting
console.log(amount.format()); // "$1,234.56"

// Without symbol
console.log(amount.format({ symbol: false })); // "1,234.56"

// With currency code
console.log(amount.format({ code: true })); // "$1,234.56 USD"

// Without digit grouping
console.log(amount.format({ useGrouping: false })); // "$1234.56"

// Custom decimal places
console.log(amount.format({ decimalPlaces: 3 })); // "$1,234.560"

// Custom locale
console.log(amount.format({ locale: 'de-DE' })); // "$1.234,56"
```

#### Enhanced Formatting Options

```typescript
import {
  money,
  formatMoney,
  formatAccounting,
  formatFinancial,
  formatMoneyTable,
  ExtendedFormatOptions
} from 'duidjs';

const amount = money(1234.56, 'USD');
const negative = money(-1234.56, 'USD');

// Show positive sign (useful for financial displays)
console.log(formatMoney(amount, {
  showPositiveSign: true
})); // "+$1,234.56"

// Show currency name instead of symbol
console.log(formatMoney(amount, {
  showCurrencyName: true
})); // "1,234.56 USD"

// Custom format for negative amounts
console.log(formatMoney(negative, {
  negativeFormat: '(${amount})'
})); // "($1,234.56)"

// Custom format for positive amounts
console.log(formatMoney(amount, {
  positiveFormat: '✓ ${amount}'
})); // "✓ $1,234.56"

// Combining multiple options
const options: ExtendedFormatOptions = {
  showPositiveSign: true,
  code: true,
  useGrouping: true,
  negativeFormat: '(${amount})',
  positiveFormat: '${amount}+'
};
console.log(formatMoney(amount, options)); // "$1,234.56+ USD"
```

#### Specialized Formatting Functions

```typescript
// Accounting format (negative in parentheses)
console.log(formatAccounting(amount)); // "$1,234.56"
console.log(formatAccounting(negative)); // "($1,234.56)"

// Financial format (with sign)
console.log(formatFinancial(amount)); // "+$1,234.56"
console.log(formatFinancial(negative)); // "-$1,234.56"

// Formatting a table of money values (aligned columns)
const values = [
  money(1234.56, 'USD'),
  money(99.99, 'USD'),
  money(-500, 'USD')
];
console.log(formatMoneyTable(values));
// "$1,234.56
//    $99.99
//  -$500.00"

// Table with custom options
console.log(formatMoneyTable(values, {
  showPositiveSign: true,
  negativeFormat: '(${amount})'
}));
// "+$1,234.56
//    +$99.99
//   ($500.00)"
```

### Rounding Modes

DuidJS provides multiple rounding modes to handle various financial and mathematical scenarios, with special support for currencies with different decimal places.

```typescript
import { money, RoundingMode, RoundingConfig, customCurrency } from 'duidjs';

// Available rounding modes:
// - HALF_UP: Round towards nearest neighbor, ties round up (default)
// - HALF_DOWN: Round towards nearest neighbor, ties round down
// - HALF_EVEN: Round towards nearest neighbor, ties round towards even neighbor (Banker's rounding)
// - CEILING: Round towards positive infinity
// - FLOOR: Round towards negative infinity
// - UP: Round away from zero
// - DOWN: Round towards zero (truncate)
// - NONE: No rounding, preserves currency's decimal places + 4 decimal places

// Set global default rounding mode
RoundingConfig.setDefaultRoundingMode(RoundingMode.HALF_UP);

// Basic usage with standard currencies
const price = money(10, 'USD');
console.log(price.divide(3).getAmount()); // "3.33" (HALF_UP)
console.log(price.divide(3).getAmount(RoundingMode.FLOOR)); // "3.33" (FLOOR)
console.log(price.divide(3).getAmount(RoundingMode.NONE)); // "3.333333" (preserves USD decimal places (2) + 4 decimal places)

// Formatting with different rounding modes
const preciseAmount = money(1.98765, 'USD');
console.log(preciseAmount.format()); // "$1.99" (default rounding)
console.log(preciseAmount.format({}, RoundingMode.FLOOR)); // "$1.98" (FLOOR rounding)
console.log(preciseAmount.format({}, RoundingMode.NONE)); // "$1.98765" (no rounding)

// Custom currencies with different decimal places
const bitcoin = customCurrency({
  code: 'BTC',
  name: 'Bitcoin',
  symbol: '₿',
  decimalPlaces: 8 // Bitcoin uses 8 decimal places
});

const satoshiValue = money(1, bitcoin);
console.log(satoshiValue.format()); // "₿1.00000000" (default formatting)

// Division with custom rounding for cryptocurrencies
const halfSatoshi = satoshiValue.divide(2);
console.log('Half Bitcoin:');
console.log(halfSatoshi.format()); // "₿0.50000000" (default rounding)
console.log(halfSatoshi.format({}, RoundingMode.NONE)); // "₿0.50000000" (no rounding)

// Custom decimal places in formatting
console.log(halfSatoshi.format({ decimalPlaces: 4 })); // "₿0.5000" (custom decimals)

// High-precision cryptocurrency (like Ethereum with 18 decimals)
const ethereum = customCurrency({
  code: 'ETH',
  name: 'Ethereum',
  symbol: 'Ξ',
  decimalPlaces: 18
});

const wei = money(1.5, ethereum);
console.log(wei.format()); // "Ξ1.500000000000000000" (full 18 decimals)
console.log(wei.format({ decimalPlaces: 6 })); // "Ξ1.500000" (limited to 6 decimals)
console.log(wei.format({ decimalPlaces: 6 }, RoundingMode.CEILING)); // "Ξ1.500000" (with ceiling rounding)

// Combining format options with rounding modes
console.log(wei.format({
  symbol: false,
  code: true,
  decimalPlaces: 8
}, RoundingMode.HALF_EVEN)); // "1.50000000 ETH" (banker's rounding)
```

### Currency Conversion

DuidJS provides a flexible way to convert between currencies, including custom currencies. The exchange rate system supports various rate providers and conversion strategies.

#### Basic Currency Conversion

```typescript
import {
  money,
  ExchangeRateProvider,
  CurrencyConverter,
  RoundingMode
} from 'duidjs';

// Create exchange rate provider with standard currencies
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

// Basic conversion
const usd = money(100, 'USD');
const eur = converter.convert(usd, 'EUR');
console.log(eur.format()); // "€85.00"

// Convert with custom rounding mode
const jpyPrecise = converter.convert(usd, 'JPY', RoundingMode.NONE);
console.log(jpyPrecise.format()); // "¥11,000.00"
console.log(jpyPrecise.format({}, RoundingMode.NONE)); // "¥11,000" (exact value)

// Convert to multiple currencies at once
const converted = converter.convertToMultiple(usd, ['EUR', 'GBP', 'JPY']);
console.log(converted.get('EUR')?.format()); // "€85.00"
console.log(converted.get('GBP')?.format()); // "£75.00"
console.log(converted.get('JPY')?.format()); // "¥11,000"
```

#### Working with Custom Currencies

```typescript
import {
  money,
  customCurrency,
  ExchangeRateProvider,
  CurrencyConverter
} from 'duidjs';

// Define custom cryptocurrencies
const bitcoin = customCurrency({
  code: 'BTC',
  name: 'Bitcoin',
  symbol: '₿',
  decimalPlaces: 8
});

const ethereum = customCurrency({
  code: 'ETH',
  name: 'Ethereum',
  symbol: 'Ξ',
  decimalPlaces: 18
});

// Create exchange rate provider with custom currencies
const cryptoProvider = new ExchangeRateProvider({
  baseCurrency: 'USD',
  rates: {
    BTC: 0.000016,  // 1 USD = 0.000016 BTC
    ETH: 0.00032,   // 1 USD = 0.00032 ETH
  }
});

// Create converter for crypto
const cryptoConverter = new CurrencyConverter(cryptoProvider);

// Convert USD to Bitcoin
const dollars = money(10000, 'USD');
const btc = cryptoConverter.convert(dollars, bitcoin);
console.log(btc.format()); // "₿0.16000000"

// Convert between cryptocurrencies
const eth = cryptoConverter.convert(btc, ethereum);
console.log(eth.format({ decimalPlaces: 8 })); // "Ξ20.00000000"

// Format with fewer decimals for display
console.log(btc.format({ decimalPlaces: 4 })); // "₿0.1600"
```

#### Dynamic Exchange Rate Providers

For real-world applications, you can implement dynamic exchange rate providers that fetch rates from external APIs:

```typescript
import { ExchangeRateProvider, CurrencyConverter, money } from 'duidjs';

// Example of a dynamic provider (implementation would depend on your API source)
class LiveExchangeRateProvider extends ExchangeRateProvider {
  constructor() {
    super({ baseCurrency: 'USD', rates: {} });
  }

  // Override the getRate method to fetch live rates
  async getRate(fromCurrency, toCurrency) {
    // In a real implementation, you would fetch the rate from an API
    // This is just an example placeholder
    const rate = await fetchRateFromAPI(fromCurrency, toCurrency);
    return rate;
  }
}

// Usage with async/await
async function convertCurrency() {
  const provider = new LiveExchangeRateProvider();
  const converter = new CurrencyConverter(provider);
  
  const usd = money(100, 'USD');
  const eur = await converter.convertAsync(usd, 'EUR');
  
  console.log(eur.format()); // Displays the converted amount with current rates
}
```

## Error Handling

```typescript
import { money, CurrencyMismatchError } from 'duidjs';

const usd = money(10, 'USD');
const eur = money(10, 'EUR');

try {
  // This will throw a CurrencyMismatchError
  const sum = usd.add(eur);
} catch (error) {
  if (error instanceof CurrencyMismatchError) {
    console.error('Cannot add different currencies');
  }
}
```

## Running Tests

```bash
# Using bun
bun test
```

## License

MIT
