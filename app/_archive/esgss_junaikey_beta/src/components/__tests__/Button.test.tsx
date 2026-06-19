import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '../ui/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    render(<Button isLoading>Click me</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders icon button loading state correctly', () => {
    const { container } = render(<Button size="icon" isLoading>Icon</Button>);

    // The text "Loading..." should be present
    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toBeInTheDocument();

    // For icon buttons, the text should be visually hidden using sr-only
    // Note: Since I haven't implemented the change yet, this test is expected to fail or I can write it to expect the change I'm about to make.
    // I will write the test assuming the change is made (TDD style).
    expect(loadingText).toHaveClass('sr-only');

    // The spinner should NOT have margin classes
    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).not.toHaveClass('-ml-1');
    expect(spinner).not.toHaveClass('mr-2');
  });

  it('renders standard button loading state with margins', () => {
    const { container } = render(<Button size="md" isLoading>Standard</Button>);

    const loadingText = screen.getByText('Loading...');
    expect(loadingText).not.toHaveClass('sr-only');

    const spinner = container.querySelector('svg.animate-spin');
    expect(spinner).toHaveClass('-ml-1');
    expect(spinner).toHaveClass('mr-2');
  });
});
