import { useConfirmInternal, ConfirmOptions } from '../contexts/ConfirmContext';

/**
 * Custom hook to trigger a premium confirmation dialog.
 * Usage:
 * const confirm = useConfirm();
 * const ok = await confirm({ title: 'Delete?', message: '...' });
 */
export const useConfirm = () => {
    const { confirm } = useConfirmInternal();
    return confirm;
};
