var connect = require('connect');

var app = connect();

var logger = function(req,res,next){
	console.log(req.method, req.url);

	next();

}

var hello = function(req, res, next){
	res.setHeader('Content-Type','text/plain');
	// res.write(next)
	res.end('Hello World');
}

var wow = function(req, res, next){
	res.setHeader('Content-Type','text/plain');
	// res.write(next)
	res.end('wow test');
}



app.use(logger);


app.use('/hello',hello);
app.use('/wow',wow);


app.listen(3000);

console.log("3000 localhost test");
