import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { OmniLoggerWidget } from '../OmniLoggerWidget';

// Mock dependencies
vi.mock('@/services/omniLogger', () => ({
  omniLogger: {
    getStats: vi.fn(() => ({
      total: 0,
      errors: 0,
      warnings: 0,
      byLevel: {},
      byCategory: {},
    })),
    subscribe: vi.fn(() => () => {}),
  },
}));

vi.mock('@/hooks/useSystemMetrics', () => ({
  useSystemMetrics: () => ({
    latency: 10,
    throughput: 1.5,
    cacheHitRate: 95,
    isLoading: false,
    logs: [],
  }),
}));

vi.mock('lucide-react', () => ({
  Activity: () => <span>Activity</span>,
  Bug: () => <span>Bug</span>,
  ChevronDown: () => <span>ChevronDown</span>,
  ChevronUp: () => <span>ChevronUp</span>,
  Bot: () => <span>Bot</span>,
  StickyNote: () => <span>StickyNote</span>,
  Sparkles: () => <span>Sparkles</span>,
  Loader2: () => <span>Loader2</span>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...props }: any) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('OmniLoggerWidget', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders the widget button initially', () => {
    render(<OmniLoggerWidget />);
    // The widget button contains the Activity icon (mocked as text 'Activity')
    expect(screen.getByText('Activity')).toBeInTheDocument();
  });
});
