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