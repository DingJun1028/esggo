import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { OmniLogViewer } from '../OmniLogViewer';
import { omniLogger, LogLevel, LogCategory, LogEntry } from '../../services/omniLogger';

// Mock dependencies
vi.mock('../../services/omniLogger', () => ({
  omniLogger: {
    getLogs: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    getStats: vi.fn(() => ({ total: 100, errors: 0, warnings: 0 })),
    clearLogs: vi.fn(),
    downloadLogs: vi.fn(),
  },
  LogLevel: {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    CRITICAL: 'CRITICAL',
  },
  LogCategory: {
    SYSTEM: 'SYSTEM',
  },
}));

// Mock UI components
// Note: We are mocking loosely here. If the real components are used (due to barrel file issues),
// we might not get these mocks, but we can still test the DOM output.
vi.mock('lucide-react', () => ({
  X: () => <span>X</span>,
  Download: () => <span>Down</span>,
  Trash2: () => <span>Trash</span>,
  Filter: () => <span>Filter</span>,
  Search: () => <span>Search</span>,
  AlertCircle: () => <span>Alert</span>,
  Info: () => <span>Info</span>,
  AlertTriangle: () => <span>Warn</span>,
  Bug: () => <span>Bug</span>,
}));

describe('OmniLogViewer Pagination', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders only initial 50 logs when more are available and shows load more indicator', async () => {
    // Generate 100 logs
    const mockLogs: LogEntry[] = Array.from({ length: 100 }, (_, i) => ({
      id: `log-${i}`,
      timestamp: Date.now(),
      level: LogLevel.INFO,
      category: LogCategory.SYSTEM,
      message: `Log Message ${i}`,
      source_origin: 'test',
      trace_id: `trace-${i}`,
    }));

    // @ts-ignore
    omniLogger.getLogs.mockReturnValue(mockLogs);

    render(<OmniLogViewer onClose={() => {}} />);

    // Fast-forward any initial effects
    await act(async () => {
      vi.runAllTimers();
    });

    // Check that only 50 logs are rendered
    const renderedLogs = screen.getAllByText(/Log Message \d+/);
    expect(renderedLogs.length).toBe(50);

    // Verify specific log presence
    expect(screen.getByText('Log Message 0')).toBeInTheDocument();
    expect(screen.getByText('Log Message 49')).toBeInTheDocument();
    expect(screen.queryByText('Log Message 50')).not.toBeInTheDocument();

    // Verify "Load More" indicator is present
    expect(screen.getByText(/載入更多日誌/)).toBeInTheDocument();
    expect(screen.getByText(/50 \/ 100/)).toBeInTheDocument();
  });
});
