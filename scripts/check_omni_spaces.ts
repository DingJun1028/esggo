import { OmniTableClient } from '../lib/omni-table/client';
import dotenv from 'dotenv';
dotenv.config();

async function checkSpaces() {
  const token = process.env.OMNITABLE_API_KEY;
  if (!token) {
    console.error('No OMNITABLE_API_KEY found');
    return;
  }

  const client = new OmniTableClient({ token });
  try {
    console.log('Fetching spaces...');
    const spaces = await client.getSpaces();
    console.log('Available Spaces:', JSON.stringify(spaces, null, 2));
  } catch (e) {
    console.error('Error fetching spaces:', e.message);
  }
}

checkSpaces();
