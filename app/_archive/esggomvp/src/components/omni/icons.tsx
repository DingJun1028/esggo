import React from 'react';
import {
    Shield,
    Settings,
    Database,
    Zap,
    CheckCircle2,
    AlertCircle,
    Cpu,
    Link as LinkIcon,
    Flame,
    Infinity,
    Globe,
    BarChart3,
    Bot,
    Layers,
    Search,
    History,
    Lock,
    Calendar,
    Eye,
    Edit3,
    ExternalLink,
    ChevronRight,
    ChevronDown,
    Info
} from 'lucide-react';

export const OmniIcons = {
    Trust: Shield,
    Automation: Zap,
    Data: Database,
    Settings: Settings,
    Success: CheckCircle2,
    Error: AlertCircle,
    AI: Cpu,
    Link: LinkIcon,
    Energy: Flame,
    Eternal: Infinity,
    Governance: Globe,
    Analysis: BarChart3,
    Bot: Bot,
    Layers: Layers,
    Search: Search,
    History: History,
    Lock: Lock,
    Calendar: Calendar,
    Eye: Eye,
    Edit: Edit3,
    External: ExternalLink,
    ChevronRight: ChevronRight,
    ChevronDown: ChevronDown,
    Info: Info
};

export type OmniIconType = keyof typeof OmniIcons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: OmniIconType;
    size?: number | string;
    className?: string;
}

export const OmniIcon: React.FC<IconProps> = ({ name, size = 20, className, ...props }) => {
    const IconComponent = OmniIcons[name];
    if (!IconComponent) return null;
    return <IconComponent size={size} className={className} {...props} />;
};
