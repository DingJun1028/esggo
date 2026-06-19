import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Zap, Calendar as CalIcon } from './icons';

interface TemporalEvent {
  id: string;
  date: string;
  type: 'ENTROPY_HEAL' | 'AUTOMATION' | 'TASK_DUE' | 'EXTERNAL_GOOGLE' | 'EXTERNAL_APPLE';
  title: string;
  intensity: number;
  contextId?: string;
}

interface OmniCalendarProps {
  events?: TemporalEvent[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

export const OmniCalendar: React.FC<OmniCalendarProps> = ({
  events = [],
  onDateSelect,
  selectedDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 日曆生成邏輯 (簡化版)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  // 空白填充
  for (let i = 0; i < firstDay; i++) days.push(null);
  // 月的天數
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect?.(dateStr);
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="flex gap-6 h-full">
      {/* 左側：日曆網格 (Grid Matrix) */}
      <div className="flex-1 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalIcon className="text-celestial-purple" />
            <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-2 hover:bg-white/10 rounded-full text-slate-400"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-2 hover:bg-white/10 rounded-full text-slate-400"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-4 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-xs font-bold text-slate-500 uppercase tracking-widest">{d}</div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;

            const dayEvents = getEventsForDate(day);
            const hasHeal = dayEvents.some(e => e.type === 'ENTROPY_HEAL');
            const hasAuto = dayEvents.some(e => e.type === 'AUTOMATION');
            const hasTask = dayEvents.some(e => e.type === 'TASK_DUE');
            const hasGoogle = dayEvents.some(e => e.type === 'EXTERNAL_GOOGLE');
            const hasApple = dayEvents.some(e => e.type === 'EXTERNAL_APPLE');

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`
                  relative h-14 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center group
                  ${selectedDate === dateStr
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                    : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'}
                `}
              >
                <span className={`text-sm font-bold ${selectedDate === dateStr ? 'text-white' : 'text-slate-400'}`}>
                  {day}
                </span>
                {/* 狀態指示點 (Quantum Dots) */}
                <div className="flex gap-1 mt-1 justify-center flex-wrap px-1">
                  {hasHeal && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.8)]" title="System Healed" />}
                  {hasAuto && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.8)]" title="Automation Ran" />}
                  {hasTask && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]" title="Task Due" />}
                  {hasGoogle && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" title="Google Calendar" />}
                  {hasApple && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shadow-[0_0_6px_rgba(203,213,225,0.8)]" title="Apple Calendar" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 右側：時空細節 (Side Panel) */}
      <div className="w-80 bg-slate-950/90 border-l border-slate-800 p-6 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
          Temporal Log: {selectedDate || 'Select a Date'}
        </h3>

        {selectedDate && getEventsForDate(parseInt(selectedDate.split('-')[2])).length === 0 && (
          <div className="text-slate-600 text-xs italic text-center py-10">
            Time stream is quiet. No anomalies.
          </div>
        )}

        {selectedDate && getEventsForDate(parseInt(selectedDate.split('-')[2])).map(event => (
          <div key={event.id} className={`
            p-3 rounded-lg border flex items-start gap-3 transition-all hover:scale-105
            ${event.type === 'ENTROPY_HEAL' ? 'bg-amber-900/10 border-amber-500/30' :
              event.type === 'AUTOMATION' ? 'bg-purple-900/10 border-purple-500/30' :
              event.type === 'TASK_DUE' ? 'bg-emerald-900/10 border-emerald-500/30' :
              event.type === 'EXTERNAL_GOOGLE' ? 'bg-blue-900/10 border-blue-500/30' :
              'bg-slate-900/10 border-slate-500/30'}
          `}>
            <div className="mt-0.5">
              {event.type === 'ENTROPY_HEAL' && <ShieldCheck className="w-4 h-4 text-amber-500" />}
              {event.type === 'AUTOMATION' && <Zap className="w-4 h-4 text-purple-500" />}
              {event.type === 'TASK_DUE' && <CalIcon className="w-4 h-4 text-emerald-500" />}
              {event.type === 'EXTERNAL_GOOGLE' && <div className="w-4 h-4 rounded-full bg-blue-500" />}
              {event.type === 'EXTERNAL_APPLE' && <div className="w-4 h-4 rounded-full bg-slate-300" />}
            </div>
            <div>
              <h4 className={`text-xs font-bold ${
                event.type === 'ENTROPY_HEAL' ? 'text-amber-400' :
                event.type === 'AUTOMATION' ? 'text-purple-400' :
                event.type === 'TASK_DUE' ? 'text-emerald-400' :
                event.type === 'EXTERNAL_GOOGLE' ? 'text-blue-400' :
                'text-slate-400'
              }`}>
                {event.type.replace('_', ' ')}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {event.title}
              </p>
              {event.contextId && (
                <span className="text-[10px] text-slate-500 mt-1 block">CTX: {event.contextId}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};