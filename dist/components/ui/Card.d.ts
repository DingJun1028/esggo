import { HTMLAttributes } from 'react';
interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    hoverEffect?: boolean;
    glow?: boolean;
}
export declare const Card: import("react").ForwardRefExoticComponent<CardProps & import("react").RefAttributes<HTMLDivElement>>;
export declare function CardHeader({ title, subtitle, icon, className, children }: {
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}): import("react").JSX.Element;
export declare function CardContent({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): import("react").JSX.Element;
export declare function CardTitle({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=Card.d.ts.map