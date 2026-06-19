// src/components/TacticalDashboard.test.tsx

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TacticalDashboard } from './TacticalDashboard';
import { useAppStore } from '@/store/useAppStore';

// Mock the store
vi.mock('@/store/useAppStore');

// Mock child components that might have complex logic or side effects
vi.mock('@/omni/interaction/visuals/OmniEsgCell', () => ({
  OmniEsgCell: (props: any) => <div data-testid="omni-esg-cell">{props.label}</div>,
}));

vi.mock('./SystemLogConsole', () => ({
  SystemLogConsole: () => <div data-testid="system-log-console" />,
}));

describe('TacticalDashboard', () => {
  const mockUserProfile = {
    name: 'Test Commander',
    role: 'CSO',
    organization: 'Test Corp',
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  it('should render the commander name when user is logged in', () => {
    // Arrange: Set up the mock store to return a logged-in user
    (useAppStore as any).mockReturnValue({
      userProfile: mockUserProfile,
    });

    // Act
    render(<TacticalDashboard />);

    // Assert
    // Check if the commander's name is displayed.
    // We use a regex to ignore the "CMDR: " prefix and find the name.
    const commanderName = screen.getByText(/Test Commander/i);
    expect(commanderName).toBeInTheDocument();
  });

  it('should render "UNAUTHENTICATED" when user is logged out', () => {
    // Arrange: Set up the mock store to return a null user profile
    (useAppStore as any).mockReturnValue({
      userProfile: null,
    });

    // Act
    render(<TacticalDashboard />);

    // Assert
    const unauthenticatedText = screen.getByText(/UNAUTHENTICATED/i);
    expect(unauthenticatedText).toBeInTheDocument();
  });

  it('should render the main header and status', () => {
    // Arrange
    (useAppStore as any).mockReturnValue({
      userProfile: mockUserProfile,
    });

    // Act
    render(<TacticalDashboard />);

    // Assert
    const header = screen.getByRole('heading', { name: /Tactical Command/i });
    const status = screen.getByText(/STATUS: OPERATIONAL/i);

    expect(header).toBeInTheDocument();
    expect(status).toBeInTheDocument();
  });
});
