import React from 'react';
interface BrandAvatarProps {
    name: string;
    src?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    status?: 'online' | 'offline' | 'busy';
    onClick?: () => void;
}
export default function BrandAvatar({ name, src, size, color, status, onClick }: BrandAvatarProps): React.JSX.Element;
export {};
//# sourceMappingURL=BrandAvatar.d.ts.map