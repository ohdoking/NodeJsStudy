var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers"); 

var PORT = "8888";

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;


server.start(PORT, router.route, handle);