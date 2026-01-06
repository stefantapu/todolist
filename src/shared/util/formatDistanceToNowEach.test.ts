import { expect, test, describe } from 'vitest';
import { formatDistanceToNow } from './DateConverter.ts';

describe('formatDistanceToNow should return', () => {
  test.each([
    ['less than 5 seconds', new Date(Date.now()).toISOString(), 'less than 5 seconds'],
    ['1 minute', new Date(Date.now() - 75 * 1000).toISOString(), '1 minute'],
    ['about 1 hour', new Date(Date.now() - 90 * 60 * 1000).toISOString(), 'about 1 hour'],
  ])('%s', (_, date, expected) => {
    expect(formatDistanceToNow(date, true)).toBe(expected);
  });
});
