const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Require archiver (we will install it temporarily if it doesn't exist)
try {
  require.resolve('archiver');
} catch (e) {
  console.log('Instalando paquete archiver necesario para comprimir el proyecto...');
  execSync('npm install archiver --no-save', { stdio: 'inherit' });
}

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

  // 1. Añadir el contenido de .next/standalone en la raíz del ZIP
  console.log('Agregando el código servidor (standalone)...');
  archive.directory(path.join(__dirname, '.next', 'standalone'), false);

  // 2. Añadir la carpeta public
  console.log('Agregando las imágenes públicas...');
  archive.directory(path.join(__dirname, 'public'), 'public');

  // 3. Añadir la carpeta estática compilada de Next
  console.log('Agregando los archivos estáticos...');
  archive.directory(path.join(__dirname, '.next', 'static'), '.next/static');

  // 4. Añadir la base de datos y prisma
  console.log('Agregando la base de datos...');
  if (fs.existsSync(path.join(__dirname, 'dev.db'))) {
    archive.file(path.join(__dirname, 'dev.db'), { name: 'dev.db' });
  }
  archive.directory(path.join(__dirname, 'prisma'), 'prisma');
  
  // 5. Añadir las carpetas de subidas
  if (fs.existsSync(path.join(__dirname, 'public', 'uploads'))) {
    archive.directory(path.join(__dirname, 'public', 'uploads'), 'public/uploads');
  }

  await archive.finalize();
}

prepare();
