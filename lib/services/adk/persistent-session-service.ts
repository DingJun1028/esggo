import { InMemorySessionService } from '@google/adk';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const SESSIONS_PATH = path.join(DATA_DIR, 'adk_sessions.json');

/**
 * Persistent Session Service
 * Extends InMemorySessionService to provide file-based persistence
 * for Agent sessions, ensuring conversation history survives server restarts.
 * This aligns with the "Data (D) - Synaptic Memory" role in the ADK Squad.
 */
export class PersistentSessionService extends InMemorySessionService {
  constructor() {
    super();
    this.loadFromDisk();
  }

  /**
   * Loads session data from the local data directory.
   */
  private loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(SESSIONS_PATH)) {
        const content = fs.readFileSync(SESSIONS_PATH, 'utf-8');
        const data = JSON.parse(content);
        
        // Populate the internal sessions map
        // Note: Using 'any' cast as the internal storage structure of ADK's 
        // SessionService may vary.
        const sessions = (this as any).sessions;
        if (sessions instanceof Map) {
          for (const [key, value] of Object.entries(data)) {
            sessions.set(key, value);
          }
        }
      }
    } catch (error) {
      console.error('[PersistentSessionService] Disk load failed:', error);
    }
  }

  /**
   * Persists the current session state to disk.
   */
  private saveToDisk() {
    try {
      const sessions = (this as any).sessions;
      if (sessions instanceof Map) {
        const data = Object.fromEntries(sessions);
        fs.writeFileSync(SESSIONS_PATH, JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('[PersistentSessionService] Disk save failed:', error);
    }
  }

  /**
   * Override appendEvent to persist changes whenever a new event occurs.
   */
  async appendEvent(request: any): Promise<any> {
    const result = await super.appendEvent(request);
    this.saveToDisk();
    return result;
  }
}
