//process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = process.argv[2] || 'development';

var express = require('./config/express');
var app = express();

app.listen(3000);

module.exports = app;

console.log("server localhost:3000");