import { create } from 'zustand';

export interface SwarmEvent {
  id: string;
  type: string;
  source: string;
  payload: any;
  timestamp: number;
}

interface SwarmStoreState {
  events: SwarmEvent[];
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  addEvent: (event: Omit<SwarmEvent, 'id'>) => void;
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  clearEvents: () => void;
}

export const useSwarmStore = create<SwarmStoreState>((set) => ({
  events: [],
  connectionStatus: 'disconnected',
  
  addEvent: (event) => set((state) => {
    const newEvent = { ...event, id: Math.random().toString(36).slice(2, 9) };
    // Keep only last 100 events
    const newEvents = [newEvent, ...state.events].slice(0, 100);
    return { events: newEvents };
  }),
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  clearEvents: () => set({ events: [] })
}));
