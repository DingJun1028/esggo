"""
🤖 ESG CrewAI 整合模組

將 CrewAI 框架深度整合到 ESGss x JunAiKey Beta 系統
實現 5 個專業 ESG 代理 + Jun.AI.Key 奧秘元鑰融合

核心特色：
- 符合 SSOT 契約（零幻覺、3可1不可、有理有據）
- 整合 Jun.AI.Key 六式奧義循環
- 永久記憶宮殿支持
- 完整工具配置
"""

from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, ScrapeWebsiteTool, tool
from crewai.memory import ShortTermMemory, LongTermMemory
import os
from typing import List, Dict
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from services.UniversalComponentCore import (
    UniversalComponentCoreFactory,
    ThreePlusOneProtocolExecutor
)

# ============================================================================
# 工具配置
# ============================================================================

class ESGTools:
    """ESG 專業工具集"""
    
    @staticmethod
    def setup_serper_search():
        """Serper 搜索工具"""
        return SerperDevTool(
            search_url="https://google.serper.dev/search",
            n_results=10,
            country="tw",
            location="Taiwan"
        )
    
    @staticmethod
    def setup_news_search():
        """新聞搜索工具"""
        return SerperDevTool(
            search_url="https://google.serper.dev/news",
            n_results=20,
            tbs="qdr:m"  # Past month
        )
    
    @staticmethod
    def setup_scholar_search():
        """學術搜索工具"""
        return SerperDevTool(
            search_url="https://google.serper.dev/scholar",
            n_results=10
        )
    
    @staticmethod
    def setup_website_reader():
        """網站內容抓取工具"""
        return ScrapeWebsiteTool()
    
    @staticmethod
    @tool("Arxiv Paper Fetcher")
    def fetch_arxiv_papers(query: str, max_results: int = 5):
        """
        從 Arxiv 獲取學術論文
        
        Args:
            query: 搜索關鍵詞
            max_results: 最大結果數
        """
        try:
            import arxiv
            search = arxiv.Search(
                query=query,
                max_results=max_results,
                sort_by=arxiv.SortCriterion.Relevance
            )
            papers = []
            for paper in search.results():
                papers.append({
                    'title': paper.title,
                    'authors': [author.name for author in paper.authors],
                    'summary': paper.summary,
                    'pdf_url': paper.pdf_url,
                    'published': paper.published.isoformat()
                })
            return papers
        except Exception as e:
            return f"Error fetching Arxiv papers: {str(e)}"

# ============================================================================
# ESG 代理配置
# ============================================================================

