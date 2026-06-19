/**
 * 商情偵測中心主頁面
 * Intelligence Detection Page
 * 
 * @version 1.0.0
 * @date 2026-02-11
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Scale,
  Users,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { IntelligenceView, PersonaType, IntelligenceFilters } from '@/types/intelligence';
import { intelligenceDetectionService } from '@/services/IntelligenceDetectionService';
import IntelligenceHeader from './components/IntelligenceHeader';
import IntelligenceFilter from './components/IntelligenceFilter';
import IntelligenceDashboard from './components/IntelligenceDashboard';
import DailyBriefingView from './views/DailyBriefingView';
import TrendPredictionView from './views/TrendPredictionView';
import RiskAlertView from './views/RiskAlertView';
import RegulatoryUpdateView from './views/RegulatoryUpdateView';
import SupplierGroupView from './views/SupplierGroupView';
import IntelligenceDetailModal from './components/IntelligenceDetailModal';

// ==========================================
// Props
// ==========================================

interface IntelligenceDetectionPageProps {
  persona?: PersonaType;
}

// ==========================================
// Component
// ==========================================

/**
 * 商情偵測中心主頁面
 */
const IntelligenceDetectionPage: React.FC<IntelligenceDetectionPageProps> = ({ 
  persona = PersonaType.CEO 
}) => {
  const navigate = useNavigate();
  
  // 頁面狀態
  const [currentView, setCurrentView] = useState<IntelligenceView>(IntelligenceView.DASHBOARD);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filters, setFilters] = useState<IntelligenceFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 處理篩選變更
  const handleFilterChange = (newFilters: IntelligenceFilters) => {
    setFilters(newFilters);
  };

  // 處理情報項目點擊
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  // 處理關閉詳情模態框
  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  // 處理視圖切換
  const handleViewChange = (view: IntelligenceView) => {
    setCurrentView(view);
  };

  return (
    <div className="intelligence-detection-page min-h-screen bg-background">
      {/* 頁面標題 */}
      <IntelligenceHeader 
        persona={persona} 
        currentView={currentView}
        onViewChange={handleViewChange}
      />

      {/* 主要內容 */}
      <div className="container mx-auto px-4 py-6">
        {/* 篩選器 */}
        <div className="mb-6">
          <IntelligenceFilter 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* 載入狀態 */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">載入中...</p>
            </div>
          </div>
        )}

        {/* 錯誤狀態 */}
        {error && (
          <div className="mb-6">
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 主要內容區域 */}
        {!loading && !error && (
          <Tabs value={currentView} onValueChange={(v) => handleViewChange(v as IntelligenceView)}>
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value={IntelligenceView.DASHBOARD}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                儀表板
              </TabsTrigger>
              <TabsTrigger value={IntelligenceView.DAILY_BRIEFING}>
                <FileText className="h-4 w-4 mr-2" />
                每日簡報
              </TabsTrigger>
              <TabsTrigger value={IntelligenceView.TREND_PREDICTION}>
                <TrendingUp className="h-4 w-4 mr-2" />
                趨勢預測
              </TabsTrigger>
              <TabsTrigger value={IntelligenceView.RISK_ALERT}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                風險預警
              </TabsTrigger>
              <TabsTrigger value={IntelligenceView.REGULATORY_UPDATE}>
                <Scale className="h-4 w-4 mr-2" />
                法規更新
              </TabsTrigger>
              <TabsTrigger value={IntelligenceView.SUPPLIER_GROUP}>
                <Users className="h-4 w-4 mr-2" />
                供應鏈
              </TabsTrigger>
            </TabsList>

            {/* 儀表板視圖 */}
            <TabsContent value={IntelligenceView.DASHBOARD}>
              <IntelligenceDashboard 
                persona={persona} 
                filters={filters}
                onItemClick={handleItemClick}
              />
            </TabsContent>

            {/* 每日簡報視圖 */}
            <TabsContent value={IntelligenceView.DAILY_BRIEFING}>
              <DailyBriefingView 
                persona={persona}
                onItemClick={handleItemClick}
              />
            </TabsContent>

            {/* 趨勢預測視圖 */}
            <TabsContent value={IntelligenceView.TREND_PREDICTION}>
              <TrendPredictionView 
                persona={persona}
                onItemClick={handleItemClick}
              />
            </TabsContent>

            {/* 風險預警視圖 */}
            <TabsContent value={IntelligenceView.RISK_ALERT}>
              <RiskAlertView 
                persona={persona}
                onItemClick={handleItemClick}
              />
            </TabsContent>

            {/* 法規更新視圖 */}
            <TabsContent value={IntelligenceView.REGULATORY_UPDATE}>
              <RegulatoryUpdateView 
                persona={persona}
                onItemClick={handleItemClick}
              />
            </TabsContent>

            {/* 供應鏈視圖 */}
            <TabsContent value={IntelligenceView.SUPPLIER_GROUP}>
              <SupplierGroupView 
                persona={persona}
                onItemClick={handleItemClick}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* 詳情模態框 */}
      {selectedItem && (
        <IntelligenceDetailModal
          item={selectedItem}
          persona={persona}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

// ==========================================
// Export
// ==========================================

export default IntelligenceDetectionPage;
