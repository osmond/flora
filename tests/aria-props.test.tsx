import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/ui/button';

(globalThis as unknown as { React: typeof React }).React = React;

describe('shadcn components', () => {
  it('preserve aria-* props', () => {
    render(<Button aria-label="Close">X</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close');
  });
});
