import { expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OmniButton } from './OmniButton';

test('renders OmniButton with label', () => {
  render(<OmniButton label="Test Button" onClick={() => {}} />);
  expect(screen.getByRole('button')).toHaveTextContent('Test Button');
});

test('calls onClick handler when clicked', () => {
  const handleClick = vi.fn();
  render(<OmniButton label="Click Me" onClick={handleClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('applies primary variant styles by default', () => {
  render(<OmniButton label="Primary" onClick={() => {}} />);
  const button = screen.getByRole('button');
  expect(button.className).toContain('bg-berkeley-blue');
});

test('applies secondary variant styles', () => {
  render(<OmniButton label="Secondary" onClick={() => {}} variant="secondary" />);
  const button = screen.getByRole('button');
  expect(button.className).toContain('bg-founders-rock');
});

test('applies danger variant styles', () => {
  render(<OmniButton label="Danger" onClick={() => {}} variant="danger" />);
  const button = screen.getByRole('button');
  expect(button.className).toContain('bg-red-600');
});

test('is disabled when disabled prop is true', () => {
  render(<OmniButton label="Disabled" onClick={() => {}} disabled />);
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
});
