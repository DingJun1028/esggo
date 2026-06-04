interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
    evidenceUuid?: string;
}
export declare function Tooltip({ content, children, position, className, evidenceUuid }: TooltipProps & {
    evidenceUuid?: string;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=Tooltip.d.ts.map