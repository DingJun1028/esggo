import React from 'react';
import { Rocket, UserCircle2, Cpu, Boxes, ShieldCheck } from 'lucide-react';
import { OnboardingStep } from '@/components/common/ServiceOnboardingOverlay';

export const FIRST_RESONANCE_STEPS: OnboardingStep[] = [
    {
        id: 'welcome',
        title: '歡迎來到 InfoOne',
        description: '這不只是一個平台，而是您的數位永續分身。在這裡，您的每一個 ESG 行動都將轉化為不可篡改的「知識資產」。',
        icon: <Rocket className="w-6 h-6" />,
        type: 'info'
    },
    {
        id: 'avatarName',
        title: '定義您的名諱',
        description: '請輸入此數位分身的名稱。這將成為您在區塊鏈上的主要識別碼。',
        icon: <UserCircle2 className="w-6 h-6" />,
        type: 'input',
        inputPlaceholder: 'Enter Avatar Name...',
        validation: (val: any) => val && val.length > 2
    },
    {
        id: 'archetype',
        title: '選擇您的原型',
        description: '原型決定了您的初始屬性加成與 AI 導師風格。',
        icon: <Cpu className="w-6 h-6" />,
        type: 'selection',
        options: [
            { label: 'Strategist 策略家', value: 'strategist', icon: <Boxes className="w-4 h-4" /> },
            { label: 'Guardian 守護者', value: 'guardian', icon: <ShieldCheck className="w-4 h-4" /> },
        ]
    }
];
