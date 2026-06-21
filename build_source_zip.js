const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

async function packSource() {
  console.log('Preparando el código fuente para el sistema automático de Hostinger...');
  
  const outputZipPath = path.join(__dirname, 'codigo-fuente.zip');
  const output = fs.createWriteStream(outputZipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', function() {
    console.log(`\n¡ÉXITO! Se ha creado el archivo 'codigo-fuente.zip' (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB).`);
    console.log('Sube este archivo a la pantalla de Hostinger que me mostraste.');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  // Carpetas a incluir
  archive.directory(path.join(__dirname, 'src'), 'src');
  archive.directory(path.join(__dirname, 'public'), 'public');
  archive.directory(path.join(__dirname, 'prisma'), 'prisma');

  // Archivos individuales
  const filesToInclude = [
    'package.json',
    'package-lock.json',
    'next.config.mjs',
    'jsconfig.json',
    'dev.db',
    '.env'
  ];

  filesToInclude.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: file });
    }
  });

  await archive.finalize();
}

packSource();
