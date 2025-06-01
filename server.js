// Start server by running `node server.js` in the terminal

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Server configuration
const PORT = 3000;
const ROOT_DIR = __dirname;

// Get user local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  let safePath = decodeURIComponent(req.url.split('?')[0]);
  if (safePath === '/') safePath = '/index.html'; // Default to index.html

  const filePath = path.join(ROOT_DIR, safePath);
  const ext = path.extname(filePath);

  // Error handling
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end('Access denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      return res.end('404 Not Found');
    }

    // Read file and respond
    const contentType = mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

// Start the server and print the local IP address
server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('Server running at:');
  console.log(`→ http://${ip}:${PORT}`);
});
