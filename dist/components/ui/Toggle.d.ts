interface ToggleProps {
    checked: boolean;
    onChange: (v: boolean) => void;
    label?: string;
    size?: 'sm' | 'md';
    disabled?: boolean;
    className?: string;
}
export declare function Toggle({ checked, onChange, label, size, disabled, className }: ToggleProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Toggle.d.ts.map