import React from 'react';
import { render, screen } from '@testing-library/react';
import { OmniTaskMatrix } from '../OmniTaskMatrix';
import { describe, it, expect, vi } from 'vitest';

// Simplest mock possible
vi.mock('../../store/useTaskSystem', () => ({
  useTaskSystem: () => ({
    tasks: [
      { id: '1', title: 'Test Task 1', status: 'TODO', priority: 'HIGH' },
      { id: '2', title: 'Test Task 2', status: 'TODO', priority: 'MEDIUM' },
    ],
    addTask: vi.fn(),
    completeTask: vi.fn(),
    getTasksByContext: vi.fn(),
  }),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  CheckCircle: () => <span data-testid="icon-check-circle" />,
  Circle: () => <span data-testid="icon-circle" />,
  AlertCircle: () => <span data-testid="icon-alert-circle" />,
  Sparkles: () => <span data-testid="icon-sparkles" />,
  Plus: () => <span data-testid="icon-plus" />,
}));

describe('OmniTaskMatrix', () => {
  it('renders task list with accessible buttons', () => {
    render(<OmniTaskMatrix />);

    // Check if tasks are rendered
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();

    // Check for accessible completion buttons
    const completeButtons = screen.getAllByRole('button', { name: /Complete task:/i });
    expect(completeButtons).toHaveLength(2);
    expect(completeButtons[0]).toHaveAttribute('aria-label', 'Complete task: Test Task 1');
  });

  it('renders accessible add task input and button', () => {
    render(<OmniTaskMatrix />);

    // Check input label
    const input = screen.getByLabelText('New task title');
    expect(input).toBeInTheDocument();

    // Check add button label
    const addButton = screen.getByRole('button', { name: 'Add new task' });
    expect(addButton).toBeInTheDocument();
  });
});
