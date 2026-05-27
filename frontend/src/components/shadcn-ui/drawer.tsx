'use client';

import { Drawer as VaulDrawer } from 'vaul';
import * as React from 'react';
import { cn } from '@/utils/cn';

const Drawer = VaulDrawer.Root;

const DrawerTrigger = VaulDrawer.Trigger;

const DrawerContent = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof VaulDrawer.Content> & {
  ref?: React.RefObject<HTMLDivElement | null>;
}) => (
  <VaulDrawer.Portal>
    <VaulDrawer.Overlay className="fixed inset-0 z-50 bg-black/80" />
    <VaulDrawer.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </VaulDrawer.Content>
  </VaulDrawer.Portal>
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'grid gap-1.5 p-4 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerTitle = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof VaulDrawer.Title> & {
  ref?: React.RefObject<HTMLHeadingElement | null>;
}) => (
  <VaulDrawer.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
);
DrawerTitle.displayName = VaulDrawer.Title.displayName;

const DrawerDescription = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof VaulDrawer.Description> & {
  ref?: React.RefObject<HTMLParagraphElement | null>;
}) => (
  <VaulDrawer.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);
DrawerDescription.displayName = VaulDrawer.Description.displayName;

const DrawerClose = VaulDrawer.Close;

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
