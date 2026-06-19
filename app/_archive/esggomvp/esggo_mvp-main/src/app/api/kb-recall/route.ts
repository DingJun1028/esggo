import { NextResponse } from 'next/server';
import { OmniNcbService } from '@/core/omni-ncb-service';
import { omniLogger, LogCategory } from '@/core/omniLogger';

/**
 * 🔍 KB Recall API
 * Retrieves distilled knowledge atoms from NCBDB.
 */
export async function GET() {
    omniLogger.info(LogCategory.SYSTEM, "API: Recalling knowledge atoms from NCBDB...");

    try {
        const remoteNotes = await OmniNcbService.listNotes();

        // Transform NCB rows back to IOmniAtom format
        const atoms = remoteNotes.map((note: any) => ({
            uuid: note.uuid,
            timestamp: new Date(note.created_at).getTime(),
            domainRef: 'Gnosis_Sanctuary',
            payload: {
                title: note.title,
                content: note.content,
                tags: note.tags || []
            },
            tags: note.tags || [],
            signature: note.hash_lock,
            impactMetric: note.impact_metric,
            sourceOrigin: note.source_origin,
            status: 'Trustworthy'
        }));

        return NextResponse.json({ success: true, data: atoms });
    } catch (error) {
        omniLogger.error(LogCategory.SYSTEM, "API: Failed to recall knowledge", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
