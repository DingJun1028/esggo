/**
 * 🌐 服務生態系統串聯元件
 * Service Ecosystem Integration Widget
 */

import React from 'react';
import { View } from '@/types/core';
import {
  getServiceNode,
  getRelatedServices,
  getQuickActions,
  getNavigationPath,
  getRecommendedServices,
  serviceEcosystem,
  ServiceNode,
} from '@/config/service-ecosystem.config';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Link2,
  Zap,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

// 關係圖示映射
const relationshipIcons: Record<string, React.ReactNode> = {
  prerequisite: <BookOpen className="w-3 h-3" />,
  complementary: <Zap className="w-3 h-3" />,
  derived: <ArrowRight className="w-3 h-3" />,
  extends: <Link2 className="w-3 h-3" />,
  related: <Target className="w-3 h-3" />,
  downstream: <TrendingUp className="w-3 h-3" />,
  upstream: <Users className="w-3 h-3" />,
};

// 關係標籤映射
const relationshipLabels: Record<string, string> = {
  prerequisite: '前置學習',
  complementary: '建議搭配',
  derived: '衍生服務',
  extends: '功能擴展',
  related: '相關服務',
  downstream: '下游應用',
  upstream: '上游依賴',
};

interface RelatedServiceCardProps {
  service: ServiceNode;
  relationship: string;
  strength: number;
  onNavigate: (viewId: View) => void;
}

