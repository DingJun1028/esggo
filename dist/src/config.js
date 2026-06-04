export const firebaseConfig = {
    baseUrl: process.env.FIREBASE_BASE_URL || 'https://firebasedatabase.googleapis.com',
    accessToken: process.env.FIREBASE_ACCESS_TOKEN || 'your-firebase-token'
};
export const supabaseConfig = {
    url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    key: process.env.SUPABASE_KEY || 'your-supabase-key'
};
export const genkitConfig = {
    projectId: process.env.GENKIT_PROJECT_ID || 'your-genkit-project'
};
export const boostSpaceConfig = {
    apiKey: process.env.BOOSTSPACE_API_KEY || 'your-boostspace-key'
};
//# sourceMappingURL=config.js.map