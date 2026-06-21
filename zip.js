const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

async function prepare() {
  console.log('Iniciando empaquetado del proyecto para Hostinger...');
  const outputZipPath = path.join(__dirname, 'deploy.zip');
  const output = fs.createWriteStream(outputZipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Compresión máxima
  });

  output.on('close', function() {
    console.log(`\n¡ÉXITO! Se ha creado el archivo 'deploy.zip' (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB).`);
    console.log('Este es el ÚNICO archivo que debes subir a Hostinger.');
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  console.log('Agregando el código servidor (standalone)...');
  archive.directory(path.join(__dirname, '.next', 'standalone'), false);

  console.log('Agregando las imágenes públicas...');
  archive.directory(path.join(__dirname, 'public'), 'public');

  console.log('Agregando los archivos estáticos...');
  archive.directory(path.join(__dirname, '.next', 'static'), '.next/static');

  console.log('Agregando la base de datos...');
  if (fs.existsSync(path.join(__dirname, 'dev.db'))) {
    archive.file(path.join(__dirname, 'dev.db'), { name: 'dev.db' });
  }
  archive.directory(path.join(__dirname, 'prisma'), 'prisma');

  await archive.finalize();
}

prepare();
