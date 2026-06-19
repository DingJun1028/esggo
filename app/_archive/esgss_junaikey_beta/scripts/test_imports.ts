import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { v4 as uuidv4 } from 'uuid';
console.log('0. uuid imported');

console.log('1. Dotenv loaded');

import { supabase } from '../server/db/supabaseClient.js';
console.log('2. Supabase client imported');

import redisService from '../server/services/redisService.js';
console.log('3. Redis service imported');

import { AgentSoulService } from '../server/services/AgentSoulService.js';
console.log('4. Agent Soul Service imported');

import * as agentService from '../server/services/agentService.js';
console.log('5. Agent service imported');

async function test() {
    console.log('5. Running test...');
    await redisService.disconnect();
    console.log('6. Redis disconnected');
    process.exit(0);
}

test();
