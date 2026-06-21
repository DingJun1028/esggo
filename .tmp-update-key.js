const fs = require('fs');
const content = fs.readFileSync('/var/www/esggo/ecosystem.config.cjs', 'utf8');
const updated = content.replace(
  /OPENROUTER_API_KEY: '.*'/,
  "OPENROUTER_API_KEY: 'sk-or-...7d91'"
);
fs.writeFileSync('/var/www/esggo/ecosystem.config.cjs', updated);
console.log('Key updated');
console.log(updated.match(/OPENROUTER_API_KEY:.*/)?.[0]);
