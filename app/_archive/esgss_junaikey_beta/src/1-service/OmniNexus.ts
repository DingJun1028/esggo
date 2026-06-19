import { omniLogger, LogCategory } from './omniLogger';

export interface NexusEvent {
  id: string;
  source: 'system' | 'legion' | 'knowledge' | 'security';
  priority: 'low' | 'normal' | 'high' | 'critical';
  message: string;
  timestamp: number;
  metadata?: any;
  read: boolean;
}

type NexusListener = (event: NexusEvent) => void;

class OmniNexusService {
  private events: NexusEvent[] = [];
  private listeners: NexusListener[] = [];
  private maxHistory = 100;

  constructor() {
    this.emit({
      id: 'init-001',
      source: 'system',
      priority: 'normal',
      message: 'Omni-Nexus Protocol Initialized.',
      timestamp: Date.now(),
    });
  }

  /**
   * Publish a new event to the Nexus
   */
  public emit(event: Omit<NexusEvent, 'read'>): void {
    const fullEvent: NexusEvent = { ...event, read: false };

    // Unshift to add to beginning (assuming chronological display usually wants newest first,
    // but we'll store chronologically based on append logic, actually unshift is better for "feed")
    this.events.unshift(fullEvent);

    if (this.events.length > this.maxHistory) {
      this.events.pop();
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(fullEvent));

    // Also log to OmniLogger for persistence/debugging
    if (event.source !== 'system') {
      // Avoid infinite loop if logger uses nexus (it shouldn't, but safe guard)
      omniLogger.debug(LogCategory.SYSTEM, `[Nexus] ${event.message}`);
    }
  }

  /**
   * Subscribe to new events
   */
  public subscribe(listener: NexusListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Get current history
   */
  public getHistory(): NexusEvent[] {
    return this.events;
  }

  /**
   * Mark event as read
   */
  public markRead(id: string): void {
    const event = this.events.find(e => e.id === id);
    if (event) {
      event.read = true;
    }
  }

  /**
   * Clear all logic
   */
  public clear(): void {
    this.events = [];
    this.emit({
      id: `clear-${Date.now()}`,
      source: 'system',
      priority: 'low',
      message: 'Nexus history cleared.',
      timestamp: Date.now(),
    });
  }
}

export const OmniNexus = new OmniNexusService();
