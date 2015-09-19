var http=require('http');
var url=require('url');
var route=require('./route');
http.createServer(function(req,res){
	var pathname=url.parse(req.url).pathname;
	route(pathname,res);
}).listen(3000);
console.log("running at 3000");