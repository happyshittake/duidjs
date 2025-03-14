import { money, RoundingMode } from "../src";

// Example of division with rounding
console.log("Division with Rounding Examples");
console.log("===============================");

// Example with USD (2 decimal places)
const usd = money(10, "USD");
console.log("USD Example (2 decimal places):");
console.log(`10 USD / 7 = ${usd.divide(7).getAmount()} USD (default HALF_UP rounding)`);
console.log(`10 USD / 7 = ${usd.divide(7, RoundingMode.FLOOR).getAmount()} USD (FLOOR rounding)`);
console.log(`10 USD / 7 = ${usd.divide(7, RoundingMode.CEILING).getAmount()} USD (CEILING rounding)`);
console.log();

// Example with BHD (3 decimal places)
const bhd = money(10, "BHD");
console.log("BHD Example (3 decimal places):");
console.log(`10 BHD / 7 = ${bhd.divide(7).getAmount()} BHD (default HALF_UP rounding)`);
console.log(`10 BHD / 7 = ${bhd.divide(7, RoundingMode.FLOOR).getAmount()} BHD (FLOOR rounding)`);
console.log(`10 BHD / 7 = ${bhd.divide(7, RoundingMode.CEILING).getAmount()} BHD (CEILING rounding)`);
console.log();

// Example with JPY (0 decimal places)
const jpy = money(10, "JPY");
console.log("JPY Example (0 decimal places):");
console.log(`10 JPY / 3 = ${jpy.divide(3).getAmount()} JPY (default HALF_UP rounding)`);
console.log(`10 JPY / 3 = ${jpy.divide(3, RoundingMode.FLOOR).getAmount()} JPY (FLOOR rounding)`);
console.log(`10 JPY / 3 = ${jpy.divide(3, RoundingMode.CEILING).getAmount()} JPY (CEILING rounding)`);
console.log();

// Example with different rounding modes
const eur = money(100, "EUR");
console.log("EUR Example with different rounding modes:");
console.log(`100 EUR / 3 = ${eur.divide(3).getAmount()} EUR (default HALF_UP rounding)`);
console.log(`100 EUR / 3 = ${eur.divide(3, RoundingMode.HALF_DOWN).getAmount()} EUR (HALF_DOWN rounding)`);
console.log(`100 EUR / 3 = ${eur.divide(3, RoundingMode.HALF_EVEN).getAmount()} EUR (HALF_EVEN rounding)`);
console.log(`100 EUR / 3 = ${eur.divide(3, RoundingMode.DOWN).getAmount()} EUR (DOWN rounding)`);
console.log(`100 EUR / 3 = ${eur.divide(3, RoundingMode.UP).getAmount()} EUR (UP rounding)`);
console.log(`100 EUR / 3 = ${eur.divide(3, RoundingMode.NONE).getAmount(RoundingMode.NONE)} EUR (NONE mode - no rounding)`);
console.log();

// Example with NONE mode for all operations
console.log("NONE Mode Examples (preserving all decimal places):");
console.log("==================================================");

// Example with NONE mode for division
console.log("Division with NONE mode:");
const usdNone = money(10, "USD");
console.log(`10 USD / 7 = ${usdNone.divide(7, RoundingMode.NONE).getAmount(RoundingMode.NONE)} USD`);

// Example with NONE mode for multiplication
console.log("\nMultiplication with NONE mode:");
console.log(`10 USD * 3.33333 = ${usdNone.multiply(3.33333, RoundingMode.NONE).getAmount(RoundingMode.NONE)} USD`);

// Example with NONE mode for addition and subtraction
console.log("\nAddition and Subtraction with NONE mode:");
const amount1 = money(10.123, "USD", RoundingMode.NONE);
const amount2 = money(5.456, "USD", RoundingMode.NONE);
console.log(`10.123 USD + 5.456 USD = ${amount1.add(amount2, RoundingMode.NONE).getAmount(RoundingMode.NONE)} USD`);
console.log(`10.123 USD - 5.456 USD = ${amount1.subtract(amount2, RoundingMode.NONE).getAmount(RoundingMode.NONE)} USD`);

// Example with getAmount using different rounding modes
console.log("\ngetAmount with different rounding modes:");
const preciseAmount = money(1.98765, "USD");
console.log(`1.98765 USD = ${preciseAmount.getAmount()} USD (default rounding)`);
console.log(`1.98765 USD = ${preciseAmount.getAmount(RoundingMode.FLOOR)} USD (FLOOR rounding)`);
console.log(`1.98765 USD = ${preciseAmount.getAmount(RoundingMode.CEILING)} USD (CEILING rounding)`);
console.log(`1.98765 USD = ${preciseAmount.getAmount(RoundingMode.NONE)} USD (NONE mode - no rounding)`);