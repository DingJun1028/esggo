
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Workflow, Zap, Play, Settings, Database, Terminal, 
    ArrowRight, Loader2, Code, ShieldCheck,
    Activity, RefreshCw, X, AlertTriangle, Globe,
    Network, ShieldAlert, Scan, FileSearch, Github, Link as LinkIcon,
    Globe2, SearchCode, FileSpreadsheet, Save, ArrowDownToLine,
    Send, Key, FileText, Type, BrainCircuit, Sparkles, ShoppingCart,
    FileImage, FileDigit, Layers, Search, Headphones, Monitor, Copy,
    CheckCircle2, ListTodo, SlidersHorizontal, Share2, Server,
    Plus, User, Calendar, Tag, MapPin, Globe2 as ScrapingIcon,
    Mail, Briefcase, Gavel, Braces, Code2
} from 'lucide-react';
import { Language, McpRunActionOutput, TaskPriority } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { runMcpAction } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';

type NodeMode = 'create_agent_task' | 'update_agent_task' | 'mcp_protocol_mgmt' | 'api_workflow' | 'pml_llm' | 'text_gen' | 'mcp_run_action' | 'agentic_workflow_exec' | 'web_scraping' | 'supplier_carbon_audit' | 'extract_text_from_file' | 'execute_js_code';

