// const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request!');
      }
      const fileStream = fs.createReadStream(filepath);
      fileStream.pipe(res);
      fileStream.on('error', (error) => {
        switch (error.code) {
          case 'ENOENT':
            res.statusCode = 404;
            res.end('File not found:(');
            break;
          default:
            res.statusCode = 500;
            res.end('Internal server error:/');
        }
      });
      fileStream.on('aborted', () => {
        fileStream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
