/**
 * 覺醒事件時間線
 * Awakening Event Timeline Visualization
 */

import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Radio, Zap } from 'lucide-react';
import { awakeningBroadcaster } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster';

interface TimelineEvent {
  id: string;
  type: string;
  timestamp: string;
  phase?: string;
  message?: string;
  priority?: string;
}

export const AwakeningEventTimeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // 訂閱實時事件
    const unsubscribeEvents = awakeningBroadcaster.subscribe(event => {
      addEvent({
        id: crypto.randomUUID(),
        type: event.type,
        timestamp: event.timestamp,
        phase: event.data?.phase,
        message:
          event.data.error ||
          (event.data.serviceName ? `Service: ${event.data.serviceName}` : undefined) ||
          (event.data.phase ? `Phase: ${event.data.phase}` : 'System Event'),
      });
      setIsLive(true);
      setTimeout(() => setIsLive(false), 500);
    });

    const unsubscribeInsights = awakeningBroadcaster.subscribeToInsights(insight => {
      addEvent({
        id: crypto.randomUUID(),
        type: 'insight',
        timestamp: new Date().toISOString(),
        message: `${insight.title}: ${insight.message}`,
        priority: insight.priority,
      });
    });

    // 載入歷史事件
    loadHistoricalEvents();

    return () => {
      unsubscribeEvents();
      unsubscribeInsights();
    };
  }, []);

  const loadHistoricalEvents = () => {
    try {
      const history = awakeningBroadcaster.getEventHistory(10);
      const insights = awakeningBroadcaster.getInsights(5);

      const combined = [
        ...history.map(h => ({
          id: crypto.randomUUID(),
          type: h.type,
          timestamp: h.timestamp,
          phase: h.data?.phase,
        })),
        ...insights.map(i => ({
          id: i.id,
          type: 'insight',
          timestamp: i.timestamp,
          message: `${i.title}: ${i.message}`,
          priority: i.priority,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setEvents(combined.slice(0, 15));
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[AwakeningEventTimeline] Failed to load historical events:', { error })
    }
  };

  const addEvent = (event: TimelineEvent) => {
    setEvents(prev => [event, ...prev].slice(0, 15));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'phase-changed':
        return <Radio className="w-4 h-4" />;
      case 'awakening-completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'service-awakened':
        return <Zap className="w-4 h-4" />;
      case 'insight':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string, priority?: string) => {
    if (type === 'insight') {
      switch (priority) {
        case 'critical':
          return 'text-red-400 bg-red-500/10 border-red-500/20';
        case 'high':
          return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
        case 'medium':
          return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        default:
          return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      }
    }

    switch (type) {
      case 'awakening-completed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'phase-changed':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'service-awakened':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="glass-panel-premium p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          事件時間線
        </h3>
        {isLive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full"
          >
            <motion.div
              className="w-2 h-2 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs text-red-400 font-medium">LIVE</span>
          </motion.div>
        )}
      </div>

      <div className="relative space-y-2 max-h-96 overflow-y-auto">
        {/* 時間線主線 */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-transparent" />

        <AnimatePresence>
          {events.length === 0 ? (
            <div className="text-center text-slate-500 py-8">暫無事件記錄</div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-16 pr-4 py-3"
              >
                {/* 時間線節點 */}
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border ${getEventColor(event.type, event.priority)}`}
                >
                  {getEventIcon(event.type)}
                </div>

                {/* 事件內容 */}
                <div
                  className={`p-3 rounded-lg border ${getEventColor(event.type, event.priority)}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-white">
                      {event.type.replace(/-/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  {event.phase && (
                    <div className="text-xs text-slate-400 mb-1">Phase: {event.phase}</div>
                  )}
                  {event.message && (
                    <div className="text-xs text-slate-300 mt-2">{event.message}</div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
