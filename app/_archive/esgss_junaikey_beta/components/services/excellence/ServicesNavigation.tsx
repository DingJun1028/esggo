// ESGss JunAiKey - Excellence Services Navigation
// 服務導航組件

import React from 'react';
import { GlassButton, glassTheme } from '../../ui/GlassComponents';

interface ServicesNavigationProps {
  theme: 'light' | 'dark';
  currentService: string;
  onServiceChange: (service: string) => void;
}

export const ServicesNavigation: React.FC<ServicesNavigationProps> = ({
  theme,
  currentService,
  onServiceChange,
}) => {
  const colors = glassTheme[theme];

  const excellenceServices = [
    { id: 'corporate-health-check', name: '企業健康檢查', status: 'completed' },
    { id: 'carbon-inventory', name: '碳盤存管理', status: 'completed' },
    { id: 'impact-restoration', name: '影響修復實驗室', status: 'pending' },
    { id: 'sustainability-transformation', name: '永續轉型顧問', status: 'pending' },
    { id: 'green-financing', name: '綠色融資助手', status: 'pending' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'in-progress':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <div
      style={{
        padding: '24px',
        background: `rgba(255, 255, 255, ${theme === 'light' ? '0.05' : '0.02'})`,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
      }}
    >
      <h3
        style={{
          margin: '0 0 16px 0',
          color: colors.text,
          fontSize: '18px',
          fontWeight: '600',
        }}
      >
        卓越永續服務
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        {excellenceServices.map(service => (
          <GlassButton
            key={service.id}
            theme={theme}
            variant={currentService === service.id ? 'primary' : 'ghost'}
            onClick={() => onServiceChange(service.id)}
            style={{
              padding: '12px 16px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{service.name}</span>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: getStatusColor(service.status),
              }}
            />
          </GlassButton>
        ))}
      </div>
    </div>
  );
};

export default ServicesNavigation;
