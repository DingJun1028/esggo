type AlertVariant = 'success' | 'warning' | 'error' | 'info';
interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    dismissible?: boolean;
    className?: string;
}
export declare function Alert({ variant, title, children, dismissible, className }: AlertProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=Alert.d.ts.map