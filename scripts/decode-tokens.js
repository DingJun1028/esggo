import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Decode the JWT token to see what it contains
function decodeJwt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }
  
  const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  
  return { header, payload, signature: parts[2] };
}

console.log('Anonymous Key:');
try {
  const decoded = decodeJwt(supabaseKey);
  console.log('Header:', JSON.stringify(decoded.header, null, 2));
  console.log('Payload:', JSON.stringify(decoded.payload, null, 2));
  console.log('Signature (first 20 chars):', decoded.signature.substring(0, 20) + '...');
} catch (err) {
  console.log('Error decoding token:', err.message);
}

console.log('\nOMNI_MCP_ACCESS_TOKEN:');
const omniToken = process.env.OMNI_MCP_ACCESS_TOKEN;
if (omniToken) {
  try {
    const decoded = decodeJwt(omniToken);
    console.log('Header:', JSON.stringify(decoded.header, null, 2));
    console.log('Payload:', JSON.stringify(decoded.payload, null, 2));
    console.log('Signature (first 20 chars):', decoded.signature.substring(0, 20) + '...');
  } catch (err) {
    console.log('Error decoding token:', err.message);
  }
} else {
  console.log('Not found');
}