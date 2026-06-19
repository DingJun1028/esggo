import React from 'react';

export function withOmniProxy<P extends object>(
  Component: React.ComponentType<P>,
  options: { enableTracking?: boolean; enableCircuitBreaker?: boolean } = {}
): React.FC<P> {
  const ComponentName = Component.displayName || Component.name || 'Component';

  const WrappedComponent: React.FC<P> = props => {
    // Basic pass-through for now
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `WithOmniProxy(${ComponentName})`;
  return WrappedComponent;
}
