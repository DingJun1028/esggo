interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}
export declare function Modal({ open, onClose, title, subtitle, children, footer, size, className }: ModalProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=Modal.d.ts.map