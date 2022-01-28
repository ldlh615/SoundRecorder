const http = require('http');
const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../demo/index.html');

const server = http.createServer((req, res) => {
  const pathname = req.url.split('?')[0].replace(/^\//, '');
  switch (pathname) {
    case '':
    case 'index.html': {
      htmlHandler(res);
      break;
    }
    case 'favicon.ico': {
      res.end();
      break;
    }
    default: {
      staticFileHandler(pathname, res);
    }
  }
});

function htmlHandler(res) {
  const rs = fs.createReadStream(htmlPath);
  rs.pipe(res);
}

function staticFileHandler(pathname, res) {
  const filePath = path.resolve(__dirname, '../dist', pathname);
  const rs = fs.createReadStream(filePath);
  rs.pipe(res);
}

server.listen(1234, () => {
  console.log('server started on http://localhost:1234');
});
