
import { useState, useCallback, useEffect } from 'react';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';
import { useAuth } from '../contexts/AuthContext';

export interface IAvatarState {
    currentPersonaId: string;
    mood: 'Neutral' | 'Happy' | 'Serious' | 'Concerned' | 'Enlightened';
    isSpeaking: boolean;
    lastInteraction: number;
}

interface UseAvatarReturn {
    avatarState: IAvatarState | null;
    isLoading: boolean;
    error: string | null;
    sendMessage: (message: string, context?: any) => Promise<string | null>;
    switchPersona: (personaId: string) => Promise<boolean>;
    refreshState: () => Promise<void>;
}

export const useAvatar = (): UseAvatarReturn => {
    const [avatarState, setAvatarState] = useState<IAvatarState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const getToken = useCallback(async () => {
        if (!user) return null;
        return await user.getIdToken();
    }, [user]);

    const fetchState = useCallback(async () => {
        const token = await getToken();
        if (!token) return;

        try {
            const res = await fetch('/api/avatar/state', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAvatarState(data.data);
            }
        } catch (err) {
            omniLogger.warn(LogCategory.AI, '[useAvatar] Failed to fetch state', { error: err });
        }
    }, [getToken]);

    useEffect(() => {
        if (user) fetchState();
    }, [fetchState, user]);

    const sendMessage = useCallback(async (message: string, context: any = {}) => {
        setIsLoading(true);
        setError(null);
        const token = await getToken();
        if (!token) {
            setError("User not authenticated");
            setIsLoading(false);
            return null;
        }

        try {
            const res = await fetch('/api/avatar/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message, context })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            setAvatarState(data.data.state);
            return data.data.response;
        } catch (err: any) {
            setError(err.message);
            omniLogger.error(LogCategory.AI, '[useAvatar] Chat failed', { error: err });
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    const switchPersona = useCallback(async (personaId: string) => {
        setIsLoading(true);
        const token = await getToken();
        if (!token) return false;

        try {
            const res = await fetch('/api/avatar/switch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ personaId })
            });

            const data = await res.json();
            if (data.success) {
                setAvatarState(data.data);
                return true;
            }
            return false;
        } catch (err) {
            omniLogger.error(LogCategory.AI, '[useAvatar] Switch failed', { error: err });
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    return {
        avatarState,
        isLoading,
        error,
        sendMessage,
        switchPersona,
        refreshState: fetchState
    };
};
