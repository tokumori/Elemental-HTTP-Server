var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var public = './public';

var server = http.createServer(function (req, res) {
  var path = public + req.url;
  var method = req.method;
  req.setEncoding('utf8');

  if (req.url === '/elements') {
    req.on('data', function (data) {
      var elemObj = querystring.parse(data);
      var elemPage =
      `<!DOCTYPE html>\r
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
      fs.writeFile(`${public + '/' + elemObj.elementName}.html`, elemPage, function (err) {
        if (err) throw err;
        console.log('Woot');
      });
  });
  }
  if (path === (public + '/')) {
    path = public + '/index.html';
  }
  // fs.readFile(path, 'utf-8', function (err, data) {
  //   if (err) {
  //     fs.readFile(public + '/404.html', 'utf-8', function (err, data) {
  //       res.statusCode = 404;
  //       res.write(data);
  //       res.end();
  //     });
  //   } else {
  //     res.write(data);
  //     res.end();
  //   }
  // });
});

server.listen(8080);