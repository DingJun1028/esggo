/**
 * 情報卡片組件
 * Intelligence Card Component
 * 
 * @version 1.0.0
 * @date 2026-02-11
 */

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { 
  IntelligenceCardProps, 
  IntelligenceItem, 
  SuggestedAction,
  PersonaType,
  INTELLIGENCE_CATEGORY_LABELS,
  INTELLIGENCE_PRIORITY_LABELS,
  INTELLIGENCE_IMPACT_LEVEL_LABELS,
} from '@/types/intelligence';

// ==========================================
// Utility Functions
// ==========================================

/**
 * 取得優先級變體
 */
function getPriorityVariant(priority: string): 'default' | 'destructive' | 'outline' | 'secondary' {
  switch (priority) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
}

/**
 * 取得影響等級變體
 */
function getImpactVariant(impactLevel: string): 'default' | 'destructive' | 'outline' | 'secondary' {
  switch (impactLevel) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
}

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return '今天';
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days} 天前`;
  } else {
    return date.toLocaleDateString('zh-TW');
  }
}

/**
 * 格式化貨幣
 */
function formatCurrency(amount: number, currency: string = 'TWD'): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency,
  }).format(amount);
}

// ==========================================
// Component
// ==========================================

/**
 * 情報卡片組件
 */
const IntelligenceCard: React.FC<IntelligenceCardProps> = ({ 
  item, 
  persona, 
  onClick, 
  onActionClick 
}) => {
  // 取得角色化內容
  const personaRelevance = item.personaRelevance.find(p => p.persona === persona);
  const summary = personaRelevance?.customSummary || item.summary;
  const customActions = personaRelevance?.customActions || [];

  // 取得顯示的建議行動
  const displayActions = customActions.length > 0 
    ? customActions.map((title, index) => ({
        id: `custom_${index}`,
        title,
        description: '',
        priority: item.priority,
        status: 'pending' as const,
      }))
    : item.suggestedActions.slice(0, 3);

  return (
    <Card 
      className="intelligence-card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityVariant(item.priority)}>
              {INTELLIGENCE_PRIORITY_LABELS[item.priority]}
            </Badge>
            <Badge variant={getImpactVariant(item.impactLevel)}>
              {INTELLIGENCE_IMPACT_LEVEL_LABELS[item.impactLevel]}
            </Badge>
          </div>
          {item.sourceUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                window.open(item.sourceUrl, '_blank');
              }}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
        <CardDescription className="line-clamp-2">{summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 類別和關聯分數 */}
          <div className="flex items-center justify-between">
            <Badge variant="outline">
              {INTELLIGENCE_CATEGORY_LABELS[item.category]}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>關聯分數: {item.relevanceScore}%</span>
            </div>
          </div>

          {/* 標籤 */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{item.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* 建議行動 */}
          {displayActions.length > 0 && (
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                建議行動
              </h4>
              <div className="space-y-2">
                {displayActions.map((action, index) => (
                  <Button
                    key={action.id || index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick?.(action as SuggestedAction);
                    }}
                  >
                    <span className="truncate">{action.title}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 成本影響 (僅 CFO 角色顯示) */}
          {persona === PersonaType.CFO && item.suggestedActions.some(a => a.estimatedCost) && (
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                財務影響
              </h4>
              {item.suggestedActions
                .filter(a => a.estimatedCost)
                .slice(0, 2)
                .map((action, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    <span className="font-medium">{action.title}:</span>{' '}
                    {formatCurrency(action.estimatedCost!.min)} - {formatCurrency(action.estimatedCost!.max)}
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDate(item.publishedAt)}</span>
          </div>
          <span>{item.source}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

// ==========================================
// Export
// ==========================================

export default IntelligenceCard;
