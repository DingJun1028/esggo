import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Users,
  Vote,
  Shield,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Gavel,
  Star,
  Target,
  Activity,
  Zap,
  Eye,
  Settings,
  Play,
  Pause,
  ChevronDown,
  ChevronRight,
  User,
  Bot,
  Building2,
  Globe
} from 'lucide-react';
import { Language } from '../../types';
import { UniversalAgentContext } from '../../contexts/UniversalAgentContext';

interface CouncilMember {
  id: string;
  name: string;
  role: 'chair' | 'senior' | 'member' | 'observer';
  type: 'human' | 'ai' | 'system';
  organization: string;
  votingPower: number;
  reputation: number;
  specialties: string[];
  status: 'active' | 'inactive' | 'suspended';
}

interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  type: 'policy' | 'technical' | 'strategic' | 'emergency';
  status: 'draft' | 'review' | 'voting' | 'passed' | 'rejected' | 'implemented';
  votes: {
    yes: number;
    no: number;
    abstain: number;
  };
  deadline: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  affectedSystems: string[];
}

interface GalacticBriefing {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'security' | 'performance' | 'compliance' | 'strategic';
  description: string;
  timestamp: number;
  source: string;
  actions: string[];
  status: 'new' | 'acknowledged' | 'in_progress' | 'resolved';
}

interface SystemMetrics {
  sovereignty: number;
  consensus: number;
  execution: number;
  adaptation: number;
  threats: number;
}

