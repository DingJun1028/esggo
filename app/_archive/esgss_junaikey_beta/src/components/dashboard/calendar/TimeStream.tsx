import React, { memo, useRef, useEffect, useCallback, useMemo } from 'react';
import type { CalendarEvent } from '@/services/calendarService';
import { calendarService } from '@/services/calendarService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';

// ==================== TYPE DEFINITIONS ====================
interface TimeStreamProps {
  readonly events: CalendarEvent[];
  readonly onEventClick: (event: CalendarEvent) => void;
  readonly currentDate: Date;
}

interface EventNodeProps {
  readonly event: CalendarEvent;
  readonly onClick: () => void;
}

// ==================== UTILITY FUNCTIONS ====================
const getEventsForHour = (
  events: CalendarEvent[],
  hour: number,
  currentDate: Date
): CalendarEvent[] => {
  return events.filter(e => {
    const start = new Date(e.start);
    const end = new Date(e.end);
    const eventStartHour = start.getHours();
    const eventEndHour = end.getHours();
    const isSameDay = start.getDate() === currentDate.getDate();
    return (
      isSameDay && ((hour >= eventStartHour && hour < eventEndHour) || hour === eventStartHour)
    );
  });
};

// ==================== SUB-COMPONENTS ====================
const EventNode = memo<EventNodeProps>(({ event, onClick }) => {
  const Icon = useMemo(() => calendarService.getEventIcon(event.type), [event.type]);
  const color = useMemo(() => calendarService.getEventColor(event.type), [event.type]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={onClick}
          className="h-8 rounded-md bg-[#1E1E1E] border border-l-4 hover:brightness-125 transition-all cursor-pointer flex items-center px-2 gap-2 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
          style={{ borderLeftColor: color, borderColor: `${color}40` }}
          aria-label={`${event.title} event`}
        >
          <Icon size={12} style={{ color }} aria-hidden="true" />
          <span className="text-[10px] truncate text-gray-300 w-full text-left">{event.title}</span>
        </TooltipTrigger>
        <TooltipContent className="bg-[#1A1A1A] border border-gray-700 text-xs">
          <p className="font-bold text-[#FFD700]">{event.title}</p>
          <p className="text-gray-400">
            {new Date(event.start).toLocaleTimeString()} -{' '}
            {new Date(event.end).toLocaleTimeString()}
          </p>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{event.type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

EventNode.displayName = 'EventNode';

// ==================== MAIN COMPONENT ====================
export const TimeStream = memo<TimeStreamProps>(({ events, onEventClick, currentDate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const now = new Date();
      const hours = now.getHours();
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const clientWidth = scrollContainerRef.current.clientWidth;
      const scrollPos = (hours / 24) * scrollWidth - clientWidth / 2;

      scrollContainerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [currentDate]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const currentHour = useMemo(() => new Date().getHours(), []);
  const isToday = useMemo(() => currentDate.getDate() === new Date().getDate(), [currentDate]);

  const hourSlots = useMemo(
    () =>
      hours.map(hour => {
        const hourEvents = getEventsForHour(events, hour, currentDate);
        const isNow = hour === currentHour && isToday;

        return {
          hour,
          events: hourEvents,
          isNow,
        };
      }),
    [hours, events, currentDate, currentHour, isToday]
  );

  const handleEventClick = useCallback(
    (event: CalendarEvent) => () => {
      onEventClick(event);
    },
    [onEventClick]
  );

  return (
    <div
      className="relative h-64 bg-[#0E0E0E] rounded-xl border border-gray-800 overflow-hidden flex flex-col shadow-inner shadow-black/50"
      role="region"
      aria-label="Event timeline"
    >
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto flex items-center relative scrollbar-thin scrollbar-thumb-emerald-900/50 scrollbar-track-transparent"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex min-w-[200%] h-full">
          {hourSlots.map(({ hour, events: hourEvents, isNow }) => (
            <div
              key={hour}
              className={`flex-1 min-w-[100px] border-r border-[#2A2A2A] h-full relative group transition-colors hover:bg-[#1A1A1A] ${
                isNow ? 'bg-[#FFD700]/5' : ''
              }`}
              style={{ scrollSnapAlign: 'start' }}
            >
              <div
                className={`absolute top-2 left-2 text-[10px] font-mono ${
                  isNow ? 'text-[#FFD700] font-bold' : 'text-gray-600'
                }`}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>

              <div className="absolute top-10 bottom-4 left-1 right-1 flex flex-col gap-2 p-1 overflow-y-auto scrollbar-hide">
                {hourEvents.map(event => (
                  <EventNode key={event.id} event={event} onClick={handleEventClick(event)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer
        className="h-8 bg-[#121212] border-t border-gray-800 flex items-center px-4 gap-4 text-[10px] text-gray-500 font-mono"
        role="contentinfo"
      >
        <div className="flex items-center gap-1" role="listitem">
          <div className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" /> ESG
        </div>
        <div className="flex items-center gap-1" role="listitem">
          <div className="w-2 h-2 rounded-full bg-[#FFD700]" aria-hidden="true" /> SYSTEM
        </div>
        <div className="flex items-center gap-1" role="listitem">
          <div className="w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" /> GOV
        </div>
        <div className="flex items-center gap-1" role="listitem">
          <div className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" /> SEC
        </div>
      </footer>
    </div>
  );
});

TimeStream.displayName = 'TimeStream';
