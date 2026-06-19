import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'CEO' | 'CFO' | 'CSO' | 'ESG_SPECIALIST' | 'SUPPLY_CHAIN_MANAGER' | 'AUDITOR';

interface RoleContextState {
    currentRole: UserRole;
    setRole: (role: UserRole) => void;
    getRoleLabel: (role: UserRole) => string;
}

export const useRoleContext = create<RoleContextState>()(
    persist(
        (set) => ({
            currentRole: 'ESG_SPECIALIST', // Default role
            setRole: (role) => set({ currentRole: role }),
            getRoleLabel: (role) => {
                switch (role) {
                    case 'CEO': return 'CEO / Strategy';
                    case 'CFO': return 'CFO / Finance';
                    case 'CSO': return 'CSO / Sustainability';
                    case 'ESG_SPECIALIST': return 'ESG Specialist';
                    case 'SUPPLY_CHAIN_MANAGER': return 'Supply Chain Manager';
                    case 'AUDITOR': return 'External Auditor';
                    default: return 'User';
                }
            }
        }),
        {
            name: 'role-context-storage',
        }
    )
);
