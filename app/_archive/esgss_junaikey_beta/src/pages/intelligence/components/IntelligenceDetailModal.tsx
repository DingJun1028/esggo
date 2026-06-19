/**
 * 情報詳情模態框組件
 * Intelligence Detail Modal Component
 * 
 * @version 1.0.0
 * @date 2026-02-11
 */

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  Share2, 
  Bookmark, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Clock,
  FileText,
  DollarSign,
  Link as LinkIcon,
  Eye,
  Calculator,
  Database,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { 
  IntelligenceItem, 
  PersonaType,
  SuggestedAction,
  INTELLIGENCE_CATEGORY_LABELS,
  INTELLIGENCE_PRIORITY_LABELS,
  INTELLIGENCE_IMPACT_LEVEL_LABELS,
} from '@/types/intelligence';

// ==========================================
// Props
// ==========================================

interface IntelligenceDetailModalProps {
  item: IntelligenceItem;
  persona?: PersonaType;
  open?: boolean;
  onClose?: () => void;
  onConvertToTask?: (action: SuggestedAction) => void;
  onShare?: () => void;
  onFavorite?: () => void;
}

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
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

/**
 * 計算財務影響總額
 */
function calculateTotalFinancialImpact(actions: SuggestedAction[]): { min: number; max: number } {
  let min = 0;
  let max = 0;
  
  actions.forEach(action => {
    if (action.estimatedCost) {
      min += action.estimatedCost.min;
      max += action.estimatedCost.max;
    }
  });
  
  return { min, max };
}

// ==========================================
// Component
// ==========================================

/**
 * 情報詳情模態框組件
 */
const IntelligenceDetailModal: React.FC<IntelligenceDetailModalProps> = ({ 
  item, 
  persona = PersonaType.CEO,
  open = true,
  onClose,
  onConvertToTask,
  onShare,
  onFavorite,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  // 取得角色化內容
  const personaRelevance = item.personaRelevance.find(p => p.persona === persona);
  const customSummary = personaRelevance?.customSummary || item.summary;
  const customActions = personaRelevance?.customActions || [];

  // 計算財務影響
  const financialImpact = calculateTotalFinancialImpact(item.suggestedActions);

  // 處理收藏
  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.();
  };

  // 處理分享
  const handleShare = () => {
    onShare?.();
  };

  // 處理轉任務
  const handleConvertToTask = (action: SuggestedAction) => {
    onConvertToTask?.(action);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{item.title}</DialogTitle>
              <DialogDescription className="text-base">
                {customSummary}
              </DialogDescription>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className={isFavorited ? "text-yellow-500" : "text-muted-foreground"}
              >
                <Bookmark className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 標籤和優先級 */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getPriorityVariant(item.priority)}>
              {INTELLIGENCE_PRIORITY_LABELS[item.priority]}
            </Badge>
            <Badge variant={getImpactVariant(item.impactLevel)}>
              {INTELLIGENCE_IMPACT_LEVEL_LABELS[item.impactLevel]}
            </Badge>
            <Badge variant="outline">
              {INTELLIGENCE_CATEGORY_LABELS[item.category]}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>關聯分數: {item.relevanceScore}%</span>
            </div>
          </div>

          {/* 來源資訊 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              來源資訊
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">來源</span>
                <span className="text-sm font-medium">{item.source}</span>
              </div>
              {item.sourceUrl && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">連結</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => window.open(item.sourceUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    查看原始來源
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">發布時間</span>
                <span className="text-sm font-medium">
                  {item.publishedAt ? formatDate(item.publishedAt) : formatDate(item.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">建立時間</span>
                <span className="text-sm font-medium">{formatDate(item.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* 5T 原則證據區塊 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                5T 原則證據
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEvidence(!showEvidence)}
              >
                {showEvidence ? '收起' : '展開'}
                <ArrowRight className={`h-4 w-4 ml-1 transition-transform ${showEvidence ? 'rotate-90' : ''}`} />
              </Button>
            </div>
            {showEvidence && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Calculator className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1">公式透明可計算</h4>
                    <p className="text-xs text-muted-foreground">
                      關聯分數計算公式：基於類別匹配度、優先級權重、角色相關性綜合評分
                    </p>
                    <div className="mt-2 p-2 bg-background rounded text-xs font-mono">
                      Score = (CategoryMatch × 0.3) + (PriorityWeight × 0.4) + (PersonaRelevance × 0.3)
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1">項目清晰可追溯</h4>
                    <p className="text-xs text-muted-foreground">
                      情報 ID: {item.id} | 建立者: {item.metadata.author} | 語言: {item.metadata.language}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <LinkIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-1">連結可驗證</h4>
                    {item.sourceUrl ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0"
                        onClick={() => window.open(item.sourceUrl, '_blank')}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        查看原始單據樣貌
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">無外部連結</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* 標籤 */}
          {item.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">相關標籤</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 相關標準 */}
          {item.relatedStandards.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">相關標準</h3>
              <div className="flex flex-wrap gap-2">
                {item.relatedStandards.map((standard, index) => (
                  <Badge key={index} variant="outline">
                    {standard}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* 詳細內容 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">詳細內容</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm whitespace-pre-wrap">{item.content}</p>
            </div>
          </div>

          <Separator />

          {/* 建議行動 */}
          {item.suggestedActions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                建議行動
              </h3>
              <div className="space-y-3">
                {item.suggestedActions.map((action, index) => (
                  <div key={action.id || index} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium mb-1">{action.title}</h4>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <Badge variant={getPriorityVariant(action.priority)} className="ml-2">
                        {INTELLIGENCE_PRIORITY_LABELS[action.priority]}
                      </Badge>
                    </div>
                    {action.estimatedCost && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <DollarSign className="h-3 w-3" />
                        <span>預估成本: {formatCurrency(action.estimatedCost.min)} - {formatCurrency(action.estimatedCost.max)}</span>
                      </div>
                    )}
                    {action.deadline && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        <span>截止日期: {formatDate(action.deadline)}</span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConvertToTask(action)}
                      className="w-full"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      一鍵轉任務
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 財務影響總覽 (僅 CFO 角色顯示) */}
          {persona === PersonaType.CFO && item.suggestedActions.some(a => a.estimatedCost) && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  財務影響總覽
                </h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">最低預估成本</p>
                      <p className="text-lg font-semibold">{formatCurrency(financialImpact.min)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">最高預估成本</p>
                      <p className="text-lg font-semibold">{formatCurrency(financialImpact.max)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      * 此數據基於建議行動的預估成本計算，實際成本可能因執行情況而異
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 元數據 */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">元數據</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">語言:</span> {item.metadata.language}
                </div>
                <div>
                  <span className="text-muted-foreground">地區:</span> {item.metadata.region}
                </div>
                <div>
                  <span className="text-muted-foreground">產業:</span> {item.metadata.industry}
                </div>
                <div>
                  <span className="text-muted-foreground">情緒:</span> {item.metadata.sentiment}
                </div>
                <div>
                  <span className="text-muted-foreground">信心度:</span> {(item.metadata.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ==========================================
// Export
// ==========================================

export default IntelligenceDetailModal;
