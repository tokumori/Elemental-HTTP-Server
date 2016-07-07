var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var public = './public';

var server = http.createServer(function (req, res) {
  var path = public + req.url;
  if (path === (public + '/')) {
    path = public + '/index.html';
  }
  fs.readFile(path, 'utf-8', function (err, data) {
    if (err) {
      fs.readFile(public + '/404.html', 'utf-8', function (err, data) {
        res.statusCode = 404;
        res.write(data);
        res.end();
      });
    } else {
      res.write(data);
      res.end();
    }
  });
});

server.listen(8080);