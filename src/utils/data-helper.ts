export class DataHelper {
  /**
   * Generates an array of strings representing a numeric range
   */
  static getNumericRange(start: number, end: number): string[] {
    const length = end - start + 1;

    return [...Array(length).keys()].map(i => (i + start).toString());
  }

  static getExpectedMonths(): string[] {
    return [
      'Month',
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
  }

  static getExpectedDays(): string[] {
    return ['Day', ...this.getNumericRange(1, 31)];
  }

  static getExpectedYears(): string[] {
    return ['Year', ...this.getNumericRange(1900, 2021).reverse()];
  }

  static getExpectedCountries(): string[] {
    return [
      'India',
      'United States',
      'Canada',
      'Australia',
      'Israel',
      'New Zealand',
      'Singapore'
    ];
  }
}
