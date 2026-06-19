import { useMemo, useEffect, useState, useCallback } from 'react';
import { useOmniHistory } from '../store/useOmniHistory';
import { useNoteSystem } from '../store/useNoteSystem';
import { useTaskSystem } from '../store/useTaskSystem';
import { TemporalEvent } from '../core/types';

// Placeholder for ExternalCalendarService until implemented
const ExternalCalendarService = {
  sync: async (subscriptions: any[]) => [] as TemporalEvent[],
};

export const useTimeNexus = (currentMonth: Date) => {
  const { logs } = useOmniHistory();
  // Assuming timeStore is imported or defined elsewhere, and fixing the syntax error and using nullish coalescing as per instruction.
  // If timeStore is not defined, this will still result in a runtime error, but the syntax of the line itself will be correct.
  const currentTime: string = (window as any).timeStore?.formattedTime ?? '';
  const { notes } = useNoteSystem(); // Moved notes declaration down to accommodate new line
  const { tasks } = useTaskSystem();
  const [externalEvents, setExternalEvents] = useState<TemporalEvent[]>([]);

  // 1. Initialize external calendar sync
  useEffect(() => {
    // Mock subscriptions for now
    const SUBSCRIPTIONS = [{ id: 'g-cal', name: 'Google', url: '', color: 'blue', type: 'GOOGLE' }];
    ExternalCalendarService.sync(SUBSCRIPTIONS as any).then(setExternalEvents);
  }, []);

  const { events, eventsByDate } = useMemo(() => {
    const nexusEvents: TemporalEvent[] = [...externalEvents];

    // 2. Fuse History Logs (Past)
    logs.forEach(log => {
      nexusEvents.push({
        id: log.id,
        date: new Date(log.timestamp).toISOString().split('T')[0] ?? '',
        type: log.type === 'IMMUNITY_HEAL' ? 'ENTROPY_HEAL' : 'AUTOMATION',
        title: `${log.sourceLabel}: ${log.payload?.strategyUsed || 'Triggered'}`,
        intensity: log.type === 'IMMUNITY_HEAL' ? 8 : 4,
        contextId: log.sourceId,
      });
    });

    // 3. Fuse Notes Tasks (Future)
    Object.values(notes).forEach(note => {
      const cycle: string = (window as any).timeStore?.cycle || 'Day';
      const taskLines = note.content.split('\n').filter(l => l.includes('@20'));
      taskLines.forEach((line, idx) => {
        const dateMatch = line.match(/@(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          nexusEvents.push({
            id: `${note.id}-task-${idx}`,
            date: dateMatch[1] ?? '',
            type: 'TASK_DUE',
            title: line.replace(/- \[ \] |@\d{4}-\d{2}-\d{2}/g, '').trim(),
            intensity: 6,
            contextId: note.contextId,
          });
        }
      });
    });

    // 4. Fuse System Tasks (Future)
    tasks.forEach(task => {
      if (task.dueDate && task.status !== 'DONE') {
        nexusEvents.push({
          id: `task-${task.id}`,
          date: task.dueDate,
          type: 'TASK_DUE',
          title: task.title,
          intensity: task.priority === 'CRITICAL' ? 10 : 6,
          contextId: task.contextId,
        });
      }
    });

    // 5. Build Index (O(N) -> O(1) Optimization)
    // ⚡ Bolt: Creating a hash map for O(1) date lookups instead of O(N) filtering
    const map: Record<string, TemporalEvent[]> = {};
    nexusEvents.forEach(event => {
      if (!map[event.date]) {
        map[event.date] = [];
      }
      map[event.date]!.push(event);
    });

    return { events: nexusEvents, eventsByDate: map };
  }, [logs, notes, tasks, externalEvents]);

  // ⚡ Bolt: Use the pre-calculated map for instant lookups
  const getEventsForDate = useCallback(
    (dateStr: string) => {
      return eventsByDate[dateStr] || [];
    },
    [eventsByDate]
  );

  return { events, getEventsForDate };
};
