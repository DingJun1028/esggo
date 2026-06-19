import React from 'react';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';
import { View } from '@/types/core';
import { motion } from 'framer-motion';
import { HeartHandshake, MapPin, Users, Calendar } from 'lucide-react';

const PROJECTS = [
    {
        title: "Local Education Initiative",
        location: "Community Center",
        impact: "500+ Students Mentored",
        status: "Active",
        date: "Ongoing",
        image: "from-blue-500 to-cyan-500"
    },
    {
        title: "Urban Reforestation",
        location: "City Park",
        impact: "1,200 Trees Planted",
        status: "Completed",
        date: "Q3 2025",
        image: "from-emerald-500 to-green-500"
    },
    {
        title: "Food Security Program",
        location: "Various Locations",
        impact: "10,000 Meals Served",
        status: "Active",
        date: "Weekly",
        image: "from-amber-500 to-orange-500"
    }
];

export const CommunityImpactPage: React.FC = () => {
    return (
        <StitchPageTemplate
            title="Community Impact"
            subtitle="Philanthropy & Engagement"
            activeView={View.STAKEHOLDER}
            breadcrumbs={[
                { label: 'Hub', href: '/hub' },
                { label: 'Stakeholder', href: '/services/stakeholder' },
                { label: 'Community', href: '/services/stakeholder/community' }
            ]}
            headerIcon={<HeartHandshake className="w-6 h-6" />}
        >
            <div className="space-y-12">
                {/* Impact Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Investment', value: '$2.5M', sub: 'YTD Giving' },
                        { label: 'Volunteer Hours', value: '4,500', sub: 'Employee Time' },
                        { label: 'Beneficiaries', value: '15k+', sub: 'Lives Impacted' },
                        { label: 'Partners', value: '32', sub: 'NGOs & Non-profits' },
                    ].map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center group hover:bg-white/10 transition-colors"
                        >
                            <div className="text-3xl font-black text-[#63a6b0] mb-2 group-hover:scale-110 transition-transform">{metric.value}</div>
                            <div className="text-sm font-bold uppercase tracking-wider opacity-80">{metric.label}</div>
                            <div className="text-xs opacity-50 mt-1">{metric.sub}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Projects Timeline */}
                <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <MapPin className="w-6 h-6 text-[#63a6b0]" />
                        Active Initiatives
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PROJECTS.map((project, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="group relative overflow-hidden rounded-3xl bg-black border border-white/10 aspect-[4/3] flex flex-col justify-end p-6"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${project.image} opacity-20 group-hover:opacity-30 transition-opacity`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${project.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/60'}`}>
                                            {project.status}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] opacity-60">
                                            <Calendar className="w-3 h-3" />
                                            {project.date}
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-bold mb-1">{project.title}</h4>
                                    <div className="flex items-center gap-2 text-xs opacity-70 mb-3">
                                        <MapPin className="w-3 h-3" />
                                        {project.location}
                                    </div>

                                    <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[#63a6b0] text-xs font-bold">
                                        <Users className="w-3 h-3" />
                                        {project.impact}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </StitchPageTemplate>
    );
};
