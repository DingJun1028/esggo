import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  Brain,
  Cpu,
  Settings,
  X,
  Terminal,
  Activity,
  Wifi,
  Battery,
  Database,
  Lock,
  Shield,
  Eye,
  Code,
  Command,
  TrendingUp,
} from 'lucide-react';
import { useESGStore } from '@/store/useESGStore';
import { useOmniResonance } from '@/5-store/useOmniResonance';

// Interface Definitions
export interface ChatMessage {
  id: string;
  role: 'user' | 'system';
  content: string;
  timestamp: number;
  type: 'text' | 'code' | 'alert';
}

export interface SystemStats {
  cpu: number;
  memory: number;
  network: 'STABLE' | 'UNSTABLE';
  security: 'SECURE' | 'AT_RISK';
}

// Main Component
export const AIAgentTerminal: React.FC = () => {
  const { totalCO2e, itEnergyKWh, anchoredCount } = useESGStore();
  const { resonance, itkTotal } = useOmniResonance();
  // Mock vitals since omniIntelligence was commented out/missing
  const vitals = { hypercube: { tesseractSync: 75, benevolenceBias: 0.85 } };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys-init',
      role: 'system',
      content: 'SYSTEM INITIALIZED...\n> LOADING CORE MODULES [██████████] 100%\n> NEURAL LINK ESTABLISHED.\n> WAITING FOR USER INPUT...',
      timestamp: Date.now(),
      type: 'code',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    cpu: 12,
    memory: 34,
    network: 'STABLE',
    security: 'SECURE',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate System Stats Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: Math.floor(Math.random() * 20) + 30,
        network: Math.random() > 0.95 ? 'UNSTABLE' : 'STABLE',
        security: 'SECURE',
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
      type: 'text',
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate AI Response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `sys-${Date.now()}`,
        role: 'system',
        content: generateAIResponse(newUserMessage.content),
        timestamp: Date.now(),
        type: Math.random() > 0.7 ? 'code' : 'text',
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1200);
  };

  const generateAIResponse = (input: string) => {
    const lowerInput = input.toLowerCase();

    // Report / Status / Stats
    if (lowerInput.includes('report') || lowerInput.includes('status') || lowerInput.includes('stats') || input.includes('?勗?') || input.includes('??') || input.includes('數據')) {
      return `> ANALYZING LIVE DATA STREAMS...\n> ECO_SYSTEM_CONNECTED: TRUE\n\n- Total Carbon Offset: ${totalCO2e.toFixed(1)} tCO2e\n- IT Energy Consumption: ${itEnergyKWh.toFixed(1)} kWh\n- Anchored Blocks: ${anchoredCount}\n\nSystem Resonance: ${(resonance * 100).toFixed(1)}%\nReady for JAK Protocol interaction.`;
    }

    // Risk / Monitor / Audit
    if (lowerInput.includes('risk') || lowerInput.includes('monitor') || lowerInput.includes('audit') || input.includes('憸券') || input.includes('?梢') || input.includes('?賣?')) {
      const riskLevel = itEnergyKWh > 1000 ? 'HIGH' : 'STABLE';
      return `> MONITORING SYSTEM ENTROPY...\n> STATUS: ${riskLevel}\n\nIT Energy Audit: ${itEnergyKWh.toFixed(1)} kWh\n${riskLevel === 'HIGH' ? 'WARNING: High energy consumption detected. Suggest optimization protocols.' : 'System operating within normal parameters.'}`;
    }

    // Hypercube / Protocol / v7
    if (lowerInput.includes('hypercube') || lowerInput.includes('protocol') || lowerInput.includes('v7') || input.includes('頞??') || input.includes('驗證')) {
      const hyperSync = vitals.hypercube?.tesseractSync || 0;
      return `> ACCESSING HYPERCUBE CORE...\n> TESSERACT_SYNC: ${hyperSync.toFixed(2)}%\n\nHypercube Protocol (v7.0) Active.\n16-dimensional Tensor Array initialized.\nBenevolence Bias: ${vitals.hypercube?.benevolenceBias || 0.5}\nReady for quantum entanglement.`;
    }

    return `> INPUT RECEIVED: "${input}"\n> PROCESSING VIA HYPER-NEURAL LINK...\n\nAcknowledged. v7.0 Neural Core operational.\nTesseract Sync: ${(vitals.hypercube?.tesseractSync || 0).toFixed(1)}%\nModules Active.`;
  };

  return (
    <div className="flex h-full bg-black font-mono text-green-500 overflow-hidden relative">
      {/* Background Matrix/Cyberpunk Effect */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url(${atob('aHR0cHM6Ly9tZWRpYS5naXBoeS5jb20vbWVkaWEvbzB2d3p1RndDR0FGTy9naXBoeS5naWY=')})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen' }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/80 to-black pointer-events-none" />

      {/* HUD Sidebar */}
      <div className="w-64 border-r border-green-900/50 bg-black/80 backdrop-blur-sm p-4 hidden md:flex flex-col gap-6 z-10">
        <div className="border border-green-500/30 p-4 rounded-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-green-400">
            <Bot size={24} /> JARVIS.AI
          </h2>
          <div className="text-[10px] text-green-600">VER 4.2.0 [STABLE]</div>
        </div>

        <div className="space-y-4">
          <StatusItem
            icon={<Cpu />}
            label="TESSERACT"
            value={`${(vitals.hypercube?.tesseractSync || 0).toFixed(1)}%`}
            alert={resonance < 0.3}
          />
          <StatusItem
            icon={<Database />}
            label="ITK MINTED"
            value={`${(itkTotal || 0).toLocaleString()}`}
          />
          <StatusItem
            icon={<TrendingUp />}
            label="RESONANCE"
            value={`${(resonance * 100).toFixed(1)}%`}
            alert={false}
          />
          <StatusItem icon={<Shield />} label="EVO_STAGE" value="v7.0 HYPER" />
        </div>

        <div className="mt-auto border-t border-green-900/50 pt-4">
          <div className="text-xs text-green-700 mb-2">ACTIVE MODULES</div>
          <div className="flex flex-wrap gap-2">
            <ModuleBadge label="NLP" />
            <ModuleBadge label="VISION" />
            <ModuleBadge label="PREDICT" />
            <ModuleBadge label="SECURE" />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="h-14 border-b border-green-900/50 flex items-center justify-between px-6 bg-black/90 backdrop-blur">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600">SESSION_ID:</span>
            <span className="text-green-300 font-bold tracking-widest">
              {Date.now().toString(36).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            ONLINE
          </div>
        </header>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-green-500 text-sm animate-pulse pl-2">
              <Activity size={16} />
              <span>JARVIS IS THINKING...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="h-20 border-t border-green-900/50 bg-black p-4">
          <div className="flex items-center gap-4 h-full bg-green-900/10 border border-green-500/30 rounded px-4 hover:border-green-500/60 transition-colors">
            <Terminal size={20} className="text-green-600" />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type command / ask question..."
              className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-800 font-mono"
              autoFocus
            />
            <button
              onClick={handleSendMessage}
              className="text-green-600 hover:text-green-400 disabled:opacity-50 transition-colors"
              disabled={!inputValue}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components

const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const isSys = msg.role === 'system';

  return (
    <motion.div
      initial={{ opacity: 0, x: isSys ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex ${isSys ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`max-w-3xl flex gap-4 ${isSys ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 ${isSys
              ? 'border-green-500 bg-green-900/20 text-green-400'
              : 'border-blue-500 bg-blue-900/20 text-blue-400'
            }`}
        >
          {isSys ? <Bot size={16} /> : <Eye size={16} />}
        </div>

        {/* Content Box */}
        <div
          className={`p-4 rounded-lg border text-sm relative overflow-hidden ${isSys
              ? 'border-green-800 bg-green-950/30 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
              : 'border-blue-800 bg-blue-950/30 text-blue-100'
            }`}
        >
          {/* Accent Line */}
          <div
            className={`absolute top-0 w-8 h-0.5 ${isSys ? 'bg-green-500 left-0' : 'bg-blue-500 right-0'}`}
          />

          {/* Text */}
          <div className="whitespace-pre-wrap leading-relaxed">
            {msg.type === 'code' ? (
              <div className="font-mono text-xs opacity-90 border-l-2 border-green-600 pl-2">
                {msg.content}
              </div>
            ) : (
              msg.content
            )}
          </div>

          {/* Timestamp */}
          <div className="text-[10px] mt-2 opacity-40 font-mono flex justify-end">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatusItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  alert?: boolean;
}> = ({ icon, label, value, alert }) => (
  <div className="flex items-center gap-3 text-xs">
    <div
      className={`p-1.5 rounded bg-green-900/20 ${alert ? 'text-red-500 animate-pulse' : 'text-green-600'}`}
    >
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-green-800 font-bold tracking-wider mb-0.5">{label}</div>
      <div className={`font-mono ${alert ? 'text-red-400' : 'text-green-300'}`}>{value}</div>
    </div>
  </div>
);

const ModuleBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-2 py-1 text-[10px] border border-green-700 text-green-500 rounded bg-green-900/10">
    {label}
  </span>
);
