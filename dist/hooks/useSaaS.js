'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
const SaaSContext = createContext({
    plan: 'free',
    usage: { aiWords: 0, aiLimit: 10000, sealedDocs: 0, vaultLimit: 50 },
    isExpiringSoon: false,
    upgradePlan: () => { }
});
export function SaaSProvider({ children }) {
    const { companyId } = useAuth();
    const [plan, setPlan] = useState('free');
    const [usage, setUsage] = useState({
        aiWords: 12500,
        aiLimit: 50000,
        sealedDocs: 8,
        vaultLimit: 100
    });
    useEffect(() => {
        // In production, fetch subscription data from Supabase/Stripe
        if (companyId === 'default') {
            setPlan('professional');
        }
    }, [companyId]);
    const upgradePlan = () => {
        window.location.href = '/publish'; // Redirect to a billing/upgrade page
    };
    return (_jsx(SaaSContext.Provider, { value: { plan, usage, isExpiringSoon: false, upgradePlan }, children: children }));
}
export const useSaaS = () => useContext(SaaSContext);
//# sourceMappingURL=useSaaS.js.map