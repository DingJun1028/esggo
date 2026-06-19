import { describe, it, expect, vi } from 'vitest';
import { OmniKnowledgeBridge } from '../omni-knowledge-bridge';
import { OmniWuzuoNoteService } from '../wuzuo-note';

describe('OmniKnowledgeBridge', () => {
    it('should correctly import from Markdown with tags', async () => {
        const content = `
# Obsidian Test Note
This is a test content with #Sustainability and #AI tags.
        `;
        const filename = 'test-note.md';

        // Mock the service to avoid actual storage side effects
        const createSpy = vi.spyOn(OmniWuzuoNoteService, 'createNote').mockImplementation(async (t, c) => ({
            uuid: 'test-uuid',
            title: t,
            content: c,
            timestamp: Date.now(),
            status: 'Draft',
            tags: []
        } as any));

        const note = await OmniKnowledgeBridge.importFromMarkdown(filename, content);

        expect(note.title).toBe('Obsidian Test Note');
        expect(createSpy).toHaveBeenCalled();

        createSpy.mockRestore();
    });

    it('should export to Markdown with 5T metadata', () => {
        const note = {
            uuid: 'NOTE-123',
            title: 'Export Test',
            content: 'Hello World',
            timestamp: 1677840000000,
            status: 'Trustworthy',
            tags: [{ id: 't1', semantic: '#Asset', dimension: 'Domain', weight: 1.0 }],
            evidence: {
                hash: 'sha256:abc',
                protocol: '5T-v1',
                originId: 'test',
                category: 'Sentient',
                timestamp: 1677840000000
            }
        } as any;

        const md = OmniKnowledgeBridge.exportToMarkdown(note);

        expect(md).toContain('# Export Test');
        expect(md).toContain('#Asset');
        expect(md).toContain('5T Trust Proof');
        expect(md).toContain('sha256:abc');
    });
});
