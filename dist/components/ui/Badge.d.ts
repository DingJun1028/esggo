export type BadgeVariant = 'verified' | 'draft' | 'warning' | 'error' | 'primary' | 'secondary' | 'info' | 'success' | 'default' | 'outline' | 'gold' | 'neutral' | 'primary-light' | 'secondary-light' | 'warning-light' | 'error-light' | 'pending' | 'completed' | 'in-progress' | 'canceled' | 'archived';
interface BadgeProps {
    status?: BadgeVariant;
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
export declare function Badge({ status, variant, children, className, style }: BadgeProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Badge.d.ts.map