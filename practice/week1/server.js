// express web server 
const express = require('express'); // require is grabbing from node modules, it allows us to use express on this page
const app = express(); // the object app now has the functionallity of express
const controller = require('./routes/controllers');

app.use('/', require('./routes/paths'));
const port = process.env.port || 3000;

app.listen(port);
console.log('Web server at port: ' + port);

