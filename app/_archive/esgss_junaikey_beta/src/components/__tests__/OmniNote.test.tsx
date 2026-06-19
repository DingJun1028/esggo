import React from 'react';
import { render, screen } from '@testing-library/react';
import { OmniNote } from '../OmniNote';
import { describe, it, expect, vi } from 'vitest';

// Mock stores
vi.mock('@/store/useNoteSystem', () => ({
  useNoteSystem: () => ({
    notes: {},
    saveNote: vi.fn(),
    getNote: () => ({ id: 'note-1', content: 'Initial content' }),
  }),
}));

vi.mock('@/store/useTaskSystem', () => ({
  useTaskSystem: () => ({
    addTask: vi.fn(),
  }),
}));

// Mock automation service
vi.mock('@/services/automationService', () => ({
  executeAutomation: vi.fn(),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Save: () => <span data-testid="icon-save" />,
  Sparkles: () => <span data-testid="icon-sparkles" />,
  Tag: () => <span data-testid="icon-tag" />,
  Share2: () => <span data-testid="icon-share2" />,
  Loader2: () => <span data-testid="icon-loader2" />,
  ClipboardList: () => <span data-testid="icon-clipboard-list" />,
  Zap: () => <span data-testid="icon-zap" />,
}));

describe('OmniNote', () => {
  it('renders with accessible attributes', () => {
    render(<OmniNote contextId="test-context" />);

    // Check Auto toggle button accessibility
    const toggleButton = screen.getByRole('button', { name: /Toggle auto-refinement/i });
    expect(toggleButton).toBeInTheDocument();
    // Default state is autoRefinement = true
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

    // Check Textarea accessibility
    const textarea = screen.getByRole('textbox', { name: /Note content/i });
    expect(textarea).toBeInTheDocument();

    // Check Status indicator accessibility
    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toBeInTheDocument();
    expect(statusRegion).toHaveAttribute('aria-live', 'polite');
  });
});
