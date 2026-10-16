const fs = require('fs');
const path = require('path');

const name = process.env.APP_NAME || 'StockBill';
const brand = process.env.BRAND || '';

const required = ['index.html', 'sw.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
const missing = required.filter(f => !fs.existsSync(f));
if (missing.length) {
  console.error('Missing files in the repository root: ' + missing.join(', '));
  process.exit(1);
}

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');

required.forEach(f => fs.copyFileSync(f, path.join('dist', f)));

// Customer's own icons, if a brand folder exists (e.g. brand/sri/icon-192.png)
['icon-192.png', 'icon-512.png'].forEach(f => {
  const src = path.join('brand', brand, f);
  if (brand && fs.existsSync(src)) fs.copyFileSync(src, path.join('dist', f));
});

// Replace every visible "StockBill" in the app (browser tab, login heading, header fallback)
const html = fs.readFileSync('index.html', 'utf8').replace(/StockBill/g, name);
fs.writeFileSync(path.join('dist', 'index.html'), html);

// Customer's installed-app name
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
manifest.name = name;
manifest.short_name = name.slice(0, 12);
fs.writeFileSync(path.join('dist', 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

console.log('Built for: ' + name);
