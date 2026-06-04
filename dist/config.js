"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boostSpaceConfig = exports.genkitConfig = exports.supabaseConfig = exports.firebaseConfig = void 0;
exports.firebaseConfig = {
    baseUrl: process.env.FIREBASE_BASE_URL || 'https://firebasedatabase.googleapis.com',
    accessToken: process.env.FIREBASE_ACCESS_TOKEN || 'your-firebase-token'
};
exports.supabaseConfig = {
    url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    key: process.env.SUPABASE_KEY || 'your-supabase-key'
};
exports.genkitConfig = {
    projectId: process.env.GENKIT_PROJECT_ID || 'your-genkit-project'
};
exports.boostSpaceConfig = {
    apiKey: process.env.BOOSTSPACE_API_KEY || 'your-boostspace-key'
};
//# sourceMappingURL=config.js.map