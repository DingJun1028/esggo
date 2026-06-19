'use server';

import { omniSyncCenter } from '@/core/omni-user-sync-center';

export async function saveNoteAction(title: string, content: string) {
    const atom = await omniSyncCenter.mapAndTag({
        title,
        content,
        source: 'JunAiKey-Frontend'
    });

    await omniSyncCenter.dispatch(atom);
    return atom;
}
