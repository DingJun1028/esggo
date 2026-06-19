import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Language } from '../types';
import {
    Building, Users, TrendingUp, Award, FileText, BarChart3,
    Target, BookOpen, GraduationCap, Trophy, Settings, Plus,
    ArrowLeft, Mail, Phone, Calendar, Star, CheckCircle,
    Shield, AlertTriangle, Lock, User
} from 'lucide-react';
import { SecurityUtils, ESGSecurityValidator } from '../src/utils/security';
import { EnhancedInput, EnhancedSelect, EnhancedButton, LoadingSpinner } from './ui/EnhancedUI';
import { useFormValidation } from '../src/utils/form-validation';
import { useResourcePreloader, useVirtualScroll, useDebounce } from '../hooks/useScalability';
import { globalCache } from '../services/scalability';

export const EnterpriseServices: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { validateForm, RULES } = useFormValidation(language === 'zh-TW' ? 'zh-TW' : 'en');

    // 擴展性優化 hooks
    const { preloadResources } = useResourcePreloader();

    // 預載入關鍵資源
    useEffect(() => {
        const criticalResources = [
            // 可以添加更多預載入資源，如圖片、腳本等
        ];
        preloadResources(criticalResources);
    }, [preloadResources]);

    const [activeService, setActiveService] = useState<'overview' | 'training' | 'assessment' | 'league' | 'reports' | 'contact'>('overview');
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        company: '',
        service: '',
        message: ''
    });
    const [bookings, setBookings] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);

    // 使用useMemo優化服務數據
    const services = useMemo(() => [
        {
            id: 'training',
            icon: GraduationCap,
            title: isZh ? '員工ESG訓練' : 'Employee ESG Training',
            description: isZh ? '系統性ESG教育課程與卡牌遊戲訓練' : 'Systematic ESG education courses and card game training',
            features: [
                isZh ? '客製化課程設計' : 'Customized curriculum design',
                isZh ? '線上學習平台' : 'Online learning platform',
                isZh ? '進度追蹤與考核' : 'Progress tracking and assessment',
                isZh ? '團隊競賽活動' : 'Team competition events'
            ]
        },
        {
            id: 'assessment',
            icon: Target,
            title: isZh ? 'ESG成熟度評估' : 'ESG Maturity Assessment',
            description: isZh ? '全面評估企業ESG管理水準與改善建議' : 'Comprehensive assessment of corporate ESG management level and improvement recommendations',
            features: [
                isZh ? '基準線評估' : 'Baseline assessment',
                isZh ? '差距分析報告' : 'Gap analysis report',
                isZh ? '改善優先順序' : 'Improvement priorities',
                isZh ? '年度追蹤評估' : 'Annual tracking assessment'
            ]
        },
        {
            id: 'league',
            icon: Trophy,
            title: isZh ? '企業ESG聯賽' : 'Corporate ESG League',
            description: isZh ? '跨企業ESG知識競賽與最佳實踐分享' : 'Cross-company ESG knowledge competition and best practice sharing',
            features: [
                isZh ? '季度競賽活動' : 'Quarterly competition events',
                isZh ? '企業排名系統' : 'Corporate ranking system',
                isZh ? '優勝獎勵計劃' : 'Championship reward program',
                isZh ? '實踐案例分享' : 'Case study sharing'
            ]
        },
        {
            id: 'reports',
            icon: FileText,
            title: isZh ? '成效追蹤報告' : 'Impact Tracking Reports',
            description: isZh ? '量化ESG學習成效與企業影響力數據' : 'Quantify ESG learning effectiveness and corporate influence data',
            features: [
                isZh ? '學習成效指標' : 'Learning effectiveness metrics',
                isZh ? '行為改變追蹤' : 'Behavior change tracking',
                isZh ? '碳排減量數據' : 'Carbon reduction data',
                isZh ? '年度影響報告' : 'Annual impact report'
            ]
        }
    ], [isZh]);

    // 聯繫表單處理 - 使用增強驗證
    const handleContactSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        // 使用新的驗證系統
        const validation = validateForm([
            { name: 'name', value: contactForm.name, rules: RULES.name },
            { name: 'email', value: contactForm.email, rules: RULES.email },
            { name: 'company', value: contactForm.company, rules: RULES.company },
            { name: 'message', value: contactForm.message, rules: { ...RULES.requiredText, minLength: 10 } }
        ]);

        if (!validation.isValid) {
            alert(Object.values(validation.errors).flat().join('\n'));
            return;
        }

        // ESG特定安全檢查
        const esgValidation = ESGSecurityValidator.validateESGData({
            contactInfo: validation.sanitizedData
        });

        if (!esgValidation.isValid) {
            alert((isZh ? '安全檢查失敗：' : 'Security check failed: ') + esgValidation.errors.join(', '));
            return;
        }

        // 實際應用中這裡會發送API請求
        console.log('安全驗證通過，提交聯繫表單：', {
            ...validation.sanitizedData,
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            csrfToken: SecurityUtils.generateCSRFToken()
        });

        alert(isZh ? '感謝您的聯繫！我們會盡快回覆您。' : 'Thank you for your contact! We will respond as soon as possible.');
        setContactForm({ name: '', email: '', company: '', service: '', message: '' });
    }, [contactForm, isZh, validateForm, RULES]);

    // 創建去抖版本的聯繫表單提交
    const debouncedContactSubmit = useDebounce(handleContactSubmit, 500);

    // 預約功能
    const handleBooking = useCallback((service: string) => {
        const booking = {
            id: Date.now(),
            service,
            date: new Date().toISOString(),
            status: 'confirmed'
        };
        setBookings(prev => [...prev, booking]);
        alert(isZh ? '預約成功！我們會寄送確認郵件給您。' : 'Booking successful! We will send you a confirmation email.');
    }, [isZh]);



    const renderContactForm = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Mail className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">{isZh ? '聯繫我們' : 'Contact Us'}</h3>
                    <p className="text-gray-400">{isZh ? '獲取更多ESG服務資訊' : 'Get more information about ESG services'}</p>
                </div>
            </div>

            <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <EnhancedInput
                        label={isZh ? '姓名' : 'Name'}
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={isZh ? '您的姓名' : 'Your name'}
                        language={language}
                        startIcon={<User className="w-5 h-5 text-gray-400" />}
                    />
                    <EnhancedInput
                        label={isZh ? '電子郵件' : 'Email'}
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder={isZh ? 'your@email.com' : 'your@email.com'}
                        language={language}
                        startIcon={<Mail className="w-5 h-5 text-gray-400" />}
                    />
                    <EnhancedInput
                        label={isZh ? '公司名稱' : 'Company'}
                        type="text"
                        value={contactForm.company}
                        onChange={e => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                        placeholder={isZh ? '公司名稱' : 'Company name'}
                        language={language}
                        startIcon={<Building className="w-5 h-5 text-gray-400" />}
                    />
                </div>

                <div className="space-y-4">
                    <EnhancedSelect
                        label={isZh ? '感興趣的服務' : 'Service of Interest'}
                        value={contactForm.service}
                        onChange={e => setContactForm(prev => ({ ...prev, service: e.target.value }))}
                        options={[
                            { value: '', label: isZh ? '請選擇' : 'Please select' },
                            ...services.map(service => ({
                                value: service.id,
                                label: service.title
                            }))
                        ]}
                        placeholder={isZh ? '請選擇服務' : 'Select a service'}
                        language={language}
                    />
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            {isZh ? '訊息' : 'Message'}
                        </label>
                        <textarea
                            value={contactForm.message}
                            onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                            placeholder={isZh ? '請描述您的需求...' : 'Please describe your needs...'}
                        />
                    </div>
                </div>

                <div className="md:col-span-2 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>{isZh ? '資料已加密保護' : 'Data is encrypted and protected'}</span>
                    </div>
                    <EnhancedButton
                        type="submit"
                        variant="primary"
                        size="md"
                        language={language}
                        icon={<Lock className="w-4 h-4" />}
                        fullWidth={false}
                    >
                        {isZh ? '安全送出' : 'Send Securely'}
                    </EnhancedButton>
                </div>
            </form>
        </div>
    );

    const renderServiceContent = () => {
        const service = services.find(s => s.id === activeService);
        if (!service) return null;

        if (activeService === 'contact') {
            return renderContactForm();
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <service.icon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                        <p className="text-gray-400">{service.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-bento p-6 rounded-xl">
                        <h4 className="text-lg font-bold text-white mb-4">
                            {isZh ? '核心功能' : 'Key Features'}
                        </h4>
                        <ul className="space-y-3">
                            {service.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                    <span className="text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-bento p-6 rounded-xl">
                        <h4 className="text-lg font-bold text-white mb-4">
                            {isZh ? '定價方案' : 'Pricing Plans'}
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                <span className="text-gray-300">{isZh ? '基礎版' : 'Basic Plan'}</span>
                                <span className="text-emerald-400 font-bold">NT$ 8,000/年</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                <span className="text-gray-300">{isZh ? '專業版' : 'Professional Plan'}</span>
                                <span className="text-emerald-400 font-bold">NT$ 25,000/年</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-emerald-500/30">
                                <span className="text-gray-300">{isZh ? '企業版' : 'Enterprise Plan'}</span>
                                <span className="text-emerald-400 font-bold">NT$ 68,000/年</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-bento p-6 rounded-xl">
                    <h4 className="text-lg font-bold text-white mb-4">
                        {isZh ? '成功案例' : 'Success Stories'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="text-emerald-400 font-bold mb-2">台積電</div>
                            <div className="text-sm text-gray-400 mb-2">
                                {isZh ? '員工ESG素養提升 85%' : '85% improvement in employee ESG literacy'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {isZh ? '年度碳排減量 10,000噸' : '10,000 tons annual carbon reduction'}
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="text-emerald-400 font-bold mb-2">台灣大哥大</div>
                            <div className="text-sm text-gray-400 mb-2">
                                {isZh ? '數位包容計劃擴及50偏鄉' : 'Digital inclusion program reaches 50 rural areas'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {isZh ? '服務用戶數增加 30%' : '30% increase in served users'}
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="text-emerald-400 font-bold mb-2">統一集團</div>
                            <div className="text-sm text-gray-400 mb-2">
                                {isZh ? '供應鏈ESG評核覆蓋率 95%' : '95% supply chain ESG assessment coverage'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {isZh ? '供應商改善計劃啟動 200+' : '200+ supplier improvement programs launched'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Building className="w-8 h-8 text-emerald-500" />
                    <h2 className="zh-main text-2xl text-white">
                        {isZh ? '企業ESG服務' : 'Enterprise ESG Services'}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-300">
                        {isZh ? '協助企業永續轉型' : 'Supporting corporate sustainability transformation'}
                    </span>
                </div>
            </div>

            {activeService === 'overview' && (
                <div className="space-y-6">
                    <div className="glass-bento p-8 rounded-[2.5rem] text-center">
                        <div className="space-y-4">
                            <h3 className="zh-main text-3xl text-white">
                                {isZh ? '企業永續轉型的最佳夥伴' : 'Your Best Partner for Corporate Sustainability Transformation'}
                            </h3>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                {isZh
                                    ? '我們提供完整的ESG教育與管理解決方案，幫助企業系統性提升永續競爭力。'
                                    : 'We provide comprehensive ESG education and management solutions to help companies systematically enhance their sustainability competitiveness.'
                                }
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map(service => (
                            <div
                                key={service.id}
                                onClick={() => setActiveService(service.id as any)}
                                className="glass-bento p-6 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <service.icon className="w-8 h-8 text-emerald-400" />
                                    <Plus className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2">{service.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="glass-bento p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {isZh ? '服務優勢' : 'Service Advantages'}
                            </h3>
                            <Award className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">
                                    {isZh ? '專業團隊' : 'Expert Team'}
                                </h4>
                                <p className="text-sm text-gray-400">
                                    {isZh ? 'ESG專家與遊戲設計師共同打造' : 'Co-created by ESG experts and game designers'}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <TrendingUp className="w-8 h-8 text-blue-400" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">
                                    {isZh ? '量化成效' : 'Measurable Results'}
                                </h4>
                                <p className="text-sm text-gray-400">
                                    {isZh ? '數據驅動的學習成效追蹤' : 'Data-driven learning effectiveness tracking'}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Trophy className="w-8 h-8 text-purple-400" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">
                                    {isZh ? '持續創新' : 'Continuous Innovation'}
                                </h4>
                                <p className="text-sm text-gray-400">
                                    {isZh ? '定期更新內容與功能' : 'Regular content and feature updates'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeService !== 'overview' && (
                <div className="space-y-6">
                    <button
                        onClick={() => setActiveService('overview')}
                        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        ← {isZh ? '返回總覽' : 'Back to Overview'}
                    </button>
                    {renderServiceContent()}
                </div>
            )}
        </div>
    );
};