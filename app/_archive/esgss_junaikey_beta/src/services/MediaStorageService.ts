import { supabase } from '../lib/supabase.js';

export interface MediaAsset {
    id: string;
    name: string;
    url: string;
    storage_path: string;
    type: 'image' | 'icon' | 'graphic';
    category?: string;
    description?: string;
    size_bytes?: number;
    dimensions?: string;
    created_at: string;
}

export const MediaStorageService = {
    /**
     * Fetch all media assets from the database
     */
    async getAllAssets(): Promise<MediaAsset[]> {
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Upload a file to storage and record metadata
     */
    async uploadAsset(
        file: File,
        metadata: Partial<Omit<MediaAsset, 'id' | 'url' | 'storage_path' | 'created_at'>>
    ): Promise<MediaAsset> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const storagePath = `uploads/${fileName}`;

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('media-assets')
            .upload(storagePath, file);

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('media-assets')
            .getPublicUrl(storagePath);

        // 3. Save Metadata to DB
        const { data: asset, error: dbError } = await supabase
            .from('media_assets')
            .insert({
                name: metadata.name || file.name,
                url: publicUrl,
                storage_path: storagePath,
                type: metadata.type || 'image',
                category: metadata.category || 'General',
                description: metadata.description,
                size_bytes: file.size,
            })
            .select()
            .single();

        if (dbError) throw dbError;
        return asset;
    },

    /**
     * Delete an asset from storage and database
     */
    async deleteAsset(asset: MediaAsset): Promise<void> {
        // 1. Delete from Storage
        const { error: storageError } = await supabase.storage
            .from('media-assets')
            .remove([asset.storage_path]);

        if (storageError) throw storageError;

        // 2. Delete from DB
        const { error: dbError } = await supabase
            .from('media_assets')
            .delete()
            .eq('id', asset.id);

        if (dbError) throw dbError;
    }
};
