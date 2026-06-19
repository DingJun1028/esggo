// ESGss JunAiKey - Cognitive Intelligence Services UI/UX (Part 2)
// 認知智能服務剩餘組件

import React, { useState, useEffect, useRef } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
  glassTheme,
  glassAnimations,
} from '../../../components/ui/GlassComponents';
import { DailyESGBriefing, ESGAIAssistant, TrendPredictionEngine } from '../../../types/services';

// ===== 1.3 Daily ESG Briefing =====

interface DailyESGBriefingUIProps {
  data: DailyESGBriefing;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const DailyESGBriefingUI: React.FC<DailyESGBriefingUIProps> = ({
  data,
  theme,
  language,
}) => {
  const colors = glassTheme[theme];
  const [selectedBriefing, setSelectedBriefing] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const translations = {
    'zh-TW': {
      title: '每日ESG簡報',
      dailyBriefing: '每日簡報',
      sentimentAnalysis: '情緒分析',
      recentArticles: '最新文章',
      searchArticles: '搜尋文章',
      filterByCategory: '按類別篩選',
      allCategories: '全部類別',
      positive: '正面',
      negative: '負面',
      neutral: '中性',
      readMore: '閱讀更多',
      relevance: '相關性',
      publishedAt: '發布時間',
      source: '來源',
      keyInsights: '重點洞察',
      impactAssessment: '影響評估',
      markAsRead: '標記為已讀',
      share: '分享',
      save: '儲存',
    },
    en: {
      title: 'Daily ESG Briefing',
      dailyBriefing: 'Daily Briefing',
      sentimentAnalysis: 'Sentiment Analysis',
      recentArticles: 'Recent Articles',
      searchArticles: 'Search Articles',
      filterByCategory: 'Filter by Category',
      allCategories: 'All Categories',
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral',
      readMore: 'Read More',
      relevance: 'Relevance',
      publishedAt: 'Published At',
      source: 'Source',
      keyInsights: 'Key Insights',
      impactAssessment: 'Impact Assessment',
      markAsRead: 'Mark as Read',
      share: 'Share',
      save: 'Save',
    },
  };

  const t = translations[language];

  const latestBriefing = data.briefings[0];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return glassTheme.light.success;
      case 'negative':
        return glassTheme.light.error;
      default:
        return glassTheme.light.warning;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '📈';
      case 'negative':
        return '📉';
      default:
        return '📊';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        color: colors.text,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '20px 24px',
          background: `rgba(255, 255, 255, ${theme === 'light' ? '0.1' : '0.05'})`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '600',
              color: colors.text,
            }}
          >
            {t.title}
          </h1>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <GlassInput
              value={filterCategory}
              onChange={setFilterCategory}
              placeholder={t.searchArticles}
              theme={theme}
              style={{ width: '300px' }}
            />
            <GlassButton theme={theme} variant="secondary">
              🔄
            </GlassButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        style={{
          padding: '24px',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '24px',
        }}
      >
        {/* Left Sidebar - Sentiment Analysis */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Today's Briefing Card */}
          {latestBriefing && (
            <GlassCard theme={theme} style={{ padding: '24px' }}>
              <h3
                style={{
                  margin: '0 0 16px 0',
                  color: colors.text,
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                {new Date(latestBriefing.date).toLocaleDateString(
                  language === 'zh-TW' ? 'zh-TW' : 'en',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </h3>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: colors.accent,
                  marginBottom: '12px',
                  lineHeight: '1.3',
                }}
              >
                {latestBriefing.headline}
              </div>
              <p
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  color: colors.textSecondary,
                  lineHeight: '1.5',
                }}
              >
                {latestBriefing.summary}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {latestBriefing.keyInsights.slice(0, 3).map((insight, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 8px',
                      background: `${colors.accent}33`,
                      color: colors.accent,
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    {insight}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Sentiment Analysis */}
          <GlassCard theme={theme} style={{ padding: '24px' }}>
            <h3
              style={{
                margin: '0 0 16px 0',
                color: colors.text,
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              {t.sentimentAnalysis}
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {Object.entries(data.sentimentAnalysis.byCategory).map(([category, score]) => (
                <div
                  key={category}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                  }}
                >
                  <span
                    style={{
                      color: colors.text,
                      fontSize: '14px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {category}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '60px',
                        height: '6px',
                        background: `${colors.border}`,
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.abs(score) * 100}%`,
                          height: '100%',
                          background: score > 0 ? colors.success : colors.error,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        color: colors.textSecondary,
                        minWidth: '30px',
                      }}
                    >
                      {(score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                background: `${colors.accent}33`,
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: colors.accent,
                  marginBottom: '4px',
                }}
              >
                {getSentimentIcon(
                  data.sentimentAnalysis.overall > 0.1
                    ? 'positive'
                    : data.sentimentAnalysis.overall < -0.1
                      ? 'negative'
                      : 'neutral'
                )}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: colors.text,
                  fontWeight: '500',
                }}
              >
                {data.sentimentAnalysis.overall > 0.1
                  ? t.positive
                  : data.sentimentAnalysis.overall < -0.1
                    ? t.negative
                    : t.neutral}
              </div>
            </div>
          </GlassCard>
        </aside>

        {/* Right Content - Articles */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                margin: 0,
                color: colors.text,
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              {t.recentArticles}
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              {['all', 'environmental', 'social', 'governance'].map(category => (
                <GlassButton
                  key={category}
                  theme={theme}
                  variant={filterCategory === category ? 'primary' : 'ghost'}
                  onClick={() => setFilterCategory(category)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  {category === 'all' ? t.allCategories : category}
                </GlassButton>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div
            style={{
              display: 'grid',
              gap: '16px',
            }}
          >
            {latestBriefing?.articles
              .filter(article => filterCategory === 'all' || true) // Add actual filtering logic
              .map(article => (
                <GlassCard
                  key={article.id}
                  theme={theme}
                  hover={true}
                  clickable={true}
                  onClick={() => setSelectedBriefing(article.id)}
                  style={{ padding: '20px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          margin: '0 0 8px 0',
                          color: colors.text,
                          fontSize: '16px',
                          fontWeight: '600',
                          lineHeight: '1.3',
                        }}
                      >
                        {article.title}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '12px',
                          color: colors.textSecondary,
                        }}
                      >
                        <span>
                          {t.source}: {article.source}
                        </span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '20px',
                        }}
                      >
                        {getSentimentIcon(article.sentiment)}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: getSentimentColor(article.sentiment),
                          fontWeight: '500',
                        }}
                      >
                        {article.sentiment === 'positive'
                          ? t.positive
                          : article.sentiment === 'negative'
                            ? t.negative
                            : t.neutral}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      color: colors.textSecondary,
                      lineHeight: '1.5',
                    }}
                  >
                    {article.summary}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {article.keywords.slice(0, 3).map((keyword, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '2px 6px',
                            background: `${colors.border}66`,
                            color: colors.textSecondary,
                            borderRadius: '8px',
                            fontSize: '10px',
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <GlassButton
                        theme={theme}
                        variant="ghost"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        {t.markAsRead}
                      </GlassButton>
                      <GlassButton
                        theme={theme}
                        variant="ghost"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        {t.save}
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
          </div>
        </section>
      </main>

      {/* Article Detail Modal */}
      {selectedBriefing && (
        <GlassModal
          isOpen={!!selectedBriefing}
          onClose={() => setSelectedBriefing(null)}
          theme={theme}
          size="lg"
        >
          <div
            style={{
              color: colors.text,
            }}
          >
            {/* Modal content would go here */}
            <h2>Article Detail</h2>
            <p>Full article content for {selectedBriefing}</p>
          </div>
        </GlassModal>
      )}
    </div>
  );
};

// ===== 1.4 ESG AI Assistant =====

interface ESGAIAssistantUIProps {
  data: ESGAIAssistant;
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'en';
}

export const ESGAIAssistantUI: React.FC<ESGAIAssistantUIProps> = ({ data, theme, language }) => {
  const colors = glassTheme[theme];
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const translations = {
    'zh-TW': {
      title: 'ESG智能助手',
      newConversation: '新對話',
      askQuestion: '請問您關於ESG的任何問題...',
      sendMessage: '發送訊息',
      typing: 'AI正在思考...',
      suggestedQuestions: '建議問題',
      recentConversations: '最近對話',
      clearHistory: '清除歷史',
      copy: '複製',
      regenerate: '重新生成',
      helpful: '有幫助',
      notHelpful: '沒有幫助',
    },
    en: {
      title: 'ESG AI Assistant',
      newConversation: 'New Conversation',
      askQuestion: 'Ask me anything about ESG...',
      sendMessage: 'Send Message',
      typing: 'AI is thinking...',
      suggestedQuestions: 'Suggested Questions',
      recentConversations: 'Recent Conversations',
      clearHistory: 'Clear History',
      copy: 'Copy',
      regenerate: 'Regenerate',
      helpful: 'Helpful',
      notHelpful: 'Not Helpful',
    },
  };

  const t = translations[language];

  const suggestedQuestions = [
    '如何制定ESG策略？',
    '什麼是Scope 3排放？',
    '如何改善員工福利？',
    '董事會多樣性為何重要？',
    '如何進行ESG風險評估？',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation, isTyping]);

  const activeConversation =
    data.conversations.find(c => c.id === currentConversation) || data.conversations[0];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          theme === 'light'
            ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
            : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '20px 24px',
          background: `rgba(255, 255, 255, ${theme === 'light' ? '0.1' : '0.05'})`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '600',
              color: colors.text,
            }}
          >
            {t.title}
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <GlassButton theme={theme} variant="secondary">
              {t.clearHistory}
            </GlassButton>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Sidebar - Conversations */}
        <aside
          style={{
            width: '300px',
            padding: '24px',
            borderRight: `1px solid ${colors.border}`,
            background: `rgba(255, 255, 255, ${theme === 'light' ? '0.03' : '0.01'})`,
          }}
        >
          <GlassButton
            theme={theme}
            variant="primary"
            onClick={() => setCurrentConversation('new')}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {t.newConversation}
          </GlassButton>

          <div style={{ marginBottom: '20px' }}>
            <h3
              style={{
                margin: '0 0 12px 0',
                color: colors.text,
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {t.suggestedQuestions}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestedQuestions.map((question, index) => (
                <GlassCard
                  key={index}
                  theme={theme}
                  hover={true}
                  clickable={true}
                  onClick={() => setMessage(question)}
                  style={{ padding: '12px', cursor: 'pointer' }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: colors.textSecondary,
                      lineHeight: '1.4',
                    }}
                  >
                    {question}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          <div>
            <h3
              style={{
                margin: '0 0 12px 0',
                color: colors.text,
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {t.recentConversations}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.conversations.slice(0, 5).map(conversation => (
                <GlassCard
                  key={conversation.id}
                  theme={theme}
                  hover={true}
                  clickable={true}
                  onClick={() => setCurrentConversation(conversation.id)}
                  style={{ padding: '12px' }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: colors.text,
                      fontWeight: '500',
                      marginBottom: '4px',
                    }}
                  >
                    {conversation.messages[0]?.content.slice(0, 30)}...
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: colors.textSecondary,
                    }}
                  >
                    {new Date(conversation.startedAt).toLocaleDateString()}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat Messages */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
          }}
        >
          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflowY: 'auto',
              marginBottom: '20px',
            }}
          >
            {activeConversation?.messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <GlassCard
                  theme={theme}
                  style={{
                    padding: '16px',
                    maxWidth: '70%',
                    background:
                      msg.role === 'user'
                        ? `${colors.accent}33`
                        : `rgba(255, 255, 255, ${theme === 'light' ? '0.05' : '0.02'})`,
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: colors.text,
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '8px',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        color: colors.textSecondary,
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    {msg.role === 'assistant' && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <GlassButton
                          theme={theme}
                          variant="ghost"
                          style={{ padding: '2px 6px', fontSize: '10px' }}
                        >
                          {t.copy}
                        </GlassButton>
                        <GlassButton
                          theme={theme}
                          variant="ghost"
                          style={{ padding: '2px 6px', fontSize: '10px' }}
                        >
                          {t.regenerate}
                        </GlassButton>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <GlassCard theme={theme} style={{ padding: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: colors.accent,
                        animation: 'pulse 1.4s infinite ease-in-out',
                        animationDelay: '0s',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: colors.accent,
                        animation: 'pulse 1.4s infinite ease-in-out',
                        animationDelay: '0.2s',
                      }}
                    />
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: colors.accent,
                        animation: 'pulse 1.4s infinite ease-in-out',
                        animationDelay: '0.4s',
                      }}
                    />
                    <span
                      style={{
                        marginLeft: '8px',
                        fontSize: '12px',
                        color: colors.textSecondary,
                      }}
                    >
                      {t.typing}
                    </span>
                  </div>
                </GlassCard>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <GlassCard theme={theme} style={{ padding: '16px' }}>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end',
              }}
            >
              <div style={{ flex: 1 }}>
                <GlassInput
                  value={message}
                  onChange={setMessage}
                  placeholder={t.askQuestion}
                  theme={theme}
                  disabled={isTyping}
                />
              </div>
              <GlassButton
                theme={theme}
                variant="primary"
                disabled={!message.trim() || isTyping}
                onClick={() => {
                  if (message.trim()) {
                    // Handle sending message
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 2000);
                    setMessage('');
                  }
                }}
              >
                {t.sendMessage}
              </GlassButton>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
};

export default {
  DailyESGBriefingUI,
  ESGAIAssistantUI,
};
