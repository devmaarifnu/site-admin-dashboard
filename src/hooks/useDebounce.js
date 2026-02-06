'use client';

import { useState, useCallback } from 'react';

export function useDebounce() {
  const [timeoutId, setTimeoutId] = useState(null);

  const debounce = useCallback((func, delay = 500) => {
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        func(...args);
      }, delay);

      setTimeoutId(newTimeoutId);
    };
  }, [timeoutId]);

  return debounce;
}
