/// <reference types="vitest" />
/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';

// Mock Pages
const MockDashboard = () => <div data-testid="dashboard">Dashboard</div>;
const MockQuantumVault = () => {
    const navigate = useNavigate();
    return (
        <div data-testid="quantum-vault">
            <h1>Quantum Vault</h1>
            <button onClick={() => navigate('/')} data-testid="back-btn">
                Back
            </button>
        </div>
    );
};
const MockLiquidNetwork = () => <div data-testid="liquid-network">Liquid Network</div>;

describe('Navigation Regression Test', () => {
    it('renders dashboard by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<MockDashboard />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('dashboard')).toBeDefined();
    });

    it('navigates to Quantum Vault', () => {
        render(
            <MemoryRouter initialEntries={['/quantum-vault']}>
                <Routes>
                    <Route path="/quantum-vault" element={<MockQuantumVault />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('quantum-vault')).toBeDefined();
    });

    it('can navigate back from Quantum Vault', () => {
        const App = () => (
            <Routes>
                <Route path="/" element={<MockDashboard />} />
                <Route path="/quantum-vault" element={<MockQuantumVault />} />
            </Routes>
        );

        render(
            <MemoryRouter initialEntries={['/quantum-vault']}>
                <App />
            </MemoryRouter>
        );

        const backBtn = screen.getByTestId('back-btn');
        fireEvent.click(backBtn);
        expect(screen.getByTestId('dashboard')).toBeDefined();
    });
});
