const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
let content = fs.readFileSync(envPath, 'utf8');

const updates = {
  'NEXT_PUBLIC_SUPABASE_URL': 'https://mruetmtibkbzfaawfjbm.supabase.co',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ydWV0bXRpYmtiemZhYXdmamJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNDU0MjIsImV4cCI6MjA3ODYyMTQyMn0.PIBhYztcwZhmsFWd_8anuuj5sb8xoST-rHgAVH9kou8',
  'SUPABASE_SERVICE_ROLE_KEY': '', // Clearing old key to prevent leakage across projects
  'NOCODB_API_TOKEN': 'ncb_3457befca0d16ea709c7e72b2c4f00a6d36d1063ca63dce9',
  'NOCODB_PROJECT_ID': '0ea9096eeb5f972d26b32782969028342635a6980ab088c42150379911e0788f' // Using the ID provided in image
};

for (const [key, value] of Object.entries(updates)) {
  const regex = new RegExp(`^${key}=.*`, 'm');
  if (content.match(regex)) {
    content = content.replace(regex, `${key}=${value}`);
  } else {
    content += `\n${key}=${value}`;
  }
}

fs.writeFileSync(envPath, content);
console.log('✅ .env updated with new project credentials.');
