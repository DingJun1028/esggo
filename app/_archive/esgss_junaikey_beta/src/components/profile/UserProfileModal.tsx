import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    User,
    Mail,
    Shield,
    CreditCard,
    Camera,
    Save,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, profile, logout } = useAuth();
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || 'BingJun');

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-[#0a0f16]/90 border border-[#0df2df]/20 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl"
                >
                    {/* Header */}
                    <div className="h-32 bg-gradient-to-br from-[#0df2df]/20 via-blue-900/20 to-purple-900/20 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Profile Badge (Floating) */}
                    <div className="relative px-6 -mt-16 mb-4">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-2xl bg-black border-2 border-[#0df2df] p-1 shadow-[0_0_30px_rgba(13,242,223,0.3)]">
                                <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-[#0df2df]" />
                                    )}
                                </div>
                            </div>
                            <button className="absolute bottom-[-8px] right-[-8px] p-2 bg-[#0df2df] text-black rounded-lg hover:bg-[#00fff2] transition-colors shadow-lg">
                                <Camera size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {isEditing ? (
                                        <input
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-lg w-full focus:outline-none focus:border-[#0df2df]"
                                        />
                                    ) : (
                                        profile?.displayName || user?.displayName || 'DingJun (主祭)'
                                    )}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-[#0df2df]/10 text-[#0df2df] text-[10px] font-bold rounded border border-[#0df2df]/30 uppercase tracking-wider">
                                        {t('cyber.level')} LV.10
                                    </span>
                                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded border border-purple-500/30">
                                        OMNI-ADMIN
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-slate-400 hover:text-[#0df2df] transition-colors text-xs font-bold uppercase tracking-wider"
                            >
                                {isEditing ? t('profile.save') : t('profile.edit')}
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                <Mail size={16} className="text-slate-400" />
                                <div className="flex-1">
                                    <span className="text-[10px] text-slate-500 uppercase block">Email</span>
                                    <span className="text-sm text-slate-200">{user?.email || 'dingjun@esgss.com'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                <Shield size={16} className="text-emerald-400" />
                                <div className="flex-1">
                                    <span className="text-[10px] text-slate-500 uppercase block">Role ID</span>
                                    <span className="text-sm text-emerald-400 font-mono">SOV-ADMIN-001</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                <CreditCard size={16} className="text-amber-400" />
                                <div className="flex-1">
                                    <span className="text-[10px] text-slate-500 uppercase block">Total Contribution</span>
                                    <span className="text-sm text-amber-500 font-mono font-bold">$1,420,000 ESG-V</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-white/10">
                            <button
                                onClick={logout}
                                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
                            >
                                <LogOut size={16} />
                                {t('ui.logout')}
                            </button>
                        </div>

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
