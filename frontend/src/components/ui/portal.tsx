'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { useIsomorphicEffect } from './use-isomorphic-effect';

export type PortalProps = {
  children: React.ReactNode;
  container?: string;
};

export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);

  useIsomorphicEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const containerEl = container
    ? document.querySelector(container)
    : document.body;

  if (!containerEl) return null;

  return createPortal(children, containerEl);
}