# TypeScript Money Management Library (duidjs) - Implementation Plan

## Overview
This document outlines the plan for implementing a TypeScript library for handling money operations, similar to [go-money](https://github.com/Rhymond/go-money). The library will provide a robust way to represent monetary values, perform arithmetic operations, handle different currencies, and format money for display.

## Core Features

1. **Money Representation**
   - Immutable Money class that stores amount and currency
   - Internal storage as BigInt for cents/minor units to avoid floating-point errors
   - No external dependencies for arithmetic operations
   - Support for various currencies

2. **Currency Support**
   - Currency class with ISO currency codes
   - Currency metadata (symbol, decimal places, etc.)
   - Pre-defined list of standard currencies

3. **Money Operations**
   - Addition and subtraction (with same currency validation)
   - Multiplication and division (by numeric values)
   - Comparison operations (equals, greater than, less than)
   - Allocation/distribution (splitting money into parts)
   - Absolute value, negation

4. **Currency Conversion**
   - Exchange rate management
   - Conversion between different currencies

5. **Formatting**
   - Format money values according to locale
   - Custom formatting options

6. **Error Handling**
   - Custom error types for different error scenarios
   - Comprehensive validation

## Implementation Phases

### Phase 1: Core Money and Currency Classes
1. Implement Currency class with ISO currency data
2. Implement Money class with basic operations
3. Set up proper decimal handling using BigInt for precise arithmetic
4. Implement validation logic

### Phase 2: Advanced Operations
1. Implement allocation/distribution methods
2. Add comparison operations
3. Implement rounding strategies

### Phase 3: Currency Conversion
1. Implement exchange rate management
2. Add conversion methods

### Phase 4: Formatting and Display
1. Implement formatting methods
2. Add locale support

### Phase 5: Testing and Documentation
1. Write comprehensive unit tests using Bun's built-in testing framework
2. Create documentation and usage examples
3. Set up CI/CD pipeline

## Project Structure

```
duidjs/
├── src/
│   ├── index.ts              # Main entry point
│   ├── money.ts              # Money class implementation
│   ├── currency.ts           # Currency class and definitions
│   ├── currencies/           # Currency data
│   │   └── iso.ts            # ISO currency definitions
│   ├── conversion/           # Currency conversion
│   │   ├── exchange-rate.ts  # Exchange rate management
│   │   └── converter.ts      # Currency converter
│   ├── formatter.ts          # Formatting utilities
│   └── errors.ts             # Custom error types
├── tests/                    # Test directory
│   ├── money.test.ts
│   ├── currency.test.ts
│   └── ...
├── examples/                 # Usage examples
├── package.json
├── tsconfig.json
└── README.md
```

## API Design (Draft)

### Money Class
```typescript
class Money {
  // Constructors
  static fromFloat(amount: number, currency: Currency | string): Money;
  static fromInt(amount: number, currency: Currency | string): Money;
  static fromString(amount: string, currency: Currency | string): Money;
  
  // Properties
  readonly amount: bigint;  // Amount in minor units (cents) stored as BigInt
  readonly currency: Currency;
  
  // Basic operations
  add(money: Money): Money;
  subtract(money: Money): Money;
  multiply(multiplier: number | bigint): Money;
  divide(divisor: number | bigint): Money;
  
  // Comparison
  equals(money: Money): boolean;
  greaterThan(money: Money): boolean;
  greaterThanOrEqual(money: Money): boolean;
  lessThan(money: Money): boolean;
  lessThanOrEqual(money: Money): boolean;
  
  // Other operations
  allocate(ratios: number[]): Money[];
  distribute(n: number): Money[];
  absolute(): Money;
  negative(): Money;
  
  // Conversion
  convert(currency: Currency | string, exchangeRate: number | bigint): Money;
  
  // Formatting
  format(options?: FormatOptions): string;
  
  // Utility
  getAmount(): string;  // Amount in major units (dollars) as string to preserve precision
  getAmountInMinorUnits(): bigint;  // Amount in minor units (cents) as BigInt
}
```

### Currency Class
```typescript
class Currency {
  // Properties
  readonly code: string;  // ISO currency code
  readonly symbol: string;
  readonly name: string;
  readonly decimalPlaces: number;
  
  // Methods
  equals(currency: Currency): boolean;
  format(amount: number, options?: FormatOptions): string;
  
  // Static methods
  static fromCode(code: string): Currency;
}
```

## Development Approach
1. Use TypeScript for type safety and better developer experience
2. Ensure immutability for all money operations
3. Follow TDD (Test-Driven Development) approach
4. Aim for 100% test coverage
5. Provide comprehensive documentation

## Dependencies
- No external dependencies for core functionality
  - Using native BigInt for precise arithmetic
  - Using Bun's built-in testing framework (bun test)

## Publishing
1. Package the library for npm
2. Set up proper versioning using semantic versioning
3. Create comprehensive README and documentation

## Timeline (Estimated)
- Phase 1: 2-3 days
- Phase 2: 2-3 days
- Phase 3: 1-2 days
- Phase 4: 1-2 days
- Phase 5: 2-3 days

Total: 8-13 days for a complete implementation