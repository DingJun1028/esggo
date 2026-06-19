// src/services/externalCalendarService.ts
// Classified under: 靈性智能層 (Cognitive Intelligence Layer) & 平台體驗層 (Platform Experience Layer)
import ICAL from 'ical.js';
import { TemporalEvent } from '../core/time/types';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

// Define Source Config
export interface CalendarSource {
  id: string;
  name: string;
  url: string; // Must be .ics endpoint
  color: 'blue' | 'gray'; // Blue=Google, Gray=Apple
  type: 'GOOGLE' | 'APPLE';
}

export const ExternalCalendarService = {
  /**
   * Ritual: Sync External Time Dimension
   */
  async sync(sources: CalendarSource[]): Promise<TemporalEvent[]> {
    const allEvents: TemporalEvent[] = [];

    for (const source of sources) {
      try {
        // 1. Call Proxy
        const proxyUrl = `/api/calendar-proxy?url=${encodeURIComponent(source.url)}`;
        const res = await fetch(proxyUrl);
        const icsText = await res.text();

        // 2. Parse iCal Data
        const icalAny = ICAL as any;
        const jcalData = icalAny.parse(icsText);
        const comp = new icalAny.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        // 3. Transform to System Events
        vevents.forEach((vevent: any) => {
          const event = new icalAny.Event(vevent);
          const startDate = event.startDate.toJSDate();

          // Filter: ignore too old events (30 days ago)
          if (startDate.getTime() < Date.now() - 86400000 * 30) return;

          allEvents.push({
            id: `ext-${source.type}-${event.uid}`,
            date: startDate.toISOString().split('T')[0],
            type: source.type === 'GOOGLE' ? 'EXTERNAL_GOOGLE' : 'EXTERNAL_APPLE',
            title: event.summary,
            intensity: 2, // Low intensity for context
            contextId: source.name,
          });
        });
      } catch (e) {
        omniLogger.warn(LogCategory.SYSTEM, `Failed to sync dimension: ${source.name}`, {
          error: e,
        });
      }
    }

    return allEvents;
  },
};