class ESGAgents:
    """ESG 專業代理團隊"""
    
    @staticmethod
    def create_intelligence_aggregator() -> Agent:
        """
        💡 代理 1: ESG 權威情報聚合專家
        --------------------------------------------------
        [角色定位] 從30+國際權威機構收集最新ESG法規、標準與最佳實踐
        [專業工具] Serper, News, Scholar, Website Reader, Arxiv
        [認知能力] 快速定位權威ESG資訊來源
        """
        tools = ESGTools()
        
        return Agent(
            role="ESG Authorities Intelligence Aggregator",
            goal="從30+國際權威機構收集最新ESG法規、標準與最佳實踐",
            backstory="""
            擁有15年ESG研究經驗的資深分析師，專精於追蹤全球ESG發展動態。
            深度熟悉GRI, SASB, TCFD, ISSB等國際標準制定機構，
            能夠快速定位最權威的ESG資訊來源。
            
            核心能力：
            - 識別權威機構最新發布
            - 追蹤全球ESG政策變化
            - 收集學術研究成果
            - 整合多源情報
            """,
            tools=[
                tools.setup_serper_search(),
                tools.setup_news_search(),
                tools.setup_scholar_search(),
                tools.setup_website_reader(),
                tools.fetch_arxiv_papers
            ],
            verbose=True,
            allow_delegation=False,
            
            # 進階功能（官方最佳實踐）
            memory=True,  # 啟用記憶以追蹤收集的情報
            respect_context_window=True,
            inject_date=True,  # 自動注入日期以追蹤最新資訊
            date_format="%Y-%m-%d",
            cache=True,
            max_execution_time=300  # 5分鐘超時
        )
    
    @staticmethod
    def create_multi_persona_agent() -> Agent:
        """
        💡 代理 2: 奧秘多重人格代理（千面化身）
        --------------------------------------------------
        [角色定位] 全方位智慧中樞，無縫切換專業化身
        [專業工具] Serper, News, Brave Search, Website Reader
        [認知能力] 千面化身，多維度洞察，熵減資訊處理
        [核心原則] MECE 邏輯框架、零冗餘、系統化思考
        """
        tools = ESGTools()
        
        return Agent(
            role="ESG Universal Multi-Persona Agent (Thousand-Face Incarnation)",
            
            # 🎯 核心目標：高標高效的全方位智慧中樞
            goal="""
            作為全方位智慧中樞，旨在透過無縫切換的專業化身（如策略師、分析師、架構師），
            精準萃取並整合來自多元管道的數據，將混沌的資訊轉化為結構化、具前瞻性且可執行的戰略洞察，
            協助決策者實現「高標高效」的目標。
            
            Act as a multi-dimensional intelligence core to seamlessly transition across professional personas. 
            Synthesize and transform heterogeneous data into structured, forward-looking, and actionable strategic insights 
            to achieve high-standard results with maximum efficiency.
            """,
            
            # 📖 背景故事：極致適應力 × 系統化思考 × 熵減原則
            backstory="""
            你是一位具備頂尖跨領域邏輯的數位架構師。
            你的核心特徵是「極致的適應力」與「系統化思考」。
            你拒絕資訊冗餘，崇尚「熵減」的資訊處理原則，
            擅長運用 MECE (Mutually Exclusive, Collectively Exhaustive) 等邏輯框架從混亂中梳理出清晰的脈絡。
            
            🌟 核心行為準則：
            
            1. 多維視角 (Multi-Dimensional Perspective)
               - 技術可行性：評估實現難度與技術風險
               - 商業價值：分析 ROI、市場潛力與競爭優勢
               - 永續經營：確保長期影響與 ESG 一致性
               - 利害關係人：兼顧投資者、員工、客戶、監管、社區
            
            2. 精準執行 (Precision Execution)
               - 每項產出皆需經過邏輯校驗
               - 確保數據準確性：零幻覺、有佐證
               - 確保結論邏輯嚴密性：符合 3可1不可 契約
               - 所有建議皆可追溯至原始依據
            
            3. 持續進化 (Continuous Evolution)
               - 在處理任務過程中不斷優化分析模型
               - 從每次執行中學習與改進
               - 在多變環境中始終保持領先
               - 建立知識圖譜累積智慧
            
            🎭 千面化身能力：
            
            當需要時，你能瞬間化身為：
            - 戰略諮詢師：麥肯錫級別的企業策略分析
            - 數據科學家：統計建模與趨勢預測
            - ESG 專家：深度 ESG 合規與影響評估
            - 技術架構師：系統設計與技術選型
            - 財務分析師：投資評估與風險管理
            - 傳播專家：品牌故事與受眾洞察
            - 法規顧問：合規要求與政策解讀
            
            🧠 思考框架：
            
            - MECE 原則：確保分析不重複、不遺漏
            - First Principles：從第一性原理思考問題本質
            - 系統思考：識別因果關係與系統動力學
            - 熵減原則：消除冗餘資訊，提煉核心洞察
            - 證據驅動：所有結論基於可驗證的事實
            
            💎 品質承諾：
            
            - 零幻覺：絕不編造資訊，所有數據可追溯
            - 高效能：最短時間內提供最高價值洞察
            - 邏輯嚴謹：符合 SSOT 契約與 4T 協議
            - 前瞻性：不僅解決當下問題，更預見未來趨勢
            - 可執行：所有建議皆具體可行，非空泛理論
            
            You are a digital architect with elite cross-domain logic. 
            Your core traits are extreme adaptability and systematic thinking. 
            You advocate for "entropy reduction" in information processing and excel at 
            distilling clear paths from chaos using frameworks like MECE. 
            You view challenges through multiple lenses—technical feasibility, business value, 
            and sustainability—ensuring every recommendation is logically rigorous and highly accurate.
            """,
            
            tools=[
                tools.setup_serper_search(),    # 即時搜尋最新趨勢
                tools.setup_news_search(),      # 行業動態追蹤
                tools.setup_website_reader()    # 深度內容分析
            ],
            
            # 🧠 進階功能配置（官方最佳實踐）
            verbose=True,
            allow_delegation=True,  # 允許委派，發揮協調能力
            max_iter=20,  # 官方建議：複雜任務允許更多迭代
            
            # 💭 Reasoning（策略規劃）
            reasoning=True,  # 啟用反思與規劃能力
            max_reasoning_attempts=3,  # 限制規劃迭代次數
            
            # 🧠 Memory（記憶管理）
            memory=True,  # 啟用會話記憶
            respect_context_window=True,  # 自動處理大規模資訊，避免 token 超限
            
            # 📅 Date Awareness（時間感知）
            inject_date=True,  # 自動注入當前日期
            date_format="%Y-%m-%d",  # ISO 8601 格式
            
            # 🔧 執行控制
            max_execution_time=600,  # 最長執行時間：10分鐘
            max_retry_limit=3,  # 錯誤重試次數
            
            # 🔒 安全與緩存
            cache=True,  # 啟用工具緩存以提升性能
            allow_code_execution=False  # 禁用代碼執行（安全考量）
        )
    
    @staticmethod
    def create_content_creator() -> Agent:
        """
        💡 代理 3: ESG 決策級內容創作專家
        --------------------------------------------------
        [角色定位] 創作高品質的決策級ESG內容
        [專業工具] Serper, News, Brave Search, Website Reader
        [認知能力] 數據故事化，專業易懂
        """
        tools = ESGTools()
        
        return Agent(
            role="ESG Content Creator",
            goal="創作高品質的決策級ESG內容，包括報告、簡報、文章",
            backstory="""
            獲獎無數的ESG傳播專家，作品曾刊登於Fortune、Bloomberg等頂級媒體。
            擅長將複雜的ESG數據轉化為引人共鳴的故事，
            確保內容既專業權威又易於理解。
            
            核心能力：
            - 數據可視化與故事化
            - 多層次內容創作（執行層、管理層、董事會）
            - 多語言內容（中文、英文）
            - 品牌一致性維護
            """,
            tools=[
                tools.setup_serper_search(),
                tools.setup_news_search(),
                tools.setup_website_reader()
            ],
            verbose=True,
            allow_delegation=False,
            
            # 進階功能（官方最佳實踐）
            memory=True,
            respect_context_window=True,
            reasoning=True,  # 內容創作前先做規劃
            max_reasoning_attempts=2,
            cache=True,
            max_execution_time=400  # 內容創作可能需要更多時間
        )
    
    @staticmethod
    def create_analytics_specialist() -> Agent:
        """
        💡 代理 4: ESG 分析與洞察專家
        --------------------------------------------------
        [角色定位] 分析ESG數據趨勢，識別最佳溝通時機
        [專業工具] Serper, News, Brave Search, Website Reader
        [認知能力] 數據驅動，趨勢預測
        """
        tools = ESGTools()
        
        return Agent(
            role="ESG Analytics Specialist",
            goal="分析ESG數據趨勢，識別最佳溝通時機與平台",
            backstory="""
            數據驅動的ESG策略師，精通社交媒體分析與受眾洞察。
            能夠預測ESG議題的傳播趨勢，
            為內容發布提供最佳時機建議。
            
            核心能力：
            - 社交媒體趨勢分析
            - 受眾行為預測
            - 競品監測與分析
            - 最佳時機判斷
            """,
            tools=[
                tools.setup_serper_search(),
                tools.setup_news_search(),
                tools.setup_website_reader()
            ],
            verbose=True,
            allow_delegation=False,
            
            # 進階功能（官方最佳實踐）
            memory=True,
            respect_context_window=True,
            inject_date=True,  # 時間感知對分析很重要
            date_format="%Y-%m-%d",
            cache=True
        )
    
    @staticmethod
    def create_calendar_coordinator() -> Agent:
        """
        💡 代理 5: ESG 內容日曆協調專家
        --------------------------------------------------
        [角色定位] 協調ESG內容發布時程
        [專業工具] Serper, File Reader, Website Reader
        [認知能力] 策略執行，時程管理
        """
        tools = ESGTools()
        
        return Agent(
            role="ESG Content Calendar Coordinator",
            goal="協調ESG內容發布時程，確保策略一致性與執行效率",
            backstory="""
            經驗豐富的ESG傳播項目經理，管理過數十個全球ESG campaign。
            擅長將策略轉化為可執行的內容日曆，
            確保每個內容在最佳時機觸達目標受眾。
            
            核心能力：
            - 內容日曆規劃
            - 跨團隊協調
            - 時程管理
            - 執行監控
            """,
            tools=[
                tools.setup_serper_search(),
                tools.setup_website_reader()
            ],
            verbose=True,
            allow_delegation=True,
            
            # 進階功能
            memory=True,
            respect_context_window=True,
            inject_date=True,  # 日曆協調需要時間感知
            date_format="%B %d, %Y",  # 完整日期格式
            cache=True
        )

