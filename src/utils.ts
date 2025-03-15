/**
 * Converts a decimal number or string to BigInt preserving all decimal digits
 *
 * @param value The decimal number or string to convert
 * @param decimalPlaces The number of decimal places to preserve
 * @returns The value as a BigInt with all decimal digits preserved
 */
export function decimalToBigInt(
  value: number | string,
  decimalPlaces: number
): bigint {
  // Convert to string to preserve all decimal places
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  const scaledValue = numValue * 10 ** decimalPlaces;

  // Convert to BigInt
  return BigInt(Math.round(scaledValue));
}

/**
 * Safely converts a BigInt amount to a Number with proper decimal places
 *
 * @param amount The amount as a BigInt
 * @param decimalPlaces The number of decimal places
 * @returns The amount as a Number
 */
export function bigintToNumber(amount: bigint, decimalPlaces: number): number {
  // Handle negative values
  const isNegative = amount < 0n;
  const absAmount = isNegative ? -amount : amount;

  // Calculate the decimal factor based on decimal places
  const decimalFactor = 10n ** BigInt(decimalPlaces);

  // Get the integer and fractional parts
  const integerPart = absAmount / decimalFactor;
  const fractionalPart = absAmount % decimalFactor;

  // Convert to string representation first
  const intStr = integerPart.toString();
  const fracStr = fractionalPart.toString().padStart(decimalPlaces, "0");

  // Parse the combined string representation
  const numStr = `${isNegative ? "-" : ""}${intStr}.${fracStr}`;
  return parseFloat(numStr);
}
