"""
🎯 CrewAI ESG 任務定義

定義 5 個代理的專業任務
整合 Jun.AI.Key 六式奧義循環
"""

from crewai import Task
from typing import List

class ESGTasks:
    """ESG 專業任務集合"""
    
    @staticmethod
    def create_intelligence_gathering_task(
        agent,
        organization_id: str,
        focus_areas: List[str] = None
    ) -> Task:
        """
        覺識式：情報收集任務
        
        收集最新 ESG 法規、標準、最佳實踐
        """
        if focus_areas is None:
            focus_areas = ["環境", "社會", "治理"]
        
        return Task(
            description=f"""
            **任務：ESG 權威情報收集**
            
            組織ID：{organization_id}
            焦點領域：{', '.join(focus_areas)}
            
            執行步驟：
            1. 收集30+權威機構最新發布
               - GRI (Global Reporting Initiative)
               - SASB (Sustainability Accounting Standards Board)
               - TCFD (Task Force on Climate-related Financial Disclosures)
               - ISSB (International Sustainability Standards Board)
               - CDP (Carbon Disclosure Project)
               
            2. 追蹤行業最佳實踐
               - 同業標竿企業 ESG 報告
               - 創新案例研究
               - 獲獎項目分析
               
            3. 學術研究成果
               - 最新 ESG 研究論文
               - 權威期刊文章
               - 學術會議成果
               
            4. 法規政策更新
               - 各國 ESG 法規變化
               - 監管要求更新
               - 合規時間表
            
            **輸出要求**：
            - 每條情報標註來源與發布日期
            - 按重要性排序
            - 標註可信度評級（1-5星）
            - 提供原始鏈接
            
            **品質標準**：
            - 零幻覺：所有信息可驗證
            - 有佐證：完整來源記錄
            - 時效性：近3個月內發布優先
            """,
            agent=agent,
            expected_output="完整的 ESG 情報報告（30+ 權威來源，100% 可驗證）"
        )
    
    @staticmethod
    def create_multi_perspective_analysis_task(
        agent,
        context_tasks: List[Task],
        stakeholders: List[str] = None
    ) -> Task:
        """
        解構式：多角度分析任務
        
        從不同利害關係人視角分析 ESG 議題
        """
        if stakeholders is None:
            stakeholders = ["投資者", "員工", "客戶", "監管機構", "NGO"]
        
        return Task(
            description=f"""
            **任務：ESG 多視角分析**
            
            利害關係人視角：{', '.join(stakeholders)}
            
            執行步驟：
            1. 投資者視角
               - ROI 與財務影響
               - ESG 風險評估
               - 長期價值創造
               - 信用評級影響
               
            2. 員工視角
               - 工作環境品質
               - 職涯發展機會
               - 薪酬公平性
               - 健康與安全
               
            3. 客戶視角
               - 品牌信任度
               - 產品永續性
               - 價值主張
               - 購買決策影響
               
            4. 監管機構視角
               - 合規性評估
               - 資訊透明度
               - 風險管控
               - 報告品質
               
            5. NGO/社區視角
               - 環境影響
               - 社會貢獻
               - 社區關係
               - 永續承諾
            
            **分析要求**：
            - 識別各視角關注焦點
            - 發現潛在衝突與協同
            - 提出平衡策略建議
            - 優先級排序
            
            **輸出格式**：
            - 視角矩陣表
            - 關鍵洞察摘要
            - 風險機會分析
            - 策略建議
            """,
            agent=agent,
            context=context_tasks,
            expected_output="多視角 ESG 分析報告（5+ 視角，完整洞察矩陣）"
        )
    
    @staticmethod
    def create_content_creation_task(
        agent,
        context_tasks: List[Task],
        content_type: str = "ESG報告",
        frameworks: List[str] = None
    ) -> Task:
        """
        貫通式：內容創作任務
        
        創作高品質決策級 ESG 內容
        """
        if frameworks is None:
            frameworks = ["GRI", "SASB", "TCFD"]
        
        return Task(
            description=f"""
            **任務：決策級 ESG 內容創作**
            
            內容類型：{content_type}
            框架標準：{', '.join(frameworks)}
            
            執行步驟：
            1. 執行摘要（董事會層級）
               - 核心亮點（3-5點）
               - 戰略意義
               - 關鍵成就
               - 未來承諾
               
            2. ESG 績效數據
               - 量化指標展示
               - 年度對比分析
               - 目標達成率
               - 趨勢圖表
               
            3. 案例研究
               - 成功項目詳述
               - 創新實踐分享
               - 影響力數據
               - 經驗總結
               
            4. 未來展望
               - 中長期目標
               - 行動計劃
               - 資源投入
               - 預期成果
            
            **創作標準**：
            - 數據故事化：複雜數據轉化為故事
            - 專業易懂：避免行話，清晰表達
            - 視覺優先：豐富圖表與可視化
            - 品牌一致：符合企業調性
            
            **框架符合**：
            - GRI：完整披露要求
            - SASB：行業特定指標
            - TCFD：氣候風險揭露
            
            **語言要求**：
            - 繁體中文為主
            - 關鍵術語英文對照
            - 專業術語解釋
            """,
            agent=agent,
            context=context_tasks,
            expected_output=f"完整的{content_type}初稿（符合{', '.join(frameworks)}標準）"
        )
    
    @staticmethod
    def create_analytics_task(
        agent,
        context_tasks: List[Task],
        analysis_type: str = "質量分析"
    ) -> Task:
        """
        迴響式：分析與洞察任務
        
        分析內容品質與傳播策略
        """
        return Task(
            description=f"""
            **任務：ESG {analysis_type}**
            
            執行步驟：
            1. 內容品質評估
               - 完整性檢查（框架要求符合度）
               - 準確性驗證（數據可靠性）
               - 易讀性分析（閱讀難度評分）
               - 視覺吸引力（圖表品質）
               
            2. 受眾共鳴度預測
               - 目標受眾畫像
               - 關注點匹配度
               - 情感共鳴分析
               - 行為觸發預測
               
            3. 傳播策略建議
               - 最佳發布時機（基於行業事件、社會熱點）
               - 平台選擇（LinkedIn, 官網, 媒體）
               - 推廣策略（KOL、廣告、PR）
               - 互動計劃
               
            4. 競品對比
               - 同業 ESG 內容分析
               - 差異化優勢
               - 改進機會
               - 創新點識別
            
            **分析工具**：
            - 社交媒體趨勢分析
            - SEO 關鍵詞研究
            - 受眾行為數據
            - 競品監測
            
            **輸出格式**：
            - 品質評分卡
            - 改進建議清單
            - 傳播策略方案
            - 時間軸規劃
            """,
            agent=agent,
            context=context_tasks,
            expected_output="完整的分析報告與傳播策略建議"
        )
    
    @staticmethod
    def create_coordination_task(
        agent,
        context_tasks: List[Task],
        timeline_weeks: int = 12
    ) -> Task:
        """
        鍛智式：協調與優化任務
        
        規劃內容日曆與執行追蹤
        """
        return Task(
            description=f"""
            **任務：ESG 內容日曆規劃**
            
            規劃週期：{timeline_weeks} 週
            
            執行步驟：
            1. 內容日曆設計
               - 關鍵里程碑標註
               - 發布時程安排
               - 責任分工明確
               - 資源需求規劃
               
            2. 執行監控機制
               - KPI 設定
               - 進度追蹤工具
               - 品質檢查點
               - 風險預警
               
            3. 持續改進計劃
               - 效果評估方法
               - 學習回饋機制
               - 最佳實踐累積
               - 知識庫建立
               
            4. 跨團隊協調
               - 溝通計劃
               - 會議時程
               - 決策流程
               - 衝突解決
            
            **日曆要素**：
            - 發布日期與時間
            - 內容類型與主題
            - 負責人與審核者
            - 平台與渠道
            - 預期目標
            
            **工具整合**：
            - Notion 日曆同步
            - Slack 通知
            - Email 提醒
            - Dashboard 監控
            
            **成功指標**：
            - 按時交付率 >95%
            - 品質達標率 >90%
            - 受眾參與度提升
            - 團隊滿意度 >4.5/5
            """,
            agent=agent,
            context=context_tasks,
            expected_output=f"{timeline_weeks}週完整內容日曆與執行追蹤計劃"
        )

