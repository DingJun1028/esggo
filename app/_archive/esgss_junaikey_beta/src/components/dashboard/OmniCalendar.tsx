import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Clock,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { TimeStream } from './calendar/TimeStream';
import { EventModal } from './calendar/EventModal';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import { useTheme } from '@/contexts/ThemeContext';

// ==================== CONSTANTS ====================
const EVENT_TYPES = ['ESG', 'SYSTEM', 'GOVERNANCE', 'SECURITY'] as const;

// ==================== SUB-COMPONENTS ====================
interface FilterButtonProps {
  readonly type: string;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

const FilterButton = memo<FilterButtonProps>(({ type, isActive, onClick }) => {
  const color = useMemo(() => calendarService.getEventColor(type as any), [type]);
  const { style } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all border w-full ${
        isActive
          ? 'bg-[#FFD700]/10 border-[#FFD700]/50'
          : style === 'glass'
            ? 'hover:bg-white/5 border-transparent'
            : 'hover:bg-gray-100/10 border-transparent'
      }`}
    >
      <span className={`text-[10px] font-mono ${isActive ? 'text-[#FFD700]' : 'text-gray-400'}`}>
        {type}
      </span>
      <div
        className="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]"
        style={{ backgroundColor: color, color }}
      />
    </button>
  );
});
FilterButton.displayName = 'FilterButton';

const AnomalyCard = memo<{ event: CalendarEvent; onClick: () => void }>(({ event, onClick }) => {
  const { style } = useTheme();
  return (
    <article
      className={`p-3 rounded-lg border cursor-pointer transition-all group ${
        style === 'glass'
          ? 'bg-red-900/10 border-red-500/20 hover:bg-red-900/20 hover:border-red-500/50'
          : 'bg-red-50 border-red-200 hover:bg-red-100'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <Badge
          variant="outline"
          className="text-[8px] border-red-500/30 text-red-500 px-1 py-0 bg-red-500/5"
        >
          {event.severity}
        </Badge>
        <time className="text-[9px] text-gray-500">
          {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
      <h4
        className={`text-[10px] font-bold mt-1 transition-colors ${
          style === 'glass'
            ? 'text-gray-200 group-hover:text-red-400'
            : 'text-gray-800 group-hover:text-red-600'
        }`}
      >
        {event.title}
      </h4>
    </article>
  );
});
AnomalyCard.displayName = 'AnomalyCard';

// ==================== MAIN COMPONENT ====================
export const OmniCalendar = memo(() => {
  const { style } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - 2);
      const end = new Date(currentDate);
      end.setDate(end.getDate() + 2);
      const data = await calendarService.getEvents(start.getTime(), end.getTime());
      setEvents(data);
    };
    fetchEvents();
  }, [currentDate]);

  const handleDateChange = useCallback((days: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  }, []);

  const glassPanelClass =
    style === 'glass'
      ? 'liquid-glass bg-black/40 backdrop-blur-md border-white/10'
      : 'minimalist-optics bg-white/5 border-white/10';

  const filteredEvents = useMemo(
    () => (filterType ? events.filter(e => e.type === filterType) : events),
    [events, filterType]
  );
  const anomalies = useMemo(
    () => events.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH'),
    [events]
  );

  return (
    <div className="h-full w-full p-4 overflow-hidden flex flex-col gap-4">
      {/* Header / Time Navigation */}
      <div
        className={`${glassPanelClass} shrink-0 p-4 rounded-2xl flex items-center justify-between`}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDateChange(-1)}
            className="hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-[#FFD700] tracking-wide font-mono">
              {currentDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              {currentDate.toLocaleDateString([], { weekday: 'long' })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDateChange(1)}
            className="hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-emerald-500 hidden md:block">
          TEMPORAL RESONANCE STREAM
        </h1>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
          <Clock size={12} className="animate-pulse text-[#FFD700]" />
          <span>SYSTEM TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Main Bento Layout */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        {/* Controls (Left) */}
        <div
          className={`col-span-12 md:col-span-3 ${glassPanelClass} rounded-2xl p-4 flex flex-col gap-4 min-h-0`}
        >
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}
            className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-white border border-gray-700 text-xs font-mono"
          >
            <Plus size={14} className="mr-2 text-[#FFD700]" /> NEW PULSE
          </Button>

          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-2">
              <Filter size={10} /> Data Layers
            </p>
            {EVENT_TYPES.map(type => (
              <FilterButton
                key={type}
                type={type}
                isActive={filterType === type}
                onClick={() => setFilterType(prev => (prev === type ? null : type))}
              />
            ))}
          </div>

          <div className="mt-auto p-4 rounded-xl border border-dashed border-gray-700/50 flex flex-col items-center justify-center opacity-50">
            <span className="text-[9px] text-gray-500 uppercase">Archive Access</span>
            <span className="text-xs text-gray-400 font-mono">LOCKED</span>
          </div>
        </div>

        {/* Time Stream (Center) */}
        <div
          className={`col-span-12 md:col-span-6 ${glassPanelClass} rounded-2xl p-0 relative overflow-hidden min-h-0 flex flex-col`}
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <TimeStream
              events={filteredEvents}
              currentDate={currentDate}
              onEventClick={e => {
                setSelectedEvent(e);
                setIsModalOpen(true);
              }}
            />
          </div>
          {/* Fade overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Anomalies (Right) */}
        <div
          className={`col-span-12 md:col-span-3 ${glassPanelClass} rounded-2xl p-4 flex flex-col min-h-0`}
        >
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-red-500 uppercase tracking-widest">
            <AlertTriangle size={12} /> Temporal Anomalies
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
            {anomalies.length === 0 && (
              <p className="text-[10px] text-gray-500 italic">No anomalies detected.</p>
            )}
            {anomalies.map(evt => (
              <AnomalyCard
                key={evt.id}
                event={evt}
                onClick={() => {
                  setSelectedEvent(evt);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono">
              <span>Stability</span>
              <span className="text-[#00FFC8]">98.2%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-[#00FFC8] w-[98%]" />
            </div>
          </div>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
});
OmniCalendar.displayName = 'OmniCalendar';
