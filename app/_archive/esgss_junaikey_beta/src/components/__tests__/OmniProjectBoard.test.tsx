import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { OmniProjectBoard } from '../OmniProjectBoard';
import { useImpactProject } from '../../store/useImpactProject';

// Mock the store
vi.mock('../../store/useImpactProject', () => ({
  useImpactProject: vi.fn(),
}));

describe('OmniProjectBoard', () => {
  it('renders the demo project card correctly', () => {
    // Mock return value for useImpactProject
    (useImpactProject as any).mockReturnValue({
      projects: [],
    });

    render(<OmniProjectBoard />);

    // Check for Demo Project
    expect(screen.getByText('Solar Supply Chain Audit')).toBeInTheDocument();
    expect(screen.getByText('ENVIRONMENT')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('SDG 7, 13')).toBeInTheDocument();
    // SROI calculation: 4200 / 1000 = 4.2x
    expect(screen.getByText('SROI: 4.2x')).toBeInTheDocument();
  });

  it('renders user projects from store correctly', () => {
    const mockProjects = [
      {
        id: 'p1',
        name: 'Community Water Access',
        description: 'Building wells in rural areas.',
        category: 'SOCIAL',
        status: 'PLANNING',
        progress: 10,
        sdgTargets: ['SDG 6'],
        impactMetrics: [],
        owner: 'User',
      },
    ];

    (useImpactProject as any).mockReturnValue({
      projects: mockProjects,
    });

    render(<OmniProjectBoard />);

    // Check for User Project
    expect(screen.getByText('Community Water Access')).toBeInTheDocument();
    expect(screen.getByText('SOCIAL')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('SDG 6')).toBeInTheDocument();
  });
});
