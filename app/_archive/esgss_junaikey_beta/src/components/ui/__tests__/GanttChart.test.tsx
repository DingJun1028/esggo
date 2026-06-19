import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock framer-motion to avoid DOM event errors during tests
vi.mock('framer-motion', () => ({
    motion: {
        div: (props: any) => <div {...props} />,
        span: (props: any) => <span {...props} />,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import GanttChart from '../GanttChart';

describe('GanttChart Component', () => {
    const mockTasks: any[] = [
        { id: '1', name: 'Task 1', start: 0, duration: 50, status: 'completed', color: '#FF0000' },
        { id: '2', name: 'Task 2', start: 50, duration: 50, status: 'ongoing', color: '#00FF00' },
    ];

    it('renders with title', () => {
        render(<GanttChart tasks={mockTasks} title="Project Timeline" />);
        expect(screen.getByText('Project Timeline')).toBeInTheDocument();
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    it('renders status tags correctly', () => {
        render(<GanttChart tasks={mockTasks} />);
        expect(screen.getByText('COMPLETED')).toBeInTheDocument();
        expect(screen.getByText('ONGOING')).toBeInTheDocument();
    });

    it('renders default roadmap', () => {
        render(<GanttChart tasks={undefined as any} />);
        expect(screen.getByText('設計系統標準化')).toBeInTheDocument();
    });
});
