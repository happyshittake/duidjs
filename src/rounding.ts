/**
 * Rounding functionality for the duidjs library
 */

import { InvalidAmountError } from "./errors";

/**
 * Rounding modes for monetary calculations
 */
export enum RoundingMode {
  /**
   * Round towards positive infinity (ceiling)
   * Example: 1.984 -> 1.99, -1.984 -> -1.98
   */
  CEILING = "CEILING",
  
  /**
   * Round towards negative infinity (floor)
   * Example: 1.984 -> 1.98, -1.984 -> -1.99
   */
  FLOOR = "FLOOR",
  
  /**
   * Round towards zero (truncate)
   * Example: 1.984 -> 1.98, -1.984 -> -1.98
   */
  DOWN = "DOWN",
  
  /**
   * Round away from zero
   * Example: 1.984 -> 1.99, -1.984 -> -1.99
   */
  UP = "UP",
  
  /**
   * Round towards nearest neighbor, ties round up
   * Example: 1.985 -> 1.99, 1.984 -> 1.98
   */
  HALF_UP = "HALF_UP",
  
  /**
   * Round towards nearest neighbor, ties round down
   * Example: 1.985 -> 1.98, 1.986 -> 1.99
   */
  HALF_DOWN = "HALF_DOWN",
  
  /**
   * Round towards nearest neighbor, ties round towards even neighbor
   * Example: 1.985 -> 1.98, 1.975 -> 1.98
   */
  HALF_EVEN = "HALF_EVEN",
  
  /**
   * No rounding - preserve all decimal places
   * Example: 1.98765 -> 1.98765
   */
  NONE = "NONE"
}

/**
 * Configuration for rounding behavior
 */
export class RoundingConfig {
  /**
   * The default rounding mode to use
   */
  private static _defaultRoundingMode: RoundingMode = RoundingMode.HALF_UP;
  
  /**
   * Get the default rounding mode
   */
  static get defaultRoundingMode(): RoundingMode {
    return RoundingConfig._defaultRoundingMode;
  }
  
  /**
   * Set the default rounding mode globally
   */
  static setDefaultRoundingMode(mode: RoundingMode): void {
    RoundingConfig._defaultRoundingMode = mode;
  }
}

/**
 * Rounds a number according to the specified rounding mode
 * 
 * @param value The value to round
 * @param decimalPlaces The number of decimal places to round to
 * @param mode The rounding mode to use
 * @returns The rounded value
 */
