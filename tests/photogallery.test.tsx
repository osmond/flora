import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PhotoGalleryClient from '../src/components/plant/PhotoGalleryClient';
import type { CareEvent } from '../src/types';

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => <img {...props} alt={props.alt ?? ''} />,
}));

describe('PhotoGalleryClient', () => {
  it('renders navigation buttons when multiple photos', () => {
    const events: CareEvent[] = [
      { id: '1', type: 'photo', note: null, image_url: 'a.jpg', created_at: '' },
      { id: '2', type: 'photo', note: null, image_url: 'b.jpg', created_at: '' },
    ];

    render(<PhotoGalleryClient events={events} />);

    const gallery = screen.getByLabelText('Photo gallery');
    expect(gallery.querySelector('button[aria-label="Previous"]')).toBeTruthy();
    expect(gallery.querySelector('button[aria-label="Next"]')).toBeTruthy();
  });

  it('opens full-screen modal when photo clicked', async () => {
    const events: CareEvent[] = [
      { id: '1', type: 'photo', note: null, image_url: 'a.jpg', created_at: '' },
    ];

    const user = userEvent.setup();
    render(<PhotoGalleryClient events={events} />);

    await user.click(screen.getByRole('button', { name: /view photo/i }));
    expect(
      screen.getByRole('dialog', { name: /full size photo/i })
    ).toBeTruthy();
  });

  it('shows tag for photo event', () => {
    const events: CareEvent[] = [
      {
        id: '1',
        type: 'photo',
        note: null,
        image_url: 'a.jpg',
        created_at: '',
        tag: 'water',
      },
    ];

    render(<PhotoGalleryClient events={events} />);
    expect(screen.getByText('water')).toBeTruthy();
  });
});

