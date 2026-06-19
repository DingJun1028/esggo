import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import { expect, test, describe } from 'vitest';
import React from 'react';

describe('Button Component', () => {
  test('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('applies primary variant by default', () => {
    const { container } = render(<Button>Default</Button>);
    expect(container.firstChild).toHaveClass('bg-berkeley-blue');
  });

  test('shows loading state and disables button', () => {
    render(<Button loading>Loading...</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument(); // Loading spinner
  });
});
