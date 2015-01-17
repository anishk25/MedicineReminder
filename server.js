var express = require('express');
var body_parser = require('body-parser');
var routes = require('./routes.js');

var app = express();
var port = process.env.PORT||8080;

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});

// app router
routes(app);
app.listen(port);
console.log('The App is running on port ' + port);