var http = require('http');
var path = require('path');
var Express = require('express');
var parser = require('body-parser');
var cors = require('cors');
var database = require('./database.js');

var router = Express();
router.use(parser.json());
router.use(parser.urlencoded({extended:true}));
router.use(cors());

//Setup webapges
router.use(Express.static(path.resolve(__dirname, 'client')));
// Include Additional ExpressJS routes created from seperate files in the routes directory
require('./routes')(router, database);

var server = http.createServer(router);
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
