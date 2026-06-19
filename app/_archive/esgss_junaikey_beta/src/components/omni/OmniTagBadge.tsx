import React from 'react';
import { motion } from 'framer-motion';
import { OmniTag, FiveTCertification } from '@/types/omniTag';
import { OmniTagManager } from '@/utils/omniTagManager';
import * as Icons from 'lucide-react';
import FiveTProtocolBadge from './FiveTProtocolBadge';

interface OmniTagBadgeProps {
    tag: Partial<OmniTag> | string;
    showNamespace?: boolean;
    interactive?: boolean;
    certification?: FiveTCertification;
    onClick?: (tag: OmniTag) => void;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * OmniTagBadge: A premium visual representation of an OmniTag.
 */
const OmniTagBadge: React.FC<OmniTagBadgeProps> = ({
    tag,
    showNamespace = true,
    interactive = false,
    certification,
    onClick,
    size = 'sm'
}) => {
    // Handle string inputs like "sys:role:admin"
    const tagObj = typeof tag === 'string' ? OmniTagManager.parse(tag) : tag;
    const theme = OmniTagManager.getNamespaceTheme(tagObj.namespace || 'unknown');

    // Resolve Icon
    // @ts-ignore
    const LucideIcon = Icons[tagObj.icon || theme.icon] || Icons.Hash;

    const sizeClasses = {
        xs: 'px-1.5 py-0.5 text-[9px] gap-1',
        sm: 'px-2 py-1 text-[10px] gap-1.5',
        md: 'px-3 py-1.5 text-xs gap-2',
        lg: 'px-4 py-2 text-sm gap-2.5',
    };

    return (
        <motion.div
            whileHover={interactive ? { scale: 1.05, translateY: -1 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
            onClick={() => interactive && onClick?.(tagObj as OmniTag)}
            className={`
                inline-flex items-center rounded-lg border backdrop-blur-sm transition-all
                ${theme.color} 
                ${sizeClasses[size]}
                ${interactive ? 'cursor-pointer hover:shadow-lg hover:shadow-current/10' : ''}
            `}
        >
            <LucideIcon size={size === 'xs' ? 10 : size === 'lg' ? 16 : 12} className="opacity-70" />

            <div className="flex items-center">
                {showNamespace && (
                    <span className="opacity-40 font-mono uppercase tracking-tighter mr-1">
                        {tagObj.namespace}:
                    </span>
                )}
                <span className="opacity-60 font-mono lower mr-0.5">
                    {tagObj.category}:
                </span>
                <span className="font-bold tracking-tight">
                    {tagObj.label || tagObj.value}
                </span>
            </div>

            {interactive && (certification || (tagObj as any).certification) && (
                <div className="ml-2 scale-75 origin-right">
                    <FiveTProtocolBadge size="sm" />
                </div>
            )}

            {interactive && !certification && !(tagObj as any).certification && (
                <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.ChevronRight size={10} />
                </div>
            )}
        </motion.div>
    );
};

export default OmniTagBadge;
