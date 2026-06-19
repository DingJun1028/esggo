import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { OmniEsgCell } from '../OmniEsgCell.tsx';

// Mock dependencies
const mockExecute = vi.fn();
const mockInitialize = vi.fn().mockResolvedValue(undefined);

vi.mock('../OmniEsgCellCrystal', () => {
  return {
    OmniEsgCellCrystal: class {
      initialize = mockInitialize;
      execute = mockExecute; // Assign the mock directly
    }
  };
});

vi.mock('@/hooks/useEvolution', () => ({
  useEvolution: () => ({ hotActions: [], recommendations: [] }),
}));

vi.mock('@/hooks/useOmniRectification', () => ({
  useOmniRectification: (val: any) => ({ value: val, isRectified: false, meta: null }),
}));

vi.mock('@/core/OmniProxy', () => ({
  withOmniProxy: (Component: any) => Component,
}));

describe('OmniEsgCell Performance', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should not re-execute when omniLabel is structurally identical but referentially different', async () => {
    // Setup mock return value
    mockExecute.mockResolvedValue({ success: true, output: { label: 'Test', value: 123 } });

    const omniLabel1 = { semantics: ['A'], importance: 'High' } as any;
    const omniLabel2 = { semantics: ['A'], importance: 'High' } as any;

    const { rerender } = render(<OmniEsgCell id="test" label="Test" value={100} omniLabel={omniLabel1} />);

    // Wait for effects
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockExecute).toHaveBeenCalledTimes(1);

    // Rerender with new object reference but same content
    rerender(<OmniEsgCell id="test" label="Test" value={100} omniLabel={omniLabel2} />);

    await act(async () => {
      await Promise.resolve();
    });

    // Without optimization, React.memo sees difference, triggers render, useEffect sees difference, execute called again.
    // With optimization, React.memo sees no difference, render skipped, execute NOT called again.
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });
});
