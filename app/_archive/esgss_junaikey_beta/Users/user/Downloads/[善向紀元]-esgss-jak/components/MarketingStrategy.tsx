import React, { useState } from 'react';
import { Language } from '../types';
import {
    Target, TrendingUp, Users, Globe, Award, Zap,
    BarChart3, Megaphone, Heart, Star, Calendar, DollarSign
} from 'lucide-react';

export const MarketingStrategy: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';

    const [activeTab, setActiveTab] = useState<'brand' | 'digital' | 'realworld' | 'pr' | 'metrics'>('brand');

    const brandStrategy = {
        positioning: {
            name: isZh ? 'ESG 善向紀元：萬能卡牌' : 'ESG Good Era: Omnipotent Cards',
            english: 'ESG Good Era: Omnipotent Cards',
            slogan: isZh ? '玩卡牌，學永續，做公益，創未來' : 'Play cards, learn sustainability, do good, create future',
            tagline: isZh ? '讓永續成為一種樂趣' : 'Making sustainability fun'
        },
        personality: [
            { trait: isZh ? '正面' : 'Positive', desc: isZh ? '希望、改變、未來' : 'Hope, change, future', color: 'emerald' },
            { trait: isZh ? '專業' : 'Professional', desc: isZh ? '真實、科學、可靠' : 'Authentic, scientific, reliable', color: 'blue' },
            { trait: isZh ? '親和' : 'Approachable', desc: isZh ? '有趣、互動、包容' : 'Fun, interactive, inclusive', color: 'purple' },
            { trait: isZh ? '領導' : 'Leadership', desc: isZh ? '創新、影響、典範' : 'Innovative, influential, exemplary', color: 'amber' }
        ],
        visualIdentity: {
            primary: '#00A86B',
            secondary: '#0077BB',
            accent: '#FFC107',
            font: isZh ? '圓角無障礙字體' : 'Rounded accessible font'
        }
    };

    const digitalMarketing = [
        {
            channel: isZh ? '內容行銷' : 'Content Marketing',
            tactics: [
                isZh ? '部落格：ESG知識/案例解析' : 'Blog: ESG knowledge/case analysis',
                isZh ? 'YouTube：遊戲教學/真實案例' : 'YouTube: Game tutorials/real cases',
                isZh ? 'Podcast：ESG人物訪談' : 'Podcast: ESG personality interviews',
                isZh ? '電子報：每週永續新知' : 'Newsletter: Weekly sustainability insights',
                isZh ? '社群：FB/IG/LINE/Threads' : 'Social: FB/IG/LINE/Threads'
            ],
            icon: BarChart3
        },
        {
            channel: isZh ? 'SEO/SEM' : 'SEO/SEM',
            tactics: [
                isZh ? '關鍵字：ESG培訓/永續遊戲/環境教育' : 'Keywords: ESG training/sustainability games/environmental education',
                isZh ? 'Google Ads：精準投放' : 'Google Ads: Precision targeting',
                isZh ? 'Facebook Ads：企業/教育受眾' : 'Facebook Ads: Corporate/education audiences',
                isZh ? 'LinkedIn：國際專業形象' : 'LinkedIn: International professional image'
            ],
            icon: TrendingUp
        },
        {
            channel: isZh ? '網紅/KOL合作' : 'Influencer/KOL Collaboration',
            tactics: [
                isZh ? 'ESG專家：5位' : 'ESG Experts: 5',
                isZh ? '教育網紅：5位' : 'Education Influencers: 5',
                isZh ? '遊戲開箱：3位' : 'Game Reviewers: 3',
                isZh ? '企業高層：3位 (背書)' : 'Corporate Executives: 3 (endorsements)',
                isZh ? '政府官員：2位' : 'Government Officials: 2'
            ],
            icon: Users
        }
    ];

    const realWorldMarketing = [
        {
            category: isZh ? '展會活動' : 'Trade Shows & Events',
            activities: [
                isZh ? '台灣永續獎頒獎典禮' : 'Taiwan Sustainability Awards',
                isZh ? 'ESG展' : 'ESG Expos',
                isZh ? '教育展' : 'Education Expos',
                isZh ? '書展' : 'Book Fairs',
                isZh ? '企業內部展' : 'Corporate Internal Events'
            ],
            icon: Award
        },
        {
            category: isZh ? '講座/工作坊' : 'Seminars & Workshops',
            activities: [
                isZh ? '企業內部培訓 (100場/年)' : 'Corporate Training (100 sessions/year)',
                isZh ? '學校教師研習 (50場/年)' : 'Teacher Training (50 sessions/year)',
                isZh ? '社區推廣 (30場/年)' : 'Community Outreach (30 sessions/year)',
                isZh ? '政府活動 (20場/年)' : 'Government Events (20 sessions/year)',
                isZh ? '展會體驗區 (全年)' : 'Expo Experience Zones (year-round)'
            ],
            icon: Users
        },
        {
            category: isZh ? '合作推廣' : 'Collaborative Promotions',
            activities: [
                isZh ? '企業CSR活動' : 'Corporate CSR Activities',
                isZh ? '學校校慶' : 'School Celebrations',
                isZh ? '社區環保日' : 'Community Environmental Days',
                isZh ? '圖書館閱讀推廣' : 'Library Reading Programs',
                isZh ? '政府環保活動' : 'Government Environmental Campaigns'
            ],
            icon: Heart
        }
    ];

    const prStrategy = [
        {
            area: isZh ? '政府關係' : 'Government Relations',
            initiatives: [
                isZh ? '環保署：納入推廣工具' : 'EPA: Include in promotion toolkit',
                isZh ? '教育部：教材認證' : 'MOE: Curriculum certification',
                isZh ? '經濟部：企業輔導資源' : 'MOEA: Business guidance resources',
                isZh ? '文化部：教育遊戲推廣' : 'MOC: Educational game promotion'
            ]
        },
        {
            area: isZh ? '產業協會' : 'Industry Associations',
            initiatives: [
                isZh ? '台灣永續能源研究基金會' : 'Taiwan Sustainable Energy Research Foundation',
                isZh ? '中華民國企業永續發展協會' : 'Chinese Society of Corporate Sustainability',
                isZh ? '台灣綠色產品協會' : 'Taiwan Green Product Association',
                isZh ? '各產業公會' : 'Various industry associations'
            ]
        },
        {
            area: isZh ? '國際認證' : 'International Certifications',
            initiatives: [
                isZh ? 'B Corp認證' : 'B Corp Certification',
                isZh ? 'ISO 26000' : 'ISO 26000',
                isZh ? 'SDGs最佳實踐' : 'SDGs Best Practices',
                isZh ? '國際遊戲設計獎' : 'International Game Design Awards'
            ]
        }
    ];

    const kpiMetrics = [
        {
            category: isZh ? '產品層面' : 'Product Level',
            metrics: [
                { metric: isZh ? '卡牌品質' : 'Card Quality', target: isZh ? '用戶滿意度 > 85%' : 'User satisfaction > 85%' },
                { metric: isZh ? '遊戲平衡' : 'Game Balance', target: isZh ? '勝率 45-55%' : 'Win rate 45-55%' },
                { metric: isZh ? '學習成效' : 'Learning Effectiveness', target: isZh ? '知識測驗平均 78分' : 'Average knowledge test 78/100' }
            ]
        },
        {
            category: isZh ? '市場層面' : 'Market Level',
            metrics: [
                { metric: isZh ? '銷售目標' : 'Sales Target', target: isZh ? '第1年500套，第3年8000套' : 'Year 1: 500 sets, Year 3: 8000 sets' },
                { metric: isZh ? '企業用戶' : 'Enterprise Users', target: isZh ? '第1年50家，第3年500家' : 'Year 1: 50 companies, Year 3: 500 companies' },
                { metric: isZh ? '市佔率' : 'Market Share', target: isZh ? '台灣ESG培訓工具30%' : '30% of Taiwan ESG training market' }
            ]
        },
        {
            category: isZh ? '社會影響' : 'Social Impact',
            metrics: [
                { metric: isZh ? '受益人數' : 'Beneficiaries', target: isZh ? '第1年5,000人，第3年100,000人' : 'Year 1: 5,000, Year 3: 100,000 people' },
                { metric: isZh ? '知識提升' : 'Knowledge Increase', target: isZh ? '平均提升60%' : 'Average 60% increase' },
                { metric: isZh ? '行為改變' : 'Behavior Change', target: isZh ? '70%持續行動' : '70% sustained action' }
            ]
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Megaphone className="w-8 h-8 text-emerald-500" />
                    <h2 className="zh-main text-2xl text-white">
                        {isZh ? '行銷與推廣策略' : 'Marketing & Promotion Strategy'}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">
                        {isZh ? '3年營收目標 NT$8,638萬' : '3-year revenue target: NT$86.38M'}
                    </span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { key: 'brand', label: isZh ? '品牌定位' : 'Brand Positioning', icon: Star },
                    { key: 'digital', label: isZh ? '數位行銷' : 'Digital Marketing', icon: Zap },
                    { key: 'realworld', label: isZh ? '實體行銷' : 'Real-world Marketing', icon: Users },
                    { key: 'pr', label: isZh ? '公關影響力' : 'PR & Influence', icon: Award },
                    { key: 'metrics', label: isZh ? '成功指標' : 'Success Metrics', icon: BarChart3 }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === tab.key
                                ? 'bg-emerald-500 text-white shadow-lg'
                                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Brand Positioning Tab */}
            {activeTab === 'brand' && (
                <div className="space-y-6">
                    <div className="glass-bento p-8 rounded-[2.5rem]">
                        <div className="text-center space-y-4 mb-8">
                            <h3 className="zh-main text-3xl text-white">{brandStrategy.positioning.name}</h3>
                            <p className="text-xl text-emerald-400 font-bold">{brandStrategy.positioning.slogan}</p>
                            <p className="text-gray-400">{brandStrategy.positioning.tagline}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xl font-bold text-white mb-4">
                                    {isZh ? '品牌個性' : 'Brand Personality'}
                                </h4>
                                <div className="space-y-3">
                                    {brandStrategy.personality.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                                            <div className={`w-4 h-4 rounded-full bg-${item.color}-500`}></div>
                                            <div>
                                                <div className="text-white font-semibold">{item.trait}</div>
                                                <div className="text-sm text-gray-400">{item.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xl font-bold text-white mb-4">
                                    {isZh ? '視覺識別' : 'Visual Identity'}
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: brandStrategy.visualIdentity.primary }}></div>
                                        <span className="text-gray-300">{isZh ? '主色：永續綠' : 'Primary: Sustainability Green'} (#00A86B)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: brandStrategy.visualIdentity.secondary }}></div>
                                        <span className="text-gray-300">{isZh ? '輔色：希望藍' : 'Secondary: Hope Blue'} (#0077BB)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: brandStrategy.visualIdentity.accent }}></div>
                                        <span className="text-gray-300">{isZh ? '點綴：陽光黃' : 'Accent: Sunshine Yellow'} (#FFC107)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">Aa</div>
                                        <span className="text-gray-300">{brandStrategy.visualIdentity.font}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Digital Marketing Tab */}
            {activeTab === 'digital' && (
                <div className="space-y-6">
                    {digitalMarketing.map((channel, i) => (
                        <div key={i} className="glass-bento p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <channel.icon className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-xl font-bold text-white">{channel.channel}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {channel.tactics.map((tactic, j) => (
                                    <div key={j} className="bg-slate-800/50 p-3 rounded-lg">
                                        <div className="text-sm text-gray-300">{tactic}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="glass-bento p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {isZh ? '線上活動' : 'Online Events'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold mb-2">{isZh ? '每週直播' : 'Weekly Live Streams'}</div>
                                <div className="text-sm text-gray-300">{isZh ? '遊戲教學 + 案例分享' : 'Game tutorials + case studies'}</div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold mb-2">{isZh ? '每月挑戰賽' : 'Monthly Challenges'}</div>
                                <div className="text-sm text-gray-300">{isZh ? '線上PK競賽' : 'Online PvP competitions'}</div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold mb-2">{isZh ? '每季研討會' : 'Quarterly Seminars'}</div>
                                <div className="text-sm text-gray-300">{isZh ? 'ESG趨勢分享' : 'ESG trend discussions'}</div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold mb-2">{isZh ? '年度大會' : 'Annual Summit'}</div>
                                <div className="text-sm text-gray-300">{isZh ? '總決賽 + 頒獎典禮' : 'Grand finals + awards ceremony'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Real-world Marketing Tab */}
            {activeTab === 'realworld' && (
                <div className="space-y-6">
                    {realWorldMarketing.map((category, i) => (
                        <div key={i} className="glass-bento p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <category.icon className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-xl font-bold text-white">{category.category}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {category.activities.map((activity, j) => (
                                    <div key={j} className="bg-slate-800/50 p-3 rounded-lg">
                                        <div className="text-sm text-gray-300">{activity}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="glass-bento p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {isZh ? '媒體曝光策略' : 'Media Exposure Strategy'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400 mb-1">50</div>
                                <div className="text-sm text-gray-400">{isZh ? '篇新聞稿/年' : 'Press releases/year'}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400 mb-1">20</div>
                                <div className="text-sm text-gray-400">{isZh ? '次專題報導/年' : 'Feature articles/year'}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400 mb-1">10</div>
                                <div className="text-sm text-gray-400">{isZh ? '次電視/廣播' : 'TV/radio appearances'}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400 mb-1">12</div>
                                <div className="text-sm text-gray-400">{isZh ? '次雜誌專訪' : 'Magazine interviews'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PR & Influence Tab */}
            {activeTab === 'pr' && (
                <div className="space-y-6">
                    {prStrategy.map((area, i) => (
                        <div key={i} className="glass-bento p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-4">{area.area}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {area.initiatives.map((initiative, j) => (
                                    <div key={j} className="bg-slate-800/50 p-3 rounded-lg">
                                        <div className="text-sm text-gray-300">{initiative}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="glass-bento p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {isZh ? '學術合作' : 'Academic Partnerships'}
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold mb-2">{isZh ? '台大/政大/成大研究計畫' : 'NTU/NCCU/NCU Research Programs'}</div>
                                <div className="text-sm text-gray-300">{isZh ? 'ESG教育成效研究' : 'ESG education effectiveness research'}</div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold mb-2">{isZh ? '教學合作：永續學程' : 'Curriculum Integration: Sustainability Programs'}</div>
                                <div className="text-sm text-gray-300">{isZh ? '大學課程納入遊戲元素' : 'Incorporate game elements into university courses'}</div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold mb-2">{isZh ? '實習計畫：學生參與' : 'Internship Program: Student Involvement'}</div>
                                <div className="text-sm text-gray-300">{isZh ? 'ESG專案實習機會' : 'ESG project internship opportunities'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Metrics Tab */}
            {activeTab === 'metrics' && (
                <div className="space-y-6">
                    {kpiMetrics.map((category, i) => (
                        <div key={i} className="glass-bento p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-4">{category.category}</h3>
                            <div className="space-y-3">
                                {category.metrics.map((metric, j) => (
                                    <div key={j} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                        <span className="text-gray-300">{metric.metric}</span>
                                        <span className="text-emerald-400 font-bold">{metric.target}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="glass-bento p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {isZh ? '財務指標' : 'Financial Metrics'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400 mb-1">NT$474萬</div>
                                <div className="text-sm text-gray-400">{isZh ? '第1年營收' : 'Year 1 Revenue'}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400 mb-1">NT$2,171萬</div>
                                <div className="text-sm text-gray-400">{isZh ? '第2年營收' : 'Year 2 Revenue'}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400 mb-1">NT$5,993萬</div>
                                <div className="text-sm text-gray-400">{isZh ? '第3年營收' : 'Year 3 Revenue'}</div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold mb-2">{isZh ? '獲利率' : 'Profit Margin'}</div>
                                <div className="text-xl font-black text-white mb-1">58%</div>
                                <div className="text-sm text-gray-400">{isZh ? '第3年目標' : 'Year 3 Target'}</div>
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="text-emerald-400 font-bold mb-2">ROI</div>
                                <div className="text-xl font-black text-white mb-1">249%</div>
                                <div className="text-sm text-gray-400">{isZh ? '第3年報酬率' : 'Year 3 Return'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};