function RelatedServiceCard({
  service,
  relationship,
  strength,
  onNavigate,
}: RelatedServiceCardProps) {
  const intensity = strength >= 3 ? 'high' : strength >= 2 ? 'medium' : 'low';

  return (
    <button
      onClick={() => onNavigate(service.id)}
      className={`
        flex items-center gap-3 p-3 rounded-lg text-left transition-all
        hover:scale-[1.02] hover:shadow-md
        bg-gradient-to-r from-background to-muted/50
        border border-border/50
        ${intensity === 'high' ? 'ring-2 ring-primary/30' : ''}
      `}
    >
      <div className={`
        p-2 rounded-full
        ${intensity === 'high' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
      `}>
        <service.icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{service.name}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {relationshipIcons[relationship]}
            {relationshipLabels[relationship]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {service.description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

interface QuickAction {
  label: string;
  targetView: View;
  icon: React.ComponentType<{ className?: string }>;
}

interface QuickActionButtonProps {
  action: QuickAction;
  onNavigate: (viewId: View) => void;
}

function QuickActionButton({ action, onNavigate }: QuickActionButtonProps) {
  const Icon = action.icon;
  return (
    <button
      onClick={() => onNavigate(action.targetView)}
      className="flex flex-col items-center gap-2 p-4 rounded-xl
        bg-primary/5 hover:bg-primary/10
        border border-primary/20 hover:border-primary/40
        transition-all group"
    >
      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <span className="text-sm font-medium text-primary">{action.label}</span>
    </button>
  );
}

interface ServiceEcosystemWidgetProps {
  currentView: View;
  variant?: 'related' | 'actions' | 'path' | 'full';
  maxItems?: number;
}

export function ServiceEcosystemWidget({
  currentView,
  variant = 'full',
  maxItems = 4,
}: ServiceEcosystemWidgetProps) {
  const navigate = useNavigate();
  const currentService = getServiceNode(currentView);
  const relatedServices = getRelatedServices(currentView);
  const quickActions = getQuickActions(currentView);
  const navigationPath = getNavigationPath(currentView);
  const recommended = getRecommendedServices(currentView);

  if (!currentService) {
    return null;
  }

  const handleNavigate = (viewId: View) => {
    const paths: Partial<Record<View, string>> = {
      [View.PERSONAL_HUB]: '/personal-hub',
      [View.REPORT_GEN_V2]: '/esg-reporting',
      [View.MARKET_INTELLIGENCE]: '/market-intel',
      [View.SUSTAINABLE_VILLAGE]: '/sustainable-village',
      [View.ACADEMY]: '/goodward-academy',
      [View.DIGITAL_TWIN]: '/digital-twin',
      [View.PERSONAL_STORAGE]: '/personal-storage',
      [View.MY_NORTH_STAR]: '/north-star',
      [View.OMNI_HARMONY]: '/omni-circle',
    };
    navigate(paths[viewId] || '/');
  };

  // 只顯示相關服務
  if (variant === 'related') {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            相關服務推薦
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {relatedServices.slice(0, maxItems).map((service) => {
            const relation = currentService.relatedServices.find(r => r.serviceId === service.id);
            return (
              <RelatedServiceCard
                key={service.id}
                service={service}
                relationship={relation?.relationship || 'related'}
                strength={relation?.strength || 1}
                onNavigate={handleNavigate}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  }

  // 只顯示快速操作
  if (variant === 'actions') {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5" />
            快速操作
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className={`grid grid-cols-${Math.min(quickActions.length, 3)}-gap-3`}>
            {quickActions.slice(0, maxItems).map((action, index) => (
              <QuickActionButton
                key={index}
                action={action}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 顯示導航路徑
  if (variant === 'path' && navigationPath) {
    return (
      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            探索路徑
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* 當前服務 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-medium">{currentService.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                預估 {navigationPath.estimatedTime}
              </span>
            </div>

            {/* 下一步 */}
            {navigationPath.next.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
                <span>下一步推薦：</span>
              </div>
            )}

            {navigationPath.next.slice(0, maxItems).map((service) => (
              <button
                key={service.id}
                onClick={() => handleNavigate(service.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg
                  bg-muted/50 hover:bg-muted transition-colors"
              >
                <service.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">{service.name}</span>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 完整模式
  return (
    <div className="space-y-6">
      {/* 快速操作 */}
      {quickActions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            快速操作
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.slice(0, maxItems).map((action, index) => (
              <QuickActionButton
                key={index}
                action={action}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>
      )}

      {/* 相關服務 */}
      {relatedServices.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            相關服務推薦
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedServices.slice(0, maxItems * 2).map((service) => {
              const relation = currentService.relatedServices.find(r => r.serviceId === service.id);
              return (
                <RelatedServiceCard
                  key={service.id}
                  service={service}
                  relationship={relation?.relationship || 'related'}
                  strength={relation?.strength || 1}
                  onNavigate={handleNavigate}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 探索路徑 */}
      {navigationPath && navigationPath.recommended && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            推薦探索
          </h3>
          <button
            onClick={() => handleNavigate(navigationPath.recommended.id)}
            className="w-full flex items-center gap-4 p-4 rounded-xl
              bg-gradient-to-r from-primary/10 via-primary/5 to-transparent
              border border-primary/20 hover:border-primary/40
              transition-all group"
          >
            <div className="p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <navigationPath.recommended.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">
                {navigationPath.recommended.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {navigationPath.recommended.description}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 ml-auto text-primary group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}

// 服務地圖總覽元件
export function ServiceEcosystemMap() {
  const navigate = useNavigate();

  const handleNavigate = (viewId: View) => {
    const paths: Partial<Record<View, string>> = {
      [View.PERSONAL_HUB]: '/personal-hub',
      [View.REPORT_GEN_V2]: '/esg-reporting',
      [View.MARKET_INTELLIGENCE]: '/market-intel',
      [View.SUSTAINABLE_VILLAGE]: '/sustainable-village',
      [View.ACADEMY]: '/goodward-academy',
      [View.DIGITAL_TWIN]: '/digital-twin',
      [View.PERSONAL_STORAGE]: '/personal-storage',
      [View.MY_NORTH_STAR]: '/north-star',
      [View.OMNI_HARMONY]: '/omni-circle',
    };
    navigate(paths[viewId] || '/');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-primary" />
        永續智慧服務生態系統
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceEcosystem.map((service) => (
          <button
            key={service.id}
            onClick={() => handleNavigate(service.id)}
            className={`
              flex flex-col gap-3 p-5 rounded-xl text-left
              bg-gradient-to-br from-background to-muted/30
              border border-border/50 hover:border-primary/30
              transition-all hover:shadow-lg hover:scale-[1.02]
              ${service.depth >= 4 ? 'ring-2 ring-primary/10' : ''}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                p-3 rounded-xl
                ${service.scope === 'core' ? 'bg-primary/10' : ''}
                ${service.scope === 'advanced' ? 'bg-amber-500/10' : ''}
                ${service.scope === 'expert' ? 'bg-purple-500/10' : ''}
              `}>
                <service.icon className={`
                  w-6 h-6
                  ${service.scope === 'core' ? 'text-primary' : ''}
                  ${service.scope === 'advanced' ? 'text-amber-500' : ''}
                  ${service.scope === 'expert' ? 'text-purple-500' : ''}
                `} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{service.name}</h3>
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${service.scope === 'core' ? 'bg-primary/10 text-primary' : ''}
                  ${service.scope === 'advanced' ? 'bg-amber-500/10 text-amber-600' : ''}
                  ${service.scope === 'expert' ? 'bg-purple-500/10 text-purple-600' : ''}
                `}>
                  {service.scope === 'core' ? '核心服務' : service.scope === 'advanced' ? '進階服務' : '專家服務'}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-1 mt-auto">
              {service.keywords.slice(0, 3).map((keyword) => (
                <span key={keyword} className="text-xs px-2 py-0.5 rounded bg-muted">
                  {keyword}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/50">
              <span>深度 {service.depth}/5</span>
              <span>•</span>
              <span>{service.relatedServices.length} 個關聯</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ServiceEcosystemWidget;
