import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export interface ConfirmOptions {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'info' | 'success';
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
    }>({
        isOpen: false,
        options: { title: '', message: '' },
    });

    const resolver = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback((options: ConfirmOptions) => {
        setState({ isOpen: true, options });
        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
        });
    }, []);

    const handleClose = useCallback((result: boolean) => {
        setState((prev) => ({ ...prev, isOpen: false }));
        if (resolver.current) {
            resolver.current(result);
            resolver.current = null;
        }
    }, []);

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <PremiumConfirmDialog
                isOpen={state.isOpen}
                onClose={() => handleClose(false)}
                onConfirm={() => handleClose(true)}
                options={state.options}
            />
        </ConfirmContext.Provider>
    );
};

import { PremiumConfirmDialog } from '@/components/ui/PremiumConfirmDialog';

export const useConfirmInternal = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};
