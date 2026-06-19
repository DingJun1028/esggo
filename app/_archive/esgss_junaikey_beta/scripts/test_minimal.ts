console.log('Hello from simple test');
import * as dotenv from 'dotenv';
dotenv.config();
console.log('Env loaded');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'PRESENT' : 'MISSING');
