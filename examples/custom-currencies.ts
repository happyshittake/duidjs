import { 
  money, 
  Currency,
  customCurrency,
  ExchangeRateProvider,
  CurrencyConverter,
  RoundingMode
} from '../src';

// Example 1: Creating custom cryptocurrencies
console.log('Example 1: Creating custom cryptocurrencies');

// Method 1: Using Currency.fromMetadata()
const bitcoin = Currency.fromMetadata({
  code: 'BTC',
  name: 'Bitcoin',
  symbol: '₿',
  decimalPlaces: 8 // Bitcoin has 8 decimal places (satoshis)
});

// Method 2: Using customCurrency() utility function
const ethereum = customCurrency({
  code: 'ETH',
  name: 'Ethereum', 
  symbol: 'Ξ',
  decimalPlaces: 18 // Ethereum has 18 decimal places (wei)
});

// Creating money instances with custom currencies
const btcAmount = money(0.05, bitcoin);
console.log('Bitcoin amount:', btcAmount.format()); // ₿0.05000000

const ethAmount = money(1.5, ethereum);
console.log('Ethereum amount:', ethAmount.format()); // Ξ1.500000000000000000

// Format with fewer decimal places for display
console.log('Ethereum with fewer decimals:', ethAmount.format({ decimalPlaces: 4 })); // Ξ1.5000

// Example 2: Custom currency operations
console.log('\nExample 2: Custom currency operations');

// Multiply Bitcoin amount
const btcDouble = btcAmount.multiply(2);
console.log('Double BTC:', btcDouble.format()); // ₿0.10000000

// Divide Ethereum amount
const ethHalf = ethAmount.divide(2);
console.log('Half ETH:', ethHalf.format()); // Ξ0.750000000000000000

// Operations maintain proper decimal places
const satoshiValue = money(0.00000001, bitcoin); // 1 satoshi
console.log('1 Satoshi:', satoshiValue.format()); // ₿0.00000001

const tenSatoshi = satoshiValue.multiply(10);
console.log('10 Satoshi:', tenSatoshi.format()); // ₿0.00000010

// Example 3: Custom currency conversion
console.log('\nExample 3: Custom currency conversion');

// Create exchange rate provider with custom currencies
const cryptoProvider = new ExchangeRateProvider({
  baseCurrency: 'USD',
  rates: {
    BTC: 0.000016, // 1 USD = 0.000016 BTC (fictional rate)
    ETH: 0.00032,  // 1 USD = 0.00032 ETH (fictional rate)
  }
});

const converter = new CurrencyConverter(cryptoProvider);

// Convert USD to crypto
const dollars = money(10000, 'USD');
console.log('USD Amount:', dollars.format()); // $10,000.00

const btcConverted = converter.convert(dollars, bitcoin);
console.log('USD to BTC:', btcConverted.format()); // ₿0.16000000

const ethConverted = converter.convert(dollars, ethereum);
console.log('USD to ETH:', ethConverted.format({ decimalPlaces: 8 })); // Ξ3.20000000

// Convert between cryptocurrencies
const ethToBtc = converter.convert(ethConverted, bitcoin);
console.log('ETH to BTC:', ethToBtc.format()); // ₿0.16000000

// Example 4: Custom currency formatting with rounding
console.log('\nExample 4: Custom currency formatting with rounding');

// Create a high precision amount
const microBtc = money(0.0012345678, bitcoin);

// Format with different rounding modes
console.log('Default rounding:', microBtc.format()); // ₿0.00123457 (HALF_UP)
console.log('FLOOR rounding:', microBtc.format({}, RoundingMode.FLOOR)); // ₿0.00123456
console.log('CEILING rounding:', microBtc.format({}, RoundingMode.CEILING)); // ₿0.00123457
console.log('No rounding:', microBtc.format({}, RoundingMode.NONE)); // ₿0.0012345678

// Custom formatting options
console.log('Without symbol:', microBtc.format({ symbol: false })); // 0.00123457
console.log('With code:', microBtc.format({ code: true })); // ₿0.00123457 BTC
console.log('Custom decimal places:', microBtc.format({ decimalPlaces: 4 })); // ₿0.0012

// Example 5: Custom game currency
console.log('\nExample 5: Custom game currency');

const gameCoin = customCurrency({
  code: 'GC',
  name: 'GameCoin',
  symbol: '🪙',
  decimalPlaces: 0 // Integer-only currency
});

const coins = money(1500, gameCoin);
console.log('Game coins:', coins.format()); // 🪙1,500

// Integer division (no decimal places)
const splitCoins = coins.distribute(3);
console.log('Split coins:', splitCoins.map(m => m.format()));
// Output: ['🪙500', '🪙500', '🪙500']