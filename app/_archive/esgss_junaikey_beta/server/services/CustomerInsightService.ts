
import { supabase } from '../config/supabase.js';

export class CustomerInsightService {
    /**
     * Zero-Hallucination Verification: Updates user preferences based on interaction history (favorites).
     * Analyzes tag frequency from user's favorites to build an interest profile.
     */
    async analyzeUserInteractions(userId: string) {
        if (!userId) return;

        // 1. Fetch user's recent favorites to understand interests
        const { data: favorites, error } = await supabase
            .from('market_intelligence_favorites')
            .select('item_id, market_intelligence_items(tags)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error || !favorites) {
            console.error('Error fetching favorites for insight:', error);
            return;
        }

        // 2. Extract and calculate Tag Frequencies
        const tagMap: Record<string, number> = {};
        favorites.forEach((fav: any) => {
            // Access nested tags from the joined table
            const tags = fav.market_intelligence_items?.tags;
            if (Array.isArray(tags)) {
                tags.forEach((tag: string) => {
                    tagMap[tag] = (tagMap[tag] || 0) + 1;
                });
            }
        });

        // 3. Update User Preferences (Incremental Update Mode)
        // Sort tags by frequency (descending)
        const interestedTags = Object.keys(tagMap).sort((a, b) => tagMap[b] - tagMap[a]).slice(0, 10);

        await supabase
            .from('user_intelligence_preferences')
            .upsert({
                user_id: userId,
                interested_tags: interestedTags,
                interaction_history: {
                    last_analyzed: new Date().toISOString(),
                    top_tags: tagMap,
                    analyzed_favorites_count: favorites.length
                },
                updated_at: new Date().toISOString()
            });
    }

    /**
     * Personalized Recommendation Logic (Transparent Algorithm)
     * Uses Postgres Array Overlap to find articles matching user's interested tags.
     */
    async getRecommendedContent(userId: string, limit: number = 10) {
        // 1. Fetch User's Interested Tags
        const { data: prefs } = await supabase
            .from('user_intelligence_preferences')
            .select('interested_tags')
            .eq('user_id', userId)
            .single();

        if (!prefs || !prefs.interested_tags || prefs.interested_tags.length === 0) {
            // Cold Start Strategy: Return latest high-impact or trending news
            return await supabase
                .from('market_intelligence_items')
                .select(`
            *,
            sustainability_sources (name_tc, category_name)
        `)
                .order('created_at', { ascending: false })
                .limit(limit);
        }

        // 2. Tag Matching Query (using Postgres overlap operator && via .overlaps())
        // We prioritize articles that have at least one matching tag from the user's top 5 interests.
        const topInterests = prefs.interested_tags.slice(0, 5);

        const { data: recommendations, error } = await supabase
            .from('market_intelligence_items')
            .select(`
        *,
        sustainability_sources (name_tc, category_name)
       `)
            .overlaps('tags', topInterests)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching recommendations:', error);
            return [];
        }

        return recommendations;
    }
}

export const customerInsightService = new CustomerInsightService();
export default customerInsightService;
