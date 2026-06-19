
import { supabase } from '../db/supabaseClient.js';
import ragService from './rag.js';
import vaultService from './vault.js';
import omniLogger, { LogCategory } from '../utils/omniLogger.js';
import { ICrystalDNA } from '../../src/types/omni-mechanics.js'; // Ensure path is correct/available, or redefine if server-side types differ

// Re-defining interface locally if needed since strict separation of src/server might apply in build
interface OmniNotePayload {
    content: string;
    tags: string[];
}

export class OmniNoteService {

    /**
     * Create a new OmniNote (Crystal DNA)
     * - Stores in DB
     * - Vectorizes for RAG
     * - Logs to Audit Vault ("Tangible")
     */
    async createNote(userId: string, title: string, content: string, tags: string[] = []): Promise<ICrystalDNA<OmniNotePayload>> {
        try {
            omniLogger.info(LogCategory.SYSTEM, `[OmniNote] Creating note: ${title}`);

            // 1. Insert into DB
            const { data: note, error } = await supabase
                .from('omni_notes')
                .insert({
                    user_id: userId,
                    title: title,
                    content: content,
                    tags: tags,
                    nature: 'Note',
                    resonance: 0.5 // Default resonance
                })
                .select()
                .single();

            if (error) throw error;

            // 2. Ingest into RAG (Memory Chunks) - "Spontaneous Flow" Enabler
            await ragService.ingestKnowledge(
                `user_${userId}`,
                `[Note: ${title}] ${content}`,
                { note_id: note.id, type: 'OmniNote', tags: tags }
            );

            // 3. Log to Vault (Traceable / Trustworthy)
            await vaultService.logEvidence(
                'USER',
                userId,
                'CREATION',
                { note_id: note.id, title },
                `hash_${Date.now()}` // Mock hash for now, real implementation would hash content
            );

            // 4. Construct Crystal DNA
            const crystal: ICrystalDNA<OmniNotePayload> = {
                uuid: note.id,
                nature: 'Note',
                resonance: note.resonance,
                payload: {
                    content: note.content,
                    tags: note.tags
                },
                protocol: {
                    tangible_sig: `sig_${note.id}`,
                    traceable_id: note.id,
                    trackable_state: 'ACTIVE',
                    transparent_proof: 'PENDING_VERIFICATION',
                    trustworthy_hash: 'PENDING_ANCHOR'
                }
            };

            return crystal;

        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `[OmniNote] Creation failed`, { error });
            throw error;
        }
    }

    /**
     * Spontaneous Flow: Find resonant notes/tasks
     */
    async findResonance(userId: string, noteId: string): Promise<any[]> {
        // Get the note content
        const { data: note } = await supabase
            .from('omni_notes')
            .select('content, title')
            .eq('id', noteId)
            .single();

        if (!note) return [];

        // Vector Search via RAG
        const query = `[Note: ${note.title}] ${note.content}`;
        const relevantChunks = await ragService.retrieveRelevant(`user_${userId}`, query, 5);

        // Filter out self
        return relevantChunks.filter(c => c.metadata?.note_id !== noteId);
    }
}

export default new OmniNoteService();
