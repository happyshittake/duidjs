/**
 * Custom error types for the duidjs library
 */

/**
 * Base error class for all duidjs errors
 */
export class DuidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuidError';
    Object.setPrototypeOf(this, DuidError.prototype);
  }
}

/**
 * Error thrown when an operation is performed with incompatible currencies
 */
export class CurrencyMismatchError extends DuidError {
  constructor(message: string = 'Currency mismatch') {
    super(message);
    this.name = 'CurrencyMismatchError';
    Object.setPrototypeOf(this, CurrencyMismatchError.prototype);
  }
}

/**
 * Error thrown when an invalid currency code is provided
 */
export class InvalidCurrencyError extends DuidError {
  constructor(message: string = 'Invalid currency code') {
    super(message);
    this.name = 'InvalidCurrencyError';
    Object.setPrototypeOf(this, InvalidCurrencyError.prototype);
  }
}

/**
 * Error thrown when an invalid operation is attempted
 */
export class InvalidOperationError extends DuidError {
  constructor(message: string = 'Invalid operation') {
    super(message);
    this.name = 'InvalidOperationError';
    Object.setPrototypeOf(this, InvalidOperationError.prototype);
  }
}

/**
 * Error thrown when an invalid amount is provided
 */
export class InvalidAmountError extends DuidError {
  constructor(message: string = 'Invalid amount') {
    super(message);
    this.name = 'InvalidAmountError';
    Object.setPrototypeOf(this, InvalidAmountError.prototype);
  }
}

/**
 * Error thrown when an allocation operation fails
 */
export class AllocationError extends DuidError {
  constructor(message: string = 'Allocation error') {
    super(message);
    this.name = 'AllocationError';
    Object.setPrototypeOf(this, AllocationError.prototype);
  }
}