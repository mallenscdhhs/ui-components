var express = require('express');
var app = express();

app.use(express.static('dist'));
app.use(express.static('test'));
app.use(express.static('node_modules'));

app.listen(3000, console.log.bind(null, 'test server started...'));
