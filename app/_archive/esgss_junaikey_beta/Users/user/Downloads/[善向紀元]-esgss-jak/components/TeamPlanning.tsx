import React, { useState } from 'react';
import { Language } from '../types';
import {
    Users, UserCheck, Target, Calendar, Award, TrendingUp,
    Building, Lightbulb, Megaphone, Settings, Code, BookOpen
} from 'lucide-react';

export const TeamPlanning: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';

    const teamStructure = [
        {
            role: isZh ? '創辦人/CEO' : 'Founder/CEO',
            count: 1,
            responsibilities: [
                isZh ? '永續願景與策略制定' : 'Sustainability vision and strategy',
                isZh ? '外部關係建立 (政府/企業)' : 'External relations (government/corporate)',
                isZh ? '融資與投資人關係' : 'Financing and investor relations'
            ],
            icon: Award,
            priority: 'High'
        },
        {
            role: isZh ? '產品長 (Product Head)' : 'Product Head',
            count: 1,
            responsibilities: [
                isZh ? '遊戲設計與開發' : 'Game design and development',
                isZh ? '內容開發管理' : 'Content development management',
                isZh ? '使用者體驗優化' : 'User experience optimization',
                isZh ? '產品路線圖規劃' : 'Product roadmap planning'
            ],
            icon: Lightbulb,
            priority: 'High'
        },
        {
            role: isZh ? '內容長 (Content Head)' : 'Content Head',
            count: 1,
            responsibilities: [
                isZh ? '永續專家團隊管理 (E/S/G)' : 'Sustainability expert team management (E/S/G)',
                isZh ? '案例研究與內容創作' : 'Case studies and content creation',
                isZh ? '法規更新追蹤' : 'Regulatory updates tracking',
                isZh ? '教育內容開發' : 'Educational content development'
            ],
            icon: BookOpen,
            priority: 'High'
        },
        {
            role: isZh ? '行銷長 (Marketing Head)' : 'Marketing Head',
            count: 1,
            responsibilities: [
                isZh ? '品牌定位與策略' : 'Brand positioning and strategy',
                isZh ? '數位行銷執行' : 'Digital marketing execution',
                isZh ? '社群經營管理' : 'Social media management',
                isZh ? '合作夥伴拓展' : 'Partnership development'
            ],
            icon: Megaphone,
            priority: 'High'
        },
        {
            role: isZh ? '營運長 (Operations Head)' : 'Operations Head',
            count: 1,
            responsibilities: [
                isZh ? '生產管理與供應鏈' : 'Production management and supply chain',
                isZh ? '物流與倉儲運營' : 'Logistics and warehouse operations',
                isZh ? '客服團隊管理' : 'Customer service team management'
            ],
            icon: Settings,
            priority: 'Medium'
        },
        {
            role: isZh ? '技術長 (Tech Head)' : 'Tech Head',
            count: 1,
            responsibilities: [
                isZh ? '數位平台開發' : 'Digital platform development',
                isZh ? 'AI系統整合' : 'AI system integration',
                isZh ? '資料庫與後端架構' : 'Database and backend architecture',
                isZh ? '維運與技術支援' : 'Operations and technical support'
            ],
            icon: Code,
            priority: 'High'
        }
    ];

    const recruitmentPlan = [
        {
            phase: isZh ? '第一階段 (1-6月)' : 'Phase 1 (1-6 months)',
            focus: isZh ? '核心團隊組建' : 'Core team formation',
            positions: [
                'CEO/Founder (1)',
                'Product Head (1)',
                'Content Head (1)',
                'Marketing Head (1)',
                'Tech Head (1)',
                'Senior ESG Experts (3)',
                'Game Designers (2)',
                'Education Specialists (1)'
            ],
            headcount: 10
        },
        {
            phase: isZh ? '第二階段 (7-12月)' : 'Phase 2 (7-12 months)',
            focus: isZh ? '團隊擴張與專業化' : 'Team expansion and specialization',
            positions: [
                'Operations Head (1)',
                'Business Development Manager (2)',
                'Content Developers (4)',
                'Marketing Specialists (3)',
                'Developers (4)',
                'Customer Service (3)',
                'QA Testers (2)'
            ],
            headcount: 19
        },
        {
            phase: isZh ? '第三階段 (13-24月)' : 'Phase 3 (13-24 months)',
            focus: isZh ? '規模化運營' : 'Scaled operations',
            positions: [
                'Regional Managers (3)',
                'Enterprise Account Managers (5)',
                'Content Team Expansion (6)',
                'Marketing Team Expansion (4)',
                'DevOps & Support (8)',
                'Operations Expansion (4)'
            ],
            headcount: 30
        }
    ];

    const recruitmentChannels = [
        {
            channel: isZh ? 'LinkedIn招聘' : 'LinkedIn Recruitment',
            target: isZh ? '資深專業人才' : 'Senior professionals',
            effectiveness: 'High'
        },
        {
            channel: isZh ? '人脈推薦' : 'Personal Networks',
            target: isZh ? '關鍵職位與專家' : 'Key positions and experts',
            effectiveness: 'High'
        },
        {
            channel: isZh ? '大學校園招聘' : 'Campus Recruitment',
            target: isZh ? '年輕人才與實習生' : 'Young talent and interns',
            effectiveness: 'Medium'
        },
        {
            channel: isZh ? '業界會議與研討會' : 'Industry Conferences',
            target: isZh ? 'ESG與遊戲業專業人才' : 'ESG and gaming professionals',
            effectiveness: 'Medium'
        },
        {
            channel: isZh ? '獵頭公司合作' : 'Executive Search Firms',
            target: isZh ? '高階管理人才' : 'Senior executives',
            effectiveness: 'High'
        }
    ];

    const compensationStructure = [
        {
            level: isZh ? '初級 (Junior)' : 'Junior',
            salary: 'NT$ 35,000 - 50,000',
            benefits: [
                isZh ? '基本勞健保' : 'Basic insurance',
                isZh ? '年假 10 天' : '10 days annual leave',
                isZh ? '彈性工作時間' : 'Flexible hours'
            ]
        },
        {
            level: isZh ? '中級 (Mid-level)' : 'Mid-level',
            salary: 'NT$ 50,000 - 80,000',
            benefits: [
                isZh ? '完整福利包' : 'Full benefits package',
                isZh ? '年假 15 天' : '15 days annual leave',
                isZh ? '專業發展補助' : 'Professional development allowance',
                isZh ? '團隊活動經費' : 'Team building budget'
            ]
        },
        {
            level: isZh ? '高級 (Senior)' : 'Senior',
            salary: 'NT$ 80,000 - 150,000',
            benefits: [
                isZh ? '績效獎金' : 'Performance bonuses',
                isZh ? '股票選擇權' : 'Stock options',
                isZh ? '健康檢查' : 'Health check-ups',
                isZh ? '進修補助' : 'Education allowance',
                isZh ? '無限年假' : 'Unlimited annual leave'
            ]
        },
        {
            level: isZh ? '主管級 (Management)' : 'Management',
            salary: 'NT$ 120,000 - 250,000+',
            benefits: [
                isZh ? '高額績效獎金' : 'High performance bonuses',
                isZh ? '股票獎勵計劃' : 'Stock incentive program',
                isZh ? '商務旅行補助' : 'Business travel allowance',
                isZh ? '司機與專車服務' : 'Driver and car service',
                isZh ? '高階健康福利' : 'Premium health benefits'
            ]
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-emerald-500" />
                    <h2 className="zh-main text-2xl text-white">
                        {isZh ? '團隊建置與招聘規劃' : 'Team Building & Recruitment Planning'}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">
                        {isZh ? '3年擴張至50人團隊' : '3-year expansion to 50-person team'}
                    </span>
                </div>
            </div>

            {/* Team Size Overview */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">
                    {isZh ? '團隊規模規劃' : 'Team Size Planning'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-emerald-400 mb-2">10-15</div>
                        <div className="text-sm text-gray-300 mb-1">{isZh ? '第一年' : 'Year 1'}</div>
                        <div className="text-xs text-gray-400">{isZh ? '核心團隊建立' : 'Core team formation'}</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-2">20-30</div>
                        <div className="text-sm text-gray-300 mb-1">{isZh ? '第二年' : 'Year 2'}</div>
                        <div className="text-xs text-gray-400">{isZh ? '業務擴張' : 'Business expansion'}</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-2">40-50</div>
                        <div className="text-sm text-gray-300 mb-1">{isZh ? '第三年' : 'Year 3'}</div>
                        <div className="text-xs text-gray-400">{isZh ? '成熟運營' : 'Mature operations'}</div>
                    </div>
                </div>
            </div>

            {/* Core Team Structure */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">
                    {isZh ? '核心團隊架構' : 'Core Team Structure'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamStructure.map((member, i) => (
                        <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <member.icon className="w-6 h-6 text-emerald-400" />
                                <div>
                                    <div className="text-white font-semibold">{member.role}</div>
                                    <div className="text-xs text-gray-400">{member.count} 人</div>
                                </div>
                            </div>
                            <ul className="space-y-1">
                                {member.responsibilities.map((resp, j) => (
                                    <li key={j} className="text-xs text-gray-300 flex items-start gap-2">
                                        <div className="w-1 h-1 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                                        {resp}
                                    </li>
                                ))}
                            </ul>
                            <div className={`mt-3 text-xs px-2 py-1 rounded-full text-center ${
                                member.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                                'bg-yellow-500/20 text-yellow-300'
                            }`}>
                                {member.priority} Priority
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recruitment Phases */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">
                    {isZh ? '招聘階段計劃' : 'Recruitment Phase Planning'}
                </h3>
                <div className="space-y-4">
                    {recruitmentPlan.map((phase, i) => (
                        <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="text-white font-semibold">{phase.phase}</div>
                                    <div className="text-sm text-emerald-400">{phase.focus}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-400">{phase.headcount}</div>
                                    <div className="text-xs text-gray-400">{isZh ? '人' : 'people'}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {phase.positions.map((position, j) => (
                                    <div key={j} className="text-sm text-gray-300 bg-slate-700/50 px-2 py-1 rounded">
                                        {position}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recruitment Channels */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">
                    {isZh ? '招聘渠道策略' : 'Recruitment Channel Strategy'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recruitmentChannels.map((channel, i) => (
                        <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="text-white font-semibold mb-2">{channel.channel}</div>
                            <div className="text-sm text-gray-400 mb-3">{channel.target}</div>
                            <div className={`text-xs px-2 py-1 rounded-full text-center ${
                                channel.effectiveness === 'High' ? 'bg-green-500/20 text-green-300' :
                                'bg-yellow-500/20 text-yellow-300'
                            }`}>
                                {channel.effectiveness} Effectiveness
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Compensation Structure */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">
                    {isZh ? '薪酬福利結構' : 'Compensation & Benefits Structure'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {compensationStructure.map((level, i) => (
                        <div key={i} className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="text-white font-semibold mb-2">{level.level}</div>
                            <div className="text-emerald-400 font-bold text-lg mb-3">{level.salary}/月</div>
                            <div className="space-y-2">
                                {level.benefits.map((benefit, j) => (
                                    <div key={j} className="text-sm text-gray-300 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                                        {benefit}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Key Success Factors */}
            <div className="glass-bento p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6">
                    {isZh ? '團隊建置關鍵成功因素' : 'Team Building Key Success Factors'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Award className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">
                            {isZh ? '文化契合' : 'Cultural Fit'}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {isZh ? '選擇對永續理念有共鳴的人才' : 'Select talent aligned with sustainability vision'}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="w-8 h-8 text-blue-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">
                            {isZh ? '技能多樣性' : 'Skill Diversity'}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {isZh ? '平衡專業技能與跨領域整合能力' : 'Balance expertise with interdisciplinary integration'}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users className="w-8 h-8 text-purple-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">
                            {isZh ? '團隊協作' : 'Team Collaboration'}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {isZh ? '建立開放溝通與知識分享文化' : 'Establish open communication and knowledge sharing'}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-8 h-8 text-amber-400" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">
                            {isZh ? '持續發展' : 'Continuous Growth'}
                        </h4>
                        <p className="text-sm text-gray-400">
                            {isZh ? '提供學習機會與職業發展路徑' : 'Provide learning opportunities and career development'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};