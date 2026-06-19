import React from 'react';
import { render, screen } from '@testing-library/react';
import { OmniCalendar } from '../OmniCalendar';
import { describe, it, expect, vi } from 'vitest';

// Mock hook
vi.mock('@/hooks/useTimeNexus', () => ({
  useTimeNexus: () => ({
    getEventsForDate: () => [], // Default no events
  }),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="icon-chevron-left" />,
  ChevronRight: () => <span data-testid="icon-chevron-right" />,
  ShieldCheck: () => <span data-testid="icon-shield-check" />,
  Zap: () => <span data-testid="icon-zap" />,
  Calendar: () => <span data-testid="icon-calendar" />,
}));

describe('OmniCalendar', () => {
  it('renders with accessible navigation buttons', () => {
    render(<OmniCalendar />);

    const prevButton = screen.getByRole('button', { name: /Previous month/i });
    expect(prevButton).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /Next month/i });
    expect(nextButton).toBeInTheDocument();
  });

  it('renders day grid with accessible labels', () => {
    render(<OmniCalendar />);

    // Check that day buttons have aria-labels starting with YYYY-MM-DD format
    // Since we don't control the date, we look for the pattern
    const buttons = screen.getAllByRole('button');
    const dayButtons = buttons.filter(b =>
      b.getAttribute('aria-label')?.match(/^\d{4}-\d{2}-\d{2}/)
    );

    expect(dayButtons.length).toBeGreaterThan(0);
  });
});
