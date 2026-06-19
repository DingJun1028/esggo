import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardHealthV2 } from '../DashboardHealthV2';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '../../../utils/i18n';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock Recharts
vi.mock('recharts', () => {
    return {
        ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
        AreaChart: () => <div data-testid="area-chart">AreaChart</div>,
        Area: () => null,
        XAxis: () => null,
        YAxis: () => null,
        CartesianGrid: () => null,
        Tooltip: () => null,
    };
});

// Mock ResizeObserver
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
global.ResizeObserver = ResizeObserver;

/**
 * Helper: wrap component with required providers (English locale)
 */
const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <I18nProvider>
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </I18nProvider>
    );
};

describe('DashboardHealthV2', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Replace global localStorage mock with a functional one for English locale
        const store: Record<string, string> = { 'app-language': 'en-US' };
        const mockStorage = {
            getItem: (key: string) => store[key] ?? null,
            setItem: (key: string, value: string) => { store[key] = value; },
            removeItem: (key: string) => { delete store[key]; },
            clear: () => { Object.keys(store).forEach(k => delete store[k]); },
        };
        Object.defineProperty(window, 'localStorage', {
            value: mockStorage,
            writable: true,
            configurable: true,
        });
        Object.defineProperty(global, 'localStorage', {
            value: mockStorage,
            writable: true,
            configurable: true,
        });
    });

    it('renders the dashboard components correctly', () => {
        renderWithProviders(<DashboardHealthV2 />);

        // Quick Actions section
        expect(screen.getByText('Quick Actions')).toBeDefined();

        // Check Chart presence via TestId
        expect(screen.getByTestId('area-chart')).toBeDefined();
    });

    it('renders Generate Report and Risk Assessment buttons', () => {
        renderWithProviders(<DashboardHealthV2 />);

        expect(screen.getByText('Generate Report')).toBeDefined();
        expect(screen.getByText('Risk Assessment')).toBeDefined();
    });

    it('navigates to report center when Generate Report is clicked', () => {
        renderWithProviders(<DashboardHealthV2 />);

        const reportButton = screen.getByText('Generate Report');
        fireEvent.click(reportButton);

        expect(mockNavigate).toHaveBeenCalledWith('/esg/report-center');
    });

    it('navigates to climate risk when Risk Assessment is clicked', () => {
        renderWithProviders(<DashboardHealthV2 />);

        const riskButton = screen.getByText('Risk Assessment');
        fireEvent.click(riskButton);

        expect(mockNavigate).toHaveBeenCalledWith('/esg/climate-risk');
    });
});
