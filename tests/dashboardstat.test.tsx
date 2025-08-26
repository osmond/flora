import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardStat from '../src/components/DashboardStat';

(globalThis as unknown as { React: typeof React }).React = React;

describe('DashboardStat', () => {
  it('renders title, value and subtitle', () => {
    render(<DashboardStat title="Plants" value={5} subtitle="total" />);
    expect(screen.getByText('Plants')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('total')).toBeInTheDocument();
  });
});
