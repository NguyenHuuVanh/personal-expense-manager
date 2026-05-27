'use client';

import * as React from 'react';

export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);
  const onOpenChange = React.useCallback((open: boolean) => setIsOpen(open), []);

  return {
    isOpen,
    onOpen: open,
    onClose: close,
    onToggle: toggle,
    onOpenChange,
  };
}

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>;