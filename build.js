const fs = require('fs');
const path = require('path');

const name = process.env.APP_NAME || 'StockBill';
const brand = process.env.BRAND || '';          // optional folder with a customer's icons

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');

// Copy the app files
['index.html', 'sw.js', 'icon-192.png', 'icon-512.png'].forEach(f => fs.copyFileSync(f, path.join('dist', f)));

// Use the customer's own icons if a brand folder exists, e.g. brand/sri/icon-192.png
['icon-192.png', 'icon-512.png'].forEach(f => {
  const src = path.join('brand', brand, f);
  if (brand && fs.existsSync(src)) fs.copyFileSync(src, path.join('dist', f));
});

// Set the page title for this customer
const html = fs.readFileSync('index.html', 'utf8').replace(/<title>[^<]*<\/title>/, `<title>${name}</title>`);
fs.writeFileSync(path.join('dist', 'index.html'), html);

// Set the installed-app name for this customer
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
manifest.name = name;
manifest.short_name = name.slice(0, 12);
fs.writeFileSync(path.join('dist', 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

console.log('Built for:', name);
