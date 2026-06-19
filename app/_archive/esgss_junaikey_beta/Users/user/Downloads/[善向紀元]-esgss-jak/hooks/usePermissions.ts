import { useMemo } from 'react';
import { Permission, UserRole, RolePermissions } from '../types';

interface UsePermissionsReturn {
    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    hasAllPermissions: (permissions: Permission[]) => boolean;
    userRole: UserRole;
    userPermissions: Permission[];
}

export const usePermissions = (userRole: UserRole = UserRole.ADMIN): UsePermissionsReturn => {
    const userPermissions = useMemo(() => RolePermissions[userRole] || [], [userRole]);

    const hasPermission = (permission: Permission): boolean => {
        return userPermissions.includes(permission);
    };

    const hasAnyPermission = (permissions: Permission[]): boolean => {
        return permissions.some(permission => userPermissions.includes(permission));
    };

    const hasAllPermissions = (permissions: Permission[]): boolean => {
        return permissions.every(permission => userPermissions.includes(permission));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        userRole,
        userPermissions,
    };
};