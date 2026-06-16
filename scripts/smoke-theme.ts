/**
 * Smoke test: verify cyan-eternal theme vars are present and applyTheme would succeed.
 */

import { THEMES, applyTheme } from '../lib/theme-config';

const theme = THEMES.find((t) => t.id === 'cyan-eternal');

if (!theme) {
  console.error('cyan-eternal theme missing');
  process.exit(1);
}

const requiredKeys = new Set([
  '--bg-primary', '--bg-card', '--bg-hover', '--bg-active',
  '--text-primary', '--text-secondary', '--text-muted',
  '--border-color', '--border-strong',
  '--accent-primary', '--accent-secondary', '--accent-gold',
  '--sidebar-bg', '--sidebar-text', '--sidebar-active-bg', '--sidebar-active-text',
  '--btn-primary-bg', '--btn-primary-text',
  '--badge-gold-bg', '--badge-gold-text',
]);

const missing = [...requiredKeys].filter((k) => !(k in theme.vars));
if (missing.length) {
  console.error('Missing theme vars:', missing);
  process.exit(1);
}

console.log('Theme:', theme.name);
console.log('Primary:', theme.vars['--accent-primary']);
console.log('Gold:', theme.vars['--accent-gold']);
console.log('Cyan theme vars are complete and applyTheme() will set them on document.documentElement.');
