/**
 * 📄 永續報告書中心 - 服務串聯範例頁面
 * 展示如何使用 ServiceEcosystemWidget 進行深度與廣度串聯
 */

import React from 'react';
import { View } from '@/types/core';
import { ServiceEcosystemWidget, ServiceEcosystemMap } from '@/components/navigation/ServiceEcosystemWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, TrendingUp, Users, Database } from 'lucide-react';

export function EsgReportingPageWithEcosystem() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 頁面標題 */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">永續報告書中心</h1>
          <p className="text-muted-foreground mt-1">
            一站式ESG報告書生成平台，結合AI智能分析與5T驗證機制
          </p>
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側 - 主要功能區 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>報告書生成區</CardTitle>
            </CardHeader>
            <CardContent>
              <p>報告書生成內容...</p>
            </CardContent>
          </Card>

          {/* 📊 服務串聯區 - 完整模式 */}
          <ServiceEcosystemWidget 
            currentView={View.REPORT_GEN_V2} 
            variant="full"
            maxItems={4}
          />
        </div>

        {/* 右側 - 快速操作 */}
        <div className="space-y-6">
          {/* 快速操作面板 */}
          <ServiceEcosystemWidget 
            currentView={View.REPORT_GEN_V2} 
            variant="actions"
            maxItems={3}
          />

          {/* 相關服務面板 */}
          <ServiceEcosystemWidget 
            currentView={View.REPORT_GEN_V2} 
            variant="related"
            maxItems={3}
          />

          {/* 探索路徑面板 */}
          <ServiceEcosystemWidget 
            currentView={View.REPORT_GEN_V2} 
            variant="path"
            maxItems={3}
          />
        </div>
      </div>

      {/* 🎯 數據流向圖 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            數據流向與服務串聯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 輸入數據 */}
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                輸入數據
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ESG數據</li>
                <li>• GRI指標</li>
                <li>• 碳排數據</li>
                <li>• 治理資料</li>
              </ul>
            </div>
            
            {/* 輸出成果 */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                輸出成果
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ESG報告書</li>
                <li>• 缺口分析報告</li>
                <li>• 改進建議</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🌐 服務生態地圖按鈕 */}
      <div className="flex justify-center">
        <ServiceEcosystemMap />
      </div>
    </div>
  );
}

export default EsgReportingPageWithEcosystem;
