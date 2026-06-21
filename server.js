const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false; // Siempre producción en Hostinger
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log(`[HMC Motors] Iniciando servidor en puerto ${port}...`);
console.log(`[HMC Motors] NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`[HMC Motors] DATABASE_URL: ${process.env.DATABASE_URL}`);

app.prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('[HMC Motors] Error handling request:', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, hostname, (err) => {
      if (err) throw err;
      console.log(`[HMC Motors] ✓ Servidor listo en http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error('[HMC Motors] ✗ Error fatal al iniciar:', err);
    process.exit(1);
  });
