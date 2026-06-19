const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
let content = fs.readFileSync(envPath, 'utf8');

const updates = {
  'NEXT_PUBLIC_SUPABASE_URL': 'https://mruetmtibkbzfaawfjbm.supabase.co',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'sb_publishable_Ljpb0dn7cnVA97I7KE__GA_pqXuKONN',
  'NOCODB_API_TOKEN': 'ncb_3457befca0d16ea709c7e72b2c4f00a6d36d1063ca63dce9',
  'NOCODB_PROJECT_ID': 'p_junaikey_beta'
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
console.log('✅ .env updated successfully.');
