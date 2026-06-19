'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    category?: string;
}

export default function PageHeader({ title, subtitle, category }: PageHeaderProps) {
    return (
        <div className="mb-12">
            {/* 🧭 Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4">
                <Link href="/omnicenter" className="hover:text-aqua transition-colors flex items-center gap-1">
                    <Home size={10} />
                    OmniCenter
                </Link>
                <ChevronRight size={10} />
                {category && (
                    <>
                        <span className="text-gray-400">{category}</span>
                        <ChevronRight size={10} />
                    </>
                )}
                <span className="text-aqua font-bold">{title}</span>
            </nav>

            {/* 🏛️ Title Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
            >
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 text-omni-text-main">
                    {title}
                </h1>
                <p className="text-omni-text-sub text-sm max-w-2xl leading-relaxed">
                    {subtitle}
                </p>

                {/* Decorative underline */}
                <div className="absolute -bottom-4 left-0 w-12 h-1 bg-aqua rounded-full" />
            </motion.div>
        </div>
    );
}
