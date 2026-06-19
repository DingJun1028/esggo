import { omniLogger, LogCategory } from './omniLogger';

/**
 * 📅 UniversalCalendar: The Timeline Architect
 * Manages sentient schedules and ESG reporting deadlines.
 */
export interface ICalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'Deadline' | 'Audit' | 'Manifestation' | 'Sync';
    priority: 'Low' | 'Medium' | 'High' | 'URGENT';
}

export class UniversalCalendar {
    private static events: ICalendarEvent[] = [];

    /**
     * 📌 Schedule: Add an event to the timeline.
     */
    public static schedule(event: Omit<ICalendarEvent, 'id'>): string {
        const id = `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        this.events.push({ ...event, id });
        omniLogger.info(LogCategory.SYSTEM, `Calendar: Event scheduled: ${event.title} on ${event.date}`);
        return id;
    }

    /**
     * 🔔 GetUpcoming: Fetch events within a specific timeframe.
     */
    public static getUpcoming(days: number = 7): ICalendarEvent[] {
        const now = new Date();
        const future = new Date();
        future.setDate(now.getDate() + days);

        return this.events.filter(e => {
            const eDate = new Date(e.date);
            return eDate >= now && eDate <= future;
        });
    }

    /**
     * 🆔 GetEventById: Retrieve a specific event.
     */
    public static getEventById(id: string): ICalendarEvent | undefined {
        return this.events.find(e => e.id === id);
    }

    /**
     * ⏳ GetDeadlineStatus: Returns countdown and urgency metrics.
     */
    public static getDeadlineStatus(eventId: string) {
        const event = this.getEventById(eventId);
        if (!event) return null;

        const now = new Date();
        const deadline = new Date(event.date);
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Calculate working days remaining
        let workingDaysLeft = 0;
        const tempDate = new Date(now);
        while (tempDate <= deadline) {
            const day = tempDate.getDay();
            if (day !== 0 && day !== 6) {
                workingDaysLeft++;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }

        let urgencyLevel: 'Normal' | 'Warning' | 'CRITICAL' = 'Normal';
        if (workingDaysLeft <= 3) urgencyLevel = 'CRITICAL';
        else if (workingDaysLeft <= 7) urgencyLevel = 'Warning';

        return {
            title: event.title,
            daysLeft: diffDays,
            workingDaysLeft,
            urgencyLevel,
            isOverdue: diffTime < 0
        };
    }

    /**
     * 🛠️ Clear: For testing purposes.
     */
    public static clear(): void {
        this.events = [];
    }
}
