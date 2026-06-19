/**
 * BentoGrid Component Tests
 * Tests for BentoGrid and BentoItem: rendering, prop mapping, slot display
 * [5T Protocol] Traceable test coverage for core layout component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BentoGrid, BentoItem } from '../BentoGrid';

describe('BentoGrid', () => {
    it('should render children inside a grid container', () => {
        const { container } = render(
            <BentoGrid>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
            </BentoGrid>
        );

        expect(screen.getByTestId('child-1')).toBeDefined();
        expect(screen.getByTestId('child-2')).toBeDefined();
        // Container uses CSS grid classes
        const gridEl = container.firstElementChild as HTMLElement;
        expect(gridEl.className).toContain('grid');
    });

    it('should apply custom className', () => {
        const { container } = render(
            <BentoGrid className="custom-class">
                <div>Item</div>
            </BentoGrid>
        );

        const gridEl = container.firstElementChild as HTMLElement;
        expect(gridEl.className).toContain('custom-class');
    });

    it('should use 12-column grid layout', () => {
        const { container } = render(
            <BentoGrid>
                <div>Item</div>
            </BentoGrid>
        );

        const gridEl = container.firstElementChild as HTMLElement;
        expect(gridEl.className).toContain('md:grid-cols-12');
    });
});

describe('BentoItem', () => {
    it('should render children content', () => {
        render(
            <BentoItem>
                <p>Content</p>
            </BentoItem>
        );

        expect(screen.getByText('Content')).toBeDefined();
    });

    it('should render title when provided', () => {
        render(
            <BentoItem title="Card Title">
                <p>Body</p>
            </BentoItem>
        );

        expect(screen.getByText('Card Title')).toBeDefined();
    });

    it('should render subtitle when provided', () => {
        render(
            <BentoItem title="Title" subtitle="Subtitle text">
                <p>Body</p>
            </BentoItem>
        );

        expect(screen.getByText('Subtitle text')).toBeDefined();
    });

    it('should apply default colSpan of 4 (md:col-span-4)', () => {
        const { container } = render(
            <BentoItem>
                <p>Body</p>
            </BentoItem>
        );

        const itemEl = container.firstElementChild as HTMLElement;
        expect(itemEl.className).toContain('md:col-span-4');
    });

    it('should apply custom colSpan', () => {
        const { container } = render(
            <BentoItem colSpan={6}>
                <p>Half Width</p>
            </BentoItem>
        );

        const itemEl = container.firstElementChild as HTMLElement;
        expect(itemEl.className).toContain('md:col-span-6');
    });

    it('should apply custom rowSpan', () => {
        const { container } = render(
            <BentoItem rowSpan={2}>
                <p>Tall Item</p>
            </BentoItem>
        );

        const itemEl = container.firstElementChild as HTMLElement;
        expect(itemEl.className).toContain('row-span-2');
    });

    it('should render icon when provided', () => {
        render(
            <BentoItem icon={<span data-testid="icon">🌿</span>}>
                <p>Body</p>
            </BentoItem>
        );

        expect(screen.getByTestId('icon')).toBeDefined();
    });

    it('should render headerAction when provided', () => {
        render(
            <BentoItem
                title="Title"
                headerAction={<button data-testid="action-btn">Action</button>}
            >
                <p>Body</p>
            </BentoItem>
        );

        expect(screen.getByTestId('action-btn')).toBeDefined();
    });

    it('should not render header section when no title/icon provided', () => {
        const { container } = render(
            <BentoItem>
                <p>Body Only</p>
            </BentoItem>
        );

        // The header div with "flex items-start justify-between" should not exist
        const headerDivs = container.querySelectorAll('.flex.items-start.justify-between');
        expect(headerDivs.length).toBe(0);
    });

    it('should apply custom className', () => {
        const { container } = render(
            <BentoItem className="my-custom-bento">
                <p>Body</p>
            </BentoItem>
        );

        const itemEl = container.firstElementChild as HTMLElement;
        expect(itemEl.className).toContain('my-custom-bento');
    });

    it('should fallback to default colSpan for out-of-range values', () => {
        const { container } = render(
            <BentoItem colSpan={99}>
                <p>Body</p>
            </BentoItem>
        );

        const itemEl = container.firstElementChild as HTMLElement;
        // Falls back to 'md:col-span-4' when colSpan is not in 1-12
        expect(itemEl.className).toContain('md:col-span-4');
    });
});
