import { useState, useEffect, useCallback } from 'react';
import { EventEngine, WorldEvent } from '../services/EventEngine';

export const useWorldEvents = () => {
  const [events, setEvents] = useState<WorldEvent[]>(() => {
    const saved = localStorage.getItem('omni_world_events');
    return saved ? JSON.parse(saved) : [];
  });

  // Cleanup expired events
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setEvents(prev => {
        const updated = prev.filter(ev => ev.startTime + ev.duration > now);
        if (updated.length !== prev.length) {
          localStorage.setItem('omni_world_events', JSON.stringify(updated));
        }
        return updated;
      });
    }, 10000); // Check every 10s

    return () => clearInterval(interval);
  }, []);

  // Randomly trigger new events
  useEffect(() => {
    const trigger = setInterval(() => {
      if (events.length < 3 && Math.random() > 0.8) {
        const newEvent = EventEngine.generateWorldEvent();
        setEvents(prev => {
          const next = [...prev, newEvent];
          localStorage.setItem('omni_world_events', JSON.stringify(next));
          return next;
        });
      }
    }, 60000); // Try every minute

    return () => clearInterval(trigger);
  }, [events.length]);

  const forceTriggerEvent = useCallback(() => {
    const newEvent = EventEngine.generateWorldEvent();
    setEvents(prev => [...prev.slice(-2), newEvent]);
  }, []);

  const resolveEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  }, []);

  const globalModifiers = EventEngine.getActiveModifiers(events);

  return {
    events,
    globalModifiers,
    forceTriggerEvent,
    resolveEvent,
  };
};
