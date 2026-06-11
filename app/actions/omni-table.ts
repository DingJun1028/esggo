'use server';

export async function deleteOmniTableRecord(datasheetId: string, recordId: string, currentPath: string) {
    console.log(`Deleting record ${recordId} from datasheet ${datasheetId}`);
    return { success: true };
}
