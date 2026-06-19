import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SystemLogConsole } from '../SystemLogConsole';
import {
  omniLogger,
  LogEntry,
  LogLevel,
  LogCategory,
} from '../../omni/infrastructure/logging/OmniLogger';

// Mock the dependencies
vi.mock('../../omni/infrastructure/logging/OmniLogger', () => ({
  omniLogger: {
    subscribe: vi.fn(),
  },
  LogLevel: {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
  },
  LogCategory: {
    SYSTEM: 'SYSTEM',
    AI: 'AI',
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Terminal: () => <div data-testid="icon-terminal" />,
}));

describe('SystemLogConsole', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders with accessible attributes', () => {
    // Mock subscribe immediately
    // @ts-ignore
    omniLogger.subscribe.mockReturnValue(() => {});

    render(<SystemLogConsole />);

    const logRegion = screen.getByRole('log');
    expect(logRegion).toBeInTheDocument();
    expect(logRegion).toHaveAttribute('aria-label', 'System Log Console');
    expect(logRegion).toHaveAttribute('tabIndex', '0');
    expect(logRegion).toHaveAttribute('aria-live', 'polite');
  });

  it('renders logs eventually (verifying functional correctness)', async () => {
    let logCallback: (log: LogEntry) => void = () => {};

    // Capture the subscription callback
    // @ts-ignore
    omniLogger.subscribe.mockImplementation((cb: any) => {
      logCallback = cb;
      return () => {};
    });

    render(<SystemLogConsole />);

    const testLog: LogEntry = {
      id: 'test-1',
      timestamp: Date.now(),
      level: LogLevel.INFO,
      category: LogCategory.SYSTEM,
      message: 'Performance Test Log',
      source_origin: 'test',
      trace_id: 'test',
    };

    // Emit log
    await act(async () => {
      logCallback(testLog);
    });

    // Advance time to allow throttle to flush
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText(/Performance Test Log/)).toBeInTheDocument();
  });
});
