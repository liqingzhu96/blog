var action=require('./action');
var openFile=require('./openFile');
var type=require('./type');
function route(pathname,res){
	var path=pathname.match(/\/(\w+)\//);
	if(path&&(path[1]=="css"||path[1]=="js"||path[1]=="image")){
		var houzhuiming=pathname.match(/\.([\w+])/);
		if(houzhuiming&&houzhuiming[1])
		{openFile(pathname,type[houzhuiming],res);}
		else{
			res.writeHead(404,{"content-type":"text/html"});
			res.end('<h1>404 not found</h1>');
		}
	}
	else
	{
		var urlPath=pathname.replace(/\//,"").replace(/\//g,"_");
		if(urlPath===""){
			action['index'](res);
		}
		else{
			if(typeof action[urlPath]==="function"){
				action[urlPath](res);
			}
			else{
				res.writeHead(404,{"content-type":"text/html"});
				res.end('<h1>404 not found</h1>');
			}
		}
	}
}
module.exports=route;