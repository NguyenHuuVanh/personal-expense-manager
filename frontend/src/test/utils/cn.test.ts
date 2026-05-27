import { describe, it, expect } from 'vitest';
import { cn } from '@/utils/cn';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const result = cn('base', isActive && 'active');
    expect(result).toBe('base active');
  });

  it('filters falsy values', () => {
    const result = cn('foo', false, null, undefined, 'bar');
    expect(result).toBe('foo bar');
  });

  it('merges tailwind classes with conflicts', () => {
    const result = cn('px-2 px-4', 'py-1');
    expect(result).toBe('px-4 py-1');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('handles object with conditional styles', () => {
    const result = cn('base', { 'active': true, 'disabled': false });
    expect(result).toBe('base active');
  });

  it('handles array input', () => {
    const result = cn(['foo', 'bar']);
    expect(result).toBe('foo bar');
  });

  it('handles mixed input types', () => {
    const result = cn('base', ['array1', 'array2'], { condition: true });
    expect(result).toContain('base');
    expect(result).toContain('array1');
    expect(result).toContain('array2');
    expect(result).toContain('condition');
  });
});
