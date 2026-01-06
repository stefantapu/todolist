import { expect, test, describe } from 'vitest';
import { formatDistanceToNow } from './DateConverter.ts';

describe('function formatDistanceToNow should return', () => {
  test('returns less than 5 seconds when difference is less than 5 seconds', () => {
    const now = new Date().toISOString();
    expect(formatDistanceToNow(now, true)).toBe('less than 5 seconds');
  });
  test('returns 1 minute when the difference is between 60 and 90 seconds', () => {
    const date = new Date(Date.now() - 75 * 1000).toISOString();
    expect(formatDistanceToNow(date, true)).toBe('1 minute');
  });
  test('returns about 1 hour when the difference is between 1 and 2 hours', () => {
    const date = new Date(Date.now() - 90 * 60 * 1000).toISOString();
    expect(formatDistanceToNow(date)).toBe('about 1 hour');
  });
  test('returns about 2 years when the difference is almost 2 years', () => {
    const date = new Date(Date.now() - 23 * 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatDistanceToNow(date, true)).toBe('almost 2 years');
  });
});
