/**
 * AppzPlay — Servidor Node.js Nativo Ultraligero
 * - Cero dependencias externas (Cero npm install, arranca en 20ms)
 * - Sirve la Landing Page pública en /
 * - Sirve el Dashboard Administrativo en /admin
 * - API REST para lectura y guardado dinámico de contenidos
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 80;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'appzplay2026';
const DATA_FILE = path.join(__dirname, 'data', 'content.json');

// Tokens de sesión en memoria
const activeSessions = new Set();

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Cargar o inicializar content.json
function getContentData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error leyendo content.json:', err.message);
  }
  return {};
}

// Guardar content.json de forma segura
function saveContentData(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Servir archivo estático
function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 No Encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('500 Error de Servidor');
      }
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=86400'
    });
    res.end(content);
  });
}

// Servidor HTTP
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // 1. API: Login de Administrador
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { password } = JSON.parse(body || '{}');
        if (password === ADMIN_PASSWORD) {
          const token = crypto.randomBytes(32).toString('hex');
          activeSessions.add(token);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, token }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Contraseña incorrecta' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'JSON inválido' }));
      }
    });
    return;
  }

  // 2. API: Obtener Contenido Público
  if (pathname === '/api/content' && req.method === 'GET') {
    const data = getContentData();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify(data));
    return;
  }

  // 3. API: Guardar Contenido (Protegido)
  if (pathname === '/api/content' && req.method === 'POST') {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/, '').trim();

    if (!activeSessions.has(token) && token !== ADMIN_PASSWORD) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'No autorizado. Inicie sesión.' }));
      return;
    }

    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const newData = JSON.parse(body);
        if (!newData || typeof newData !== 'object') {
          throw new Error('Datos inválidos');
        }
        saveContentData(newData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Contenido guardado exitosamente' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Error procesando JSON: ' + err.message }));
      }
    });
    return;
  }

  // 4. Ruta: /admin -> Servir admin.html
  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin.html') {
    const adminPath = path.join(__dirname, 'admin.html');
    serveStaticFile(res, adminPath, 'text/html; charset=UTF-8');
    return;
  }

  // 4.1 Rutas Legales
  if (pathname === '/privacidad' || pathname === '/privacidad.html') {
    serveStaticFile(res, path.join(__dirname, 'privacidad.html'), 'text/html; charset=UTF-8');
    return;
  }
  if (pathname === '/terminos' || pathname === '/terminos.html') {
    serveStaticFile(res, path.join(__dirname, 'terminos.html'), 'text/html; charset=UTF-8');
    return;
  }

  // 5. Archivos Estáticos Públicos
  let safePath = pathname === '/' ? '/index.html' : pathname;
  safePath = path.normalize(safePath).replace(/^(\.\.[\/\\])+/, '');
  const fullPath = path.join(__dirname, safePath);
  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  serveStaticFile(res, fullPath, contentType);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Servidor AppzPlay activo en http://0.0.0.0:${PORT}`);
  console.log(`👉 Landing Page pública: http://localhost:${PORT}/`);
  console.log(`👉 Dashboard Administrador: http://localhost:${PORT}/admin`);
});
