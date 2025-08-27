'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';

const defaultThemes = [
  'light',
  'dark',
  'forest',
  'forest-dark',
  'rose',
  'rose-dark',
];

const valueMap = {
  light: 'light',
  dark: 'dark',
  forest: 'forest light',
  'forest-dark': 'forest dark',
  rose: 'rose light',
  'rose-dark': 'rose dark',
} as const;

export function ThemeProvider({ children, themes, value, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={themes ?? defaultThemes}
      value={value ?? (valueMap as unknown as Record<string, string>)}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
