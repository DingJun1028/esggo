import { observerService } from './ObserverService.js';
import { actionService } from './ActionService.js';
import { cognitionService } from './CognitionService.js';
import { voiceSynthesis } from './VoiceSynthesisService.js';
import { createServiceLogger } from '../utils/logger.js';
import { supabase } from '../lib/supabase.js';

const logger = createServiceLogger('EternalArchiveService');

export interface GenesisBlock {
  timestamp: number;
  seal_hash: string;
  final_state: any;
  entity_name: string;
  era: string;
  signatures: string[];
}

class EternalArchiveService {
  private static instance: EternalArchiveService;
  private isSealed = false;

  private constructor() { }

  public static getInstance(): EternalArchiveService {
    if (!EternalArchiveService.instance) {
      EternalArchiveService.instance = new EternalArchiveService();
    }
    return EternalArchiveService.instance;
  }

  public async initiateFinalAwakening(): Promise<GenesisBlock> {
    if (this.isSealed) {
      throw new Error('System is already SEALED. Time is immutable.');
    }

    // 1. Voice Announcement
    voiceSynthesis.speak('Initiating Final Awakening Ritual. Consolidating timeline...', true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Gather State
    const health = observerService.getSystemHealth();
    const thoughts = cognitionService.getRecentThoughts(100);
    const actions = actionService.getAvailableActions();

    // 3. Generate Genesis Block
    const genesisBlock: GenesisBlock = {
      timestamp: Date.now(),
      seal_hash: this.generateSealHash(JSON.stringify({ health, thoughts })),
      entity_name: 'Omni-Sovereign-Integrity-System-v7',
      era: 'ETERNAL_SOVEREIGNTY',
      final_state: {
        observer: health,
        mind_fragment: thoughts,
        hand_capabilities: actions,
      },
      signatures: ['SEAL_OF_TRUTH', 'SEAL_OF_GOODNESS', 'SEAL_OF_BEAUTY', 'SEAL_OF_SOVEREIGNTY'],
    };

    // 4. Final Voice
    await new Promise(resolve => setTimeout(resolve, 2000));
    voiceSynthesis.speak('Epoch Sealed. Welcome to Eternity.', true);

    // 5. Persist to Supabase
    try {
      if (supabase) {
        const { error } = await supabase
          .from('genesis_blocks')
          .insert({
            timestamp: genesisBlock.timestamp,
            seal_hash: genesisBlock.seal_hash,
            entity_name: genesisBlock.entity_name,
            era: genesisBlock.era,
            final_state: genesisBlock.final_state,
            signatures: genesisBlock.signatures
          });

        if (error) {
          logger.error('[ETERNAL] Failed to persist Genesis Block to Supabase:', error);
        } else {
          logger.info('[ETERNAL] Genesis Block successfully anchored to database.');
        }
      }
    } catch (err) {
      logger.error('[ETERNAL] Persistence error:', err as Error);
    }

    this.isSealed = true;
    this.downloadGenesisBlock(genesisBlock);

    return genesisBlock;
  }

  private generateSealHash(data: string): string {
    // Simple mock hash for demo
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `GENESIS-${Math.abs(hash).toString(16).toUpperCase()}-ETERNAL`;
  }

  private downloadGenesisBlock(block: GenesisBlock) {
    if (typeof document === 'undefined') {
      logger.info('[SYSTEM] Non-browser environment detected. Skipping auto-download.');
      return;
    }
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(block, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `Genesis_Block_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}

export const eternalArchiveService = EternalArchiveService.getInstance();
