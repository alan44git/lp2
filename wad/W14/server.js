const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const dataFilePath = path.join(__dirname, 'users.json');
const publicDir = path.join(__dirname, 'public');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    fs.readFile(dataFilePath, 'utf8', (err, fileData) => {
      if (err) {
        sendJson(res, 500, { error: 'Could not read users file.' });
        return;
      }

      try {
        const users = JSON.parse(fileData);
        sendJson(res, 200, users);
      } catch (parseErr) {
        sendJson(res, 500, { error: 'Invalid JSON format in users file.' });
      }
    });
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    serveFile(res, path.join(publicDir, 'index.html'), 'text/html');
    return;
  }

  sendJson(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});