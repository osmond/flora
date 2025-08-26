import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/lib/use-debounce';
import { vi, describe, it, expect } from 'vitest';

describe('useDebounce', () => {
  it('delays value updates', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ val }) => useDebounce(val, 200),
      { initialProps: { val: 'a' } }
    );

    act(() => {
      rerender({ val: 'ab' });
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('ab');
    vi.useRealTimers();
  });
});
