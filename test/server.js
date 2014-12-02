var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var IP = 'localhost';
var PORT = 3100;

app.get('/lib/data/pages/:pageId', function(req, res){
  res.writeHead(200, {"Content-Type": "application/json"});
  fs.createReadStream(path.join(process.cwd(), 'test/lib/data', req.params.pageId+'.json')).pipe(res);
});

app.use(express.static('dist'));
app.use(express.static('test'));
app.use(express.static('node_modules'));

app.listen(PORT, IP, console.log.bind(null, 'test server started at', IP+':'+PORT));
