import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from './ui';
import { Language } from '@/types';

interface EnterpriseServicesProps {
  language?: Language;
}

export const EnterpriseServices: React.FC<EnterpriseServicesProps> = ({ language = 'zh-TW' }) => {
  const [activeService, setActiveService] = useState<string | null>(null);

  const t = {
    'zh-TW': {
      title: '企業ESG服務',
      subtitle: '協助企業永續轉型',
      services: [
        { id: 'training', title: '員工ESG訓練', desc: '全面的ESG培訓課程' },
        { id: 'assessment', title: 'ESG成熟度評估', desc: '評估企業ESG現狀' },
        { id: 'league', title: '企業ESG聯賽', desc: '參與ESG競賽提升排名' },
        { id: 'tracking', title: '成效追蹤報告', desc: '實時追蹤ESG成效' },
      ],
    },
    'en-US': {
      title: 'Enterprise ESG Services',
      subtitle: 'Assisting Corporate Sustainability Transformation',
      services: [
        {
          id: 'training',
          title: 'Employee ESG Training',
          desc: 'Comprehensive ESG training courses',
        },
        { id: 'assessment', title: 'ESG Maturity Assessment', desc: 'Assess current ESG status' },
        { id: 'league', title: 'Enterprise ESG League', desc: 'Join league to improve ranking' },
        { id: 'tracking', title: 'Performance Tracking', desc: 'Real-time performance reports' },
      ],
    },
  };

  const content = language === 'zh-TW' ? t['zh-TW'] : t['en-US']; // Simple fallback

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{content.title}</h1>
          <p className="text-slate-400">{content.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {content.services.map(service => (
          <Card
            key={service.id}
            className="hover:border-cyan-500/50 transition-colors cursor-pointer bg-slate-900/50 backdrop-blur-sm border-cyan-500/20"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-bold text-white">{service.title}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
                onClick={() => setActiveService(service.id)}
              >
                View
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">{service.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
