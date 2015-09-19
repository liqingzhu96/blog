var jade=require('jade');
function index(res){
	res.writeHead(200,{"content-type":"text/html"});
	var html=jade.renderFile('../jade/index.jade');
	res.write(html);
	res.end();
}
function eat(res){
	res.writeHead(200,{"content-type":"text/html"});
	res.end('eat');
}
exports.index=index;
exports.eat=eat;