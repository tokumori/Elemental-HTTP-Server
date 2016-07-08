var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var public = './public';

var server = http.createServer(function (req, res) {
  var path = public + req.url;
  var method = req.method;
  var pathErr = fs.readFileSync(public + '/404.html', 'utf-8');
  var statusCode;
  var responseHeader = {};
  var responseBody;

  req.setEncoding('utf8');

  if (method === 'POST') {
    req.on('data', function (data) {
      var elemObj = querystring.parse(data);
      var elemPage =
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${elemObj.elementName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${elemObj.elementName}</h1>
  <h2>${elemObj.elementSymbol}</h2>
  <h3>Atomic number ${elemObj.elementAtomicNumber}</h3>
  <p>${elemObj.elementDescription}</p>
  <p><a href="/">back</a></p>
</body>
</html>`;
      fs.stat(path + '.html', function (err, stats) {
        if (err) {
          fs.writeFile(`${public + '/' + req.url}.html`, elemPage, function (err) {
            if (err) throw err;
          });
          statusCode = 200;
          responseBody = JSON.stringify({success : true});
          responseHeader = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(responseBody)
          };
        } else {
          statusCode = 400;
          responseBody = 'Page already exists.';
        }
        res.writeHead(statusCode, responseHeader);
        res.write(responseBody);
        res.end();
      });
    });
  }
  if (method === 'GET') {
    if (path === (public + '/')) {
      path = public + '/index.html';
    }
    fs.readFile(path, 'utf-8', function (err, data) {
      if (err) {
        statusCode = 404;
        responseBody = pathErr;
      } else {
        statusCode = 200;
        responseBody = data;
      }
      res.writeHead(statusCode);
      res.write(responseBody);
      res.end();
    });
  }
});

server.listen(8080);