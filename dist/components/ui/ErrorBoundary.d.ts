import React, { Component, ErrorInfo, ReactNode } from 'react';
interface Props {
    children: ReactNode;
}
interface State {
    hasError: boolean;
    error: Error | null;
    retryCount: number;
}
export declare class ErrorBoundary extends Component<Props, State> {
    state: State;
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    private handleReset;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | React.JSX.Element | null | undefined;
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map