export function round(
  value: number | string,
  decimalPlaces: number,
  mode: RoundingMode = RoundingConfig.defaultRoundingMode
): string {
  // Convert to number if string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Handle special cases
  if (isNaN(numValue) || !isFinite(numValue)) {
    throw new InvalidAmountError(`Cannot round invalid number: ${value}`);
  }
  
  // Special case for NONE mode - preserve all decimal places
  if (mode === RoundingMode.NONE) {
    return numValue.toString();
  }
  
  // If decimal places is 0, we can use simpler methods
  if (decimalPlaces === 0) {
    switch (mode) {
      case RoundingMode.CEILING:
        return Math.ceil(numValue).toString();
      case RoundingMode.FLOOR:
        return Math.floor(numValue).toString();
      case RoundingMode.DOWN:
        return (numValue >= 0 ? Math.floor(numValue) : Math.ceil(numValue)).toString();
      case RoundingMode.UP:
        return (numValue >= 0 ? Math.ceil(numValue) : Math.floor(numValue)).toString();
      case RoundingMode.HALF_UP:
        // For HALF_UP, we need to handle negative numbers correctly
        const fractionHalfUp = Math.abs(numValue) - Math.floor(Math.abs(numValue));
        if (fractionHalfUp < 0.5) {
          // Less than half, round down
          return (numValue >= 0
            ? Math.floor(numValue)
            : Math.ceil(numValue)).toString();
        } else {
          // Half or more, round up
          return (numValue >= 0
            ? Math.ceil(numValue)
            : Math.floor(numValue)).toString();
        }
      case RoundingMode.HALF_DOWN:
        // For HALF_DOWN, we need to check if the fraction is exactly 0.5
        const fractionHalfDown = Math.abs(numValue) - Math.floor(Math.abs(numValue));
        if (fractionHalfDown < 0.5) {
          // Less than half, round down
          return (numValue >= 0
            ? Math.floor(numValue)
            : Math.ceil(numValue)).toString();
        } else if (fractionHalfDown > 0.5) {
          // More than half, round up
          return (numValue >= 0
            ? Math.ceil(numValue)
            : Math.floor(numValue)).toString();
        } else {
          // Exactly half, round down
          return (numValue >= 0
            ? Math.floor(numValue)
            : Math.ceil(numValue)).toString();
        }
      case RoundingMode.HALF_EVEN:
        return Math.round(numValue).toString();
      default:
        return Math.round(numValue).toString();
    }
  }
  
  // For decimal places > 0, we need more precise handling
  const factor = 10 ** decimalPlaces;
  const scaledValue = numValue * factor;
  
  // Apply rounding based on mode
  let roundedScaledValue: number;
  switch (mode) {
    case RoundingMode.CEILING:
      roundedScaledValue = Math.ceil(scaledValue);
      break;
    case RoundingMode.FLOOR:
      roundedScaledValue = Math.floor(scaledValue);
      break;
    case RoundingMode.DOWN:
      roundedScaledValue = scaledValue >= 0 ? Math.floor(scaledValue) : Math.ceil(scaledValue);
      break;
    case RoundingMode.UP:
      roundedScaledValue = scaledValue >= 0 ? Math.ceil(scaledValue) : Math.floor(scaledValue);
      break;
    case RoundingMode.HALF_UP:
      // For HALF_UP, we need to handle negative numbers correctly
      const fractionHalfUp = Math.abs(scaledValue) - Math.floor(Math.abs(scaledValue));
      if (fractionHalfUp < 0.5) {
        // Less than half, round down
        roundedScaledValue = scaledValue >= 0
          ? Math.floor(scaledValue)
          : Math.ceil(scaledValue);
      } else {
        // Half or more, round up
        roundedScaledValue = scaledValue >= 0
          ? Math.ceil(scaledValue)
          : Math.floor(scaledValue);
      }
      break;
    case RoundingMode.HALF_DOWN:
      // For HALF_DOWN, we need to check if the fraction is exactly 0.5
      const fractionHalfDown = Math.abs(scaledValue) - Math.floor(Math.abs(scaledValue));
      if (fractionHalfDown < 0.5) {
        // Less than half, round down
        roundedScaledValue = scaledValue >= 0
          ? Math.floor(scaledValue)
          : Math.ceil(scaledValue);
      } else if (fractionHalfDown > 0.5) {
        // More than half, round up
        roundedScaledValue = scaledValue >= 0
          ? Math.ceil(scaledValue)
          : Math.floor(scaledValue);
      } else {
        // Exactly half, round down
        roundedScaledValue = scaledValue >= 0
          ? Math.floor(scaledValue)
          : Math.ceil(scaledValue);
      }
      break;
    case RoundingMode.HALF_EVEN:
      // Banker's rounding (round to even for ties)
      const fraction = Math.abs(scaledValue) - Math.floor(Math.abs(scaledValue));
      if (fraction === 0.5) {
        const floor = Math.floor(Math.abs(scaledValue));
        roundedScaledValue = floor % 2 === 0 ? floor : floor + 1;
        roundedScaledValue = scaledValue < 0 ? -roundedScaledValue : roundedScaledValue;
      } else {
        roundedScaledValue = Math.round(scaledValue);
      }
      break;
    default:
      roundedScaledValue = Math.round(scaledValue);
  }
  
  // Convert back to original scale and format with correct decimal places
  const roundedValue = roundedScaledValue / factor;
  
  // Format to ensure correct number of decimal places
  return roundedValue.toFixed(decimalPlaces);
}