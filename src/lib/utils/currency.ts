import Decimal from 'decimal.js';

export class CurrencyUtils {
  static DEFAULT_PRECISION = 2;

  /**
   * Safe addition - handles floats and strings
   */
  static add(...values: number[]): number {
    return values
      .reduce((sum, val) => sum.plus(new Decimal(val)), new Decimal(0))
      .toDecimalPlaces(CurrencyUtils.DEFAULT_PRECISION)
      .toNumber();
  }

  /**
   * Safe subtraction
   */
  static subtract(a: number, b: number): number {
    return new Decimal(a)
      .minus(new Decimal(b))
      .toDecimalPlaces(CurrencyUtils.DEFAULT_PRECISION)
      .toNumber();
  }

  /**
   * Safe multiplication
   */
  static multiply(a: number, b: number): number {
    return new Decimal(a)
      .times(new Decimal(b))
      .toDecimalPlaces(CurrencyUtils.DEFAULT_PRECISION)
      .toNumber();
  }

  /**
   * Safe division
   */
  static divide(a: number, b: number): number {
    const divisor = new Decimal(b);
    if (divisor.equals(0)) {
      throw new Error('Division by zero');
    }

    return new Decimal(a)
      .dividedBy(divisor)
      .toDecimalPlaces(CurrencyUtils.DEFAULT_PRECISION)
      .toNumber();
  }

  /**
   * Safe percentage calculation
   */
  static percentage(value: number, percent: number): number {
    return CurrencyUtils.multiply(value, CurrencyUtils.divide(percent, 100));
  }

  /**
   * Round with precision
   */
  static round(num: number, precision: number = CurrencyUtils.DEFAULT_PRECISION): number {
    return new Decimal(num)
      .toDecimalPlaces(precision, Decimal.ROUND_UP)
      .toNumber();
  }

  /**
   * Currency formatting (INR)
   */
  static toCurrency(value: number, precision: number = 2): string {
    const rounded = CurrencyUtils.round(value, precision);
    return `₹${rounded.toFixed(precision)}`;
  }

  /**
   * Get formatted number with commas (Indian number system)
   */
  static toIndianFormat(value: number, precision: number = 2): string {
    const rounded = CurrencyUtils.round(value, precision);
    const parts = rounded.toFixed(precision).toString().split('.');
    const integer = parts[0];
    const decimal = parts[1] ? '.' + parts[1] : '';

    // Indian number formatting (lakhs, crores)
    const formatted = integer.replace(/(\d)(?=(\d\d)+\d$)/g, '$1,');
    return formatted + decimal;
  }

  /**
   * Calculate GST amount
   */
  static calculateGST(amount: number, gstPercent: number): number {
    return CurrencyUtils.multiply(amount, CurrencyUtils.divide(gstPercent, 100));
  }

  /**
   * Calculate amount including GST
   */
  static addGST(amount: number, gstPercent: number): number {
    const gstAmount = CurrencyUtils.calculateGST(amount, gstPercent);
    return CurrencyUtils.add(amount, gstAmount);
  }

  /**
   * Calculate discount amount
   */
  static calculateDiscount(amount: number, discountPercent: number): number {
    return CurrencyUtils.multiply(amount, CurrencyUtils.divide(discountPercent, 100));
  }

  /**
   * Apply discount
   */
  static applyDiscount(amount: number, discountPercent: number): number {
    const discountAmount = CurrencyUtils.calculateDiscount(amount, discountPercent);
    return CurrencyUtils.subtract(amount, discountAmount);
  }
}
