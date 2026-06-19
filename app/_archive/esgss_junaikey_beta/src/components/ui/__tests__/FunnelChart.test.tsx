import { vi, describe, it, expect } from 'vitest';

// Mock recharts to avoid rendering issues in test environment
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    FunnelChart: ({ children }: any) => <div data-testid="funnel-chart">{children}</div>,
    Funnel: () => <div data-testid="funnel" />,
    Tooltip: () => null,
    Cell: () => null,
    LabelList: () => null,
}));

import { render, screen } from '@testing-library/react';
import FunnelChart from '../FunnelChart';

describe('FunnelChart Component', () => {
    const mockData = [
        { name: 'Source', value: 100, fill: '#FF0000', description: 'desc 1' },
        { name: 'Processing', value: 80, fill: '#00FF00', description: 'desc 2' },
        { name: 'Asset', value: 60, fill: '#0000FF', description: 'desc 3' },
    ];

    it('renders titles and names in cards', () => {
        render(<FunnelChart data={mockData} title="5T Transformation" />);
        expect(screen.getByText('5T Transformation')).toBeInTheDocument();
        // The summary cards should still render the names
        expect(screen.getByText('Source')).toBeInTheDocument();
        expect(screen.getByText('Processing')).toBeInTheDocument();
    });

    it('renders detail descriptions in cards', () => {
        render(<FunnelChart data={mockData} />);
        expect(screen.getByText('desc 1')).toBeInTheDocument();
        expect(screen.getByText('desc 2')).toBeInTheDocument();
    });

    it('renders default data', () => {
        render(<FunnelChart data={undefined as any} />);
        expect(screen.getByText('Tangible (感知)')).toBeInTheDocument();
    });
});
