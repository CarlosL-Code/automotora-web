const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

console.log('Empaquetando con permisos limpios (adm-zip)...');

const zip = new AdmZip();

// Carpetas
zip.addLocalFolder(path.join(__dirname, 'src'), 'src');
zip.addLocalFolder(path.join(__dirname, 'public'), 'public');
zip.addLocalFolder(path.join(__dirname, 'prisma'), 'prisma');

// Archivos sueltos
const files = ['package.json', 'package-lock.json', 'next.config.mjs', 'dev.db', '.env', 'jsconfig.json'];
files.forEach(f => {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    zip.addLocalFile(p);
  }
});

zip.writeZip(path.join(__dirname, 'codigo-fuente-limpio.zip'));

console.log('¡Listo! Creado "codigo-fuente-limpio.zip".');