# ============================================================================
# 快速任務組合
# ============================================================================

class ESGTaskSets:
    """預定義的任務組合"""
    
    @staticmethod
    def esg_report_generation_tasks(
        agents: dict,
        organization_id: str,
        frameworks: List[str]
    ) -> List[Task]:
        """
        ESG 報告生成完整任務鏈
        
        整合六式奧義循環
        """
        tasks = ESGTasks()
        
        # 1. 覺識式
        intelligence_task = tasks.create_intelligence_gathering_task(
            agent=agents['intelligence_aggregator'],
            organization_id=organization_id
        )
        
        # 2. 解構式
        analysis_task = tasks.create_multi_perspective_analysis_task(
            agent=agents['multi_persona_agent'],
            context_tasks=[intelligence_task]
        )
        
        # 3. 策演式 + 4. 貫通式
        content_task = tasks.create_content_creation_task(
            agent=agents['content_creator'],
            context_tasks=[intelligence_task, analysis_task],
            content_type="ESG年度報告",
            frameworks=frameworks
        )
        
        # 5. 迴響式
        analytics_task = tasks.create_analytics_task(
            agent=agents['analytics_specialist'],
            context_tasks=[content_task],
            analysis_type="報告品質與傳播分析"
        )
        
        # 6. 鍛智式
        coordination_task = tasks.create_coordination_task(
            agent=agents['calendar_coordinator'],
            context_tasks=[analytics_task],
            timeline_weeks=12
        )
        
        return [
            intelligence_task,
            analysis_task,
            content_task,
            analytics_task,
            coordination_task
        ]