const CouncilAssembly: React.FC<{
  members: CouncilMember[];
  language: Language;
}> = ({ members, language }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'chair': return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'senior': return <Star className="w-5 h-5 text-purple-400" />;
      case 'member': return <Users className="w-5 h-5 text-blue-400" />;
      case 'observer': return <Eye className="w-5 h-5 text-gray-400" />;
      default: return <User className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'human': return <User className="w-4 h-4" />;
      case 'ai': return <Bot className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-yellow-400';
      case 'suspended': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-bold">
            {language === 'zh-TW' ? '代理人議會' : 'AGENT COUNCIL'}
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {members.length} {language === 'zh-TW' ? '成員' : 'members'}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {members.map((member) => (
          <motion.div
            key={member.id}
            className="flex items-center justify-between p-3 rounded border border-gray-600 hover:border-gray-500 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              {getRoleIcon(member.role)}
              <div className="flex items-center gap-2">
                {getTypeIcon(member.type)}
                <div>
                  <div className="text-white font-medium">{member.name}</div>
                  <div className="text-sm text-gray-400">{member.organization}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-yellow-400">
                  {member.votingPower} VP
                </div>
                <div className="text-xs text-gray-400">
                  Rep: {member.reputation}
                </div>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                member.status === 'active' ? 'bg-green-500/20 text-green-400' :
                member.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {member.status.toUpperCase()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const GovernanceProposals: React.FC<{
  proposals: GovernanceProposal[];
  language: Language;
}> = ({ proposals, language }) => {
  const [expandedProposal, setExpandedProposal] = useState<string | null>(null);

  const getProposalTypeColor = (type: string) => {
    switch (type) {
      case 'policy': return 'text-blue-400 border-blue-400/30';
      case 'technical': return 'text-green-400 border-green-400/30';
      case 'strategic': return 'text-purple-400 border-purple-400/30';
      case 'emergency': return 'text-red-400 border-red-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400';
      case 'review': return 'text-yellow-400';
      case 'voting': return 'text-blue-400';
      case 'passed': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      case 'implemented': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const calculateVotePercentage = (votes: { yes: number; no: number; abstain: number }) => {
    const total = votes.yes + votes.no + votes.abstain;
    if (total === 0) return { yes: 0, no: 0, abstain: 0 };
    return {
      yes: Math.round((votes.yes / total) * 100),
      no: Math.round((votes.no / total) * 100),
      abstain: Math.round((votes.abstain / total) * 100)
    };
  };

  return (
    <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-bold">
            {language === 'zh-TW' ? '治理提案' : 'GOVERNANCE PROPOSALS'}
          </span>
        </div>
        <span className="text-sm text-gray-400">
          {proposals.length} {language === 'zh-TW' ? '提案' : 'proposals'}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {proposals.map((proposal) => (
          <motion.div
            key={proposal.id}
            className={`border rounded-lg overflow-hidden cursor-pointer ${getProposalTypeColor(proposal.type)}`}
            whileHover={{ scale: 1.01 }}
            onClick={() => setExpandedProposal(
              expandedProposal === proposal.id ? null : proposal.id
            )}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {expandedProposal === proposal.id ? (
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                  )}
                  <span className="text-white font-medium">{proposal.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(proposal.priority)}`}>
                    {proposal.priority.toUpperCase()}
                  </span>
                  <span className={`text-xs font-bold ${getStatusColor(proposal.status)}`}>
                    {proposal.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-300 mb-2">
                {language === 'zh-TW' ? '提案者' : 'Proposer'}: {proposal.proposer}
              </div>

              {proposal.status === 'voting' && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span className="text-green-400">{proposal.votes.yes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span className="text-red-400">{proposal.votes.no}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <span className="text-gray-400">{proposal.votes.abstain}</span>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {expandedProposal === proposal.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 pb-3 border-t border-gray-600"
                >
                  <div className="pt-3">
                    <p className="text-sm text-gray-300 mb-3">{proposal.description}</p>

                    <div className="text-xs text-gray-400 mb-2">
                      {language === 'zh-TW' ? '受影響系統' : 'Affected Systems'}:
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {proposal.affectedSystems.map((system) => (
                        <span
                          key={system}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                        >
                          {system}
                        </span>
                      ))}
                    </div>

                    {proposal.status === 'voting' && (
                      <div>
                        <div className="text-xs text-gray-400 mb-2">
                          {language === 'zh-TW' ? '投票進度' : 'Voting Progress'}:
                        </div>
                        <div className="space-y-1">
                          {(() => {
                            const percentages = calculateVotePercentage(proposal.votes);
                            return (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 text-xs text-green-400">Yes: {percentages.yes}%</div>
                                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-green-400 h-2 rounded-full"
                                      style={{ width: `${percentages.yes}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 text-xs text-red-400">No: {percentages.no}%</div>
                                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-red-400 h-2 rounded-full"
                                      style={{ width: `${percentages.no}%` }}
                                    />
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const GalacticSituationRoom: React.FC<{
  briefings: GalacticBriefing[];
  metrics: SystemMetrics;
  language: Language;
}> = ({ briefings, metrics, language }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'performance': return <Activity className="w-4 h-4" />;
      case 'compliance': return <Gavel className="w-4 h-4" />;
      case 'strategic': return <Target className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 70) return 'text-yellow-400';
    if (value >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-400 font-bold">
            {language === 'zh-TW' ? '系統主權指標' : 'SYSTEM SOVEREIGNTY METRICS'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'sovereignty', label: language === 'zh-TW' ? '主權' : 'Sovereignty', value: metrics.sovereignty },
            { key: 'consensus', label: language === 'zh-TW' ? '共識' : 'Consensus', value: metrics.consensus },
            { key: 'execution', label: language === 'zh-TW' ? '執行' : 'Execution', value: metrics.execution },
            { key: 'adaptation', label: language === 'zh-TW' ? '適應' : 'Adaptation', value: metrics.adaptation },
            { key: 'threats', label: language === 'zh-TW' ? '威脅' : 'Threats', value: metrics.threats }
          ].map((metric) => (
            <div key={metric.key} className="text-center">
              <div className={`text-2xl font-bold ${getMetricColor(metric.value)}`}>
                {metric.value}%
              </div>
              <div className="text-xs text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Galactic Briefings */}
      <div className="bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-bold">
              {language === 'zh-TW' ? '星系戰情室' : 'GALACTIC SITUATION ROOM'}
            </span>
          </div>
          <span className="text-sm text-gray-400">
            {briefings.filter(b => b.status === 'new').length} {language === 'zh-TW' ? '新簡報' : 'new briefings'}
          </span>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {briefings.map((briefing) => (
            <motion.div
              key={briefing.id}
              className={`p-3 rounded border ${getSeverityColor(briefing.severity)}`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(briefing.category)}
                  <span className="text-white font-medium">{briefing.title}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  briefing.status === 'new' ? 'bg-red-500/20 text-red-400' :
                  briefing.status === 'acknowledged' ? 'bg-yellow-500/20 text-yellow-400' :
                  briefing.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {briefing.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-2">{briefing.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{briefing.source}</span>
                <span>{new Date(briefing.timestamp).toLocaleString()}</span>
              </div>

              {briefing.actions.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-400 mb-1">
                    {language === 'zh-TW' ? '建議行動' : 'Recommended Actions'}:
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    {briefing.actions.slice(0, 2).map((action, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OmniSovereignGovernance: React.FC<{ language: Language }> = ({ language }) => {
  const [councilMembers] = useState<CouncilMember[]>([
    {
      id: 'cm1',
      name: 'Dr. Sophia Chen',
      role: 'chair',
      type: 'human',
      organization: 'Global Sustainability Institute',
      votingPower: 100,
      reputation: 2500,
      specialties: ['ESG Strategy', 'Stakeholder Engagement'],
      status: 'active'
    },
    {
      id: 'cm2',
      name: 'AI Council Member Alpha',
      role: 'senior',
      type: 'ai',
      organization: 'Quantum Intelligence Labs',
      votingPower: 80,
      reputation: 2100,
      specialties: ['Algorithm Governance', 'Risk Assessment'],
      status: 'active'
    },
    {
      id: 'cm3',
      name: 'Marcus Rodriguez',
      role: 'member',
      type: 'human',
      organization: 'International Business Council',
      votingPower: 60,
      reputation: 1800,
      specialties: ['Corporate Governance', 'Compliance'],
      status: 'active'
    },
    {
      id: 'cm4',
      name: 'System Governance Core',
      role: 'observer',
      type: 'system',
      organization: 'ESGss Platform',
      votingPower: 40,
      reputation: 1500,
      specialties: ['System Security', 'Protocol Compliance'],
      status: 'active'
    }
  ]);

  const [proposals] = useState<GovernanceProposal[]>([
    {
      id: 'p1',
      title: language === 'zh-TW' ? '強化AI倫理治理框架' : 'Strengthen AI Ethics Governance Framework',
      description: language === 'zh-TW'
        ? '建立更嚴格的AI系統倫理審查和決策透明度要求'
        : 'Establish stricter ethical review and decision transparency requirements for AI systems',
      proposer: 'Dr. Sophia Chen',
      type: 'policy',
      status: 'voting',
      votes: { yes: 156, no: 23, abstain: 12 },
      deadline: Date.now() + 86400000 * 7,
      priority: 'high',
      affectedSystems: ['AI Agents', 'Decision Making', 'Data Privacy']
    },
    {
      id: 'p2',
      title: language === 'zh-TW' ? '區塊鏈整合升級' : 'Blockchain Integration Upgrade',
      description: language === 'zh-TW'
        ? '升級區塊鏈基礎設施以支援更高安全性與效能'
        : 'Upgrade blockchain infrastructure for higher security and performance',
      proposer: 'AI Council Member Alpha',
      type: 'technical',
      status: 'review',
      votes: { yes: 0, no: 0, abstain: 0 },
      deadline: Date.now() + 86400000 * 14,
      priority: 'medium',
      affectedSystems: ['Blockchain', 'Smart Contracts', 'Asset Management']
    }
  ]);

  const [galacticBriefings] = useState<GalacticBriefing[]>([
    {
      id: 'gb1',
      title: language === 'zh-TW' ? '關鍵基礎設施安全威脅' : 'Critical Infrastructure Security Threat',
      severity: 'high',
      category: 'security',
      description: language === 'zh-TW'
        ? '偵測到針對關鍵ESG數據基礎設施的潛在網路攻擊'
        : 'Potential cyber attack detected against critical ESG data infrastructure',
      timestamp: Date.now() - 3600000,
      source: 'Security Monitoring System',
      actions: [
        language === 'zh-TW' ? '啟動緊急安全協議' : 'Activate emergency security protocols',
        language === 'zh-TW' ? '通知相關利益相關者' : 'Notify relevant stakeholders',
        language === 'zh-TW' ? '執行系統隔離措施' : 'Execute system isolation measures'
      ],
      status: 'acknowledged'
    },
    {
      id: 'gb2',
      title: language === 'zh-TW' ? '全球法規變化影響評估' : 'Global Regulatory Change Impact Assessment',
      severity: 'medium',
      category: 'compliance',
      description: language === 'zh-TW'
        ? '歐盟CSRD新規將顯著影響報告要求和合規成本'
        : 'EU CSRD new regulations will significantly impact reporting requirements and compliance costs',
      timestamp: Date.now() - 7200000,
      source: 'Regulatory Intelligence',
      actions: [
        language === 'zh-TW' ? '評估影響範圍' : 'Assess impact scope',
        language === 'zh-TW' ? '制定適應策略' : 'Develop adaptation strategy',
        language === 'zh-TW' ? '更新系統配置' : 'Update system configurations'
      ],
      status: 'in_progress'
    }
  ]);

  const [systemMetrics] = useState<SystemMetrics>({
    sovereignty: 87,
    consensus: 92,
    execution: 78,
    adaptation: 85,
    threats: 23
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {language === 'zh-TW' ? '全向主權治理' : 'OMNI-SOVEREIGN GOVERNANCE'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {language === 'zh-TW'
              ? '代理人議會與星系戰情室的統一治理生態'
              : 'Unified governance ecosystem of agent council and galactic situation room'
            }
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CouncilAssembly members={councilMembers} language={language} />
          <GovernanceProposals proposals={proposals} language={language} />
        </div>

        {/* Galactic Situation Room */}
        <GalacticSituationRoom
          briefings={galacticBriefings}
          metrics={systemMetrics}
          language={language}
        />

        {/* Action Panels */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <motion.div
            className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Vote className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '提案管理' : 'PROPOSAL MANAGEMENT'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '建立和管理治理提案'
                : 'Create and manage governance proposals'
              }
            </p>
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '新建提案' : 'CREATE PROPOSAL'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '安全監控' : 'SECURITY MONITORING'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '即時威脅偵測與回應'
                : 'Real-time threat detection and response'
              }
            </p>
            <motion.button
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '查看威脅' : 'VIEW THREATS'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '效能指標' : 'PERFORMANCE METRICS'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '追蹤治理效能指標'
                : 'Track governance performance metrics'
              }
            </p>
            <motion.button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '查看指標' : 'VIEW METRICS'}
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border border-yellow-500/30 rounded-lg p-6 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <MessageSquare className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {language === 'zh-TW' ? '議會通訊' : 'COUNCIL COMMUNICATION'}
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'zh-TW'
                ? '議會成員間的協作平台'
                : 'Collaboration platform for council members'
              }
            </p>
            <motion.button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'zh-TW' ? '開啟通訊' : 'OPEN COMMUNICATION'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OmniSovereignGovernance;