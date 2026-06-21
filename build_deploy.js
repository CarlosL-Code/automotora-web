const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function prepareDeploy() {
  const deployDir = path.join(__dirname, 'deploy-ready');
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
  fs.mkdirSync(deployDir);

  console.log('Copiando archivos compilados del servidor (standalone)...');
  copyRecursiveSync(path.join(__dirname, '.next', 'standalone'), deployDir);

  console.log('Copiando carpeta public (imágenes, logos)...');
  copyRecursiveSync(path.join(__dirname, 'public'), path.join(deployDir, 'public'));

  console.log('Copiando archivos estáticos...');
  copyRecursiveSync(path.join(__dirname, '.next', 'static'), path.join(deployDir, '.next', 'static'));

  console.log('Copiando base de datos...');
  if (fs.existsSync(path.join(__dirname, 'dev.db'))) {
    fs.copyFileSync(path.join(__dirname, 'dev.db'), path.join(deployDir, 'dev.db'));
  }
  
  console.log('Copiando esquema de Prisma...');
  copyRecursiveSync(path.join(__dirname, 'prisma'), path.join(deployDir, 'prisma'));

  console.log('\n¡Listo! Tu carpeta "deploy-ready" está creada.');
  console.log('Solo tienes que darle clic derecho a esta carpeta en Windows, seleccionar "Comprimir en archivo ZIP" y subir ese archivo a Hostinger.');
}

prepareDeploy();
