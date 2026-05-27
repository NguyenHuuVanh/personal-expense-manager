import { describe, it, expect } from 'vitest';
import { convertViToEn } from '@/utils/convert-vi-to-en';

describe('convertViToEn', () => {
  describe('should convert Vietnamese vowels to ASCII', () => {
    it('converts Vietnamese a characters', () => {
      // Test individual character conversions
      expect(convertViToEn('à')).toBe('a');
      expect(convertViToEn('á')).toBe('a');
      expect(convertViToEn('ạ')).toBe('a');
      expect(convertViToEn('ả')).toBe('a');
      expect(convertViToEn('ã')).toBe('a');
      expect(convertViToEn('â')).toBe('a');
      expect(convertViToEn('ă')).toBe('a');
    });

    it('converts Vietnamese e characters', () => {
      expect(convertViToEn('è')).toBe('e');
      expect(convertViToEn('é')).toBe('e');
      expect(convertViToEn('ẹ')).toBe('e');
      expect(convertViToEn('ẻ')).toBe('e');
      expect(convertViToEn('ẽ')).toBe('e');
      expect(convertViToEn('ê')).toBe('e');
    });

    it('converts Vietnamese i characters', () => {
      expect(convertViToEn('ì')).toBe('i');
      expect(convertViToEn('í')).toBe('i');
      expect(convertViToEn('ị')).toBe('i');
      expect(convertViToEn('ỉ')).toBe('i');
      expect(convertViToEn('ĩ')).toBe('i');
    });

    it('converts Vietnamese o characters', () => {
      expect(convertViToEn('ò')).toBe('o');
      expect(convertViToEn('ó')).toBe('o');
      expect(convertViToEn('ọ')).toBe('o');
      expect(convertViToEn('ỏ')).toBe('o');
      expect(convertViToEn('õ')).toBe('o');
      expect(convertViToEn('ô')).toBe('o');
    });

    it('converts Vietnamese u characters', () => {
      expect(convertViToEn('ù')).toBe('u');
      expect(convertViToEn('ú')).toBe('u');
      expect(convertViToEn('ụ')).toBe('u');
      expect(convertViToEn('ủ')).toBe('u');
      expect(convertViToEn('ũ')).toBe('u');
    });

    it('converts Vietnamese y characters', () => {
      expect(convertViToEn('ỳ')).toBe('y');
      expect(convertViToEn('ý')).toBe('y');
      expect(convertViToEn('ỵ')).toBe('y');
      expect(convertViToEn('ỷ')).toBe('y');
      expect(convertViToEn('ỹ')).toBe('y');
    });

    it('converts Vietnamese d character', () => {
      expect(convertViToEn('đ')).toBe('d');
    });
  });

  describe('should handle mixed content', () => {
    it('converts full Vietnamese name', () => {
      const result = convertViToEn('Nguyễn Văn Minh');
      expect(result).toContain('nguyen');
      expect(result).toContain('van');
      expect(result).toContain('minh');
    });

    it('converts lowercase properly', () => {
      expect(convertViToEn('HÀ NỘI')).toBe('ha noi');
    });
  });

  describe('should handle edge cases', () => {
    it('returns empty string for empty input', () => {
      expect(convertViToEn('')).toBe('');
    });

    it('handles already ASCII text', () => {
      expect(convertViToEn('hello world')).toBe('hello world');
    });

    it('handles numbers', () => {
      expect(convertViToEn('123')).toBe('123');
    });
  });

  describe('should handle complex Vietnamese strings', () => {
    it('converts multiple words with different vowels', () => {
      const result = convertViToEn('mùi hương');
      expect(result).toContain('mui');
      expect(result).toContain('huong');
    });
  });
});
