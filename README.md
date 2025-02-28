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
  zero 
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
```

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

```typescript
import { money, formatAccounting, formatFinancial } from 'duidjs';

const amount = money(1234.56, 'USD');
const negative = money(-1234.56, 'USD');

// Default formatting
console.log(amount.format()); // "$1,234.56"

// Custom formatting
console.log(amount.format({
  symbol: false,
  code: true,
  useGrouping: false,
})); // "1234.56 USD"

// Accounting format (negative in parentheses)
console.log(formatAccounting(negative)); // "($1,234.56)"

// Financial format (with sign)
console.log(formatFinancial(amount)); // "+$1,234.56"
```

### Currency Conversion

```typescript
import { 
  money, 
  ExchangeRateProvider, 
  CurrencyConverter 
} from 'duidjs';

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
const eur = converter.convert(usd, 'EUR');

console.log(eur.format()); // "€85.00"

// Convert to multiple currencies
const converted = converter.convertToMultiple(usd, ['EUR', 'GBP', 'JPY']);
console.log(converted.get('EUR')?.format()); // "€85.00"
console.log(converted.get('GBP')?.format()); // "£75.00"
console.log(converted.get('JPY')?.format()); // "¥11,000"
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

## Release Process

This project uses GitHub Actions to automatically publish to npm when a new release is created.

To release a new version:

1. Update the version in `package.json`
2. Commit your changes
3. Create a new release on GitHub
4. The GitHub Action will automatically:
   - Run tests
   - Build the package
   - Publish to npm

## License

MIT
