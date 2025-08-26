import React from 'react';
import { render, screen } from '@testing-library/react';
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
});

