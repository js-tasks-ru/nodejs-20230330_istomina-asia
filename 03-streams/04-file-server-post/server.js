// const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs');
const LimitSizeStream = require('./LimitSizeStream');


const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  req.on('error', (err) => console.log('ОШИБКА ЗАПРОСА', err.name));

  switch (req.method) {
    case 'POST':
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File already Exists');
      }
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Bad request!');
      }
      const limitedStream = new LimitSizeStream({
        limit: 1024 * 1024,
      });

      const fileStream = fs.createWriteStream(filepath);
      req.pipe(limitedStream).pipe(fileStream);

      limitedStream.on('end', () => {
        res.statusCode = 201;
        res.end('all data has been sent');
        return;
      });

      limitedStream.on('error', (err) => {
        limitedStream.destroy();
        fileStream.destroy();
        fileStream.on('close', () => {
          fs.rm(filepath);
        });
        res.statusCode = 413;
        res.end('Max size has been exceeded');
        return;
      });

      fileStream.on('error', (error) => {
        fileStream.destroy();
        limitedStream.destroy();
        fileStream.on('close', () => {
          fs.rm(filepath);
        });
        res.statusCode = 500;
        res.end('Internal server error:/');
      });
      fileStream.on('aborted', () => {
        limitedStream.destroy();
        fileStream.destroy();
        fileStream.on('close', () => {
          fs.rm(filepath);
        });
      });


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
