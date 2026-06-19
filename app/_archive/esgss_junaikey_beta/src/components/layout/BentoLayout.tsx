import React from 'react';
import { motion } from 'framer-motion';

interface BentoLayoutProps {
    children: React.ReactNode;
    className?: string;
    fullHeight?: boolean;
}

/**
 * BentoLayout
 * -----------
 * A responsive grid container that implements the "Bento Box" high-density layout.
 * Mobile: 1 Col
 * Tablet: 2 Col
 * Desktop: 12 Col (Flexible)
 */
export const BentoLayout: React.FC<BentoLayoutProps> = ({
    children,
    className = '',
    fullHeight = true
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`bento-container w-full ${fullHeight ? 'h-screen' : 'min-h-screen'} bg-[#0A0A0F] ${className}`}
        >
            {children}
        </motion.div>
    );
};
