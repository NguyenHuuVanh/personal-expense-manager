import { describe, it, expect } from 'vitest';
import {
  formatNumberShort,
  formatNumberVN,
  formatCurrency,
  formatCompactCurrency,
  formatDate,
  formatInputValue,
  parseInputForSubmit,
  calculateTrend,
} from '@/utils/format-number';

describe('formatNumberShort', () => {
  describe('should format billions correctly', () => {
    it('formats 1 billion', () => {
      expect(formatNumberShort(1_000_000_000)).toBe('1.0B');
    });

    it('formats 1.5 billion', () => {
      expect(formatNumberShort(1_500_000_000)).toBe('1.5B');
    });

    it('formats negative billions', () => {
      expect(formatNumberShort(-1_000_000_000)).toBe('-1.0B');
    });
  });

  describe('should format millions correctly', () => {
    it('formats 1 million', () => {
      expect(formatNumberShort(1_000_000)).toBe('1.0M');
    });

    it('formats 2.5 million', () => {
      expect(formatNumberShort(2_500_000)).toBe('2.5M');
    });

    it('formats negative millions', () => {
      expect(formatNumberShort(-2_500_000)).toBe('-2.5M');
    });
  });

  describe('should format thousands correctly', () => {
    it('formats 1 thousand', () => {
      expect(formatNumberShort(1_000)).toBe('1.0K');
    });

    it('formats 10.5 thousand', () => {
      expect(formatNumberShort(10_500)).toBe('10.5K');
    });

    it('formats negative thousands', () => {
      expect(formatNumberShort(-1_000)).toBe('-1.0K');
    });
  });

  describe('should handle edge cases', () => {
    it('returns 0 for null', () => {
      expect(formatNumberShort(null)).toBe('0');
    });

    it('returns 0 for undefined', () => {
      expect(formatNumberShort(undefined)).toBe('0');
    });

    it('returns 0 for NaN', () => {
      expect(formatNumberShort(NaN)).toBe('0');
    });

    it('formats small numbers without suffix', () => {
      expect(formatNumberShort(500)).toBe('500');
    });

    it('respects decimal parameter', () => {
      expect(formatNumberShort(1500, 0)).toBe('2K');
      expect(formatNumberShort(1500, 2)).toBe('1.50K');
    });
  });
});

describe('formatNumberVN', () => {
  it('formats numbers with Vietnamese locale', () => {
    expect(formatNumberVN(1000000)).toBe('1.000.000');
  });

  it('formats small numbers', () => {
    expect(formatNumberVN(123)).toBe('123');
  });

  it('handles zero', () => {
    expect(formatNumberVN(0)).toBe('0');
  });

  it('handles null and undefined', () => {
    expect(formatNumberVN(null)).toBe('0');
    expect(formatNumberVN(undefined)).toBe('0');
  });
});

describe('formatCurrency', () => {
  it('formats VND currency correctly', () => {
    expect(formatCurrency(1000000)).toBe('1.000.000 VNĐ');
  });

  it('formats small amounts', () => {
    expect(formatCurrency(500)).toBe('500 VNĐ');
  });

  it('handles null and undefined', () => {
    expect(formatCurrency(null as any)).toBe('0 VNĐ');
    expect(formatCurrency(undefined as any)).toBe('0 VNĐ');
  });

  it('handles NaN', () => {
    expect(formatCurrency(NaN)).toBe('0 VNĐ');
  });
});

describe('formatCompactCurrency', () => {
  it('formats billions with B suffix', () => {
    expect(formatCompactCurrency(1_500_000_000)).toBe('1.5B');
  });

  it('formats millions with M suffix', () => {
    expect(formatCompactCurrency(2_500_000)).toBe('2.5M');
  });

  it('formats thousands with K suffix', () => {
    expect(formatCompactCurrency(15000)).toBe('15K');
  });

  it('returns number as string for small amounts', () => {
    expect(formatCompactCurrency(500)).toBe('500');
  });

  it('handles null and undefined', () => {
    expect(formatCompactCurrency(null as any)).toBe('0');
    expect(formatCompactCurrency(undefined as any)).toBe('0');
  });
});

describe('formatDate', () => {
  it('formats date in Vietnamese locale', () => {
    const result = formatDate('2024-03-15');
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('handles different date formats', () => {
    const result = formatDate('2024-12-25');
    expect(result).toContain('25');
    expect(result).toContain('12');
    expect(result).toContain('2024');
  });
});

  describe('formatInputValue', () => {
    it('formats number string with thousand separators', () => {
      expect(formatInputValue('1000000')).toBe('1.000.000');
    });

    it('handles empty string', () => {
      expect(formatInputValue('')).toBe('');
    });

    it('removes non-digit characters', () => {
      expect(formatInputValue('abc123def456')).toBe('123.456');
    });

    it('handles single digit', () => {
      expect(formatInputValue('5')).toBe('5');
    });
  });

describe('parseInputForSubmit', () => {
  it('parses formatted string to number', () => {
    expect(parseInputForSubmit('1.000.000')).toBe(1000000);
  });

  it('handles empty string', () => {
    expect(parseInputForSubmit('')).toBe(0);
  });

  it('returns 0 for invalid input', () => {
    expect(parseInputForSubmit('abc')).toBe(0);
  });

  it('handles plain number', () => {
    expect(parseInputForSubmit('500')).toBe(500);
  });
});

describe('calculateTrend', () => {
  it('calculates positive trend correctly', () => {
    expect(calculateTrend(150, 100)).toBe(50);
  });

  it('calculates negative trend correctly', () => {
    expect(calculateTrend(50, 100)).toBe(-50);
  });

  it('handles zero previous value', () => {
    expect(calculateTrend(100, 0)).toBe(0);
  });

  it('handles both zero values', () => {
    expect(calculateTrend(0, 0)).toBe(0);
  });

  it('rounds to one decimal place', () => {
    expect(calculateTrend(133, 100)).toBe(33);
  });

  it('handles decreasing negative values', () => {
    // -50 vs -100: (-50 - (-100)) / (-100) * 100 = 50/-100 * 100 = -50%
    expect(calculateTrend(-50, -100)).toBe(-50);
  });
});
