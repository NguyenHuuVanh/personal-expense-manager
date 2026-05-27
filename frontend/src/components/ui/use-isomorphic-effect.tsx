'use client';

import * as React from 'react';

export function useIsomorphicEffect(
  callback: () => void | (() => void),
  deps?: React.DependencyList,
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useEffect(() => {
    const cleanup = callback();
    return typeof cleanup === 'function' ? cleanup : undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}