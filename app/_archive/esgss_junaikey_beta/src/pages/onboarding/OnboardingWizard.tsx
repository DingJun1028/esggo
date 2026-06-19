import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, CloudRain, Droplets, Flame, Globe, Mountain, Sprout, Wind } from 'lucide-react';
import FirstResonanceStep from './steps/FirstResonanceStep';
import The5TExperienceStep from './steps/The5TExperienceStep';
import ImpactNexusStep from './steps/ImpactNexusStep';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/UserService';

const OnboardingWizard: React.FC = () => {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [userData, setUserData] = useState({
        archetype: '',
        element: '',
        verified5T: false,
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleComplete = async () => {
        if (!user) {
            console.error('No user found');
            navigate('/');
            return;
        }

        try {
            // Save user data (persist to Firestore)
            await UserService.updateUserProfile(user.uid, {
                onboardingCompleted: true,
                archetype: userData.archetype,
                // Add element or other fields if needed
            });
            console.log('Onboarding Complete:', userData);
            navigate('/');
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
            // Optionally show error to user
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#00FFFF] selection:text-white">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
                <motion.div
                    className="h-full bg-[#00FFFF]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Ambient */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00FFFF]/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/10 rounded-full blur-[100px] animate-pulse animation-delay-2000" />

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl text-center z-10"
                        >
                            <div className="mb-6 flex justify-center">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#00FFFF]">
                                    <Droplets size={32} />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to InfoOne</h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                "Service as Teaching, Knowledge as Asset."<br />
                                Begin your journey to sustainable impact. First, let's find your resonance.
                            </p>
                            <button
                                onClick={nextStep}
                                className="px-8 py-3 bg-[#00FFFF] text-white rounded-full font-bold shadow-lg shadow-[#00FFFF]/30 hover:bg-[#528a96] transition-all flex items-center gap-2 mx-auto"
                            >
                                Begin Journey <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <FirstResonanceStep
                            key="step1"
                            onNext={(data) => {
                                setUserData({ ...userData, ...data });
                                nextStep();
                            }}
                        />
                    )}

                    {/* Placeholder for Steps 2 & 3 */}
                    {step === 2 && (
                        <The5TExperienceStep
                            key="step2"
                            onNext={() => {
                                setUserData({ ...userData, verified5T: true });
                                nextStep();
                            }}
                        />
                    )}
                    {step === 3 && (
                        <ImpactNexusStep
                            key="step3"
                            onNext={handleComplete}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default OnboardingWizard;