export const WorkflowLab: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { addNote, updateAgentTaskStatus, addAgentTask } = useCompany();
  const { availablePersonas } = useUniversalAgent();
  
  const [isRunning, setIsRunning] = useState(false);
  const [activeMode, setActiveMode] = useState<NodeMode>('api_workflow');
  const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'success' | 'error' | 'warning' }[]>([]);
  const [result, setResult] = useState<any>(null);
  
  // Interactive Params - Create Task
  const [taskTitle, setTaskTitle] = useState("Verify Q3 Emissions");
  const [taskDesc, setTaskDesc] = useState("Cross-reference Siemens IoT data with factory manual logs.");
  const [taskAssignee, setTaskAssignee] = useState(availablePersonas[0]?.id || "");
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState(TaskPriority.MEDIUM);

  // Interactive Params - Update Task
  const [targetTaskId, setTargetTaskId] = useState("task-123");
  const [targetStatus, setTargetStatus] = useState("IN_PROGRESS");
  const [targetProgress, setTargetProgress] = useState(50);
  
  const [protocolId, setProtocolId] = useState("esg-standard-v1");
  const [protocolOp, setProtocolOp] = useState("SYNC");
  
  // API Workflow Params - Configured for comprehensive API Handshake
  const [apiUrl, setApiUrl] = useState("https://agenticflow.jak.ai/api/mcp/v1");
  const [apiMethod, setApiMethod] = useState("POST");
  const [apiHeaders, setApiHeaders] = useState("{\n  \"Authorization\": \"Bearer sk-xxxx\",\n  \"X-System-Origin\": \"JAK_CORE\"\n}");
  const [apiBody, setApiBody] = useState("{\n  \"query\": \"status\",\n  \"timestamp\": \"2024-Q2\"\n}");

  // Agentic Workflow Params
  const [workflowId, setWorkflowId] = useState("esg-audit-2025-01");
  const [apiToken, setApiToken] = useState("");
  const [workflowParams, setWorkflowParams] = useState("{\n  \"batch_size\": 500,\n  \"deep_scan\": true\n}");

  // Web Scraping Params
  const [scrapeUrl, setScrapeUrl] = useState("https://www.example.com/some-page");
  const [scrapeLimit, setScrapeLimit] = useState(5000);
  const [scrapeFormat, setScrapeFormat] = useState("plain text");

  // Supplier Audit Params
  const [vendorName, setVendorName] = useState("Global Electronics Ltd.");
  const [auditStandard, setAuditStandard] = useState("GRI 305: Emissions");
  const [auditDeadline, setAuditDeadline] = useState("14 Days");

  // OCR Params
  const [ocrFileUrl, setOcrFileUrl] = useState("https://example.com/invoice.pdf");

  // Code Execution Params
  const [jsCode, setJsCode] = useState(`// Available: params (object)
const emFactor = 0.52;
const consumption = params.usage || 0;
const co2 = consumption * emFactor;

return {
  source: params.source,
  calculated_emissions: co2,
  unit: "kgCO2e",
  timestamp: new Date().toISOString()
};`);
  const [jsInputs, setJsInputs] = useState(`{\n  "usage": 1500,\n  "source": "Factory_A_Meter"\n}`);

  const logEndRef = useRef<HTMLDivElement>(null);

  const currentNode = useMemo(() => {
    switch (activeMode) {
      case 'create_agent_task': return { 
          id: "task_gen_01", 
          action: "create_agent_task", 
          input_params: { title: taskTitle, description: taskDesc, assigneeId: taskAssignee, dueDate: taskDueDate, priority: taskPriority, locationId: 'tpe' } 
      };
      case 'update_agent_task': return { id: "task_upd_01", action: "update_agent_task", input_params: { taskId: targetTaskId, status: targetStatus, progress: targetProgress } };
      case 'mcp_protocol_mgmt': return { id: "proto_01", action: "mcp_protocol_mgmt", input_params: { protocolId, operation: protocolOp } };
      case 'api_workflow': 
        let headers = {};
        let body = {};
        try { headers = JSON.parse(apiHeaders); } catch(e){}
        try { body = JSON.parse(apiBody); } catch(e){}
        return { 
          id: "api_01", 
          action: "api_call", 
          input_params: { url: apiUrl, method: apiMethod, headers, body } 
        };
      case 'pml_llm': return { id: "pml_01", action: "pml_llm", input_params: { text: "Protocol audit requested.", budget: 32768 } };
      case 'agentic_workflow_exec': return { id: "wf_exec_01", action: "agentic_workflow_exec", input_params: { workflowId, token: apiToken, params: workflowParams } };
      case 'web_scraping': return { id: "scrape_01", action: "web_scraping", input_params: { url: scrapeUrl, format: scrapeFormat, token_limit: scrapeLimit } };
      case 'supplier_carbon_audit': return { id: "audit_01", action: "supplier_carbon_audit", input_params: { supplierName: vendorName, standard: auditStandard, deadline: auditDeadline } };
      case 'extract_text_from_file': return { id: "ocr_01", action: "extract_text_from_file", input_params: { fileUrl: ocrFileUrl } };
      case 'execute_js_code':
        let execParams = {};
        try { execParams = JSON.parse(jsInputs); } catch(e) {}
        return {
            id: "code_exec_01",
            action: "execute_js_code",
            input_params: { code: jsCode, params: execParams }
        };
      default: return { id: "node_gen", action: "text-generation", input_params: { prompt: "Default" } };
    }
  }, [activeMode, taskTitle, taskDesc, taskAssignee, taskDueDate, taskPriority, targetTaskId, targetStatus, targetProgress, protocolId, protocolOp, apiUrl, apiMethod, apiHeaders, apiBody, workflowId, apiToken, workflowParams, scrapeUrl, scrapeLimit, scrapeFormat, vendorName, auditStandard, auditDeadline, ocrFileUrl, jsCode, jsInputs]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString([], { hour12: false }), msg, type }]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('success', isZh ? '已複製到剪貼簿' : 'Copied', 'System');
  };

  const handleExecute = async () => {
    setIsRunning(true);
    setResult(null);
    setLogs([]);
    
    addLog(`[KERNEL] Initializing Workflow Node: ${activeMode.toUpperCase()}`, "info");
    
    try {
        const output: McpRunActionOutput = await runMcpAction(
            currentNode.action, 
            currentNode.input_params, 
            language,
            (msg, type) => addLog(msg, type as any)
        );
        
        if (output.success) {
            addLog(`[SYSTEM] Integrity check PASSED. Node cycle complete.`, "success");
            setResult(output.result);
            addToast('success', isZh ? '工作流執行成功' : 'Workflow Execution Success', 'AgenticFlow');
            
            // Effect Global State
            if (activeMode === 'create_agent_task') {
                addAgentTask(currentNode.input_params as any);
            } else if (activeMode === 'update_agent_task') {
                updateAgentTaskStatus(targetTaskId, targetStatus as any);
            }
            
            const rawText = activeMode === 'supplier_carbon_audit' ? output.result.email_body : (activeMode === 'extract_text_from_file' ? output.result.extracted_text : (typeof output.result === 'string' ? output.result : JSON.stringify(output.result, null, 2)));
            const manifested = `## ${activeMode} 執行結果\n\n${activeMode === 'web_scraping' ? output.result.extracted_content : (activeMode === 'supplier_carbon_audit' || activeMode === 'extract_text_from_file' ? rawText : `\`\`\`json\n${rawText}\n\`\`\``)}`;
            addNote(rawText, ['Workflow', activeMode], `Workflow_Result_${Date.now()}`, manifested, undefined, `WorkflowLab`);
        } else {
            addLog(`[SYSTEM] Node execution fault.`, "error");
        }
    } catch (e: any) {
        addLog(`[CRITICAL] Kernel logic breach: ${e.message}`, "error");
    } finally {
        setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Workflow}
            title={{ zh: '工作流實驗室：自動化中樞', en: 'Workflow Lab: Automation Nexus' }}
            description={{ zh: '編排代理人行為：從任務創建、狀態更新到 MCP 協議與 API 整合', en: 'Orchestrate behavior: From task creation, updates to MCP protocols & API integration.' }}
            language={language}
            tag={{ zh: '自動化 v1.2', en: 'WORKFLOW_V1.2' }}
        />

        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/10 w-fit backdrop-blur-xl mb-1 shrink-0 overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveMode('api_workflow')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${activeMode === 'api_workflow' ? 'bg-celestial-blue text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>API_HANDSHAKE</button>
            <button onClick={() => setActiveMode('execute_js_code')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${activeMode === 'execute_js_code' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>JS_EXEC</button>
            <button onClick={() => setActiveMode('web_scraping')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${activeMode === 'web_scraping' ? 'bg-cyan-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>WEB_SCRAPING</button>
            <button onClick={() => setActiveMode('extract_text_from_file')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${activeMode === 'extract_text_from_file' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>OCR_EXTRACT</button>
            <button onClick={() => setActiveMode('create_agent_task')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${activeMode === 'create_agent_task' ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>CREATE_TASK</button>
            <button onClick={() => setActiveMode('update_agent_task')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${activeMode === 'update_agent_task' ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>UPDATE_TASK</button>
            <button onClick={() => setActiveMode('supplier_carbon_audit')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${activeMode === 'supplier_carbon_audit' ? 'bg-celestial-blue text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>SUPPLIER_AUDIT</button>
            <button onClick={() => setActiveMode('agentic_workflow_exec')} className={`px-4 py-1.5 rounded-md text-[10px] font-black transition-all ${activeMode === 'agentic_workflow_exec' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>WORKFLOW_EXEC</button>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-3 min-h-0">
                <div className="flex-1 glass-bento bg-slate-950/80 border-white/5 relative overflow-hidden flex flex-col rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                    
                    <div className="p-5 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex justify-between items-center z-10">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${activeMode === 'api_workflow' ? 'bg-blue-500/20 text-blue-400' : activeMode === 'execute_js_code' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}><Activity className="w-4 h-4" /></div>
                            <span className="zh-main text-xs text-white uppercase tracking-widest">
                                Canvas_Target: {activeMode.toUpperCase()}
                            </span>
                        </div>
                        <button 
                            onClick={handleExecute}
                            disabled={isRunning}
                            className="px-6 py-2 bg-white text-black font-black rounded-lg text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-30"
                        >
                            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                            ACTIVATE_NODE
                        </button>
                    </div>

                    <div className="flex-1 p-6 flex items-center justify-center relative overflow-hidden">
                        <div className="relative group w-full max-w-xl">
                            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/20 to-emerald-600/20 rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-slate-900 border border-white/10 rounded-xl p-8 shadow-2xl flex flex-col gap-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner`}>
                                            {activeMode === 'create_agent_task' ? <Plus className="w-6 h-6" /> : activeMode === 'update_agent_task' ? <ListTodo className="w-6 h-6" /> : activeMode === 'supplier_carbon_audit' ? <Gavel className="w-6 h-6" /> : activeMode === 'agentic_workflow_exec' ? <Zap className="w-6 h-6" /> : activeMode === 'web_scraping' ? <ScrapingIcon className="w-6 h-6" /> : activeMode === 'extract_text_from_file' ? <FileSearch className="w-6 h-6" /> : activeMode === 'execute_js_code' ? <Code2 className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Configuration</div>
                                            <div className="text-base font-bold text-white uppercase tracking-tight">
                                                {activeMode === 'api_workflow' ? 'API Handshake Link' : activeMode === 'create_agent_task' ? 'Create Task' : activeMode === 'update_agent_task' ? 'Update State' : activeMode === 'supplier_carbon_audit' ? 'Supplier Carbon Audit' : activeMode === 'agentic_workflow_exec' ? 'Workflow Execution' : activeMode === 'web_scraping' ? 'Web Scraping Extraction' : activeMode === 'extract_text_from_file' ? 'OCR Text Extraction' : activeMode === 'execute_js_code' ? 'Code Execution (Node.js)' : 'API Linkage'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'}`} />
                                </div>
                                
                                <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                    {activeMode === 'api_workflow' && (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Endpoint_URL</label>
                                                <input value={apiUrl} onChange={e => setApiUrl(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-blue-400 outline-none shadow-inner" placeholder="https://..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">HTTP_Method</label>
                                                <select value={apiMethod} onChange={e => setApiMethod(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none appearance-none cursor-pointer">
                                                    <option value="GET">GET</option>
                                                    <option value="POST">POST</option>
                                                    <option value="PUT">PUT</option>
                                                    <option value="DELETE">DELETE</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Headers (JSON)</label>
                                                <textarea value={apiHeaders} onChange={e => setApiHeaders(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-[10px] font-mono text-gray-300 outline-none shadow-inner h-20 resize-none" placeholder="{}" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Payload_Body (JSON)</label>
                                                <textarea value={apiBody} onChange={e => setApiBody(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-[10px] font-mono text-emerald-400 outline-none shadow-inner h-24 resize-none" placeholder="{}" />
                                            </div>
                                        </div>
                                    )}

                                    {activeMode === 'execute_js_code' && (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">JavaScript_Logic</label>
                                                <textarea value={jsCode} onChange={e => setJsCode(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-[10px] font-mono text-amber-300 outline-none shadow-inner h-40 resize-none" placeholder="// Write logic here..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Input_Params (JSON)</label>
                                                <textarea value={jsInputs} onChange={e => setJsInputs(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-[10px] font-mono text-gray-300 outline-none shadow-inner h-20 resize-none" placeholder="{}" />
                                            </div>
                                        </div>
                                    )}

                                    {activeMode === 'web_scraping' && (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Extraction_URL</label>
                                                <input value={scrapeUrl} onChange={e => setScrapeUrl(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-cyan-400 outline-none shadow-inner" placeholder="Target URL..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Output_Format</label>
                                                    <select value={scrapeFormat} onChange={e => setScrapeFormat(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none appearance-none cursor-pointer">
                                                        <option value="plain text">Plain Text</option>
                                                        <option value="markdown">Markdown</option>
                                                        <option value="json">Structured JSON</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Token_Limit</label>
                                                    <input type="number" value={scrapeLimit} onChange={e => setScrapeLimit(Number(e.target.value))} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none font-mono" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeMode === 'extract_text_from_file' && (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">File_Source_URL</label>
                                                <input value={ocrFileUrl} onChange={e => setOcrFileUrl(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-purple-400 outline-none shadow-inner" placeholder="https://..." />
                                            </div>
                                            <p className="text-[9px] text-gray-500 italic">Supported formats: PDF, JPG, PNG, TIFF. AI performs optical character recognition.</p>
                                        </div>
                                    )}

                                    {activeMode === 'supplier_carbon_audit' && (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Vendor_Legal_Name</label>
                                                <input value={vendorName} onChange={e => setVendorName(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-celestial-blue outline-none shadow-inner" placeholder="Supplier name..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Audit_Standard</label>
                                                    <input value={auditStandard} onChange={e => setAuditStandard(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-[10px] text-white outline-none" placeholder="e.g. GRI 305" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Target_Deadline</label>
                                                    <input value={auditDeadline} onChange={e => setAuditDeadline(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none" placeholder="e.g. 14 Days" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeMode === 'agentic_workflow_exec' && (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Workflow_ID</label>
                                                <input value={workflowId} onChange={e => setWorkflowId(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-indigo-400 outline-none shadow-inner" placeholder="Workflow identifier..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Bearer_Token</label>
                                                <input type="password" value={apiToken} onChange={e => setApiToken(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-gray-300 outline-none shadow-inner" placeholder="Authentication token..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Execution_Parameters (JSON)</label>
                                                <textarea value={workflowParams} onChange={e => setWorkflowParams(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-[10px] font-mono text-emerald-400 outline-none shadow-inner h-24 resize-none" placeholder="{}" />
                                            </div>
                                        </div>
                                    )}

                                    {activeMode === 'create_agent_task' && (
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Directive_Title</label>
                                                <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-emerald-400 outline-none shadow-inner" placeholder="Task title..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Context_Description</label>
                                                <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-gray-300 outline-none shadow-inner h-16 resize-none" placeholder="Description..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Assignee</label>
                                                    <select value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none appearance-none cursor-pointer">
                                                        {availablePersonas.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Due_Date</label>
                                                    <input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeMode === 'update_agent_task' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Task_Identifier</label>
                                                <input value={targetTaskId} onChange={e => setTargetTaskId(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-celestial-gold outline-none shadow-inner" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Status</label>
                                                    <select value={targetStatus} onChange={e => setTargetStatus(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-[10px] text-white outline-none appearance-none cursor-pointer">
                                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                        <option value="COMPLETED">COMPLETED</option>
                                                        <option value="FAILED">FAILED</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Progress</label>
                                                    <input type="number" value={targetProgress} onChange={e => setTargetProgress(Number(e.target.value))} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-xs text-white font-mono outline-none" />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {activeMode === 'mcp_protocol_mgmt' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Protocol_ID</label>
                                                <input value={protocolId} onChange={e => setProtocolId(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-xs font-mono text-emerald-400 outline-none shadow-inner" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Operation</label>
                                                <select value={protocolOp} onChange={e => setProtocolOp(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-[10px] text-white outline-none appearance-none cursor-pointer">
                                                    <option value="SYNC">SYNC</option>
                                                    <option value="VALIDATE">VALIDATE</option>
                                                    <option value="ARCHIVE">ARCHIVE</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">NODE_ID: {currentNode.id}</div>
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/30" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className="h-40 border-t border-white/5 bg-black/60 p-4 flex flex-col gap-2 animate-slide-up">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Execution_Output</h4>
                                <button onClick={() => {handleCopy(activeMode === 'supplier_carbon_audit' ? result.email_body : (activeMode === 'extract_text_from_file' ? result.extracted_text : (typeof result === 'string' ? result : JSON.stringify(result, null, 2))));}} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-gray-500 text-[8px] font-black uppercase">COPY_RAW</button>
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar bg-black/40 rounded-lg border border-white/5 p-3 text-emerald-400 text-[9px] font-mono shadow-inner">
                                {activeMode === 'supplier_carbon_audit' ? (
                                    <div className="whitespace-pre-wrap">{result.email_body}</div>
                                ) : (activeMode === 'web_scraping' ? (
                                    <div className="whitespace-pre-wrap">{result.extracted_content}</div>
                                ) : (activeMode === 'extract_text_from_file' ? (
                                    <div className="whitespace-pre-wrap">{result.extracted_text}</div>
                                ) : (
                                    <pre>{JSON.stringify(result, null, 2)}</pre>
                                )))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 overflow-hidden">
                <div className="glass-bento p-5 flex flex-col bg-slate-900 border border-white/10 rounded-xl shadow-2xl flex-1 overflow-hidden shrink-0">
                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Terminal className="w-4 h-4" /> TELEMETRY_STREAM</h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 font-mono text-[9px] pr-2">
                        {logs.map((l, i) => (
                            <div key={i} className={`flex gap-3 pb-1 border-b border-white/[0.02] ${l.type === 'error' ? 'text-rose-400' : l.type === 'success' ? 'text-emerald-400' : l.type === 'warning' ? 'text-amber-400' : 'text-gray-600'}`}>
                                <span className="shrink-0 opacity-40">[{l.time}]</span>
                                <span>{l.msg}</span>
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>
                <div className="glass-bento p-6 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center gap-3 group hover:border-emerald-500/20 transition-all">
                    <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-8 h-8 text-emerald-500/40" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Context_Alignment</div>
                        <p className="text-[8px] text-gray-600 uppercase leading-relaxed font-mono">Managed protocols ensure <br/> multi-agent synchronization.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
