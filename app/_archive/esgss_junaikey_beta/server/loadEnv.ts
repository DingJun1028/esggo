
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from current directory (server/)
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('[EnvLoader] Loaded environment variables from:', path.resolve(__dirname, '.env'));
