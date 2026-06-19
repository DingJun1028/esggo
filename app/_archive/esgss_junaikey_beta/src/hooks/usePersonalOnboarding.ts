import { useState, useEffect, useCallback } from 'react';
import { UserAvatarProfile } from '@/types/user';
import { STORAGE_KEYS } from '@/constants/app';

export const usePersonalOnboarding = () => {
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [avatarData, setAvatarData] = useState<UserAvatarProfile | null>(null);

    useEffect(() => {
        const hasSeen = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
        const storedAvatar = localStorage.getItem(STORAGE_KEYS.USER_AVATAR_DATA);

        if (!hasSeen) setShowOnboarding(true);
        if (storedAvatar) {
            try {
                setAvatarData(JSON.parse(storedAvatar));
            } catch (e) {
                console.error("Failed to parse avatar data", e);
            }
        }

        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleOnboardingComplete = useCallback((data?: UserAvatarProfile) => {
        if (data) {
            console.log('Onboarding Complete:', data);
            localStorage.setItem(STORAGE_KEYS.USER_AVATAR_DATA, JSON.stringify(data));
            setAvatarData(data);
        }
        localStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
        setShowOnboarding(false);
    }, []);

    return {
        loading,
        showOnboarding,
        avatarData,
        handleOnboardingComplete
    };
};
