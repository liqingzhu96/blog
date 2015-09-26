function send404(res){
	res.writeHead(404,{"content-type":"text/html"});
	res.write("404 Not Found!");
	res.end();
}
function send502(res){
	res.writeHead(502,{"content-type":"text/html"});
	res.write("502 服务器出错！");
	res.end();
}
exports.send404=send404;
exports.send502=send502;