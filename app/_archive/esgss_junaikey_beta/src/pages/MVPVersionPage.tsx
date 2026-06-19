
import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DashboardHealthV2 } from '@/components/dashboard/DashboardHealthV2';

const MVPVersionPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto space-y-6"
            >
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-200">BETA v8.2.5</span>
                        <span className="px-2 py-1 rounded-full bg-aqua-500/10 text-aqua-600 text-xs font-bold border border-aqua-200">Sentient-Learning</span>
                        <span className="text-[10px] text-slate-400 font-mono hidden md:inline-block">TRANSCENDED, ETERNAL & NIRVANA ♾️</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Button variant="outline" onClick={() => navigate('/esg/intelligence-center')} className="justify-start border-slate-200 hover:border-aqua-400 hover:text-aqua-600 transition-colors">
                        Draft: Intelligence (Omni-Circle)
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/esg/impact-village')} className="justify-start border-slate-200 hover:border-emerald-400 hover:text-emerald-600 transition-colors">
                        Draft: Impact Village (Bento)
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/esg-report-center')} className="justify-start border-slate-200 hover:border-gold-400 hover:text-gold-600 transition-colors">
                        Draft: Report Center (Matrix)
                    </Button>
                </div>

                <DashboardHealthV2 />
            </motion.div>
        </div>
    );
};

export default MVPVersionPage;
