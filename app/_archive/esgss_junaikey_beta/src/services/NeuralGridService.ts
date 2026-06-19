import { omniLogger, LogCategory } from './omniLogger.js';

export interface NeuralNode {
  id: string;
  location: string;
  status: 'ACTIVE' | 'SYNCHRONIZING' | 'OFFLINE';
  frequency: number; // Hz
  latency: number; // ms
  load: number; // 0-1
}

export interface GridState {
  coherence: number; // 0-1
  activeNodes: number;
  totalThroughput: number; // Gbps
  resonanceMode: 'STABLE' | 'FLUX' | 'HARMONIC';
}

class NeuralGridService {
  private nodes: NeuralNode[] = [
    {
      id: 'node_tokyo_01',
      location: 'Tokyo, JP',
      status: 'ACTIVE',
      frequency: 528.32,
      latency: 12,
      load: 0.42,
    },
    {
      id: 'node_london_01',
      location: 'London, UK',
      status: 'ACTIVE',
      frequency: 528.28,
      latency: 85,
      load: 0.31,
    },
    {
      id: 'node_sf_01',
      location: 'San Francisco, US',
      status: 'SYNCHRONIZING',
      frequency: 527.95,
      latency: 120,
      load: 0.85,
    },
    {
      id: 'node_berlin_04',
      location: 'Berlin, DE',
      status: 'ACTIVE',
      frequency: 528.35,
      latency: 42,
      load: 0.15,
    },
    {
      id: 'node_sydney_02',
      location: 'Sydney, AU',
      status: 'ACTIVE',
      frequency: 528.3,
      latency: 156,
      load: 0.22,
    },
  ];

  private state: GridState = {
    coherence: 0.94,
    activeNodes: 4,
    totalThroughput: 1240.5,
    resonanceMode: 'STABLE',
  };

  private subscribers: ((state: GridState, nodes: NeuralNode[]) => void)[] = [];

  constructor() {
    this.startGridSimulation();
  }

  private startGridSimulation() {
    setInterval(() => {
      this.updateNeuralFrequencies();
      this.calculateCoherence();
      this.notifySubscribers();
    }, 3000);
  }

  private updateNeuralFrequencies() {
    this.nodes = this.nodes.map(node => {
      if (node.status === 'OFFLINE') return node;

      // Simulating frequency drift
      const drift = (Math.random() - 0.5) * 0.1;
      const newFreq = node.frequency + drift;

      // Simulating latency jitter
      const jitter = (Math.random() - 0.5) * 5;
      const newLatency = Math.max(1, node.latency + jitter);

      return {
        ...node,
        frequency: Number(newFreq.toFixed(2)),
        latency: Number(newLatency.toFixed(1)),
      };
    });
  }

  private calculateCoherence() {
    const activeNodes = this.nodes.filter(n => n.status === 'ACTIVE');
    if (activeNodes.length === 0) {
      this.state.coherence = 0;
      return;
    }

    const avgFreq = activeNodes.reduce((acc, n) => acc + n.frequency, 0) / activeNodes.length;
    const variance =
      activeNodes.reduce((acc, n) => acc + Math.pow(n.frequency - avgFreq, 2), 0) /
      activeNodes.length;

    // Coherence is higher when variance is lower
    this.state.coherence = Math.max(0, 1 - variance * 10);
    this.state.activeNodes = activeNodes.length;
    this.state.totalThroughput = activeNodes.length * 250 + Math.random() * 50;

    if (this.state.coherence > 0.98) this.state.resonanceMode = 'HARMONIC';
    else if (this.state.coherence < 0.7) this.state.resonanceMode = 'FLUX';
    else this.state.resonanceMode = 'STABLE';
  }

  public getGridData() {
    return { state: this.state, nodes: this.nodes };
  }

  public subscribe(callback: (state: GridState, nodes: NeuralNode[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(s => s(this.state, this.nodes));
  }

  public triggerResonance(nodeId: string) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.status = 'ACTIVE';
      node.frequency = 528.32; // Reset to harmonic frequency
      omniLogger.info(LogCategory.SYSTEM, `Neural Resonance Triggered for ${nodeId}`);
      this.calculateCoherence();
      this.notifySubscribers();
    }
  }
}

export const neuralGridService = new NeuralGridService();
