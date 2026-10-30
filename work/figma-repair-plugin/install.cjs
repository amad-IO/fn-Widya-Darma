// Install into a dedicated plugin folder created by Figma, preserving its ID.
const fs = require('node:fs');
const path = require('node:path');
const selected = process.argv[2];
if (!selected) throw new Error('Berikan lokasi manifest.json plugin Widya Darma Desktop.');
const manifestPath = path.resolve(selected);
if (path.basename(manifestPath).toLowerCase() !== 'manifest.json') {
  throw new Error('Target harus manifest.json yang dibuat Figma.');
}
const before = fs.readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(before);
if (manifest.name !== 'Widya Darma Desktop' || typeof manifest.id !== 'string' || !manifest.id) {
  throw new Error('Nama plugin harus Widya Darma Desktop dan memiliki ID dari Figma.');
}
const directory = path.dirname(manifestPath);
const manifestBackup = path.join(directory, 'manifest-before-repair.json');
if (!fs.existsSync(manifestBackup)) fs.writeFileSync(manifestBackup, before);
const mainPath = path.join(directory, 'code.js');
const codeBackup = path.join(directory, 'code-before-repair.js');
if (fs.existsSync(mainPath) && !fs.existsSync(codeBackup)) fs.copyFileSync(mainPath, codeBackup);
fs.copyFileSync(path.join(__dirname, 'code.js'), mainPath);
manifest.api = '1.0.0';
manifest.main = 'code.js';
manifest.editorType = ['figma'];
manifest.documentAccess = 'dynamic-page';
manifest.networkAccess = { allowedDomains: ['none'] };
delete manifest.ui;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Plugin siap dijalankan di Figma; ID dipertahankan dan template dicadangkan.');
