import { v4 as uuidv4 } from 'uuid';
import { LogCategory, omniLogger } from '../utils/OmniLogger.js';

export interface EcosystemEvent {
  id: string;
  type: 'POLICY' | 'CLIMATE' | 'INNOVATION';
  description: string;
  gravityScore: number; // Gravity Score: Impact intensity
  timestamp: string;
}

export class EcosystemPulseService {
  private static instance: EcosystemPulseService;
  private currentEvents: EcosystemEvent[] = [];

  private constructor() {
    this.startPulseSimulation();
  }

  public static getInstance(): EcosystemPulseService {
    if (!EcosystemPulseService.instance) {
      EcosystemPulseService.instance = new EcosystemPulseService();
    }
    return EcosystemPulseService.instance;
  }

  private startPulseSimulation() {
    setInterval(() => {
      this.generateEvent();
    }, 15000); // Generate a global pulse every 15 seconds
  }

  private generateEvent() {
    const types: EcosystemEvent['type'][] = ['POLICY', 'CLIMATE', 'INNOVATION'];
    const descriptions = [
      'EU Sustainability Regulation Update v2.4 (2026)',
      'Sudden Drop in Carbon Credit Market Resonance',
      'Quantum Computing Breakthrough in ESG Audit',
      'Global Biodiversity Protocol Signed in Sanctuary Node',
    ];

    const newEvent: EcosystemEvent = {
      id: `evt-${uuidv4().substring(0, 8)}`,
      type: types[Math.floor(Math.random() * types.length)]!,
      description: descriptions[Math.floor(Math.random() * descriptions.length)]!,
      gravityScore: 0.5 + Math.random() * 0.5,
      timestamp: new Date().toISOString(),
    };

    this.currentEvents.unshift(newEvent);
    if (this.currentEvents.length > 5) this.currentEvents.pop();

    omniLogger.info(LogCategory.BUSINESS, 'Planetary ESG Event Detected', {
      event: newEvent.description,
    });
  }

  public getCurrentPulse(): EcosystemEvent[] {
    return this.currentEvents;
  }

  /**
   * Trigger a planetary ESG event (for testing)
   */
  public async triggerPlanetaryEvent(event: {
    type: 'POLICY' | 'CLIMATE' | 'INNOVATION';
    intensity: number;
    description: string;
  }): Promise<EcosystemEvent> {
    const newEvent: EcosystemEvent = {
      id: `evt-${uuidv4().substring(0, 8)}`,
      type: event.type,
      description: event.description,
      gravityScore: event.intensity,
      timestamp: new Date().toISOString(),
    };

    this.currentEvents.unshift(newEvent);
    if (this.currentEvents.length > 5) this.currentEvents.pop();

    omniLogger.info(LogCategory.BUSINESS, 'Planetary ESG Event Triggered (Test)', {
      event: newEvent.description,
      type: newEvent.type,
      gravity: newEvent.gravityScore,
    });

    return newEvent;
  }
}

export const ecosystemPulseService = EcosystemPulseService.getInstance();
