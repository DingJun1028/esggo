// Calendar Service - M6 Productivity Module
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { Users, CheckCircle, Bell, Calendar } from 'lucide-react';

// Event Interface
export interface CalendarEvent {
  id: string;
  title: string;
  start: number;
  end: number;
  description?: string;
  location?: string;
  attendees?: string[];
  type: 'meeting' | 'task' | 'reminder';
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedTo?: string;
  // UI Aliases
  startTime?: number;
  endTime?: number;
}

// Service Class
export class CalendarService {
  private static instance: CalendarService;
  private events: Map<string, CalendarEvent> = new Map();

  private constructor() {
    this.mockEvents();
  }

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  // Get Events
  async getEvents(start: number, end: number): Promise<CalendarEvent[]> {
    omniLogger.info(LogCategory.BUSINESS, 'Fetching calendar events', { start, end });
    return Array.from(this.events.values()).filter(e => e.start >= start && e.start <= end);
  }

  // Add Event
  async addEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const newEvent = { ...event, id: `evt_${Date.now()}` };
    this.events.set(newEvent.id, newEvent);
    omniLogger.info(LogCategory.BUSINESS, 'Calendar event added', { title: event.title });
    return newEvent;
  }

  // Delete Event
  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  getEventColor(type: string): string {
    switch (type) {
      case 'meeting':
        return 'blue';
      case 'task':
        return 'green';
      case 'reminder':
        return 'yellow';
      default:
        return 'gray';
    }
  }

  getEventIcon(type: string): any {
    switch (type) {
      case 'meeting':
        return Users;
      case 'task':
        return CheckCircle;
      case 'reminder':
        return Bell;
      default:
        return Calendar;
    }
  }

  private mockEvents() {
    const now = Date.now();
    this.addEvent({
      title: 'ESG Audit Review',
      start: now + 3600000,
      end: now + 7200000,
      type: 'meeting',
      description: 'Reviewing Q1 carbon footprint data.',
    });
  }
}

export const calendarService = CalendarService.getInstance();
