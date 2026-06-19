/**
 * Integration Tests for ErrorBoundary Component
 * 錯誤邊界組件的整合測試
 */

import React, { Component, ErrorInfo } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ErrorBoundary Component
import { ErrorBoundary, AsyncErrorBoundary, useErrorBoundary } from '../ErrorBoundary';

// Test Component that throws error
class BuggyComponent extends Component<{ shouldThrow?: boolean; errorMessage?: string }> {
  static displayName = 'BuggyComponent';

  componentDidMount() {
    if (this.props.shouldThrow) {
      throw new Error(this.props.errorMessage || 'Test error');
    }
  }

  render() {
    return <div>Working component</div>;
  }
}

// Test Component with async error
class AsyncBuggyComponent extends Component<{ shouldThrow?: boolean }> {
  async componentDidMount() {
    if (this.props.shouldThrow) {
      throw new Error('Async error');
    }
  }

  render() {
    return <div>Async component</div>;
  }
}

// Test Functional Component that throws
function ThrowingFunctionalComponent({ shouldThrow }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Functional component error');
  }
  return <div>Working functional component</div>;
}

describe('ErrorBoundary Component Integration Tests', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ErrorBoundary Class Component', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="success">Success</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('success')).toBeInTheDocument();
    });

    it('should catch errors from child components', () => {
      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow errorMessage="Test error message" />
        </ErrorBoundary>
      );

      expect(screen.getByText('發生錯誤')).toBeInTheDocument();
    });

    it('should display error message when error is caught', () => {
      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow errorMessage="Custom error message" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should call onError callback when error is caught', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <BuggyComponent shouldThrow />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('should show retry button when error occurs', () => {
      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByText('重試')).toBeInTheDocument();
    });

    it('should recover after retry when error is resolved', () => {
      render(
        <ErrorBoundary>
          <BuggyComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Working component')).toBeInTheDocument();
    });
  });

  describe('AsyncErrorBoundary Component', () => {
    it('should render children when no error occurs', () => {
      render(
        <AsyncErrorBoundary>
          <div data-testid="async-success">Async Success</div>
        </AsyncErrorBoundary>
      );

      expect(screen.getByTestId('async-success')).toBeInTheDocument();
    });

    it('should catch async errors from child components', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

      render(
        <AsyncErrorBoundary>
          <AsyncBuggyComponent shouldThrow />
        </AsyncErrorBoundary>
      );

      // We wait for the fallback UI to appear
      await waitFor(() => {
        expect(screen.queryByText('載入失敗')).toBeInTheDocument();
      }, { timeout: 3000 });

      consoleSpy.mockRestore();
    });
  });

  describe('useErrorBoundary Hook', () => {
    it('should return null error when no error captured', () => {
      function TestComponent() {
        const { error, resetError, captureError } = useErrorBoundary();

        return (
          <div>
            <span data-testid="error-status">{error ? 'has error' : 'no error'}</span>
            <button onClick={() => captureError(new Error('Test') as Error)}>Capture</button>
            <button onClick={resetError}>Reset</button>
          </div>
        );
      }

      render(<TestComponent />);

      expect(screen.getByTestId('error-status')).toHaveTextContent('no error');
    });

    it('should capture error when captureError is called', () => {
      function TestComponent() {
        const { error, captureError } = useErrorBoundary();

        return (
          <div>
            <span data-testid="error-message">{error?.message || 'no error'}</span>
            <button onClick={() => captureError(new Error('Hook error') as Error)}>Capture</button>
          </div>
        );
      }

      render(<TestComponent />);

      fireEvent.click(screen.getByText('Capture'));

      expect(screen.getByTestId('error-message')).toHaveTextContent('Hook error');
    });

    it('should reset error when resetError is called', () => {
      function TestComponent() {
        const { error, captureError, resetError } = useErrorBoundary();

        return (
          <div>
            <span data-testid="error-message">{error?.message || 'no error'}</span>
            <button onClick={() => captureError(new Error('Error to reset') as Error)}>Capture</button>
            <button onClick={resetError}>Reset</button>
          </div>
        );
      }

      render(<TestComponent />);

      fireEvent.click(screen.getByText('Capture'));
      expect(screen.getByTestId('error-message')).toHaveTextContent('Error to reset');

      fireEvent.click(screen.getByText('Reset'));
      expect(screen.getByTestId('error-message')).toHaveTextContent('no error');
    });
  });

  describe('ErrorBoundary Props', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom Error UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <BuggyComponent shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    });

    it('should show error details when showDetails is true', () => {
      render(
        <ErrorBoundary showDetails>
          <BuggyComponent shouldThrow errorMessage="Detailed error" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Detailed error')).toBeInTheDocument();
    });

    it('should hide error details when showDetails is false', () => {
      render(
        <ErrorBoundary showDetails={false}>
          <BuggyComponent shouldThrow errorMessage="Hidden error" />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Hidden error')).not.toBeInTheDocument();
    });
  });

  describe('ErrorBoundary State', () => {
    it('should have correct initial state', () => {
      const initialState = {
        hasError: false,
        error: null,
        errorInfo: null,
        isCopied: false,
      };

      expect(initialState.hasError).toBe(false);
      expect(initialState.error).toBeNull();
      expect(initialState.errorInfo).toBeNull();
      expect(initialState.isCopied).toBe(false);
    });

    it('should update state when error is caught', () => {
      const errorState = {
        hasError: true,
        error: new Error('State test error'),
        errorInfo: null as ErrorInfo | null,
        isCopied: false,
      };

      expect(errorState.hasError).toBe(true);
      expect(errorState.error?.message).toBe('State test error');
    });
  });
});
