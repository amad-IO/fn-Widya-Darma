const fs = require('node:fs');
const path = require('node:path');
const assets = {};
for (const name of ['portrait', 'students', 'campus', 'classroom', 'library']) {
  const source = path.resolve(__dirname, '../../public/images', name + '.jpg');
  assets[name] = fs.readFileSync(source).toString('base64');
}
fs.writeFileSync(path.join(__dirname, 'code.js'),
  'const ASSETS = ' + JSON.stringify(assets) + ';\n' +
  fs.readFileSync(path.join(__dirname, 'repair.js'), 'utf8'));
console.log('code.js siap; lima foto asli disertakan.');