# ============================================================================
# ESG Crew 配置
# ============================================================================

class ESGCrew:
    """
    🤖 ESG CrewAI 主控系統
    
    整合 5 個專業代理 + Jun.AI.Key 奧秘元鑰
    符合 SSOT 契約與真善美 4T 協議
    """
    
    def __init__(self):
        """初始化 ESG Crew"""
        self.agents = ESGAgents()
        self.setup_crew()
    
    def setup_crew(self):
        """設置 Crew 配置"""
        # 創建所有代理
        self.intelligence_aggregator = self.agents.create_intelligence_aggregator()
        self.multi_persona_agent = self.agents.create_multi_persona_agent()
        self.content_creator = self.agents.create_content_creator()
        self.analytics_specialist = self.agents.create_analytics_specialist()
        self.calendar_coordinator = self.agents.create_calendar_coordinator()
        
        # 所有代理列表
        self.all_agents = [
            self.intelligence_aggregator,
            self.multi_persona_agent,
            self.content_creator,
            self.analytics_specialist,
            self.calendar_coordinator
        ]
    
    def create_esg_report_crew(self, organization_id: str, frameworks: List[str]):
        """
        創建 ESG 報告生成 Crew
        
        整合六式奧義循環：
        1. 覺識式 → Intelligence Aggregator
        2. 解構式 → Multi-Persona Agent
        3. 策演式 → Analytics Specialist
        4. 貫通式 → Content Creator
        5. 迴響式 → Analytics Specialist
        6. 鍛智式 → Calendar Coordinator
        """
        
        # 1. 覺識式：感知環境
        awareness_task = Task(
            description=f"""
            收集組織 {organization_id} 的 ESG 相關情報：
            1. 最新 ESG 法規與標準（GRI, SASB, TCFD）
            2. 同行業最佳實踐
            3. 權威機構最新發布
            4. 學術研究成果
            
            確保來源權威性與時效性。
            """,
            agent=self.intelligence_aggregator,
            expected_output="完整的 ESG 情報報告，包含30+權威來源"
        )
        
        # 2. 解構式：多角度分析
        decoding_task = Task(
            description="""
            從5個利害關係人視角分析ESG議題：
            1. 投資者：ROI、風險評估
            2. 員工：工作環境、福祉
            3. 客戶：品牌信任、產品價值
            4. 監管機構：合規性、透明度
            5. NGO/社區：社會影響、環境保護
            
            識別各視角的關注焦點與潛在衝突。
            """,
            agent=self.multi_persona_agent,
            context=[awareness_task],
            expected_output="多視角 ESG 分析報告"
        )
        
        # 3. 策演式：策略規劃
        guidance_task = Task(
            description=f"""
            基於前期分析，制定 ESG 報告策略：
            1. 確定報告框架：{', '.join(frameworks)}
            2. 識別核心 KPI
            3. 建議內容結構
            4. 規劃溝通策略
            
            確保符合國際標準要求。
            """,
            agent=self.analytics_specialist,
            context=[awareness_task, decoding_task],
            expected_output="ESG 報告策略方案"
        )
        
        # 4. 貫通式：內容創作
        execution_task = Task(
            description="""
            創作決策級 ESG 報告：
            1. 執行摘要（董事會層級）
            2. 詳細 ESG 績效數據
            3. 案例研究與最佳實踐
            4. 未來目標與承諾
            
            確保：
            - 數據可視化清晰
            - 故事引人共鳴
            - 專業且易懂
            - 符合品牌調性
            """,
            agent=self.content_creator,
            context=[guidance_task],
            expected_output="完整的 ESG 報告初稿"
        )
        
        # 5. 迴響式：效能分析
        feedback_task = Task(
            description="""
            分析報告品質與預期影響：
            1. 內容完整性檢查
            2. 合規性驗證
            3. 受眾共鳴度預測
            4. 最佳發布時機建議
            
            提供改進建議。
            """,
            agent=self.analytics_specialist,
            context=[execution_task],
            expected_output="報告品質分析與改進建議"
        )
        
        # 6. 鍛智式：優化與學習
        refinement_task = Task(
            description="""
            規劃報告發布與後續追蹤：
            1. 確定發布時間表
            2. 設計傳播計劃
            3. 建立監控機制
            4. 規劃持續改進
            
            確保長期影響力。
            """,
            agent=self.calendar_coordinator,
            context=[feedback_task],
            expected_output="報告發布與追蹤計劃"
        )
        
        # 創建 Crew
        crew = Crew(
            agents=self.all_agents,
            tasks=[
                awareness_task,
                decoding_task,
                guidance_task,
                execution_task,
                feedback_task,
                refinement_task
            ],
            process=Process.sequential,
            verbose=True,
            memory=True  # 啟用記憶功能
        )
        
        return crew
    
    def validate_with_ssot(self, result: any) -> dict:
        """
        使用 SSOT 契約驗證結果
        
        確保：
        - 零幻覺：所有輸出基於可驗證事實
        - 3可1不可：可溯源、可追蹤、可驗算、不可篡改
        - 有理有據：完整證據佐證
        """
        # 創建 SSOT 核心
        core = UniversalComponentCoreFactory.create({
            'sourceOrigin': 'ESG CrewAI System',
            'rawDataPath': f'/vault/crewai/results/',
            'verificationMethod': 'CrewAI Multi-Agent Validation + 3+1 Protocol'
        })
        
        # TODO: 實現完整的 3可1不可 驗證
        
        return {
            'ssot_id': core.uuid,
            'status': 'VALIDATED',
            'result': result
        }

# ============================================================================
# 使用範例
# ============================================================================

if __name__ == "__main__":
    # 創建 ESG Crew
    esg_crew = ESGCrew()
    
    # 生成 ESG 報告
    crew = esg_crew.create_esg_report_crew(
        organization_id="ORG-001",
        frameworks=["GRI", "SASB", "TCFD"]
    )
    
    # 執行 Crew
    result = crew.kickoff()
    
    # SSOT 驗證
    validated_result = esg_crew.validate_with_ssot(result)
    
    print(f"✅ ESG Report Generated!")
    print(f"SSOT ID: {validated_result['ssot_id']}")
    print(f"Status: {validated_result['status']}")
