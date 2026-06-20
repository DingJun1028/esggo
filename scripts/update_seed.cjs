const fs = require('fs');
let content = fs.readFileSync('supabase/migrations/20260620000100_seed_reading_room_documents.sql', 'utf8');

const lines = content.split('\n');
const newLines = lines.map(line => {
  if (line.match(/^\('.*'\),$/)) {
    return line.replace(/\),$/, `, 'zkp-mock-${Math.random().toString(36).substring(2, 10)}')`);
  } else if (line.match(/^\('.*'\)$/)) {
    return line.replace(/\)$/, `, 'zkp-mock-${Math.random().toString(36).substring(2, 10)}')`);
  }
  return line;
});

fs.writeFileSync('supabase/migrations/20260620000100_seed_reading_room_documents.sql', newLines.join('\n'));
