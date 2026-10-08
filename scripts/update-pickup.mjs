import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const config = JSON.parse(readFileSync(new URL('content/pickup.json', root), 'utf8'));
const app = config.apps[config.selected];
if (!app) throw new Error('Unknown PICK UP selection: ' + config.selected);
const theme = { timer: 'timer', palettly: 'palette', karuta: 'words', swack: 'swack' }[config.selected];
if (!theme) throw new Error('Missing app preview theme: ' + config.selected);
for (const key of ['name', 'headline', 'category', 'platform', 'href', 'image', 'alt']) {
  if (typeof app[key] !== 'string' || !app[key]) throw new Error('Missing field: ' + key);
}
for (const key of ['width', 'height']) {
  if (!Number.isInteger(app[key]) || app[key] <= 0) throw new Error('Invalid dimension: ' + key);
}
for (const key of ['href', 'image']) {
  if (/^(?:[a-z]+:|\/|.*\.\.)/i.test(app[key])) throw new Error('Use a local path: ' + key);
  if (!existsSync(new URL(app[key], root))) throw new Error('Missing asset or page: ' + app[key]);
}
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const a = Object.fromEntries(Object.entries(app).map(([k,v]) => [k, escape(v)]));
const block = [
  '<!-- PICKUP:START -->',
  '<a class="hero-feature ' + theme + '" href="' + a.href + '">',
  '<div class="product-art screen-art"><img src="' + a.image + '" width="' + a.width + '" height="' + a.height + '" alt="' + a.alt + '" fetchpriority="high"></div>',
  '<div class="feature-caption"><div><span class="eyebrow">PICK UP / ' + a.category + '</span><h2>' + a.headline + '</h2><p>' + a.name + ' <span>· ' + a.platform + '</span></p></div></div>',
  '</a>',
  '<!-- PICKUP:END -->'
].join('\n');
const path = new URL('index.html', root);
const html = readFileSync(path, 'utf8');
const pattern = /<!-- PICKUP:START -->[\s\S]*?<!-- PICKUP:END -->/g;
if ([...html.matchAll(pattern)].length !== 1) throw new Error('Expected exactly one PICK UP block');
const result = html.replace(pattern, () => block);
if (process.argv.includes('--check')) {
  if (result !== html) throw new Error('PICK UP is stale. Run node scripts/update-pickup.mjs');
  console.log('PICK UP is up to date: ' + app.name);
} else {
  writeFileSync(fileURLToPath(path), result);
  console.log('Updated PICK UP: ' + app.name);
}
