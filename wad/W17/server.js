const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const dataFilePath = path.join(__dirname, 'employees.json');
const publicDir = path.join(__dirname, 'public');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/employees' && req.method === 'GET') {
    fs.readFile(dataFilePath, 'utf8', (err, fileData) => {
      if (err) {
        sendJson(res, 500, { error: 'Could not read employee data.' });
        return;
      }

      try {
        const employees = JSON.parse(fileData);
        sendJson(res, 200, employees);
      } catch {
        sendJson(res, 500, { error: 'Employee data JSON is invalid.' });
      }
    });
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    serveStaticFile(res, path.join(publicDir, 'index.html'), 'text/html');
    return;
  }

  if (req.url === '/styles.css' && req.method === 'GET') {
    serveStaticFile(res, path.join(publicDir, 'styles.css'), 'text/css');
    return;
  }

  if (req.url === '/script.js' && req.method === 'GET') {
    serveStaticFile(res, path.join(publicDir, 'script.js'), 'application/javascript');
    return;
  }

  sendJson(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Employee Directory server running at http://localhost:${PORT}`);
});